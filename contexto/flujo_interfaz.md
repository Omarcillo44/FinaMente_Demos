# Diagrama de Flujo de la Interfaz (State Machine)

Este diagrama representa cómo el motor de juego transiciona entre los diferentes estados de la interfaz de usuario. Es fundamental para el equipo de Frontend, ya que define la navegación y las condiciones de espera.

```mermaid
stateDiagram-v2
    [*] --> SeleccionPerfil
    
    state SeleccionPerfil {
        [*] --> MenuRoles
        MenuRoles --> Inicializacion : Perfil Elegido
    }

    state Inicializacion {
        [*] --> BienvenidaHUD
        BienvenidaHUD --> SemanaIniciada : OK (sleep)
    }

    state SemanaIniciada {
        [*] --> Mapa3D
        
        state Mapa3D {
            [*] --> NavegacionLibre
            NavegacionLibre --> BancaMovil : Elegir 'P'
            NavegacionLibre --> Localizacion : Elegir Lugar (Escuela/Super/etc.)
            NavegacionLibre --> ResumenSalida : Elegir 'X'
        }

        state Localizacion {
            [*] --> ListaGastos
            ListaGastos --> Mapa3D : Volver ('S')
            ListaGastos --> BancaMovil : Elegir 'P'
            ListaGastos --> DetalleGasto : Seleccionar Gasto
        }

        state DetalleGasto {
            [*] --> OpcionesPago
            OpcionesPago --> SelectorMSI : Elegir 'M' (MSI)
            OpcionesPago --> BancaMovil : Elegir 'P'
            OpcionesPago --> Resolucion : Pagar (D/T) o Ignorar (I)
            SelectorMSI --> Resolucion : Confirmar Plazo
            Resolucion --> ListaGastos : Continuar
        }

        state BancaMovil {
            [*] --> MenuBanca
            MenuBanca --> ResolucionBanca : Pagar Mínimo/Total/Parcial/Retiro
            MenuBanca --> [*] : Cancelar (Volver)
            ResolucionBanca --> MenuBanca : Refresh
        }
    }

    SemanaIniciada --> ConfirmarAvance : Todos los gastos liquidados
    ConfirmarAvance --> SemanaIniciada : Siguiente Semana
    ConfirmarAvance --> FinMes : Fin Semana 4

    state FinMes {
        [*] --> ResumenMensual
        ResumenMensual --> SemanaIniciada : Siguiente Mes (1..5)
        ResumenMensual --> Victoria : Mes 6 completado
    }

    state FinJuego <<choice>>
    Resolucion --> FinJuego : Evaluando HP
    FinJuego --> GameOver : HP <= 0
    FinJuego --> DetalleGasto : HP > 0

    GameOver --> [*]
    Victoria --> [*]
    ResumenSalida --> [*]
```

### Consideraciones para React + Three.js:

1.  **Estado "Detenido"**: El motor de juego se detiene (usando `await`) cada vez que entra en un estado que requiere entrada del usuario (`Mapa3D`, `ListaGastos`, `DetalleGasto`, `BancaMovil`).
2.  **Transiciones**: Cuando el usuario hace clic en un elemento de Three.js (ej. un edificio en el mapa), la interfaz debe resolver la promesa pendiente del motor para que este avance al siguiente estado (`Localizacion`).
3.  **Superposición (Overlays)**: Los estados `BancaMovil` y `DetalleGasto` pueden ser "modales" que se enciman a la vista actual sin destruirla.
4.  **Game Over**: El estado de `GameOver` puede ocurrir en casi cualquier momento después de una resolución de gasto o un cierre de mes.
