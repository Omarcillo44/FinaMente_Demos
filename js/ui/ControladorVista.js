
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

    async mostrarSelectorLocalizaciones(poolGastos) {
        this.consola.print(`\n========================================`, 'system');
        this.consola.print(`🗺️ LUGARES DISPONIBLES PARA VISITAR`, 'system');
        this.consola.print(`========================================`, 'system');

        let locs = new Set();
        poolGastos.forEach(g => {
            Object.keys(g.opcionesCompra).forEach(l => locs.add(l));
        });
        const locArray = Array.from(locs);

        let opciones = [];
        let indexString = [];

        if (locArray.length === 0) {
            this.consola.print(`No quedan gastos pendientes ubicables en el mapa.`, 'info');
        } else {
            for (let i = 0; i < locArray.length; i++) {
                const num = (i + 1).toString();
                const count = poolGastos.filter(g => Object.keys(g.opcionesCompra).includes(locArray[i])).length;
                opciones.push(`[${num}] Viajar a: ${locArray[i]} (${count} mandados por hacer)`);
                indexString.push(num);
            }
        }

        opciones.push(`\n[p] Usar Banca Móvil`);
        indexString.push('p');
        opciones.push(`[a] Terminar semana (Avanzar el tiempo)`);
        indexString.push('a');

        this.consola.print(opciones.join('\n'));
        const opcionElegida = await this.consola.prompt(`Elige tu destino:`, indexString);

        if (opcionElegida === 'p') return 'p';
        if (opcionElegida === 'a') return 'a';
        return locArray[parseInt(opcionElegida) - 1]; // Devuelve el string del lugar
    }

    async mostrarMenuBatalla(batalla, estado) {
        this.consola.print(`\n========================================`, 'system');
        this.consola.print(`📍 BATALLA: ${batalla.localizacion.toUpperCase()}`, 'system');
        this.consola.print(`========================================`, 'system');

        this.consola.print(`\n[Sinergias Activas]`);
        if (batalla.notasSinergia.length > 0) {
            batalla.notasSinergia.forEach(n => this.consola.print(`> ${n}`, 'info'));
        } else {
            this.consola.print(`> Ninguna sinergia ambiental detectada en esta localización.`, 'system');
        }

        this.consola.print(`\n[Tus Recursos] Efectivo: $${estado.efectivoDisponible.toFixed(2)} | Crédito: $${estado.creditoDisponible.toFixed(2)}`);

        let opciones = [];
        let indexString = [];

        this.consola.print(`\n[Inventario de esta locación]`);
        for (let i = 0; i < batalla.gastos.length; i++) {
            const gasto = batalla.gastos[i];
            const num = (i + 1).toString();
            opciones.push(`[${num}] Inspeccionar y Pagar: ${gasto.nombre} ($${gasto.montoModificado.toFixed(2)})`);
            indexString.push(num);
        }

        // Calcular el descuento por comprar en combo
        const base = batalla.totalSinPagar;
        let efFinal = 0;
        batalla.gastos.forEach(g => {
            let descFrac = g.descuentoEfectivo || 0;
            let descFijo = g.descuentoFijoEfectivo || 0;
            efFinal += Math.max(0, g.montoModificado * (1 - descFrac) - descFijo);
        });
        const suffix = efFinal < base ? " - Sinergias Aplicadas" : "";

        opciones.push(`\n[t] Comprar TODO lo de aquí con Tarjeta de Crédito ($${base.toFixed(2)})`);
        indexString.push('t');

        opciones.push(`[e] Comprar TODO con Efectivo/Débito ($${efFinal.toFixed(2)}${suffix})`);
        indexString.push('e');

        opciones.push(`[x] Salir de la Batalla y regresar al Mapa`);
        indexString.push('x');

        this.consola.print(opciones.join('\n'));
        const opt = await this.consola.prompt(`Elige una acción detallada o de combo:`, indexString);

        if (opt === 't' || opt === 'e' || opt === 'x') return opt;
        return parseInt(opt) - 1; // Return Sub-Index
    }

    async confirmarAvance(estadoExtra) {
        if (estadoExtra) {
            this.consola.print(`\n--- RESUMEN ACTUAL ---`, 'system');
            this.consola.print(`🤍 HP Real: $${estadoExtra.hp.toFixed(2)}`, 'info');
            this.consola.print(`⭐ Score Crediticio: ${estadoExtra.score} pts`, 'info');
            this.consola.print(`💳 Pago Mínimo TDC: $${estadoExtra.pagoMinimo.toFixed(2)}`, 'info');
            this.consola.print(`💸 Ingreso Mensual: $${estadoExtra.ingresoMensual.toFixed(2)}`, 'info');

            if (estadoExtra.retroalimentacion && estadoExtra.retroalimentacion.length > 0) {
                this.consola.print(`↳ Actividad Reciente:`, 'system');
                estadoExtra.retroalimentacion.forEach(msg => {
                    this.consola.print(` * ${msg}`, 'prompt');
                });
            } else {
                this.consola.print(`↳ Actividad Reciente: Sin novedades en tu score o límite.`, 'system');
            }
            this.consola.print(`----------------------`, 'system');
        }
        return await this.consola.prompt("\n[Enter] para continuar la siguiente semana, o escribe 'salir' para detener el juego:", ['salir', '']);
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

    async mostrarMenuGasto(gasto, estado, puedeIgnorar, tieneDeuda, batallaContext = null) {
        const montoActivo = gasto.montoModificado !== undefined ? gasto.montoModificado : gasto.monto;
        this.consola.print(`\n[¡GASTO INDIVIDUAL!] Estás inspeccionando: ${gasto.nombre}`);

        let descFrac = (batallaContext && gasto.descuentoEfectivo) ? gasto.descuentoEfectivo : 0;
        let descFijo = (batallaContext && gasto.descuentoFijoEfectivo) ? gasto.descuentoFijoEfectivo : 0;
        let montoDebito = Math.max(0, montoActivo * (1 - descFrac) - descFijo);

        this.consola.print(`Categoría: ${gasto.categoria} | Monto Base/Ambiental: $${montoActivo.toFixed(2)}`);

        let opciones = [];
        let descP = [];

        if (estado.efectivoDisponible >= montoDebito) {
            opciones.push('d');
            if (montoDebito < montoActivo) {
                descP.push(`d: Débito / Efectivo ($${montoDebito.toFixed(2)} - Sinergia Aplicada)`);
            } else {
                descP.push(`d: Débito / Efectivo`);
            }
        }

        if (estado.creditoDisponible >= montoActivo && gasto.aceptaTDC !== false) {
            opciones.push('t');
            descP.push('t: Tarjeta Credito');
        } else if (gasto.aceptaTDC === false) {
            this.consola.print(`(❗) Este gasto tiene restricciones y NO se puede pagar con Tarjeta`, 'warning');
        }

        if (puedeIgnorar && !gasto.bloquearIgnorar) {
            opciones.push('i');
            descP.push('i: Ignorar (Solo aplica a Gustos)');
        }

        if (opciones.length === 0) {
            return null; // Indica que no puede pagar
        }

        this.consola.print(`Efectivo: $${estado.efectivoDisponible.toFixed(2)} | Crédito: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`¿Con qué pagas? \n${descP.join('\n')}`);

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
