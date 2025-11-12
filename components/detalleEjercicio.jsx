import { useEffect, useState, useRef } from "react";
import { Modal, Pressable, Text, View, StyleSheet, ScrollView, Image, Animated, Alert } from "react-native";
import Descanso from "./descanso";
import { useDispatch, useSelector } from "react-redux";


const DetalleEjercicio = ({ ejercicio, setModalEjercicio, rutinaSeleccionada }) => {
  
  const [modalDescanso, setModalDescanso] = useState(false);
  const [serie, setSerie] = useState(0);
  const [estado, setEstado] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const dispatch = useDispatch();

  const ejercicioActualizado = useSelector(state=> 
    state.rutinas.rutinas.find(r=>
      r.id===rutinaSeleccionada.id)).ejercicios.find(e=>
        e.id===ejercicio.id);


  useEffect(()=>{
    setSerie(ejercicioActualizado?.seriesRealizadas ?? 0);
  },[]);

  useEffect(()=>{
    dispatch({
      type: 'rutinas/modificarEjercicio',
      payload:{
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios:{seriesRealizadas: serie}
      }
    });
  },[serie, estado]);
        
  useEffect(() => {
    
    let loop;

    fadeAnim.setValue(0); // arrancar desde cero

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
      if (loop) loop.stop(); // detener si el componente se desmonta o cambia el estado
    };

  }, [ejercicioActualizado.estado, estado]);

  const presionarIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.90,
      useNativeDriver: true,
    }).start();
  };

  const presionarOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const reiniciarEjercicio = ()=>{
    setEstado(false);
    setSerie(0);
    dispatch({
      type: 'rutinas/modificarEjercicio',
      payload:{
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios:{estado:0, seriesRealizadas:0}
      }
    });
  } 

  return (
    <View style={styles.container}>
      <ScrollView >
        {
          serie < ejercicioActualizado.series ?
          <View style={styles.botonera}>
            <Pressable style={styles.iconButton} onPress={()=>{
              setModalEjercicio(false);
            }}>
              <Image style={{width:50,height:50}} source={require('../assets/img/volver.png')}></Image>

            </Pressable>
          </View>
            : null
        }

        <Text style={styles.titulo}>{ejercicioActualizado.nombre}</Text>
        {
          ejercicioActualizado?.series === serie && (
            <Animated.Text style={{
              opacity: fadeAnim,
              color: '#fb7702',
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
              <Pressable
                style={styles.btnDescanso}
                onPress={() => {
                  setModalDescanso(true);
                  setEstado(false);
                  setSerie(serie + 1);
                }}
              >
                <Text style={styles.btnTexto}>Descanzar</Text>
              </Pressable>
            </View>
          ) : serie >= ejercicioActualizado.series ? ( 
            <View>
              <Text style={[styles.titulo, {color:'#fff'}]}>Felicitaciones, has terminado el ejercicio!</Text>  
              <View style={styles.botonera}>
                <Pressable style={styles.iconButton} onPress={()=>{
                  setModalEjercicio(false);
                }}>
                  <Image style={{width:50,height:50}} source={require('../assets/img/volver.png')}></Image>

                  {/* <Icon name="arrow-back-circle" size={40} color="#eefa07" /> */}
                  {/* <Text style={{color:'#fff', textAlign:'center'}}>Salir</Text> */}
                </Pressable>
                <Pressable style={[styles.iconButton,{alignItems:'center'}]} onPress={()=>{
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
                }}>
                  <Image style={{width:50,height:50}} source={require('../assets/img/reiniciar.png')}></Image>
                  {/* <Icon name="refresh-circle-outline" size={40} color="#43d112" /> */}
                  {/* <Text style={{color:'#fff', textAlign:'center'}}>Reiniciar</Text> */}
                </Pressable>
              </View>
            </View>
          ):(
            <View style={styles.botonera}>
              <Pressable
                onPressIn={presionarIn}
                onPressOut={presionarOut}
                style={[styles.iconButton,{alignItems:'center'}]}
                onPress={() => setEstado(true)}
              >
                <Animated.Image style={[
                  {
                    width: 70,
                    height: 70,
                    transform: [{ scale: scaleAnim }],
                  }
                ]} source={require('../assets/img/play.png')} />
                {/* <IconPlay name="play-circle-outline" size={70} color="#43d112" /> */}
                {/* <Text style={{color:'#fff',textAlign:'center'}}>Comenzar</Text> */}
              </Pressable>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: "start",
  },
  titulo: {
    color: "#43d112",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 30,
  },
  infoBox: {
    backgroundColor: "#111111",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#43d112',
    borderRightWidth: 4,
    borderRightColor: '#43d112',
  },
  tituloDetalle:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'700',
    color:"#43d112",
  },
  label: {
    fontSize: 18,
    color: "#eefa07",
    fontWeight: "700",
    marginBottom: 10,
  },
  valor: {
    color: "#fff",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#43d112",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    elevation: 3,
    marginBottom:20

  },
  btnVolver: {
    backgroundColor: "#eefa07",
    borderTopStartRadius:30,
    borderBottomStartRadius:30,
    borderColor:'#43d112',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    elevation: 3,
    marginVertical:20,
    marginRight:5
  },
  btnDescanso: {
    backgroundColor: '#eefa07',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    elevation: 3,
    marginBottom:20
  },
  btnTexto: {
    fontSize:18,
    color: "#000",
    fontWeight: "900",
    textAlign: "center",
  },
  estadistica:{
    fontSize:23,
    fontWeight:'800'
  },
  iconButton: {
    marginHorizontal: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 50,
    elevation: 5,
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 20,
  },

});
