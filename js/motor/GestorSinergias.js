/*
Localizaciones:
* Escuela
* Transporte
* Consultorio
* Centro comercial
* Recamara
* Supermercado
* Casa-Oficina
*/


import { GastoBasico, GastoGusto, GastoSorpresa } from './Gasto.js';
import { GeneradorAleatorio } from './GeneradorAleatorio.js';

class SinergiaLocalizacion {
    constructor(grupo, config) {
        this.grupo = grupo;
        this.config = config;
        this.numBasicos = 0;
        this.numSorpresas = 0;
        this.numGustos = 0;
        this.numRecurrentes = 0;

        this._clasificarGastos();
    }

    _clasificarGastos() {
        this.grupo.gastos.forEach(g => {
            if (g.categoria === 'Básico') this.numBasicos++;
            if (g.categoria === 'Sorpresa') this.numSorpresas++;
            if (g.categoria === 'Gusto') this.numGustos++;
            if (g.categoria === 'Recurrente') this.numRecurrentes++;
        });
    }

    aplicar() {
        // Implementado por las subclases abstractas
    }
}

class SinergiaEscuela extends SinergiaLocalizacion {
    aplicar() {
        if (this.numBasicos >= 2 && Math.random() < 0.10) {
            this.grupo.notasSinergia.push("Semana de entregas: Se juntaron los proyectos. Gastas 20% más en el material escolar más caro por compras exprés de pánico o urgencia.");
            let maxBasico = null;
            this.grupo.gastos.forEach(g => {
                if (g.categoria === 'Básico' && (!maxBasico || g.monto > maxBasico.monto)) maxBasico = g;
            });
            if (maxBasico) maxBasico.montoModificado *= 1.20;
        }
        if (this.numBasicos >= 1 && this.numSorpresas >= 1) {
            this.grupo.notasSinergia.push("Y encima la salida: Se arrastra un básico escolar extra obligatorio.");
            const extra = GeneradorAleatorio.generarGastoAleatorio(this.config.perfil, "Básico", GastoBasico, 'Escuela');
            if (extra) { extra.nombre += ' (Arrastrado)'; this.grupo.gastos.push(extra); }
        }
        this.grupo.notasSinergia.push("Efectivo en escuela: Evitas el cobro extra de comisión por usar terminal (ahorro 10% en cosas físicas).");
        this.grupo.gastos.forEach(g => {
            if (g.categoria === 'Básico' && g.tags.includes('fisico')) {
                g.descuentoEfectivo = (g.descuentoEfectivo || 0) + 0.10;
            }
        });
    }
}

class SinergiaTransporte extends SinergiaLocalizacion {
    aplicar() {
        if (this.numBasicos >= 1 && this.numSorpresas >= 1) {
            this.grupo.notasSinergia.push("Ya se fue el camión: Te toca pagar transporte y un taxi juntos.");
        }
        this.grupo.notasSinergia.push("Uso de efectivo: La ruta del transporte público directo es más barata que pedir taxi por app (te ahorras $15).");
        let extraAhorroAplicado = false;
        this.grupo.gastos.forEach(g => {
            if (!extraAhorroAplicado && g.tags.includes('demorado')) {
                g.descuentoFijoEfectivo = (g.descuentoFijoEfectivo || 0) + 15;
                extraAhorroAplicado = true;
            }
        });
    }
}

class SinergiaConsultorio extends SinergiaLocalizacion {
    aplicar() {
        if (this.numSorpresas >= 2) {
            this.grupo.notasSinergia.push("Emergencia Médica Pura: Fusión obligatoria de gastos médicos.");
        }
        this.grupo.notasSinergia.push("Descuento en salud: Muchos consultorios o pequeñas farmacias no te cobran comisión de uso de terminal si pagas de contado en efectivo (ahorro 10%).");
        this.grupo.gastos.forEach(g => {
            if (g.categoria === 'Urgencia') {
                g.descuentoEfectivo = (g.descuentoEfectivo || 0) + 0.10;
            }
        });
    }
}

class SinergiaCentroComercial extends SinergiaLocalizacion {
    aplicar() {
        if (this.numGustos >= 2) {
            this.grupo.notasSinergia.push("Ya que estás: Los gustos suben 15%.");
            this.grupo.gastos.forEach(g => {
                if (g.categoria === 'Gusto') g.montoModificado *= 1.15;
            });
        }
        if (this.numGustos >= 3) {
            this.grupo.notasSinergia.push("Modo antojo: Sumas tanta tentación que aparece un Gusto extra.");
            const extra = GeneradorAleatorio.generarGastoAleatorio(this.config.perfil, "Gusto", GastoGusto, 'Centro comercial');
            if (extra) { extra.nombre += ' (Tentación)'; this.grupo.gastos.push(extra); }
        }
        this.grupo.notasSinergia.push("Presupuesto físico: Al pagar de contado llevas el control visual de tu límite en la cartera y evitas gastos invisibles (ahorras 10% en lujos tangibles).");
        this.grupo.gastos.forEach(g => {
            if (g.categoria === 'Gusto' && g.tags.includes('fisico')) {
                g.descuentoEfectivo = (g.descuentoEfectivo || 0) + 0.10;
            }
        });
    }
}

class SinergiaRecamara extends SinergiaLocalizacion {
    aplicar() {
        /* if (this.numRecurrentes >= 2) {
            this.grupo.notasSinergia.push("Renewal storm: Muchos cobros digitales te abruman.");
        } */
        if (this.numRecurrentes >= 1 && this.numGustos >= 1) {
            this.grupo.notasSinergia.push("Noche en casa: La comida especial sube 15% por envío.");
            this.grupo.gastos.forEach(g => {
                if (g.categoria === 'Gusto') g.montoModificado *= 1.15;
            });
        }
    }
}

class SinergiaSupermercado extends SinergiaLocalizacion {
    aplicar() {
        if (this.numBasicos >= 3) {
            this.grupo.notasSinergia.push("Economía de escala: Surtir la despensa de un jalón en el supermercado te evita viajes costosos a la tiendita entre semana.");
            this.grupo.gastos.forEach(g => g.montoModificado *= 0.90);
        }
    }
}

class SinergiaCasaOficina extends SinergiaLocalizacion {
    aplicar() {
        if (this.numRecurrentes >= 1 && this.numBasicos >= 1) {
            this.grupo.notasSinergia.push("Quincena comprometida: Gastos fuertes obligatorios juntos.");
        }
    }
}

export class GestorSinergias {
    static agruparGastos(gastosPlanos) {
        const grupos = {};

        gastosPlanos.forEach(g => {
            const loc = g.localizacion || 'Genérico';
            if (!grupos[loc]) {
                grupos[loc] = [];
            }
            grupos[loc].push(g);
        });

        const oleada = [];
        for (const loc in grupos) {
            const gastos = grupos[loc];
            if (gastos.length === 1 && loc === 'Genérico') {
                oleada.push(gastos[0]);
            } else {
                oleada.push({
                    esGrupo: true,
                    localizacion: loc,
                    gastos: gastos,
                    nombre: `📍 Misión: ${loc}`,
                    categoria: 'Evento Conjunto',
                    notasSinergia: [],
                    descuentoEfectivo: 0,
                    descuentoFijoEfectivo: 0,
                    eventoImpulsivoCredito: false,
                    get montoPuro() {
                        return this.gastos.reduce((total, g) => total + g.monto, 0);
                    },
                    get montoModificado() { // Default display is without the cash discount (card or general)
                        return this.gastos.reduce((total, g) => total + g.montoModificado, 0);
                    },
                    get montoModificadoEfectivo() { // Si pagas con débito, checa si hay rebajas extra
                        return this.gastos.reduce((total, g) => {
                            let descFrac = g.descuentoEfectivo || 0;
                            let descFijo = g.descuentoFijoEfectivo || 0;
                            return total + Math.max(0, g.montoModificado * (1 - descFrac) - descFijo);
                        }, 0);
                    }
                });
            }
        }

        return oleada;
    }

    static creadoresSinergia = {
        'Escuela': SinergiaEscuela,
        'Transporte': SinergiaTransporte,
        'Consultorio': SinergiaConsultorio,
        'Centro comercial': SinergiaCentroComercial,
        'Recámara': SinergiaRecamara,
        'Supermercado': SinergiaSupermercado,
        'Oficina': SinergiaCasaOficina,
        'Casa': SinergiaCasaOficina
    };

    static aplicarSinergias(grupo, config) {
        if (!grupo.esGrupo) return;
        const ClaseSinergia = this.creadoresSinergia[grupo.localizacion];
        if (ClaseSinergia) {
            const estrategia = new ClaseSinergia(grupo, config);
            estrategia.aplicar();
        }
    }
}
