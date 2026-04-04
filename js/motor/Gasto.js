export class Gasto {
    constructor(datos) {
        this.nombre = datos.nombre;
        this.categoria = datos.categoria;
        this.montoOriginal = datos.monto;
        this.monto = datos.montoFinal || datos.monto;
        this.esObligatorio = datos.esObligatorio;
        this.opcionesMSI = datos.MSI || [1]; // [1] significa pago de contado
        this.aceptaTDC = datos.aceptaTDC;
        this.localizacion = datos.localizacion;
    }

    get aceptaMSI() {
        return this.opcionesMSI.some(cuotas => cuotas > 1);
    }
}

export class GastoRecurrente extends Gasto { }
export class GastoBasico extends Gasto { }
export class GastoSorpresa extends Gasto { }

export class GastoGusto extends Gasto {
    ignorar(jugador) {
        // Ignorar un gusto reduce la calidad de vida
        if (jugador) {
            const castigo = Math.floor(this.montoOriginal / 75);
            jugador.modificarCalidadVida(-castigo);
        }
    }

    pagar(jugador) {
        // Pagar un gusto suma calidad de vida
        if (jugador) {
            const bono = Math.floor(this.montoOriginal / 75);
            jugador.modificarCalidadVida(bono);
        }
    }
}