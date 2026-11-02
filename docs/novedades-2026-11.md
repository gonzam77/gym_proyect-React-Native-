# Novedades — noviembre 2026

Sección nueva **Funcional**: entrenamientos por tiempo, armados con bloques (un ejercicio
con su trabajo y su descanso) que se repiten N vueltas. Toca los tres sistemas (app,
servidor y dashboard). **Nada está commiteado.** El plan aprobado, con las decisiones,
está en [plan-funcionales.md](./plan-funcionales.md).

## Orden para publicar

1. **Servidor** (`rutina360_server`). Al arrancar solo:
   - agrega las columnas nuevas: `kind`, `rounds`, `roundRestSeconds` y `defaultMode` en
     las rutinas, `workSeconds` y `position` en `Routine_Ejercices`, `kind` en los grupos
     musculares y `defaultWorkSeconds` en los ejercicios;
   - carga las 8 categorías funcionales (ids 101–108) y los 85 ejercicios funcionales
     (ids 1001–1085), con sus 93 ilustraciones.

   No hace falta correr nada a mano. Las 104 ilustraciones de fuerza no se tocan.
2. **Dashboard** (`dashboard-rutina360`): `npm run deploy`.
3. **App**: build nuevo (hay recursos nativos nuevos, ver abajo). No hay dependencias
   nuevas: `react-native-sound` ya estaba instalado.

Mientras llega la app nueva, las versiones viejas siguen funcionando: el servidor no les
manda funcionales asignados y, si piden un código de un funcional compartido, les
responde `409` con "Actualizá la app para importar entrenamientos funcionales". La app
nueva y el dashboard se identifican con el header `X-Rutina360-Funcional: 1`.

## 1. Catálogo funcional e ilustraciones

- 8 categorías: Core, Cardio, Pliometría, Tren inferior, Tren superior, Cuerpo completo,
  Movilidad y Elongación. Cada ejercicio tiene un trabajo sugerido (`defaultWorkSeconds`).
- Se sacó "Toques de hombro en flexión" porque repetía "Plancha con toque de hombros".
  Los nombres que se repiten con Fuerza (Crunch abdominal, V-ups…) son ejercicios propios
  del grupo Funcional.
- El generador (`rutina360_server/tools/ilustraciones`) tiene posturas y elementos nuevos
  (kettlebell, soga, balón, battle ropes, cajón, remo, air bike…). Las posturas
  sostenidas van en un solo panel con un reloj. Las 104 de fuerza salen idénticas (se
  compararon por hash del SVG y píxel a píxel). El README explica cómo agregar un
  ejercicio funcional con su dibujo.
- Si un ejercicio funcional no tiene imagen, el servidor devuelve la de su categoría.
- `helpers/ejercicios.js` (el respaldo sin conexión de la app) incluye el catálogo
  funcional, marcado con `tipo: "funcional"` y al final de la lista.

## 2. Servidor

- `lib/funcional.js` tiene las reglas: vueltas de 1 a 20, descanso entre vueltas de 0 a
  600 s, trabajo de 5 a 1800 s y descanso de 0 a 600 s. En un funcional, `series` queda
  en 1.
- `middleware/clienteFuncional.js` arma `req.soportaFuncional` a partir del header (o
  de `?funcional=1`, para probar a mano).
- Los listados del catálogo devuelven todo y aceptan `?kind=strength|functional`.
- Las rutinas aceptan y devuelven los campos nuevos. `kind` no se puede cambiar al
  editar, y los ejercicios se ordenan por `position`.
- **Cualquier rutina puede repetir ejercicios.** Antes el alta rechazaba una rutina con
  un ejercicio repetido.
- Compartir guarda el tipo y los tiempos. Los códigos viejos se siguen importando igual.

## 3. Dashboard

- **Rutinas creadas**: botones "Crear rutina" y "Crear funcional", filtro
  Todas / Fuerza / Funcional (`?tipo=`) y chips con el tipo, las vueltas, la duración y
  los bloques.
- **Formulario funcional** (`FunctionalRoutineForm`):
  - nombre, vueltas (− y +) y descanso entre vueltas (se oculta con una sola vuelta);
  - modo por defecto;
  - bloques con categoría → ejercicio (con su ilustración), trabajo, descanso (puede ser
    0) y nota. El trabajo sugerido se completa solo al elegir el ejercicio.
  - Los bloques se reordenan arrastrando o con flechas, y la duración se calcula en vivo.
- **Detalle**: muestra duración, vueltas, descanso entre vueltas y modo, y cada bloque
  con su trabajo y su descanso. "Editar funcional" abre el mismo formulario.
- **Catálogo**: dos secciones, Fuerza y Funcional. Al crear un grupo se elige el tipo, y
  a los ejercicios funcionales se les puede cargar el trabajo sugerido.
- **Asignar**: es el mismo flujo que una rutina. En el perfil del atleta y en los
  listados se distingue Fuerza de Funcional.
- El formulario de fuerza ofrece solo grupos de fuerza (`?kind=strength`).

## 4. App

### Navegación

- Pestañas: **Rutinas · Funcional · Perfil · Más**.
- Historial y Notas se abren desde **Más** como pantallas completas, con encabezado y
  botón de volver (stack raíz con `native-stack`). Funcionan igual que antes.
- El catálogo del perfil tiene un selector **Fuerza / Funcional**.

### Pestaña Funcional

- Es la misma pantalla que Rutinas, filtrada por tipo (`views/rutinas/rutinas.jsx` con
  `tipo="funcional"`):
  - segmentos **Mis funcionales / Asignados**;
  - marca de cambios del coach;
  - reordenar arrastrando, estado vacío, nuevo funcional e importar.
- Los funcionales viven en `rutinasSlice` con `tipo: 'funcional'`. Las rutinas guardadas
  antes no tienen tipo y se leen como fuerza (`helpers/funcional.js`), así que no hubo que
  migrar nada.
- Al reordenar en una pestaña se usa `reubicarRutinaDelTipo`, que traduce las posiciones
  visibles a las reales. Así una pestaña no desordena la otra.
- **Asignados**: se agregan y se actualizan como las rutinas, y se pueden editar. No se
  pueden compartir. Tienen su propia huella de cambios. La de fuerza no se tocó, para
  que las rutinas ya agregadas no aparezcan como "actualizadas por el coach".

### Formulario y detalle

- **Formulario**: los mismos campos que en el dashboard, con los selectores de minutos y
  segundos de siempre. Solo ofrece el catálogo funcional, y el de fuerza solo Fuerza.
- **Duración total**: preparación de 5 s + trabajos + descansos + descansos entre
  vueltas, sin el descanso final. El dashboard muestra la misma cuenta.
- **Detalle**:
  - muestra los bloques con su ilustración, trabajo, descanso y nota, y se reordenan
    arrastrando;
  - menú `⋮`: Compartir (no aparece en los asignados) y Eliminar;
  - **Iniciar** pregunta el modo, con el modo por defecto marcado.

### Ejecución

- Pantalla completa. Muestra:
  - la fase;
  - el ejercicio con su ilustración y su nota (en el descanso, el que sigue);
  - la cuenta regresiva grande;
  - "Vuelta X de N · Bloque Y de M" y "Siguiente";
  - una barra del total.
- Controles:
  - Pausa/Reanudar;
  - Saltar;
  - Anterior: durante el trabajo de un bloque vuelve al bloque anterior; durante su
    descanso, al inicio del mismo bloque;
  - Terminar, con confirmación.
- **Automático** encadena todo. **Manual** espera un toque de **Iniciar** antes de cada
  bloque (salvo el primero), con 3 s de preparación.
- Descanso entre vueltas en 0: pasa directo a la vuelta siguiente.
- **Pitidos 3-2-1** en los últimos 3 segundos de cada fase y uno largo al cambiar de
  fase. Salen de `assets/sounds/beep.mp3`: el corto es su primer pitido y el largo, el
  último (`pitido_corto.mp3`, `pitido_largo.mp3`).
- La pantalla queda encendida mientras dura la sesión.
- **El tiempo no se cuenta en JavaScript.** La sesión guarda instantes absolutos y la
  pantalla se recalcula cada 250 ms (`helpers/sesionFuncional.js`).
- **Segundo plano:** al salir de la app o bloquear el teléfono, se programa con notifee
  una notificación por cada cambio de fase. Llevan textos como "¡A trabajar! Plancha",
  "Descanso — sigue Crunch" o "Terminaste".
  - Usan el canal nuevo `funcional-fases-channel` y su sonido es el pitido largo.
  - Usan alarma exacta, con el mismo aviso de permiso que el descanso.
  - Al volver a la app se cancelan, y avisan los pitidos.
  - En Manual se programan solo hasta la próxima espera.
  - Límites: 40 en iOS, que deja 64 pendientes, y 200 en Android. Se reponen al volver.
- Cerrar la pantalla en medio de la sesión pregunta: Seguir, **Pausar y salir** o
  Terminar y guardar. Así no queda una sesión corriendo sin avisos.
- **Retomar:** la sesión se guarda en `sesionFuncional`, que está persistido. Si Android
  mata la app, la pestaña Funcional muestra "Tenés … sin terminar" con **Retomar**, que
  sigue en la fase que corresponde, o **Terminar y guardar**.

### Al terminar e historial

- **Resumen**: tiempo total (sin pausas ni esperas), vueltas completadas y bloques
  completos, parciales o salteados, uno por uno.
- Se guarda en el historial con `tipo: 'funcional'`. Si se termina antes, se guarda lo
  hecho; lo que no se llegó a empezar no se registra.
- **Historial**:
  - en la tarjeta del día los funcionales aparecen junto a las rutinas, con un reloj;
  - el conteo de ejercicios y series sigue siendo de fuerza, y los funcionales suman su
    cantidad y su tiempo aparte;
  - en el detalle del día, los bloques van agrupados por vuelta. Se puede corregir el
    tiempo cumplido (el estado se recalcula) y borrar el funcional.

### Compartir e importar

- Mismo código y mismo QR. La vista previa de un funcional muestra bloques, vueltas y
  duración.
- La copia va a la pestaña de su tipo, aunque se importe desde la otra, y el aviso dice
  dónde quedó.

### Recursos nativos nuevos (hay que recompilar)

- Android: `android/app/src/main/res/raw/funcional_cambio.mp3`, el sonido del canal.
- iOS: `ios/MiApp/funcional_cambio.caf`, agregado a `project.pbxproj` como recurso.

## Diferencias con el plan

- Las notificaciones de cambio de fase se programan **al pasar a segundo plano** y se
  cancelan al volver. El plan las programaba siempre y borraba cada una al llegar con la
  app abierta. Así no hay sonido doble ni avisos encima de la pantalla.
- La duración incluye los 5 s de preparación también en el dashboard, para que coach y
  atleta vean el mismo número. El `time` en minutos que calcula el servidor cuando no se
  lo mandan no los cuenta; la diferencia es de 5 s.

## Verificación hecha

- **Ilustraciones**: las 104 de fuerza salen idénticas. Hoja de revisión aprobada.
- **Servidor**: `npm run prueba:funcional`, una prueba de punta a punta contra Postgres
  real. Pasó entera:
  - sobre la base migrada desde octubre;
  - sobre una base vacía;
  - en un segundo arranque.

  Cubre la migración, el alta y la edición de los dos tipos, los ejercicios repetidos,
  la asignación, compartir, los clientes viejos y nuevos (asignadas filtradas y `409`) y
  las imágenes (`304` y la de la categoría como respaldo).
- **Dashboard**:
  - `eslint` y `next build` sin errores;
  - probado en el navegador contra el servidor local: crear un funcional, filtro, detalle,
    editar, catálogo y asignarlo a un atleta.
- **App**:
  - 64 pruebas de Jest pasan (52 nuevas). Cubren:
    - la duración y la línea de tiempo: vueltas, descanso entre vueltas, descanso 0,
      última vuelta y Manual;
    - la sesión: pausar/reanudar, saltar, anterior, Manual, retomar y terminar antes;
    - que las rutinas viejas sin tipo no aparecen en Funcional;
    - el reordenamiento por tipo;
    - la conversión desde el servidor y el historial mezclado;
    - que las pantallas montan (lista, formulario, detalle, ejecución avanzando con el
      reloj, resumen e historial).
  - `__tests__/App.test.tsx` ya fallaba antes, por un módulo ESM.
  - `eslint` sin errores nuevos. Siguen los mismos 2 de antes (`App.jsx` y
    `formEjercicio.jsx`).
  - La conversión de asignados, compartir e importar y el catálogo por tipo se probaron
    contra el servidor local, con un funcional creado desde el dashboard.

## Falta probar en un Android (checklist manual)

No lo puedo hacer yo. Con un funcional de 3 vueltas y descansos cortos:

1. Teléfono **bloqueado durante un trabajo**: llega la notificación con sonido al empezar
   el descanso, y la siguiente al volver a trabajar.
2. Teléfono **bloqueado durante un descanso**: llega "¡A trabajar! …" a tiempo.
3. **App en segundo plano** (abrir otra app): mismos avisos. Al volver no queda ninguna
   notificación vieja y la cuenta está al día.
4. **App cerrada a la fuerza** desde recientes y reabierta: la pestaña Funcional ofrece
   Retomar y sigue en la fase correcta; Terminar y guardar deja el registro en el
   historial.
5. **Pausa larga** (más de 5 min) y Reanudar: no llegan avisos durante la pausa y el
   tiempo sigue desde donde quedó.
6. **Pitidos 3-2-1** y el largo al cambiar de fase, con la app abierta y con música
   sonando de fondo.
7. Sin el permiso de **alarmas y recordatorios**: aparece el aviso y los avisos llegan
   igual (pueden llegar unos segundos tarde).
8. Modo **Manual**: después del descanso queda esperando y avisa "Descanso terminado —
   tocá Iniciar…".
9. Rutinas de fuerza: crear, entrenar, descanso con alarma, reordenar y asignadas,
   igual que antes.

También falta probar en un iPhone (el sonido `.caf` del aviso y el límite de 64).
