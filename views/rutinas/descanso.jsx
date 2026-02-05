import { Pressable, Text, View, Image, DeviceEventEmitter } from "react-native";
import { useState, useRef, useEffect } from "react";
import BackgroundTimer from "react-native-background-timer";
import Icon from "react-native-vector-icons/Ionicons";
import notifee, { AndroidImportance, AndroidCategory, EventType } from '@notifee/react-native'; // Importamos Notifee
import { styles } from "../../styles/descansoStyles";
import { Boton, BotonStop } from "../../components/botones/botones";

const Descanso = ({ setModalDescanso, ejercicio, serie }) => {
  const segundosTotales = ejercicio.descanso * 60;
  const [segundos, setSegundos] = useState(segundosTotales);
  const [activo, setActivo] = useState(true);
  
  const intervaloRef = useRef(null);
  const inicioRef = useRef(Date.now());
  const pausadoRef = useRef(0);
  const notificadoRef = useRef(false);

  // 1. Función para crear el canal de "Alarma"
  async function onDisplayNotification(sound) {
    // Crear un canal (requerido para Android)
    const channelId = await notifee.createChannel({
      id: `channel-${sound}`, // Un ID único por sonido para evitar conflictos
      name: `Alarma ${sound}`,
      importance: AndroidImportance.HIGH,
      sound: sound, // <--- AQUÍ: 'alarm', 'alarm2' o 'beep'
      vibration: true,
      vibrationPattern: [300, 500, 300, 500],
    });

    // Mostrar la notificación
    await notifee.displayNotification({
      title: '¡Descanso terminado! 💪',
      body: `Es hora de la serie de ${ejercicio.nombre || 'ejercicio'}`,
      android: {
        channelId,
        category: AndroidCategory.ALARM, // ESTO es la clave: lo trata como alarma
        importance: AndroidImportance.HIGH,
        ongoing: true,
        pressAction: {
          id: 'default',
        },
        // Esto hace que aparezca sobre otras apps (Heads up notification)
        fullScreenAction: {
          id: 'default',
        },
        actions: [
          {
            title: '<b>+30 Seg</b>',
            pressAction: {
              id: 'snooze-30',
            },
          },
          {
            title: '<font color="#f44336"><b>DETENER</b></font>',
            pressAction: {
              id: 'stop-alarm',
            },
          },
        ],
      },
    });
  }

  // --- Tu lógica de timers se mantiene igual ---
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
    // 1. Cancelamos todas las notificaciones/alarmas activas de Notifee
    await notifee.cancelAllNotifications();
    
    // 2. Cerramos el modal
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
      onDisplayNotification('alarm2'); // Llamamos a la "Alarma"
    }
  }, [segundos]);

  useEffect(() => {
    const suscripcion = DeviceEventEmitter.addListener("sumarTiempo", () => {
      // 1. Ponemos el estado en 30 inmediatamente para que sea visual
      setSegundos(30);
      
      // 2. Reseteamos la marca de notificación
      notificadoRef.current = false;
      
      // 3. LA CLAVE: Ajustamos inicioRef para que el cálculo de 'transcurrido'
      // nos dé exactamente lo necesario para que queden 30 segundos.
      // Nueva marca de inicio = Ahora - (Tiempo Total - 30 segundos deseados)
      const tiempoParaQueQueden30 = (segundosTotales - 30) * 1000;
      inicioRef.current = Date.now() - tiempoParaQueQueden30;
      
      // 4. Limpiamos el acumulador de pausa para que no interfiera
      pausadoRef.current = 0;
      
      setActivo(true);
    });

    return () => suscripcion.remove();
  }, [segundosTotales]); // Agregamos segundosTotales a las dependencias

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

notifee.onForegroundEvent(({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS) {
    if (pressAction.id === 'stop-alarm') {
      notifee.cancelNotification(notification.id);
    } 
    
    if (pressAction.id === 'snooze-30') {
      notifee.cancelNotification(notification.id);
      DeviceEventEmitter.emit("sumarTiempo");
    }
  }
});