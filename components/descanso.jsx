import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons'; 
import PushNotification from "react-native-push-notification";
import { styles } from '../styles/descansoStyles';

Sound.setCategory('Playback');

const Descanso = ({ setModalDescanso, ejercicio, serie }) => {
  const segundosTotales = ejercicio.descanso * 60;
  const seriesRealizadas = ejercicio.serie
  const alarmaRef = useRef(null);
  const [segundos, setSegundos] = useState(segundosTotales);
  const [activo, setActivo] = useState(true);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (intervaloRef.current !== null) {
      BackgroundTimer.clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    if (activo && segundos > 0) {
      intervaloRef.current = BackgroundTimer.setInterval(() => {
        setSegundos(prev => {
          if (prev <= 1) {
            BackgroundTimer.clearInterval(intervaloRef.current);
            intervaloRef.current = null;

            PushNotification.localNotification({
              channelId: "descanso-channel",
              title: "¡Descanso terminado!",
              message: "Volvé al entrenamiento 💪",
              playSound: true,
              soundName: 'default',
              importance: "high",
              vibrate: true,
              ongoing: true,   
              autoCancel: false
            });

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervaloRef.current !== null) {
        BackgroundTimer.clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }

      if (alarmaRef.current) {
        alarmaRef.current.stop(() => {
          alarmaRef.current?.release?.();
          alarmaRef.current = null;
        });
      }
    };
  }, [activo, segundos]);

  const reiniciar = () => {
    if (intervaloRef.current !== null) {
      BackgroundTimer.clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    setSegundos(segundosTotales);
    setActivo(true);
  };

  const formatoTiempo = (s) => {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/img/descanso.png')} />
      <Text style={styles.titulo}>DESCANSO</Text>
      <Text style={styles.titulo2}>Series realizadas {serie} de {ejercicio.series}</Text>

      <View style={styles.contenedor}>
        <Text style={styles.titulo2}>Tiempo Restante</Text>
        <Text style={styles.tiempo}>{formatoTiempo(segundos)}</Text>

        <View style={styles.botones}>
          <Pressable
            onPress={() => setActivo(!activo)}
          >
            {
              activo ?
                <Icon name="pause-circle-outline" size={60} color="#eefa07" />
              :
                <Icon name="play-circle-outline" size={60} color="#43d112" />
              }
          </Pressable>

          <Pressable 
            onPress={reiniciar}
          >
              <Icon name="refresh-outline" size={55} color="#43d112" />
          </Pressable>
        </View>
      </View>
      {
        segundos > 0 ?
        <Pressable style={styles.btn} onPress={() => setModalDescanso(false)}>
          <Text style={styles.btnTexto}>Saltar Descanso</Text>
        </Pressable> 
        :        
        <Pressable
          onPress={() => {  
            if (alarmaRef.current) {
              alarmaRef.current.stop(() => {
                alarmaRef.current.release();
                alarmaRef.current = null;
              });
            }
            setModalDescanso(false);
          }}
        >
          <Image style={{width:80,height:80}} source={require('../assets/img/stop.png')}></Image>
        </Pressable>

      }
    </View>
  );
};

export default Descanso;
