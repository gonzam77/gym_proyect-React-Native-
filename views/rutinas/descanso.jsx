import { Pressable, Text, View, Image, ScrollView } from 'react-native';
import { useCallback, useState, useRef, useEffect } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import Icon from 'react-native-vector-icons/Ionicons';
import notifee, { AndroidCategory, AndroidImportance } from '@notifee/react-native';
import { styles } from '../../styles/descansoStyles';
import { Boton } from '../../components/botones/botones';
import { colores } from '../../styles/colores';
import { DESCANSO_CHANNEL_ID } from '../../helpers/notificationConstants';

const Descanso = ({ setModalDescanso, ejercicio, serie }) => {
  const segundosTotales = 5 //(Number(ejercicio?.descanso) || 0) * 60;

  const [segundos, setSegundos] = useState(segundosTotales);
  const [activo, setActivo] = useState(true);

  const intervaloRef = useRef(null);
  const inicioRef = useRef(Date.now());
  const pausadoRef = useRef(0);
  const notificadoRef = useRef(false);

  const onDisplayNotification = useCallback(async () => {
    await notifee.displayNotification({
      title: 'Descanso terminado',
      body: `Es hora de la serie de ${ejercicio.nombre || 'ejercicio'}`,
      android: {
        channelId: DESCANSO_CHANNEL_ID,
        ongoing: true,
        autoCancel: false,
        category: AndroidCategory.ALARM,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        actions: [
          {
            title: '<font><b>DETENER</b></font>',
            pressAction: {
              id: 'stop-alarm',
            },
          },
        ],
        fullScreenAction: {
          id: 'default',
        },
      },
    });
  }, [ejercicio?.nombre]);

  const calcularSegundos = useCallback(() => {
    const ahora = Date.now();
    const transcurrido = Math.floor((ahora - inicioRef.current + pausadoRef.current) / 1000);
    return Math.max(segundosTotales - transcurrido, 0);
  }, [segundosTotales]);

  const pausar = () => {
    pausadoRef.current += Date.now() - inicioRef.current;
    setActivo(false);
  };

  const reanudar = () => {
    inicioRef.current = Date.now();
    setActivo(true);
  };

  const reiniciar = () => {
    inicioRef.current = Date.now();
    pausadoRef.current = 0;
    notificadoRef.current = false;
    setSegundos(segundosTotales);
    setActivo(true);
  };

  const formatoTiempo = (s) => {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
  };

  const detenerTodo = async () => {
    if (intervaloRef.current) {
      BackgroundTimer.clearInterval(intervaloRef.current);
    }

    await notifee.cancelAllNotifications();
    setModalDescanso(false);
  };

  const saltarDescanso = () => {
    if (intervaloRef.current) {
      BackgroundTimer.clearInterval(intervaloRef.current);
    }

    setModalDescanso(false);
  };

  useEffect(() => {
    if (!activo) return;

    intervaloRef.current = BackgroundTimer.setInterval(() => {
      setSegundos(calcularSegundos());
    }, 1000);

    return () => {
      if (intervaloRef.current) {
        BackgroundTimer.clearInterval(intervaloRef.current);
      }
    };
  }, [activo, calcularSegundos]);

  useEffect(() => {
    if (segundos === 0 && !notificadoRef.current) {
      notificadoRef.current = true;
      setActivo(false);
      onDisplayNotification();
    }
  }, [onDisplayNotification, segundos]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image style={styles.image} source={require('../../assets/img/descanso.png')} />
        <Text style={styles.titulo}>DESCANSO</Text>
        <Text style={styles.titulo1}>Series realizadas {serie} de {ejercicio.series}</Text>

        <View style={styles.contenedor}>
          <Text style={styles.titulo2}>Tiempo Restante</Text>
          <Text style={styles.tiempo}>{formatoTiempo(segundos)}</Text>

          <View style={styles.botones}>
            {activo ? (
              <Pressable onPress={pausar}>
                <Icon name='pause-circle-outline' size={60} color={colores.turquesa} />
              </Pressable>
            ) : (
              <Pressable onPress={reanudar} disabled={segundos === 0}>
                <Icon name='play-circle-outline' size={60} color={colores.secundario} />
              </Pressable>
            )}
            <Pressable onPress={reiniciar}>
              <Icon name='refresh-outline' size={55} color={colores.turquesa} />
            </Pressable>
          </View>
        </View>

        {segundos > 0 ? (
          <Boton onPress={saltarDescanso}>Saltar</Boton>
        ) : (
          <Pressable onPress={detenerTodo} style={styles.stopButton}>
            <Icon name='stop-circle-outline' size={100} color={colores.alert} />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

export default Descanso;
