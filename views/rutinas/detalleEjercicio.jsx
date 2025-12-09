import { useEffect, useState, useRef } from "react";
import { Modal, Text, View, ScrollView, Animated, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from '../../styles/detalleEjercicioStyles';
import { modificarEjercicio } from '../../store/rutinasSlice';
import { Boton, BotonPlay, BotonReiniciar, BotonVolver } from "../../components/botones/botones";
import Descanso from "./descanso";

const DetalleEjercicio = ({ ejercicio, setModalEjercicio, rutinaSeleccionada }) => {

  const [modalDescanso, setModalDescanso] = useState(false);
  
  //Series realizadas
  const [serie, setSerie] = useState(0);
  //Ejercicio activo
  const [estado, setEstado] = useState(false);
  //Ejercicio finalizado
  const [finalizado, setFinalizado] = useState(false);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const ejercicioActualizado = useSelector(state =>
    state.rutinas.rutinas
      ?.find(r => r.id === rutinaSeleccionada?.id)
      ?.ejercicios?.find(e => e.id === ejercicio.id)
  );

  useEffect(() => {
    if (ejercicioActualizado) {
      console.log('ejercicioActualizado',ejercicioActualizado);
      
      setSerie(ejercicioActualizado.seriesRealizadas ?? 0);
    }
  }, [ejercicioActualizado]);

  useEffect(() => {
    if (!estado) return;

    fadeAnim.setValue(0);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [estado]);

  const actualizarSeries = (nuevaSerie) => {
    console.log('nuevaSerie',nuevaSerie);
    dispatch(
      modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { seriesRealizadas: nuevaSerie },
      })
    );
  };

  const completarSerie = () => {
    const nuevaSerie = serie + 1;
    setSerie(nuevaSerie);
    actualizarSeries(nuevaSerie);
    
    if (nuevaSerie === ejercicioActualizado.series) {
      setEstado(true);
      setModalDescanso(true);
      setFinalizado(true);
    } else {
      setEstado(false);
      setModalDescanso(true);
    }
  };

  const reiniciarEjercicio = () => {
    if (!ejercicioActualizado) return;

    setEstado(false);
    setSerie(0);

    dispatch(
      modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { estado: 0, seriesRealizadas: 0 },
      })
    );
  };

  if (!ejercicioActualizado) {
    return <Text style={{ color: "#fff" }}>Error cargando ejercicio</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>

        {!finalizado && (
          <BotonVolver 
            onPress={() => {
              setModalEjercicio(false);
            }} 
          />
        )}

        <Text style={styles.titulo}>{ejercicioActualizado.nombre}</Text>

        {finalizado && (
          <Animated.Text style={{
            opacity: fadeAnim,
            color: '#FF6B00',
            textAlign: 'center',
            fontSize: 24,
            fontWeight: '900',
            marginVertical: 10,
          }}>
            FINALIZADO
          </Animated.Text>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.label, styles.estadistica]}>Realizadas: {serie}</Text>
          <Text style={[styles.label, styles.estadistica]}>Restantes: {ejercicioActualizado.series - serie}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.tituloDetalle}>Detalle</Text>
          <Text style={styles.label}>Series: <Text style={styles.valor}>{ejercicioActualizado.series}</Text></Text>
          <Text style={styles.label}>Descanso: <Text style={styles.valor}>{ejercicioActualizado.descanso} Min</Text></Text>
        </View>

        {estado && !finalizado ? (
          <View>
            <Animated.Text style={[styles.titulo, { opacity: fadeAnim }]}>
              Serie {serie + 1} en curso
            </Animated.Text>

            <Boton onPress={completarSerie}>Descansar</Boton>
          </View>
        ) : finalizado ? (
          <View>
            <Text style={[styles.titulo, { color: '#fff' }]}>¡Felicitaciones, terminaste!</Text>

            <View style={styles.botonera}>
              
              <BotonVolver onPress={() => setModalEjercicio(false)} />

              <BotonReiniciar
                onPress={() => {
                  Alert.alert(
                    "Reiniciar",
                    "¿Desea reiniciar el ejercicio?",
                    [
                      { text: "Cancelar" },
                      {
                        text: "Ok, Reiniciar ejercicio",
                        onPress: reiniciarEjercicio,
                      },
                    ]
                  );
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.botonera}>
            <BotonPlay onPress={() => setEstado(true)} />
          </View>
        )}

        <Modal visible={modalDescanso} animationType="slide">
          <Descanso
            ejercicio={ejercicioActualizado}
            setModalDescanso={setModalDescanso}
            serie={serie}
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

export default DetalleEjercicio;
