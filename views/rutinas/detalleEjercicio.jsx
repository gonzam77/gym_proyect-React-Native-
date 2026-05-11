import { useEffect, useState, useRef } from "react";
import { Modal, Text, View, ScrollView, Animated, Alert, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from '../../styles/detalleEjercicioStyles';
import  stylesBoton  from '../../styles/botonesStyles'
import { modificarEjercicio } from '../../store/rutinasSlice';
import Descanso from "./descanso";
import FormNota from "../../components/formNota";
import Icon from "react-native-vector-icons/Ionicons";
import { colores } from "../../styles/colores";

const DetalleEjercicio = ({ ejercicio, setModalEjercicio, rutinaSeleccionada }) => {

  const [modalDescanso, setModalDescanso] = useState(false);
  const [modalFormNota, setModalFormNota] = useState(false);

  const [serie, setSerie] = useState(0);
  const [estado, setEstado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const ejercicioActualizado = useSelector(state =>
    state.rutinas.rutinas
      ?.find(r => r.id === rutinaSeleccionada?.id)
      ?.ejercicios?.find(e => e.id === ejercicio.id)
  );

  useEffect(()=>{
    if (!ejercicioActualizado) {
      return;
    }

    setFinalizado(ejercicioActualizado.series === ejercicioActualizado.seriesRealizadas);
  },[ejercicioActualizado])

  useEffect(() => {
    if (ejercicioActualizado) {
      setSerie(ejercicioActualizado.seriesRealizadas ?? 0);
    }
  }, [ejercicioActualizado]);

  useEffect(() => {

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
  },[fadeAnim, finalizado, estado]);

  const actualizarSeries = (nuevaSerie) => {
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
    setFinalizado(false);

    dispatch(
      modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { estado: 0, seriesRealizadas: 0 },
      })
    );
  };

  if (!ejercicioActualizado) {
    return <Text style={{ color: colores.blanco }}>Error cargando ejercicio</Text>;
  }
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {!finalizado && (
          <Pressable
            onPress={() => {
              setModalEjercicio(false);
            }}
            >
            <Icon name="chevron-back-outline" color={colores.blanco} size={35} />
          </Pressable>
          
        )}

        <Text style={styles.titulo}>{ejercicioActualizado.nombre}</Text>

        {finalizado && (
          <Animated.Text style={{
            opacity: fadeAnim,
            color: colores.advertencia,
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
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.label2}>Nota:</Text>
                <Text style={styles.objetivos}>{ejercicioActualizado.nota || "-"}</Text>
            </View>
            <View>
              <Pressable style={{borderRadius:10}} onPress={()=>setModalFormNota(true)}>
                 <View style={{alignSelf:'flex-end', marginRight:5}}>
                    <Icon name="pencil-outline" size={20}></Icon>
                </View>
              </Pressable>
            </View>
        </View>

        {estado && !finalizado ? (
          <View>
            <Animated.Text style={[styles.titulo, { opacity: fadeAnim }]}>
              Serie {serie + 1} en curso
            </Animated.Text>

            <Pressable style={stylesBoton.btn} onPress={completarSerie}>
              <Icon name="pause" color={colores.turquesa} size={40} />
            </Pressable>
          </View>
        ) : finalizado ? (
          <View>
            <Text style={[styles.titulo, { color: colores.blanco }]}>¡Felicitaciones, terminaste!</Text>

            <View style={styles.botonera}>
              
              <Pressable
                onPress={() => {
                  setModalEjercicio(false);
                }}
              >
                <Icon name="chevron-back-outline" color={colores.blanco} size={35} />
              </Pressable>

              
              <Pressable
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
              >
                <Icon name="refresh-outline" color={colores.verdeOpaco} size={35} />
              </Pressable>

            </View>
          </View>
        ) : (
          <View style={styles.botonera}>
            <Pressable 
              style={[stylesBoton.btn, {borderColor:colores.verdeOpaco}]}
              onPress={() => {
                setEstado(true);
              }}
            >
              <Icon name="play" color={colores.verdeOpaco} size={45} />
            </Pressable>
          </View>
        )}

        <FormNota
          visible={modalFormNota}
          onClose={()=>setModalFormNota(false)}
          setModalFormNota={setModalFormNota}
          ejercicio={ejercicio}
        />

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
