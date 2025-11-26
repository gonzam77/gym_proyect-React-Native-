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
          nota:
          `
Desayuno:Yogur proteico con frutas y avena 
Almuerzo:Pollo salteado con arroz integral
Merienda:Licuado proteico
Cena:Salmón a la plancha con ensalada
          `
        },
        {
          id:3,
          fecha:1731889800000,
          nota:
          `
Desayuno:Omelette de claras con verduras 
Almuerzo:Ensalada power con atún
Merienda:Tostadas integrales con palta
Cena:Tacos saludables de carne magra
          `
        },

    ]
      
    },
    {
      id:4,
      titulo:'Objetivos Diarios',
      tipo: 'texto',
      notas:[
        {
          id:5,
          fecha:1731972600000,
          nota:'Completar mi entrenamiento del día (aunque sea corto)'
        },
        {
          id:6,
          fecha:1732059000000,
          nota:'Llegar a 7.000 – 10.000 pasos.'
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
          nota:'Hoy me sentí más liviano durante el entrenamiento. No tuve tantas ganas al empezar, pero una vez que arranqué pude completar todo sin saltarme series. Me alegra haber mantenido la constancia, aunque no fue mi mejor día en energía. Sumar un pequeño esfuerzo igual cuenta.'
        },
        {
          id:9,
          fecha:1732231800000,
          nota:'Me alimenté mejor que ayer: agregué más proteína y evité picar por ansiedad. También caminé más y sentí menos rigidez en la espalda. Todavía tengo que mejorar el descanso, pero hoy di un paso en la dirección correcta y eso me motiva.'
        },
      ]
    },  
    {
      id:10,
      titulo:'Recetas',
      tipo: 'texto',
      notas:[
        {
          id:11,
          fecha:1732145400000,
          nota:
          `
Ingredientes:
1 lata de atún al agua

1 tomate picado

½ pepino en rodajas

1 cda de aceite de oliva

Sal y limón a gusto

Preparación:
Mezclá todos los ingredientes en un bowl, condimentá y listo.
          `
        },
        {
          id:12,
          fecha:1732231800000,
          nota:
          `
Huevos revueltos con espinaca

Ingredientes:

2 huevos

1 puñado de espinaca fresca

1 chorrito de aceite o spray vegetal

Sal y pimienta

Preparación:
Salteá la espinaca 1 minuto, agregá los huevos batidos, revolvé hasta cocción y condimentá.
          `
        },
        {
          id:13,
          fecha:1732231800000,
          nota:
          `
Ensalada rápida de pollo

Ingredientes: pollo cocido en tiras, mix de hojas verdes, tomate cherry, aceite de oliva, limón, sal.
Preparación: mezclar todo en un bowl, aliñar con aceite, limón y sal. Listo.
          `
        },
        {
          id:14,
          fecha:1732231800000,
          nota:
          `
Ingredientes: 2 huevos, espinaca picada, queso descremado, sal, pimienta.
Preparación: batí los huevos, agregá espinaca y condimentos, volcalo en sartén, añadí queso y cociná hasta dorar.
          `
        },
      ]
    },  
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
        state.notasHistoricas = state.notasHistoricas.filter(e => e.id !== action.payload) ;
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