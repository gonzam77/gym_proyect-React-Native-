# Prompt: sección Funcional (ejercicios por tiempo) — Rutina360

> Copiá este archivo entero como prompt, o decile al agente:
> "Leé `gym_proyect/docs/prompt-funcionales.md` y seguilo".

---

## Rol y contexto

Vas a incorporar a Rutina360 una sección nueva de **entrenamiento funcional**:
ejercicios que se hacen **por tiempo** y no por series y repeticiones. Por ejemplo:
3 min de plancha → descanso → 3 min de crunch abdominal → descanso… repetido N vueltas.

El trabajo toca **los tres sistemas**. Son carpetas hermanas dentro de
`C:\Users\usuario\Desktop\Sistemas\Rutina360\`:

| Carpeta | Qué es |
|---|---|
| `gym_proyect` | App React Native 0.79 + Redux Toolkit + redux-persist (Android e iOS) |
| `rutina360_server` | API (PostgreSQL). Producción: `https://api-rutina360.devgm.com.ar` |
| `dashboard-rutina360` | Dashboard web (Next.js) del coach y del super admin |

### Antes de escribir código

1. Leé `gym_proyect/docs/novedades-2026-10.md`, `docs/modelo-base-datos.md` y
   `docs/correcciones-bugs-2026-09.md` para conocer el estilo y las decisiones recientes.
2. Recorré cómo funcionan hoy las rutinas de fuerza de punta a punta:
   - App: `views/rutinas/*`, `store/rutinasSlice.js`, `store/historialSlice.js`,
     `helpers/descanso.js`, `helpers/catalogoEjercicios.js`,
     `services/descansoAlarma.js`, `services/pantallaEncendida.js`,
     `services/rutinasCompartidas.js`, `components/ListaOrdenable.jsx`,
     `components/MenuMas.jsx`, `App.jsx`.
   - Servidor: modelos de rutinas, ejercicios de rutina (`Routine_Ejercices`),
     grupos musculares, `Ejercices`, `ExerciseImages`, `SharedRoutines`, asignaciones,
     y cómo se corren las migraciones al arrancar.
   - Servidor: el generador de ilustraciones `tools/ilustraciones` y su README.
   - Dashboard: catálogo, creación y edición de rutinas (`RestInput`) y asignación.
3. **Entregame un plan** con el modelo de datos final, los endpoints, las pantallas
   y los archivos que vas a crear o modificar, y **esperá mi OK** antes de implementar.
   Si encontrás algo del código que contradiga este documento, avisame en el plan.

### Reglas generales

- **Las rutinas de fuerza no cambian de comportamiento.** Todo lo nuevo es aditivo.
- **Compatibilidad hacia atrás:** las versiones viejas de la app tienen que seguir
  funcionando contra el servidor nuevo (ver sección 6.4).
- Seguí las convenciones del proyecto: textos en español rioplatense (voseo),
  nombres de variables y componentes en español, comentarios que expliquen el *por qué*,
  estilos en `styles/`, colores en `styles/colores.js`, `maxFontSizeMultiplier={maxEscalaFuente}`.
- Reutilizá los componentes existentes (`Selector`, `PantallaModal`, `HojaAcciones`,
  `ListaOrdenable`, `ImagenEjercicio`, `EstadoVacio`, `Esqueleto`, `avisos`, `EscanerQR`)
  en lugar de duplicarlos.
- **No commitees.** Al final dejá un `docs/novedades-AAAA-MM.md` (mismo formato que el de
  octubre) con el orden para publicar y lo que verificaste.

---

## 1. Concepto y vocabulario

- **Funcional**: un entrenamiento por tiempo. Es un tipo de rutina distinto del de fuerza.
- **Bloque**: un ejercicio dentro de un funcional, con **tiempo de trabajo** y
  **tiempo de descanso** posterior.
- **Vuelta**: una pasada completa por todos los bloques. Un funcional se repite N vueltas.
- **Descanso entre vueltas**: el descanso que va después del último bloque de cada vuelta.

Ejemplo: "Core express": 3 vueltas, 1:00 de descanso entre vueltas.

| # | Ejercicio | Trabajo | Descanso |
|---|---|---|---|
| 1 | Plancha frontal | 0:45 | 0:15 |
| 2 | Crunch abdominal | 0:40 | 0:20 |
| 3 | Mountain climbers | 0:30 | 0:30 |

Línea de tiempo: Preparación 0:05 → Plancha 0:45 → Desc 0:15 → Crunch 0:40 → Desc 0:20 →
Mountain climbers 0:30 → **Desc. entre vueltas 1:00** (reemplaza el descanso del último
bloque) → Vuelta 2… En la **última vuelta**, después del último bloque no hay descanso:
termina el entrenamiento.

---

## 2. Decisiones ya tomadas (no las reabras sin consultarme)

1. Lo funcional vive en una **pestaña nueva "Funcional"**, con su propio listado.
2. La barra de pestañas queda: **Rutinas · Funcional · Perfil · Más**.
   **Historial** y **Notas** pasan al menú **Más** (como ya está Catálogo) y siguen
   funcionando igual.
3. Estructura: **bloques + vueltas** con descanso entre vueltas.
4. Ejecución con **dos modos**: **Automático** (encadena solo) y **Manual**.
   **Quien crea el funcional (atleta o coach) define el modo por defecto**, y el atleta
   lo puede cambiar al tocar Iniciar, solo para esa sesión.
5. **Catálogo dividido en dos grandes grupos: Fuerza y Funcional.** Fuerza contiene los
   grupos musculares de hoy; Funcional tiene sus propias categorías (sección 4).
   El formulario de funcional ofrece **solo** ejercicios del grupo Funcional, y el de
   rutina de fuerza **solo** los del grupo Fuerza.
6. **Avisos durante la ejecución: pitidos 3-2-1** en los últimos 3 segundos de cada fase
   (preparación, trabajo, descanso, descanso entre vueltas). Sin voz.
7. **Historial**: el mismo de hoy, con días **mezclados** (fuerza + funcional).
8. Alcance: **app + servidor + dashboard**, con todas las funciones que hoy tienen las
   rutinas: **asignar desde el dashboard, compartir por código/QR e importar, reordenar
   arrastrando** (funcionales en el listado y bloques dentro de cada uno) y **notas
   por bloque**.

---

## 3. Modelo de datos

### 3.1 Servidor

Propuesta (ajustala a cómo están hechos realmente los modelos y justificá los cambios):

- **Rutinas**: reutilizar la tabla de rutinas con una columna nueva
  `kind` (`'strength' | 'functional'`, default `'strength'`). Así asignaciones,
  compartir y permisos funcionan sin duplicar tablas. Campos nuevos que solo usa
  `functional`:
  - `rounds` (1–20, default 1)
  - `roundRestSeconds` (0–600)
  - `defaultMode` (`'auto' | 'manual'`, default `'auto'`)
- **Ejercicios de rutina** (`Routine_Ejercices`): columna nueva `workSeconds`
  (5–1800, solo en funcionales). En funcionales, `restSeconds` **puede ser 0**
  (en fuerza sigue siendo > 0). `series` no aplica a funcionales: definí qué valor queda
  para no romper validaciones ni clientes viejos (por ejemplo, 1).
- **Grupos musculares / categorías**: columna nueva `kind` (`'strength' | 'functional'`).
  Los existentes quedan `strength`. Las categorías funcionales se crean con `functional`.
- **Ejercicios del catálogo**: opcional `defaultWorkSeconds` para sugerir un tiempo al
  elegirlos.
- Las migraciones corren solas al arrancar, como en octubre (sin pasos manuales).

### 3.2 App

- Rutina: `tipo: 'fuerza' | 'funcional'` (las que no tienen `tipo` se leen como `'fuerza'`:
  hacé un helper tipo `helpers/descanso.js` y no migres datos guardados).
- Funcional: `{ id, tipo:'funcional', nombre, vueltas, descansoEntreVueltasSegundos,
  modoPorDefecto, bloques:[...], origen, idRoutineBackend, ... }`.
- Bloque: `{ id, ejercicio:{ idEjercicio, nombre, categoria }, trabajoSegundos,
  descansoSegundos, nota }`.
- Decidí en el plan si los funcionales van en `rutinasSlice` (filtrando por `tipo`) o en un
  slice propio. Lo que importe es que la pestaña Rutinas **no muestre** funcionales y la
  pestaña Funcional **no muestre** rutinas de fuerza.
- Agregá la migración de `redux-persist` si cambia la forma del estado.

---

## 4. Catálogo funcional inicial

Quiero el catálogo **lo más completo posible de entrada**. Cargalo como semilla del
servidor (idempotente). Cada ejercicio lleva su **ilustración** (ver 4.1, que es una etapa
propia). Actualizá también el respaldo local `helpers/ejercicios.js` de la app.
Revisá nombres duplicados con el grupo Fuerza y proponé tiempos sugeridos.

**Core**
Plancha frontal · Plancha alta (brazos extendidos) · Plancha lateral izquierda ·
Plancha lateral derecha · Plancha con toque de hombros · Crunch abdominal · Crunch inverso ·
Crunch bicicleta · Hollow hold · Bicho muerto (dead bug) · Elevación de piernas acostado ·
Tijeras (flutter kicks) · Russian twist · V-ups · Superman · Bird dog

**Cardio**
Jumping jacks · Trote en el lugar · Skipping alto · Talones a glúteos · Mountain climbers ·
Escaladores cruzados · Saltar la soga · Patinador (skater) · Shadow boxing ·
Jumping jacks cruzados

**Pliometría**
Burpees · Sentadilla con salto · Estocada con salto alternada · Saltos al cajón ·
Saltos laterales · Rodillas al pecho (tuck jumps) · Salto de rana (salto largo) ·
Saltos en estrella · Flexiones pliométricas

**Tren inferior**
Sentadilla con peso corporal · Sentadilla isométrica en pared · Sentadilla sumo ·
Estocadas alternadas · Estocadas hacia atrás · Sentadilla búlgara · Puente de glúteos ·
Puente de glúteos a una pierna · Step-ups al banco · Elevación de talones ·
Patada de glúteo en cuadrupedia · Sentadilla goblet con kettlebell

**Tren superior**
Flexiones de brazos · Flexiones con rodillas apoyadas · Flexiones diamante ·
Flexiones abiertas · Pike push-ups · Fondos en banco · Plancha a flexión (up-down) ·
Inchworm (gusano) · Toques de hombro en flexión

**Cuerpo completo**
Kettlebell swing · Thrusters · Wall balls · Battle ropes · Bear crawl (oso) · Sprawl ·
Golpe de balón medicinal (slam) · Clean con kettlebell · Turkish get-up ·
Man makers · Remo ergómetro · Air bike

**Movilidad**
Círculos de brazos · Círculos de cadera · Gato-camello · Rotaciones torácicas ·
Sentadilla profunda sostenida · World's greatest stretch · Movilidad de tobillos ·
90/90 de cadera

**Elongación**
Isquiotibiales · Cuádriceps · Pectorales · Hombros · Tríceps · Gemelos ·
Postura del niño · Cobra · Mariposa (aductores) · Figura 4 (glúteo)

### 4.1 Ilustraciones (etapa propia)

Hoy cada ejercicio de fuerza tiene un pictograma generado por código con
`rutina360_server/tools/ilustraciones`, guardado en `ExerciseImages` y servido por
`GET /ejercice/:id/image` (con `ETag`, caché de 7 días y la imagen del grupo como
respaldo). Los funcionales tienen que quedar **al mismo nivel**: no se publica un
ejercicio funcional sin ilustración.

1. **Diagnóstico del generador.** Leé su README y su código y armá una tabla con cada
   ejercicio funcional de la sección 4: ¿se puede dibujar con lo que hay hoy o hace
   falta algo nuevo? Muchas posturas probablemente no existan (plancha lateral,
   burpee, bear crawl, hollow hold, posturas de elongación y movilidad, ejercicios con
   soga, cajón, balón medicinal o battle ropes). Incluí esa tabla en el plan.
2. **Ampliar el generador** con las posturas y los elementos que falten, sin romper
   las 104 ilustraciones actuales: después del cambio tienen que salir idénticas
   (comparalas byte a byte o por hash).
3. **Una imagen genérica por categoría funcional** (Core, Cardio, Pliometría, Tren
   inferior, Tren superior, Cuerpo completo, Movilidad, Elongación), con la misma
   estética que las de los grupos musculares.
4. **Hoja de revisión antes de cargar:** generá una hoja de contacto (un HTML o PNG
   con todas las miniaturas, el nombre del ejercicio y su categoría) y **esperá mi
   aprobación**. Las que marque se corrigen y se vuelve a generar la hoja. Recién con el
   OK se cargan en la semilla del servidor.
5. **Posturas en espejo:** para los que tienen lado (plancha lateral
   izquierda y derecha, por ejemplo), la de un lado es el espejo de la otra.
6. **Respaldo:** si un ejercicio funcional no tiene imagen, el endpoint devuelve la
   genérica de **su categoría funcional**, igual que hoy con los grupos musculares.
7. **Ejercicios nuevos del super admin:** dejá documentado en el README del
   generador cómo agregar un ejercicio funcional y su ilustración (es la regla de
   octubre: el catálogo es del super admin para que todo ejercicio tenga dibujo).
8. **Dónde se ven:**
   - App: al elegir el ejercicio en el formulario, en el detalle del funcional, en la
     pantalla de ejecución (ejercicio actual y "Siguiente") y en el catálogo del perfil.
     Si no carga, no ocupa lugar (como `ImagenEjercicio` hoy).
   - Dashboard: en el catálogo funcional y en el detalle de cada funcional, por el
     proxy `/api/exercises/:id/image`.

---

## 5. App

### 5.1 Navegación

- Pestañas: **Rutinas · Funcional · Perfil · Más**.
- Menú **Más**: Historial, Notas y Catálogo (más lo que ya tenga). Historial y Notas se
  abren como pantallas completas con su encabezado y su botón de volver.
- El catálogo del perfil muestra los dos grupos (Fuerza / Funcional) con sus categorías.

### 5.2 Pestaña Funcional (listado)

Igual que el listado de Rutinas: mis funcionales y los **asignados** por el coach
(con la marca de cambios del coach, como hoy), estado vacío, **reordenar arrastrando**,
**Nuevo funcional** e **Importar** (código o QR). Cada tarjeta muestra el nombre, la
cantidad de bloques, las vueltas y la duración total.

### 5.3 Formulario de funcional

- Nombre.
- Vueltas (1–20) con botones + y −, como las series.
- Descanso entre vueltas: minutos (0–10) y segundos (de a 5), como el descanso actual.
  Si hay una sola vuelta, se oculta.
- Modo por defecto: **Automático / Manual**.
- Lista de bloques reordenable arrastrando. Al agregar o editar un bloque:
  - categoría (solo las funcionales) → ejercicio (con su ilustración);
  - **trabajo**: minutos (0–30) y segundos (de a 5), mínimo 5 s;
  - **descanso**: minutos (0–10) y segundos (de a 5), **puede ser 0**;
  - nota opcional.
- Resumen: **duración total estimada** (preparación + trabajo + descansos + descansos
  entre vueltas, sin el descanso final). Ponelo en un helper puro (`helpers/funcional.js`)
  con tests.
- Validaciones con los mismos avisos que hoy: nombre, al menos un bloque, trabajo > 0.

### 5.4 Detalle de funcional

- Lista de bloques (ilustración, nombre, trabajo, descanso, nota), vueltas, descanso entre
  vueltas y duración total.
- Menú ⋮: Editar, **Compartir** (código + QR, como las rutinas), Eliminar. Los
  **asignados** no se editan ni se comparten, igual que hoy.
- Botón **Iniciar**: abre una hoja con el modo preseleccionado (el por defecto) para
  confirmar o cambiar a Automático/Manual.

### 5.5 Pantalla de ejecución

Pantalla completa, legible con el teléfono apoyado en el piso a 1–2 m:

- Fase actual: **Preparación / Trabajo / Descanso / Descanso entre vueltas**.
- Ejercicio actual con su ilustración y su nota.
- **Cuenta regresiva grande** (mm:ss).
- "Vuelta X de N" · "Bloque Y de M" · "Siguiente: <ejercicio>".
- Barra de progreso del total.
- Controles: **Pausa/Reanudar**, **Saltar** (pasa a la fase siguiente), **Anterior**
  (vuelve al inicio del bloque anterior) y **Terminar** (con confirmación).
- **Preparación de 5 s** antes del primer bloque.
- **Pitidos 3-2-1** (`assets/sounds/beep.mp3`) en los últimos 3 s de cada fase.
- La pantalla se mantiene encendida mientras dura la sesión (`pantallaEncendida`).

**Modo Automático**: encadena todas las fases solo hasta terminar.

**Modo Manual**: cada **trabajo** espera a que el atleta toque **Iniciar** (con su
preparación de 3 s y pitidos). Al terminar el trabajo, el descanso arranca solo; al
terminar el descanso, queda esperando el toque para el bloque siguiente.

**Segundo plano (lo más delicado).** Aplicá la misma regla de oro que
`services/descansoAlarma.js`: el tiempo **no se cuenta en JavaScript**.

- Al iniciar o reanudar, calculá la línea de tiempo con **instantes absolutos**
  (`finEn` de cada fase). Lo que se ve en pantalla se recalcula siempre contra esos
  instantes, nunca restando de a un segundo.
- Programá con notifee una notificación por **cada cambio de fase** con sonido
  ("Descanso — sigue Crunch abdominal", "¡A trabajar! Plancha", "Terminaste"), para que
  el atleta se entere con el teléfono bloqueado o en otra app. En iOS hay un límite de
  64 notificaciones pendientes: programá solo las próximas y reprogramá al volver.
- Pausa = cancelar las programadas; Reanudar = recalcular y reprogramar.
- En modo Manual solo se programa hasta el próximo punto de espera.
- Persistí la sesión en curso: si Android mata la app, al volver se retoma en la fase
  correcta (o se ofrece terminarla y guardar lo hecho).
- Los pitidos 3-2-1 suenan con la app en primer plano. En segundo plano alcanza con la
  notificación del cambio de fase.
- Reusá los permisos y el aviso de alarma exacta que ya existen para el descanso.

### 5.6 Al terminar

Resumen: tiempo total, vueltas completadas y bloques completos, parciales o salteados.
Se guarda en el historial. Si se termina antes, se guarda lo hecho hasta ahí.

### 5.7 Historial (mezclado)

- Extendé `historialSlice` con registros `tipo: 'funcional'` (los actuales se leen como
  fuerza sin migrar):
  `{ id, tipo:'funcional', fecha, idRutina, nombreRutina, modo, vueltasObjetivo,
  vueltasCompletadas, segundosTotales, bloques:[{ vuelta, idEjercicio, nombreEjercicio,
  segundosObjetivo, segundosCumplidos, estado:'completo'|'parcial'|'salteado' }] }`.
- En la tarjeta del día los funcionales aparecen junto a las rutinas de fuerza, con un
  ícono o etiqueta que los distinga.
- En el detalle del día: bloques agrupados por vuelta con el tiempo cumplido contra el
  planificado. Se puede corregir el tiempo cumplido y borrar, igual que hoy.

### 5.8 Compartir e importar

Reusá `services/rutinasCompartidas.js`, el código y el QR (`RUTINA360:ABCD-EF23`).
Al importar, la vista previa muestra bloques, vueltas y duración, y la copia va a la
pestaña **Funcional** (si el código es de una rutina de fuerza, va a **Rutinas**).

---

## 6. Servidor

1. Migraciones al arrancar: columnas nuevas (sección 3.1), categorías funcionales,
   semilla del catálogo funcional e ilustraciones.
2. Endpoints de catálogo: el grupo muscular expone `kind`; se puede filtrar por `kind`.
3. Crear, editar, leer, asignar y compartir rutinas aceptan y devuelven `kind`,
   `rounds`, `roundRestSeconds`, `defaultMode` y, por ejercicio, `workSeconds`.
   Validaciones según `kind` (en funcional: `workSeconds` obligatorio y `restSeconds >= 0`).
4. **Compatibilidad con apps viejas:** una app vieja no sabe mostrar un funcional.
   - Asignaciones: devolvé funcionales **solo** si el cliente declara que los soporta
     (por ejemplo, un header `X-Rutina360-Funcional: 1` o un parámetro). Proponé el
     mecanismo en el plan.
   - Compartir: si una app vieja pide un código de funcional, respondé un error claro
     ("Actualizá la app para importar entrenamientos funcionales").
5. El catálogo sigue siendo solo del super admin.
6. Prueba de punta a punta contra Postgres real, como en octubre: alta, edición,
   asignación, compartir, clientes viejos y nuevos, y migración sobre una base sin las
   columnas.

---

## 7. Dashboard

1. **Catálogo**: dividido en **Fuerza** y **Funcional**, cada uno con sus categorías y
   sus ilustraciones. El super admin puede crear categorías funcionales y ejercicios en
   cada grupo (eligiendo `kind`).
2. **Funcionales**: el coach crea, edita y elimina funcionales: nombre, vueltas,
   descanso entre vueltas, modo por defecto y bloques (ejercicio solo funcional, trabajo,
   descanso con `RestInput` permitiendo 0, nota y orden arrastrando). Muestra la duración
   total.
3. **Asignar** funcionales a alumnos con el mismo flujo de las rutinas.
4. En los listados y en el detalle del alumno se distingue fuerza de funcional.
5. `eslint` y `next build` sin errores.

---

## 8. Orden de trabajo sugerido

1. Plan (y esperar mi OK).
2. **Ilustraciones** (sección 4.1): diagnóstico del generador → ampliación → hoja de
   revisión → **esperar mi OK** → carga.
3. Servidor: modelo, migraciones, catálogo con las ilustraciones aprobadas, endpoints
   y pruebas.
4. Dashboard: catálogo, CRUD de funcionales y asignación.
5. App: navegación (pestañas y Más) → catálogo dividido → listado → formulario →
   detalle → ejecución (primero Automático, después Manual, después segundo plano) →
   historial → compartir e importar → asignados.
6. Verificación y `docs/novedades-AAAA-MM.md`.

## 9. Verificación mínima

- Ilustraciones: las 104 actuales salen idénticas después de ampliar el generador;
  todos los ejercicios funcionales de la semilla tienen imagen; el respaldo devuelve la
  genérica de la categoría funcional; `304` con `ETag` igual que hoy.
- Tests de Jest para el helper de duración total y para la línea de tiempo de la
  ejecución (vueltas, descanso entre vueltas, descanso 0, última vuelta sin descanso,
  pausar/reanudar, saltar, anterior, modo Manual).
- Test de que las rutinas de fuerza viejas (sin `tipo`) siguen funcionando y no aparecen
  en Funcional.
- `eslint` sin errores nuevos en la app.
- Checklist manual en un dispositivo Android: teléfono bloqueado durante un trabajo y
  durante un descanso, app en segundo plano, app cerrada a la fuerza y reabierta, pausa
  larga, y pitidos 3-2-1.
