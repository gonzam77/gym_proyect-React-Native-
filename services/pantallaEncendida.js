import { NativeModules, Platform } from 'react-native';

const modulo = NativeModules.PantallaEncendida;

/**
 * Servicio de pantalla encendida.
 *
 * Envuelve el modulo nativo PantallaEncendida (android/app/src/main/java/com/
 * rutina360/PantallaEncendidaModule.kt), que levanta FLAG_KEEP_SCREEN_ON sobre
 * la ventana de la Activity.
 *
 * Existe porque en el descanso y en la serie en curso el usuario deja el
 * telefono apoyado mirando el contador sin tocarlo, y Android apaga la pantalla
 * al minuto. No usa WakeLock a proposito: el flag se libera solo cuando la
 * Activity muere, asi que no puede quedar colgado drenando bateria.
 *
 * Solo Android. En iOS las dos funciones son no-op.
 */

/** Evita que la pantalla se apague sola. */
export const mantenerPantallaEncendida = () => {
  if (Platform.OS !== 'android') {
    return;
  }

  modulo?.activar();
};

/**
 * Devuelve el control del apagado al sistema.
 *
 * Conviene llamarla siempre en el cleanup del useEffect que la encendio: el
 * flag sobrevive a que se desmonte el componente, porque vive en la ventana.
 */
export const permitirApagarPantalla = () => {
  if (Platform.OS !== 'android') {
    return;
  }

  modulo?.desactivar();
};
