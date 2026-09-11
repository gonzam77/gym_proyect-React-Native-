/**
 * Identificadores compartidos por el sistema de descanso.
 *
 * Los ids de notificacion son fijos a proposito: el handler global de eventos
 * (App.jsx) necesita poder cancelar la alarma aunque el modal de descanso ya no
 * este montado, o aunque Android haya matado el proceso y lo vuelva a levantar.
 */

// Canal de la alarma. NO cambiar el id: los canales de Android son inmutables
// una vez creados, y este ya existe en los dispositivos con la app instalada.
export const DESCANSO_CHANNEL_ID = 'descanso-alarm-channel';

// Canal silencioso donde vive la cuenta regresiva de la barra de notificaciones.
export const DESCANSO_PROGRESO_CHANNEL_ID = 'descanso-progreso-channel';

export const DESCANSO_ALARMA_ID = 'descanso-alarma';
export const DESCANSO_PROGRESO_ID = 'descanso-progreso';

export const ACCION_DETENER = 'stop-alarm';
export const ACCION_SALTAR = 'skip-rest';

// iOS no tiene sonido en bucle ni notificaciones persistentes: se imita la
// alarma encadenando varias notificaciones separadas por unos segundos.
export const IOS_CATEGORIA_DESCANSO = 'descanso-alarma-categoria';
export const IOS_REPETICIONES_ALARMA = 8;
export const IOS_INTERVALO_REPETICION_MS = 3000;

// 'default' usa el sonido de notificacion del sistema. Para un sonido propio hay
// que agregar un archivo .caf / .wav de menos de 30s al bundle de Xcode y poner
// su nombre aca (iOS ignora los .mp3 en notificaciones).
export const IOS_SONIDO_ALARMA = 'default';
