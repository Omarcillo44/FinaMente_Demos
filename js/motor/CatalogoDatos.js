/*
* JSON para acceder al catálogo de gastos por personaje y categoría
* Los elementos pueden cambiar de valor, pero no pueden reasignarse,
* es decir, no pueden cambiar el nombre del atributo ni su tipo de contenido
*/

export const catalogoGastosDatos = {
  "DEPENDIENTE": [
    {
      "nombre": "Recarga Telcel",
      "categoria": "Recurrente",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Spotify Premium",
      "categoria": "Recurrente",
      "monto": 129,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Netflix Básico",
      "categoria": "Recurrente",
      "monto": 99,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "PS Plus / Xbox Live",
      "categoria": "Recurrente",
      "monto": 170,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Canva Pro",
      "categoria": "Recurrente",
      "monto": 149,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Pasajes de la semana",
      "categoria": "Básico",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Transporte",
      "tags": [
        "aburrido",
        "demorado"
      ]
    },
    {
      "nombre": "Comidas en cafetería",
      "categoria": "Básico",
      "monto": 300,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Escuela",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Copias y engargolados",
      "categoria": "Básico",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Escuela",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Material para maqueta",
      "categoria": "Básico",
      "monto": 200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Escuela",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Útiles escolares",
      "categoria": "Básico",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Escuela",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Salida al cine",
      "categoria": "Gusto",
      "monto": 250,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Skin en videojuego",
      "categoria": "Gusto",
      "monto": 150,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "placer",
        "digital"
      ]
    },
    {
      "nombre": "Antojo Starbucks",
      "categoria": "Gusto",
      "monto": 120,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Camiseta nueva",
      "categoria": "Gusto",
      "monto": 300,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Salida por tacos",
      "categoria": "Gusto",
      "monto": 180,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Cable del celular roto",
      "categoria": "Sorpresa",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "urgente",
        "digital"
      ]
    },
    {
      "nombre": "Taxi por lluvia",
      "categoria": "Sorpresa",
      "monto": 120,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Transporte",
      "tags": [
        "urgente",
        "demorado"
      ]
    },
    {
      "nombre": "Cooperación imprevista",
      "categoria": "Sorpresa",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Reposición de credencial",
      "categoria": "Sorpresa",
      "monto": 180,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Medicamento ligero",
      "categoria": "Sorpresa",
      "monto": 200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Consultorio",
      "tags": [
        "urgente"
      ]
    }
  ],
  "TRABAJADOR": [
    {
      "nombre": "Plan Celular",
      "categoria": "Recurrente",
      "monto": 399,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Suscripción Gym",
      "categoria": "Recurrente",
      "monto": 400,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Internet de casa",
      "categoria": "Recurrente",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Bundle Streaming",
      "categoria": "Recurrente",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Aporte fijo al hogar",
      "categoria": "Recurrente",
      "monto": 500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Transporte / Gasolina",
      "categoria": "Básico",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Transporte",
      "tags": [
        "aburrido",
        "demorado"
      ]
    },
    {
      "nombre": "Despensa personal",
      "categoria": "Básico",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Supermercado",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Comidas cerca de oficina",
      "categoria": "Básico",
      "monto": 550,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Útiles y certificaciones",
      "categoria": "Básico",
      "monto": 300,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Escuela",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Aporte extra de limpieza",
      "categoria": "Básico",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Ropa y calzado",
      "categoria": "Gusto",
      "monto": 800,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Salida de fin de semana",
      "categoria": "Gusto",
      "monto": 650,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Videojuego estreno",
      "categoria": "Gusto",
      "monto": 1200,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "placer",
        "digital"
      ]
    },
    {
      "nombre": "Cena restaurante",
      "categoria": "Gusto",
      "monto": 450,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Accesorio Tech",
      "categoria": "Gusto",
      "monto": 500,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Reparación de laptop",
      "categoria": "Sorpresa",
      "monto": 1200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Consulta y receta",
      "categoria": "Sorpresa",
      "monto": 800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Consultorio",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Multa o trámite",
      "categoria": "Sorpresa",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Regalo de cumpleaños",
      "categoria": "Sorpresa",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Taxi de madrugada",
      "categoria": "Sorpresa",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Transporte",
      "tags": [
        "urgente",
        "demorado"
      ]
    }
  ],
  "INDEPENDIENTE": [
    {
      "nombre": "Renta de departamento",
      "categoria": "Recurrente",
      "monto": 3500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Servicios (Agua, Luz, Gas)",
      "categoria": "Recurrente",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Plan Celular Premium",
      "categoria": "Recurrente",
      "monto": 499,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Internet Alta Velocidad",
      "categoria": "Recurrente",
      "monto": 550,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Gym / Club Deportivo",
      "categoria": "Recurrente",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Despensa quincenal",
      "categoria": "Básico",
      "monto": 1200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Supermercado",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Transporte / Uber",
      "categoria": "Básico",
      "monto": 800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Transporte",
      "tags": [
        "aburrido",
        "demorado"
      ]
    },
    {
      "nombre": "Artículos de limpieza",
      "categoria": "Básico",
      "monto": 350,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Comidas del trabajo",
      "categoria": "Básico",
      "monto": 700,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Higiene y cuidado personal",
      "categoria": "Básico",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Boleto de Concierto",
      "categoria": "Gusto",
      "monto": 1500,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Ropa de marca",
      "categoria": "Gusto",
      "monto": 1200,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Cena en lugar exclusivo",
      "categoria": "Gusto",
      "monto": 900,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Viaje exprés",
      "categoria": "Gusto",
      "monto": 2200,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Electrodoméstico menor",
      "categoria": "Gusto",
      "monto": 850,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Emergencia dental",
      "categoria": "Sorpresa",
      "monto": 1800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Consultorio",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Reparación de coche/refri",
      "categoria": "Sorpresa",
      "monto": 1500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Mantenimiento hogar",
      "categoria": "Sorpresa",
      "monto": 800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Medicina especializada",
      "categoria": "Sorpresa",
      "monto": 950,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Seguro / Deducible menor",
      "categoria": "Sorpresa",
      "monto": 2500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Consultorio",
      "tags": [
        "urgente"
      ]
    }
  ],
  "ESPORADICO": [
    {
      "nombre": "Recarga Básica",
      "categoria": "Recurrente",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Spotify Estudiante",
      "categoria": "Recurrente",
      "monto": 69,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Recámara",
      "tags": [
        "aburrido",
        "digital"
      ]
    },
    {
      "nombre": "Suscripción económica",
      "categoria": "Recurrente",
      "monto": 50,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "iCloud / Drive",
      "categoria": "Recurrente",
      "monto": 20,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Membresía escolar",
      "categoria": "Recurrente",
      "monto": 80,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Pasajes en bus",
      "categoria": "Básico",
      "monto": 180,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Transporte",
      "tags": [
        "aburrido",
        "demorado"
      ]
    },
    {
      "nombre": "Comida callejera",
      "categoria": "Básico",
      "monto": 120,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Centro comercial",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Útiles sueltos",
      "categoria": "Básico",
      "monto": 60,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Escuela",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Aporte simbólico casa",
      "categoria": "Básico",
      "monto": 200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Higiene básica",
      "categoria": "Básico",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "aburrido"
      ]
    },
    {
      "nombre": "Cine en promoción",
      "categoria": "Gusto",
      "monto": 100,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Antojo dulce",
      "categoria": "Gusto",
      "monto": 60,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Salida barata con amigos",
      "categoria": "Gusto",
      "monto": 150,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Ropa de segunda mano",
      "categoria": "Gusto",
      "monto": 180,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Centro comercial",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Juego indie en oferta",
      "categoria": "Gusto",
      "monto": 90,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "placer"
      ]
    },
    {
      "nombre": "Llanta de bici / Taxi",
      "categoria": "Sorpresa",
      "monto": 80,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "localizacion": "Transporte",
      "tags": [
        "urgente",
        "demorado"
      ]
    },
    {
      "nombre": "Medicamento genérico",
      "categoria": "Sorpresa",
      "monto": 120,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Consultorio",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Reposición de llaves",
      "categoria": "Sorpresa",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Cooperación urgente",
      "categoria": "Sorpresa",
      "monto": 70,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Genérico",
      "tags": [
        "urgente"
      ]
    },
    {
      "nombre": "Reparación de zapatos",
      "categoria": "Sorpresa",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "localizacion": "Casa",
      "tags": [
        "urgente"
      ]
    }
  ]
};

export class CatalogoGastos {
  static generarGastoAleatorio(perfilEnum, categoria, claseGasto, localizacion = null) {
    const opciones = CatalogoGastos.getGastosPorCategoria(perfilEnum, categoria, localizacion);
    if (!opciones || opciones.length === 0) return null;
    
    const idx = Math.floor(Math.random() * opciones.length);
    const data = opciones[idx];
    return new claseGasto(data);
  }

  static getGastosPorCategoria(perfilEnum, categoria, localizacion = null) {
    const gastos = catalogoGastosDatos[perfilEnum];
    let filtrados = gastos.filter(g => g.categoria === categoria);
    if (localizacion) {
        const subFiltro = filtrados.filter(g => g.localizacion === localizacion);
        if (subFiltro.length > 0) filtrados = subFiltro;
    }
    return filtrados;
  }
}
