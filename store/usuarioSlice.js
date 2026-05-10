import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usuario: {},
  sesion: {
    token: null,
    user: null,
  },
};

const usuarioSlice = createSlice({
    name:'usuario',
    initialState,
    reducers:{
      guardarUsuario:(state,action) => {
          state.usuario = action.payload;
      },
      limpiarUsuario: (state) => {
        state.usuario = {};
      },
      guardarSesion: (state, action) => {
        state.sesion = action.payload;
      },
      actualizarUsuarioSesion: (state, action) => {
        state.sesion.user = {
          ...state.sesion.user,
          ...action.payload,
        };
      },
      cerrarSesion: (state) => {
        state.sesion = {
          token: null,
          user: null,
        };
      },
    }
})

export const {
  guardarUsuario,
  limpiarUsuario,
  guardarSesion,
  actualizarUsuarioSesion,
  cerrarSesion,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;
