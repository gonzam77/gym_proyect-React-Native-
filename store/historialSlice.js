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
 */

const initialState = {
  registros: [],
};

const generarId = () =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

const esAbierto = (r, fecha, idRutina, idEjercicioRutina) =>
  !r.cerrado
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
        if (r.idRutina === idRutina && (!idEjercicioRutina || r.idEjercicioRutina === idEjercicioRutina)) {
          r.cerrado = true;
        }
      }
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
  eliminarDiaHistorial,
  eliminarHistorial,
} = historialSlice.actions;

/** Registro abierto (de hoy) de un ejercicio de una rutina, si existe. */
export const seleccionarRegistroAbierto = (state, fecha, idRutina, idEjercicioRutina) =>
  state.historial?.registros?.find(r => esAbierto(r, fecha, idRutina, idEjercicioRutina)) || null;

/** Un ejercicio esta completo si se hicieron todas las series de la rutina. */
export const registroCompleto = registro =>
  registro.seriesObjetivo > 0 && registro.series.length >= registro.seriesObjetivo;

export default historialSlice.reducer;
