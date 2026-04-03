export class TarjetaCredito {
    constructor(limiteInicial, config) {
        this.limiteCredito = limiteInicial;
        this.creditoDisponible = limiteInicial;
        this.tasaInteresAnual = config.tasaInteresAnual;
        this.cat = config.cat;
        this.comisionPagoTardio = config.comisionTardio;
        this.saldoInsoluto = 0;
        this.saldoDisposicion = 0;    // Saldo de disposición de efectivo (sin gracia, interés diario)
        this.interesesGenerados = 0;
        this.comprasMSI = [];
        this.pagoAcumuladoMes = 0;
        // MSI consequences state
        this.tarjetaBloqueada = false;
        this.mesesIncumplimientoMSI = 0;
        this.comisionFaltaPagoMSI = 450; // $450 MXN fija (rango real: $300-$600)
        // Disposición de efectivo
        this.comisionDisposicion = 0.07;    // 7% sobre el monto retirado
        this.cargoRedCajero = 34.80;         // $30 MXN + 16% IVA = $34.80
    }

    tasaInteresMensual() {
        return Math.pow(1 + this.tasaInteresAnual, 1 / 12) - 1; //Pura ingeniería económica
    }

    // Tasa de interés de disposición: 25% más cara que la tasa normal (sin gracia)
    tasaDisposicionMensual() {
        return this.tasaInteresMensual() * 1.25;
    }

    /**
     * Disposición de efectivo desde la TDC.
     * @param {number} monto - Monto a retirar en pesos.
     * @param {boolean} usaCajeroExterno - Si usa cajero de otro banco (cobra cargo de red).
     * @returns {{ exito: boolean, montoRecibido: number, comision: number, cargoRed: number }}
     */
    disposicionEfectivo(monto, usaCajeroExterno = false) {
        const comision = Math.ceil(monto * this.comisionDisposicion * 100) / 100;
        const cargoRed = usaCajeroExterno ? this.cargoRedCajero : 0;
        const cargoTotal = monto + comision + cargoRed;

        if (cargoTotal > this.creditoDisponible) {
            return { exito: false, montoRecibido: 0, comision, cargoRed };
        }

        // Bloquear el crédito por el total (capital + comisión + red)
        this.creditoDisponible -= cargoTotal;
        // El saldo insoluto crece con todo el cargo
        this.saldoInsoluto += monto;
        this.saldoDisposicion += monto;        // Tracked separado para tasa diferenciada
        this.saldoInsoluto += comision + cargoRed; // Comisión y red también son deuda inmediata

        return { exito: true, montoRecibido: monto, comision, cargoRed };
    }


    cargoNormal(monto) {
        if (monto > this.creditoDisponible) {
            return false; // Sin crédito disponible, pero no significa gameover
        }
        this.creditoDisponible -= monto;
        this.saldoInsoluto += monto;
        return true;
    }

    cargoMSI(monto, meses) {
        if (monto > this.creditoDisponible) {
            return false;
        }
        const mensualidad = monto / meses;
        this.comprasMSI.push({ monto, meses, mensualidad, pagosRestantes: meses });
        this.creditoDisponible -= monto; // Se bloquea el crédito completo desde el inicio
        return true;
    }

    // Se llama una vez al inicio de cada Stage (mes)
    procesarMensualidadesMSI() {
        this.comprasMSI = this.comprasMSI.filter(compra => {
            if (compra.pagosRestantes > 0) {
                // La mensualidad se convierte en deuda normal a pagar ese mes
                this.saldoInsoluto += compra.mensualidad;
                compra.pagosRestantes--;
            }
            return compra.pagosRestantes > 0; // elimina si ya se liquidó
        });
    }

    // Se llama al corte de semana 2 si el pago mínimo NO fue cubierto y hay MSI activos.
    // Devuelve el monto de la comisión aplicada, o 0 si no aplica.
    aplicarConsequenciasMSI() {
        if (this.comprasMSI.length === 0) return 0;

        this.mesesIncumplimientoMSI++;

        // 1. Comisión por Falta de Pago MSI (cargo fijo)
        const comision = this.comisionFaltaPagoMSI * 1.16; // Con IVA
        this.saldoInsoluto += comision;
        this.creditoDisponible -= comision;

        // 2. Efecto "Bola de Nieve": al 2do incumplimiento, se cancela TODO el plan MSI
        if (this.mesesIncumplimientoMSI >= 2) {
            // Cancelar todos los planes MSI: el saldo restante se vuelve deuda revolvente
            let deudaCancelada = 0;
            this.comprasMSI.forEach(compra => {
                // Lo que quedaba por pagar en mensualidades futuras
                const montoRestante = compra.mensualidad * Math.max(0, compra.pagosRestantes - 1);
                deudaCancelada += montoRestante;
                // Nota: la mensualidad del mes actual ya está en saldoInsoluto por procesarMensualidadesMSI
                // El crédito ya está bloqueado correctamente, así que no cambia creditoDisponible
            });
            this.saldoInsoluto += deudaCancelada;
            this.comprasMSI = []; // Se eliminan todos los planes MSI

            // 3. Bloquear la tarjeta
            this.tarjetaBloqueada = true;
        }

        return comision;
    }

    desbloquearTarjeta() {
        this.tarjetaBloqueada = false;
        this.mesesIncumplimientoMSI = 0;
    }

    // Nivel de mora basado en meses de incumplimiento
    get nivelMora() {
        if (this.mesesIncumplimientoMSI <= 1) return 'leve';
        if (this.mesesIncumplimientoMSI <= 3) return 'moderado';
        return 'grave';
    }

    // Cuánto debe pagar para calificar al desbloqueo según el nivel
    montoDesbloqueo() {
        const pagoMinimo = this.calcularPagoMinimo();
        switch (this.nivelMora) {
            case 'leve':
                // Solo el pago mínimo del mes (ya incluye comisión tardío aplicada previamente)
                return pagoMinimo;
            case 'moderado':
                // Todos los mínimos acumulados: aproximado como mesesIncumplimientoMSI × pagoMinimo
                return pagoMinimo * this.mesesIncumplimientoMSI;
            case 'grave':
                // Pago total de la deuda
                return this.saldoInsoluto + this.interesesGenerados * 1.16;
        }
    }

    // Intenta desbloquear la tarjeta; devuelve true si se desbloqueó.
    intentarDesbloqueo(pagoAcumuladoSesion) {
        if (!this.tarjetaBloqueada) return false;
        if (this.nivelMora === 'grave') return false; // requiere quita o pago total
        const requerido = this.montoDesbloqueo();
        if (pagoAcumuladoSesion >= requerido) {
            this.tarjetaBloqueada = false;
            this.mesesIncumplimientoMSI = 0;
            return true;
        }
        return false;
    }

    // Desbloqueo total (sin condición), para uso interno tras pago total
    forzarDesbloqueo() {
        this.tarjetaBloqueada = false;
        this.mesesIncumplimientoMSI = 0;
    }

    // Quita: el banco condona parte de la deuda pero cancela la cuenta
    // Retorna el monto que se le quita (para mostrar en pantalla)
    aceptarQuita(porcentajeQuita = 0.35) {
        const montoQuitado = this.saldoInsoluto * porcentajeQuita;
        this.saldoInsoluto -= montoQuitado;
        this.tarjetaBloqueada = false;
        this.tarjetaCancelada = true; // La cuenta se cancela definitivamente
        this.mesesIncumplimientoMSI = 0;
        this.creditoDisponible = 0;
        this.limiteCredito = 0;
        return montoQuitado;
    }

    calcularPagoMinimo() {
        if (this.saldoInsoluto === 0 && this.interesesGenerados === 0 && this.comprasMSI.length === 0) return 0;

        /*
        Regla de Banxico
        1. 1.5% del saldo insoluto
        2. 1.25% del límite de crédito
        3. Pago mínimo de los intereses generados + IVA
        Se elige el mayor entre los dos primeros, luego este se compara con el tercero
        y se elige el menor
        */
        const opcion1 = (0.015 * this.saldoInsoluto) + this.interesesGenerados + (this.interesesGenerados * 0.16);
        const opcion2 = 0.0125 * this.limiteCredito;

        // Sumar mensualidades MSI pendientes del mes actual
        const totalMSI = this.comprasMSI.reduce((sum, c) => sum + (c.pagosRestantes > 0 ? c.mensualidad : 0), 0);

        const pagoMinimo = Math.max(opcion1, opcion2) + totalMSI;

        /* 
        Si el pago mínimo es mayor a la deuda total (poco probable pero matemáticamente posible 
        si neta está muy wey para usar la tarjeta)
        */
        const deudaStatus = this.saldoInsoluto + this.interesesGenerados + (this.interesesGenerados * 0.16);
        return Math.min(pagoMinimo, deudaStatus + totalMSI);
    }

    aplicarCargoTardio() {
        const cargo = this.comisionPagoTardio * 1.16; // Con IVA
        this.creditoDisponible -= cargo; // Se reduce aunque cause crédito disponible negativo
        this.saldoInsoluto += cargo;
        return cargo;
    }

    // Se llama SI el jugador no hizo el "Pago Total" en su ventana de pago.
    generarIntereses() {
        if (this.saldoInsoluto > 0) {
            // Saldo de compras normales: tasa estándar
            const saldoNormal = Math.max(0, this.saldoInsoluto - this.saldoDisposicion);
            const interesesNormales = saldoNormal * this.tasaInteresMensual();
            // Saldo de disposición: tasa diferenciada (sin gracia)
            const interesesDisposicion = this.saldoDisposicion * this.tasaDisposicionMensual();

            const nuevosIntereses = interesesNormales + interesesDisposicion;
            this.interesesGenerados += nuevosIntereses;

            // El banco te reduce el crédito disponible por los intereses + IVA generados
            const cobroTotalIntereses = nuevosIntereses * 1.16;
            this.creditoDisponible -= cobroTotalIntereses;
        }
    }

    recibirPago(monto) {
        this.pagoAcumuladoMes += monto; // Registro del abono voluntario
        let montoRestante = monto;

        // 1. Prioridad Banxico: primero intereses e IVA de intereses
        const interesesConIva = this.interesesGenerados * 1.16;

        if (montoRestante >= interesesConIva) {
            montoRestante -= interesesConIva;
            // Al pagar el interés, se libera el crédito consumido por los intereses
            this.creditoDisponible += interesesConIva;
            this.interesesGenerados = 0;
        } else {
            // Pago (mínimo) parcial (no liquida, genera intereses)
            this.interesesGenerados -= (montoRestante / 1.16);
            this.creditoDisponible += montoRestante; // Se libera lo que alcanzó a pagar
            montoRestante = 0;
        }

        // 2. Lo que sobra, se va a capital (saldo insoluto)
        if (montoRestante > 0) {
            // Se resta libremente, permitiendo saldos negativos (saldo a favor)
            this.saldoInsoluto -= montoRestante; 
            this.creditoDisponible += montoRestante;
        }
    }

    evaluarSiCumplioPagoMinimo(pagoMinimoGenerado) {
        return this.pagoAcumuladoMes >= pagoMinimoGenerado;
    }

    reiniciarCicloDePago() {
        this.pagoAcumuladoMes = 0;
    }
}
