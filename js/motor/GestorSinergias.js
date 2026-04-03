import { GastoBasico, GastoGusto, GastoSorpresa } from './Gasto.js';
import { GeneradorAleatorio } from './GeneradorAleatorio.js';

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
            } else if (gastos.length === 1) {
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
                        const base = this.montoModificado;
                        const descuento = base * this.descuentoEfectivo;
                        return Math.max(0, base - descuento - this.descuentoFijoEfectivo);
                    }
                });
            }
        }
        
        return oleada;
    }

    static aplicarSinergias(grupo, config) {
        if (!grupo.esGrupo) return;
        
        let numBasicos = 0, numSorpresas = 0, numGustos = 0, numRecurrentes = 0;

        grupo.gastos.forEach(g => {
            if (g.categoria === 'Básico') numBasicos++;
            if (g.categoria === 'Sorpresa') numSorpresas++;
            if (g.categoria === 'Gusto') numGustos++;
            if (g.categoria === 'Recurrente') numRecurrentes++;
        });

        switch (grupo.localizacion) {
            case 'Escuela':
                if (numBasicos >= 2) {
                    grupo.notasSinergia.push("Semana pesada: El básico escolar más caro sube 20%.");
                    let maxBasico = null;
                    grupo.gastos.forEach(g => {
                        if (g.categoria === 'Básico' && (!maxBasico || g.monto > maxBasico.monto)) maxBasico = g;
                    });
                    if (maxBasico) maxBasico.montoModificado *= 1.20;
                }
                if (numBasicos >= 1 && numSorpresas >= 1) {
                    grupo.notasSinergia.push("Y encima la salida: Se arrastra un básico escolar extra obligatorio.");
                    const extra = GeneradorAleatorio.generarGastoAleatorio(config.perfil, "Básico", GastoBasico, 'Escuela');
                    if (extra) { extra.nombre += ' (Arrastrado)'; grupo.gastos.push(extra); }
                }
                grupo.descuentoEfectivo = 0.10;
                grupo.notasSinergia.push("Escuela al contado: Descuento 10% si pagas con Débito/Efectivo.");
                break;
                
            case 'Transporte':
                if (numBasicos >= 1 && numSorpresas >= 1) {
                    grupo.notasSinergia.push("Ya se fue el camión: Te toca pagar transporte y un taxi juntos.");
                }
                grupo.descuentoFijoEfectivo = 15;
                grupo.notasSinergia.push("Tarifa base: Pequeño descuento fijo ($15) si pagas con Efectivo.");
                break;
                
            case 'Consultorio':
                if (numSorpresas >= 2) {
                    grupo.notasSinergia.push("Emergencia Médica Pura: Fusión obligatoria de gastos médicos.");
                }
                grupo.descuentoEfectivo = 0.10;
                grupo.notasSinergia.push("Efectivo en farmacia: Descuento 10% si pagas con Débito/Efectivo.");
                break;
                
            case 'Centro comercial':
                if (numGustos >= 2) {
                    grupo.notasSinergia.push("Ya que estás: Los gustos suben 15%.");
                    grupo.gastos.forEach(g => {
                        if (g.categoria === 'Gusto') g.montoModificado *= 1.15;
                    });
                }
                if (numGustos >= 3) {
                    grupo.notasSinergia.push("Modo antojo: Sumas tanta tentación que aparece un Gusto extra.");
                    const extra = GeneradorAleatorio.generarGastoAleatorio(config.perfil, "Gusto", GastoGusto, 'Centro comercial');
                    if (extra) { extra.nombre += ' (Tentación)'; grupo.gastos.push(extra); }
                }
                // Baratijas suben rules elitted optionally for robust simplicity
                grupo.descuentoEfectivo = 0.10;
                grupo.notasSinergia.push("Efectivo contado: Todos los gustos del Centro Comercial bajan 10% si usas efectivo (tienes autocontrol visual).");
                break;
                
            case 'Recámara':
                if (numRecurrentes >= 2) {
                    grupo.notasSinergia.push("Renewal storm: Muchos cobros digitales te abruman.");
                }
                if (numRecurrentes >= 1 && numGustos >= 1) {
                    grupo.notasSinergia.push("Noche en casa: La comida especial sube 15% por envío.");
                    grupo.gastos.forEach(g => {
                        if (g.categoria === 'Gusto') g.montoModificado *= 1.15;
                    });
                }
                break;

            case 'Supermercado':
                if (numBasicos >= 3) {
                    grupo.notasSinergia.push("Mandado completo: Ahorraste y tienes un descuento.");
                    grupo.gastos.forEach(g => g.montoModificado *= 0.90);
                }
                grupo.eventoImpulsivoCredito = true;
                grupo.notasSinergia.push("Cuidado con TDC: Usar la Tarjeta en el Súper podría provocar que agregues cosas impulsivas al carrito de salida.");
                break;
                
            case 'Oficina':
            case 'Casa':
                if (numRecurrentes >= 1 && numBasicos >= 1) {
                    grupo.notasSinergia.push("Quincena comprometida: Gastos fuertes obligatorios juntos.");
                }
                break;
        }
    }
}
