import { combineReducers } from '@reduxjs/toolkit';
import rutinasReducer from './rutinasSlice';
import usuarioReducer from './usuarioSlice';
import notasHistoricasReducer from './notasHistoricasSlice'
import historialReducer from './historialSlice';
import sesionFuncionalReducer from './sesionFuncionalSlice';

const rootReducer = combineReducers({
  rutinas: rutinasReducer,
  usuario: usuarioReducer,
  notasHistoricas : notasHistoricasReducer,
  historial: historialReducer,
  sesionFuncional: sesionFuncionalReducer,
});

export default rootReducer;
