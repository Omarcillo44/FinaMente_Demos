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
    }

    tasaInteresMensual() {
        return Math.pow(1 + this.tasaInteresAnual, 1 / 12) - 1; //Pura ingeniería económica
    }

    cargoNormal(monto) {
        if (monto > this.creditoDisponible) {
            return false; // Sin crédito disponible, pero no significa gameover
        }
        this.creditoDisponible -= monto;
        this.saldoInsoluto += monto;
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

        // Sumar MSI si estuvieran activados
        const pagoMinimo = Math.max(opcion1, opcion2);

        /* 
        Si el pago mínimo es mayor a la deuda total (poco probable pero matemáticamente posible 
        si neta está muy wey para usar la tarjeta)
        */
        const deudaStatus = this.saldoInsoluto + this.interesesGenerados + (this.interesesGenerados * 0.16);
        return Math.min(pagoMinimo, deudaStatus);
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
            if (montoRestante >= this.saldoInsoluto) {
                // Pago total
                this.creditoDisponible += this.saldoInsoluto; //Se recupera la línea
                this.saldoInsoluto = 0; //Se reestablece el saldo
            } else {
                // Pago parcial
                this.saldoInsoluto -= montoRestante; //Se reduce el saldo
                this.creditoDisponible += montoRestante; //Se libera parte del crédito consumido
            }
        }
    }
}
