import { API_BASE_URL } from '../constants/api';

/**
 * URL de la ilustracion de un ejercicio.
 *
 * Las imagenes las sirve la API (GET /ejercice/:id/image). Si el ejercicio no
 * tiene ilustracion propia (por ejemplo, uno creado por un gimnasio), la API
 * devuelve la del grupo muscular. Las cachea el propio componente Image.
 *
 * Acepta el ejercicio del catalogo ({ idEjercicio }) o el item de la rutina
 * ({ ejercicio: { idEjercicio } }).
 */
export const urlImagenEjercicio = ejercicio => {
  const id = Number(ejercicio?.idEjercicio ?? ejercicio?.ejercicio?.idEjercicio);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return `${API_BASE_URL}/ejercice/${id}/image`;
};
