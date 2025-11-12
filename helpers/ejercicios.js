const ejercicios = [
  // Pecho
  { idEjercicio: 1, categoria: "pecho", nombre: "Press plano", tiempoEjecucion: 45 },
  { idEjercicio: 3, categoria: "pecho", nombre: "Press inclinado", tiempoEjecucion: 45 },
  { idEjercicio: 5, categoria: "pecho", nombre: "Press declinado", tiempoEjecucion: 45 },
  { idEjercicio: 10, categoria: "pecho", nombre: "Fondos en paralelas (para pecho)", tiempoEjecucion: 35 },
  { idEjercicio: 11, categoria: "pecho", nombre: "Push-ups (flexiones de pecho)", tiempoEjecucion: 30 },
  { idEjercicio: 122, categoria: "pecho", nombre: "Push-ups inclinado (flexiones de pecho)", tiempoEjecucion: 30 },
  { idEjercicio: 14, categoria: "pecho", nombre: "Aperturas/Crossover (alto)", tiempoEjecucion: 30 },
  { idEjercicio: 15, categoria: "pecho", nombre: "Aperturas/Crossover (medio)", tiempoEjecucion: 30 },
  { idEjercicio: 16, categoria: "pecho", nombre: "Aperturas/Crossover (bajo)", tiempoEjecucion: 30 },

  // Espalda
  { idEjercicio: 17, categoria: "espalda", nombre: "Jalón al pecho (agarre ancho)", tiempoEjecucion: 40 },
  { idEjercicio: 18, categoria: "espalda", nombre: "Jalón al pecho (agarre estrecho)", tiempoEjecucion: 40 },
  { idEjercicio: 19, categoria: "espalda", nombre: "Jalón al pecho (supino)", tiempoEjecucion: 40 },
  { idEjercicio: 20, categoria: "espalda", nombre: "Jalón tras nuca", tiempoEjecucion: 40 },
  { idEjercicio: 21, categoria: "espalda", nombre: "Remo con barra", tiempoEjecucion: 45 },
  { idEjercicio: 23, categoria: "espalda", nombre: "Remo con mancuerna a una mano", tiempoEjecucion: 45 },
  { idEjercicio: 25, categoria: "espalda", nombre: "Remo en polea baja", tiempoEjecucion: 40 },
  { idEjercicio: 26, categoria: "espalda", nombre: "Remo con T-bar", tiempoEjecucion: 45 },
  { idEjercicio: 28, categoria: "espalda", nombre: "Pull-over con mancuerna", tiempoEjecucion: 30 },
  { idEjercicio: 29, categoria: "espalda", nombre: "Pull-over en polea", tiempoEjecucion: 30 },
  { idEjercicio: 30, categoria: "espalda", nombre: "Dominadas (supinas)", tiempoEjecucion: 30 },
  { idEjercicio: 31, categoria: "espalda", nombre: "Dominadas (pronas)", tiempoEjecucion: 30 },
  { idEjercicio: 32, categoria: "espalda", nombre: "Dominadas (neutras)", tiempoEjecucion: 30 },

  // Hombros
  { idEjercicio: 33, categoria: "hombros", nombre: "Press militar", tiempoEjecucion: 45 },
  { idEjercicio: 36, categoria: "hombros", nombre: "Elevaciones laterales", tiempoEjecucion: 30 },
  { idEjercicio: 37, categoria: "hombros", nombre: "Elevaciones frontales", tiempoEjecucion: 30 },
  { idEjercicio: 39, categoria: "hombros", nombre: "Pájaros con mancuerna", tiempoEjecucion: 30 },
  { idEjercicio: 40, categoria: "hombros", nombre: "Face pulls en polea", tiempoEjecucion: 30 },
  { idEjercicio: 41, categoria: "hombros", nombre: "Remo al mentón con barra", tiempoEjecucion: 45 },

  // Bíceps
  { idEjercicio: 43, categoria: "biceps", nombre: "Curl con barra recta", tiempoEjecucion: 30 },
  { idEjercicio: 45, categoria: "biceps", nombre: "Curl con mancuernas", tiempoEjecucion: 30 },
  { idEjercicio: 46, categoria: "biceps", nombre: "Curl martillo", tiempoEjecucion: 30 },
  { idEjercicio: 48, categoria: "biceps", nombre: "Curl predicador", tiempoEjecucion: 30 },
  { idEjercicio: 50, categoria: "biceps", nombre: "Curl bayesiano en polea baja", tiempoEjecucion: 30 },
  { idEjercicio: 51, categoria: "biceps", nombre: "Curl doble en polea alta", tiempoEjecucion: 30 },
  { idEjercicio: 52, categoria: "biceps", nombre: "Curl concentrado (Scott)", tiempoEjecucion: 30 },
  { idEjercicio: 53, categoria: "biceps", nombre: "Curl en máquina", tiempoEjecucion: 30 },

  // Tríceps
  { idEjercicio: 54, categoria: "triceps", nombre: "Extensión en polea alta", tiempoEjecucion: 30 },
  { idEjercicio: 57, categoria: "triceps", nombre: "Extensión sobre la cabeza con mancuerna", tiempoEjecucion: 30 },
  { idEjercicio: 58, categoria: "triceps", nombre: "Extensión sobre la cabeza en polea", tiempoEjecucion: 30 },
  { idEjercicio: 59, categoria: "triceps", nombre: "Press francés", tiempoEjecucion: 40 },
  { idEjercicio: 60, categoria: "triceps", nombre: "Fondos", tiempoEjecucion: 30 },
  { idEjercicio: 62, categoria: "triceps", nombre: "Patada de tríceps", tiempoEjecucion: 30 },
  { idEjercicio: 63, categoria: "triceps", nombre: "Extensión en máquina", tiempoEjecucion: 30 },

  // Antebrazos
  { idEjercicio: 64, categoria: "antebrazos", nombre: "Curl de muñeca supino", tiempoEjecucion: 25 },
  { idEjercicio: 65, categoria: "antebrazos", nombre: "Curl de muñeca prono", tiempoEjecucion: 25 },
  { idEjercicio: 66, categoria: "antebrazos", nombre: "Curl invertido con barra", tiempoEjecucion: 30 },
  { idEjercicio: 67, categoria: "antebrazos", nombre: "Curl invertido con mancuernas", tiempoEjecucion: 30 },
  { idEjercicio: 68, categoria: "antebrazos", nombre: "Hand gripper", tiempoEjecucion: 20 },
  { idEjercicio: 69, categoria: "antebrazos", nombre: "Wrist roller (con cuerda y peso)", tiempoEjecucion: 30 },

  // Cuádriceps
  { idEjercicio: 70, categoria: "cuadriceps", nombre: "Sentadilla tradicional", tiempoEjecucion: 50 },
  { idEjercicio: 71, categoria: "cuadriceps", nombre: "Sentadilla frontal", tiempoEjecucion: 50 },
  { idEjercicio: 72, categoria: "cuadriceps", nombre: "Sentadilla hack", tiempoEjecucion: 45 },
  { idEjercicio: 73, categoria: "cuadriceps", nombre: "Prensa de piernas", tiempoEjecucion: 45 },
  { idEjercicio: 74, categoria: "cuadriceps", nombre: "Zancadas", tiempoEjecucion: 45 },
  { idEjercicio: 76, categoria: "cuadriceps", nombre: "Step-ups con banco", tiempoEjecucion: 40 },
  { idEjercicio: 77, categoria: "cuadriceps", nombre: "Extensiones de piernas en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 78, categoria: "cuadriceps", nombre: "Sentadilla búlgara", tiempoEjecucion: 45 },

  // Isquiotibiales
  { idEjercicio: 79, categoria: "isquiotibiales", nombre: "Peso muerto rumano", tiempoEjecucion: 45 },
  { idEjercicio: 121, categoria: "isquiotibiales", nombre: "Peso muerto convencional", tiempoEjecucion: 50 },
  { idEjercicio: 80, categoria: "isquiotibiales", nombre: "Peso muerto con piernas rígidas", tiempoEjecucion: 45 },
  { idEjercicio: 81, categoria: "isquiotibiales", nombre: "Curl femoral", tiempoEjecucion: 30 },
  { idEjercicio: 84, categoria: "isquiotibiales", nombre: "Sentadilla sissy", tiempoEjecucion: 30 },
  { idEjercicio: 85, categoria: "isquiotibiales", nombre: "Glute ham raise", tiempoEjecucion: 35 },
  { idEjercicio: 86, categoria: "isquiotibiales", nombre: "Good mornings", tiempoEjecucion: 40 },

  // Glúteos
  { idEjercicio: 87, categoria: "gluteos", nombre: "Hip thrust", tiempoEjecucion: 45 },
  { idEjercicio: 89, categoria: "gluteos", nombre: "Patada de glúteo", tiempoEjecucion: 30 },
  { idEjercicio: 90, categoria: "gluteos", nombre: "Abducción en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 91, categoria: "gluteos", nombre: "Zancadas profundas", tiempoEjecucion: 45 },

  // Aductores
  { idEjercicio: 92, categoria: "aductores", nombre: "Aductores en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 93, categoria: "aductores", nombre: "Peso muerto sumo", tiempoEjecucion: 45 },
  { idEjercicio: 94, categoria: "aductores", nombre: "Sentadilla sumo", tiempoEjecucion: 45 },

  // Gemelos
  { idEjercicio: 95, categoria: "gemelos", nombre: "Elevaciones de talones de pie", tiempoEjecucion: 30 },
  { idEjercicio: 96, categoria: "gemelos", nombre: "Elevaciones de talones sentado", tiempoEjecucion: 30 },
  { idEjercicio: 97, categoria: "gemelos", nombre: "Elevaciones unilaterales en escalón", tiempoEjecucion: 30 },

  // Abdominales
  { idEjercicio: 98, categoria: "abdominales", nombre: "Crunch abdominal", tiempoEjecucion: 25 },
  { idEjercicio: 99, categoria: "abdominales", nombre: "Crunch en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 100, categoria: "abdominales", nombre: "Crunch en polea alta", tiempoEjecucion: 30 },
  { idEjercicio: 101, categoria: "abdominales", nombre: "Elevaciones de piernas colgado", tiempoEjecucion: 30 },
  { idEjercicio: 102, categoria: "abdominales", nombre: "Elevaciones de piernas en banco", tiempoEjecucion: 30 },
  { idEjercicio: 103, categoria: "abdominales", nombre: "Plancha", tiempoEjecucion: 60 },
  { idEjercicio: 104, categoria: "abdominales", nombre: "Plancha lateral", tiempoEjecucion: 45 },
  { idEjercicio: 105, categoria: "abdominales", nombre: "Rueda abdominal (ab wheel)", tiempoEjecucion: 30 },
  { idEjercicio: 106, categoria: "abdominales", nombre: "V-ups", tiempoEjecucion: 25 },

  // Lumbares
  { idEjercicio: 107, categoria: "lumbares", nombre: "Extensiones lumbares en banco romano", tiempoEjecucion: 30 },
  { idEjercicio: 108, categoria: "lumbares", nombre: "Supermans", tiempoEjecucion: 30 },
  { idEjercicio: 109, categoria: "lumbares", nombre: "Buenos días (Good mornings)", tiempoEjecucion: 40 },

];

export default ejercicios;
