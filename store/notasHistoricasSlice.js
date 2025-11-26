import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notasHistoricas: [
    {
      id:1,
      titulo:'Registro de comidas',
      tipo: 'texto',
      notas:[
        {
          id:2,
          fecha:1731801600000,
          nota:'Pollo al horno con ensalada de lechugas'
        },
        {
          id:3,
          fecha:1731889800000,
          nota:'Bife de pollo con palta y huevos revuelos.'
        },

    ]
      
    },
    {
      id:4,
      titulo:'Logros Diarios',
      tipo: 'texto',
      notas:[
        {
          id:5,
          fecha:1731972600000,
          nota:'Hoy hice mi primera dominada.'
        },
        {
          id:6,
          fecha:1732059000000,
          nota:'Hoy aumenté 2.5kg en Press Plano.'
        },
      ]
    },
    {
      id:7,
      titulo:'Comentarios Diarios',
      tipo: 'texto',
      notas:[
        {
          id:8,
          fecha:1732145400000,
          nota:'Hoy me senti con menos fuerza que ayer.'
        },
        {
          id:9,
          fecha:1732231800000,
          nota:'Hoy entrené con spotter y logre mas repeticiones en sentadilla libre.'
        },
      ]
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
      agregarComentario: (state, action) => {
        const { idNota, comentario } = action.payload;
        const nota = state.notasHistoricas.find(n => n.id === idNota);
        if (!nota) return;
        const existente = nota.notas.find(n => n.id === comentario.id);
        if (existente) {
            Object.assign(existente, comentario); // mutación segura
        } else {
            nota.notas.push(comentario);
        }
      },
      modificarNota:(state,action) => {
        const { id, ...rest } = action.payload;
        const nota = state.notasHistoricas.find(n => n.id === id);
        if (!nota) return;

        Object.assign(nota, rest); // fusiona solo los cambios
      },
      eliminarNota: (state,action) => {
        state.notasHistoricas = state.notasHistoricas.filter(e => e.id !== action.payload.id) ;
      },
      eliminarComentario: (state, action) => {
        const { idNota, idComentario } = action.payload;

        const nota = state.notasHistoricas.find(n => n.id === idNota);
        if (!nota) return;

        nota.notas = nota.notas.filter(c => c.id !== idComentario);
      },
    }
})

export const {
    agregarNotas,
    modificarNota,
    eliminarNota,
    agregarComentario,
    eliminarComentario,
} = notasHistoricasSlice.actions;

export default notasHistoricasSlice.reducer;