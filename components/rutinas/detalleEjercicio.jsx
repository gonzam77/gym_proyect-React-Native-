import { useEffect, useState, useRef } from "react";
import { Modal, Text, View, ScrollView, Animated, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from '../../styles/detalleEjercicioStyles';
import Descanso from "./descanso";
import { modificarEjercicio } from '../../store/rutinasSlice';
import { Boton, BotonPlay, BotonReiniciar, BotonVolver } from "../botones/botones";


const DetalleEjercicio = ({ ejercicio, setModalEjercicio, rutinaSeleccionada }) => {
  
  const [modalDescanso, setModalDescanso] = useState(false);
  const [serie, setSerie] = useState(0);
  const [estado, setEstado] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const dispatch = useDispatch();

  const ejercicioActualizado = useSelector(state=> 
    state.rutinas.rutinas?.find(r=>
      r.id === rutinaSeleccionada?.id)).ejercicios?.find(e=>
        e.id === ejercicio.id);


  useEffect(()=>{
    if(ejercicioActualizado){
      setSerie(ejercicioActualizado?.seriesRealizadas ?? 0)
    }
  },[ejercicioActualizado]);

  const guardarEjercicio = () => {
    if(ejercicioActualizado)
      dispatch(modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { seriesRealizadas: serie }
      }));
  }
  
  useEffect(() => {
    let loop;
    fadeAnim.setValue(0); 

    loop = Animated.loop(
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

    return () => {
      if (loop) loop.stop(); 
    };

  }, [estado]);

  const reiniciarEjercicio = ()=>{
    setEstado(false);
    setSerie(0);
    dispatch(modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios:{estado:0, seriesRealizadas:0}
    }));
  } 

  return (
    <View style={styles.container}>
      <ScrollView >
        {
          serie < ejercicioActualizado.series ?
            <BotonVolver
              onPress={()=>{
                  setModalEjercicio(false);
                }}
            /> : null
        }

        <Text style={styles.titulo}>{ejercicioActualizado.nombre}</Text>
        {
          ejercicioActualizado?.series === serie && (
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
          )
        }

        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={[styles.label, styles.estadistica ]}>Realizadas: {serie}</Text>
          <Text style={[styles.label, styles.estadistica ]}>Restantes: {ejercicioActualizado.series - serie}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.tituloDetalle}>Detalle</Text>
          <Text style={styles.label}>
            Series: <Text style={styles.valor}>{ejercicioActualizado.series}</Text>
          </Text>
          <Text style={styles.label}>
            Descanso: <Text style={styles.valor}>{ejercicioActualizado.descanso} Min</Text>
          </Text>
          
        </View>

        {
          estado ? (
            <View>
              <Animated.Text style={[styles.titulo,{opacity:fadeAnim}]}>Serie {serie + 1} en curso</Animated.Text>
              <Boton
                onPress={() => {
                  setModalDescanso(true);
                  setEstado(false);
                  setSerie(serie + 1);
                }}
              >Descansar</Boton>
            </View>
          ) : serie >= ejercicioActualizado.series ? ( 
            <View>
              <Text style={[styles.titulo, {color:'#fff'}]}>Felicitaciones, has terminado el ejercicio!</Text>  
              <View style={styles.botonera}>
                <BotonVolver
                  onPress={()=>{
                    guardarEjercicio();
                    setModalEjercicio(false);
                  }}
                />
                <BotonReiniciar 
                  onPress={()=>{
                    Alert.alert(
                      "Reiniciar", 
                      "Desea reiniciar el ejercicio?", 
                      [
                        { text: "Cancelar" },
                        {
                          text: "Ok, Reiciciar ejercicio",
                          onPress: () => {
                            reiniciarEjercicio();
                          },
                        },
                      ]);
                  }}
                />
              </View>
            </View>
          ):(
            <View style={styles.botonera}>
              <BotonPlay
                onPress={() => setEstado(true)}
              />
            </View>
          )
        }

        <Modal 
          visible={modalDescanso} 
          animationType="slide"
        >
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
