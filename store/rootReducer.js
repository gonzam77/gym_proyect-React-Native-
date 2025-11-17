import { combineReducers } from '@reduxjs/toolkit';
import rutinasReducer from './rutinasSlice';
import usuarioReducer from './usuarioSlice';

const rootReducer = combineReducers({
  rutinas: rutinasReducer,
  usuario: usuarioReducer,
});

export default rootReducer;
