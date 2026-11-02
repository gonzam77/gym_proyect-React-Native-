import { createSlice } from '@reduxjs/toolkit';

/**
 * Historial de entrenamientos.
 *
 * Se guarda en el telefono (redux-persist), igual que las rutinas propias.
 * Un registro = un ejercicio de una rutina hecho en un dia:
 *
 * {
 *   id, fecha: 'AAAA-MM-DD' (local), creadoEn, actualizadoEn,
 *   idRutina, nombreRutina,
 *   idEjercicioRutina,          // id del ejercicio dentro de la rutina
 *   idEjercicio, nombreEjercicio, // del catalogo (para la imagen)
 *   seriesObjetivo,             // series que tenia la rutina ese dia
 *   cerrado,                    // true despues de reiniciar: la proxima serie abre otro registro
 *   series: [{ numero, hechaEn, estado, repeticiones, peso }]
 * }
 *
 * estado de cada serie: 'pendiente' (hecha, sin cargar reps/peso),
 * 'registrada' o 'salteada' (el usuario eligio no cargarla).
 *
 * Los entrenamientos funcionales se guardan en la misma lista, un registro por
 * sesion, con tipo 'funcional' (los registros sin tipo son de fuerza):
 *
 * {
 *   id, tipo: 'funcional', fecha, creadoEn, actualizadoEn,
 *   idRutina, nombreRutina, modo, vueltasObjetivo, vueltasCompletadas,
 *   segundosTotales,
 *   bloques: [{ vuelta, idEjercicio, nombreEjercicio, segundosObjetivo,
 *               segundosCumplidos, estado: 'completo'|'parcial'|'salteado' }]
 * }
 */

const initialState = {
  registros: [],
};

const generarId = () =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

export const esRegistroFuncional = registro => registro?.tipo === 'funcional';

const estadoBloqueFuncional = (cumplidos, objetivo) => {
  if (cumplidos >= objetivo) {
    return 'completo';
  }
  return cumplidos > 0 ? 'parcial' : 'salteado';
};

const esAbierto = (r, fecha, idRutina, idEjercicioRutina) =>
  !esRegistroFuncional(r)
  && !r.cerrado
  && r.fecha === fecha
  && r.idRutina === idRutina
  && r.idEjercicioRutina === idEjercicioRutina;

const historialSlice = createSlice({
  name: 'historial',
  initialState,
  reducers: {
    /** Se termino una serie: la anota (sin reps/peso todavia). */
    registrarSerieHecha: (state, action) => {
      const { fecha, hechaEn, rutina, ejercicio, numero } = action.payload;
      let registro = state.registros.find(r => esAbierto(r, fecha, rutina.id, ejercicio.id));

      if (!registro) {
        registro = {
          id: generarId(),
          fecha,
          creadoEn: hechaEn,
          actualizadoEn: hechaEn,
          idRutina: rutina.id,
          nombreRutina: rutina.nombre || 'Rutina',
          idEjercicioRutina: ejercicio.id,
          idEjercicio: ejercicio.ejercicio?.idEjercicio ?? null,
          nombreEjercicio: ejercicio.nombre || ejercicio.ejercicio?.nombre || 'Ejercicio',
          seriesObjetivo: Number(ejercicio.series) || 0,
          cerrado: false,
          series: [],
        };
        state.registros.push(registro);
      }

      registro.seriesObjetivo = Number(ejercicio.series) || registro.seriesObjetivo;
      registro.actualizadoEn = hechaEn;
      if (!registro.series.some(s => s.numero === numero)) {
        registro.series.push({ numero, hechaEn, estado: 'pendiente', repeticiones: null, peso: null });
        registro.series.sort((a, b) => a.numero - b.numero);
      }
    },

    /** Guarda reps/peso (o marca salteadas) de una o varias series. */
    actualizarSeriesRegistro: (state, action) => {
      const { idRegistro, series } = action.payload;
      const registro = state.registros.find(r => r.id === idRegistro);
      if (!registro) return;

      for (const cambio of series || []) {
        const serie = registro.series.find(s => s.numero === cambio.numero);
        if (!serie) continue;
        serie.estado = cambio.estado;
        serie.repeticiones = cambio.estado === 'registrada' ? cambio.repeticiones ?? null : null;
        serie.peso = cambio.estado === 'registrada' ? cambio.peso ?? null : null;
      }
      registro.actualizadoEn = new Date().toISOString();
    },

    /**
     * Al reiniciar un ejercicio o una rutina, lo hecho hasta ahi queda en el
     * historial tal cual y la proxima serie empieza un registro nuevo.
     */
    cerrarRegistros: (state, action) => {
      const { idRutina, idEjercicioRutina } = action.payload;
      for (const r of state.registros) {
        if (!esRegistroFuncional(r) && r.idRutina === idRutina && (!idEjercicioRutina || r.idEjercicioRutina === idEjercicioRutina)) {
          r.cerrado = true;
        }
      }
    },

    /** Guarda una sesion de un funcional (terminada o cortada antes). */
    registrarFuncional: (state, action) => {
      const { fecha, registro } = action.payload;
      const ahora = registro?.terminadoEn || new Date().toISOString();
      state.registros.push({
        ...registro,
        id: generarId(),
        tipo: 'funcional',
        fecha,
        creadoEn: registro?.iniciadoEn || ahora,
        actualizadoEn: ahora,
      });
    },

    /**
     * Corrige el tiempo cumplido de un bloque (por ejemplo, se salteo sin
     * querer). El estado se recalcula y el tiempo total acompaña la diferencia.
     */
    corregirBloqueFuncional: (state, action) => {
      const { idRegistro, indiceBloque, segundosCumplidos } = action.payload;
      const registro = state.registros.find(r => r.id === idRegistro);
      const bloque = registro?.bloques?.[indiceBloque];
      if (!bloque) {
        return;
      }

      const nuevos = Math.max(0, Math.round(Number(segundosCumplidos) || 0));
      registro.segundosTotales = Math.max(0, (registro.segundosTotales || 0) + nuevos - (bloque.segundosCumplidos || 0));
      bloque.segundosCumplidos = nuevos;
      bloque.estado = estadoBloqueFuncional(nuevos, bloque.segundosObjetivo);
      registro.actualizadoEn = new Date().toISOString();
    },

    eliminarRegistro: (state, action) => {
      state.registros = state.registros.filter(r => r.id !== action.payload);
    },

    eliminarDiaHistorial: (state, action) => {
      state.registros = state.registros.filter(r => r.fecha !== action.payload);
    },

    eliminarHistorial: state => {
      state.registros = [];
    },
  },
});

export const {
  registrarSerieHecha,
  actualizarSeriesRegistro,
  cerrarRegistros,
  registrarFuncional,
  corregirBloqueFuncional,
  eliminarRegistro,
  eliminarDiaHistorial,
  eliminarHistorial,
} = historialSlice.actions;

/** Registro abierto (de hoy) de un ejercicio de una rutina, si existe. */
export const seleccionarRegistroAbierto = (state, fecha, idRutina, idEjercicioRutina) =>
  state.historial?.registros?.find(r => esAbierto(r, fecha, idRutina, idEjercicioRutina)) || null;

/** Un ejercicio esta completo si se hicieron todas las series de la rutina. */
export const registroCompleto = registro =>
  esRegistroFuncional(registro)
    ? registro.vueltasCompletadas >= registro.vueltasObjetivo
      && (registro.bloques || []).every(b => b.estado === 'completo')
    : registro.seriesObjetivo > 0 && registro.series.length >= registro.seriesObjetivo;

export default historialSlice.reducer;
