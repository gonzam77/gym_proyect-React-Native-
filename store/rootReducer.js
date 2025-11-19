import { combineReducers } from '@reduxjs/toolkit';
import rutinasReducer from './rutinasSlice';
import usuarioReducer from './usuarioSlice';
import notasHistoricasReducer from './notasHistoricasSlice' 

const rootReducer = combineReducers({
  rutinas: rutinasReducer,
  usuario: usuarioReducer,
  notasHistoricas : notasHistoricasReducer,
});

export default rootReducer;
