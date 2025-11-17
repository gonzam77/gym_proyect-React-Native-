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
        eliminarRutina: (state, action) => {
            state.rutinas = state.rutinas.filter(r => r.id !== action.payload);
        },
        agregarEjercicio: (state, action) => {
            const { idRutina, nuevoEjercicio } = action.payload;
            const rutina = state.rutinas.find(r => r.id === idRutina);
            if (rutina) {
            rutina.ejercicios.push(nuevoEjercicio);
            }
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
  eliminarRutina,
  agregarEjercicio,
  modificarEjercicio,
  eliminarEjercicio,
  reiniciarRutina
} = rutinasSlice.actions;

export default rutinasSlice.reducer;