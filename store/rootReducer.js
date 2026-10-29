import { combineReducers } from '@reduxjs/toolkit';
import rutinasReducer from './rutinasSlice';
import usuarioReducer from './usuarioSlice';
import notasHistoricasReducer from './notasHistoricasSlice'
import historialReducer from './historialSlice';

const rootReducer = combineReducers({
  rutinas: rutinasReducer,
  usuario: usuarioReducer,
  notasHistoricas : notasHistoricasReducer,
  historial: historialReducer,
});

export default rootReducer;
