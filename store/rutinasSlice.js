import { createSlice } from '@reduxjs/toolkit';

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
        reordenarRutina: (state, action) => {
            const { indexActual, direccion } = action.payload;
            const indexDestino = indexActual + direccion;

            if (
                indexActual < 0
                || indexDestino < 0
                || indexActual >= state.rutinas.length
                || indexDestino >= state.rutinas.length
            ) {
                return;
            }

            [state.rutinas[indexActual], state.rutinas[indexDestino]] =
                [state.rutinas[indexDestino], state.rutinas[indexActual]];
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
        reordenarEjercicio: (state, action) => {
            const { idRutina, indexActual, direccion } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);

            if (!rutina || !Array.isArray(rutina.ejercicios)) {
                return;
            }

            const indexDestino = indexActual + direccion;

            if (
                indexActual < 0
                || indexDestino < 0
                || indexActual >= rutina.ejercicios.length
                || indexDestino >= rutina.ejercicios.length
            ) {
                return;
            }

            [rutina.ejercicios[indexActual], rutina.ejercicios[indexDestino]] =
                [rutina.ejercicios[indexDestino], rutina.ejercicios[indexActual]];
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
  reordenarRutina,
  sincronizarEstadoRutinasAsignadas,
  agregarEjercicio,
  reordenarEjercicio,
  modificarEjercicio,
  eliminarEjercicio,
  reiniciarRutina
} = rutinasSlice.actions;

export default rutinasSlice.reducer;
