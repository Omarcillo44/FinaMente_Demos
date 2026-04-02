export class TarjetaCredito {
    constructor(limiteInicial, config) {
        this.limiteCredito = limiteInicial;
        this.creditoDisponible = limiteInicial;
        this.tasaInteresAnual = config.tasaInteresAnual;
        this.cat = config.cat;
        this.comisionPagoTardio = config.comisionTardio;
        
        this.saldoInsoluto = 0;
        this.interesesGenerados = 0;
        this.comprasMSI = []; // Desactivado por ahora
    }

    tasaInteresMensual() {
        return Math.pow(1 + this.tasaInteresAnual, 1/12) - 1;
    }

    cargoNormal(monto) {
        if (monto > this.creditoDisponible) {
            return false; // No hay crédito suficiente, aunque el game over no es aquí
        }
        this.creditoDisponible -= monto;
        this.saldoInsoluto += monto;
        return true;
    }

    calcularPagoMinimo() {
        if (this.saldoInsoluto === 0 && this.interesesGenerados === 0) return 0;
        
        const opcion1 = (0.015 * this.saldoInsoluto) + this.interesesGenerados + (this.interesesGenerados * 0.16);
        const opcion2 = 0.0125 * this.limiteCredito;
        
        // Sumar MSI si estuvieran activados
        const pagoMinimo = Math.max(opcion1, opcion2);
        
        // Si el pago mínimo es mayor a la deuda total (poco probable pero matemáticamente posible en saldos ínfimos)
        const deudaStatus = this.saldoInsoluto + this.interesesGenerados + (this.interesesGenerados * 0.16);
        return Math.min(pagoMinimo, deudaStatus);
    }

    aplicarCargoTardio() {
        const cargo = this.comisionPagoTardio * 1.16; // Con IVA
        this.creditoDisponible -= cargo; // Se reduce aunque cause crédito disponible negativo
        this.saldoInsoluto += cargo;
        return cargo;
    }

    cerrarMes() {
        // Generar intereses si hay saldo insoluto al final del mes/corte y no se pagó total
        // Esto simplificado: se llamará si no se pagó en la ventana
        if (this.saldoInsoluto > 0) {
            this.interesesGenerados += this.saldoInsoluto * this.tasaInteresMensual();
        }
    }

    recibirPago(monto) {
        // El pago cubre primero intereses e IVA de intereses, luego capital
        let montoRestante = monto;
        let pagoAIntereses = 0;

        const interesesConIva = this.interesesGenerados * 1.16;
        if (montoRestante >= interesesConIva) {
            montoRestante -= interesesConIva;
            pagoAIntereses = interesesConIva;
            this.interesesGenerados = 0;
        } else {
            pagoAIntereses = montoRestante;
            this.interesesGenerados -= (montoRestante / 1.16); // aproximado
            montoRestante = 0;
        }

        if (montoRestante > 0) {
            if (montoRestante >= this.saldoInsoluto) {
                this.creditoDisponible += this.saldoInsoluto;
                this.saldoInsoluto = 0;
            } else {
                this.saldoInsoluto -= montoRestante;
                this.creditoDisponible += montoRestante;
            }
        }
    }
}
