/**
 * Descanso entre series.
 *
 * Desde que se pueden elegir minutos y segundos, el dato real es
 * `descansoSegundos`. Las rutinas guardadas antes en el telefono solo tienen
 * `descanso` (minutos enteros), asi que todo lo que lea el descanso tiene que
 * pasar por segundosDescanso(), que entiende los dos formatos.
 */

export const MAX_MINUTOS_DESCANSO = 10;
export const PASO_SEGUNDOS_DESCANSO = 5;

const definido = valor => valor !== null && valor !== undefined && valor !== '';

/** Segundos de descanso de un ejercicio de rutina (formato nuevo o viejo). */
export const segundosDescanso = ejercicio => {
  if (definido(ejercicio?.descansoSegundos)) {
    const segundos = Number(ejercicio.descansoSegundos);
    if (Number.isFinite(segundos)) {
      return Math.max(0, Math.round(segundos));
    }
  }

  return Math.max(0, (Number(ejercicio?.descanso) || 0) * 60);
};

/** Campos a guardar en el ejercicio a partir de los segundos elegidos. */
export const camposDescanso = segundos => {
  const total = Math.max(0, Math.round(Number(segundos) || 0));
  return {
    descansoSegundos: total,
    // Minutos redondeados: solo por compatibilidad con datos viejos.
    descanso: Math.round(total / 60),
  };
};

/** Separa segundos en { minutos, segundos }. */
export const partirDescanso = segundosTotales => {
  const total = Math.max(0, Math.round(Number(segundosTotales) || 0));
  return { minutos: Math.floor(total / 60), segundos: total % 60 };
};

/**
 * Texto corto para mostrar: "1 min", "45 s", "1:30 min".
 */
export const formatearDescanso = segundosTotales => {
  const { minutos, segundos } = partirDescanso(segundosTotales);

  if (minutos === 0 && segundos === 0) {
    return 'Sin descanso';
  }
  if (segundos === 0) {
    return `${minutos} min`;
  }
  if (minutos === 0) {
    return `${segundos} s`;
  }
  return `${minutos}:${String(segundos).padStart(2, '0')} min`;
};

/** Segundos de descanso de un ejercicio que viene del servidor. */
export const segundosDescansoBackend = item => {
  if (definido(item?.restSeconds) && Number.isFinite(Number(item.restSeconds))) {
    return Math.max(0, Number(item.restSeconds));
  }
  return Math.max(0, (Number(item?.rest) || 0) * 60);
};
