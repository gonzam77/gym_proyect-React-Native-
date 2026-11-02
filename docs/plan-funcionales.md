# Plan: sección Funcional (ejercicios por tiempo)

Plan para `docs/prompt-funcionales.md`. **No se tocó código todavía.** Recorrí los tres
sistemas (app, servidor, dashboard) y el generador de ilustraciones. Abajo están las
cosas del código que obligan a ajustar el documento, el modelo de datos final, los
endpoints, las pantallas, el diagnóstico de ilustraciones y la lista de archivos.

---

## 0. Decisiones (respondidas el 30-10-2026)

1. **Sin filtro de catálogo para apps viejas:** la app se actualiza sola desde Google Play.
   Se mantiene igual el header para asignaciones y compartir (cubre el rato entre que se
   publica el servidor y llega la app nueva), pero los listados de catálogo devuelven todo.
2. **Los funcionales asignados se editan**, igual que las rutinas de fuerza asignadas. Lo
   único que no se puede es compartirlos.
3. **Cualquier rutina puede repetir ejercicios**: se corrige el servidor (y los formularios,
   si lo impiden).
4. **Sin ejercicios repetidos dentro del catálogo funcional**, salvo que el nombre indique
   otro enfoque o ángulo. Sale "Toques de hombro en flexión" (es el 1005).
5. **Los nombres repetidos entre Fuerza y Funcional están bien**, igual que cuando un
   ejercicio de trapecio aparece también en hombro o espalda.
6. **Posturas sostenidas en un solo panel**, con reloj.
7. **Anterior**: como está propuesto.
8. **Descanso entre vueltas en 0**: como está propuesto.

El resto del plan queda aprobado. Las marcas **[OK?]** de abajo quedan como referencia.

### Preguntas originales

1. **Catálogo para apps viejas** (§1.4): sin el header nuevo, `GET /muscleGroup` y
   `GET /ejercice` devuelven solo Fuerza.
2. **Funcionales asignados no se editan** en la app, pero las rutinas de fuerza asignadas
   siguen editables como hoy (§1.5).
3. **Ejercicio repetido en una rutina**: arreglar el alta del servidor, que hoy rechaza
   una rutina que repite un ejercicio (§1.3).
4. **Duplicados**: "Plancha con toque de hombros" y "Toques de hombro en flexión" son el
   mismo ejercicio; propongo dejar solo el primero (§5.2).
5. **Ejercicios con el mismo nombre que en Fuerza**: van como ejercicios propios del grupo
   Funcional (otro id), reusando el dibujo (§5.2).
6. **Posturas sostenidas en un solo panel** (planchas, isométricos, elongaciones) en vez de
   los dos paneles "1 → 2" (§5.3, M2).
7. **Botón Anterior** y **descanso entre vueltas = 0**: cómo los interpreto (§6.6).

---

## 1. Lo que encontré en el código y cambia el documento

1. **Compartir no usa la tabla de rutinas.** `SharedRoutines` guarda una foto en JSON
   (`payload`). Lo funcional viaja dentro de ese JSON (`kind`, `rounds`,
   `roundRestSeconds`, `defaultMode`, `workSeconds` por ejercicio). No hacen falta
   columnas nuevas en esa tabla.
2. **`Routine_Ejercices` no tiene columna de orden.** Las asignaciones vienen sin
   `ORDER BY` y el `update` reutiliza las filas por id, así que hoy no hay forma de
   reordenar ejercicios en el servidor. Para reordenar bloques arrastrando (en el
   dashboard y en los asignados) agrego `position`. En fuerza queda `null` y se ordena
   por `id`, que es el orden que ya se ve hoy.
3. **El alta rechaza ejercicios repetidos.** `createRoutine` compara la lista de ids
   contra los ejercicios únicos que encuentra: con una plancha al principio y otra al
   final da 404 "Uno o más ejercicios no existen". En funcional es muy común repetir.
   Propongo deduplicar los ids antes de comparar. El arreglo también aplica a fuerza, pero
   solo cambia un caso que hoy da error. **[OK?]**
4. **Las apps viejas verían el catálogo funcional.** `GET /muscleGroup` y `GET /ejercice`
   son públicos y la app vieja arma sus categorías con todo lo que llega: mostraría
   "Cardio" o "Pliometría" como grupos musculares y dejaría armar una rutina de fuerza
   con "Burpees". El documento solo cubre asignaciones y compartir. Propongo que, sin el
   header nuevo, esos dos listados devuelvan solo Fuerza. **[OK?]**
5. **Hoy las rutinas de fuerza asignadas sí se editan.** El documento dice "los asignados
   no se editan ni se comparten, igual que hoy", pero en `detalleRutina.jsx` el botón
   Editar aparece siempre: solo se bloquea compartir. Propongo que los **funcionales**
   asignados no se editen y que **fuerza quede como está**, para no cambiar su
   comportamiento. **[OK?]**
6. **Ids de la semilla.** Grupos y ejercicios se cargan con ids fijos y
   `bulkCreate({ ignoreDuplicates: true })`. Si un id nuevo coincide con uno creado a mano
   en producción, la fila se saltea sin avisar. Reservo **101–108** para las categorías
   funcionales y **1001+** para los ejercicios funcionales. Después de la carga,
   `alignIdSequence` sigue alineando la secuencia como hoy.
7. **Búsqueda por nombre en asignadas.** `buscarEjercicioLocal` busca primero por nombre y
   después por id: un "Crunch abdominal" funcional se resolvería al de fuerza (id 76). En
   la conversión de funcionales busco primero por id y después por nombre dentro del grupo
   Funcional. La de fuerza no cambia.
8. **El caché del catálogo no distingue grupos.** La clave es
   `@rutina360/catalogo_ejercicios_v1` y sus ítems no traen el grupo. Paso a `_v2` con
   `grupo: 'fuerza' | 'funcional'` (el caché viejo se ignora y se vuelve a pedir).
9. **`redux-persist` no tiene `version` ni `migrate`.** Si los funcionales van en
   `rutinasSlice` (§3.2), la forma del estado no cambia y no hace falta una migración. Solo
   agrego un slice nuevo, `sesionFuncional`, a la `whitelist`: si no existe, arranca con su
   estado inicial.
10. **Historial y Notas en Más.** Hoy son pestañas con el encabezado del navegador y abren
    sus propios `Modal` (día del historial, formularios de notas). Para abrirlas "como
    pantallas completas con encabezado y volver" uso el stack nativo
    (`@react-navigation/native-stack`, que ya está instalado) en lugar de meterlas en un
    `Modal`. Así el botón atrás de Android y los modales internos siguen andando igual.
11. **Sonido.** `assets/sounds/beep.mp3` existe pero no está en `android/.../res/raw` ni en
    el bundle de iOS, y `react-native-sound` está instalado (con patch) pero no se usa. Para
    los pitidos 3-2-1 uso `react-native-sound` y copio `beep.mp3` a `res/raw` y `beep.caf` a
    `ios/MiApp` (agregado en `project.pbxproj`, igual que `alarm2.caf`). No hay librerías
    nativas nuevas, pero **hay que recompilar**.
12. **Canal de notificaciones nuevo.** El canal de la alarma del descanso suena en bucle y
    los canales de Android no se pueden modificar. Los cambios de fase van en un canal
    nuevo, `funcional-fases-channel`, con un sonido corto.
13. **Historial: un registro por sesión.** Hoy el historial guarda un registro por
    ejercicio. Un funcional guarda un registro por sesión, con los bloques adentro (forma
    de §5.7 del documento).
14. **Dashboard: `time` es obligatorio y se carga a mano** (minutos). En funcional lo calculo
    a partir de la duración total, redondeando hacia arriba.
15. **El servidor no valida descanso > 0 en fuerza** (lo valida el formulario del
    dashboard). No agrego esa validación, para no cambiar el comportamiento de fuerza. En
    funcional, `restSeconds >= 0`.

---

## 2. Modelo de datos — servidor

Todo es aditivo. Las migraciones van en `config/migrations.js`, con
`agregarColumnaSiFalta` (igual que `restSeconds` en octubre), y corren solas al arrancar.

| Tabla | Columna | Tipo | Default | Notas |
|---|---|---|---|---|
| `Routines` | `kind` | `STRING(16)` NOT NULL | `'strength'` | `'strength'` \| `'functional'`. Postgres completa las filas existentes con el default. |
| `Routines` | `rounds` | `INTEGER` null | — | 1–20, solo funcional. |
| `Routines` | `roundRestSeconds` | `INTEGER` null | — | 0–600, solo funcional. |
| `Routines` | `defaultMode` | `STRING(8)` null | — | `'auto'` \| `'manual'`, solo funcional (si viene vacío se toma `'auto'`). |
| `Routine_Ejercices` | `workSeconds` | `INTEGER` null | — | 5–1800, obligatorio en funcional. |
| `Routine_Ejercices` | `position` | `INTEGER` null | — | Orden de los bloques. En fuerza queda `null`. |
| `MuscleGroups` | `kind` | `STRING(16)` NOT NULL | `'strength'` | Los 14 actuales quedan en `strength`. |
| `Ejercices` | `defaultWorkSeconds` | `INTEGER` null | — | Tiempo sugerido al elegirlo. |

- **Ejercicios de un funcional:** `series = 1` (para no romper el `allowNull: false` ni a
  los clientes que suman series), `restSeconds` puede ser 0 (el setter deja `rest = 0`) y la
  nota del bloque va en `comments`, como hoy.
- **El `kind` de un ejercicio** sale de su grupo; no se duplica en `Ejercices`. Al armar un
  funcional, el servidor valida que todos los ejercicios sean de grupos `functional` (y al
  revés en fuerza, solo si el cliente es nuevo, para no romper nada que hoy funcione).
- **Lecturas** (`getRoutines` y las tres de asignaciones): ordenan los ejercicios por
  `position NULLS LAST, id`.
- **Semilla:** 8 categorías (ids 101–108, `kind: 'functional'`) y 85 ejercicios (ids
  1001+), en `src/seeders/gruposFuncionales.js` y `src/seeders/ejerciciosFuncionales.js`.
  `seedImages` ya toma cualquier `<id>.png` de las carpetas, así que las imágenes nuevas
  entran solas.
- **Respaldo de imagen:** `getEjerciceImage` ya cae en la imagen del grupo del ejercicio. Como
  el grupo de un funcional es su categoría, el respaldo es la genérica de esa categoría **sin
  cambiar el endpoint**. Lo cubro igual en la prueba.

## 3. Modelo de datos — app

### 3.1 Formas

```js
// Funcional (en state.rutinas.rutinas, con tipo)
{ id, tipo: 'funcional', nombre, vueltas, descansoEntreVueltasSegundos,
  modoPorDefecto: 'auto' | 'manual', bloques: [Bloque], tiempo /* segundos estimados */,
  origen /* undefined | 'asignada' | 'compartida' */, idRoutineBackend, idAsignacionBackend,
  huellaAsignacion, huellaAsignacionActual, tieneCambiosAsignados, compartidaPor }

// Bloque
{ id, idBackend, ejercicio: { idEjercicio, nombre, categoria }, trabajoSegundos,
  descansoSegundos, nota }
```

### 3.2 Dónde viven

**En `rutinasSlice`, con `tipo`** (no un slice propio):

- `agregarRutina`, `setRutinas`, `eliminarRutina`, `actualizarRutinaAsignadaLocal` y
  `sincronizarEstadoRutinasAsignadas` ya sirven tal cual, y el estado ya está persistido.
- `helpers/funcional.js` → `tipoRutina(r)` devuelve `'fuerza'` si no hay `tipo` (sin migrar
  datos guardados), y hay dos selectores memorizados: `seleccionarRutinasFuerza` y
  `seleccionarFuncionales`.
- **Reordenar:** `reubicarRutina` mueve por índice sobre la lista entera; con funcionales
  ocultos, arrastrar en una pestaña movería mal. Agrego
  `reubicarRutinaDelTipo({ tipo, desde, hacia })`, que traduce los índices visibles a los
  globales. La pestaña Rutinas pasa a usarla: el orden visible de fuerza se mueve igual que
  hoy.
- Para los bloques agrego `reubicarBloque`. El formulario guarda la rutina entera con
  `setRutinas`, como hace `FormRutina`.
- El badge de "cambios del coach" de cada pestaña cuenta solo los de su tipo.

### 3.3 Sesión en curso

Slice nuevo `sesionFuncional` (persistido) para retomar la sesión si Android mata la app.
Guarda una copia del funcional, el modo, la línea de tiempo con instantes absolutos, la
fase actual, la pausa y lo hecho hasta ahí.

### 3.4 Historial

`historialSlice` agrega `registrarFuncional` y `corregirBloqueFuncional`. Los registros
nuevos tienen la forma del §5.7 del documento. Los que no tienen `tipo` se leen como fuerza.

## 4. Endpoints y compatibilidad

### 4.1 Cómo se reconoce un cliente nuevo

La app (en `apiFetch`) y el dashboard (en `lib/backend.js`) mandan
`X-Rutina360-Funcional: 1` en **todas** las llamadas. Un middleware nuevo
(`middleware/clienteFuncional.js`) deja `req.soportaFuncional`. También acepta
`?funcional=1`, para probar a mano. Elegí un header porque se pone en un solo lugar de
cada cliente y no cambia ninguna URL.

### 4.2 Cambios por endpoint

| Endpoint | Cambio |
|---|---|
| `GET /muscleGroup` | Expone `kind`. Filtro opcional `?kind=strength\|functional`. Sin filtro devuelve todo (decisión 1). |
| `POST/PUT /muscleGroup` | Acepta `kind` (solo super admin, como hoy). |
| `GET /ejercice` | Expone `defaultWorkSeconds`. `?kind=` filtra por el grupo. Sin filtro devuelve todo. |
| `POST/PUT /ejercice` | Acepta `defaultWorkSeconds` (solo super admin, como hoy). |
| `POST /routine`, `PUT /routine/:id` | Aceptan `kind`, `rounds`, `roundRestSeconds`, `defaultMode` y, por ejercicio, `workSeconds` y `position`. Validaciones según `kind` (`lib/funcional.js`). `kind` no se puede cambiar al editar. |
| `GET /routine`, `GET /routine/assign*` | Devuelven los campos nuevos. Ordenan por `position`. |
| `GET /routine/assign/athlete/:id` | **Sin header: se filtran los funcionales.** |
| `POST /routine/assign` | Igual para los dos tipos. |
| `POST /routine/share` | El payload acepta los campos funcionales (sanitizados: trabajo 5–1800, descanso 0–600, vueltas 1–20, descanso entre vueltas 0–600, modo). |
| `GET /routine/share/:code` | Devuelve `kind` y los campos nuevos. **Sin header y con un funcional: `409` "Actualizá la app para importar entrenamientos funcionales"**, que la app vieja ya muestra (usa `err.message`). |

### 4.3 Huella de asignación

La huella de fuerza (`construirHuellaAsignacion`) **no cambia**. Si cambiara, todas las
rutinas asignadas aparecerían "actualizadas por el coach" al instalar la versión nueva. Los
funcionales tienen su propia huella, que suma vueltas, descanso entre vueltas, modo,
trabajo y posición.

---

## 5. Ilustraciones

### 5.1 Cómo está hoy el generador

- `engine.js` dibuja una figura de perfil (o de frente con `vista: 'frente'`) a partir de
  la cadera, el ángulo del torso y destinos de manos y pies, que resuelve con cinemática
  inversa. Siempre arma **dos paneles** (inicio → fin) con flechas entre puntos clave.
- **El torso es rígido** (una sola cápsula): no se puede curvar la columna.
- **No hay espejo:** todas las figuras de perfil miran a la derecha.
- **Equipamiento:** banco, respaldo, barra, mancuerna, polea, cable, barra fija, **caja**,
  colchoneta, asa, rueda, pad, rodillo, poste, palanca, pila, barra larga, paralela,
  gripper, peso colgado y `libre` (SVG a mano). **Faltan** kettlebell, soga, balón
  medicinal, battle ropes, pared, remo ergómetro y air bike.
- **Flechas:** solo curvas entre dos puntos; no hay flecha circular ni de rotación.
- `build_final.js` exige exactamente los ids 1..90.
- No está instalado `sharp` en `tools/ilustraciones` (no hay `node_modules`).

### 5.2 Diagnóstico por ejercicio

Leyenda: ✅ se dibuja con lo que hay (a veces reusando un dibujo, indicado) · 🟡 pose
nueva sin tocar el motor · 🔴 necesita algo nuevo del motor (M1–M11, en §5.3).
Tiempo = `defaultWorkSeconds` propuesto. ⚠ = duplicado.

**Core (101)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1001 | Plancha frontal | 0:40 | ✅ | Pose de "Plancha" (81) · M2. ⚠ "Plancha" en Fuerza. |
| 1002 | Plancha alta (brazos extendidos) | 0:40 | 🟡 | Pose arriba de la flexión (5) · M2. |
| 1003 | Plancha lateral izquierda | 0:30 | 🔴 | "Plancha lateral" (82) + **M1 espejo** · M2. |
| 1004 | Plancha lateral derecha | 0:30 | ✅ | "Plancha lateral" (82) · M2. ⚠ "Plancha lateral" en Fuerza. |
| 1005 | Plancha con toque de hombros | 0:40 | 🟡 | Plancha alta, mano lejana al hombro. ⚠ igual a "Toques de hombro en flexión". |
| 1006 | Crunch abdominal | 0:40 | ✅ | Dibujo del 76. ⚠ mismo nombre en Fuerza. |
| 1007 | Crunch inverso | 0:40 | 🟡 | Acostado, rodillas al pecho y la cadera despega. |
| 1008 | Crunch bicicleta | 0:40 | 🟡 | Torso elevado, una pierna extendida y la otra flexionada. |
| 1009 | Hollow hold | 0:30 | 🟡 | Torso y piernas apenas elevados · M2. |
| 1010 | Bicho muerto (dead bug) | 0:40 | 🟡 | Boca arriba, se extienden un brazo y la pierna opuesta. |
| 1011 | Elevación de piernas acostado | 0:40 | 🟡 | Pose del 80 sobre la colchoneta, sin banco. |
| 1012 | Tijeras (flutter kicks) | 0:30 | 🟡 | Piernas alternadas (cerca/lejos). |
| 1013 | Russian twist | 0:40 | 🔴 | De frente, torso inclinado, manos de un lado al otro · **M4 rotación**. |
| 1014 | V-ups | 0:30 | ✅ | Dibujo del 84. ⚠ mismo nombre en Fuerza. |
| 1015 | Superman | 0:30 | ✅ | Dibujo del 86 · M2. ⚠ "Supermans" en Fuerza. |
| 1016 | Bird dog | 0:40 | 🟡 | Cuadrupedia, brazo y pierna opuestos extendidos. |

**Cardio (102)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1017 | Jumping jacks | 0:40 | 🟡 | De frente: brazos arriba y piernas abiertas. |
| 1018 | Trote en el lugar | 0:40 | 🟡 | Rodilla media, brazos opuestos. |
| 1019 | Skipping alto | 0:30 | 🟡 | Rodilla a la cadera. |
| 1020 | Talones a glúteos | 0:30 | 🟡 | Talón al glúteo. |
| 1021 | Mountain climbers | 0:30 | 🟡 | Plancha alta, rodilla al pecho. |
| 1022 | Escaladores cruzados | 0:30 | 🟡 | Igual, rodilla al codo opuesto (el cruce lo marca la flecha). |
| 1023 | Saltar la soga | 0:40 | 🔴 | **M6 soga**. |
| 1024 | Patinador (skater) | 0:30 | 🟡 | De frente, salto lateral a una pierna. |
| 1025 | Shadow boxing | 0:45 | 🟡 | Guardia → golpe recto. |
| 1026 | Jumping jacks cruzados | 0:40 | 🟡 | De frente, brazos y piernas que se cruzan. |

**Pliometría (103)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1027 | Burpees | 0:30 | 🟡 | Plancha abajo → salto arriba (con flecha). |
| 1028 | Sentadilla con salto | 0:30 | 🟡 | Sentadilla (51) sin barra → figura en el aire. |
| 1029 | Estocada con salto alternada | 0:30 | 🟡 | Estocada → cambio de pierna en el aire. |
| 1030 | Saltos al cajón | 0:30 | 🟡 | `E.caja` (ya existe) + salto. |
| 1031 | Saltos laterales | 0:30 | 🟡 | De frente, de un lado al otro. |
| 1032 | Rodillas al pecho (tuck jumps) | 0:30 | 🟡 | En el aire con rodillas al pecho. |
| 1033 | Salto de rana (salto largo) | 0:30 | 🟡 | Agachado → salto hacia adelante. |
| 1034 | Saltos en estrella | 0:30 | 🟡 | De frente, en X en el aire. |
| 1035 | Flexiones pliométricas | 0:30 | 🟡 | Las manos despegan del piso. |

**Tren inferior (104)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1036 | Sentadilla con peso corporal | 0:40 | 🟡 | Sentadilla (51) sin barra, brazos al frente. |
| 1037 | Sentadilla isométrica en pared | 0:45 | 🔴 | **M9 pared** · M2. |
| 1038 | Sentadilla sumo | 0:40 | ✅ | Dibujo del 72 (sin peso, si lo tiene). ⚠ mismo nombre en Fuerza. |
| 1039 | Estocadas alternadas | 0:40 | ✅ | Dibujo de "Zancadas" (55). ⚠ |
| 1040 | Estocadas hacia atrás | 0:40 | 🟡 | La 55 con el paso hacia atrás. |
| 1041 | Sentadilla búlgara | 0:40 | ✅ | Dibujo del 58. ⚠ mismo nombre en Fuerza. |
| 1042 | Puente de glúteos | 0:40 | 🟡 | Boca arriba, la cadera sube. |
| 1043 | Puente de glúteos a una pierna | 0:40 | 🟡 | Igual, con una pierna extendida. |
| 1044 | Step-ups al banco | 0:40 | ✅ | Dibujo del 56. ⚠ "Step-ups con banco" en Fuerza. |
| 1045 | Elevación de talones | 0:40 | ✅ | Dibujo del 73. ⚠ "Elevaciones de talones de pie". |
| 1046 | Patada de glúteo en cuadrupedia | 0:40 | 🟡 | Cuadrupedia, la pierna sube. ⚠ "Patada de glúteo" (67). |
| 1047 | Sentadilla goblet con kettlebell | 0:40 | 🔴 | **M5 kettlebell**. |

**Tren superior (105)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1048 | Flexiones de brazos | 0:30 | ✅ | Dibujo del 5. ⚠ "Push-ups" en Fuerza. |
| 1049 | Flexiones con rodillas apoyadas | 0:30 | 🟡 | El 5 con las rodillas en el piso. |
| 1050 | Flexiones diamante | 0:30 | 🟡 | De frente con las manos juntas (de perfil se vería igual a 1048). |
| 1051 | Flexiones abiertas | 0:30 | 🟡 | De frente con las manos separadas. |
| 1052 | Pike push-ups | 0:30 | 🟡 | Cadera alta, la cabeza baja hacia las manos. |
| 1053 | Fondos en banco | 0:30 | 🟡 | Manos en el banco, cuerpo adelante. ⚠ "Fondos" (42). |
| 1054 | Plancha a flexión (up-down) | 0:40 | 🟡 | Antebrazos → manos. |
| 1055 | Inchworm (gusano) | 0:40 | 🟡 | Flexionado de pie → plancha alta. |
| — | Toques de hombro en flexión | — | — | ⚠ **Es el 1005.** Propongo no cargarlo. [OK?] |

**Cuerpo completo (106)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1056 | Kettlebell swing | 0:40 | 🔴 | **M5**. |
| 1057 | Thrusters | 0:40 | 🟡 | Mancuernas: sentadilla frontal → press. |
| 1058 | Wall balls | 0:40 | 🔴 | **M7 balón** + **M9 pared** con blanco. |
| 1059 | Battle ropes | 0:30 | 🔴 | **M8 sogas**. |
| 1060 | Bear crawl (oso) | 0:30 | 🟡 | Cuadrupedia con las rodillas despegadas. |
| 1061 | Sprawl | 0:30 | 🟡 | Parado → cadera al piso. |
| 1062 | Golpe de balón medicinal (slam) | 0:30 | 🔴 | **M7**. |
| 1063 | Clean con kettlebell | 0:40 | 🔴 | **M5**. |
| 1064 | Turkish get-up | 1:00 | 🔴 | **M5**. Dos paneles: acostado → medio sentado con el brazo arriba. |
| 1065 | Man makers | 0:40 | 🟡 | Mancuernas: plancha con remo → press. |
| 1066 | Remo ergómetro | 1:00 | 🔴 | **M10**. |
| 1067 | Air bike | 1:00 | 🔴 | **M11**. |

**Movilidad (107)**

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1068 | Círculos de brazos | 0:30 | 🔴 | De frente · **M4 flecha circular**. |
| 1069 | Círculos de cadera | 0:30 | 🔴 | **M4**. |
| 1070 | Gato-camello | 0:45 | 🔴 | **M3 columna curva** (espalda redonda → hundida). |
| 1071 | Rotaciones torácicas | 0:30 | 🟡 | Cuadrupedia, el brazo abre hacia el techo. |
| 1072 | Sentadilla profunda sostenida | 0:45 | 🟡 | M2. |
| 1073 | World's greatest stretch | 0:45 | 🟡 | Estocada profunda, brazo al techo. |
| 1074 | Movilidad de tobillos | 0:30 | 🟡 | Arrodillado a medias, la rodilla avanza sobre el pie. |
| 1075 | 90/90 de cadera | 0:45 | 🟡 | Sentado de frente con las dos piernas a 90°. Es el más difícil de leer en 2D; puede pedir una vuelta extra en la hoja. |

**Elongación (108)** — todas sostenidas (M2), con el músculo estirado en verde.

| id | Ejercicio | Tiempo | Dibujo | Qué hace falta |
|---|---|---|---|---|
| 1076 | Isquiotibiales | 0:30 | 🟡 | Sentado, manos a los pies. |
| 1077 | Cuádriceps | 0:30 | 🟡 | Parado, talón al glúteo con la mano. |
| 1078 | Pectorales | 0:30 | 🔴 | **M9 pared** (antebrazo apoyado). |
| 1079 | Hombros | 0:30 | 🟡 | De frente, brazo cruzado. |
| 1080 | Tríceps | 0:30 | 🟡 | De espaldas, codo detrás de la cabeza. |
| 1081 | Gemelos | 0:30 | 🔴 | **M9 pared**, pierna atrás. |
| 1082 | Postura del niño | 0:45 | 🟡 | Torso sobre los muslos, brazos adelante. |
| 1083 | Cobra | 0:30 | 🟡 | Cadera en el piso, torso arriba (con M3 queda mejor). |
| 1084 | Mariposa (aductores) | 0:45 | 🟡 | De frente, sentado con las plantas juntas. |
| 1085 | Figura 4 (glúteo) | 0:30 | 🟡 | Boca arriba, tobillo sobre la rodilla. |

Total: **85 ejercicios** (86 del documento, sin el duplicado) + **8 imágenes de categoría**.
✅ 11 · 🟡 56 · 🔴 18.

**Nombre igual o parecido a uno de Fuerza** (1001, 1004, 1006, 1014, 1015, 1038, 1039, 1041, 1044,
1045, 1046, 1048, 1053): propongo que sean **ejercicios propios del grupo Funcional** con
otro id. Cada formulario ofrece solo su grupo, el historial y el dashboard no los mezclan, y
el dibujo se reusa (es la misma definición con otro id). **[OK?]**

### 5.3 Ampliación del motor

Todo lo nuevo es **opcional**: si un ejercicio no usa la opción, el SVG sale exactamente
igual que hoy.

| | Qué | Uso |
|---|---|---|
| M1 | `espejo: true`: refleja cada panel sobre su centro | Lados izquierdo y derecho (planchas laterales). |
| M2 | `sostenido: true`: **un solo panel** con la figura centrada (como las de grupo) y un pequeño reloj en lugar de "1 / 2" **[OK?]** | Planchas, isométricos, elongaciones. La alternativa es seguir con dos paneles casi iguales, como "Plancha" hoy. |
| M3 | `curvaTorso`: el torso como curva en lugar de cápsula recta | Gato-camello, cobra. |
| M4 | Flecha circular y de rotación (elipse) | Círculos de brazos y cadera, Russian twist. |
| M5 | `E.kettlebell` | Swing, goblet, clean, get-up. |
| M6 | `E.soga` (arco que pasa bajo los pies) | Saltar la soga. |
| M7 | `E.balon` | Wall balls, slam. |
| M8 | `E.sogasBattle` (ondas ancladas) | Battle ropes. |
| M9 | `E.pared` (+ blanco opcional) | Sentadilla en pared, wall balls, elongación de pectorales y gemelos. |
| M10 | `E.remoErgometro` | Remo ergómetro. |
| M11 | `E.airBike` | Air bike. |

También:

- `base.js` suma plantillas compartidas: `cuadrupedia()`, `planchaAlta()`, `boca arriba`,
  `enElAire()`.
- Archivos nuevos: `ej_funcional_core.js`, `_cardio.js`, `_pliometria.js`, `_inferior.js`,
  `_superior.js`, `_completo.js`, `_movilidad.js`, `_elongacion.js` y
  `grupos_funcionales.js`.
- `build_final.js` acepta 1..90 + 1001..1085 y los grupos 1..14 + 101..108.

**Imágenes de categoría** (101–108, misma estética que las de grupo: una figura centrada):
Core = plancha · Cardio = trote · Pliometría = salto en estrella · Tren inferior = sentadilla
· Tren superior = flexión · Cuerpo completo = kettlebell swing · Movilidad = world's
greatest stretch · Elongación = isquiotibiales.

### 5.4 Las 104 actuales tienen que salir idénticas

1. **Antes de tocar nada:** instalo `sharp` en `tools/ilustraciones`, genero y comparo
   byte a byte contra `src/seeders/imagenes` (90 + 14). También guardo el sha1 del **SVG**
   de cada una, que no depende de la versión de `sharp`.
2. **Después de cada cambio del motor:** vuelvo a generar y comparo los 104 SVG por hash y
   los PNG byte a byte. Si la línea base del paso 1 no coincide con lo publicado (otra
   versión de `sharp`/libvips), te aviso y uso como referencia el hash de los SVG.

### 5.5 Hoja de revisión

`final/_revision/funcional.html`: grilla con la miniatura, el id, el nombre, la categoría y
una casilla para marcar, y las 8 de categoría al final. También va en PNG, como las hojas
actuales. **Espero tu aprobación.** Las que marques se corrigen y se genera la hoja de
nuevo. Recién con el OK se copian a `src/seeders/imagenes/` y se cargan en la semilla.

### 5.6 README del generador

Cómo agregar un ejercicio funcional: id en el rango 1001+, el archivo `ej_funcional_*.js`
de su categoría, si es `sostenido` o `espejo`, el equipamiento disponible, regenerar,
revisar la hoja y copiar. Es la regla de octubre: el catálogo es del super admin.

### 5.7 Dónde se ven

- **App** (`ImagenEjercicio`, que si no carga no ocupa lugar): al elegir el ejercicio en el
  formulario de bloque, en el detalle del funcional, en la ejecución (actual y "Siguiente",
  más chica) y en el catálogo.
- **Dashboard:** en el catálogo funcional y en el detalle, por el proxy
  `/api/exercises/:id/image` que ya existe.

---

## 6. App — pantallas

### 6.1 Navegación (`App.jsx`)

- Stack raíz (native-stack): `Pestañas`, `Historial` y `Notas`.
- Pestañas: **Rutinas · Funcional · Perfil · Más**.
- `MenuMas`: Historial, Notas y Catálogo. Historial y Notas navegan al stack, con
  encabezado y volver. Catálogo sigue como hoy.
- El catálogo muestra un selector **Fuerza / Funcional** arriba y las categorías de cada
  grupo.

### 6.2 Pestaña Funcional (`views/funcional/funcional.jsx`)

- Segmentos **Mis funcionales / Asignados**, igual que Rutinas. Asignados reusa
  `RutinasAsignadas` con `tipo="funcional"`: filtra por `kind`, convierte con
  `helpers/funcionalBackend.js` y lleva su propia huella.
- Reordenar arrastrando (`ListaOrdenable`), estado vacío, **Nuevo funcional** e
  **Importar**.
- Tarjeta: nombre, bloques, vueltas, duración total y marca "Actualizada por el coach".
- Si hay una sesión en curso guardada: un aviso "Tenés un funcional sin terminar" con
  **Retomar** o **Terminar y guardar**.

### 6.3 Formulario (`formFuncional.jsx` + `formBloque.jsx`)

Como lo pide el documento:

- Vueltas con − y +.
- Descanso entre vueltas con dos `Selector` (se oculta si hay una sola vuelta).
- Modo por defecto.
- Bloques reordenables (`ListaOrdenable`).
- Bloque: categoría funcional → ejercicio (con `ImagenEjercicio`). Trabajo de 0–30 min y
  segundos de a 5, con mínimo 5 s, precargado con `defaultWorkSeconds`. Descanso de 0–10
  min y segundos de a 5, puede ser 0. Nota.
- Duración total en vivo.
- Mismos avisos, salida sin guardar y `guardandoRef` que `FormRutina`.

### 6.4 Detalle (`detalleFuncional.jsx`)

- Bloques (ilustración, nombre, trabajo, descanso, nota), vueltas, descanso entre vueltas,
  duración y reordenar bloques.
- ⋮: Editar · Compartir (código + QR, reusa `CompartirRutina`) · Eliminar. Los asignados
  se editan como los de fuerza, pero no muestran Compartir (decisión 2).
- **Iniciar** abre una `HojaAcciones` con el modo por defecto marcado: Automático o
  Manual, solo para esa sesión.

### 6.5 Ejecución (`ejecucionFuncional.jsx`)

- Pantalla completa: fase, ejercicio con ilustración y nota, cuenta regresiva grande
  (mm:ss), "Vuelta X de N" · "Bloque Y de M" · "Siguiente", barra del total.
- Controles: Pausa/Reanudar, Saltar, Anterior y Terminar (con confirmación).
- Pitidos 3-2-1 en primer plano y `pantallaEncendida` mientras dura la sesión.
- **Segundo plano:**
  - El tiempo no se cuenta en JavaScript. Hay una línea de tiempo con `finEn` absoluto por
    fase; la pantalla se recalcula cada 250 ms contra el reloj, como `descanso.jsx`.
  - `services/fasesFuncional.js` programa con notifee **una notificación por cambio de
    fase**, en el canal nuevo, con el tipo de alarma de `obtenerTipoAlarma` (alarma exacta
    o inexacta, y el mismo aviso de permiso que el descanso).
  - En iOS programa como mucho las próximas 40 (quedan cupos para el descanso dentro del
    límite de 64) y repone al volver a primer plano.
  - Pausa cancela todo; Reanudar recalcula y reprograma.
  - En Manual se programa solo hasta el próximo punto de espera ("Descanso terminado —
    tocá Iniciar para seguir con Plancha").
  - Con la app en primer plano, la notificación del cambio de fase se borra de la barra
    apenas llega. Su sonido hace de "0" después del 3-2-1.
  - `App.jsx` reconoce estas notificaciones por prefijo de id, para no confundirlas con
    las del descanso.
- **Retomar:** la sesión se persiste en `sesionFuncional`. Al volver se avanza por las fases
  que ya vencieron y se sigue en la correcta, o se ofrece terminar y guardar.

### 6.6 Motor de la sesión (puro, con tests)

`helpers/funcional.js`:

- `duracionTotal(funcional)` = preparación de 5 s + trabajos + descansos + descansos entre
  vueltas, **sin el descanso final**.
- `construirLineaDeTiempo(funcional, { modo })` → fases
  `{ tipo: 'preparacion'|'trabajo'|'descanso'|'descansoVueltas'|'espera', vuelta, bloque, segundos }`.
  - Descanso 0 → no hay fase de descanso.
  - El último bloque de cada vuelta lleva el descanso entre vueltas **en lugar del suyo**;
    si el descanso entre vueltas es 0, se pasa directo a la vuelta siguiente. **[OK?]**
  - En la última vuelta, el último bloque termina el entrenamiento.
  - En Manual se inserta una fase `espera` antes de cada trabajo, salvo el primero: después
    de tocar Iniciar hay 3 s de preparación. El primer bloque usa la preparación de 5 s
    que arranca con Iniciar.

`helpers/sesionFuncional.js` (estado + `ahora`, sin timers):

- `iniciar`, `estadoEn(ahora)` (avanza las fases vencidas), `pausar`, `reanudar`,
  `saltar`, `continuar` (el toque de Manual), `terminar` (arma el registro del
  historial) y `proximosCambios(n)` (lo que hay que programar).
- **Anterior [OK?]:**
  - en el trabajo del bloque Y → vuelve al inicio del trabajo de Y−1 (si Y es el primero
    de una vuelta, al último de la vuelta anterior; en el primero de todos, reinicia la
    preparación);
  - en el descanso posterior a Y → vuelve al inicio de Y.
- **Estado de cada bloque:**
  - `completo`: el trabajo llegó a cero;
  - `parcial`: se saltó o se terminó a mitad, y guarda los segundos hechos;
  - `salteado`: se saltó sin hacer nada (0 s).
  - Lo que no se llegó a hacer al terminar antes no se registra.

### 6.7 Al terminar e historial

- Resumen: tiempo total, vueltas completadas y bloques completos, parciales o salteados.
  Se guarda con `registrarFuncional`.
- **Historial:** en la tarjeta del día, los funcionales aparecen junto a las rutinas con una
  etiqueta "Funcional" y su tiempo. El conteo de ejercicios y series sigue siendo de fuerza.
- **Detalle del día:** los funcionales van agrupados por vuelta (cumplido / planificado). Se
  corrige el tiempo cumplido (el estado se recalcula) y se puede borrar.

### 6.8 Compartir e importar

- `aPayload` y `convertirCompartidaEnRutinaLocal` entienden `kind`.
- La vista previa de un funcional muestra bloques, vueltas y duración.
- Al importar, la copia queda con su `tipo`, así que aparece en la pestaña que corresponde.
  El aviso dice dónde encontrarla.

---

## 7. Dashboard

Antes de escribir código leo las guías de `node_modules/next/dist/docs/` (lo pide el
`AGENTS.md`: Next 16).

1. **Catálogo** (`catalogo-ejercicios/page.js` + `components/catalog/*`):
   - pestañas **Fuerza / Funcional**, cada una con sus categorías e ilustraciones;
   - el super admin crea categorías eligiendo `kind`;
   - en funcional, el ejercicio pide además el tiempo sugerido.
2. **Funcionales** (`rutinas-creadas/page.js` con pestañas Fuerza / Funcional):
   - `FunctionalRoutineForm` nuevo, para alta y edición: nombre, vueltas, descanso entre
     vueltas, modo por defecto y bloques (solo ejercicios funcionales, trabajo con un
     `DurationInput` nuevo de min/seg, descanso con `RestInput` y una prop `allowZero`,
     nota);
   - orden de los bloques arrastrando, con drag & drop nativo de HTML y botones subir/bajar
     para teclado (sin dependencias nuevas);
   - duración total en vivo; `time` se calcula solo.
3. **Asignar:** el mismo flujo (`AthleteRoutineAssignment`, `CoachAthleteAssignment`), con
   una etiqueta del tipo en cada opción.
4. **Listados y detalle del alumno:** etiqueta Fuerza / Funcional. El detalle de un
   funcional muestra bloques, trabajo, descanso, vueltas y duración.
5. **Proxies:**
   - `api/routines` y `api/routines/[routineId]`: normalizador propio para funcional
     (`lib/functional.js`);
   - `api/muscle-groups` y `api/exercises`: pasan `kind`;
   - `lib/backend.js`: manda el header.
6. `eslint` y `next build` sin errores.

---

## 8. Archivos

**Servidor** (`rutina360_server`)

- Modifico:
  - `models/`: `routine`, `routineEjercice`, `muscleGroup`, `ejercice`;
  - `config/migrations.js`, `config/setup.js`;
  - `controllers/`: `routineController`, `sharedRoutineController`,
    `muscleGroupController`, `ejerciceController`;
  - `routes/index.js` (middleware);
  - `tools/ilustraciones/`: `engine.js`, `base.js`, `build_final.js`, `README.md`.
- Creo:
  - `middleware/clienteFuncional.js`, `lib/funcional.js`;
  - `src/seeders/gruposFuncionales.js`, `src/seeders/ejerciciosFuncionales.js`;
  - `src/seeders/imagenes/ejercicios/1001–1085.png`, `grupos/101–108.png`;
  - `tools/ilustraciones/ej_funcional_*.js` (8), `grupos_funcionales.js`;
  - `scripts/prueba-funcional.js` (prueba de punta a punta).

**Dashboard** (`dashboard-rutina360`)

- Modifico:
  - `src/lib/backend.js`, `src/lib/rest.js`;
  - `src/components/ui/RestInput.js`;
  - `src/app/api/`: `routines/route.js`, `routines/[routineId]/route.js`,
    `muscle-groups/route.js`, `exercises/route.js`, `exercises/[exerciseId]/route.js`;
  - `src/app/inicio/catalogo-ejercicios/page.js`, `src/components/catalog/*`;
  - `src/app/inicio/rutinas-creadas/page.js`;
  - `src/components/roles/`: `CoachRoutinesList`, `RoutineEditor`, `RoutineEditButton`,
    `AthleteAssignedRoutinesList`, `AthleteRoutineAssignment`, `CoachAthleteAssignment`;
  - `src/app/inicio/roles-usuarios/[roleId]/[userId]/rutinas/[routineId]/page.js`.
- Creo:
  - `src/lib/functional.js`;
  - `src/components/roles/FunctionalRoutineForm.js`;
  - `src/components/ui/DurationInput.js`, `src/components/ui/KindBadge.js`.

**App** (`gym_proyect`)

- Modifico:
  - `App.jsx`, `components/MenuMas.jsx`;
  - `store/`: `rutinasSlice.js`, `historialSlice.js`, `rootReducer.js`, `store.js`;
  - `views/rutinas/`: `rutinas.jsx`, `misRutinas.jsx`, `rutinasAsignadas.jsx`,
    `importarRutina.jsx`, `compartirRutina.jsx`, `formEjercicio.jsx` (solo Fuerza);
  - `views/historial/`: `historial.jsx`, `diaHistorial.jsx`;
  - `views/usuario/catalogoEjercicios.jsx`;
  - `services/`: `apiClient.js`, `rutinasCompartidas.js`;
  - `helpers/`: `catalogoEjercicios.js`, `ejercicios.js`, `notificationConstants.js`;
  - `ios/MiApp.xcodeproj/project.pbxproj`.
- Creo:
  - `views/funcional/`: `funcional.jsx`, `misFuncionales.jsx`, `formFuncional.jsx`,
    `formBloque.jsx`, `detalleFuncional.jsx`, `ejecucionFuncional.jsx`,
    `resumenFuncional.jsx`;
  - `helpers/`: `funcional.js`, `sesionFuncional.js`, `funcionalBackend.js`;
  - `services/`: `fasesFuncional.js`, `pitidos.js`;
  - `store/sesionFuncionalSlice.js`;
  - `styles/`: `funcionalStyles.js`, `formFuncionalStyles.js`, `ejecucionFuncionalStyles.js`;
  - `android/app/src/main/res/raw/beep.mp3`, `ios/MiApp/beep.caf`;
  - `__tests__/`: `funcional.test.js`, `sesionFuncional.test.js`,
    `rutinasPorTipo.test.js`, `funcionalBackend.test.js`.
- Al final: `docs/novedades-2026-11.md`.

## 9. Orden y verificación

1. **Ilustraciones:** línea base de las 104 → motor (M1–M11) → 85 + 8 dibujos → hoja de
   revisión → **espero tu OK** → copia a la semilla.
2. **Servidor:** modelos, migraciones, semilla, endpoints. La prueba de punta a punta corre
   contra **Postgres real** (instalado en el entorno de prueba) y cubre:
   - migración sobre una base sin las columnas;
   - alta y edición de los dos tipos;
   - ejercicio repetido;
   - asignación;
   - compartir;
   - clientes viejos y nuevos (catálogo, asignadas, `409`);
   - imágenes (`304` con `ETag` y respaldo de la categoría).
3. **Dashboard:** catálogo → formulario funcional → asignación → `eslint` + `next build`.
4. **App:** navegación → catálogo → listado → formulario → detalle → ejecución (Automático,
   después Manual, después segundo plano) → historial → compartir/importar → asignados.
   - Jest: duración, línea de tiempo (vueltas, descanso entre vueltas, descanso 0, última
     vuelta, pausar/reanudar, saltar, anterior, Manual), rutinas viejas sin `tipo` que no
     aparecen en Funcional y conversión desde el servidor.
   - `eslint` sin errores nuevos.
5. `docs/novedades-2026-11.md` con el orden para publicar (servidor → dashboard → app con
   build nuevo), lo verificado y el checklist manual de Android del §9 del documento, que
   no puedo hacer yo: teléfono bloqueado, segundo plano, app cerrada a la fuerza, pausa
   larga y pitidos.

No commiteo nada.
