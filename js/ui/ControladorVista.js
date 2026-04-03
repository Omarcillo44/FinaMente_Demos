import { VentanaPagoEnum } from '../motor/Enums.js';

export class ControladorVista {
    constructor(consola) {
        this.consola = consola;
    }

    async sleep(ms) {
        return this.consola.sleep(ms);
    }

    actualizarHeaders(estado) {
        this.consola.updateHeader(
            estado.hp,
            estado.pagoMinimo,
            estado.pagoNoIntereses,
            estado.saldoInsoluto,
            estado.limiteCredito,
            estado.scoreCrediticio,
            estado.stageActual,
            estado.semanaActual
        );
    }

    mostrarInicializacion(perfilEnum, ingresoInicial, limiteInicial, tasaInteresAnual) {
        this.consola.print(`>>> PERFIL INICIALIZADO: ${perfilEnum} <<<`, 'info');
        this.consola.print(`Ingreso Inicial: $${ingresoInicial.toFixed(2)}`);
        this.consola.print(`Límite de Crédito: $${limiteInicial.toFixed(2)} (Tasa Anual: ${(tasaInteresAnual * 100).toFixed(1)}%)`);
    }

    mostrarGameOverPorHP() {
        this.consola.print('\n====================================', 'error');
        this.consola.print('!!!!!!! GAME OVER !!!!!!!', 'error');
        this.consola.print('Tu HP (Ingreso - Pago Mínimo) llegó a 0 o menos.', 'error');
        this.consola.print('Ya no puedes cubrir ni siquiera los pagos mínimos.', 'error');
        this.consola.print('====================================\n', 'error');
    }

    mostrarGameOverInsolvencia() {
        this.consola.print(`¡No tienes efectivo ni crédito suficiente para cubrir este gasto obligatorio!`, 'error');
        this.consola.print('\n====================================', 'error');
        this.consola.print('!!!!!!! GAME OVER !!!!!!!', 'error');
        this.consola.print('Te has quedado sin liquidez (insolvencia total).', 'error');
        this.consola.print('No puedes enfrentar una responsabilidad financiera básica.', 'error');
        this.consola.print('====================================\n', 'error');
    }

    mostrarFinStage(stage) {
        this.consola.print(`\n--- FIN DEL STAGE ${stage} ---`, 'info');
        this.consola.print(`Corte de Tarjeta: Se calculan intereses si aplica.`);
    }

    mostrarCambioScore(mensaje, tipo, nuevoScore) {
        this.consola.print(mensaje, tipo);
        this.consola.print(`>>> Score actualizado a: ${nuevoScore} pts <<<`, 'user-input');
    }

    mostrarNotificacionVentanaPagoAbierta() {
        this.consola.print("¡La Ventana de Pago de tu Tarjeta de Crédito está ABIERTA!");
    }

    mostrarNotificacionVentanaPagoInmediata() {
        this.consola.print("¡Es Stage 6, recuento final!");
    }

    mostrarVictoria(hp, score) {
        this.consola.print('\n====================================', 'info');
        this.consola.print('! FELICIDADES ! HAS COMPLETADO LOS 6 MESES.', 'prompt');
        this.consola.print(`HP Final: $${hp.toFixed(2)}`);
        this.consola.print(`Score Crediticio Final: ${score.toFixed(0)}`);
        this.consola.print('====================================\n', 'info');
    }

    mostrarIngresoNuevoMes(esEsporadico, monto) {
        if (esEsporadico) {
            this.consola.print(`\nMes nuevo. Ingreso esporádico recibido: $${monto.toFixed(2)}`, 'info');
        } else {
            this.consola.print(`\nMes nuevo. Ingreso recibido: $${monto.toFixed(2)}`, 'info');
        }
    }

    mostrarInicioSemana(stage, semana) {
        this.consola.print(`\n========================================`, 'info');
        this.consola.print(`|        STAGE ${stage}  -  SEMANA ${semana}         |`, 'user-input');
        this.consola.print(`========================================\n`, 'info');
    }

    mostrarSemanaTranquila() {
        this.consola.print("Una semana tranquila. No hubo gastos.", "system");
    }

    async confirmarAvance() {
        return await this.consola.prompt("[Enter] para continuar, o escribe 'salir' para abandonar:", ['salir', '']);
    }

    mostrarCancelacionUsuario() {
        this.consola.print("Juego cancelado por el usuario.");
    }

    async mostrarMenuVentanaPago(estado) {
        this.consola.print(`\n>>> VENTANA DE PAGO <<< (Finalizando Semana 2)`, 'warning');
        this.consola.print(`Estado Tarjeta:`);
        this.consola.print(`- Límite Total: $${estado.limiteCredito.toFixed(2)}`);
        this.consola.print(`- Crédito Disponible: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`- Saldo Insoluto: $${estado.saldoInsoluto.toFixed(2)}`);
        this.consola.print(`- Pago Mínimo Requerido: $${estado.pagoMinimo.toFixed(2)}`);
        this.consola.print(`EFECTIVO DISPONIBLE: $${estado.efectivoDisponible.toFixed(2)}`, 'info');

        let msgs = [];
        let opciones = [];

        if (estado.efectivoDisponible >= estado.pagoMinimo) {
            opciones.push('1');
            msgs.push(`[1] Pagar Mínimo ($${estado.pagoMinimo.toFixed(2)})`);
        }
        if (estado.efectivoDisponible >= estado.deudaTotal) {
            opciones.push('2');
            msgs.push(`[2] Pagar Cuenta Total ($${estado.deudaTotal.toFixed(2)})`);
        }
        opciones.push('3');
        msgs.push(`[3] No pagar (Ignorar/Expirar)`);

        this.consola.print(msgs.join('  |  '));
        return await this.consola.prompt(`Elige una opción (${opciones.join(', ')}):`, opciones);
    }

    mostrarResolucionPagoMinimo() {
        this.consola.print('Pagaste solo el mínimo. La deuda restante seguirá generando intereses si no liquidas pronto.', 'warning');
    }

    mostrarResolucionPagoTotal(puntosGanados) {
        this.consola.print('Pagaste el total de tu cuenta. ¡Excelente manejo!', 'prompt');
    }

    mostrarResolucionExpiracion(cargoTardio) {
        this.consola.print('Has dejado expirar la ventana de pago.', 'error');
        this.consola.print(`Se ha aplicado un cargo por pago tardío de $${cargoTardio.toFixed(2)}`, 'error');
        this.consola.print('Disminución de 20 pts de Score.', 'error');
    }

    mostrarAumentoLinea(limiteViejo, limiteNuevo) {
        this.consola.print(`>>> ¡BUEN HISTORIAL PREMIADO! <<<`, 'prompt');
        this.consola.print(`Tu límite de crédito ha sido aumentado de $${limiteViejo.toFixed(2)} a $${limiteNuevo.toFixed(2)}`, 'prompt');
    }

    async mostrarMenuGasto(gasto, estado, puedeIgnorar, ventanaPagoAbierta) {
        this.consola.print(`\n[¡GASTO!] Te enfrentas a un pago: ${gasto.nombre}`);
        this.consola.print(`Categoría: ${gasto.categoria} | Monto: $${gasto.monto.toFixed(2)}`);

        let opciones = [];
        let descP = [];

        if (estado.efectivoDisponible >= gasto.monto) {
            opciones.push('d');
            descP.push('d: Débito / Efectivo');
        }

        if (estado.creditoDisponible >= gasto.monto) {
            opciones.push('t');
            descP.push('t: Tarjeta Credito');
        }

        if (puedeIgnorar) {
            opciones.push('i');
            descP.push('i: Ignorar (Solo aplica a Gustos)');
        }

        if (ventanaPagoAbierta) {
            opciones.push('p');
            descP.push('p: Pagar Tarjeta (Ventana Abierta)');
        }

        if (opciones.length === 0) {
            return null; // Indica que no puede pagar
        }

        this.consola.print(`Efectivo: $${estado.efectivoDisponible.toFixed(2)} | Crédito: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`¿Con qué pagas? -> ${descP.join(' | ')}`);

        return await this.consola.prompt('Elige: ', opciones);
    }

    mostrarResolucionGastoDebito() {
        this.consola.print('Pagado con débito/efectivo.');
    }

    mostrarResolucionGastoCredito() {
        this.consola.print('Pagado con Tarjeta de Crédito.');
    }

    mostrarResolucionGastoIgnorado() {
        this.consola.print('Has ignorado este gusto.');
    }
}
