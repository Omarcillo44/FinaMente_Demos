import { PerfilEnum, EstadoJuegoEnum } from './Enums.js';
import { ConfigPerfil } from './ConfigPerfil.js';
import { TarjetaCredito } from './TarjetaCredito.js';
import { Jugador } from './Jugador.js';
import { GeneradorAleatorio } from './GeneradorAleatorio.js';
import { GastoGusto } from './Gasto.js';

export class MotorJuego {
    constructor(vista) {
        this.vista = vista;
        this.jugador = null; //Se determina luego por el usuario
        this.config = null; //Se determina luego por el usuario
        this.stageActual = 1; //Mes
        this.semanaActual = 1; //Semana
        this.estadoJuego = EstadoJuegoEnum.EN_CURSO; //Estado del juego

        this.gastosSemana = []; // logs
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
            pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
            pagoNoIntereses: pagoNoIntereses,
            saldoInsoluto: this.jugador.tarjeta.saldoInsoluto,
            limiteCredito: this.jugador.tarjeta.limiteCredito,
            scoreCrediticio: this.jugador.scoreCrediticio,
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
            } else if (usoCredito >= 0.90) {
                this.jugador.modificarScore(-5);
                this.vista.mostrarCambioScore('Score: Uso excesivo del límite (>= 90%). -5 pts', 'warning', this.jugador.scoreCrediticio);
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
        // Sólo afecta a los stages después del primero
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

            // Genera los gastos de la semana actual
            this.gastosSemana = GeneradorAleatorio.generarOleadaSemanal(this.config, this.semanaActual);

            // Mientras queden gastos por enfrentar
            while (this.gastosSemana.length > 0) {
                // Advertencia de último gasto antes de la fecha límite
                if (this.semanaActual === 2 && this.gastosSemana.length === 1 && (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0)) {
                    this.vista.mostrarAdvertenciaUltimoDia();
                }

                //Espera a que el jugador elija un gasto para enfrentarlo
                const indexElegido = await this.vista.mostrarSelectorGastos(this.gastosSemana);
                //Se obtiene el gasto elegido
                const gasto = this.gastosSemana[indexElegido];

                //Se procesa el gasto
                await this.procesarGasto(gasto);
                this.actualizarUIHeaders(); //Se actualizan todos los montos
                if (await this.evaluarGameOver()) return; // Checa si puede continuar después de procesar el gasto

                this.gastosSemana.splice(indexElegido, 1); //Se elimina el gasto de la lista
            }

            // Revisión silenciosa del pago mínimo al final de la semana 2
            if (this.semanaActual === 2) {
                const tarjeta = this.jugador.tarjeta;
                const pagoMinimo = tarjeta.calcularPagoMinimo();
                if (pagoMinimo > 0 && !tarjeta.evaluarSiCumplioPagoMinimo(pagoMinimo)) {
                    const cargo = tarjeta.aplicarCargoTardio();
                    this.vista.mostrarResolucionExpiracion(cargo);
                    this.jugador.modificarScore(-20);
                    this.vista.mostrarCambioScore(null, null, this.jugador.scoreCrediticio);
                }
            }

            // Preguntar si terminar el juego en cualquier momento
            const salir = await this.vista.confirmarAvance();
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

        if (deudaTotal > 0) {
            const estadoTarjeta = {
                limiteCredito: tarjeta.limiteCredito,
                creditoDisponible: tarjeta.creditoDisponible,
                saldoInsoluto: tarjeta.saldoInsoluto,
                pagoMinimo: pagoMinimo,
                deudaTotal: deudaTotal,
                efectivoDisponible: this.jugador.efectivoDisponible
            };

            const eleccion = await this.vista.mostrarMenuAbonoTDC(estadoTarjeta);

            if (eleccion === '1') {
                this.jugador.pagarDeudaTDC(pagoMinimo);
                this.vista.mostrarResolucionPagoMinimo();
                this.jugador.modificarScore(0);
                this.evaluarAumentoLinea();
            } else if (eleccion === '2') {
                this.jugador.pagarDeudaTDC(deudaTotal);
                const puntos = this.semanaActual === 1 ? 10 : 5; 
                this.vista.mostrarResolucionPagoTotal();
                this.jugador.modificarScore(puntos);
                this.vista.mostrarCambioScore(null, null, this.jugador.scoreCrediticio);
                this.evaluarAumentoLinea();
            } else if (eleccion === '3') {
                // Canceló el depósito voluntario
                return;
            }
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
        }
    }

    async procesarGasto(gasto) {
        const estadoVirtual = {
            efectivoDisponible: this.jugador.efectivoDisponible,
            creditoDisponible: this.jugador.tarjeta.creditoDisponible
        };
        const puedeIgnorar = (gasto instanceof GastoGusto); //Checa el valor booleano de si es un gasto de gusto
        const tieneDeuda = (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0);

        const decision = await this.vista.mostrarMenuGasto(gasto, estadoVirtual, puedeIgnorar, tieneDeuda); //React

        //Si no hay dinero para pagar nada
        if (decision === null) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            this.vista.mostrarGameOverInsolvencia();
            return;
        }

        if (decision === 'p') {
            // 1. Abre el menú para pagar la deuda de la tarjeta
            await this.realizarAbonoVoluntarioTDC();

            // 2. Vuelve a ejecutar TODO este mismo método para el mismo gasto
            // Lo llama recursivamente
            await this.procesarGasto(gasto);
        } else if (decision === 'd') {
            this.jugador.pagarConDebito(gasto.monto);
            this.vista.mostrarResolucionGastoDebito();
        } else if (decision === 't') {
            this.jugador.comprarConTDC(gasto.monto);
            this.vista.mostrarResolucionGastoCredito();
        } else if (decision === 'i') {
            gasto.ignorar();
            this.vista.mostrarResolucionGastoIgnorado();
        }
    }
}
