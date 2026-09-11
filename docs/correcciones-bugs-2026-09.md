# Correcciones de bugs — septiembre 2026

Ronda de revisión y corrección sobre la base del commit `7ad56a5` (Version 40).
Se revisó todo el código JS/JSX del proyecto (views, components, store, services, helpers)
y se corrigieron 12 defectos, del más grave al más menor.

**Alcance de la verificación:** cada cambio se validó con `npx eslint` (sin hallazgos nuevos;
los avisos que quedan son preexistentes y están listados en [Pendientes](#pendientes)).
**No se probó en dispositivo** — la validación funcional en Android queda pendiente.

## Resumen

| # | Problema | Archivos | Commit |
|---|----------|----------|--------|
| 1 | Modal de `FormRutina` duplicado → crash al guardar una rutina editada | `detalleRutina.jsx`, `misRutinas.jsx`, `formRutina.jsx` | `e46f14e` |
| 2 | La actualización in-app nunca se ejecutaba | `App.jsx` | `41dded2` |
| 3 | Fallback a un atleta ajeno (`FALLBACK_ATHLETE_ID = 10`) | `rutinasAsignadas.jsx` | `8aa9e9a` |
| 4 | El Picker de ejercicio borraba el `id` del ítem de la rutina | `formEjercicio.jsx` | `8aa9e9a` |
| 5 | El refresh del catálogo pisaba la edición en curso | `formEjercicio.jsx` | `8aa9e9a` |
| 6 | Botón Guardar sin `disabled` → rutina duplicada con doble toque | `formRutina.jsx` | `e2a7e19` |
| 7 | La selección quedaba pegada al cerrar con el botón físico "atrás" | `notas.jsx`, `notaDetalle.jsx` | `e2a7e19` |
| 8 | Datos del coach sin validar (descanso 0, series 0) | `descanso.jsx`, `detalleEjercicio.jsx`, `detalleRutina.jsx` | `e2a7e19` |
| 9 | `JSON.parse(JSON.stringify(undefined))` en el detalle de nota | `notaDetalle.jsx` | `e2a7e19` |
| 10 | El formulario de perfil se reseteaba solo | `formUsuario.jsx` | `e2a7e19` |
| 11 | Detener el descanso cancelaba *todas* las notificaciones | `descanso.jsx` | `e2a7e19` |
| 12 | Menores: estilo inválido, título fijo, `NaN` en series | `notas.jsx`, `formComentrario.jsx`, `formEjercicio.jsx` | `e2a7e19` |

---

## 1. Modal de `FormRutina` duplicado

**Síntoma.** Al editar una rutina desde el detalle y tocar Guardar, la app podía crashear con
`TypeError: setRutinaSeleccionada is not a function`. El guardado igual se aplicaba (el dispatch
ocurría antes del error).

**Causa.** El estado `modalFormRutina` vive en [`misRutinas.jsx`](../views/rutinas/misRutinas.jsx)
y alimentaba **dos** `<Modal>` distintos: el propio de `MisRutinas` y otro que renderizaba
`DetalleRutina`. Al abrir el formulario se montaban dos instancias de `FormRutina` en paralelo,
y la de `DetalleRutina` no recibía la prop `setRutinaSeleccionada`, que `handleGuardar` invoca
siempre que existe `rutinaSeleccionada?.id`.

**Cambio.** Queda un único `FormRutina`, el de `MisRutinas`:

- `DetalleRutina` ya no renderiza su propio modal ni recibe la prop `modalFormRutina`; el botón
  "Editar" solo hace `setModalFormRutina(true)`.
- `MisRutinas` dejó de pasar `modalFormRutina` a `DetalleRutina`.
- En `formRutina.jsx` la llamada pasó a ser opcional (`setRutinaSeleccionada?.(...)`) como red de
  seguridad ante un montaje futuro sin esa prop.

El formulario sigue abriendo con la rutina correcta porque `DetalleRutina` ya sincronizaba la
selección hacia arriba con `setRutinaSeleccionada(rutinaActualizada)` en su `useEffect`.

## 2. La actualización in-app nunca se ejecutaba

**Síntoma.** La app nunca ofrecía actualizarse, ni en producción. En el log aparecía siempre
`In-App Updates no disponible en desarrollo: ...`.

**Causa.** `react-native-in-app-updates@0.2.2` **no tiene default export**: expone
`checkForUpdate(updateFlow)` y el enum `UpdateFlow`. El código usaba la API de *otro* paquete
(`sp-react-native-in-app-updates`): `new InAppUpdates(false)`, `checkNeedsUpdate()`,
`startUpdate({updateType})`. Con el import default, `InAppUpdates` era `undefined` y
`new InAppUpdates(false)` lanzaba un `TypeError` que el `try/catch` tapaba.

**Cambio.** [`App.jsx`](../App.jsx) ahora usa la API real:

```jsx
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

useEffect(() => {
  if (Platform.OS !== 'android') {
    return;
  }

  const verificarActualizacion = async () => {
    try {
      await checkForUpdate(UpdateFlow.IMMEDIATE);
    } catch (error) {
      console.log('In-App Updates no disponible:', error?.message || error);
    }
  };

  verificarActualizacion();
}, []);
```

Detalles:

- `checkForUpdate` hace las dos cosas del lado nativo: consulta disponibilidad y, si hay update,
  lanza el flujo de Play. Ya no hacen falta dos pasos.
- Se mantiene `IMMEDIATE` para conservar la intención original (actualización forzada).
- La guarda de `Platform` evita el rechazo garantizado en iOS ("This library is only available on
  Android").
- El `try/catch` va **dentro** de una función async a propósito: así cubre tanto los rechazos de
  promesa (`NO_ACTIVITY`, `UPDATE_CHECK_FAILED`, `NOT_ALLOWED`, `UPDATE_CANCELLED`) como el throw
  **sincrónico** del proxy de `LINKING_ERROR` si el módulo nativo no quedó enlazado.

> El flujo solo corre en un build instalado desde Play (internal testing o superior). En debug o
> con un APK sideloaded siempre va a caer en el `catch`.

## 3. Fallback a un atleta ajeno

**Síntoma.** Un usuario cuyo `idRole` no fuera 4 veía las rutinas asignadas y el coach del atleta
#10, con el header mostrando "Atleta #10".

**Causa.** [`rutinasAsignadas.jsx`](../views/rutinas/rutinasAsignadas.jsx) definía
`FALLBACK_ATHLETE_ID = 10` y lo usaba cuando el rol no era el esperado.

**Cambio.**

- Se eliminó la constante. `athleteId` es ahora siempre `usuarioBackend?.id ?? null`.
- Si no hay id, `obtenerRutinas` y `obtenerCoach` cortan sin pegarle a la API y limpian su estado.
- El header muestra "Sin atleta identificado" y la lista vacía explica
  "No pudimos identificar tu usuario. Volve a iniciar sesion." (variable `mensajeSinRutinas`).

> **Decisión a revisar:** se quitó el filtro por rol. Ver [Decisiones](#decisiones-a-revisar).

## 4. El Picker de ejercicio borraba el `id` del ítem

**Síntoma.** Al elegir "--Seleccione Ejercicio--" en un ejercicio existente y guardar, el ítem
quedaba con `id: ""`: se rompían reordenar, editar y eliminar, y se duplicaban las `key` de React.

**Causa.** La rama `else` del `onValueChange` limpiaba `id` (el id del ítem dentro de la rutina)
en vez del ejercicio elegido, y dejaba `ejercicio` cargado — con lo cual `validarFormulario`
seguía pasando. El nombre de la variable local (`ejercicioSeleccionado`) pisaba la prop homónima,
que es justamente de dónde salió la confusión.

**Cambio.** La rama `else` ahora limpia `ejercicio: {}` y `nombre: ""`, dejando intacto `prev.id`.
Con eso la validación falla correctamente con "Debe seleccionar un ejercicio.". La variable local
se renombró a `ejercicioDelCatalogo`.

## 5. El refresh del catálogo pisaba la edición en curso

**Síntoma.** Al editar un ejercicio, si terminaba de llegar el catálogo remoto mientras el usuario
escribía, las series / descanso / nota volvían a los valores guardados.

**Causa.** El `useEffect` que carga el ejercicio en el formulario dependía de `catalogoEjercicios`,
así que se volvía a ejecutar con cada hidratación o refresh y rehacía `setEjercicioNuevo`.

**Cambio.** Se separaron las dos responsabilidades dentro del mismo efecto:

- `idCargadoRef` garantiza que el formulario se llene desde la rutina **una sola vez** por
  ejercicio abierto; los refrescos posteriores del catálogo ya no lo tocan.
- La categoría se sigue derivando del catálogo (puede llegar tarde), pero solo mientras
  `selectedCategory` esté vacía, para no pisar lo que eligió el usuario.

También se agregó el import faltante de `useRef` en ese archivo.

## 6. Botón Guardar sin `disabled`

**Síntoma.** Doble toque rápido en Guardar creaba la rutina dos veces.

**Causa.** El `<Pressable>` recibía `estaDeshabilitado={...}`, que no es una prop válida de
`Pressable`, así que nunca se deshabilitaba.

**Cambio.** Se corrigió a `disabled={estaDeshabilitado}` y se sumó un `guardandoRef` que corta
reentradas dentro de `handleGuardar` (el `disabled` solo actúa después del re-render; el ref cubre
los toques que entran en el mismo frame). El ref se libera únicamente si la validación falla: tras
un guardado exitoso el formulario se cierra y el componente se desmonta.

## 7. Selección pegada al cerrar con el botón físico "atrás"

**Síntoma.** En Notas, después de editar una sección o un comentario y salir con el botón físico,
el botón flotante de "nuevo" abría el formulario en modo edición y **sobrescribía** el ítem
anterior en vez de crear uno nuevo.

**Causa.** Los `onRequestClose` de los modales solo cerraban el modal, sin limpiar
`notaSeleccionada` / `comentarioSeleccionado`.

**Cambio.** En [`notas.jsx`](../views/notas/notas.jsx) y
[`notaDetalle.jsx`](../views/notas/notaDetalle.jsx):

- cada `onRequestClose` limpia además la selección;
- los botones flotantes limpian la selección **antes** de abrir el formulario, que es lo que
  garantiza que "nuevo" signifique nuevo por cualquier camino.

## 8. Datos del coach sin validar

**Síntoma.** Con una rutina asignada donde el coach dejó descanso o series en 0/nulo:

- completar una serie disparaba al instante la alarma de "Descanso terminado" (notificación
  *ongoing* a pantalla completa), porque el timer arrancaba en 0;
- un ejercicio con 0 series aparecía como FINALIZADO apenas se abría.

**Causa.** `convertirAsignacionEnRutinaLocal` mapea con `Number(item.rest) || 0` y
`Number(item.series) || 0`, y ni el timer ni la pantalla de detalle contemplaban el 0.

**Cambio.**

- [`descanso.jsx`](../views/rutinas/descanso.jsx): si `segundosTotales <= 0` no se arranca el
  intervalo ni se dispara la notificación.
- [`detalleEjercicio.jsx`](../views/rutinas/detalleEjercicio.jsx): `finalizado` ahora exige
  `series > 0` y compara con `>=` (antes `===`, que además fallaba si las realizadas superaban al
  total).
- [`detalleRutina.jsx`](../views/rutinas/detalleRutina.jsx): mismo criterio en el cartel
  FINALIZADO de la lista.

## 9. `JSON.parse(JSON.stringify(undefined))`

**Síntoma.** Crash potencial (`SyntaxError: Unexpected token u`) en el detalle de nota si la nota
no se encontraba en el store.

**Cambio.** Se guardó la copia igual que ya se hacía en `detalleRutina`:

```jsx
const copiaNotaActualizada = notaActualizada
    ? JSON.parse(JSON.stringify(notaActualizada))
    : null;
const listadoNotas = copiaNotaActualizada?.notas?.reverse() || [];
```

## 10. El formulario de perfil se reseteaba solo

**Síntoma.** Con el modal de perfil abierto, cualquier re-render de `Perfil` descartaba lo que el
usuario estaba editando.

**Causa.** `Perfil` arma `usuarioPerfil` como objeto nuevo en cada render, y el `useEffect` de
`FormUsuario` lo tenía como dependencia para reinicializar el estado.

**Cambio.** [`formUsuario.jsx`](../views/usuario/formUsuario.jsx) usa `usuarioCargadoRef` para
reinicializar solo cuando cambia la identidad del usuario (`usuarioBackend?.id ?? usuario?.id`).
Las dependencias del efecto quedan completas, así que no hace falta silenciar eslint.

## 11. Detener el descanso cancelaba *todas* las notificaciones

**Síntoma.** El botón de detener ejecutaba `notifee.cancelAllNotifications()`, borrando cualquier
notificación de la app, no solo la del descanso.

**Cambio.** `displayNotification` devuelve el id de la notificación; ahora se guarda en
`notificacionIdRef` y se cancela solo esa, vía `cancelarNotificacionDescanso()`.

Como parte del mismo ciclo de vida, `reiniciar()` también cancela la alarma pendiente: antes, si
sonaba la alarma y se tocaba reiniciar, la notificación *ongoing* quedaba colgada sin forma de
sacarla desde la app.

## 12. Menores

- **`right:'50'`** en el botón flotante de Notas: `'50'` no es un valor válido de estilo en React
  Native (solo número o porcentaje). Se interpretó como `right: 50`.
- **Título del formulario de comentario**: decía siempre "Editar Comentario" porque evaluaba
  `idNota` (siempre presente) en vez de `comentarioSeleccionado?.id`.
- **`NaN` en el campo Series**: `Number(valor)` sin guarda dejaba `"NaN"` escrito en el input.
  Ahora se sanitiza a dígitos antes de convertir.

---

## Decisiones a revisar

1. **Filtro por rol en rutinas asignadas (punto 3).** Se eliminó la condición `idRole === 4`: hoy
   se consulta siempre el id del usuario logueado. Un coach que entre a la app va a ver su propia
   lista (vacía) en lugar de la de otro. Se hizo así porque no se pudo verificar que el backend
   devuelva `idRole` de forma confiable en el payload de login, y un filtro por rol mal detectado
   dejaría a un atleta real sin sus rutinas. Si se confirma la forma del payload, se puede
   reponer el gate con un mensaje del tipo "esta sección es solo para atletas".

2. **`right: 50` en el FAB de Notas (punto 12).** Es la lectura literal del `'50'` original. Si la
   intención era centrarlo, hay que resolverlo de otra forma (`'50%'` lo dejaría a la izquierda
   del centro).

## Pendientes

Detectados en la revisión y **no** corregidos — no rompen funcionalidad:

- Componentes definidos dentro del render: `EntrenamientoItem` en `misRutinas.jsx` y varios
  `ListEmptyComponent`. React los desmonta y remonta en cada render.
- `notas.jsx` clona en profundidad todas las notas en cada render.
- Tres `useEffect` con dependencias incompletas (`App.jsx:74`, `formRutina.jsx:55`,
  `formEjercicio.jsx:53`) y uno en `components/formNota.jsx:33`. Eslint los marca como *error*.
- `uuid` importado sin usar en `formComentrario.jsx`; `categorias` shadowed en `formEjercicio.jsx`.
- `SafeAreaView` de `react-native` (deprecado) teniendo `react-native-safe-area-context` instalado.
- Sin validación de título vacío al crear una sección de notas, ni de comentario vacío.
- `npx eslint .` reporta ~1200 problemas, casi todos de formato (comillas, espacios), que tapan
  los errores reales de hooks.

## Notas de entorno

- **Fin de línea.** El repo tiene `core.autocrlf=true` pero varios archivos quedaron guardados con
  CRLF en el blob (`App.jsx`, `rutinasAsignadas.jsx`, entre otros). Al hacer `git add`, git
  normaliza el archivo entero a LF, así que el commit puede mostrar cientos de líneas tocadas
  aunque el cambio real sean unas pocas. Es una condición preexistente del repo.
- **Pruebas en dispositivo.** Ningún cambio fue probado en un emulador o teléfono. Los checks
  manuales recomendados: editar y guardar una rutina desde el detalle (1, 6); agregar y editar un
  ejercicio con el catálogo recién refrescado (4, 5); una rutina asignada con descanso/series en 0
  (8); crear y editar secciones y comentarios en Notas saliendo con el botón físico (7, 9, 12);
  editar el perfil con el modal abierto un rato largo (10); y el ciclo completo de descanso
  incluyendo reiniciar con la alarma sonando (11).
