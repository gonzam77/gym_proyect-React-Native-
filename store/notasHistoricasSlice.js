import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notasHistoricas: [
    {
      id:1,
      titulo:'Registro de comidas',
      notas:[{
        id:1,
        fecha:1732109085123,
        nota:'Pollo al horno con ensalada de lechugas'
      }]

    },
    {
      id:2,
      titulo:'Logros Diarios',
      notas:[{
        id:1,
        fecha:1732109085123,
        nota:'Hoy hice mi primera dominada.'
      }]
    },
    {
      id:3,
      titulo:'Comentarios Diarios',
      notas:[{
        id:1,
        fecha:1732109085123,
        nota:'Hoy me senti con menos fuerza que ayer.'
      }]
    }  
  ],
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