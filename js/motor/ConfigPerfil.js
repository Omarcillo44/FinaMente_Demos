import { PerfilEnum } from './Enums.js';

export const perfilesConfig = {
    [PerfilEnum.DEPENDIENTE]: {
        perfil: PerfilEnum.DEPENDIENTE,
        ingresoFijo: 2000,
        limiteMin: 500,
        limiteMax: 1000,
        tasaInteresAnual: 0.985,
        cat: 1.583,
        comisionTardio: 250,
        limiteRetiroPct: 0.30,
        comisionRetiroPct: 0.09,
        probEvento: 0.50,
        probGusto: 0.90,
        probSorpresa: 0.10,
        recurrentesMin: 2,
        recurrentesMax: 2,
        estructuraSemanal: [
            { semana: 1, recurrentes: 2, basicos: 3, eventos: 0 },
            { semana: 2, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 3, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 4, recurrentes: 0, basicos: 2, eventos: 0 }
        ]
    },
    [PerfilEnum.TRABAJADOR]: {
        perfil: PerfilEnum.TRABAJADOR,
        ingresoMin: 5000,
        ingresoMax: 7000,
        limiteMin: 4000,
        limiteMax: 10000,
        tasaInteresAnual: 0.769,
        cat: 1.360,
        comisionTardio: 300,
        limiteRetiroPct: 0.50,
        comisionRetiroPct: 0.08,
        probEvento: 0.70,
        probGusto: 0.85,
        probSorpresa: 0.15,
        recurrentesMin: 3,
        recurrentesMax: 4,
        estructuraSemanal: [
            { semana: 1, recurrentes: 'ALL', basicos: 3, eventos: 0 },
            { semana: 2, recurrentes: 0, basicos: 3, eventos: 1 },
            { semana: 3, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 4, recurrentes: 0, basicos: 3, eventos: 1 }
        ]
    },
    [PerfilEnum.INDEPENDIENTE]: {
        perfil: PerfilEnum.INDEPENDIENTE,
        ingresoFijo: 9600,
        limiteMin: 6000,
        limiteMax: 16000,
        tasaInteresAnual: 0.550,
        cat: 0.750,
        comisionTardio: 400,
        limiteRetiroPct: 0.70,
        comisionRetiroPct: 0.07,
        probEvento: 0.85,
        probGusto: 0.75,
        probSorpresa: 0.25,
        recurrentesMin: 2,
        recurrentesMax: 2,
        estructuraSemanal: [
            { semana: 1, recurrentes: 2, basicos: 3, eventos: 0 },
            { semana: 2, recurrentes: 0, basicos: 3, eventos: 1 },
            { semana: 3, recurrentes: 0, basicos: 3, eventos: 2 },
            { semana: 4, recurrentes: 0, basicos: 3, eventos: 1 }
        ]
    },
    [PerfilEnum.ESPORADICO]: {
        perfil: PerfilEnum.ESPORADICO,
        ingresoStage1: 1000,
        ingresoMinEsporadico: 500,
        ingresoMaxEsporadico: 2000,
        ingresoStep: 250,
        limiteMin: 500,
        limiteMax: 2000,
        tasaInteresAnual: 1.220,
        cat: 1.485,
        comisionTardio: 300,
        limiteRetiroPct: 0.40,
        comisionRetiroPct: 0.09,
        probEvento: 0.60,
        probGusto: 0.80,
        probSorpresa: 0.20,
        recurrentesMin: 2,
        recurrentesMax: 2,
        estructuraSemanal: [
            { semana: 1, recurrentes: 2, basicos: 3, eventos: 0 },
            { semana: 2, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 3, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 4, recurrentes: 0, basicos: 2, eventos: 1 }
        ]
    },
    [PerfilEnum.NINI]: {
        perfil: PerfilEnum.NINI,
        ingresoStage1: 800,
        ingresoMinEsporadico: 500,
        ingresoMaxEsporadico: 2000,
        ingresoStep: 100,
        limiteMin: 1000,
        limiteMax: 3000,
        tasaInteresAnual: 1.400,
        cat: 1.600,
        comisionTardio: 350,
        limiteRetiroPct: 0.30,
        comisionRetiroPct: 0.09,
        probEvento: 0.50,
        probGusto: 0.70,
        probSorpresa: 0.30,
        recurrentesMin: 1,
        recurrentesMax: 2,
        estructuraSemanal: [
            { semana: 1, recurrentes: 1, basicos: 2, eventos: 1 },
            { semana: 2, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 3, recurrentes: 0, basicos: 2, eventos: 1 },
            { semana: 4, recurrentes: 0, basicos: 2, eventos: 1 }
        ]
    }
};

/*
Estática porque no necesita instanciarse, sólo busca en los enums
y los devuelve
*/
export class ConfigPerfil {
    static get(perfilEnum) {
        return perfilesConfig[perfilEnum];
    }
}
