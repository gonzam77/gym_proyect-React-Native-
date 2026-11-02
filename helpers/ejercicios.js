const ejercicios = [
  // Pecho
  { idEjercicio: 1, categoria: "pecho", nombre: "Press plano", tiempoEjecucion: 45 },
  { idEjercicio: 2, categoria: "pecho", nombre: "Press inclinado", tiempoEjecucion: 45 },
  { idEjercicio: 3, categoria: "pecho", nombre: "Press declinado", tiempoEjecucion: 45 },
  { idEjercicio: 4, categoria: "pecho", nombre: "Fondos en paralelas (para pecho)", tiempoEjecucion: 35 },
  { idEjercicio: 5, categoria: "pecho", nombre: "Push-ups (flexiones de pecho)", tiempoEjecucion: 30 },
  { idEjercicio: 6, categoria: "pecho", nombre: "Push-ups inclinado (flexiones de pecho)", tiempoEjecucion: 30 },
  { idEjercicio: 7, categoria: "pecho", nombre: "Aperturas/Crossover (alto)", tiempoEjecucion: 30 },
  { idEjercicio: 8, categoria: "pecho", nombre: "Aperturas/Crossover (medio)", tiempoEjecucion: 30 },
  { idEjercicio: 9, categoria: "pecho", nombre: "Aperturas/Crossover (bajo)", tiempoEjecucion: 30 },

  // Espalda
  { idEjercicio: 10, categoria: "espalda", nombre: "Jalón al pecho (agarre ancho)", tiempoEjecucion: 40 },
  { idEjercicio: 11, categoria: "espalda", nombre: "Jalón al pecho (agarre estrecho)", tiempoEjecucion: 40 },
  { idEjercicio: 12, categoria: "espalda", nombre: "Jalón al pecho (supino)", tiempoEjecucion: 40 },
  { idEjercicio: 13, categoria: "espalda", nombre: "Jalón tras nuca", tiempoEjecucion: 40 },
  { idEjercicio: 14, categoria: "espalda", nombre: "Remo con barra", tiempoEjecucion: 45 },
  { idEjercicio: 15, categoria: "espalda", nombre: "Remo con mancuerna a una mano", tiempoEjecucion: 45 },
  { idEjercicio: 16, categoria: "espalda", nombre: "Remo en polea baja", tiempoEjecucion: 40 },
  { idEjercicio: 17, categoria: "espalda", nombre: "Remo con T-bar", tiempoEjecucion: 45 },
  { idEjercicio: 18, categoria: "espalda", nombre: "Pull-over con mancuerna", tiempoEjecucion: 30 },
  { idEjercicio: 19, categoria: "espalda", nombre: "Pull-over en polea", tiempoEjecucion: 30 },
  { idEjercicio: 20, categoria: "espalda", nombre: "Dominadas (supinas)", tiempoEjecucion: 30 },
  { idEjercicio: 21, categoria: "espalda", nombre: "Dominadas (pronas)", tiempoEjecucion: 30 },
  { idEjercicio: 22, categoria: "espalda", nombre: "Dominadas (neutras)", tiempoEjecucion: 30 },

  // Hombros
  { idEjercicio: 24, categoria: "hombros", nombre: "Press militar", tiempoEjecucion: 45 },
  { idEjercicio: 25, categoria: "hombros", nombre: "Elevaciones laterales", tiempoEjecucion: 30 },
  { idEjercicio: 26, categoria: "hombros", nombre: "Elevaciones frontales", tiempoEjecucion: 30 },
  { idEjercicio: 27, categoria: "hombros", nombre: "Pájaros con mancuerna", tiempoEjecucion: 30 },
  { idEjercicio: 28, categoria: "hombros", nombre: "Face pulls en polea", tiempoEjecucion: 30 },
  { idEjercicio: 29, categoria: "hombros", nombre: "Remo al mentón con barra", tiempoEjecucion: 45 },

  // Bíceps
  { idEjercicio: 30, categoria: "biceps", nombre: "Curl con barra recta", tiempoEjecucion: 30 },
  { idEjercicio: 31, categoria: "biceps", nombre: "Curl con mancuernas", tiempoEjecucion: 30 },
  { idEjercicio: 32, categoria: "biceps", nombre: "Curl martillo", tiempoEjecucion: 30 },
  { idEjercicio: 33, categoria: "biceps", nombre: "Curl predicador", tiempoEjecucion: 30 },
  { idEjercicio: 34, categoria: "biceps", nombre: "Curl bayesiano en polea baja", tiempoEjecucion: 30 },
  { idEjercicio: 35, categoria: "biceps", nombre: "Curl doble en polea alta", tiempoEjecucion: 30 },
  { idEjercicio: 36, categoria: "biceps", nombre: "Curl concentrado (Scott)", tiempoEjecucion: 30 },
  { idEjercicio: 37, categoria: "biceps", nombre: "Curl en máquina", tiempoEjecucion: 30 },

  // Tríceps
  { idEjercicio: 38, categoria: "triceps", nombre: "Extensión en polea alta", tiempoEjecucion: 30 },
  { idEjercicio: 39, categoria: "triceps", nombre: "Extensión sobre la cabeza con mancuerna", tiempoEjecucion: 30 },
  { idEjercicio: 40, categoria: "triceps", nombre: "Extensión sobre la cabeza en polea", tiempoEjecucion: 30 },
  { idEjercicio: 41, categoria: "triceps", nombre: "Press francés", tiempoEjecucion: 40 },
  { idEjercicio: 42, categoria: "triceps", nombre: "Fondos", tiempoEjecucion: 30 },
  { idEjercicio: 43, categoria: "triceps", nombre: "Patada de tríceps", tiempoEjecucion: 30 },
  { idEjercicio: 44, categoria: "triceps", nombre: "Extensión en máquina", tiempoEjecucion: 30 },

  // Antebrazos
  { idEjercicio: 45, categoria: "antebrazos", nombre: "Curl de muñeca supino", tiempoEjecucion: 25 },
  { idEjercicio: 46, categoria: "antebrazos", nombre: "Curl de muñeca prono", tiempoEjecucion: 25 },
  { idEjercicio: 47, categoria: "antebrazos", nombre: "Curl invertido con barra", tiempoEjecucion: 30 },
  { idEjercicio: 48, categoria: "antebrazos", nombre: "Curl invertido con mancuernas", tiempoEjecucion: 30 },
  { idEjercicio: 49, categoria: "antebrazos", nombre: "Hand gripper", tiempoEjecucion: 20 },
  { idEjercicio: 50, categoria: "antebrazos", nombre: "Wrist roller (con cuerda y peso)", tiempoEjecucion: 30 },

  // Cuádriceps
  { idEjercicio: 51, categoria: "cuadriceps", nombre: "Sentadilla tradicional", tiempoEjecucion: 50 },
  { idEjercicio: 52, categoria: "cuadriceps", nombre: "Sentadilla frontal", tiempoEjecucion: 50 },
  { idEjercicio: 53, categoria: "cuadriceps", nombre: "Sentadilla hack", tiempoEjecucion: 45 },
  { idEjercicio: 54, categoria: "cuadriceps", nombre: "Prensa de piernas", tiempoEjecucion: 45 },
  { idEjercicio: 55, categoria: "cuadriceps", nombre: "Zancadas", tiempoEjecucion: 45 },
  { idEjercicio: 56, categoria: "cuadriceps", nombre: "Step-ups con banco", tiempoEjecucion: 40 },
  { idEjercicio: 57, categoria: "cuadriceps", nombre: "Extensiones de piernas en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 58, categoria: "cuadriceps", nombre: "Sentadilla búlgara", tiempoEjecucion: 45 },

  // Isquiotibiales
  { idEjercicio: 59, categoria: "isquiotibiales", nombre: "Peso muerto rumano", tiempoEjecucion: 45 },
  { idEjercicio: 60, categoria: "isquiotibiales", nombre: "Peso muerto convencional", tiempoEjecucion: 50 },
  { idEjercicio: 61, categoria: "isquiotibiales", nombre: "Peso muerto con piernas rígidas", tiempoEjecucion: 45 },
  { idEjercicio: 62, categoria: "isquiotibiales", nombre: "Curl femoral", tiempoEjecucion: 30 },
  { idEjercicio: 63, categoria: "isquiotibiales", nombre: "Sentadilla sissy", tiempoEjecucion: 30 },
  { idEjercicio: 64, categoria: "isquiotibiales", nombre: "Glute ham raise", tiempoEjecucion: 35 },
  { idEjercicio: 65, categoria: "isquiotibiales", nombre: "Good mornings", tiempoEjecucion: 40 },

  // Glúteos
  { idEjercicio: 66, categoria: "gluteos", nombre: "Hip thrust", tiempoEjecucion: 45 },
  { idEjercicio: 67, categoria: "gluteos", nombre: "Patada de glúteo", tiempoEjecucion: 30 },
  { idEjercicio: 68, categoria: "gluteos", nombre: "Abducción en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 69, categoria: "gluteos", nombre: "Zancadas profundas", tiempoEjecucion: 45 },

  // Aductores
  { idEjercicio: 70, categoria: "aductores", nombre: "Aductores en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 71, categoria: "aductores", nombre: "Peso muerto sumo", tiempoEjecucion: 45 },
  { idEjercicio: 72, categoria: "aductores", nombre: "Sentadilla sumo", tiempoEjecucion: 45 },

  // Gemelos
  { idEjercicio: 73, categoria: "gemelos", nombre: "Elevaciones de talones de pie", tiempoEjecucion: 30 },
  { idEjercicio: 74, categoria: "gemelos", nombre: "Elevaciones de talones sentado", tiempoEjecucion: 30 },
  { idEjercicio: 75, categoria: "gemelos", nombre: "Elevaciones unilaterales en escalón", tiempoEjecucion: 30 },

  // Abdominales
  { idEjercicio: 76, categoria: "abdominales", nombre: "Crunch abdominal", tiempoEjecucion: 25 },
  { idEjercicio: 77, categoria: "abdominales", nombre: "Crunch en máquina", tiempoEjecucion: 30 },
  { idEjercicio: 78, categoria: "abdominales", nombre: "Crunch en polea alta", tiempoEjecucion: 30 },
  { idEjercicio: 79, categoria: "abdominales", nombre: "Elevaciones de piernas colgado", tiempoEjecucion: 30 },
  { idEjercicio: 80, categoria: "abdominales", nombre: "Elevaciones de piernas en banco", tiempoEjecucion: 30 },
  { idEjercicio: 81, categoria: "abdominales", nombre: "Plancha", tiempoEjecucion: 60 },
  { idEjercicio: 82, categoria: "abdominales", nombre: "Plancha lateral", tiempoEjecucion: 45 },
  { idEjercicio: 83, categoria: "abdominales", nombre: "Rueda abdominal (ab wheel)", tiempoEjecucion: 30 },
  { idEjercicio: 84, categoria: "abdominales", nombre: "V-ups", tiempoEjecucion: 25 },

  // Lumbares
  { idEjercicio: 85, categoria: "lumbares", nombre: "Extensiones lumbares en banco romano", tiempoEjecucion: 30 },
  { idEjercicio: 86, categoria: "lumbares", nombre: "Supermans", tiempoEjecucion: 30 },
  { idEjercicio: 87, categoria: "lumbares", nombre: "Buenos días (Good mornings)", tiempoEjecucion: 40 },

  // --- Funcional (ejercicios por tiempo) ---
  // Respaldo sin conexion del catalogo funcional del servidor (ids 1001+,
  // rutina360_server/src/seeders/ejerciciosFuncionales.js). Van al final y con
  // tipo "funcional": hay nombres repetidos con Fuerza (Crunch abdominal,
  // V-ups...) y quien busca por nombre tiene que encontrar primero el de fuerza.
  // tiempoEjecucion = trabajoSugerido, el tiempo que se propone al elegirlo.
  // Funcional: Core
  { idEjercicio: 1001, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Plancha frontal", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1002, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Plancha alta (brazos extendidos)", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1003, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Plancha lateral izquierda", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1004, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Plancha lateral derecha", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1005, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Plancha con toque de hombros", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1006, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Crunch abdominal", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1007, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Crunch inverso", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1008, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Crunch bicicleta", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1009, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Hollow hold", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1010, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Bicho muerto (dead bug)", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1011, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Elevación de piernas acostado", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1012, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Tijeras (flutter kicks)", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1013, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Russian twist", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1014, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "V-ups", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1015, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Superman", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1016, tipo: "funcional", categoria: "core", grupo: "Core", nombre: "Bird dog", tiempoEjecucion: 40, trabajoSugerido: 40 },

  // Funcional: Cardio
  { idEjercicio: 1017, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Jumping jacks", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1018, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Trote en el lugar", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1019, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Skipping alto", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1020, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Talones a glúteos", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1021, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Mountain climbers", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1022, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Escaladores cruzados", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1023, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Saltar la soga", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1024, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Patinador (skater)", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1025, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Shadow boxing", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1026, tipo: "funcional", categoria: "cardio", grupo: "Cardio", nombre: "Jumping jacks cruzados", tiempoEjecucion: 40, trabajoSugerido: 40 },

  // Funcional: Pliometría
  { idEjercicio: 1027, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Burpees", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1028, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Sentadilla con salto", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1029, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Estocada con salto alternada", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1030, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Saltos al cajón", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1031, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Saltos laterales", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1032, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Rodillas al pecho (tuck jumps)", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1033, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Salto de rana (salto largo)", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1034, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Saltos en estrella", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1035, tipo: "funcional", categoria: "pliometria", grupo: "Pliometría", nombre: "Flexiones pliométricas", tiempoEjecucion: 30, trabajoSugerido: 30 },

  // Funcional: Tren inferior
  { idEjercicio: 1036, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Sentadilla con peso corporal", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1037, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Sentadilla isométrica en pared", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1038, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Sentadilla sumo", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1039, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Estocadas alternadas", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1040, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Estocadas hacia atrás", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1041, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Sentadilla búlgara", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1042, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Puente de glúteos", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1043, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Puente de glúteos a una pierna", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1044, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Step-ups al banco", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1045, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Elevación de talones", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1046, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Patada de glúteo en cuadrupedia", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1047, tipo: "funcional", categoria: "tren inferior", grupo: "Tren inferior", nombre: "Sentadilla goblet con kettlebell", tiempoEjecucion: 40, trabajoSugerido: 40 },

  // Funcional: Tren superior
  { idEjercicio: 1048, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Flexiones de brazos", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1049, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Flexiones con rodillas apoyadas", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1050, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Flexiones diamante", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1051, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Flexiones abiertas", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1052, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Pike push-ups", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1053, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Fondos en banco", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1054, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Plancha a flexión (up-down)", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1055, tipo: "funcional", categoria: "tren superior", grupo: "Tren superior", nombre: "Inchworm (gusano)", tiempoEjecucion: 40, trabajoSugerido: 40 },

  // Funcional: Cuerpo completo
  { idEjercicio: 1056, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Kettlebell swing", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1057, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Thrusters", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1058, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Wall balls", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1059, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Battle ropes", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1060, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Bear crawl (oso)", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1061, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Sprawl", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1062, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Golpe de balón medicinal (slam)", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1063, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Clean con kettlebell", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1064, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Turkish get-up", tiempoEjecucion: 60, trabajoSugerido: 60 },
  { idEjercicio: 1065, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Man makers", tiempoEjecucion: 40, trabajoSugerido: 40 },
  { idEjercicio: 1066, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Remo ergómetro", tiempoEjecucion: 60, trabajoSugerido: 60 },
  { idEjercicio: 1067, tipo: "funcional", categoria: "cuerpo completo", grupo: "Cuerpo completo", nombre: "Air bike", tiempoEjecucion: 60, trabajoSugerido: 60 },

  // Funcional: Movilidad
  { idEjercicio: 1068, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "Círculos de brazos", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1069, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "Círculos de cadera", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1070, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "Gato-camello", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1071, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "Rotaciones torácicas", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1072, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "Sentadilla profunda sostenida", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1073, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "World's greatest stretch", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1074, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "Movilidad de tobillos", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1075, tipo: "funcional", categoria: "movilidad", grupo: "Movilidad", nombre: "90/90 de cadera", tiempoEjecucion: 45, trabajoSugerido: 45 },

  // Funcional: Elongación
  { idEjercicio: 1076, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Isquiotibiales", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1077, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Cuádriceps", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1078, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Pectorales", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1079, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Hombros", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1080, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Tríceps", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1081, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Gemelos", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1082, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Postura del niño", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1083, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Cobra", tiempoEjecucion: 30, trabajoSugerido: 30 },
  { idEjercicio: 1084, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Mariposa (aductores)", tiempoEjecucion: 45, trabajoSugerido: 45 },
  { idEjercicio: 1085, tipo: "funcional", categoria: "elongacion", grupo: "Elongación", nombre: "Figura 4 (glúteo)", tiempoEjecucion: 30, trabajoSugerido: 30 },
];

export default ejercicios;