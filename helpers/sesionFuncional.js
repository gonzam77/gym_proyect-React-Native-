import {
  bloquesDe,
  construirLineaDeTiempo,
  nombreBloque,
  normalizarModo,
  vueltasDe,
} from './funcional';

/**
 * Motor de la sesion de un funcional.
 *
 * La regla de oro es la misma del descanso (services/descansoAlarma.js): el
 * tiempo NO se cuenta en JavaScript. La sesion guarda instantes absolutos
 * (inicio y fin de la fase en curso) y todo lo demas se calcula contra `ahora`.
 * Si Android congela o mata la app, al volver se llama a estadoEn(ahora) y la
 * sesion avanza sola por las fases que ya vencieron.
 *
 * Todas las funciones son puras: reciben la sesion y `ahora` (ms) y devuelven
 * una sesion nueva. No hay timers aca; la pantalla solo refresca cada 250 ms.
 *
 * Forma (se persiste en redux, por eso es todo serializable):
 * {
 *   id, funcional (copia), modo, fases,
 *   indice,          // fase en curso
 *   inicioFase,      // ms en que arranco (corrido por las pausas)
 *   finFase,         // ms en que termina; null en 'espera'
 *   pausadaEn,       // ms de la pausa, o null
 *   iniciadaEn, msInactivo (pausas + esperas, no cuentan como entrenamiento),
 *   cumplidos: { 'vuelta-bloque': segundos hechos },
 *   terminada, terminadaEn,
 *   version,         // sube con cada accion del atleta: hay que reprogramar avisos
 * }
 */

const clave = (vuelta, bloque) => `${vuelta}-${bloque}`;

const finDe = (fase, inicio) => (fase.segundos == null ? null : inicio + fase.segundos * 1000);

const conFase = (sesion, indice, inicio) => ({
  ...sesion,
  indice,
  inicioFase: inicio,
  finFase: finDe(sesion.fases[indice], inicio),
});

/** Anota los segundos hechos de un bloque; si ya habia mas (un Anterior), se queda con el mayor. */
const anotar = (sesion, fase, segundos) => {
  const k = clave(fase.vuelta, fase.bloque);
  const previo = sesion.cumplidos[k];
  const hechos = Math.max(0, Math.min(fase.segundos, Math.round(segundos)));
  if (previo != null && previo >= hechos) {return sesion;}
  return { ...sesion, cumplidos: { ...sesion.cumplidos, [k]: hechos } };
};

const segundosTranscurridos = (sesion, ahora) => {
  const hasta = sesion.pausadaEn ?? ahora;
  return Math.max(0, (hasta - sesion.inicioFase) / 1000);
};

const terminarEn = (sesion, instante) => ({
  ...sesion,
  terminada: true,
  terminadaEn: instante,
  finFase: null,
  pausadaEn: null,
});

export const iniciar = (funcional, modo, ahora) => {
  const modoSesion = normalizarModo(modo);
  const fases = construirLineaDeTiempo(funcional, { modo: modoSesion });
  const base = {
    id: `${funcional?.id || 'funcional'}-${ahora}`,
    funcional: JSON.parse(JSON.stringify(funcional)),
    modo: modoSesion,
    fases,
    pausadaEn: null,
    iniciadaEn: ahora,
    msInactivo: 0,
    cumplidos: {},
    terminada: fases.length === 0,
    terminadaEn: fases.length === 0 ? ahora : null,
    version: 1,
  };
  return fases.length ? conFase(base, 0, ahora) : { ...base, indice: 0, inicioFase: ahora, finFase: null };
};

/**
 * Pasa a la fase siguiente, que empieza en `inicio`. Si la sesion estaba en
 * pausa, la fase nueva tambien queda en pausa (con 0 s transcurridos).
 */
const avanzar = (sesion, inicio) => {
  const siguiente = sesion.indice + 1;
  if (siguiente >= sesion.fases.length) {return terminarEn(sesion, inicio);}
  const nueva = conFase(sesion, siguiente, inicio);
  return sesion.pausadaEn != null ? { ...nueva, pausadaEn: inicio } : nueva;
};

/** Avanza por todas las fases que ya vencieron a `ahora`. */
export const estadoEn = (sesion, ahora) => {
  if (!sesion || sesion.terminada || sesion.pausadaEn != null) {return sesion;}

  let actual = sesion;
  while (!actual.terminada && actual.finFase != null && ahora >= actual.finFase) {
    const fase = actual.fases[actual.indice];
    if (fase.tipo === 'trabajo') {actual = anotar(actual, fase, fase.segundos);}
    actual = avanzar(actual, actual.finFase);
  }
  return actual;
};

export const faseActual = sesion => (sesion && !sesion.terminada ? sesion.fases[sesion.indice] : null);

/** Milisegundos que le faltan a la fase en curso (null en 'espera' o al terminar). */
export const restanteMs = (sesion, ahora) => {
  if (!sesion || sesion.terminada || sesion.finFase == null) {return null;}
  const hasta = sesion.pausadaEn ?? ahora;
  return Math.max(0, sesion.finFase - hasta);
};

export const estaPausada = sesion => Boolean(sesion && sesion.pausadaEn != null);

const conAccion = sesion => ({ ...sesion, version: (sesion.version || 0) + 1 });

export const pausar = (sesion, ahora) => {
  const actual = estadoEn(sesion, ahora);
  const fase = faseActual(actual);
  if (!fase || actual.pausadaEn != null || fase.tipo === 'espera') {return actual;}
  return conAccion({ ...actual, pausadaEn: ahora });
};

export const reanudar = (sesion, ahora) => {
  if (!sesion || sesion.pausadaEn == null) {return sesion;}
  const pausa = ahora - sesion.pausadaEn;
  const inicioFase = sesion.inicioFase + pausa;
  return conAccion({
    ...sesion,
    pausadaEn: null,
    inicioFase,
    finFase: finDe(sesion.fases[sesion.indice], inicioFase),
    msInactivo: sesion.msInactivo + pausa,
  });
};

/** Saltar: lo hecho del trabajo en curso queda anotado y empieza la fase siguiente. */
export const saltar = (sesion, ahora) => {
  let actual = estadoEn(sesion, ahora);
  const fase = faseActual(actual);
  if (!fase) {return actual;}

  if (fase.tipo === 'trabajo') {actual = anotar(actual, fase, segundosTranscurridos(actual, ahora));}
  if (fase.tipo === 'espera') {actual = { ...actual, msInactivo: actual.msInactivo + (ahora - actual.inicioFase) };}
  return conAccion(avanzar(actual, ahora));
};

/** El toque de Iniciar en Manual: termina la espera y arranca la preparacion. */
export const continuar = (sesion, ahora) => {
  const actual = estadoEn(sesion, ahora);
  const fase = faseActual(actual);
  if (!fase || fase.tipo !== 'espera') {return actual;}
  return saltar(actual, ahora);
};

/** Indice donde empieza el trabajo de un bloque (en Manual, su preparacion). */
const inicioDelBloque = (fases, indiceTrabajo) => {
  const previa = fases[indiceTrabajo - 1];
  const trabajo = fases[indiceTrabajo];
  const esSuPreparacion = previa
    && previa.tipo === 'preparacion'
    && previa.vuelta === trabajo.vuelta
    && previa.bloque === trabajo.bloque
    && indiceTrabajo - 1 > 0;
  return esSuPreparacion ? indiceTrabajo - 1 : indiceTrabajo;
};

/**
 * Anterior:
 * - en el trabajo de Y (o en su preparacion o espera) vuelve al inicio de Y-1;
 *   si Y es el primero de una vuelta, al ultimo de la vuelta anterior, y en el
 *   primero de todos reinicia la preparacion;
 * - en el descanso que sigue a Y, vuelve al inicio de Y.
 */
export const anterior = (sesion, ahora) => {
  let actual = estadoEn(sesion, ahora);
  const fase = faseActual(actual);
  if (!fase) {return actual;}

  if (fase.tipo === 'trabajo') {actual = anotar(actual, fase, segundosTranscurridos(actual, ahora));}
  if (fase.tipo === 'espera') {actual = { ...actual, msInactivo: actual.msInactivo + (ahora - actual.inicioFase) };}

  const enDescanso = fase.tipo === 'descanso' || fase.tipo === 'descansoVueltas';
  const indicesTrabajo = actual.fases
    .map((f, i) => (f.tipo === 'trabajo' ? i : -1))
    .filter(i => i >= 0);
  const propio = indicesTrabajo.find(i => {
    const f = actual.fases[i];
    return f.vuelta === fase.vuelta && f.bloque === fase.bloque;
  });

  let destino;
  if (enDescanso) {
    destino = inicioDelBloque(actual.fases, propio);
  } else {
    const posicion = indicesTrabajo.indexOf(propio);
    destino = posicion > 0 ? inicioDelBloque(actual.fases, indicesTrabajo[posicion - 1]) : 0;
  }

  const nueva = conFase(actual, destino, ahora);
  return conAccion(actual.pausadaEn != null ? { ...nueva, pausadaEn: ahora } : nueva);
};

/**
 * Proximos cambios de fase a programar como notificaciones:
 * [{ en: ms, indice }] o { en, tipo: 'fin' } al final.
 * En pausa no hay nada que avisar. En Manual se corta en la proxima espera:
 * lo que sigue depende de cuando toque Iniciar el atleta.
 */
export const proximosCambios = (sesion, ahora, maximo = 64) => {
  const actual = estadoEn(sesion, ahora);
  if (!actual || actual.terminada || actual.pausadaEn != null || actual.finFase == null) {return [];}

  const cambios = [];
  let en = actual.finFase;
  let indice = actual.indice;
  while (cambios.length < maximo) {
    const siguiente = indice + 1;
    if (siguiente >= actual.fases.length) {
      cambios.push({ en, tipo: 'fin' });
      break;
    }
    const fase = actual.fases[siguiente];
    cambios.push({ en, indice: siguiente });
    if (fase.tipo === 'espera') {break;}
    en += fase.segundos * 1000;
    indice = siguiente;
  }
  return cambios;
};

/** Fraccion (0..1) del entrenamiento ya hecha, por tiempo planificado. */
export const progresoTotal = (sesion, ahora) => {
  if (!sesion) {return 0;}
  if (sesion.terminada) {return 1;}
  const duraciones = sesion.fases.map(f => f.segundos || 0);
  const total = duraciones.reduce((a, b) => a + b, 0);
  if (!total) {return 0;}
  const hechas = duraciones.slice(0, sesion.indice).reduce((a, b) => a + b, 0);
  const fase = sesion.fases[sesion.indice];
  const enCurso = fase.segundos ? Math.min(fase.segundos, segundosTranscurridos(sesion, ahora)) : 0;
  return Math.min(1, (hechas + enCurso) / total);
};

const estadoBloque = (cumplidos, objetivo) => {
  if (cumplidos >= objetivo) {return 'completo';}
  return cumplidos > 0 ? 'parcial' : 'salteado';
};

/**
 * Cierra la sesion y arma el registro del historial. Lo que no se llego a hacer
 * (bloques que nunca arrancaron) no se registra.
 */
export const terminar = (sesion, ahora) => {
  let actual = estadoEn(sesion, ahora);
  const fase = faseActual(actual);
  let fin = actual.terminada ? actual.terminadaEn : ahora;

  if (fase) {
    if (actual.pausadaEn != null) {
      actual = { ...actual, msInactivo: actual.msInactivo + (ahora - actual.pausadaEn) };
      fin = ahora;
    }
    // Terminar a mitad de un trabajo: cuenta lo hecho (en pausa, hasta la pausa).
    if (fase.tipo === 'trabajo') {actual = anotar(actual, fase, segundosTranscurridos(actual, ahora));}
    if (fase.tipo === 'espera') {actual = { ...actual, msInactivo: actual.msInactivo + (ahora - actual.inicioFase) };}
    actual = terminarEn(actual, fin);
  }

  const funcional = actual.funcional;
  const bloques = bloquesDe(funcional);
  const vueltas = vueltasDe(funcional);
  const registrados = [];
  let vueltasCompletadas = 0;

  for (let vuelta = 1; vuelta <= vueltas; vuelta += 1) {
    let todos = bloques.length > 0;
    bloques.forEach((bloque, indice) => {
      const hechos = actual.cumplidos[clave(vuelta, indice)];
      if (hechos == null) {
        todos = false;
        return;
      }
      const objetivo = actual.fases.find(f => f.tipo === 'trabajo' && f.vuelta === vuelta && f.bloque === indice)?.segundos || 0;
      registrados.push({
        vuelta,
        idEjercicio: bloque?.ejercicio?.idEjercicio ?? null,
        nombreEjercicio: nombreBloque(bloque),
        segundosObjetivo: objetivo,
        segundosCumplidos: hechos,
        estado: estadoBloque(hechos, objetivo),
      });
    });
    if (todos) {vueltasCompletadas += 1;}
  }

  const segundosTotales = Math.max(0, Math.round((actual.terminadaEn - actual.iniciadaEn - actual.msInactivo) / 1000));

  return {
    sesion: actual,
    registro: {
      tipo: 'funcional',
      idRutina: funcional?.id ?? null,
      nombreRutina: funcional?.nombre || 'Funcional',
      modo: actual.modo,
      vueltasObjetivo: vueltas,
      vueltasCompletadas,
      segundosTotales,
      iniciadoEn: new Date(actual.iniciadaEn).toISOString(),
      terminadoEn: new Date(actual.terminadaEn).toISOString(),
      bloques: registrados,
    },
  };
};

/** Recuento para el resumen: { completo, parcial, salteado }. */
export const contarEstados = bloques =>
  (bloques || []).reduce(
    (acc, b) => ({ ...acc, [b.estado]: (acc[b.estado] || 0) + 1 }),
    { completo: 0, parcial: 0, salteado: 0 },
  );

export { estadoBloque };
