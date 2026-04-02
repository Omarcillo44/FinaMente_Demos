import { PerfilEnum } from './Enums.js';

export class Jugador {
    constructor(perfil, ingresoInicial, tarjeta) {
        this.perfil = perfil;
        this.ingresoMensual = ingresoInicial;
        this.efectivoDisponible = ingresoInicial;
        this.tarjeta = tarjeta;
        this.scoreCrediticio = 0;
    }

    calcularHP() {
        return this.ingresoMensual - this.tarjeta.calcularPagoMinimo();
    }

    actualizarIngreso(nuevoIngreso) {
        // Se llama al inicio del stage 2 en adelante para ingresos esporádicos, u otros
        this.ingresoMensual = nuevoIngreso;
        this.efectivoDisponible += nuevoIngreso; // Cada mes recibe su ingreso
    }

    pagarConDebito(monto) {
        if (this.efectivoDisponible >= monto) { //¿El efectivo alcanza?
            this.efectivoDisponible -= monto;
            return true; //Sí
        }
        return false; //No
    }

    comprarConTDC(monto) {
        return this.tarjeta.cargoNormal(monto);
    }

    pagarDeudaTDC(monto) {
        //Se reutiliza el método pagarConDebito
        if (this.pagarConDebito(monto)) { //¿Le alcanza para pagar la tarjeta?
            this.tarjeta.recibirPago(monto);
            return true;
        }
        return false;
    }

    //¿Se mueve al motor?
    modificarScore(puntos) {
        this.scoreCrediticio += puntos;
        if (this.scoreCrediticio > 100) this.scoreCrediticio = 100;
        if (this.scoreCrediticio < 0) this.scoreCrediticio = 0;
    }
}
