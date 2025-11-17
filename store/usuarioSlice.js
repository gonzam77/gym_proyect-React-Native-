import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usuario: {},
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
    }
})

export const {
  guardarUsuario,
  limpiarUsuario
} = usuarioSlice.actions;

export default usuarioSlice.reducer;