import { PerfilEnum, EstadoJuegoEnum } from './Enums.js';
import { ConfigPerfil } from './ConfigPerfil.js';
import { TarjetaCredito } from './TarjetaCredito.js';
import { Jugador } from './Jugador.js';
import { GeneradorAleatorio } from './GeneradorAleatorio.js';
import { GastoGusto, GastoRecurrente } from './Gasto.js';
import { CatalogoGastos } from './CatalogoDatos.js';

export class MotorJuego {
    constructor(vista) {
        this.vista = vista;
        this.jugador = null; //Se determina luego por el usuario
        this.config = null; //Se determina luego por el usuario
        this.stageActual = 1; //Mes
        this.semanaActual = 1; //Semana
        this.estadoJuego = EstadoJuegoEnum.EN_CURSO; //Estado del juego

        this.gastosSemana = []; // logs
        this.gastosRecurrentesFijos = []; // Gastos permanentes por toda la partida
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
        
        // Generar recurrentes que serán fijos por todo el juego
        this.generarRecurrentesFijos();

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
            saldoInsoluto: this.jugador.tarjeta.saldoInsoluto + this.jugador.tarjeta.calcularDeudaMSIPendiente(),
            limiteCredito: this.jugador.tarjeta.limiteCredito,
            efectivoDisponible: this.jugador.efectivoDisponible,
            calidadVida: this.jugador.calidadVida,
            stageActual: this.stageActual,
            semanaActual: this.semanaActual
        });
    }

    async evaluarGameOver() {
        if (this.jugador.calcularHP() <= 0) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            const stats = {
                hp: this.jugador.calcularHP(),
                score: this.jugador.scoreCrediticio,
                cv: this.jugador.calidadVida,
                pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
                nuevoIngreso: 0
            };
            this.vista.mostrarGameOverPorHP(this.stageActual, stats); 
            return true;
        }
        return false;
    }

    generarRecurrentesFijos() {
        const catalogo = CatalogoGastos.getGastosPorCategoria(this.config.perfil, "Recurrente");
        
        // Determinar cuántos recurrentes tendrá este jugador según su perfil
        const numRecurrentes = GeneradorAleatorio.randomBetween(this.config.recurrentesMin, this.config.recurrentesMax);
        
        // Elegir aleatoriamente del catálogo sin repetir
        const shuffled = [...catalogo].sort(() => 0.5 - Math.random());
        const seleccion = shuffled.slice(0, Math.min(numRecurrentes, shuffled.length));

        // Instanciar y forzar ubicación a RECAMARA
        this.gastosRecurrentesFijos = seleccion.map(data => {
            return new GastoRecurrente({
                ...data,
                localizacion: "RECAMARA",
                montoFinal: data.monto // El modMonto de RECAMARA es 1.0 por defecto
            });
        });
    }

    async finalizarPartidaVoluntaria() {
        this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
        const stats = {
            hp: this.jugador.calcularHP(),
            score: this.jugador.scoreCrediticio,
            cv: this.jugador.calidadVida,
            pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
            pagoNoIntereses: this.jugador.tarjeta.calcularPagoNoGenerarIntereses(),
            nuevoIngreso: 0
        };
        this.vista.mostrarResumenSalidaVoluntaria(this.stageActual, stats);
        return true;
    }

    async iniciarJuego(perfilEnum) {
        await this.inicializarJugador(perfilEnum);
        this.stageActual = 1;

        while (this.stageActual <= 6 && this.estadoJuego === EstadoJuegoEnum.EN_CURSO) {
            await this.iniciarStage();
            if (this.estadoJuego === EstadoJuegoEnum.GAME_OVER) break;

            // 1. Determinar el ingreso del siguiente mes antes del resumen
            let proximoIngreso = this.jugador.ingresoMensual;
            if (this.stageActual < 6) {
                if (this.config.perfil === PerfilEnum.ESPORADICO || this.config.perfil === PerfilEnum.NINI) {
                    proximoIngreso = GeneradorAleatorio.generarIngresoEsporadico(this.config);
                }
            }

            // 2. Mostrar Panel de Resultados Mensuales (V4)
            const statsV4 = {
                hp: this.jugador.calcularHP(),
                score: this.jugador.scoreCrediticio,
                cv: this.jugador.calidadVida,
                pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
                pagoNoIntereses: this.jugador.tarjeta.calcularPagoNoGenerarIntereses(),
                nuevoIngreso: proximoIngreso
            };
            const esPerfilVistoso = (this.config.perfil === PerfilEnum.NINI || this.config.perfil === PerfilEnum.ESPORADICO);
            this.vista.mostrarFinStage(this.stageActual, statsV4, esPerfilVistoso);

            // 3. Procesos Técnicos de Cierre (Corte y Score)
            this.jugador.tarjeta.generarIntereses(); 

            const usoCredito = this.jugador.tarjeta.calcularUsoTotal();
            if (usoCredito < 0.60) {
                this.jugador.modificarScore(5);
                this.vista.mostrarCambioScore('Score: Buen uso del crédito (< 60%). +5 pts', 'info', this.jugador.scoreCrediticio);
            } else if (usoCredito >= 0.90) {
                this.jugador.modificarScore(-5);
                this.vista.mostrarCambioScore('Score: Uso excesivo del límite (>= 90%). -5 pts', 'warning', this.jugador.scoreCrediticio);
            }

            // 4. Inyección de efectivo para el próximo mes
            if (this.stageActual < 6) {
                this.jugador.actualizarIngreso(proximoIngreso);
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
        this.actualizarUIHeaders();
        
        for (this.semanaActual = 1; this.semanaActual <= 4; this.semanaActual++) {
            this.actualizarUIHeaders();
            this.vista.mostrarInicioSemana(this.stageActual, this.semanaActual); //React

            // Genera los gastos de la semana actual
            // Los recurrentes solo se inyectan en la Semana 1 y son los fijos calculados al inicio
            const recurrentesAInyectar = (this.semanaActual === 1) ? this.gastosRecurrentesFijos : [];
            this.gastosSemana = GeneradorAleatorio.generarOleadaSemanal(this.config, this.semanaActual, recurrentesAInyectar);

            // Mientras queden gastos por enfrentar
            while (this.gastosSemana.length > 0) {
                if (this.stageActual > 1 && this.semanaActual === 2 && this.gastosSemana.length === 1 && (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0)) {
                    this.vista.mostrarAdvertenciaUltimoDia();
                }

                const locs = [...new Set(this.gastosSemana.map(g => g.localizacion))];
                const locElegida = await this.vista.mostrarSelectorLocalizacion(locs);

                if (locElegida === 'p') {
                    await this.realizarOperacionesBancaMovil();
                    continue;
                }
                
                if (locElegida === 'x') {
                    return await this.finalizarPartidaVoluntaria();
                }

                // Bucle de estancia en la localización
                let enLocalizacion = true;
                while (enLocalizacion) {
                    const gastosEnLoc = this.gastosSemana.filter(g => g.localizacion === locElegida);
                    if (gastosEnLoc.length === 0) {
                        enLocalizacion = false;
                        break;
                    }

                    const seleccion = await this.vista.mostrarSelectorGastosLocalizacion(locElegida, gastosEnLoc);
                    
                    if (seleccion === 'p') {
                        await this.realizarOperacionesBancaMovil();
                        continue;
                    }

                    if (seleccion === 's') {
                        enLocalizacion = false;
                        break;
                    }

                    if (seleccion === 'x') {
                        return await this.finalizarPartidaVoluntaria();
                    }

                    const gastoSeleccionado = gastosEnLoc[parseInt(seleccion) - 1];
                    const resultado = await this.procesarGasto(gastoSeleccionado);
                    
                    this.actualizarUIHeaders();
                    if (await this.evaluarGameOver()) return;

                    if (resultado === 'pagado' || resultado === 'ignorado') {
                        const indexGlobal = this.gastosSemana.indexOf(gastoSeleccionado);
                        if (indexGlobal > -1) this.gastosSemana.splice(indexGlobal, 1);
                    }
                    // Si resultado es 'posponer', simplemente vuelve a mostrar la lista de la loc
                }
            }

            // Revisión silenciosa del pago mínimo al final de la semana 2 (a partir del Mes 2)
            if (this.stageActual > 1 && this.semanaActual === 2) {
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

    async realizarOperacionesBancaMovil() {
        const tarjeta = this.jugador.tarjeta;
        const pagoMinimo = tarjeta.calcularPagoMinimo();
        const pagoNoIntereses = tarjeta.calcularPagoNoGenerarIntereses();

        const estadoBanca = {
            limiteCredito: tarjeta.limiteCredito,
            creditoDisponible: tarjeta.creditoDisponible,
            saldoInsoluto: tarjeta.saldoInsoluto,
            pagoMinimo: pagoMinimo,
            pagoNoIntereses: tarjeta.calcularPagoNoGenerarIntereses(),
            efectivoDisponible: this.jugador.efectivoDisponible,
            maxRetiro: tarjeta.calcularEfectivoDisponibleParaRetirar(),
            comisionPct: tarjeta.comisionRetiroPct
        };

        const eleccion = await this.vista.mostrarMenuBancaMovil(estadoBanca);

        if (eleccion.tipo === 'MINIMO') {
            this.jugador.pagarDeudaTDC(pagoMinimo);
            this.vista.actualizarHeaders({ ...estadoBanca, hp: this.jugador.calcularHP() }); // Refresh
            this.vista.mostrarResolucionPagoMinimo();
            this.jugador.modificarScore(0);
            this.evaluarAumentoLinea();
        } else if (eleccion.tipo === 'TOTAL') {
            this.jugador.pagarDeudaTDC(pagoNoIntereses);
            const puntos = this.semanaActual === 1 ? 10 : 5; 
            this.vista.mostrarResolucionPagoTotal();
            this.jugador.modificarScore(puntos);
            this.vista.mostrarCambioScore(null, null, this.jugador.scoreCrediticio);
            this.evaluarAumentoLinea();
        } else if (eleccion.tipo === 'PARCIAL') {
            this.jugador.pagarDeudaTDC(eleccion.monto);
            this.vista.mostrarResolucionPagoParcial(eleccion.monto);
            this.evaluarAumentoLinea();
        } else if (eleccion.tipo === 'RETIRO') {
            const exito = this.jugador.retirarEfectivoDeTDC(eleccion.monto);
            if (exito) {
                this.actualizarUIHeaders();
                this.vista.mostrarMensaje(`Retiro exitoso de $${eleccion.monto.toFixed(2)} (+ comisión e IVA)`);
            } else {
                this.vista.mostrarMensaje("No se pudo realizar el retiro.");
            }
        } else if (eleccion.tipo === 'CANCELAR') {
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
        }
    }

    async procesarGasto(gasto) {
        if (!gasto.aceptaTDC && gasto.monto > this.jugador.efectivoDisponible) {
            const dispEfectivoMax = this.jugador.tarjeta.calcularEfectivoDisponibleParaRetirar();
            
            if (gasto.monto > (this.jugador.efectivoDisponible + dispEfectivoMax)) {
                this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
                const stats = {
                    hp: this.jugador.calcularHP(),
                    score: this.jugador.scoreCrediticio,
                    cv: this.jugador.calidadVida,
                    pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
                    pagoNoIntereses: this.jugador.tarjeta.calcularPagoNoGenerarIntereses(),
                    nuevoIngreso: 0
                };
                this.vista.mostrarGameOverInsolvenciaExtrema(gasto, this.stageActual, stats);
                return 'gameover';
            } else {
                const decisionRetiro = await this.vista.mostrarMenuDisposicionObligatoria(gasto, dispEfectivoMax, this.jugador.tarjeta.comisionRetiroPct);
                if (decisionRetiro && decisionRetiro.monto > 0) {
                     const retiroOK = this.jugador.retirarEfectivoDeTDC(decisionRetiro.monto);
                     this.actualizarUIHeaders();
                     if (!retiroOK) {
                         this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
                         const statsFinal = { hp: this.jugador.calcularHP(), score: this.jugador.scoreCrediticio, cv: this.jugador.calidadVida, pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(), pagoNoIntereses: this.jugador.tarjeta.calcularPagoNoGenerarIntereses(), nuevoIngreso: 0 };
                         this.vista.mostrarGameOverInsolvenciaExtrema(gasto, this.stageActual, statsFinal);
                         return 'gameover';
                     }
                } else {
                     this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
                     const statsFinal = { hp: this.jugador.calcularHP(), score: this.jugador.scoreCrediticio, cv: this.jugador.calidadVida, pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(), pagoNoIntereses: this.jugador.tarjeta.calcularPagoNoGenerarIntereses(), nuevoIngreso: 0 };
                     this.vista.mostrarGameOverInsolvenciaExtrema(gasto, this.stageActual, statsFinal);
                     return 'gameover';
                }
            }
        }

        const estadoVirtual = {
            efectivoDisponible: this.jugador.efectivoDisponible,
            creditoDisponible: this.jugador.tarjeta.creditoDisponible
        };
        const puedeIgnorar = (gasto instanceof GastoGusto);
        const tieneDeuda = (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0);

        const decision = await this.vista.mostrarMenuGasto(gasto, estadoVirtual, puedeIgnorar, tieneDeuda);

        if (decision === null) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            const stats = {
                hp: this.jugador.calcularHP(),
                score: this.jugador.scoreCrediticio,
                cv: this.jugador.calidadVida,
                pagoMinimo: this.jugador.tarjeta.calcularPagoMinimo(),
                pagoNoIntereses: this.jugador.tarjeta.calcularPagoNoGenerarIntereses(),
                nuevoIngreso: 0
            };
            this.vista.mostrarGameOverInsolvencia(this.stageActual, stats);
            return 'gameover';
        }

        if (decision === 'posponer' || decision === 's') { // 's' de salir del lugar
            return 'posponer';
        }

        if (decision === 'p') {
            await this.realizarOperacionesBancaMovil();
            return await this.procesarGasto(gasto);
        } else if (decision === 'd') {
            const exito = this.jugador.pagarConDebito(gasto.monto);
            if (!exito) {
               this.vista.mostrarMensaje("No tienes efectivo suficiente.");
               return await this.procesarGasto(gasto);
            }
            if (gasto instanceof GastoGusto) gasto.pagar(this.jugador);
            this.vista.mostrarResolucionGastoDebito();
            return 'pagado';
        } else if (decision === 't') {
            if (!gasto.aceptaTDC) {
                this.vista.mostrarMensaje("Este gasto solo acepta efectivo.");
                return await this.procesarGasto(gasto);
            }
            const exito = this.jugador.comprarConTDC(gasto.monto);
            if (!exito) {
               this.vista.mostrarMensaje("No tienes crédito suficiente.");
               return await this.procesarGasto(gasto);
            }
            if (gasto instanceof GastoGusto) gasto.pagar(this.jugador);
            this.vista.mostrarResolucionGastoCredito();
            return 'pagado';
        } else if (decision === 'm') {
            if (!gasto.aceptaMSI) {
                this.vista.mostrarMensaje("Este gasto no admite MSI.");
                return await this.procesarGasto(gasto);
            }
            const cuotasInput = await this.vista.mostrarSelectorMSI(gasto.opcionesMSI);
            const exito = this.jugador.comprarConMSI(gasto.monto, cuotasInput);
            if (!exito) {
                this.vista.mostrarMensaje("No tienes crédito suficiente para diferir esta compra.");
                return await this.procesarGasto(gasto);
            }
            if (gasto instanceof GastoGusto) gasto.pagar(this.jugador);
            this.vista.mostrarResolucionGastoMSI(cuotasInput);
            return 'pagado';
        } else if (decision === 'i') {
            gasto.ignorar(this.jugador);
            this.vista.mostrarResolucionGastoIgnorado();
            return 'ignorado';
        }
    }
}
