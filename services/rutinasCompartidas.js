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

/**
 * El QR de una rutina compartida lleva solo el codigo, con un prefijo para
 * reconocer que es de Rutina360. Si alguien lo escanea con la camara del
 * telefono ve el texto y igual puede tipear el codigo.
 */
const PREFIJO_QR = 'RUTINA360:';

export const textoQR = codigo => `${PREFIJO_QR}${normalizarCodigo(codigo)}`;

/**
 * Texto leido de un QR -> codigo "ABCD-EFGH", o null si no es de Rutina360.
 * Tambien acepta un QR que tenga solo el codigo.
 */
export const codigoDesdeQR = texto => {
  const valor = String(texto || '').trim();
  const sinPrefijo = valor.toUpperCase().startsWith(PREFIJO_QR)
    ? valor.slice(PREFIJO_QR.length).trim()
    : valor;
  if (!/^[A-Z0-9]{4}-?[A-Z0-9]{4}$/i.test(sinPrefijo)) return null;
  return normalizarCodigo(sinPrefijo);
};

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

/**
 * Las rutinas que asigna el coach (o el gimnasio) no se comparten: son trabajo
 * suyo. En el telefono se reconocen por origen "asignada", que tienen desde que
 * se agregan a Mis rutinas, o por el id de la asignacion.
 */
export const esRutinaAsignada = rutina =>
  rutina?.origen === 'asignada' || Boolean(rutina?.idAsignacionBackend);

export const MENSAJE_ASIGNADA_NO_COMPARTIBLE =
  'Las rutinas asignadas por tu coach no se pueden compartir.';

/** Sube la copia de la rutina y devuelve { code, expiresAt }. */
export const compartirRutina = async rutina => {
  if (esRutinaAsignada(rutina)) {
    throw new Error(MENSAJE_ASIGNADA_NO_COMPARTIBLE);
  }
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
