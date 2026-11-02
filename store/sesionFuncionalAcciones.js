import { terminar } from '../helpers/sesionFuncional';
import { fechaLocal } from '../helpers/fechas';
import { cancelarFases } from '../services/fasesFuncional';
import { registrarFuncional } from './historialSlice';
import { limpiarSesionFuncional } from './sesionFuncionalSlice';

/**
 * Cierra la sesion en curso: guarda lo hecho en el historial (si se hizo algo),
 * cancela los avisos pendientes y borra la sesion. Devuelve el registro, para
 * mostrar el resumen.
 *
 * El dia es el de cuando se empezo: un funcional que cruza la medianoche queda
 * en el dia en que se entreno.
 */
export const terminarYGuardarSesion = (sesion, ahora = Date.now()) => dispatch => {
  const { registro } = terminar(sesion, ahora);

  if (registro.bloques.length > 0) {
    dispatch(registrarFuncional({ fecha: fechaLocal(new Date(sesion.iniciadaEn)), registro }));
  }
  dispatch(limpiarSesionFuncional());
  cancelarFases();
  return registro;
};

/** Descarta la sesion sin guardar nada. */
export const descartarSesion = () => dispatch => {
  dispatch(limpiarSesionFuncional());
  cancelarFases();
};
