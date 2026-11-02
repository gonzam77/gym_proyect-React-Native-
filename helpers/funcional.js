/**
 * Entrenamientos funcionales (por tiempo).
 *
 * Un funcional es una rutina con `tipo: 'funcional'` que se repite `vueltas`
 * veces. Cada bloque tiene un tiempo de trabajo y un descanso posterior (que
 * puede ser 0). Despues del ultimo bloque de cada vuelta va el descanso entre
 * vueltas, que REEMPLAZA al descanso de ese bloque. En la ultima vuelta, el
 * ultimo bloque termina el entrenamiento.
 *
 * Las rutinas guardadas antes de que existiera el tipo no tienen `tipo`: se
 * leen como fuerza, igual que helpers/descanso.js lee el descanso viejo. Asi no
 * hay que migrar nada de lo que ya esta en el telefono.
 *
 * Todo lo de este archivo es puro (sin timers ni redux) para poder testearlo.
 */

export const TIPO_FUERZA = 'fuerza';
export const TIPO_FUNCIONAL = 'funcional';

export const tipoRutina = rutina =>
  rutina?.tipo === TIPO_FUNCIONAL ? TIPO_FUNCIONAL : TIPO_FUERZA;

export const esFuncional = rutina => tipoRutina(rutina) === TIPO_FUNCIONAL;

export const esDelTipo = (rutina, tipo) => tipoRutina(rutina) === tipo;

/** Mismos limites que valida el servidor (rutina360_server/lib/funcional.js). */
export const LIMITES = {
  vueltas: [1, 20],
  descansoEntreVueltas: [0, 600],
  trabajo: [5, 1800],
  descanso: [0, 600],
};

export const PASO_SEGUNDOS = 5;
export const MAX_MINUTOS_TRABAJO = 30;
export const MAX_MINUTOS_DESCANSO_FUNCIONAL = 10;
export const SEGUNDOS_TRABAJO_DEFECTO = 40;

/** Preparacion antes del primer bloque. */
export const SEGUNDOS_PREPARACION = 5;
/** En Manual, despues de tocar Iniciar: alcanza para acomodarse. */
export const SEGUNDOS_PREPARACION_MANUAL = 3;

export const MODO_AUTO = 'auto';
export const MODO_MANUAL = 'manual';

export const MODOS = [
  {
    valor: MODO_AUTO,
    etiqueta: 'Automático',
    descripcion: 'Encadena trabajo y descanso solo, hasta terminar.',
  },
  {
    valor: MODO_MANUAL,
    etiqueta: 'Manual',
    descripcion: 'Cada bloque espera a que toques Iniciar.',
  },
];

export const normalizarModo = modo => (modo === MODO_MANUAL ? MODO_MANUAL : MODO_AUTO);

export const etiquetaModo = modo => MODOS.find(m => m.valor === normalizarModo(modo)).etiqueta;

const acotar = (valor, [minimo, maximo], defecto) => {
  const numero = Math.round(Number(valor));
  if (!Number.isFinite(numero)) {return defecto;}
  return Math.min(maximo, Math.max(minimo, numero));
};

export const vueltasDe = funcional => acotar(funcional?.vueltas, LIMITES.vueltas, 1);

/** Con una sola vuelta no hay descanso entre vueltas, aunque haya quedado guardado. */
export const descansoEntreVueltasDe = funcional =>
  vueltasDe(funcional) > 1
    ? acotar(funcional?.descansoEntreVueltasSegundos, LIMITES.descansoEntreVueltas, 0)
    : 0;

export const trabajoDe = bloque =>
  acotar(bloque?.trabajoSegundos, LIMITES.trabajo, SEGUNDOS_TRABAJO_DEFECTO);

export const descansoDe = bloque => acotar(bloque?.descansoSegundos, LIMITES.descanso, 0);

export const bloquesDe = funcional => (Array.isArray(funcional?.bloques) ? funcional.bloques : []);

/**
 * Fases de la ejecucion, en orden:
 * { tipo, vuelta (1..N), bloque (indice), segundos }.
 *
 * tipo: 'preparacion' | 'trabajo' | 'descanso' | 'descansoVueltas' | 'espera'.
 * La 'espera' (solo en Manual) no tiene segundos: dura hasta que el atleta toca
 * Iniciar. Las fases de descanso con 0 segundos no se agregan.
 */
export const construirLineaDeTiempo = (funcional, { modo = MODO_AUTO } = {}) => {
  const bloques = bloquesDe(funcional);
  if (!bloques.length) {return [];}

  const manual = normalizarModo(modo) === MODO_MANUAL;
  const vueltas = vueltasDe(funcional);
  const descansoVueltas = descansoEntreVueltasDe(funcional);
  const fases = [{ tipo: 'preparacion', vuelta: 1, bloque: 0, segundos: SEGUNDOS_PREPARACION }];

  for (let vuelta = 1; vuelta <= vueltas; vuelta += 1) {
    bloques.forEach((bloque, indice) => {
      const primero = vuelta === 1 && indice === 0;
      // El primer bloque usa la preparacion de 5 s que arranca con Iniciar.
      if (manual && !primero) {
        fases.push({ tipo: 'espera', vuelta, bloque: indice, segundos: null });
        fases.push({ tipo: 'preparacion', vuelta, bloque: indice, segundos: SEGUNDOS_PREPARACION_MANUAL });
      }

      fases.push({ tipo: 'trabajo', vuelta, bloque: indice, segundos: trabajoDe(bloque) });

      const ultimoDeLaVuelta = indice === bloques.length - 1;
      if (!ultimoDeLaVuelta) {
        const descanso = descansoDe(bloque);
        if (descanso > 0) {fases.push({ tipo: 'descanso', vuelta, bloque: indice, segundos: descanso });}
      } else if (vuelta < vueltas && descansoVueltas > 0) {
        fases.push({ tipo: 'descansoVueltas', vuelta, bloque: indice, segundos: descansoVueltas });
      }
    });
  }

  return fases;
};

/**
 * Duracion total estimada en segundos: preparacion + trabajos + descansos +
 * descansos entre vueltas, sin el descanso final. Se mide sobre el modo
 * Automatico: en Manual depende de cuanto tarde el atleta en tocar Iniciar.
 */
export const duracionTotal = (funcional, { conPreparacion = true } = {}) =>
  construirLineaDeTiempo(funcional)
    .filter(fase => conPreparacion || fase.tipo !== 'preparacion')
    .reduce((total, fase) => total + (fase.segundos || 0), 0);

/** "0:45", "12:30", "1:05:00". Para la cuenta regresiva y las duraciones. */
export const formatearReloj = segundosTotales => {
  const total = Math.max(0, Math.round(Number(segundosTotales) || 0));
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;
  const dos = n => String(n).padStart(2, '0');
  return horas > 0 ? `${horas}:${dos(minutos)}:${dos(segundos)}` : `${minutos}:${dos(segundos)}`;
};

/** Texto corto de un tiempo de trabajo o descanso: "45 s", "1 min", "1:30 min". */
export const formatearSegundos = (segundosTotales, textoCero = 'Sin descanso') => {
  const total = Math.max(0, Math.round(Number(segundosTotales) || 0));
  if (total === 0) {return textoCero;}
  const minutos = Math.floor(total / 60);
  const segundos = total % 60;
  if (minutos === 0) {return `${segundos} s`;}
  if (segundos === 0) {return `${minutos} min`;}
  return `${minutos}:${String(segundos).padStart(2, '0')} min`;
};

export const NOMBRES_FASE = {
  preparacion: 'Preparación',
  trabajo: 'Trabajo',
  descanso: 'Descanso',
  descansoVueltas: 'Descanso entre vueltas',
  espera: 'Listo para seguir',
};

export const nombreBloque = bloque =>
  bloque?.ejercicio?.nombre || bloque?.nombre || 'Ejercicio';

/** Indice de la proxima fase de trabajo despues de `indice` (o -1). */
export const indiceSiguienteTrabajo = (fases, indice) => {
  for (let i = indice + 1; i < fases.length; i += 1) {
    if (fases[i].tipo === 'trabajo') {return i;}
  }
  return -1;
};

/**
 * Texto de la notificacion que avisa un cambio de fase, para cuando el telefono
 * esta bloqueado o el atleta esta en otra app.
 * cambio: { tipo: 'fin' } o { indice } (la fase que empieza).
 */
export const textoCambioDeFase = (funcional, fases, cambio) => {
  const bloques = bloquesDe(funcional);
  const vueltas = vueltasDe(funcional);

  if (cambio.tipo === 'fin') {
    return { titulo: '¡Terminaste!', cuerpo: `${funcional?.nombre || 'Funcional'} completo.` };
  }

  const fase = fases[cambio.indice];
  const bloque = bloques[fase.bloque];
  const proxima = fases[indiceSiguienteTrabajo(fases, cambio.indice)];
  const nombreProximo = proxima ? nombreBloque(bloques[proxima.bloque]) : '';
  const detalleVuelta = vueltas > 1 ? `Vuelta ${fase.vuelta} de ${vueltas} · ` : '';

  switch (fase.tipo) {
    case 'trabajo':
      return {
        titulo: `¡A trabajar! ${nombreBloque(bloque)}`,
        cuerpo: `${detalleVuelta}${formatearSegundos(fase.segundos)}`,
      };
    case 'descanso':
      return {
        titulo: `Descanso — sigue ${nombreProximo}`,
        cuerpo: `${detalleVuelta}${formatearSegundos(fase.segundos)} de descanso`,
      };
    case 'descansoVueltas':
      return {
        titulo: 'Descanso entre vueltas',
        cuerpo: `${formatearSegundos(fase.segundos)} · después: vuelta ${fase.vuelta + 1} con ${nombreProximo}`,
      };
    case 'espera':
      return {
        titulo: 'Descanso terminado',
        cuerpo: `Tocá Iniciar para seguir con ${nombreBloque(bloque)}.`,
      };
    default:
      return {
        titulo: `Preparate — ${nombreBloque(bloque)}`,
        cuerpo: `${detalleVuelta}arranca en ${fase.segundos} s`,
      };
  }
};

const generarId = () =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

/** Funcional vacio para el formulario. */
export const funcionalNuevo = () => ({
  id: generarId(),
  tipo: TIPO_FUNCIONAL,
  nombre: '',
  vueltas: 3,
  descansoEntreVueltasSegundos: 60,
  modoPorDefecto: MODO_AUTO,
  bloques: [],
  estado: 0,
  tiempo: 0,
});

export const generarIdBloque = generarId;
