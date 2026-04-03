import { Consola } from './ui/Consola.js';
import { ControladorVista } from './ui/ControladorVista.js';
import { MotorJuego } from './motor/MotorJuego.js';
import { PerfilEnum } from './motor/Enums.js';

window.addEventListener('DOMContentLoaded', async () => {
    const consola = new Consola();
    const vista = new ControladorVista(consola);
    
    while (true) {
        consola.clear();
        vista.consola.hideHeader();

        const motor = new MotorJuego(vista);

        consola.print('============================================', 'info');
        consola.print('             F i n a M e n t e              ', 'info');
        consola.print('          Demo Consola Lógica V1            ', 'info');
        consola.print('============================================\n', 'info');

        await consola.sleep(1000);

        consola.print('Por favor, selecciona un perfil para jugar:');
        consola.print(`1. DEPENDIENTE   (Ingreso $2000, apoyado por padres)`);
        consola.print(`2. ESPORADICO    (Ingresos variables, inestable)`);
        consola.print(`3. TRABAJADOR    (Ingreso $5000-$7000, gastos medios)`);
        consola.print(`4. INDEPENDIENTE (Ingreso fijo, fuertes gastos fijos)`);

        const opcion = await consola.prompt('Elige (1-4): ', ['1', '2', '3', '4']);

        let perfilSeleccionado;
        switch(opcion) {
            case '1': perfilSeleccionado = PerfilEnum.DEPENDIENTE; break;
            case '2': perfilSeleccionado = PerfilEnum.ESPORADICO; break;
            case '3': perfilSeleccionado = PerfilEnum.TRABAJADOR; break;
            case '4': perfilSeleccionado = PerfilEnum.INDEPENDIENTE; break;
        }

        consola.clear();
        await motor.iniciarJuego(perfilSeleccionado);
        
        await consola.prompt('\nFin del juego. Presiona [Enter] para volver al menú principal...', ['']);
    }
});
