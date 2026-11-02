import { createSlice } from '@reduxjs/toolkit';

/**
 * Sesion de funcional en curso. Se persiste para poder retomarla si Android
 * mata la app en medio del entrenamiento: como guarda instantes absolutos
 * (helpers/sesionFuncional.js), al volver se sabe en que fase tiene que estar.
 * Hay una sola sesion a la vez.
 */
const initialState = {
  sesion: null,
};

const sesionFuncionalSlice = createSlice({
  name: 'sesionFuncional',
  initialState,
  reducers: {
    guardarSesionFuncional: (state, action) => {
      state.sesion = action.payload;
    },
    limpiarSesionFuncional: state => {
      state.sesion = null;
    },
  },
});

export const { guardarSesionFuncional, limpiarSesionFuncional } = sesionFuncionalSlice.actions;

export default sesionFuncionalSlice.reducer;
