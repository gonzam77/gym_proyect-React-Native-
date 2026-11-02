import { Platform } from 'react-native';
import notifee, {
  AlarmType,
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
} from '@notifee/react-native';

import {
  FUNCIONAL_CHANNEL_ID,
  FUNCIONAL_MAX_ANDROID,
  FUNCIONAL_MAX_IOS,
  FUNCIONAL_PREFIJO_ID,
  FUNCIONAL_SONIDO_ANDROID,
  FUNCIONAL_SONIDO_IOS,
} from '../helpers/notificationConstants';
import { textoCambioDeFase } from '../helpers/funcional';
import { proximosCambios } from '../helpers/sesionFuncional';
import { obtenerTipoAlarma } from './descansoAlarma';

/**
 * Avisos de cambio de fase de un funcional con la app en segundo plano o el
 * telefono bloqueado.
 *
 * Misma regla de oro que el descanso: el tiempo no se cuenta en JavaScript.
 * Cada cambio de fase se le entrega al sistema como una notificacion con hora
 * exacta, calculada sobre los instantes absolutos de la sesion. Asi el aviso
 * llega aunque Android congele o mate la app.
 *
 * Se programan al pasar a segundo plano y se cancelan al volver: con la app
 * abierta avisan los pitidos (services/pitidos.js) y una notificacion por fase
 * encima de la pantalla seria ruido doble.
 */

const esAndroid = Platform.OS === 'android';

const VIBRACION = [0, 250, 150, 250];

export const esNotificacionFuncional = idNotificacion =>
  Boolean(idNotificacion) && idNotificacion.startsWith(FUNCIONAL_PREFIJO_ID);

export const prepararNotificacionesFuncional = async () => {
  if (!esAndroid) {return;}
  try {
    await notifee.createChannel({
      id: FUNCIONAL_CHANNEL_ID,
      name: 'Funcional: cambios de fase',
      description: 'Avisa cuando empieza el trabajo o el descanso de un funcional.',
      importance: AndroidImportance.HIGH,
      sound: FUNCIONAL_SONIDO_ANDROID,
      vibration: true,
      vibrationPattern: VIBRACION,
      visibility: AndroidVisibility.PUBLIC,
    });
  } catch (error) {
    console.log('No se pudo crear el canal del funcional:', error?.message || error);
  }
};

/** Cancela los avisos programados y los que quedaron en la barra. */
export const cancelarFases = async () => {
  try {
    const programadas = (await notifee.getTriggerNotificationIds()).filter(esNotificacionFuncional);
    const mostradas = (await notifee.getDisplayedNotifications())
      .map(n => n?.notification?.id || n?.id)
      .filter(esNotificacionFuncional);
    await Promise.all([
      notifee.cancelTriggerNotifications(programadas),
      notifee.cancelDisplayedNotifications(mostradas),
    ]);
  } catch (error) {
    console.log('No se pudieron cancelar los avisos del funcional:', error?.message || error);
  }
};

const notificacion = (id, { titulo, cuerpo }) => ({
  id,
  title: titulo,
  body: cuerpo,
  android: {
    channelId: FUNCIONAL_CHANNEL_ID,
    category: AndroidCategory.ALARM,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    autoCancel: true,
    // Una fase dura segundos: el aviso viejo se borra solo para no juntar
    // diez notificaciones en la barra.
    timeoutAfter: 60 * 1000,
    pressAction: { id: 'default', launchActivity: 'default' },
  },
  ios: {
    sound: FUNCIONAL_SONIDO_IOS,
    interruptionLevel: 'timeSensitive',
    threadId: FUNCIONAL_PREFIJO_ID,
    foregroundPresentationOptions: { banner: false, list: false, sound: false },
  },
});

/**
 * Programa los proximos cambios de fase. Idempotente: cancela lo anterior
 * antes, asi pausar, saltar o volver nunca dejan avisos duplicados. En pausa no
 * programa nada, y en Manual llega hasta el proximo punto de espera
 * (proximosCambios ya corta ahi).
 */
export const programarFases = async (sesion, ahora = Date.now()) => {
  await cancelarFases();
  if (!sesion) {return;}

  const cambios = proximosCambios(sesion, ahora, esAndroid ? FUNCIONAL_MAX_ANDROID : FUNCIONAL_MAX_IOS)
    .filter(cambio => cambio.en > ahora);
  if (!cambios.length) {return;}

  const tipoAlarma = esAndroid ? await obtenerTipoAlarma() : null;

  // En paralelo: se programa justo cuando la app pasa a segundo plano y
  // conviene terminar antes de que el sistema congele el proceso.
  await Promise.all(cambios.map(async cambio => {
    const id = `${FUNCIONAL_PREFIJO_ID}${cambio.tipo === 'fin' ? 'fin' : cambio.indice}`;
    const contenido = notificacion(id, textoCambioDeFase(sesion.funcional, sesion.fases, cambio));
    const disparador = {
      type: TriggerType.TIMESTAMP,
      timestamp: cambio.en,
      ...(esAndroid ? { alarmManager: { type: tipoAlarma } } : {}),
    };

    try {
      await notifee.createTriggerNotification(contenido, disparador);
    } catch (error) {
      // Igual que el descanso: si la alarma exacta se rechaza, una inexacta
      // es mejor que no avisar.
      if (!esAndroid) {
        console.log('No se pudo programar un aviso del funcional:', error?.message || error);
        return;
      }
      try {
        await notifee.createTriggerNotification(contenido, {
          ...disparador,
          alarmManager: { type: AlarmType.SET_AND_ALLOW_WHILE_IDLE },
        });
      } catch (otroError) {
        console.log('No se pudo programar un aviso del funcional:', otroError?.message || otroError);
      }
    }
  }));
};
