import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notasHistoricas: [],
};

const notasHistoricasSlice = createSlice({
    name:'notasHistoricas',
    initialState,
    reducers:{
      agregarNotas:(state,action) => {
        state.notasHistoricas.push(action.payload);
      },
      modificarNota:(state,action) => {
        state.notasHistoricas = state.notasHistoricas.map(n => n.id === action.payload.id ? action.payload : n)
      },
      eliminarNota: (state,action) => {
        state.notasHistoricas = state.notasHistoricas.filter(e => e.id !== action.payload.id) ;
      },
    }
})

export const {
    agregarNotas,
    modificarNota,
    eliminarNota
} = notasHistoricasSlice.actions;

export default notasHistoricasSlice.reducer;