# Novedades — octubre 2026

Cambios en los tres sistemas (app, servidor y dashboard). **Nada está commiteado.**

## Orden para publicar

1. **Servidor** (`rutina360_server`). Al arrancar:
   - agrega la columna `restSeconds` y la completa con `rest * 60`;
   - crea las tablas `ExerciseImages` y `SharedRoutines`;
   - carga las 104 ilustraciones (90 ejercicios + 14 grupos).

   No hace falta correr nada a mano.
2. **Dashboard** (`dashboard-rutina360`): `npm run deploy`.
3. **App**: `npm install` (se quitaron dependencias) y nuevo build. Las versiones
   viejas de la app siguen funcionando contra el servidor nuevo, porque `rest`
   (minutos) se sigue mandando.

## 1. Ilustraciones de los ejercicios

- Son pictogramas generados por código, todos con la misma estética. El generador
  está en `rutina360_server/tools/ilustraciones` y su README explica cómo agregar
  ejercicios.
- El servidor las guarda en la tabla `ExerciseImages`, separada de `Ejercices`
  para que el binario no viaje en los listados.
- Endpoint público: `GET /ejercice/:id/image`. Usa `ETag` y caché de 7 días. Si el
  ejercicio no tiene imagen (por ejemplo, uno creado por un gimnasio), devuelve la
  imagen genérica de su grupo muscular.
- **App**: la imagen se ve en el formulario de ejercicio al elegirlo, en el detalle
  del ejercicio y en el catálogo del perfil (tocando el ejercicio). Si no carga, no
  ocupa lugar.
- **Dashboard**: se ve en el catálogo y en el detalle de cada rutina. Pasa por el
  proxy `/api/exercises/:id/image`.

## 2. Descanso en minutos y segundos

- **Servidor**: nueva columna `Routine_Ejercices.restSeconds`. Los setters del modelo
  mantienen `rest` (minutos redondeados) y `restSeconds` sincronizados, venga el
  dato de un cliente nuevo o de uno viejo.
- **App**:
  - el formulario tiene dos selectores (minutos 0–10 y segundos de a 5);
  - el ejercicio guarda `descansoSegundos`;
  - las rutinas viejas, que solo tienen `descanso` en minutos, se leen con
    `helpers/descanso.js` y no hace falta migrarlas.
- **Dashboard**: el componente `RestInput` (minutos + segundos) se usa al crear y al
  editar rutinas.

## 3. Compartir rutinas con un código

- Cualquier usuario logueado, incluidos los atletas, comparte una rutina desde el
  menú `⋮` del detalle → **Compartir rutina**.
- Se genera un código tipo `ABCD-EF23`, que vence a los 30 días, y se manda por el
  menú nativo de compartir (WhatsApp, etc.).
- Quien lo recibe va a **Mis rutinas → Importar**, ingresa el código, ve una vista
  previa y se lleva una **copia propia**.
- Endpoints:
  - `POST /routine/share`
  - `GET /routine/share/:code`
  - `DELETE /routine/share/:code`: solo el autor; anula el código.
- Límite: 30 rutinas compartidas por usuario por día.

## 4. Catálogo solo del administrador general

Crear, editar y borrar ejercicios queda solo para el super admin (servidor y
dashboard), para que todos los ejercicios tengan su ilustración. Los ejercicios
que ya habían creado los gimnasios siguen visibles; los puede borrar el super
admin.

## 5. Historial de entrenamientos (app)

- Pestaña nueva **Historial**: un día por tarjeta (`DD-MM-AAAA`), con las
  rutinas que se hicieron, cantidad de ejercicios, completos y series.
- Detalle del día: ejercicios agrupados por rutina, completo/incompleto y cada
  serie con repeticiones y peso. Se pueden editar.
- Borrar un día (menú ⋮ de la tarjeta o tacho en el detalle) o todo el historial.
- Cada serie terminada se anota sola. Reps y peso se cargan **en el descanso**
  (tarjeta "Registro de la serie"), **al final** ("Registro de hoy" en el
  detalle del ejercicio) o se **saltean**.
- Al reiniciar un ejercicio o una rutina, lo hecho queda guardado y lo que siga
  es un registro nuevo.
- Se guarda en el teléfono (`store/historialSlice.js`), como las rutinas propias.

## 6. iPhone

Ver [ios.md](./ios.md).

## Verificación hecha

- **Servidor**: prueba de punta a punta contra Postgres real. Cubre las imágenes
  (incluido el `304` y la imagen del grupo como respaldo), el descanso
  (alta, edición, clientes viejos y nuevos), compartir (validaciones y permisos) y
  la migración sobre una base sin la columna.
- **Dashboard**: `eslint` y `next build` sin errores. El proxy de imágenes se probó
  contra el servidor.
- **App**:
  - todos los archivos tocados compilan con Babel;
  - `eslint` no marca errores nuevos (el único error es el `useEffect` de
    `formEjercicio`, que ya estaba);
  - hay pruebas unitarias de `helpers/descanso.js` y de la conversión de rutinas
    compartidas.
- **No se probó en dispositivo**: falta probar en Android y en un iPhone.
