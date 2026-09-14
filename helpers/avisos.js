import Toast from 'react-native-toast-message';

/**
 * Avisos no bloqueantes.
 *
 * Antes cada confirmacion exitosa abria un Alert.alert, que corta lo que estas
 * haciendo y hay que cerrar a mano. Los Alert quedan solo para lo que necesita
 * una decision (borrar, salir sin guardar, cerrar sesion).
 */
export const avisoExito = (titulo, detalle) =>
  Toast.show({ type: 'exito', text1: titulo, text2: detalle });

export const avisoError = (titulo, detalle) =>
  Toast.show({ type: 'error', text1: titulo, text2: detalle, visibilityTime: 4500 });

export const avisoInfo = (titulo, detalle) =>
  Toast.show({ type: 'info', text1: titulo, text2: detalle });

export const ocultarAviso = () => Toast.hide();
