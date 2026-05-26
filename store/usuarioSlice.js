import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usuario: {},
  authInitializing: true,
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
        state.sesion = {
          token: action.payload?.token || null,
          user: action.payload?.user || null,
        };
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
      setAuthInitializing: (state, action) => {
        state.authInitializing = action.payload;
      },
    }
})

export const {
  guardarUsuario,
  limpiarUsuario,
  guardarSesion,
  actualizarUsuarioSesion,
  cerrarSesion,
  setAuthInitializing,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;
