import { PerfilEnum, EstadoJuegoEnum } from './Enums.js';
import { ConfigPerfil } from './ConfigPerfil.js';
import { TarjetaCredito } from './TarjetaCredito.js';
import { Jugador } from './Jugador.js';
import { GastoBasico, GastoGusto, GastoSorpresa, GastoRecurrente } from './Gasto.js';

import { Batalla } from './Batalla.js';
import { GeneradorAleatorio } from './GeneradorAleatorio.js';
import { GestorSinergias } from './GestorSinergias.js';

export class MotorJuego {
    constructor(vista) {
        this.vista = vista;
        this.jugador = null; //Se determina luego por el usuario
        this.config = null; //Se determina luego por el usuario
        this.stageActual = 1; //Mes
        this.semanaActual = 1; //Semana
        this.estadoJuego = EstadoJuegoEnum.EN_CURSO; //Estado del juego

        this.gastosSemana = []; // logs
        this.mensajesRetroalimentacion = [];
    }

    async inicializarJugador(perfilEnum) {
        //Se extrae el perfil seleccionado del enum y se guarda en this.config
        this.config = ConfigPerfil.get(perfilEnum);


        //Se define el ingreso inicial dependiendo del perfil seleccionado
        let ingresoInicial;
        if (perfilEnum === PerfilEnum.ESPORADICO) { //Si es esporádico, se toma su valor del config
            ingresoInicial = this.config.ingresoStage1;
        } else if (perfilEnum === PerfilEnum.TRABAJADOR) { //Si es trabajador, se toma un valor aleatorio entre el min y max del config
            ingresoInicial = GeneradorAleatorio.randomBetween(this.config.ingresoMin, this.config.ingresoMax);
        } else {
            // Los demás perfiles tienen ingresos fijos iniciales
            ingresoInicial = this.config.ingresoFijo;
        }

        //Se genera el límite inicial aleatoriamente dependiendo del perfil seleccionado
        const limiteInicial = GeneradorAleatorio.generarLimiteInicial(this.config);
        //Se crea la tarjeta de crédito con el límite inicial y la configuración del perfil
        const tarjeta = new TarjetaCredito(limiteInicial, this.config);

        this.jugador = new Jugador(perfilEnum, ingresoInicial, tarjeta);

        this.actualizarUIHeaders();

        /*Esta línea le avisa a la interfaz que ya quedó listo el personaje
        El comportamiento del método podría cambiar para posterior integración con React
        */
        this.vista.mostrarInicializacion(perfilEnum, ingresoInicial, limiteInicial, this.config.tasaInteresAnual); //React
        await this.vista.sleep(1000);
    }

    /*
    Método para actualizar todas las stats del jugador y tarjeta
    luego de enfrentar algún gasto
    Se pueden quitar y agregar según cambie la interfaz
    */
    actualizarUIHeaders() { //React
        if (!this.jugador) return;
        const hp = this.jugador.calcularHP();
        const pagoNoIntereses = this.jugador.tarjeta.saldoInsoluto + (this.jugador.tarjeta.interesesGenerados * 1.16);

        this.vista.actualizarHeaders({
            hp: hp,
            saldoInsoluto: this.jugador.tarjeta.saldoInsoluto,
            limiteCredito: this.jugador.tarjeta.limiteCredito,
            efectivoDisponible: this.jugador.efectivoDisponible,
            stageActual: this.stageActual,
            semanaActual: this.semanaActual
        });
    }

    async evaluarGameOver() {
        if (this.jugador.calcularHP() <= 0) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            this.vista.mostrarGameOverPorHP(); //react
            return true;
        }
        return false;
    }

    async iniciarJuego(perfilEnum) {
        await this.inicializarJugador(perfilEnum);
        this.stageActual = 1;

        while (this.stageActual <= 6 && this.estadoJuego === EstadoJuegoEnum.EN_CURSO) {
            await this.iniciarStage();
            if (this.estadoJuego === EstadoJuegoEnum.GAME_OVER) break;

            // Fin de stage
            this.vista.mostrarFinStage(this.stageActual);
            this.jugador.tarjeta.generarIntereses(); // Se generan intereses de lo que quedó de saldo

            // Evaluar score
            const usoCredito = this.jugador.tarjeta.saldoInsoluto / this.jugador.tarjeta.limiteCredito;
            if (usoCredito < 0.60) {
                this.jugador.modificarScore(5);
                this.vista.mostrarCambioScore('Score: Buen uso del crédito (< 60%). +5 pts', 'info', this.jugador.scoreCrediticio);
                this.mensajesRetroalimentacion.push('+5 pts: Buen uso del crédito (< 60%) al cierre del mes.');
            } else if (usoCredito >= 0.90) {
                this.jugador.modificarScore(-5);
                this.vista.mostrarCambioScore('Score: Uso excesivo del límite (>= 90%). -5 pts', 'warning', this.jugador.scoreCrediticio);
                this.mensajesRetroalimentacion.push('-5 pts: Uso excesivo del límite (>= 90%) al cierre del mes.');
            }

            // Reiniciar el tracker de abonos para la tarjeta de crédito en el nuevo ciclo
            this.jugador.tarjeta.reiniciarCicloDePago();
            
            if (this.stageActual === 6) {
                // Forzar un pago voluntario final al terminar el último stage
                this.vista.mostrarNotificacionVentanaPagoInmediata();
                await this.realizarAbonoVoluntarioTDC();
            }

            this.stageActual++;
            await this.vista.sleep(1500);
        }

        if (this.estadoJuego !== EstadoJuegoEnum.GAME_OVER) {
            this.estadoJuego = EstadoJuegoEnum.COMPLETADO;
            this.vista.mostrarVictoria(this.jugador.calcularHP(), this.jugador.scoreCrediticio);
        }
    }

    async iniciarStage() {
        this.recurrentesStage = []; // Reiniciamos el registro de recurrentes mensuales

        // Ingreso por inicio de mes (Para esporádico o normal se reinicia efectivo)
        // Sólo afecta a los stages después del primero
        // En stage 1 el jugador se inicializó ya
        if (this.stageActual > 1) {
            let nuevoIngreso;
            if (this.config.perfil === PerfilEnum.ESPORADICO) { //Esporadico
                nuevoIngreso = GeneradorAleatorio.generarIngresoEsporadico(this.config);
                this.vista.mostrarIngresoNuevoMes(true, nuevoIngreso); //React
            } else { //Trabajador, Dependiente e Independiente mantienen el del stage 1
                nuevoIngreso = this.jugador.ingresoMensual;
                this.vista.mostrarIngresoNuevoMes(false, nuevoIngreso); //React
            }
            this.jugador.actualizarIngreso(nuevoIngreso);
            this.actualizarUIHeaders(); //Actualiza el ingreso del jugador en la UI - React
        }

        for (this.semanaActual = 1; this.semanaActual <= 4; this.semanaActual++) {
            this.actualizarUIHeaders();
            this.vista.mostrarInicioSemana(this.stageActual, this.semanaActual); //React

            // Genera la pool de gastos de la semana actual
            this.poolGastosSemana = GeneradorAleatorio.generarOleadaSemanal(this.config, this.semanaActual, this.recurrentesStage);
            
            // Mientras no se avance de semana
            while (true) {
                if (this.semanaActual === 2 && this.poolGastosSemana.length === 1 && (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0)) {
                    this.vista.mostrarAdvertenciaUltimoDia();
                }

                //Espera a que el jugador elija un destino en el mapa
                const destino = await this.vista.mostrarSelectorLocalizaciones(this.poolGastosSemana);
                
                if (destino === 'p') {
                    await this.realizarAbonoVoluntarioTDC();
                    continue;
                }

                if (destino === 'a') {
                    const obligatorios = this.poolGastosSemana.filter(g => g.esObligatorio);
                    if (obligatorios.length > 0) {
                        this.vista.consola.print(`\n⚠️ ¡ESPERA! Olvidaste encargos OBLIGATORIOS. Tienes que salir de urgencia a comprarlos.`, 'warning');
                        
                        const esTaxi = Math.random() < 0.20;
                        const viaje = GeneradorAleatorio.generarGastoAleatorio(this.config.perfil, "Básico", GastoBasico, null) || new GastoBasico({nombre: 'Viaje genérico', categoria: 'Básico', monto: 15, aceptaMSI: false, aceptaTDC: false});
                        
                        viaje.nombre = esTaxi ? "Taxi de Urgencia (¡Ya van a cerrar!)" : "Transporte de Urgencia";
                        viaje.monto = esTaxi ? 100 : 15;
                        viaje.opcionesCompra = { 'Urgencia Final': { modMonto: 1.0 } };
                        this.poolGastosSemana.push(viaje);

                        obligatorios.forEach(g => {
                            // Al forzarlo, sobreescribimos para que sólo aparezca en la Urgencia Final
                            g.opcionesCompra = { 'Urgencia Final': { modMonto: 1.0 } };
                        });

                        const batallaUrgencia = new Batalla('Urgencia Final', this.poolGastosSemana, this.config);
                        await this.procesarBatalla(batallaUrgencia);
                        continue;
                    }

                    break; // Avanzar el tiempo si ya no hay obligatorios
                }

                // Generamos la batalla instanciada para ese lugar
                const batalla = new Batalla(destino, this.poolGastosSemana, this.config);
                await this.procesarBatalla(batalla);

                this.actualizarUIHeaders();
                if (await this.evaluarGameOver()) return;
            }
            
            // Revisión silenciosa del pago mínimo al final de la semana 2
            if (this.semanaActual === 2) {
                const tarjeta = this.jugador.tarjeta;
                const pagoMinimo = tarjeta.calcularPagoMinimo();
                if (pagoMinimo > 0 && !tarjeta.evaluarSiCumplioPagoMinimo(pagoMinimo)) {
                    const cargo = tarjeta.aplicarCargoTardio();
                    this.vista.mostrarResolucionExpiracion(cargo);
                    this.jugador.modificarScore(-20);
                    this.vista.mostrarCambioScore('Penalización por no cubrir pago mínimo a tiempo. -20 pts', 'warning', this.jugador.scoreCrediticio);
                    this.mensajesRetroalimentacion.push('-20 pts: No cubriste el pago mínimo a tiempo en la semana 2.');
                }
            }

            // Preguntar si terminar el juego en cualquier momento
            const estadoResumen = {
                hp: this.jugador.calcularHP(),
                score: this.jugador.scoreCrediticio,
                pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
                ingresoMensual: this.jugador.ingresoMensual,
                retroalimentacion: [...this.mensajesRetroalimentacion]
            };
            const salir = await this.vista.confirmarAvance(estadoResumen);
            this.mensajesRetroalimentacion = []; // Se limpia tras mostrar resúmen

            if (salir === 'salir') {
                this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
                this.vista.mostrarCancelacionUsuario();
                return;
            }
        }
    }

    async realizarAbonoVoluntarioTDC() {
        const tarjeta = this.jugador.tarjeta;
        const pagoMinimo = tarjeta.calcularPagoMinimo();
        const deudaTotal = tarjeta.saldoInsoluto + tarjeta.interesesGenerados * 1.16;

        const estadoTarjeta = {
            limiteCredito: tarjeta.limiteCredito,
            creditoDisponible: tarjeta.creditoDisponible,
            saldoInsoluto: tarjeta.saldoInsoluto,
            pagoMinimo: pagoMinimo,
            deudaTotal: deudaTotal,
            efectivoDisponible: this.jugador.efectivoDisponible
        };

        const eleccion = await this.vista.mostrarMenuAbonoTDC(estadoTarjeta);

        if (eleccion.tipo === 'MINIMO') {
            this.jugador.pagarDeudaTDC(pagoMinimo);
            this.vista.mostrarResolucionPagoMinimo();
            this.jugador.modificarScore(0);
            this.mensajesRetroalimentacion.push('Pagaste solo el mínimo de crédito (0 pts, pero genera intereses).');
            this.evaluarAumentoLinea();
        } else if (eleccion.tipo === 'TOTAL') {
            this.jugador.pagarDeudaTDC(deudaTotal);
            const puntos = this.semanaActual === 1 ? 10 : 5; 
            this.vista.mostrarResolucionPagoTotal();
            this.jugador.modificarScore(puntos);
            this.vista.mostrarCambioScore(`Score: Pago total de deuda. +${puntos} pts`, 'info', this.jugador.scoreCrediticio);
            this.mensajesRetroalimentacion.push(`+${puntos} pts: Liquidaste el total de cuenta crédito.`);
            this.evaluarAumentoLinea();
        } else if (eleccion.tipo === 'PARCIAL') {
            this.jugador.pagarDeudaTDC(eleccion.monto);
            this.vista.mostrarResolucionPagoParcial(eleccion.monto);
            this.mensajesRetroalimentacion.push(`Abono parcial de $${eleccion.monto.toFixed(2)} a TDC.`);
            // No sumamos score inmediatamente, hasta que termine el mes a ver si cubrió el mínimo
            this.evaluarAumentoLinea();
        } else if (eleccion.tipo === 'CANCELAR') {
            // Canceló el depósito voluntario
            return;
        }
        this.actualizarUIHeaders();
    }

    evaluarAumentoLinea() {
        const nuevoLimite = GeneradorAleatorio.evaluarAumentoLinea(this.jugador.scoreCrediticio, this.jugador.tarjeta.limiteCredito);
        if (nuevoLimite) {
            const diferenciaLimites = nuevoLimite - this.jugador.tarjeta.limiteCredito;
            //Le muestra al usuario cuanto subio su linea
            this.vista.mostrarAumentoLinea(this.jugador.tarjeta.limiteCredito, nuevoLimite); //React
            this.jugador.tarjeta.limiteCredito = nuevoLimite;
            this.jugador.tarjeta.creditoDisponible += diferenciaLimites;
            this.mensajesRetroalimentacion.push(`¡Tu límite de crédito aumentó a $${nuevoLimite.toFixed(2)}!`);
        }
    }

    async procesarBatalla(batalla) {
        this.vista.consola.print(`\n🚀 LLEGANDO A: ${batalla.localizacion.toUpperCase()}`, 'system');
        
        while (batalla.gastos.length > 0) {
            const estadoVirtual = {
                efectivoDisponible: this.jugador.efectivoDisponible,
                creditoDisponible: this.jugador.tarjeta.creditoDisponible
            };

            const opt = await this.vista.mostrarMenuBatalla(batalla, estadoVirtual);

            if (opt === 'x') {
                break; // Salir de la batalla al mapa
            }

            if (opt === 't') { // TODO Tarjeta
                const monto = batalla.totalSinPagar;
                this.jugador.comprarConTDC(monto);
                this.vista.mostrarResolucionGastoCredito();
                
                // Limpiar gastos comprados
                [...batalla.gastos].forEach(g => batalla.eliminarDePool(g));
                break; 
            }

            if (opt === 'e') { // TODO Efectivo
                const base = batalla.totalSinPagar;
                let finalMonto = 0;
                [...batalla.gastos].forEach(g => {
                    let descFrac = g.descuentoEfectivo || 0;
                    let descFijo = g.descuentoFijoEfectivo || 0;
                    finalMonto += Math.max(0, g.montoModificado * (1 - descFrac) - descFijo);
                });
                this.jugador.pagarConDebito(finalMonto);
                this.vista.mostrarResolucionGastoDebito();
                
                [...batalla.gastos].forEach(g => batalla.eliminarDePool(g));
                break; 
            }

            // opt es un numero
            let gastoSeleccionado = batalla.gastos[opt];
            await this.procesarGastoIndividual(gastoSeleccionado, batalla); 
        }
    }

    async procesarGastoIndividual(gasto, batallaContext = null) {
        const estadoVirtual = {
            efectivoDisponible: this.jugador.efectivoDisponible,
            creditoDisponible: this.jugador.tarjeta.creditoDisponible
        };
        const puedeIgnorar = (gasto instanceof GastoGusto);
        const tieneDeuda = (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0);

        const decision = await this.vista.mostrarMenuGasto(gasto, estadoVirtual, puedeIgnorar, tieneDeuda);

        if (decision === null) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            this.vista.mostrarGameOverInsolvencia();
            return;
        }

        let resuelto = true;
        let montoActivo = gasto.montoModificado !== undefined ? gasto.montoModificado : gasto.monto;

        if (decision === 'd') {
            let descFrac = (batallaContext && gasto.descuentoEfectivo) ? gasto.descuentoEfectivo : 0;
            let finalMonto = montoActivo * (1 - descFrac);

            if (batallaContext && gasto.descuentoFijoEfectivo && gasto.descuentoFijoEfectivo > 0) {
                finalMonto -= gasto.descuentoFijoEfectivo;
                gasto.descuentoFijoEfectivo = 0; // Se consumió el bono fijo
            }
            
            finalMonto = Math.max(0, finalMonto);

            this.jugador.pagarConDebito(finalMonto);
            this.vista.mostrarResolucionGastoDebito();
        } else if (decision === 't') {
            this.jugador.comprarConTDC(montoActivo);
            this.vista.mostrarResolucionGastoCredito();
        } else if (decision === 'i') {
            gasto.ignorar();
            this.vista.mostrarResolucionGastoIgnorado();
        } else {
            resuelto = false;
        }

        if (resuelto && batallaContext) {
            batallaContext.eliminarDePool(gasto);
        } else if (resuelto && !batallaContext) {
            const idx = this.poolGastosSemana.indexOf(gasto);
            if (idx > -1) this.poolGastosSemana.splice(idx, 1);
        }
    }
}
