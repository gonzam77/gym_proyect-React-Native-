import {
  LIMITES,
  MODO_AUTO,
  SEGUNDOS_TRABAJO_DEFECTO,
  TIPO_FUNCIONAL,
  bloquesDe,
  descansoDe,
  descansoEntreVueltasDe,
  duracionTotal,
  generarIdBloque,
  normalizarModo,
  trabajoDe,
  vueltasDe,
} from './funcional';

/**
 * Conversiones entre el funcional del telefono y lo que manda o recibe el
 * servidor (asignaciones del coach y rutinas compartidas por codigo).
 *
 * El servidor habla de rutinas con kind 'functional': rounds, roundRestSeconds,
 * defaultMode y, por ejercicio, workSeconds, restSeconds y position.
 */

export const KIND_FUNCIONAL = 'functional';

const normalizarTexto = texto =>
  texto
    ?.toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

const acotar = (valor, [minimo, maximo], defecto) => {
  const numero = Math.round(Number(valor));
  if (!Number.isFinite(numero)) {return defecto;}
  return Math.min(maximo, Math.max(minimo, numero));
};

export const esAsignacionFuncional = asignacion => asignacion?.Routine?.kind === KIND_FUNCIONAL;

export const esCompartidaFuncional = compartida => compartida?.kind === KIND_FUNCIONAL;

/** Mismo orden que el servidor: por posicion y, sin posicion, por id. */
const ordenarPorPosicion = items =>
  [...(items || [])].sort((a, b) => {
    const pa = a?.position ?? Number.MAX_SAFE_INTEGER;
    const pb = b?.position ?? Number.MAX_SAFE_INTEGER;
    return pa - pb || (Number(a?.id) || 0) - (Number(b?.id) || 0);
  });

const segundosDescansoItem = item => {
  if (item?.restSeconds !== null && item?.restSeconds !== undefined && Number.isFinite(Number(item.restSeconds))) {
    return Number(item.restSeconds);
  }
  return (Number(item?.rest) || 0) * 60;
};

/**
 * Huella de un funcional asignado. Si cambia, el coach lo modifico y la copia
 * del telefono muestra "Actualizada por el coach". Es propia de los
 * funcionales: la de fuerza (rutinasAsignadas.jsx) no se toca, para que las
 * rutinas ya agregadas no aparezcan como modificadas al instalar esta version.
 */
export const construirHuellaFuncional = asignacion => {
  const rutina = asignacion?.Routine;
  const bloques = (rutina?.Routine_Ejercices || [])
    .map(item => ({
      id: item?.id || 0,
      idEjercicio: item?.Ejercice?.id || 0,
      nombre: normalizarTexto(item?.Ejercice?.name) || '',
      trabajo: Number(item?.workSeconds) || 0,
      descanso: segundosDescansoItem(item),
      posicion: item?.position ?? null,
      comentarios: (item?.comments || '').trim(),
    }))
    .sort((a, b) => a.id - b.id);

  return JSON.stringify({
    kind: KIND_FUNCIONAL,
    idAsignacion: asignacion?.id || 0,
    idRoutine: rutina?.id || 0,
    nombre: normalizarTexto(rutina?.name) || '',
    vueltas: Number(rutina?.rounds) || 1,
    descansoEntreVueltas: Number(rutina?.roundRestSeconds) || 0,
    modo: normalizarModo(rutina?.defaultMode),
    bloques,
  });
};

const conTiempo = funcional => ({ ...funcional, tiempo: duracionTotal(funcional) });

/** Asignacion del coach (con su Routine funcional) -> funcional local. */
export const convertirAsignacionFuncional = asignacion => {
  const rutina = asignacion?.Routine;
  const bloques = ordenarPorPosicion(rutina?.Routine_Ejercices).map(item => {
    const ejercicio = item?.Ejercice;
    return {
      id: generarIdBloque(),
      idBackend: item?.id,
      ejercicio: {
        idEjercicio: ejercicio?.id,
        nombre: ejercicio?.name || 'Ejercicio',
        categoria: normalizarTexto(ejercicio?.MuscleGroup?.name) || '',
      },
      trabajoSegundos: acotar(item?.workSeconds, LIMITES.trabajo, SEGUNDOS_TRABAJO_DEFECTO),
      descansoSegundos: acotar(segundosDescansoItem(item), LIMITES.descanso, 0),
      nota: item?.comments || '',
    };
  });

  const huella = construirHuellaFuncional(asignacion);

  return conTiempo({
    id: generarIdBloque(),
    tipo: TIPO_FUNCIONAL,
    idAsignacionBackend: asignacion?.id,
    idRoutineBackend: rutina?.id,
    huellaAsignacion: huella,
    huellaAsignacionActual: huella,
    tieneCambiosAsignados: false,
    origen: 'asignada',
    nombre: rutina?.name || 'Funcional asignado',
    vueltas: acotar(rutina?.rounds, LIMITES.vueltas, 1),
    descansoEntreVueltasSegundos: acotar(rutina?.roundRestSeconds, LIMITES.descansoEntreVueltas, 0),
    modoPorDefecto: normalizarModo(rutina?.defaultMode),
    bloques,
    estado: 0,
  });
};

/** Funcional local -> payload de POST /routine/share. */
export const aPayloadFuncional = funcional => ({
  name: (funcional?.nombre || '').trim(),
  kind: KIND_FUNCIONAL,
  rounds: vueltasDe(funcional),
  roundRestSeconds: descansoEntreVueltasDe(funcional),
  defaultMode: normalizarModo(funcional?.modoPorDefecto),
  exercises: bloquesDe(funcional).map(b => ({
    idEjercice: b.ejercicio?.idEjercicio ?? null,
    name: b.ejercicio?.nombre || 'Ejercicio',
    category: b.ejercicio?.categoria || '',
    workSeconds: trabajoDe(b),
    restSeconds: descansoDe(b),
    note: b.nota || '',
  })),
});

/** Funcional compartido (GET /routine/share/:code) -> funcional local nuevo. */
export const convertirCompartidaFuncional = compartida =>
  conTiempo({
    id: generarIdBloque(),
    tipo: TIPO_FUNCIONAL,
    nombre: compartida?.name || 'Funcional compartido',
    vueltas: acotar(compartida?.rounds, LIMITES.vueltas, 1),
    descansoEntreVueltasSegundos: acotar(compartida?.roundRestSeconds, LIMITES.descansoEntreVueltas, 0),
    modoPorDefecto: normalizarModo(compartida?.defaultMode || MODO_AUTO),
    bloques: (compartida?.exercises || []).map(item => ({
      id: generarIdBloque(),
      ejercicio: {
        idEjercicio: item.idEjercice ?? undefined,
        nombre: item.name || 'Ejercicio',
        categoria: item.category || '',
      },
      trabajoSegundos: acotar(item.workSeconds, LIMITES.trabajo, SEGUNDOS_TRABAJO_DEFECTO),
      descansoSegundos: acotar(item.restSeconds, LIMITES.descanso, 0),
      nota: item.note || '',
    })),
    estado: 0,
    origen: 'compartida',
    compartidaPor: compartida?.owner?.username || null,
  });
