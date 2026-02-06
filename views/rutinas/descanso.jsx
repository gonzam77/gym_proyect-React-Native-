import { Pressable, Text, View, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import BackgroundTimer from "react-native-background-timer";
import Icon from "react-native-vector-icons/Ionicons";
import notifee, { AndroidImportance, AndroidCategory, EventType } from '@notifee/react-native'; // Importamos Notifee
import { styles } from "../../styles/descansoStyles";
import { Boton, BotonStop } from "../../components/botones/botones";

// Escuchador de eventos en primer plano
notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop-alarm') {
    // Si presionan el botón "DETENER"
    notifee.cancelNotification(detail.notification.id);
  }
});

const Descanso = ({ setModalDescanso, ejercicio, serie }) => {
  const segundosTotales = 0.1 * 60//ejercicio.descanso * 60;
  const [segundos, setSegundos] = useState(segundosTotales);
  const [activo, setActivo] = useState(true);
  
  const intervaloRef = useRef(null);
  const inicioRef = useRef(Date.now());
  const pausadoRef = useRef(0);
  const notificadoRef = useRef(false);

  // 1. Función para crear el canal de "Alarma"
  async function onDisplayNotification(soundName) {
    // Crear un canal (requerido para Android)
    const channelId = await notifee.createChannel({
      id: `channel-${soundName}`, // Un ID único por sonido para evitar conflictos
      name: `Alarma ${soundName}`,
      importance: AndroidImportance.HIGH, // Alta importancia
      sound: soundName, // Puedes poner un sonido custom si lo agregas a la carpeta raw
      vibration: true,
      vibrationPattern: [300, 500, 300, 500], // Patrón de vibración fuerte
    });

    await notifee.displayNotification({
      title: '¡Descanso terminado! 💪',
      body: `Es hora de la serie de ${ejercicio.nombre || 'ejercicio'}`,
      android: {
        channelId,
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
  }

  const calcularSegundos = () => {
    const ahora = Date.now();
    const transcurrido = Math.floor((ahora - inicioRef.current + pausadoRef.current) / 1000);
    return Math.max(segundosTotales - transcurrido, 0);
  };

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
    return `${String(m).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  };

  const detenerTodo = async () => {
    await notifee.cancelAllNotifications();
    setModalDescanso(false);
  };

  useEffect(() => {
    if (!activo) return;
    intervaloRef.current = BackgroundTimer.setInterval(() => {
      if (segundos === 0) return;
      setSegundos(calcularSegundos());
    }, 1000);

    return () => {
      if (intervaloRef.current) {
        BackgroundTimer.clearInterval(intervaloRef.current);
      }
    };
  }, [activo]);

  useEffect(() => {
    if (segundos === 0 && !notificadoRef.current) {
      notificadoRef.current = true;
      onDisplayNotification('alarm2');
    }
  }, [segundos]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/img/descanso.png")} />
      <Text style={styles.titulo}>DESCANSO</Text>
      <Text style={styles.titulo1}>Series realizadas {serie} de {ejercicio.series}</Text>

      <View style={styles.contenedor}>
        <Text style={styles.titulo2}>Tiempo Restante</Text>
        <Text style={styles.tiempo}>{formatoTiempo(segundos)}</Text>

        <View style={styles.botones}>
          {activo ? (
            <Pressable onPress={pausar}>
              <Icon name="pause-circle-outline" size={60} color="#eefa07" />
            </Pressable>
          ) : (
            <Pressable onPress={reanudar}>
              <Icon name="play-circle-outline" size={60} color="#eefa07" />
            </Pressable>
          )}
          <Pressable onPress={reiniciar}>
            <Icon name="refresh-outline" size={55} color="#43d112" />
          </Pressable>
        </View>
      </View>

      {segundos > 0 ? (
        <Boton onPress={() => setModalDescanso(false)}>Saltar</Boton>
      ) : (
        <BotonStop onPress={detenerTodo} />
      )}
    </View>
  );
};

export default Descanso;