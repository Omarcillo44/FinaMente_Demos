import { PerfilEnum, EstadoJuegoEnum, VentanaPagoEnum } from './Enums.js';
import { ConfigPerfil } from './ConfigPerfil.js';
import { TarjetaCredito } from './TarjetaCredito.js';
import { Jugador } from './Jugador.js';
import { GeneradorAleatorio } from './GeneradorAleatorio.js';
import { GastoGusto } from './Gasto.js';

export class MotorJuego {
    constructor(consola) {
        this.consola = consola;
        this.jugador = null;
        this.config = null;
        this.stageActual = 1;
        this.semanaActual = 1;
        this.estadoJuego = EstadoJuegoEnum.EN_CURSO;
        this.ventanaPago = VentanaPagoEnum.EXPIRADA;
        
        this.gastosSemana = []; // tracking
    }

    async inicializarJugador(perfilEnum) {
        this.config = ConfigPerfil.get(perfilEnum);
        
        let ingresoInicial;
        if (perfilEnum === PerfilEnum.ESPORADICO) {
            ingresoInicial = this.config.ingresoStage1;
        } else if (perfilEnum === PerfilEnum.TRABAJADOR) {
            ingresoInicial = GeneradorAleatorio.randomBetween(this.config.ingresoMin, this.config.ingresoMax);
        } else {
            // Fijo
            ingresoInicial = this.config.ingresoFijo;
        }

        const limiteInicial = GeneradorAleatorio.generarLimiteInicial(this.config);
        const tarjeta = new TarjetaCredito(limiteInicial, this.config);
        
        this.jugador = new Jugador(perfilEnum, ingresoInicial, tarjeta);

        this.actualizarUIHeaders();
        this.consola.print(`>>> PERFIL INICIALIZADO: ${perfilEnum} <<<`, 'info');
        this.consola.print(`Ingreso Inicial: $${ingresoInicial}`);
        this.consola.print(`Límite de Crédito: $${limiteInicial.toFixed(2)} (Tasa Anual: ${(this.config.tasaInteresAnual * 100).toFixed(1)}%)`);
        await this.consola.sleep(1000);
    }

    actualizarUIHeaders() {
        if (!this.jugador) return;
        const hp = this.jugador.calcularHP();
        const pagoNoIntereses = this.jugador.tarjeta.saldoInsoluto + (this.jugador.tarjeta.interesesGenerados * 1.16);
        this.consola.updateHeader(
            hp, 
            this.jugador.tarjeta.calcularPagoMinimo(), 
            pagoNoIntereses,
            this.jugador.tarjeta.saldoInsoluto,
            this.jugador.tarjeta.limiteCredito,
            this.jugador.scoreCrediticio,
            this.stageActual, 
            this.semanaActual
        );
    }

    async evaluarGameOver() {
        if (this.jugador.calcularHP() <= 0) {
            this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
            this.consola.print('\n====================================', 'error');
            this.consola.print('!!!!!!! GAME OVER !!!!!!!', 'error');
            this.consola.print('Tu HP (Ingreso - Pago Mínimo) llegó a 0 o menos.', 'error');
            this.consola.print('Ya no puedes cubrir ni siquiera los pagos mínimos.', 'error');
            this.consola.print('====================================\n', 'error');
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
            this.consola.print(`\n--- FIN DEL STAGE ${this.stageActual} ---`, 'info');
            this.consola.print(`Corte de Tarjeta: Se calculan intereses si aplica.`);
            this.jugador.tarjeta.cerrarMes(); // Se generan intereses de lo que quedó de saldo
            
            // Evaluar score
            const usoCredito = this.jugador.tarjeta.saldoInsoluto / this.jugador.tarjeta.limiteCredito;
            if (usoCredito < 0.60) {
                this.consola.print('Score: Buen uso del crédito (< 60%). +5 pts', 'info');
                this.jugador.modificarScore(5);
                this.consola.print(`>>> Score actualizado a: ${this.jugador.scoreCrediticio} pts <<<`, 'user-input');
            } else if (usoCredito >= 0.90) {
                this.consola.print('Score: Uso excesivo del límite (>= 90%). -5 pts', 'warning');
                this.jugador.modificarScore(-5);
                this.consola.print(`>>> Score actualizado a: ${this.jugador.scoreCrediticio} pts <<<`, 'user-input');
            }
            
            // Abriendo ventana de pago para el siguiente stage (en las semanas 1 y 2)
            if (this.stageActual < 6) {
                this.ventanaPago = VentanaPagoEnum.ABIERTA;
                this.consola.print("¡La Ventana de Pago de tu Tarjeta de Crédito está ABIERTA!");
            } else {
                this.ventanaPago = VentanaPagoEnum.INMEDIATA;
                this.consola.print("¡Es Stage 6, recuento final!");
                await this.manejarVentanaDePago(); // Forzar en S6
            }
            
            this.stageActual++;
            await this.consola.sleep(1500);
        }

        if (this.estadoJuego !== EstadoJuegoEnum.GAME_OVER) {
            this.estadoJuego = EstadoJuegoEnum.COMPLETADO;
            this.consola.print('\n====================================', 'info');
            this.consola.print('! FELICIDADES ! HAS COMPLETADO LOS 6 MESES.', 'prompt');
            this.consola.print(`HP Final: $${this.jugador.calcularHP().toFixed(2)}`);
            this.consola.print(`Score Crediticio Final: ${this.jugador.scoreCrediticio.toFixed(0)}`);
            this.consola.print('====================================\n', 'info');
        }
    }

    async iniciarStage() {
        // Ingreso por inicio de mes (Para esporádico o normal se reinicia efectivo)
        // En stage 1 el jugador se inicializó ya
        if (this.stageActual > 1) {
            let nuevoIngreso;
            if (this.config.perfil === PerfilEnum.ESPORADICO) {
                nuevoIngreso = GeneradorAleatorio.generarIngresoEsporadico(this.config);
                this.consola.print(`\nMes nuevo. Ingreso esporádico recibido: $${nuevoIngreso.toFixed(2)}`, 'info');
            } else if (this.config.perfil === PerfilEnum.TRABAJADOR) {
                nuevoIngreso = GeneradorAleatorio.randomBetween(this.config.ingresoMin, this.config.ingresoMax);
                this.consola.print(`\nMes nuevo. Ingreso recibido: $${nuevoIngreso.toFixed(2)}`, 'info');
            } else {
                nuevoIngreso = this.config.ingresoFijo;
                this.consola.print(`\nMes nuevo. Ingreso recibido: $${nuevoIngreso.toFixed(2)}`, 'info');
            }
            this.jugador.actualizarIngreso(nuevoIngreso);
            this.actualizarUIHeaders();
        }

        for (this.semanaActual = 1; this.semanaActual <= 4; this.semanaActual++) {
            this.actualizarUIHeaders();
            this.consola.print(`\n========================================`, 'info');
            this.consola.print(`|        STAGE ${this.stageActual}  -  SEMANA ${this.semanaActual}         |`, 'user-input');
            this.consola.print(`========================================\n`, 'info');
            
            this.gastosSemana = GeneradorAleatorio.generarOleadaSemanal(this.config, this.semanaActual);
            
            if (this.gastosSemana.length === 0) {
                this.consola.print("Una semana tranquila. No hubo gastos.", "system");
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
            const salir = await this.consola.prompt("[Enter] para continuar, o escribe 'salir' para abandonar:", ['salir', '']);
            if (salir === 'salir') {
                this.estadoJuego = EstadoJuegoEnum.GAME_OVER;
                this.consola.print("Juego cancelado por el usuario.");
                return;
            }
        }
    }

    async manejarVentanaDePago() {
        const tarjeta = this.jugador.tarjeta;
        const pagoMinimo = tarjeta.calcularPagoMinimo();
        const deudaTotal = tarjeta.saldoInsoluto + tarjeta.interesesGenerados * 1.16;

        if (deudaTotal > 0) {
            this.consola.print(`\n>>> VENTANA DE PAGO <<< (Finalizando Semana 2)`, 'warning');
            this.consola.print(`Estado Tarjeta:`);
            this.consola.print(`- Límite Total: $${tarjeta.limiteCredito.toFixed(2)}`);
            this.consola.print(`- Crédito Disponible: $${tarjeta.creditoDisponible.toFixed(2)}`);
            this.consola.print(`- Saldo Insoluto: $${tarjeta.saldoInsoluto.toFixed(2)}`);
            this.consola.print(`- Pago Mínimo Requerido: $${pagoMinimo.toFixed(2)}`);
            this.consola.print(`EFECTIVO DISPONIBLE: $${this.jugador.efectivoDisponible.toFixed(2)}`, 'info');

            const pagoRequiereMonto = function(monto) {
                return (this.jugador.efectivoDisponible >= monto);
            }.bind(this);

            let opciones = [];
            let msgs = [];
            
            if (pagoRequiereMonto(pagoMinimo)) {
                opciones.push('1');
                msgs.push(`[1] Pagar Mínimo ($${pagoMinimo.toFixed(2)})`);
            }
            if (pagoRequiereMonto(deudaTotal)) {
                opciones.push('2');
                msgs.push(`[2] Pagar Cuenta Total ($${deudaTotal.toFixed(2)})`);
            }
            opciones.push('3');
            msgs.push(`[3] No pagar (Ignorar/Expirar)`);

            this.consola.print(msgs.join('  |  '));
            let eleccion;
            while(true) {
                eleccion = await this.consola.prompt(`Elige una opción (${opciones.join(', ')}):`, opciones);
                break;
            }

            if (eleccion === '1') {
                this.jugador.pagarDeudaTDC(pagoMinimo);
                this.consola.print('Pagaste solo el mínimo. La deuda restante seguirá generando intereses si no liquidas pronto.', 'warning');
                this.jugador.modificarScore(0);
                this.evaluarAumentoLinea();
            } else if (eleccion === '2') {
                this.jugador.pagarDeudaTDC(deudaTotal);
                this.consola.print('Pagaste el total de tu cuenta. ¡Excelente manejo!', 'prompt');
                const puntos = this.semanaActual === 1 ? 10 : 5; // En Stage 6 o S2
                this.jugador.modificarScore(puntos);
                this.consola.print(`>>> Score actualizado a: ${this.jugador.scoreCrediticio} pts <<<`, 'user-input');
                this.evaluarAumentoLinea();
            } else {
                this.consola.print('Has dejado expirar la ventana de pago.', 'error');
                const cargo = tarjeta.aplicarCargoTardio();
                this.consola.print(`Se ha aplicado un cargo por pago tardío de $${cargo.toFixed(2)}`, 'error');
                this.consola.print('Disminución de 20 pts de Score.', 'error');
                this.jugador.modificarScore(-20);
                this.consola.print(`>>> Score actualizado a: ${this.jugador.scoreCrediticio} pts <<<`, 'user-input');
            }
        }
        this.ventanaPago = VentanaPagoEnum.EXPIRADA;
        this.actualizarUIHeaders();
    }

    evaluarAumentoLinea() {
        const nuevoLimite = GeneradorAleatorio.evaluarAumentoLinea(this.jugador.scoreCrediticio, this.jugador.tarjeta.limiteCredito);
        if (nuevoLimite) {
            this.consola.print(`>>> ¡BUEN HISTORIAL PREMIADO! <<<`, 'prompt');
            this.consola.print(`Tu límite de crédito ha sido aumentado de $${this.jugador.tarjeta.limiteCredito.toFixed(2)} a $${nuevoLimite.toFixed(2)}`, 'prompt');
            const diff = nuevoLimite - this.jugador.tarjeta.limiteCredito;
            this.jugador.tarjeta.limiteCredito = nuevoLimite;
            this.jugador.tarjeta.creditoDisponible += diff;
        }
    }

    async procesarGasto(gasto) {
        this.consola.print(`\n[¡GASTO!] Te enfrentas a un pago: ${gasto.nombre}`);
        this.consola.print(`Categoría: ${gasto.categoria} | Monto: $${gasto.monto.toFixed(2)}`);
        
        let opciones = [];
        let descP = [];
        
        // Evaluar debit
        if (this.jugador.efectivoDisponible >= gasto.monto) {
            opciones.push('d');
            descP.push('d: Débito / Efectivo');
        }
        
        if (this.jugador.tarjeta.creditoDisponible >= gasto.monto) {
            opciones.push('t');
            descP.push('t: Tarjeta Credito');
        }

        if (gasto instanceof GastoGusto) {
            opciones.push('i');
            descP.push('i: Ignorar (Solo aplica a Gustos)');
        }

        if (this.ventanaPago === VentanaPagoEnum.ABIERTA && (this.jugador.tarjeta.saldoInsoluto > 0 || this.jugador.tarjeta.interesesGenerados > 0)) {
            opciones.push('p');
            descP.push('p: **Pagar Tarjeta (Ventana Abierta)**');
        }

        if (opciones.length === 0) {
            // El jugador se quedó sin opciones para pasar el gasto.
            // Si el hp ya era 0, esto significa Game Over
            this.consola.print(`¡No tienes ni efectivo ni crédito para cubrir este gasto! Se te acumulará a tu deuda indirectamente (Game Over inminente).`, 'error');
            // Forzar cargo normal con saldo en contra
            this.jugador.tarjeta.creditoDisponible -= gasto.monto;
            this.jugador.tarjeta.saldoInsoluto += gasto.monto;
            return;
        }

        this.consola.print(`Efectivo: $${this.jugador.efectivoDisponible.toFixed(2)} | Crédito: $${this.jugador.tarjeta.creditoDisponible.toFixed(2)}`);
        this.consola.print(`¿Con qué pagas? -> ${descP.join(' | ')}`);
        
        const decision = await this.consola.prompt('Elige: ', opciones);
        
        if (decision === 'p') {
            await this.manejarVentanaDePago();
            // Volver a preguntar por el gasto actual recursivamente, 
            // ya que usó su turno para pagar la tarjeta
            await this.procesarGasto(gasto);
        } else if (decision === 'd') {
            this.jugador.pagarConDebito(gasto.monto);
            this.consola.print('Pagado con débito/efectivo.');
        } else if (decision === 't') {
            this.jugador.comprarConTDC(gasto.monto);
            this.consola.print('Pagado con Tarjeta de Crédito.');
        } else if (decision === 'i') {
            gasto.ignorar();
            this.consola.print('Has ignorado este gusto.');
        }
    }
}
