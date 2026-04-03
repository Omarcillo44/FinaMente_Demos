export class Gasto {
    constructor(datos) {
        this.nombre = datos.nombre;
        this.categoria = datos.categoria;
        this.monto = datos.monto;
        this.esObligatorio = datos.esObligatorio;
        this.aceptaMSI = datos.aceptaMSI;
        this.aceptaTDC = datos.aceptaTDC !== undefined ? datos.aceptaTDC : true;
        this.opcionesCompra = datos.opcionesCompra || { 'Genérico': { modMonto: 1.0 } };
        this.tags = datos.tags || [];
        this.montoModificado = this.monto; // Puede cambiar por sinergias u opciones de eventos
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