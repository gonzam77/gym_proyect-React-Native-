import { apiJson } from './apiClient';
import { camposDescanso, segundosDescanso } from '../helpers/descanso';

/**
 * Compartir rutinas entre usuarios con un codigo.
 *
 * Las rutinas propias viven solo en el telefono, asi que para compartir se
 * manda una copia (snapshot) al servidor y este devuelve un codigo corto. Quien
 * lo recibe lo ingresa en la app y se lleva una copia propia, independiente de
 * la original: puede editarla sin afectar a nadie.
 */

const SEGUNDOS_EJECUCION_DEFECTO = 40;

const generarId = () =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

/** Lo que el usuario tipea -> "ABCD-EFGH" (o lo que haya, sin simbolos). */
export const normalizarCodigo = texto => {
  const limpio = String(texto || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  return limpio.length > 4 ? `${limpio.slice(0, 4)}-${limpio.slice(4)}` : limpio;
};

export const codigoCompleto = codigo => normalizarCodigo(codigo).replace('-', '').length === 8;

/** Rutina local -> payload del servidor. */
const aPayload = rutina => ({
  name: (rutina?.nombre || '').trim(),
  exercises: (rutina?.ejercicios || []).map(e => ({
    idEjercice: e.ejercicio?.idEjercicio ?? null,
    name: e.nombre || e.ejercicio?.nombre || 'Ejercicio',
    category: e.ejercicio?.categoria || '',
    series: Number(e.series) || 1,
    restSeconds: segundosDescanso(e),
    executionSeconds: Number(e.ejercicio?.tiempoEjecucion) || SEGUNDOS_EJECUCION_DEFECTO,
    note: e.nota || '',
  })),
});

/** Sube la copia de la rutina y devuelve { code, expiresAt }. */
export const compartirRutina = async rutina => {
  const body = await apiJson('/routine/share', {
    method: 'POST',
    body: JSON.stringify(aPayload(rutina)),
  });
  return body?.data;
};

/** Busca una rutina compartida por codigo. */
export const buscarRutinaCompartida = async codigo => {
  const limpio = normalizarCodigo(codigo).replace('-', '');
  const body = await apiJson(`/routine/share/${encodeURIComponent(limpio)}`);
  return body?.data;
};

/** Rutina compartida (del servidor) -> rutina local nueva, lista para guardar. */
export const convertirCompartidaEnRutinaLocal = compartida => {
  const ejercicios = (compartida?.exercises || []).map(item => ({
    id: generarId(),
    ejercicio: {
      idEjercicio: item.idEjercice ?? undefined,
      categoria: item.category || '',
      nombre: item.name || 'Ejercicio',
      tiempoEjecucion: Number(item.executionSeconds) || SEGUNDOS_EJECUCION_DEFECTO,
    },
    nombre: item.name || 'Ejercicio',
    series: Number(item.series) || 1,
    ...camposDescanso(item.restSeconds),
    seriesRealizadas: 0,
    nota: item.note || '',
  }));

  const tiempo = ejercicios.reduce(
    (total, e) => total + e.ejercicio.tiempoEjecucion * e.series + e.descansoSegundos * e.series,
    0,
  );

  return {
    id: generarId(),
    nombre: compartida?.name || 'Rutina compartida',
    ejercicios,
    estado: 0,
    tiempo,
    origen: 'compartida',
    compartidaPor: compartida?.owner?.username || null,
  };
};
