import { PerfilEnum, EstadoJuegoEnum, VentanaPagoEnum } from './Enums.js';
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
        this.ventanaPago = VentanaPagoEnum.EXPIRADA; //¿Se puede pagar o no la TDC?

        this.gastosSemana = []; // logs
    }

    async inicializarJugador(perfilEnum) {
        //Se extrae el perfil seleccionado del enum y se guarda en this.config
        this.config = ConfigPerfil.get(perfilEnum);


        /*
        * Se define el ingreso inicial dependiendo del perfil
        * Si es esporádico, se toma su valor del config
        * Si es trabajador, se toma un valor aleatorio entre el min y max del config
        */
        let ingresoInicial;
        if (perfilEnum === PerfilEnum.ESPORADICO) {
            ingresoInicial = this.config.ingresoStage1;
        } else if (perfilEnum === PerfilEnum.TRABAJADOR) {
            ingresoInicial = GeneradorAleatorio.randomBetween(this.config.ingresoMin, this.config.ingresoMax);
        } else {
            // Los demás perfiles tienen ingresos fijos iniciales
            ingresoInicial = this.config.ingresoFijo;
        }

        const limiteInicial = GeneradorAleatorio.generarLimiteInicial(this.config);
        const tarjeta = new TarjetaCredito(limiteInicial, this.config);

        this.jugador = new Jugador(perfilEnum, ingresoInicial, tarjeta);

        this.actualizarUIHeaders();
        this.vista.mostrarInicializacion(perfilEnum, ingresoInicial, limiteInicial, this.config.tasaInteresAnual);
        await this.vista.sleep(1000);
    }

    actualizarUIHeaders() {
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
            this.vista.mostrarGameOverPorHP();
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

            // Abriendo ventana de pago para el siguiente stage (en las semanas 1 y 2)
            if (this.stageActual < 6) {
                this.ventanaPago = VentanaPagoEnum.ABIERTA;
                this.vista.mostrarNotificacionVentanaPagoAbierta();
            } else {
                this.ventanaPago = VentanaPagoEnum.INMEDIATA;
                this.vista.mostrarNotificacionVentanaPagoInmediata();
                await this.manejarVentanaDePago(); // Forzar en S6
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
        // En stage 1 el jugador se inicializó ya
        if (this.stageActual > 1) {
            let nuevoIngreso;
            if (this.config.perfil === PerfilEnum.ESPORADICO) {
                nuevoIngreso = GeneradorAleatorio.generarIngresoEsporadico(this.config);
                this.vista.mostrarIngresoNuevoMes(true, nuevoIngreso);
            } else if (this.config.perfil === PerfilEnum.TRABAJADOR) {
                nuevoIngreso = GeneradorAleatorio.randomBetween(this.config.ingresoMin, this.config.ingresoMax);
                this.vista.mostrarIngresoNuevoMes(false, nuevoIngreso);
            } else {
                nuevoIngreso = this.config.ingresoFijo;
                this.vista.mostrarIngresoNuevoMes(false, nuevoIngreso);
            }
            this.jugador.actualizarIngreso(nuevoIngreso);
            this.actualizarUIHeaders();
        }

        for (this.semanaActual = 1; this.semanaActual <= 4; this.semanaActual++) {
            this.actualizarUIHeaders();
            this.vista.mostrarInicioSemana(this.stageActual, this.semanaActual);

            this.gastosSemana = GeneradorAleatorio.generarOleadaSemanal(this.config, this.semanaActual, this.recurrentesStage);

            if (this.gastosSemana.length === 0) {
                this.vista.mostrarSemanaTranquila();
            }

            for (let i = 0; i < this.gastosSemana.length; i++) {
                const gasto = this.gastosSemana[i];
                await this.procesarGasto(gasto);
                this.actualizarUIHeaders();
                if (await this.evaluarGameOver()) return; // Corta ejecución aquí

                // Cierre de ventana de pago al FINAL de la semana 2 si hay pago pendiente
                if (this.semanaActual === 2 && i === this.gastosSemana.length - 1 && this.ventanaPago === VentanaPagoEnum.ABIERTA) {
                    await this.manejarVentanaDePago();
                }
            }
            // Si la semana 2 terminó sin gastos, igual cerramos la ventana
            if (this.semanaActual === 2 && this.gastosSemana.length === 0 && this.ventanaPago === VentanaPagoEnum.ABIERTA) {
                await this.manejarVentanaDePago();
            }

            // Preguntar si quiere salir en cualquier momento para prueba
            const salir = await this.vista.confirmarAvance();
            if (salir === 'salir') {
                this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
                this.vista.mostrarCancelacionUsuario();
                return;
            }
        }
    }

    async manejarVentanaDePago() {
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

            const eleccion = await this.vista.mostrarMenuVentanaPago(estadoTarjeta);

            if (eleccion === '1') {
                this.jugador.pagarDeudaTDC(pagoMinimo);
                this.vista.mostrarResolucionPagoMinimo();
                this.jugador.modificarScore(0);
                this.evaluarAumentoLinea();
            } else if (eleccion === '2') {
                this.jugador.pagarDeudaTDC(deudaTotal);
                const puntos = this.semanaActual === 1 ? 10 : 5; // En Stage 6 o S2
                this.vista.mostrarResolucionPagoTotal();
                this.jugador.modificarScore(puntos);
                this.vista.mostrarCambioScore(null, null, this.jugador.scoreCrediticio);
                this.evaluarAumentoLinea();
            } else {
                const cargo = tarjeta.aplicarCargoTardio();
                this.vista.mostrarResolucionExpiracion(cargo);
                this.jugador.modificarScore(-20);
                this.vista.mostrarCambioScore(null, null, this.jugador.scoreCrediticio);
            }
        }
        this.ventanaPago = VentanaPagoEnum.EXPIRADA;
        this.actualizarUIHeaders();
    }

    evaluarAumentoLinea() {
        const nuevoLimite = GeneradorAleatorio.evaluarAumentoLinea(this.jugador.scoreCrediticio, this.jugador.tarjeta.limiteCredito);
        if (nuevoLimite) {
            const diff = nuevoLimite - this.jugador.tarjeta.limiteCredito;
            this.vista.mostrarAumentoLinea(this.jugador.tarjeta.limiteCredito, nuevoLimite);
            this.jugador.tarjeta.limiteCredito = nuevoLimite;
            this.jugador.tarjeta.creditoDisponible += diff;
        }
    }

    async procesarGasto(gasto) {
        const estadoVirtual = {
            efectivoDisponible: this.jugador.efectivoDisponible,
            creditoDisponible: this.jugador.tarjeta.creditoDisponible
        };
        const puedeIgnorar = (gasto instanceof GastoGusto);
        const ventanaPagoAbierta = (this.ventanaPago === VentanaPagoEnum.ABIERTA && (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0));

        const decision = await this.vista.mostrarMenuGasto(gasto, estadoVirtual, puedeIgnorar, ventanaPagoAbierta);

        if (decision === null) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            this.vista.mostrarGameOverInsolvencia();
            return;
        }

        if (decision === 'p') {
            await this.manejarVentanaDePago();
            // Volver a preguntar por el gasto actual recursivamente, 
            // ya que usó su turno para pagar la tarjeta
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
