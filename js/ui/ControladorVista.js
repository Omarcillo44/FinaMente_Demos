
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
            estado.calidadVida,
            estado.stageActual,
            estado.semanaActual
        );
    }

    mostrarInicializacion(perfilEnum, ingresoInicial, limiteInicial, tasaInteresAnual) {
        this.consola.print(`>>> PERFIL INICIALIZADO: ${perfilEnum} <<<`, 'info');
        this.consola.print(`Ingreso Inicial: $${ingresoInicial.toFixed(2)}`);
        this.consola.print(`Límite de Crédito: $${limiteInicial.toFixed(2)} (Tasa Anual: ${(tasaInteresAnual * 100).toFixed(1)}%)`);
    }

    mostrarGameOverPorHP(stage, stats) {
        this.consola.clear();
        this.mostrarFinStage(stage, stats, false);
        this.consola.print('\n====================================', 'error');
        this.consola.print('!!!!!!! GAME OVER !!!!!!!', 'error');
        this.consola.print('Tu HP (Ingreso - Pago Mínimo) llegó a 0 o menos.', 'error');
        this.consola.print('Ya no puedes cubrir ni siquiera los pagos mínimos.', 'error');
        this.consola.print('====================================\n', 'error');
    }

    mostrarGameOverInsolvencia(stage, stats) {
        this.consola.clear();
        this.mostrarFinStage(stage, stats, false);
        this.consola.print(`¡No tienes efectivo ni crédito suficiente para cubrir este gasto obligatorio!`, 'error');
        this.consola.print('\n====================================', 'error');
        this.consola.print('!!!!!!! GAME OVER !!!!!!!', 'error');
        this.consola.print('Te has quedado sin liquidez (insolvencia total).', 'error');
        this.consola.print('No puedes enfrentar una responsabilidad financiera básica.', 'error');
        this.consola.print('====================================\n', 'error');
    }

    mostrarFinStage(stage, stats, esNiniOEsporadico) {
        this.consola.print(`\n========================================`, 'info');
        this.consola.print(`📊 RESUMEN MENSUAL - CIERRE MES ${stage}`, 'info');
        this.consola.print(`========================================`, 'info');
        this.consola.print(`🤍 HP Real: $${stats.hp.toFixed(2)}`);
        this.consola.print(`⭐ Score Crediticio: ${stats.score.toFixed(0)} pts`);
        this.consola.print(`😊 Calidad de Vida: ${Math.floor(stats.cv)} / 100`);
        this.consola.print(`💳 Pago Mínimo TDC: $${stats.pagoMinimo.toFixed(2)}`);
        this.consola.print(`💸 Pago para no generar intereses: $${stats.pagoNoIntereses.toFixed(2)}`);
        this.consola.print(`----------------------------------------`);
        
        if (esNiniOEsporadico) {
            this.consola.print(`💰 ¡DINERO EXTRA RECIBIDO! 🤑`, 'prompt');
            this.consola.print(`💸 Nuevo Ingreso: $${stats.nuevoIngreso.toFixed(2)}`, 'prompt');
        } else {
            this.consola.print(`💸 Nuevo Ingreso: $${stats.nuevoIngreso.toFixed(2)}`, 'info');
        }
        this.consola.print(`========================================\n`, 'info');
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

    mostrarResumenSalidaVoluntaria(stage, stats) {
        this.consola.clear();
        this.consola.print(`\n>>> PARTIDA FINALIZADA POR EL USUARIO <<<`, 'warning');
        this.mostrarFinStage(stage, stats, false);
        this.consola.print(`Has decidido terminar la simulación en el Mes ${stage}.`, 'info');
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

    async mostrarSelectorLocalizacion(localizaciones) {
        this.consola.print(`\n========================================`, 'system');
        this.consola.print(`🗺️ MAPA: ELIGE UNA LOCALIZACIÓN A VISITAR`, 'system');
        this.consola.print(`========================================`, 'system');
        
        let opciones = [];
        let indexString = [];
        
        for (let i = 0; i < localizaciones.length; i++) {
            const loc = localizaciones[i];
            const num = (i + 1).toString();
            opciones.push(`[${num}] ${loc}`);
            indexString.push(num);
        }
        opciones.push(`[p] Usar Banca Móvil (Abonar/Retirar)`);
        indexString.push('p');
        opciones.push(`[x] Finalizar Partida`);
        indexString.push('x');
        
        this.consola.print(opciones.join('  |  '));
        const opcionElegida = await this.consola.prompt(`¿A dónde quieres ir? (1-${localizaciones.length}, 'p' o 'x'):`, indexString);
        
        if (opcionElegida === 'p') return 'p';
        if (opcionElegida === 'x') return 'x';
        return localizaciones[parseInt(opcionElegida) - 1];
    }

    async mostrarSelectorGastosLocalizacion(localizacion, gastos) {
        this.consola.print(`\n----------------------------------------`, 'system');
        this.consola.print(`📍 ESTÁS EN: ${localizacion}`, 'system');
        this.consola.print(`----------------------------------------`, 'system');
        
        let opciones = [];
        let indexString = [];
        
        for (let i = 0; i < gastos.length; i++) {
            const gasto = gastos[i];
            const num = (i + 1).toString();
            opciones.push(`[${num}] ${gasto.nombre} ($${gasto.monto.toFixed(2)})`);
            indexString.push(num);
        }
        opciones.push(`[p] Banca Móvil`);
        indexString.push('p');
        opciones.push(`[s] Salir de aquí (Regresar al mapa)`);
        indexString.push('s');
        opciones.push(`[x] Finalizar Partida`);
        indexString.push('x');
        
        this.consola.print(opciones.join('  |  '));
        return await this.consola.prompt(`¿A qué te enfrentas ahora? (1-${gastos.length}, 'p', 's' o 'x'):`, indexString);
    }

    async confirmarAvance() {
        return await this.consola.prompt("[Enter] para continuar, o escribe 'salir' para abandonar:", ['salir', '']);
    }

    mostrarCancelacionUsuario() {
        this.consola.print("Juego cancelado por el usuario.");
    }

    async mostrarMenuBancaMovil(estado) {
        this.consola.print(`\n>>> BANCA MÓVIL: GESTIÓN DE CUENTA <<<`, 'warning');
        this.consola.print(`Estado Tarjeta:`);
        this.consola.print(`- Límite Total: $${estado.limiteCredito.toFixed(2)}`);
        this.consola.print(`- Crédito Disponible: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`- Saldo Insoluto: $${estado.saldoInsoluto.toFixed(2)}`);
        this.consola.print(`- Pago Mínimo Requerido: $${estado.pagoMinimo.toFixed(2)}`);
        this.consola.print(`- Pago para no generar intereses: $${estado.pagoNoIntereses.toFixed(2)}`);
        this.consola.print(`EFECTIVO DISPONIBLE: $${estado.efectivoDisponible.toFixed(2)}`, 'info');
        this.consola.print(`DISPONIBLE PARA RETIRO: $${estado.maxRetiro.toFixed(2)} (Comisión: ${(estado.comisionPct*100).toFixed(0)}% + IVA)`, 'error');

        let msgs = [];
        let opciones = [];

        if (estado.efectivoDisponible >= estado.pagoMinimo && estado.pagoMinimo > 0) {
            opciones.push('1');
            msgs.push(`[1] Pagar Mínimo ($${estado.pagoMinimo.toFixed(2)})`);
        }
        if (estado.efectivoDisponible >= estado.pagoNoIntereses && estado.pagoNoIntereses > 0) {
            opciones.push('2');
            msgs.push(`[2] Pago para no generar intereses ($${estado.pagoNoIntereses.toFixed(2)})`);
        }
        if (estado.efectivoDisponible > 0) {
            opciones.push('3');
            msgs.push(`[3] Otro Monto para Abono`);
        }
        if (estado.maxRetiro > 0) {
            opciones.push('5');
            msgs.push(`[5] RETIRAR EFECTIVO DE TDC`);
        }
        opciones.push('4');
        msgs.push(`[4] Salir`);

        this.consola.print(msgs.join('  |  '));
        const opcion = await this.consola.prompt(`Elige una operación (${opciones.join(', ')}):`, opciones);

        if (opcion === '3') {
            let numParsed = -1;
            while (numParsed <= 0 || numParsed > estado.efectivoDisponible) {
                const amountInput = await this.consola.prompt(`¿Cuánto deseas abonar? ($1 - $${estado.efectivoDisponible.toFixed(2)}):`);
                numParsed = parseFloat(amountInput);
                if (isNaN(numParsed) || numParsed <= 0 || numParsed > estado.efectivoDisponible) {
                    this.consola.print(`Monto no válido.`, 'warning');
                    numParsed = -1;
                }
            }
            return { tipo: 'PARCIAL', monto: numParsed };
        }

        if (opcion === '5') {
            let numRetiro = -1;
            while (numRetiro <= 0 || numRetiro > estado.maxRetiro) {
                const amountRetiro = await this.consola.prompt(`¿Cuánto vas a retirar? (Max $${estado.maxRetiro.toFixed(2)}):`);
                numRetiro = parseFloat(amountRetiro);
                if (isNaN(numRetiro) || numRetiro <= 0 || numRetiro > estado.maxRetiro) {
                    this.consola.print(`Monto fuera de límites de disposición.`, 'warning');
                    numRetiro = -1;
                }
            }
            return { tipo: 'RETIRO', monto: numRetiro };
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
        this.consola.print(`\n[¡ENFRENTAMIENTO EN ${gasto.localizacion}!] Gasto: ${gasto.nombre}`);
        this.consola.print(`Categoría: ${gasto.categoria} | Monto Final: $${gasto.monto.toFixed(2)}`);

        let opciones = [];
        let descP = [];

        if (estado.efectivoDisponible >= gasto.monto) {
            opciones.push('d');
            descP.push('d: Pagar Efectivo');
        }

        if (estado.creditoDisponible >= gasto.monto) {
            opciones.push('t');
            descP.push('t: Pagar TDC');

            if (gasto.aceptaMSI) {
                opciones.push('m');
                descP.push('m: Pagar con MSI');
            }
        }

        if (puedeIgnorar) {
            opciones.push('i');
            descP.push('i: Ignorar (Solo Gustos)');
        }

        opciones.push('s');
        descP.push('s: Regresar (Posponer)');

        if (opciones.length === 1 && opciones[0] === 's') {
            // Check handled by Engine for Game Over, but just in case
        }

        this.consola.print(`Efectivo: $${estado.efectivoDisponible.toFixed(2)} | Crédito: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`Acciones -> ${descP.join(' | ')}`);

        return await this.consola.prompt('Elige: ', opciones);
    }

    async mostrarSelectorMSI(opcionesCuotas) {
        this.consola.print(`\n--- ELIGE EL PLAZO PARA MSI ---`);
        let stringsOp = [];
        let indexOp = [];

        opcionesCuotas.forEach(cuota => {
            if (cuota > 1) {
                stringsOp.push(`[${cuota}] ${cuota} Meses`);
                indexOp.push(cuota.toString());
            }
        });

        this.consola.print(stringsOp.join(' | '));
        const elegido = await this.consola.prompt('Elige el número de meses: ', indexOp);
        return parseInt(elegido);
    }

    mostrarResolucionGastoMSI(cuotas) {
        this.consola.print(`Compra exitosa a ${cuotas} Meses Sin Intereses.`, 'info');
    }
    
    mostrarMensaje(msg) {
        this.consola.print(msg, 'warning');
    }
    
    mostrarGameOverInsolvenciaExtrema(gasto, stage, stats) {
        this.consola.clear();
        this.mostrarFinStage(stage, stats, false);
        this.consola.print(`\n====================================`, 'error');
        this.consola.print('!!!!!!! GAME OVER !!!!!!!', 'error');
        this.consola.print(`CRISIS DE LIQUIDEZ: Requiriendo efectivo para ${gasto.nombre} ($${gasto.monto.toFixed(2)}) y no tienes solvencia ni crédito para rescatarlo.`, 'error');
        this.consola.print('====================================\n', 'error');
    }

    async mostrarMenuDisposicionObligatoria(gasto, maxRetiro, comisionPct) {
        this.consola.print(`\n[¡CRISIS DE LIQUIDEZ!]`, 'warning');
        this.consola.print(`El gasto /${gasto.nombre}/ ($${gasto.monto.toFixed(2)}) ES SOLO EN EFECTIVO y no te alcanza en tu cartera.`, 'warning');
        this.consola.print(`Tienes la posibilidad de retirar efectivo de tu TDC. Max disponible: $${maxRetiro.toFixed(2)}`, 'info');
        this.consola.print(`Comision del retiro: ${(comisionPct*100).toFixed(0)}% + IVA`, 'error');
        
        const decision = await this.consola.prompt(`¿Deseas retirar dinero? Escribe el monto para salvar la semana u oprime Enter para perder el juego:`);
        
        let val = parseFloat(decision);
        if (!isNaN(val) && val > 0) {
             return { monto: val };
        }
        return null;
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
