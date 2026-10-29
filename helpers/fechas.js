/**
 * Fechas del historial.
 *
 * El dia se guarda como 'AAAA-MM-DD' en hora LOCAL del telefono. No se usa
 * toISOString() porque pasa a UTC: en Argentina (UTC-3) un entrenamiento a las
 * 22 hs quedaria anotado al dia siguiente.
 */

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const dosDigitos = n => String(n).padStart(2, '0');

/** Fecha local 'AAAA-MM-DD' de un instante (por defecto, ahora). */
export const fechaLocal = (fecha = new Date()) =>
  `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

const aDate = clave => {
  const [anio, mes, dia] = String(clave).split('-').map(Number);
  return new Date(anio, (mes || 1) - 1, dia || 1);
};

/** 'AAAA-MM-DD' -> 'DD-MM-AAAA'. */
export const formatearFecha = clave => {
  const [anio, mes, dia] = String(clave).split('-');
  return `${dia}-${mes}-${anio}`;
};

/** Nombre del dia de la semana, o "Hoy" / "Ayer". */
export const etiquetaDia = clave => {
  const hoy = fechaLocal();
  const ayer = fechaLocal(new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (clave === hoy) return 'Hoy';
  if (clave === ayer) return 'Ayer';
  return DIAS[aDate(clave).getDay()];
};

/** Hora local 'HH:MM' de un instante ISO. */
export const horaLocal = iso => {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '';
  return `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`;
};
