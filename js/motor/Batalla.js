import { GestorSinergias } from './GestorSinergias.js';

export class Batalla {
    constructor(localizacion, poolGlobal, config) {
        this.localizacion = localizacion;
        this.poolGlobal = poolGlobal;
        this.config = config;
        
        // Filter elements that CAN be bought here
        this.gastos = poolGlobal.filter(g => Object.keys(g.opcionesCompra).includes(localizacion));
        
        // Assign the temporary active multipliers
        this.gastos.forEach(g => {
            const locSpecs = g.opcionesCompra[localizacion];
            g.montoModificado = g.monto * (locSpecs.modMonto || 1.0);
        });

        this.notasSinergia = [];
        this.descuentoEfectivo = 0;
        this.descuentoFijoEfectivo = 0;
        
        // Hacky interface for GestorSinergias compatibility which uses "grupo.esGrupo" checks occasionally
        this.esGrupo = true; 

        // Aplica modificadores ambientales (estrategias polimórficas)
        GestorSinergias.aplicarSinergias(this, config);
    }
    
    get totalSinPagar() {
        return this.gastos.reduce((sum, g) => sum + g.montoModificado, 0);
    }

    eliminarDePool(gasto) {
        const index = this.poolGlobal.indexOf(gasto);
        if (index > -1) {
            this.poolGlobal.splice(index, 1);
        }
        const localIdx = this.gastos.indexOf(gasto);
        if (localIdx > -1) {
            this.gastos.splice(localIdx, 1);
        }
    }
}
