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
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Spotify Premium",
      "categoria": "Recurrente",
      "monto": 129,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Netflix Básico",
      "categoria": "Recurrente",
      "monto": 99,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "PS Plus / Xbox Live",
      "categoria": "Recurrente",
      "monto": 170,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Canva Pro",
      "categoria": "Recurrente",
      "monto": 149,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Pasajes de la semana",
      "categoria": "Básico",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "aburrido",
        "demorado"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Comidas en cafetería",
      "categoria": "Básico",
      "monto": 300,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Copias y engargolados",
      "categoria": "Básico",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1.2
        },
        "Supermercado": {
          "modMonto": 0.9
        },
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Material para maqueta",
      "categoria": "Básico",
      "monto": 200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Útiles escolares",
      "categoria": "Básico",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1.2
        },
        "Supermercado": {
          "modMonto": 0.9
        },
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Salida al cine",
      "categoria": "Gusto",
      "monto": 250,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Skin en videojuego",
      "categoria": "Gusto",
      "monto": 150,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Antojo Starbucks",
      "categoria": "Gusto",
      "monto": 120,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Camiseta nueva",
      "categoria": "Gusto",
      "monto": 300,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Salida por tacos",
      "categoria": "Gusto",
      "monto": 180,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Cable del celular roto",
      "categoria": "Sorpresa",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Taxi por lluvia",
      "categoria": "Sorpresa",
      "monto": 120,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "urgente",
        "demorado"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        },
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Cooperación imprevista",
      "categoria": "Sorpresa",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Reposición de credencial",
      "categoria": "Sorpresa",
      "monto": 180,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Medicamento ligero",
      "categoria": "Sorpresa",
      "monto": 200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Consultorio": {
          "modMonto": 1
        }
      }
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
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Suscripción Gym",
      "categoria": "Recurrente",
      "monto": 400,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Internet de casa",
      "categoria": "Recurrente",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Bundle Streaming",
      "categoria": "Recurrente",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Aporte fijo al hogar",
      "categoria": "Recurrente",
      "monto": 500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Transporte / Gasolina",
      "categoria": "Básico",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "demorado"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        },
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Despensa personal",
      "categoria": "Básico",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Supermercado": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Comidas cerca de oficina",
      "categoria": "Básico",
      "monto": 550,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Útiles y certificaciones",
      "categoria": "Básico",
      "monto": 300,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1.2
        },
        "Supermercado": {
          "modMonto": 0.9
        },
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Aporte extra de limpieza",
      "categoria": "Básico",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Ropa y calzado",
      "categoria": "Gusto",
      "monto": 800,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Salida de fin de semana",
      "categoria": "Gusto",
      "monto": 650,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Videojuego estreno",
      "categoria": "Gusto",
      "monto": 1200,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Cena restaurante",
      "categoria": "Gusto",
      "monto": 450,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Accesorio Tech",
      "categoria": "Gusto",
      "monto": 500,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Reparación de laptop",
      "categoria": "Sorpresa",
      "monto": 1200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Consulta y receta",
      "categoria": "Sorpresa",
      "monto": 800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Multa o trámite",
      "categoria": "Sorpresa",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Regalo de cumpleaños",
      "categoria": "Sorpresa",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Taxi de madrugada",
      "categoria": "Sorpresa",
      "monto": 250,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "urgente",
        "demorado"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        },
        "Consultorio": {
          "modMonto": 1
        }
      }
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
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Servicios (Agua, Luz, Gas)",
      "categoria": "Recurrente",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Plan Celular Premium",
      "categoria": "Recurrente",
      "monto": 499,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Internet Alta Velocidad",
      "categoria": "Recurrente",
      "monto": 550,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Gym / Club Deportivo",
      "categoria": "Recurrente",
      "monto": 600,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Despensa quincenal",
      "categoria": "Básico",
      "monto": 1200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Supermercado": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Transporte / Uber",
      "categoria": "Básico",
      "monto": 800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "demorado"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Oficina": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        },
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Artículos de limpieza",
      "categoria": "Básico",
      "monto": 350,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Comidas del trabajo",
      "categoria": "Básico",
      "monto": 700,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Higiene y cuidado personal",
      "categoria": "Básico",
      "monto": 450,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Boleto de Concierto",
      "categoria": "Gusto",
      "monto": 1500,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Ropa de marca",
      "categoria": "Gusto",
      "monto": 1200,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Cena en lugar exclusivo",
      "categoria": "Gusto",
      "monto": 900,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Viaje exprés",
      "categoria": "Gusto",
      "monto": 2200,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Electrodoméstico menor",
      "categoria": "Gusto",
      "monto": 850,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Emergencia dental",
      "categoria": "Sorpresa",
      "monto": 1800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Reparación de coche/refri",
      "categoria": "Sorpresa",
      "monto": 1500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Mantenimiento hogar",
      "categoria": "Sorpresa",
      "monto": 800,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Medicina especializada",
      "categoria": "Sorpresa",
      "monto": 950,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Seguro / Deducible menor",
      "categoria": "Sorpresa",
      "monto": 2500,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Consultorio": {
          "modMonto": 1
        }
      }
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
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Spotify Estudiante",
      "categoria": "Recurrente",
      "monto": 69,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido",
        "digital"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Suscripción económica",
      "categoria": "Recurrente",
      "monto": 50,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "iCloud / Drive",
      "categoria": "Recurrente",
      "monto": 20,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Membresía escolar",
      "categoria": "Recurrente",
      "monto": 80,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Recámara": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Pasajes en bus",
      "categoria": "Básico",
      "monto": 180,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "aburrido",
        "demorado"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        },
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Comida callejera",
      "categoria": "Básico",
      "monto": 120,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Útiles sueltos",
      "categoria": "Básico",
      "monto": 60,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1.2
        },
        "Supermercado": {
          "modMonto": 0.9
        },
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Aporte simbólico casa",
      "categoria": "Básico",
      "monto": 200,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Higiene básica",
      "categoria": "Básico",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "aburrido"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Cine en promoción",
      "categoria": "Gusto",
      "monto": 100,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Antojo dulce",
      "categoria": "Gusto",
      "monto": 60,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Salida barata con amigos",
      "categoria": "Gusto",
      "monto": 150,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Ropa de segunda mano",
      "categoria": "Gusto",
      "monto": 180,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Centro comercial": {
          "modMonto": 1
        },
        "Recámara": {
          "modMonto": 1.15
        }
      }
    },
    {
      "nombre": "Juego indie en oferta",
      "categoria": "Gusto",
      "monto": 90,
      "esObligatorio": false,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "placer"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Llanta de bici / Taxi",
      "categoria": "Sorpresa",
      "monto": 80,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": false,
      "tags": [
        "urgente",
        "demorado"
      ],
      "opcionesCompra": {
        "Escuela": {
          "modMonto": 1
        },
        "Casa": {
          "modMonto": 1
        },
        "Supermercado": {
          "modMonto": 1
        },
        "Centro comercial": {
          "modMonto": 1
        },
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Medicamento genérico",
      "categoria": "Sorpresa",
      "monto": 120,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Consultorio": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Reposición de llaves",
      "categoria": "Sorpresa",
      "monto": 100,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Cooperación urgente",
      "categoria": "Sorpresa",
      "monto": 70,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
    },
    {
      "nombre": "Reparación de zapatos",
      "categoria": "Sorpresa",
      "monto": 150,
      "esObligatorio": true,
      "aceptaMSI": false,
      "aceptaTDC": true,
      "tags": [
        "urgente"
      ],
      "opcionesCompra": {
        "Casa": {
          "modMonto": 1
        }
      }
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
      const subFiltro = filtrados.filter(g => g.opcionesCompra && Object.keys(g.opcionesCompra).includes(localizacion));
      if (subFiltro.length > 0) filtrados = subFiltro;
    }
    return filtrados;
  }
}
