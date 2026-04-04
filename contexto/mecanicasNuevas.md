***

# Diseño Conceptual de Mecánicas Expandidas — FinaMente

Este documento detalla la integración de las nuevas mecánicas al motor de juego de FinaMente. El enfoque principal es mantener una arquitectura limpia, asegurando la separación de responsabilidades y estructurando los datos de forma modular.

---

## 1. Disposición de Efectivo y Crisis de Liquidez

### 1.1. Disposición de Efectivo desde la TDC
Se introduce la disposición de efectivo como una mecánica formal del sistema financiero. Esto permite al jugador obtener liquidez inmediata a costa de su línea de crédito, simulando un escenario real de endeudamiento acelerado.

**Reglas de Negocio:**
El retiro está limitado a un porcentaje del límite de crédito total y genera una comisión inmediata. El Impuesto al Valor Agregado (IVA del 16%) se aplica **estrictamente sobre la comisión**, no sobre el monto de capital retirado.

**Tabla de Condiciones por Perfil:**

| Perfil | Límite Máx. de Retiro | Comisión por Retiro |
| :--- | :--- | :--- |
| Dependiente | 30% | 9% |
| Trabajador | 50% | 8% |
| Independiente | 70% | 7% |
| Esporádico | 40% | 9% |
| Nini | 30% | 9% |

*Justificación Conceptual:* En el sistema financiero mexicano, las instituciones limitan las disposiciones en efectivo (generalmente entre un 20% y 70% de la línea) para mitigar el riesgo de impago. La comisión promedio en el mercado oscila entre el 6% y el 10%. Reflejar esto educa al jugador sobre el alto costo de usar la TDC como cajero automático.

### 1.2. Nuevo Estado: Game Over por Crisis de Liquidez
Se añade una nueva condición de derrota que evalúa la insolvencia total en tiempo real. 

**Condiciones de activación (Deben cumplirse todas simultáneamente):**
1. El jugador enfrenta un gasto obligatorio que **solo acepta efectivo** (`aceptaTDC = false`).
2. El jugador no tiene `efectivoDisponible` suficiente.
3. El jugador no tiene margen de crédito disponible o ha topado su límite de disposición para retirar el efectivo faltante.

*Simula un escenario de la vida real donde la falta de liquidez inmediata impide cubrir necesidades básicas, independientemente de la línea de crédito restante.*

---

## 2. Sistema de Localizaciones y Costos Dinámicos

### 2.1. Modelado de Localizaciones
Las ubicaciones del juego se definen estrictamente mediante un **Enum**, garantizando consistencia en todo el motor:
* `ESCUELA`, `TRANSPORTE`, `CONSULTORIO`, `CENTRO_COMERCIAL`, `RECAMARA`, `SUPERMERCADO`, `CASA_OFICINA`.

### 2.2. Costos Dinámicos por Contexto (`modMonto`)
Los precios de los gastos no son estáticos. Se ven afectados por un modificador de monto (`modMonto`) dependiendo de la localización donde el motor decida "spawnear" el gasto.
*Justificación:* Representa comisiones por uso de terminal en pequeños comercios, recargos por aplicaciones de *delivery*, o el encarecimiento natural de productos en zonas comerciales vs. zonas de bajo costo. 

---

## 3. Métrica de "Calidad de Vida" (CV)

Se integra un nuevo indicador diseñado para medir el bienestar subjetivo del jugador a lo largo de la simulación. 

*Justificación Conceptual:* Ignorar todos los gastos opcionales (gustos) es una estrategia financieramente válida para no endeudarse, pero el juego busca disuadir la austeridad extrema porque, en la vida real, el bienestar importa.

**Atributo en `Jugador`:**
* `calidadVida: Number` (Escala de 0 a 100, inicia en 50).

**Reglas de Cambio Dinámico:**
El impacto en la CV es proporcional al monto del gasto involucrado.

| Evento | Impacto en CV |
| :--- | :--- |
| **Pagar un `GastoGusto`** | Suma puntos proporcionales al monto. Ej: `floor(monto / 75)` |
| **Ignorar un `GastoGusto`** | Resta puntos proporcionales al monto. |
| **Game Over por insolvencia** | El valor de la CV se congela en su estado actual. |

**Impacto en el Juego:**
La CV es **100% narrativa y no competitiva**; NO está ligada al Score Crediticio. Se muestra en los resúmenes entre semanas y su función principal es alimentar el feedback final de la IA. Permite clasificar al jugador en arquetipos (ej. Score alto + CV baja = austeridad insana; Score bajo + CV alta = estilo de vida financiado con deuda).

---

## 4. Estructura y Reglas de Gastos (El Catálogo)

### 4.1. Extracción y Limpieza de Datos
Para evitar el acoplamiento con la lógica de negocio, el catálogo crudo solo aportará: nombres de los gastos, categoría (Básico, Recurrente, Gusto, Sorpresa) y montos base. La elegibilidad de MSI, plazos y modificadores de localización se gestionarán bajo la nueva estructura.

### 4.2. Modelo de Datos del Gasto (DTO)
El nuevo catálogo estático mapeará cada gasto utilizando esta estructura limpia, permitiendo que el generador aleatorio solo aplique multiplicadores sin calcularlos desde cero:

```javascript
{
  nombre: "Despensa quincenal",
  categoria: "Básico",
  monto: 1200,
  esObligatorio: true,
  aceptaMSI: false,
  aceptaTDC: true,
  localizaciones: {
    "Supermercado": { modMonto: 1.0 },   // Precio normal base
    "CasaOficina":  { modMonto: 1.15 }   // 15% más caro (simulando cargo por delivery)
  }
}
```

### 4.3. Elegibilidad para Meses Sin Intereses (MSI)
La disponibilidad de MSI se basa en reglas financieras lógicas:
* **Gastos Básicos:** Pocos MSI disponibles (Ej. 3 a 6 MSI, compras fuertes de despensa).
* **Gastos Recurrentes:** **No aceptan MSI** e inician invariablemente en la `RECAMARA` durante la Semana 1.
* **Gustos:** La mayoría acepta MSI (Ej. 6 a 12 MSI para ropa o viajes).
* **Sorpresas:** Variabilidad alta; la mayor parte acepta MSI (Ej. reparaciones mayores, urgencias médicas).

---

## 5. Sistema de Perfiles (Roles)

Se gestionan mediante un **Enum** (`DEPENDIENTE`, `TRABAJADOR`, `INDEPENDIENTE`, `ESPORADICO`, `NINI`).

### 5.1. Ajustes a Perfiles
* **Esporádico y Nini:** Por coherencia narrativa, estos perfiles **tienen bloqueada la generación de gastos en la localización `ESCUELA`**. 
* **Optimización Visual:** El perfil Nini ahora utiliza nombres de gastos existentes (assets) del resto de los perfiles pero con montos reducidos para adaptarse a su economía de $800 MXN.

### 5.2. Nuevo Perfil: Nini
* **Descripción:** Persona sin empleo formal ni estudios activos.
* **Ingresos:** Altamente variables y bajos (Rango aleatorio: $500 - $2,000).
* **Crédito:** Posee TDC (simulando tarjetas Fintech de muy fácil acceso pero altas comisiones).
* **Narrativa:** Representa al sector de la población en la informalidad que tiene acceso a microcréditos de alto riesgo.

---

## 6. Estabilización de Ciclos y Refuerzo de Estrategia (Sesión Actual)

### 6.1. Inmutabilidad de Gastos Recurrentes
Para permitir una planeación financiera real, los gastos recurrentes (rentas, servicios) dejan de ser aleatorios mes con mes.
- **Congelación al Inicio**: Se seleccionan en el Mes 1 según los rangos del perfil y se mantienen idénticos hasta el Mes 6.
- **Concentración en Semana 1**: Solo aparecen en la primera semana de cada mes.
- **Localización Determinística**: Todos los recurrentes aparecen forzosamente en la `RECAMARA`.

### 6.2. Regla del 80% (Economía Base)
Se ha equilibrado el gasto obligatorio para todos los perfiles:
- **75% a 80% del ingreso** se consume en gastos Básicos y Recurrentes.
- **20% a 25% del ingreso** es el excedente estratégico para el jugador.
- **Ajuste NINI**: Reutilización de assets (Recarga Telcel, Pasajes) con montos reducidos para adaptarse a un ingreso de $800 MXN sin perder coherencia visual.

### 6.3. Visibilidad de Salud Financiera
Se introduce un nuevo indicador clave en todos los resúmenes y en la Banca Móvil:
- **Pago para no generar intereses**: Saldo Insoluto + Intereses acumulados + IVA. 
- Al liquidar este monto, el jugador garantiza que el siguiente mes su deuda no capitalizará intereses.

### 6.4. Navegación y Finalización
- **Banca Móvil Ubicua**: El acceso a pagos y retiros está disponible desde cualquier lugar (`p`) y desde el mapa.
- **Salida Voluntaria (`x`)**: Opción de terminar la partida en cualquier momento (excepto durante un enfrentamiento de gasto) que muestra el resumen final de estadísticas.

### 6.5. Curva de Aprendizaje (Etapa 1)
- **Avisos de Corte**: El recordatorio de pago mínimo aparece a partir de la Semana 2 del **Stage 2**.
- **Multas**: Las multas por pago tardío y reducción de score están desactivadas en el **Stage 1** para permitir que el jugador entienda el flujo sin castigos severos inmediatos.

### 6.6. Sistema de Meses Sin Intereses (MSI) v2
Se ha evolucionado el sistema de pagos diferidos para reflejar plazos reales y su impacto en la liquidez mensual.
- **Configuración por Gasto**: Cada artículo en el catálogo define sus propios plazos disponibles (ej. `MSI: [1, 3, 6, 12]`).
- **Eliminación de Restricciones**: La opción de MSI es accesible para todos los jugadores con crédito suficiente, eliminando la barrera previa de score.
- **Bloqueo de Crédito**: Al comprar a MSI, el 100% del monto se sustrae del `creditoDisponible` para evitar el sobreendeudamiento invisible.
- **Amortización y HP**: Cada mes, el motor añade la cuota proporcional al **Pago Mínimo**. Esto reduce el **HP** (Ingreso - Pago Mínimo) de forma automática, obligando al jugador a planificar sus gastos fijos futuros.
- **Liberación Proporcional**: El crédito disponible se recupera paulatinamente cada mes conforme se procesa el corte de la tarjeta.

***


