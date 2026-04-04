export class TarjetaCredito {
    constructor(limiteInicial, config) {
        this.limiteCredito = limiteInicial;
        this.creditoDisponible = limiteInicial; //al empezar se tiene todo el crédito disponible
        this.tasaInteresAnual = config.tasaInteresAnual; //De config porque varía según el personaje
        this.cat = config.cat;
        this.comisionPagoTardio = config.comisionTardio;
        this.saldoInsoluto = 0;
        this.interesesGenerados = 0;
        this.comprasMSI = []; // Desactivado hasta que sepamos qué pedo con los MSI
        this.pagoAcumuladoMes = 0; // Para la fecha límite silenciosa
        
        this.limiteRetiroPct = config.limiteRetiroPct || 0;
        this.comisionRetiroPct = config.comisionRetiroPct || 0;
        this.efectivoDispuesto = 0;
    }

    tasaInteresMensual() {
        return Math.pow(1 + this.tasaInteresAnual, 1 / 12) - 1; //Pura ingeniería económica
    }

    cargoNormal(monto) {
        if (monto > this.creditoDisponible) {
            return false;
        }
        this.creditoDisponible -= monto;
        this.saldoInsoluto += monto;
        return true;
    }

    cargoMSI(monto, cuotas) {
        if (monto > this.creditoDisponible || cuotas <= 1) {
            return false;
        }
        this.creditoDisponible -= monto;
        this.comprasMSI.push({
            montoTotal: monto,
            montoCuota: monto / cuotas,
            cuotasRestantes: cuotas
        });
        return true;
    }

    calcularEfectivoDisponibleParaRetirar() {
        const retiroMaxPermitido = (this.limiteCredito * this.limiteRetiroPct) - this.efectivoDispuesto;
        if (retiroMaxPermitido <= 0) return 0;
        // Evaluar también que el crédito disponible alcance (hay comisiones que luego se clavan extra, pero el base es este)
        return Math.min(this.creditoDisponible, retiroMaxPermitido);
    }

    disponerEfectivo(monto) {
        if (monto <= 0) return false;
        
        const disponible = this.calcularEfectivoDisponibleParaRetirar();
        // Si el monto de capital a sacar supera el límite de disposición o crédito base
        if (monto > disponible) return false;

        const comision = monto * this.comisionRetiroPct;
        const cargoTotal = monto + (comision * 1.16); // IVA del 16% sobre la comisión

        // Puede resultar en crédito negativo si con comisión rompe el tope, pero se permite contablemente
        this.efectivoDispuesto += monto; 
        this.creditoDisponible -= cargoTotal;
        this.saldoInsoluto += cargoTotal;
        return true;
    }

    calcularPagoMinimo() {
        if (this.saldoInsoluto === 0 && this.interesesGenerados === 0) return 0;

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

        // Sumar cuotas de MSI del mes
        const totalCuotasMSI = this.comprasMSI.reduce((sum, compra) => sum + compra.montoCuota, 0);

        const pagoMinimo = Math.max(opcion1, opcion2) + totalCuotasMSI;

        /* 
        Si el pago mínimo es mayor a la deuda total (poco probable pero matemáticamente posible 
        si neta está muy wey para usar la tarjeta)
        */
        const deudaStatus = this.saldoInsoluto + (this.interesesGenerados * 1.16) + this.calcularDeudaMSIPendiente();
        return Math.min(pagoMinimo, deudaStatus);
    }

    calcularDeudaMSIPendiente() {
        return this.comprasMSI.reduce((sum, compra) => sum + (compra.montoCuota * compra.cuotasRestantes), 0);
    }

    calcularUsoTotal() {
        // El uso considera tanto el saldo insoluto como la deuda pendiente de MSI
        return (this.saldoInsoluto + this.calcularDeudaMSIPendiente()) / this.limiteCredito;
    }

    calcularPagoNoGenerarIntereses() {
        // Saldo Insoluto + Intereses acumulados + IVA sobre intereses
        const deudaStatus = this.saldoInsoluto + (this.interesesGenerados * 1.16);
        return Math.max(0, deudaStatus);
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
            const nuevosIntereses = this.saldoInsoluto * this.tasaInteresMensual();
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
        this.efectivoDispuesto = 0;

        // Avanzar MSI: cobrar la cuota y liberar crédito proporcional
        this.comprasMSI.forEach(compra => {
            if (compra.cuotasRestantes > 0) {
                compra.cuotasRestantes--;
                this.creditoDisponible += compra.montoCuota; // Se libera conforme se "paga" en el corte
            }
        });

        // Limpiar compras finalizadas
        this.comprasMSI = this.comprasMSI.filter(compra => compra.cuotasRestantes > 0);
    }
}
