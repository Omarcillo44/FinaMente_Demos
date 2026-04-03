
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

    mostrarCambioCalidadVida(delta, nuevaCV) {
        const signo = delta >= 0 ? '+' : '';
        const tipo = delta >= 0 ? 'info' : 'warning';
        this.consola.print(`😊 Calidad de Vida: ${signo}${delta} pts → ${nuevaCV} / 100`, tipo);
    }



    mostrarNotificacionVentanaPagoInmediata() {
        this.consola.print("¡Es Stage 6, recuento final!");
    }

    mostrarVictoria(hp, score, calidadVida) {
        this.consola.print('\n====================================', 'info');
        this.consola.print('! FELICIDADES ! HAS COMPLETADO LOS 6 MESES.', 'prompt');
        this.consola.print(`HP Final: $${hp.toFixed(2)}`);
        this.consola.print(`Score Crediticio Final: ${score.toFixed(0)}`);
        this.consola.print(`Calidad de Vida Final: ${calidadVida} / 100`);
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
                opciones.push(`[${num}] Viajar a: <span style="color: orange">${locArray[i]}</span> (${count} mandados por hacer)`);
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
        this.consola.print(`📍 BATALLA: <span style="color: orange">${batalla.localizacion.toUpperCase()}</span>`, 'system');
        this.consola.print(`========================================`, 'system');

        this.consola.print(`\n[Sinergias Activas]`);
        if (batalla.notasSinergia.length > 0) {
            batalla.notasSinergia.forEach(n => this.consola.print(`> ${n}`, 'info'));
        } else {
            this.consola.print(`> Ninguna sinergia ambiental detectada en esta localización.`, 'system');
        }

        // No hace falta mostrarlo si tenemos arriba el menú.
        //this.consola.print(`\n[Tus Recursos] Efectivo: $${estado.efectivoDisponible.toFixed(2)} | Crédito: $${estado.creditoDisponible.toFixed(2)}`);

        let opciones = [];
        let indexString = [];

        this.consola.print(`\n[Inventario de esta locación]`);
        for (let i = 0; i < batalla.gastos.length; i++) {
            const gasto = batalla.gastos[i];
            const num = (i + 1).toString();

            let descFrac = gasto.descuentoEfectivo || 0;
            let descFijo = gasto.descuentoFijoEfectivo || 0;
            let efectivoFinal = Math.max(0, gasto.montoModificado * (1 - descFrac) - descFijo);

            if (efectivoFinal < gasto.montoModificado) {
                opciones.push(`[${num}] Inspeccionar y Pagar: <span style="color: orange">${gasto.nombre}</span> (TDC: $${gasto.montoModificado.toFixed(2)} | Efvo: $${efectivoFinal.toFixed(2)})`);
            } else {
                opciones.push(`[${num}] Inspeccionar y Pagar: <span style="color: orange">${gasto.nombre}</span> ($${gasto.montoModificado.toFixed(2)})`);
            }
            indexString.push(num);
        }

        // Calcular el descuento por comprar en combo
        const base = batalla.totalSinPagar;
        let efFinal = 0;
        let todosAceptanTDC = true;

        batalla.gastos.forEach(g => {
            let descFrac = g.descuentoEfectivo || 0;
            let descFijo = g.descuentoFijoEfectivo || 0;
            efFinal += Math.max(0, g.montoModificado * (1 - descFrac) - descFijo);
            if (g.aceptaTDC === false) {
                todosAceptanTDC = false;
            }
        });
        const suffix = efFinal < base ? " - Sinergias Aplicadas" : "";

        opciones.push(`\n[Opciones extras]`);
        if (todosAceptanTDC && estado.creditoDisponible >= base) {
            opciones.push(`[t] Comprar TODO lo de aquí con Tarjeta de Crédito ($${base.toFixed(2)})`);
            indexString.push('t');
        } else if (!todosAceptanTDC) {
            opciones.push(`[t] NO DISPONIBLE: Tienes artículos que no aceptan Tarjeta de Crédito.`);
        } else if (estado.creditoDisponible < base) {
            opciones.push(`[t] NO DISPONIBLE: No tienes suficiente límite de crédito para comprar todo de golpe.`);
        }

        if (estado.efectivoDisponible >= efFinal) {
            opciones.push(`[e] Comprar TODO con Efectivo/Débito ($${efFinal.toFixed(2)}${suffix})`);
            indexString.push('e');
        } else {
            opciones.push(`[e] NO DISPONIBLE: No tienes suficiente efectivo para comprar todo de golpe.`);
        }

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
            this.consola.print(`😊 Calidad de Vida: ${estadoExtra.calidadVida} / 100`, 'info');
            this.consola.print(`💳 Pago Mínimo TDC: $${estadoExtra.pagoMinimo.toFixed(2)}`, 'info');
            this.consola.print(`💸 Ingreso Mensual: $${estadoExtra.ingresoMensual.toFixed(2)}`, 'info');

            if (estadoExtra.retroalimentacion && estadoExtra.retroalimentacion.length > 0) {
                this.consola.print(`↳ Actividad Reciente:`, 'system');
                estadoExtra.retroalimentacion.forEach(msg => {
                    this.consola.print(` * ${msg}`, 'prompt');
                });
            } else {
                this.consola.print(`↳ Actividad Reciente: \n   Sin novedades en tu score o límite.`, 'system');
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
        if (estado.creditoDisponible > 0) {
            opciones.push('5');
            msgs.push(`[5] 💸 Disposición de Efectivo (retirar dinero de tu TDC con comisión)`);
        }
        opciones.push('4');
        msgs.push(`[4] Cancelar`);

        this.consola.print(msgs.join('\n'));
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

        if (opcion === '5') return { tipo: 'DISPONER' };

        return { tipo: opcion === '1' ? 'MINIMO' : opcion === '2' ? 'TOTAL' : 'CANCELAR' };
    }

    mostrarAdvertenciaUltimoDia() {
        this.consola.print(`\n⚠️ ¡CUIDADO! Es el último gasto de la semana 2. Si no has cubierto tu pago mínimo de la TDC, enfrentarás multas silenciosas al terminar de pagar esto.`, 'warning');
    }

    async mostrarMenuDisposicion(estado) {
        this.consola.print(`\n>>> DISPOSICIÓN DE EFECTIVO <<<`, 'warning');
        this.consola.print(`⚠️  Esta operación tiene costos inmediatos y genera interés desde el primer día.`, 'warning');
        this.consola.print(`- Crédito Disponible: $${estado.creditoDisponible.toFixed(2)}`);
        this.consola.print(`- Comisión por Disposición: ${(estado.comisionPct * 100).toFixed(0)}% sobre el monto`);
        this.consola.print(`- Cargo de Red (cajero externo): $${estado.cargoRedExterno.toFixed(2)}`);
        this.consola.print(`- Tasa de interés mensual (sin gracia): ${(estado.tasaDisposicionMensual * 100).toFixed(2)}%`);

        let numParsed = -1;
        const maxDisponible = estado.creditoDisponible / (1 + estado.comisionPct); // Lo máximo que pueden sacar dado la comisión
        while (numParsed <= 0 || numParsed > maxDisponible) {
            const amountInput = await this.consola.prompt(`¿Cuánto efectivo deseas retirar? ($1 - $${Math.floor(maxDisponible)}, o '0' para cancelar):`);
            numParsed = parseFloat(amountInput);
            if (numParsed === 0) return { tipo: 'CANCELAR' };
            if (isNaN(numParsed) || numParsed <= 0 || numParsed > maxDisponible) {
                this.consola.print(`Monto inválido. Máximo retirable con comisión incluida: $${Math.floor(maxDisponible)}.`, 'warning');
                numParsed = -1;
            }
        }

        const comisionEstimada = Math.ceil(numParsed * estado.comisionPct * 100) / 100;
        this.consola.print(`\nResumen: Recibes $${numParsed.toFixed(2)} | Comisión inmediata: $${comisionEstimada.toFixed(2)} | Total cargado a TDC: $${(numParsed + comisionEstimada).toFixed(2)}`, 'warning');

        const usaCajero = await this.consola.prompt(`¿Usas cajero externo (+$${estado.cargoRedExterno.toFixed(2)})? [s/n]:`, ['s', 'n']);
        return { tipo: 'DISPONER', monto: numParsed, usaCajeroExterno: usaCajero === 's' };
    }

    mostrarResolucionDisposicion(resultado) {
        this.consola.print(`\n✅ Disposición de Efectivo Exitosa`, 'info');
        this.consola.print(`  Efectivo recibido:  $${resultado.montoRecibido.toFixed(2)}`, 'info');
        this.consola.print(`  Comisión cargada:   $${resultado.comision.toFixed(2)}`, 'warning');
        if (resultado.cargoRed > 0) {
            this.consola.print(`  Cargo Red Cajero:   $${resultado.cargoRed.toFixed(2)}`, 'warning');
        }
        this.consola.print(`⚠️  Recuerda: este saldo genera interés desde HOY, sin periodo de gracia.`, 'warning');
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

    mostrarConsequenciaMSI(comision, esBolaDNieve) {
        this.consola.print('\n⚠️ ¡INCUMPLIMIENTO MSI!', 'error');
        this.consola.print('No cubriste la mensualidad de tus Meses Sin Intereses.', 'error');
        this.consola.print('📌 Consecuencia 1: Perdes el beneficio de 0% intereses — esa deuda ahora genera intereses ordinarios.', 'error');
        this.consola.print(`📌 Consecuencia 2: Comisión por Falta de Pago (Gastos de Cobranza): $${comision.toFixed(2)} cargados a tu cuenta.`, 'error');
        if (esBolaDNieve) {
            this.consola.print('🔴 Consecuencia 3 (BOLA DE NIEVE): ¡2do incumplimiento! El banco cancela TODOS tus planes MSI.', 'error');
            this.consola.print('   Todo el saldo restante de tus MSI se convirtió en deuda revolvente con intereses.', 'error');
        }
    }

    mostrarTarjetaBloqueada(nivelMora, montoRequerido) {
        this.consola.print('\n🔒 ¡TU TARJETA ESTÁ BLOQUEADA!', 'error');
        if (nivelMora === 'leve') {
            this.consola.print('Nivel de mora: LEVE (1 mes). El banco bloqueó tu tarjeta por no cubrir el mínimo.', 'warning');
            this.consola.print(`Para desbloquearla: paga al menos $${montoRequerido.toFixed(2)} (pago mínimo del mes).`, 'warning');
            this.consola.print('Una vez cubierto, el sistema la reactiva en 24-48h (inmediatamente en el juego).', 'info');
        } else if (nivelMora === 'moderado') {
            this.consola.print('Nivel de mora: MODERADO (2-3 meses). Ya eres cliente de riesgo para el banco.', 'error');
            this.consola.print(`Para desbloquearla: debes cubrir TODOS los mínimos vencidos acumulados: $${montoRequerido.toFixed(2)}.`, 'error');
            this.consola.print('Incluso tras pagar, el banco puede reducir tu límite de crédito.', 'warning');
        } else {
            this.consola.print('Nivel de mora: GRAVE (más de 3 meses). Tu deuda fue enviada a cobranza.', 'error');
            this.consola.print(`Para reactivarla: debes pagar el TOTAL de la deuda ($${montoRequerido.toFixed(2)})`, 'error');
            this.consola.print('...o puedes aceptar una "QUITA" (el banco condona 35%, pero cancela tu cuenta definitivamente y mancha tu Buró 6 años).', 'warning');
        }
        this.consola.print('Usa Banca Móvil [p] para realizar tu abono.', 'info');
    }

    async mostrarQuitaOferta(deudaTotal, montoQuitado) {
        this.consola.print('\n--- OFERTA DE QUITA ---', 'warning');
        this.consola.print(`El banco condona $${montoQuitado.toFixed(2)} (35% de tu deuda).`, 'warning');
        this.consola.print(`Solo pagarías: $${(deudaTotal - montoQuitado).toFixed(2)}`, 'warning');
        this.consola.print('⚠️ Consecuencia permanente: tu tarjeta se CANCELA y tendrás una mancha en el Buró por 6 años. -30 pts de Score.', 'error');
        const resp = await this.consola.prompt('¿Aceptas la quita? [s = Sí, n = No, pago el total]:', ['s', 'n']);
        return resp === 's';
    }

    mostrarQuitaAceptada(montoQuitado) {
        this.consola.print('\n========================================', 'error');
        this.consola.print('QUITA ACEPTADA. El banco condonó parte de tu deuda.', 'warning');
        this.consola.print(`Se te quitaron $${montoQuitado.toFixed(2)} de la deuda.`, 'info');
        this.consola.print('Tu tarjeta ha sido CANCELADA definitivamente.', 'error');
        this.consola.print('Esta decisión quedará registrada en tu Buró de Crédito por 6 años.', 'error');
        this.consola.print('========================================\n', 'error');
    }

    mostrarAumentoLinea(limiteViejo, limiteNuevo) {
        this.consola.print(`>>> ¡BUEN HISTORIAL PREMIADO! <<<`, 'prompt');
        this.consola.print(`Tu límite de crédito ha sido aumentado de $${limiteViejo.toFixed(2)} a $${limiteNuevo.toFixed(2)}`, 'prompt');
    }

    async mostrarMenuGasto(gasto, estado, puedeIgnorar, tieneDeuda, batallaContext = null) {
        const montoActivo = gasto.montoModificado !== undefined ? gasto.montoModificado : gasto.monto;
        this.consola.print(`\n[¡GASTO INDIVIDUAL!] Estás inspeccionando: <span style="color: orange">${gasto.nombre}</span>`);

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

        if (estado.tarjetaBloqueada) {
            this.consola.print(`🔒 Tu tarjeta está bloqueada. Solo puedes pagar con efectivo/débito.`, 'error');
        } else {
            if (estado.creditoDisponible >= montoActivo && gasto.aceptaTDC !== false) {
                opciones.push('t');
                descP.push('t: Tarjeta Credito');
            } else if (gasto.aceptaTDC === false) {
                this.consola.print(`(❗) Este gasto tiene restricciones y NO se puede pagar con Tarjeta`, 'warning');
            }

            if (gasto.aceptaMSI && estado.creditoDisponible >= montoActivo) {
                opciones.push('m');
                descP.push('m: Meses Sin Intereses (MSI)');
            }
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

    mostrarResolucionGastoMSI(meses, mensualidad) {
        this.consola.print(`Compra en ${meses} MSI. Mensualidad: $${mensualidad.toFixed(2)}/mes. El crédito está comprometido.`, 'info');
    }

    async mostrarSelectorMSI(montoActivo) {
        const opcionesMeses = ['3', '6', '12'];
        const msgs = opcionesMeses.map(m => `[${m}] ${m} meses ($${(montoActivo / parseInt(m)).toFixed(2)}/mes)`);
        this.consola.print(`\n¿A cuántos meses?`);
        this.consola.print(msgs.join('\n'));
        const elegido = await this.consola.prompt('Elige: ', opcionesMeses);
        return parseInt(elegido);
    }

    mostrarImpulsoSupermercado() {
        this.consola.print('\n(❗) ¡USO DE TARJETA EN SÚPER!', 'warning');
        this.consola.print('Al pagar con tarjeta, pasaste a las cajas y caíste en la tentación impulsiva de llevarte algo extra...', 'warning');
    }

    mostrarResolucionGastoIgnorado() {
        this.consola.print('Has ignorado este gusto.');
    }
}
