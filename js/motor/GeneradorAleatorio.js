import { PerfilEnum } from './Enums.js';
import { GastoRecurrente, GastoBasico, GastoGusto, GastoSorpresa } from './Gasto.js';
import { CatalogoGastos } from './CatalogoDatos.js';

export class GeneradorAleatorio {
    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generarIngresoEsporadico(config) {
        const min = config.ingresoMinEsporadico;
        const max = config.ingresoMaxEsporadico;
        const step = config.ingresoStep;
        
        const steps = (max - min) / step;
        const randomStep = Math.floor(Math.random() * (steps + 1));
        return min + (randomStep * step);
    }

    static generarLimiteInicial(config) {
        return this.randomBetween(config.limiteMin, config.limiteMax);
    }

    static tirarEvento(config) {
        return Math.random() < config.probEvento;
    }

    static tirarTipoEvento(config) {
        // Devuelve 'Gusto' o 'Sorpresa'
        return Math.random() < config.probGusto ? 'Gusto' : 'Sorpresa';
    }

    static generarGastoAleatorio(perfilEnum, categoria, claseGasto, excludeNames = []) {
        let opciones = CatalogoGastos.getGastosPorCategoria(perfilEnum, categoria);
        
        if (excludeNames && excludeNames.length > 0) {
            opciones = opciones.filter(o => !excludeNames.includes(o.nombre));
        }

        if (!opciones || opciones.length === 0) return null;
        
        const idx = Math.floor(Math.random() * opciones.length);
        const data = opciones[idx];
        return new claseGasto(data);
    }

    static generarOleadaSemanal(config, semana, recurrentesGenerados = []) {
        const estructuraObj = config.estructuraSemanal.find(e => e.semana === semana);
        if (!estructuraObj) return [];

        const gastos = [];

        // Recurrentes
        let numRecurrentes = 0;
        if (estructuraObj.recurrentes === 'ALL') {
            const catalogo = CatalogoGastos.getGastosPorCategoria(config.perfil, "Recurrente");
            const disponibles = Math.max(0, catalogo.length - recurrentesGenerados.length);
            numRecurrentes = Math.min(disponibles, this.randomBetween(config.recurrentesMin, config.recurrentesMax));
        } else {
            numRecurrentes = parseInt(estructuraObj.recurrentes) || 0;
        }

        for (let i = 0; i < numRecurrentes; i++) {
            const g = this.generarGastoAleatorio(config.perfil, "Recurrente", GastoRecurrente, recurrentesGenerados);
            if (g) {
                gastos.push(g);
                recurrentesGenerados.push(g.nombre);
            }
        }

        // Basicos
        let numBasicos = parseInt(estructuraObj.basicos) || 0;
        for (let i = 0; i < numBasicos; i++) {
            const g = this.generarGastoAleatorio(config.perfil, "Básico", GastoBasico);
            if (g) gastos.push(g);
        }

        // Eventos
        let numEventos = parseInt(estructuraObj.eventos) || 0;
        for (let i = 0; i < numEventos; i++) {
            if (this.tirarEvento(config)) {
                const tipo = this.tirarTipoEvento(config);
                let g = null;
                if (tipo === 'Gusto') {
                    g = this.generarGastoAleatorio(config.perfil, "Gusto", GastoGusto);
                } else {
                    g = this.generarGastoAleatorio(config.perfil, "Sorpresa", GastoSorpresa);
                }
                if (g) gastos.push(g);
            }
        }

        // Shuffle logic (optional, we can just return)
        return gastos.sort(() => Math.random() - 0.5);
    }

    static evaluarAumentoLinea(score, limiteActual) {
        let prob = 0;
        if (score > 75) prob = 0.70;
        else if (score > 50) prob = 0.40;
        else if (score > 30) prob = 0.15;

        if (Math.random() < prob) {
            const delta = (Math.random() * 0.20) + 0.20; // 0.20 a 0.40
            return limiteActual * (1 + delta);
        }

        return null;
    }
}
