/*
* JSON para acceder al catálogo de gastos por personaje y categoría
* Los elementos pueden cambiar de valor, pero no pueden reasignarse,
* es decir, no pueden cambiar el nombre del atributo ni su tipo de contenido
*/

export const catalogoGastosDatos = {
  "DEPENDIENTE": [
    { "nombre": "Recarga Telcel", "categoria": "Recurrente", "monto": 150, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Spotify Premium", "categoria": "Recurrente", "monto": 129, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Netflix Básico", "categoria": "Recurrente", "monto": 99, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "PS Plus / Xbox Live", "categoria": "Recurrente", "monto": 170, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Canva Pro", "categoria": "Recurrente", "monto": 149, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Pasajes de la semana", "categoria": "Básico", "monto": 250, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Comidas en cafetería", "categoria": "Básico", "monto": 300, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Copias y engargolados", "categoria": "Básico", "monto": 100, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Material para maqueta", "categoria": "Básico", "monto": 200, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Útiles escolares", "categoria": "Básico", "monto": 150, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Salida al cine", "categoria": "Gusto", "monto": 250, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Skin en videojuego", "categoria": "Gusto", "monto": 150, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Antojo Starbucks", "categoria": "Gusto", "monto": 120, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Camiseta nueva", "categoria": "Gusto", "monto": 300, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Salida por tacos", "categoria": "Gusto", "monto": 180, "esObligatorio": false, "aceptaMSI": false },

    { "nombre": "Cable del celular roto", "categoria": "Sorpresa", "monto": 150, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Taxi por lluvia", "categoria": "Sorpresa", "monto": 120, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Cooperación imprevista", "categoria": "Sorpresa", "monto": 100, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Reposición de credencial", "categoria": "Sorpresa", "monto": 180, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Medicamento ligero", "categoria": "Sorpresa", "monto": 200, "esObligatorio": true, "aceptaMSI": false }
  ],
  "TRABAJADOR": [
    { "nombre": "Plan Celular", "categoria": "Recurrente", "monto": 399, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Suscripción Gym", "categoria": "Recurrente", "monto": 400, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Internet de casa", "categoria": "Recurrente", "monto": 450, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Bundle Streaming", "categoria": "Recurrente", "monto": 250, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Aporte fijo al hogar", "categoria": "Recurrente", "monto": 500, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Transporte / Gasolina", "categoria": "Básico", "monto": 450, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Despensa personal", "categoria": "Básico", "monto": 600, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Comidas cerca de oficina", "categoria": "Básico", "monto": 550, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Útiles y certificaciones", "categoria": "Básico", "monto": 300, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Aporte extra de limpieza", "categoria": "Básico", "monto": 250, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Ropa y calzado", "categoria": "Gusto", "monto": 800, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Salida de fin de semana", "categoria": "Gusto", "monto": 650, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Videojuego estreno", "categoria": "Gusto", "monto": 1200, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Cena restaurante", "categoria": "Gusto", "monto": 450, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Accesorio Tech", "categoria": "Gusto", "monto": 500, "esObligatorio": false, "aceptaMSI": false },

    { "nombre": "Reparación de laptop", "categoria": "Sorpresa", "monto": 1200, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Consulta y receta", "categoria": "Sorpresa", "monto": 800, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Multa o trámite", "categoria": "Sorpresa", "monto": 600, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Regalo de cumpleaños", "categoria": "Sorpresa", "monto": 450, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Taxi de madrugada", "categoria": "Sorpresa", "monto": 250, "esObligatorio": true, "aceptaMSI": false }
  ],
  "INDEPENDIENTE": [
    { "nombre": "Renta de departamento", "categoria": "Recurrente", "monto": 3500, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Servicios (Agua, Luz, Gas)", "categoria": "Recurrente", "monto": 600, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Plan Celular Premium", "categoria": "Recurrente", "monto": 499, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Internet Alta Velocidad", "categoria": "Recurrente", "monto": 550, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Gym / Club Deportivo", "categoria": "Recurrente", "monto": 600, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Despensa quincenal", "categoria": "Básico", "monto": 1200, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Transporte / Uber", "categoria": "Básico", "monto": 800, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Artículos de limpieza", "categoria": "Básico", "monto": 350, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Comidas del trabajo", "categoria": "Básico", "monto": 700, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Higiene y cuidado personal", "categoria": "Básico", "monto": 450, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Boleto de Concierto", "categoria": "Gusto", "monto": 1500, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Ropa de marca", "categoria": "Gusto", "monto": 1200, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Cena en lugar exclusivo", "categoria": "Gusto", "monto": 900, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Viaje exprés", "categoria": "Gusto", "monto": 2200, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Electrodoméstico menor", "categoria": "Gusto", "monto": 850, "esObligatorio": false, "aceptaMSI": false },

    { "nombre": "Emergencia dental", "categoria": "Sorpresa", "monto": 1800, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Reparación de coche/refri", "categoria": "Sorpresa", "monto": 1500, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Mantenimiento hogar", "categoria": "Sorpresa", "monto": 800, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Medicina especializada", "categoria": "Sorpresa", "monto": 950, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Seguro / Deducible menor", "categoria": "Sorpresa", "monto": 2500, "esObligatorio": true, "aceptaMSI": false }
  ],
  "ESPORADICO": [
    { "nombre": "Recarga Básica", "categoria": "Recurrente", "monto": 100, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Spotify Estudiante", "categoria": "Recurrente", "monto": 69, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Suscripción económica", "categoria": "Recurrente", "monto": 50, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "iCloud / Drive", "categoria": "Recurrente", "monto": 20, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Membresía escolar", "categoria": "Recurrente", "monto": 80, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Pasajes en bus", "categoria": "Básico", "monto": 180, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Comida callejera", "categoria": "Básico", "monto": 120, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Útiles sueltos", "categoria": "Básico", "monto": 60, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Aporte simbólico casa", "categoria": "Básico", "monto": 200, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Higiene básica", "categoria": "Básico", "monto": 100, "esObligatorio": true, "aceptaMSI": false },

    { "nombre": "Cine en promoción", "categoria": "Gusto", "monto": 100, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Antojo dulce", "categoria": "Gusto", "monto": 60, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Salida barata con amigos", "categoria": "Gusto", "monto": 150, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Ropa de segunda mano", "categoria": "Gusto", "monto": 180, "esObligatorio": false, "aceptaMSI": false },
    { "nombre": "Juego indie en oferta", "categoria": "Gusto", "monto": 90, "esObligatorio": false, "aceptaMSI": false },

    { "nombre": "Llanta de bici / Taxi", "categoria": "Sorpresa", "monto": 80, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Medicamento genérico", "categoria": "Sorpresa", "monto": 120, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Reposición de llaves", "categoria": "Sorpresa", "monto": 100, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Cooperación urgente", "categoria": "Sorpresa", "monto": 70, "esObligatorio": true, "aceptaMSI": false },
    { "nombre": "Reparación de zapatos", "categoria": "Sorpresa", "monto": 150, "esObligatorio": true, "aceptaMSI": false }
  ]
};

export class CatalogoGastos {
  static getGastosPorCategoria(perfilEnum, categoria) {
    const gastos = catalogoGastosDatos[perfilEnum];
    return gastos.filter(g => g.categoria === categoria);
  }
}
