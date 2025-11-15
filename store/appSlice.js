import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rutinas: [],
  usuario:{},
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRutinas: (state, action) => {
      state.rutinas = action.payload;
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
    guardarUsuario:(state,action) => {
      state.usuario = action.payload;
    }
  }
});

export const {
  setRutinas,
  agregarRutina,
  eliminarRutina,
  agregarEjercicio,
  modificarEjercicio,
  eliminarEjercicio,
  guardarUsuario
} = appSlice.actions;

export default appSlice.reducer;
