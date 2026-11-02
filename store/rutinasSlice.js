import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TIPO_FUERZA, TIPO_FUNCIONAL, esDelTipo } from '../helpers/funcional';

const initialState = {
  rutinas: [],
};

const rutinasSlice = createSlice({
    name:'rutinas',
    initialState,
    reducers:{
        setRutinas: (state, action) => {
            const rutinasActalizadas = state.rutinas.map(rutina => 
                    rutina.id === action.payload.id ? action.payload : rutina
                )
            state.rutinas = rutinasActalizadas;
        },
        agregarRutina: (state, action) => {
            state.rutinas.push(action.payload);
        },
        actualizarRutinaAsignadaLocal: (state, action) => {
            const { rutinaActualizada } = action.payload;
            if (!rutinaActualizada) {
                return;
            }

            const indexRutina = state.rutinas.findIndex(rutina =>
                (rutinaActualizada.idAsignacionBackend && rutina.idAsignacionBackend === rutinaActualizada.idAsignacionBackend)
                || (rutinaActualizada.idRoutineBackend && rutina.idRoutineBackend === rutinaActualizada.idRoutineBackend)
            );

            if (indexRutina < 0) {
                return;
            }

            const rutinaExistente = state.rutinas[indexRutina];

            state.rutinas[indexRutina] = {
                ...rutinaActualizada,
                id: rutinaExistente.id,
                estado: rutinaExistente.estado || 0,
            };
        },
        eliminarRutina: (state, action) => {
            state.rutinas = state.rutinas.filter(r => r.id !== action.payload);
        },
        /**
         * Mueve una rutina de una posicion a otra. A diferencia de un swap,
         * saca la rutina y la inserta en el destino, que es lo que hace falta
         * cuando se arrastra sobre varias posiciones de una.
         */
        reubicarRutina: (state, action) => {
            const { desde, hacia } = action.payload;
            const cantidad = state.rutinas.length;

            if (
                desde === hacia
                || desde < 0
                || hacia < 0
                || desde >= cantidad
                || hacia >= cantidad
            ) {
                return;
            }

            const [movida] = state.rutinas.splice(desde, 1);
            state.rutinas.splice(hacia, 0, movida);
        },
        /**
         * Como reubicarRutina, pero con los indices de la lista de un solo
         * tipo. Fuerza y funcionales comparten el arreglo; cada pestaña ve
         * solo los suyos, asi que un indice visible no es el indice real.
         */
        reubicarRutinaDelTipo: (state, action) => {
            const { tipo, desde, hacia } = action.payload;
            const globales = state.rutinas
                .map((rutina, indice) => (esDelTipo(rutina, tipo) ? indice : -1))
                .filter(indice => indice >= 0);

            if (
                desde === hacia
                || desde < 0
                || hacia < 0
                || desde >= globales.length
                || hacia >= globales.length
            ) {
                return;
            }

            // Se inserta en el lugar que ocupaba la de destino: si venia de
            // antes, queda despues de ella; si venia de despues, antes.
            const [movida] = state.rutinas.splice(globales[desde], 1);
            state.rutinas.splice(globales[hacia], 0, movida);
        },
        /** Mueve un bloque dentro de un funcional (arrastrar en el detalle). */
        reubicarBloque: (state, action) => {
            const { idRutina, desde, hacia } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);

            if (!rutina || !Array.isArray(rutina.bloques)) {
                return;
            }

            const cantidad = rutina.bloques.length;
            if (
                desde === hacia
                || desde < 0
                || hacia < 0
                || desde >= cantidad
                || hacia >= cantidad
            ) {
                return;
            }

            const [movido] = rutina.bloques.splice(desde, 1);
            rutina.bloques.splice(hacia, 0, movido);
        },
        sincronizarEstadoRutinasAsignadas: (state, action) => {
            const asignaciones = Array.isArray(action.payload) ? action.payload : [];

            state.rutinas = state.rutinas.map(rutina => {
                if (rutina.origen !== "asignada") {
                    return rutina;
                }

                const match = asignaciones.find(item =>
                    (item.idAsignacionBackend && item.idAsignacionBackend === rutina.idAsignacionBackend)
                    || (item.idRoutineBackend && item.idRoutineBackend === rutina.idRoutineBackend)
                );

                if (!match) {
                    return rutina;
                }

                const huellaAnterior = rutina.huellaAsignacion || "";
                const huellaActual = match.huellaAsignacion || "";
                const tieneCambiosAsignados = Boolean(huellaAnterior) && Boolean(huellaActual) && huellaAnterior !== huellaActual;
                const huellaAsignacionActual = huellaActual;

                if (
                    rutina.tieneCambiosAsignados === tieneCambiosAsignados
                    && (rutina.huellaAsignacionActual || "") === huellaAsignacionActual
                ) {
                    return rutina;
                }

                return {
                    ...rutina,
                    tieneCambiosAsignados,
                    huellaAsignacionActual,
                };
            });
        },
        agregarEjercicio: (state, action) => {
            const { idRutina, nuevoEjercicio } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);
            if (rutina) {
            rutina.ejercicios.push(nuevoEjercicio);
            }
        },
        /**
         * Mueve un ejercicio de una posicion a otra. A diferencia de un swap,
         * saca el ejercicio y lo inserta en el destino, que es lo que hace
         * falta cuando se arrastra sobre varias posiciones de una.
         */
        reubicarEjercicio: (state, action) => {
            const { idRutina, desde, hacia } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);

            if (!rutina || !Array.isArray(rutina.ejercicios)) {
                return;
            }

            const cantidad = rutina.ejercicios.length;

            if (
                desde === hacia
                || desde < 0
                || hacia < 0
                || desde >= cantidad
                || hacia >= cantidad
            ) {
                return;
            }

            const [movido] = rutina.ejercicios.splice(desde, 1);
            rutina.ejercicios.splice(hacia, 0, movido);
        },
        modificarEjercicio: (state, action) => {
            const { idRutina, idEjercicio, cambios } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);
            if (rutina) {
                const ejercicio = rutina.ejercicios.find(e => e.id === idEjercicio);
                if (ejercicio) {
                    Object.assign(ejercicio, cambios);
                }
            }
        },
        eliminarEjercicio: (state, action) => {
            const { idRutina, idEjercicio } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);
            if (rutina) {
                rutina.ejercicios = rutina.ejercicios.filter(e => e.id !== idEjercicio);
            }
        },
        reiniciarRutina: (state, action) =>{
            const { id } = action.payload;
            const rutina = state.rutinas.find(r => r.id === id);
            if (rutina) {
                rutina.ejercicios = rutina.ejercicios.map(e => ({
                ...e,
                seriesRealizadas: 0,
                }));
            }
        },
    }
})

export const {
  setRutinas,
  agregarRutina,
  actualizarRutinaAsignadaLocal,
  eliminarRutina,
  reubicarRutina,
  reubicarRutinaDelTipo,
  reubicarBloque,
  sincronizarEstadoRutinasAsignadas,
  agregarEjercicio,
  reubicarEjercicio,
  modificarEjercicio,
  eliminarEjercicio,
  reiniciarRutina
} = rutinasSlice.actions;

const seleccionarTodas = state => state.rutinas.rutinas;

/** Rutinas de fuerza (incluye las viejas, que no tienen tipo). */
export const seleccionarRutinasFuerza = createSelector(seleccionarTodas, rutinas =>
  rutinas.filter(rutina => esDelTipo(rutina, TIPO_FUERZA))
);

export const seleccionarFuncionales = createSelector(seleccionarTodas, rutinas =>
  rutinas.filter(rutina => esDelTipo(rutina, TIPO_FUNCIONAL))
);

export const seleccionarRutinasDelTipo = tipo =>
  tipo === TIPO_FUNCIONAL ? seleccionarFuncionales : seleccionarRutinasFuerza;

export default rutinasSlice.reducer;
