# Reporte de Diferencias en Mecánicas: Implementación vs InformeGameplayV3

Este documento detalla las diferencias conceptuales, funcionales y estructurales entre el código fuente actual y la especificación original en `InformeGameplayV3.md`.

## 1. Sistema de Pagos a la Tarjeta (Ventana de Pago vs Abono Voluntario)

**En el Informe original:**
- Existía una entidad llamada **Ventana de Pago** (con estados `ABIERTA`, `EXPIRADA`, `INMEDIATA`) que dictaba que el jugador solo podía pagar su tarjeta durante las semanas 1 y 2 del mes.
- El motor gestionaba esto mediante una transición de estados en `avanzarVentana()`.

**En la implementación actual:**
- Se eliminó por completo `VentanaPagoEnum` y el método `avanzarVentana()`.
- Se introdujo el **Abono Voluntario** a través de `realizarAbonoVoluntarioTDC()`.
- El jugador no está confinado a semanas; puede solicitar detenerse a abonar dinero en la tarjeta **en cualquier momento**, usando la opción "p" (Pagar TDC) cada que enfrenta un gasto en la pantalla.
- Se diversificaron las opciones: ahora se puede aportar un **Pago Parcial** (monto variable del usuario), en contraste con sólo escoger "Total" o "Mínimo".

## 2. Fecha de Vencimiento / Revisión Silenciosa

**En el Informe original:**
- La expiración de la ventana (al llegar al último gasto de la quincena 2) provocaba una penalización del pago directamente de forma atada.

**En la implementación actual:**
- En la clase `TarjetaCredito` se introduce el atributo `pagoAcumuladoMes`.
- Al final de la **semana 2**, el motor efectúa una **revisión silenciosa** calculando el pago mínimo actual y comparándolo a los abonos con `evaluarSiCumplioPagoMinimo(pagoMinimo)`.
- Beneficio de Flexibilidad: El jugador pudo haber dado tres abonos mensuales menores en distintos momentos; siempre que la sumatoria cumpla el mínimo de Banxico, pasa limpio.
- Si no cumple, el juego aplica la comisión y descuenta `-20 pts` de su score.
- Se reinicia esta cuenta mensualmente mediante el nuevo método `reiniciarCicloDePago()`.

## 3. Generación Sistémica de Intereses (Cambio de ciclo)

**En el Informe original:**
- La fórmula del interés mensual existía (y su cobranza de retardo), pero en el ciclo del juego, no se estipulaba un desencadenador exacto programado para saldos que no lleguen a saldarse al concluir el total de las semanas.

**En la implementación actual:**
- Se formaliza mediante un cierre de facturación usando el método `generarIntereses()` de la `TarjetaCredito`.
- Se corre automáticamente **al terminar el último gasto del Stage (mes)**.
- Se calculan sobre lo que quedó de `saldoInsoluto`, se le agrega su respectivo IVA y en vez de restarle salud, el banco penaliza la disponibilidad reduciendo directamente el `creditoDisponible`.

## 4. Prioridad Jurídica en Recepción de Pagos

**En el Informe original:**
- Un pago al recibirse simplemente "eliminaba la deuda", o se mantenían "intereses activos" con un mínimo. Era conceptual.

**En la implementación actual:**
- Para la opción de pago Parcial, la lógica de `recibirPago(monto)` se programó con la regla real del Banco de México:
  1. Primero, el depósito se absorbe pagando el total de intereses y el IVA moratorio cargado. Esto aligera el daño, devolviendo también "crédito disponible".
  2. Si tras devorar los intereses hay dinero sobrante (saldo remanente), ese depósito pasa libremente e impacta sobre el capital de la deuda (`saldoInsoluto`).

## 5. Decisiones de Puntuación (Score)

**En el Informe original:**
- Evaluar el % de deuda en la semana 4.

**En la implementación actual:**
- Siguen los mismos castigos sobre uso excesivo de línea en `MotorJuego` al terminar el stage (+5 puntos por <60%, -5 por >=90%).
- También se premia con +10 al Score si abonas un pago de liquidación TOTAL en la primera semana (comportamiento muy temprano), contra +5 el resto del mes. Requerir pagar el mínimo da de plano +0 pts (solo te rescata del tardío).

## 6. Conclusión Inmediata (Stage 6)

**En el Informe original:**
- La ventana se forzaba a `INMEDIATA`.

**En la implementación actual:**
- Como ya no hay ventana explícita, durante el paso final del Stage 6 el juego invoca inmediatamente un abono obligatorio de liquidación forzada llamando a `realizarAbonoVoluntarioTDC()`.