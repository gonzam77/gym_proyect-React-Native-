import { Platform } from 'react-native';
import notifee, {
  AlarmType,
  AndroidCategory,
  AndroidImportance,
  AndroidNotificationSetting,
  AndroidVisibility,
  TriggerType,
} from '@notifee/react-native';

import {
  ACCION_DETENER,
  ACCION_SALTAR,
  DESCANSO_ALARMA_ID,
  DESCANSO_CHANNEL_ID,
  DESCANSO_PROGRESO_CHANNEL_ID,
  DESCANSO_PROGRESO_ID,
  IOS_CATEGORIA_DESCANSO,
  IOS_INTERVALO_REPETICION_MS,
  IOS_REPETICIONES_ALARMA,
  IOS_SONIDO_ALARMA,
} from '../helpers/notificationConstants';

/**
 * Servicio de alarma de descanso.
 *
 * La regla de oro: el descanso NO se cuenta en JavaScript. Se le entrega al
 * sistema operativo un instante exacto (finEn) y el sistema es el que despierta,
 * igual que el despertador del reloj. Asi la alarma suena aunque el proceso este
 * congelado por Doze, aunque el usuario este en Instagram o aunque Android haya
 * matado la app por falta de memoria.
 *
 * El contador que se ve en pantalla es solo cosmetico.
 */

const esAndroid = Platform.OS === 'android';

const VIBRACION_ALARMA = [300, 500, 300, 500];

// En iOS la alarma son N notificaciones encadenadas, cada una con su propio id.
const idsAlarmaIOS = () => [
  DESCANSO_ALARMA_ID,
  ...Array.from(
    { length: IOS_REPETICIONES_ALARMA },
    (_, indice) => `${DESCANSO_ALARMA_ID}-${indice + 1}`,
  ),
];

const todosLosIds = () =>
  esAndroid ? [DESCANSO_ALARMA_ID, DESCANSO_PROGRESO_ID] : idsAlarmaIOS();

/**
 * Indica si una notificacion pertenece al descanso. Lo usa el handler global
 * para decidir si tiene que cancelar la alarma.
 */
export const esNotificacionDeDescanso = (idNotificacion, idAccion) => {
  if (idAccion === ACCION_DETENER || idAccion === ACCION_SALTAR) {
    return true;
  }

  if (!idNotificacion) {
    return false;
  }

  return (
    idNotificacion === DESCANSO_PROGRESO_ID ||
    idNotificacion.startsWith(DESCANSO_ALARMA_ID)
  );
};

/**
 * Crea los canales de Android y la categoria de iOS. Se llama una vez al iniciar
 * la app.
 */
export const prepararNotificacionesDescanso = async () => {
  await notifee.requestPermission({ alert: true, sound: true, badge: true });

  if (!esAndroid) {
    // Habilita el boton DETENER dentro de la notificacion en iOS.
    await notifee.setNotificationCategories([
      {
        id: IOS_CATEGORIA_DESCANSO,
        actions: [
          {
            id: ACCION_DETENER,
            title: 'Detener',
            destructive: true,
            foreground: true,
          },
        ],
      },
    ]);
    return;
  }

  await notifee.createChannel({
    id: DESCANSO_CHANNEL_ID,
    name: 'Alarma de descanso',
    description: 'Suena cuando termina el descanso entre series.',
    importance: AndroidImportance.HIGH,
    sound: 'alarm2',
    vibration: true,
    vibrationPattern: VIBRACION_ALARMA,
    visibility: AndroidVisibility.PUBLIC,
    bypassDnd: true,
  });

  await notifee.createChannel({
    id: DESCANSO_PROGRESO_CHANNEL_ID,
    name: 'Descanso en curso',
    description: 'Muestra la cuenta regresiva mientras descansas. No suena.',
    // LOW: aparece en la barra y en el panel, pero sin sonido ni vibracion.
    importance: AndroidImportance.LOW,
    vibration: false,
    badge: false,
  });
};

/**
 * Elige el tipo de alarma segun el permiso de "alarmas y recordatorios".
 *
 * SET_ALARM_CLOCK es el unico tipo exento de Doze (es el que usa el reloj) y
 * ademas muestra el icono de alarma en la barra de estado. Desde Android 12
 * requiere el permiso SCHEDULE_EXACT_ALARM; si el usuario lo revoco, se cae a
 * una alarma inexacta que no necesita permiso.
 */
const obtenerTipoAlarma = async () => {
  try {
    const ajustes = await notifee.getNotificationSettings();

    if (ajustes?.android?.alarm === AndroidNotificationSetting.DISABLED) {
      return AlarmType.SET_AND_ALLOW_WHILE_IDLE;
    }
  } catch {
    return AlarmType.SET_AND_ALLOW_WHILE_IDLE;
  }

  return AlarmType.SET_ALARM_CLOCK;
};

/**
 * true si la app puede programar alarmas exactas. Si devuelve false conviene
 * ofrecerle al usuario abrir los ajustes con abrirAjustesAlarmaExacta().
 */
export const puedeProgramarAlarmaExacta = async () => {
  if (!esAndroid) {
    return true;
  }

  try {
    const ajustes = await notifee.getNotificationSettings();
    return ajustes?.android?.alarm !== AndroidNotificationSetting.DISABLED;
  } catch {
    return false;
  }
};

export const abrirAjustesAlarmaExacta = async () => {
  if (!esAndroid) {
    return;
  }

  try {
    await notifee.openAlarmPermissionSettings();
  } catch (error) {
    console.log('No se pudo abrir los ajustes de alarma:', error?.message || error);
  }
};

/**
 * Notificacion persistente con la cuenta regresiva.
 *
 * El cronometro lo dibuja el SystemUI a partir de `timestamp`: sigue contando
 * sin que corra una sola linea de JavaScript. `timeoutAfter` hace que Android la
 * borre sola en el instante exacto en que arranca la alarma, asi no queda
 * colgada si el proceso fue matado.
 */
const mostrarProgreso = async ({ finEn, ejercicio, serie, totalSeries }) => {
  const restanteMs = finEn - Date.now();

  if (restanteMs <= 0) {
    return;
  }

  const detalleSerie =
    serie && totalSeries ? ` - serie ${serie} de ${totalSeries}` : '';

  await notifee.displayNotification({
    id: DESCANSO_PROGRESO_ID,
    title: 'Descanso en curso',
    body: `${ejercicio || 'Ejercicio'}${detalleSerie}`,
    android: {
      channelId: DESCANSO_PROGRESO_CHANNEL_ID,
      importance: AndroidImportance.LOW,
      category: AndroidCategory.STOPWATCH,
      timestamp: finEn,
      showChronometer: true,
      chronometerDirection: 'down',
      ongoing: true,
      autoCancel: false,
      onlyAlertOnce: true,
      timeoutAfter: restanteMs,
      pressAction: { id: 'default', launchActivity: 'default' },
      actions: [
        {
          title: 'Saltar',
          pressAction: { id: ACCION_SALTAR },
        },
      ],
    },
  });
};

const programarAlarmaAndroid = async ({ finEn, titulo, cuerpo }) => {
  const notificacion = {
    id: DESCANSO_ALARMA_ID,
    title: titulo,
    body: cuerpo,
    android: {
      channelId: DESCANSO_CHANNEL_ID,
      category: AndroidCategory.ALARM,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      ongoing: true,
      autoCancel: false,
      // Repite el sonido hasta que se cancela (FLAG_INSISTENT), como un
      // despertador. Sin esto alarm2.mp3 suena una sola vez.
      loopSound: true,
      vibrationPattern: VIBRACION_ALARMA,
      pressAction: { id: 'default', launchActivity: 'default' },
      // Abre la app a pantalla completa sobre la pantalla de bloqueo.
      // MainActivity ya declara showWhenLocked y turnScreenOn.
      fullScreenAction: { id: 'default', launchActivity: 'default' },
      actions: [
        {
          title: '<font color="#D58691"><b>DETENER</b></font>',
          pressAction: { id: ACCION_DETENER },
        },
      ],
    },
  };

  const disparador = {
    type: TriggerType.TIMESTAMP,
    timestamp: finEn,
    alarmManager: { type: await obtenerTipoAlarma() },
  };

  try {
    await notifee.createTriggerNotification(notificacion, disparador);
  } catch (error) {
    // El permiso de alarma exacta se puede revocar entre el chequeo y el alta.
    // Reintentamos con una alarma inexacta antes de dejar al usuario sin aviso.
    console.log('Alarma exacta rechazada, se usa inexacta:', error?.message || error);

    await notifee.createTriggerNotification(notificacion, {
      ...disparador,
      alarmManager: { type: AlarmType.SET_AND_ALLOW_WHILE_IDLE },
    });
  }
};

const programarAlarmaIOS = async ({ finEn, titulo, cuerpo }) => {
  const ahora = Date.now();

  const programaciones = idsAlarmaIOS().map((id, indice) => {
    const timestamp = finEn + indice * IOS_INTERVALO_REPETICION_MS;

    if (timestamp <= ahora) {
      return null;
    }

    return notifee.createTriggerNotification(
      {
        id,
        title: titulo,
        body: cuerpo,
        ios: {
          sound: IOS_SONIDO_ALARMA,
          categoryId: IOS_CATEGORIA_DESCANSO,
          // Atraviesa los modos de Concentracion / No molestar.
          interruptionLevel: 'timeSensitive',
          // Agrupa las repeticiones en un solo hilo del centro de notificaciones.
          threadId: DESCANSO_ALARMA_ID,
          foregroundPresentationOptions: { banner: true, list: true, sound: true },
        },
      },
      { type: TriggerType.TIMESTAMP, timestamp },
    );
  });

  await Promise.all(programaciones.filter(Boolean));
};

/**
 * Cancela la alarma y la cuenta regresiva. Funciona aunque el modal de descanso
 * no este montado, porque los ids son fijos.
 */
export const cancelarDescanso = async () => {
  const ids = todosLosIds();

  try {
    await Promise.all([
      notifee.cancelTriggerNotifications(ids),
      notifee.cancelDisplayedNotifications(ids),
    ]);
  } catch (error) {
    console.log('No se pudo cancelar el descanso:', error?.message || error);
  }
};

/**
 * Programa el descanso completo. Idempotente: cancela lo anterior antes de
 * programar, asi pausar / reanudar / reiniciar nunca deja alarmas duplicadas.
 */
export const programarDescanso = async ({ finEn, ejercicio, serie, totalSeries }) => {
  await cancelarDescanso();

  if (!finEn || finEn <= Date.now()) {
    return;
  }

  const titulo = 'Descanso terminado';
  const cuerpo = `Es hora de la serie de ${ejercicio || 'ejercicio'}`;

  try {
    if (esAndroid) {
      await mostrarProgreso({ finEn, ejercicio, serie, totalSeries });
      await programarAlarmaAndroid({ finEn, titulo, cuerpo });
      return;
    }

    await programarAlarmaIOS({ finEn, titulo, cuerpo });
  } catch (error) {
    console.log('No se pudo programar el descanso:', error?.message || error);
  }
};
