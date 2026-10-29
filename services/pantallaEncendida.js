import { NativeModules } from 'react-native';

const modulo = NativeModules.PantallaEncendida;

/**
 * Servicio de pantalla encendida.
 *
 * Envuelve el modulo nativo PantallaEncendida:
 * - Android: android/app/src/main/java/com/rutina360/PantallaEncendidaModule.kt,
 *   que levanta FLAG_KEEP_SCREEN_ON sobre la ventana de la Activity.
 * - iOS: ios/MiApp/PantallaEncendida.m, que usa idleTimerDisabled.
 *
 * Existe porque en el descanso y en la serie en curso el usuario deja el
 * telefono apoyado mirando el contador sin tocarlo, y Android apaga la pantalla
 * al minuto. No usa WakeLock a proposito: el flag se libera solo cuando la
 * Activity muere, asi que no puede quedar colgado drenando bateria.
 *
 * Si el modulo nativo no esta (por ejemplo, un build viejo), las funciones no
 * hacen nada.
 */

/** Evita que la pantalla se apague sola. */
export const mantenerPantallaEncendida = () => {
  modulo?.activar?.();
};

/**
 * Devuelve el control del apagado al sistema.
 *
 * Conviene llamarla siempre en el cleanup del useEffect que la encendio: el
 * flag sobrevive a que se desmonte el componente, porque vive en la ventana.
 */
export const permitirApagarPantalla = () => {
  modulo?.desactivar?.();
};
