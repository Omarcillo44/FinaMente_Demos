export class Gasto {
    constructor(datos) {
        this.nombre = datos.nombre;
        this.categoria = datos.categoria;
        this.monto = datos.monto;
        this.esObligatorio = datos.esObligatorio;
        this.aceptaMSI = datos.aceptaMSI;
    }
}

export class GastoRecurrente extends Gasto { }
export class GastoBasico extends Gasto { }
export class GastoSorpresa extends Gasto { }

export class GastoGusto extends Gasto {
    ignorar() {
        // No tiene efecto financiero directo
    }
}