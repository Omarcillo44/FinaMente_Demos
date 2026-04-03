
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
            estado.saldoInsoluto,
            estado.limiteCredito,
            estado.efectivoDisponible,
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

    async mostrarSelectorGastos(gastosDisponibles) {
        this.consola.print(`\n========================================`, 'system');
        this.consola.print(`📝 TAREAS PENDIENTES DE LA SEMANA`, 'system');
        this.consola.print(`========================================`, 'system');
        
        let opciones = [];
        let indexString = [];
        
        for (let i = 0; i < gastosDisponibles.length; i++) {
            const gasto = gastosDisponibles[i];
            const num = (i + 1).toString();
            opciones.push(`[${num}] ${gasto.nombre} (${gasto.categoria})`);
            indexString.push(num);
        }
        opciones.push(`[p] Usar Banca Móvil (Abonar a TDC)`);
        indexString.push('p');
        
        this.consola.print(opciones.join('  |  '));
        const opcionElegida = await this.consola.prompt(`Elige a qué enfrentar primero (1-${gastosDisponibles.length}):`, indexString);
        
        if (opcionElegida === 'p') return 'p';
        return parseInt(opcionElegida) - 1;
    }

    async confirmarAvance() {
        return await this.consola.prompt("[Enter] para continuar, o escribe 'salir' para abandonar:", ['salir', '']);
    }

    mostrarCancelacionUsuario() {
        this.consola.print("Juego cancelado por el usuario.");
    }

    async mostrarMenuAbonoTDC(estado) {
        this.consola.print(`\n>>> ABONO A TARJETA DE CRÉDITO <<<`, 'warning');
        this.consola.print(`Estado Tarjeta:`);
        this.consola.print(`- Límite Total: $${estado.limiteCredito.toFixed(2)}`);
        this.consola.print(`- Crédito Disponible: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`- Saldo Insoluto: $${estado.saldoInsoluto.toFixed(2)}`);
        this.consola.print(`- Pago Mínimo Requerido: $${estado.pagoMinimo.toFixed(2)}`);
        this.consola.print(`EFECTIVO DISPONIBLE: $${estado.efectivoDisponible.toFixed(2)}`, 'info');

        let msgs = [];
        let opciones = [];

        if (estado.efectivoDisponible >= estado.pagoMinimo && estado.pagoMinimo > 0) {
            opciones.push('1');
            msgs.push(`[1] Pagar Mínimo ($${estado.pagoMinimo.toFixed(2)})`);
        }
        if (estado.efectivoDisponible >= estado.deudaTotal && estado.deudaTotal > 0) {
            opciones.push('2');
            msgs.push(`[2] Pagar Cuenta Total ($${estado.deudaTotal.toFixed(2)})`);
        }
        if (estado.efectivoDisponible > 0) {
            opciones.push('3');
            msgs.push(`[3] Otro Monto`);
        }
        opciones.push('4');
        msgs.push(`[4] Cancelar`);

        this.consola.print(msgs.join('  |  '));
        const opcion = await this.consola.prompt(`Elige una opción (${opciones.join(', ')}):`, opciones);

        if (opcion === '3') {
            let numParsed = -1;
            while (numParsed <= 0 || numParsed > estado.efectivoDisponible) {
                const amountInput = await this.consola.prompt(`¿Cuánto deseas abonar? ($1 - $${estado.efectivoDisponible.toFixed(2)}):`);
                numParsed = parseFloat(amountInput);
                if (isNaN(numParsed) || numParsed <= 0 || numParsed > estado.efectivoDisponible) {
                    this.consola.print(`Entrada inválida o monto superior a tu efectivo disponible. Intenta de nuevo.`, 'warning');
                    numParsed = -1; // Force loop again
                }
            }
            return { tipo: 'PARCIAL', monto: numParsed };
        }

        return { tipo: opcion === '1' ? 'MINIMO' : opcion === '2' ? 'TOTAL' : 'CANCELAR' };
    }
    
    mostrarAdvertenciaUltimoDia() {
        this.consola.print(`\n⚠️ ¡CUIDADO! Es el último gasto de la semana 2. Si no has cubierto tu pago mínimo de la TDC, enfrentarás multas silenciosas al terminar de pagar esto.`, 'warning');
    }
    
    mostrarResolucionPagoMinimo() {
        this.consola.print('Pagaste solo el mínimo. La deuda restante seguirá generando intereses si no liquidas pronto.', 'warning');
    }

    mostrarResolucionPagoParcial(monto) {
        this.consola.print(`Abonaste $${monto.toFixed(2)} a tu tarjeta.`, 'info');
    }

    mostrarResolucionPagoTotal(puntosGanados) {
        this.consola.print('Pagaste el total de tu cuenta. ¡Excelente manejo!', 'prompt');
    }

    mostrarSinDeuda() {
        this.consola.print('Tu tarjeta actualmente está en un saldo de $0. No hay nada qué pagar.', 'info');
    }

    mostrarResolucionExpiracion(cargoTardio) {
        this.consola.print('\n========================================', 'error');
        this.consola.print('¡CORTE DE TARJETA! No realizaste el pago mínimo a tiempo.', 'error');
        this.consola.print(`Multa por pago tardío cargada a la cuenta: $${cargoTardio.toFixed(2)}`, 'error');
        this.consola.print('Disminución de 20 pts de Score.', 'error');
    }

    mostrarAumentoLinea(limiteViejo, limiteNuevo) {
        this.consola.print(`>>> ¡BUEN HISTORIAL PREMIADO! <<<`, 'prompt');
        this.consola.print(`Tu límite de crédito ha sido aumentado de $${limiteViejo.toFixed(2)} a $${limiteNuevo.toFixed(2)}`, 'prompt');
    }

    async mostrarMenuGasto(gasto, estado, puedeIgnorar, ventanaPagoAbierta) {
        const montoActivo = gasto.montoModificado !== undefined ? gasto.montoModificado : gasto.monto;
        this.consola.print(`\n[¡GASTO!] Te enfrentas a un pago: ${gasto.nombre}`);
        if (gasto.esGrupo) {
            this.consola.print(`Misión Conjunta con ${gasto.gastos.length} tareas asociadas:`);
            gasto.gastos.forEach(g => {
                let montoImp = g.montoModificado !== undefined ? g.montoModificado : g.monto;
                this.consola.print(`  - ${g.nombre} ($${montoImp.toFixed(2)})`);
            });
            gasto.notasSinergia.forEach(nota => {
                this.consola.print(`> ${nota}`, 'info');
            });
        }
        this.consola.print(`Categoría: ${gasto.categoria} | Monto Total: $${montoActivo.toFixed(2)}`);

        let opciones = [];
        let descP = [];

        let montoDebito = gasto.esGrupo ? gasto.montoModificadoEfectivo : montoActivo;

        if (estado.efectivoDisponible >= montoDebito) {
            opciones.push('d');
            if (gasto.esGrupo && montoDebito < montoActivo) {
                 descP.push(`d: Débito / Efectivo ($${montoDebito.toFixed(2)})`);
            } else {
                 descP.push(`d: Débito / Efectivo`);
            }
        }

        if (estado.creditoDisponible >= montoActivo && gasto.aceptaTDC !== false) {
            // Evaluamos aceptaTDC sólo si es individual por ahora, o si es grupo y todos aceptan
            let aceptaCredito = true;
            if (gasto.esGrupo) {
                aceptaCredito = gasto.gastos.every(g => g.aceptaTDC !== false);
            } else {
                aceptaCredito = gasto.aceptaTDC !== false;
            }
            if (aceptaCredito) {
                opciones.push('t');
                descP.push('t: Tarjeta Credito');
            } else {
                this.consola.print(`(❗) Este gasto o grupo tiene restricciones y NO se puede pagar con Tarjeta`, 'warning');
            }
        }

        if (puedeIgnorar && !gasto.bloquearIgnorar) {
            opciones.push('i');
            descP.push('i: Ignorar (Solo aplica a Gustos)');
        }

        // La opción p siempre aparece (se quitó la condicional de deuda)
        opciones.push('p');
        descP.push('p: Pagar Tarjeta (Abono Manual)');

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

    mostrarImpulsoSupermercado() {
        this.consola.print('\n(❗) ¡USO DE TARJETA EN SÚPER!', 'warning');
        this.consola.print('Al pagar con tarjeta, pasaste a las cajas y caíste en la tentación impulsiva de llevarte algo extra...', 'warning');
    }

    mostrarResolucionGastoIgnorado() {
        this.consola.print('Has ignorado este gusto.');
    }
}
