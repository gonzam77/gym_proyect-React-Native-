/**
 * Repeticiones y peso de cada serie (historial).
 */

/** Texto del input -> entero de repeticiones, o null si esta vacio/invalido. */
export const leerRepeticiones = texto => {
  const limpio = String(texto ?? '').replace(/[^0-9]/g, '');
  if (!limpio) return null;
  return Math.min(999, Number(limpio));
};

/** Texto del input -> kilos (acepta coma), o null si esta vacio/invalido. */
export const leerPeso = texto => {
  const limpio = String(texto ?? '').replace(',', '.').replace(/[^0-9.]/g, '');
  if (!limpio || limpio === '.') return null;
  const numero = Number.parseFloat(limpio);
  if (!Number.isFinite(numero)) return null;
  return Math.min(999, Math.round(numero * 100) / 100);
};

/** Mientras se escribe: deja solo digitos y una coma/punto decimal. */
export const limpiarPesoEscrito = texto => {
  const normalizado = String(texto ?? '').replace('.', ',').replace(/[^0-9,]/g, '');
  const [entero, ...resto] = normalizado.split(',');
  return resto.length ? `${entero},${resto.join('').slice(0, 2)}` : entero;
};

export const pesoATexto = peso =>
  peso === null || peso === undefined ? '' : String(peso).replace('.', ',');

/** "12 reps · 40 kg", "12 reps", "40 kg", "No registrada" o "Pendiente". */
export const describirSerie = serie => {
  if (serie.estado === 'salteada') return 'No registrada';
  if (serie.estado !== 'registrada') return 'Pendiente';
  const partes = [];
  if (serie.repeticiones !== null && serie.repeticiones !== undefined) partes.push(`${serie.repeticiones} reps`);
  if (serie.peso !== null && serie.peso !== undefined) partes.push(`${pesoATexto(serie.peso)} kg`);
  return partes.join(' · ') || 'Registrada';
};

export const seriesPendientes = registro =>
  (registro?.series || []).filter(s => s.estado === 'pendiente');
