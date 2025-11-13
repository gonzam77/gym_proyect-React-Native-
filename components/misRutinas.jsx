import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Image, Animated } from "react-native";
import FormRutina from "./formRutina";
import DetalleRutina from "./detalleRutina";
import Icon from 'react-native-vector-icons/Ionicons'; // o MaterialIcons si preferís
import { useSelector } from "react-redux";
import { PermissionsAndroid, Platform } from "react-native";
import formatearTiempo from '../helpers/formatearTiempo';
import { styles } from '../styles/misRutinasStyles';

async function requestNotificationPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: "Permiso de notificaciones",
        message: "La app necesita notificarte cuando termine el descanso.",
        buttonPositive: "Aceptar",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

const MisRutinas = () => {

  const rutinas = useSelector(state => state.rutinas.rutinas);
  
  const [modalFormRutina, setModalFormRutina] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState();

  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(()=>{
    requestNotificationPermission();
  },[rutinas])
 
  const EntrenamientoItem = ({ dia, nombre, id, tiempo }) => (
    <Pressable onPress={()=>{
        const selectedRutina = rutinas.find(e=>e.id===id)
        setRutinaSeleccionada(selectedRutina)
        setModalDetalle(true)
      }} style={styles.entrenamiento}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <View style={{maxWidth:280}}>
            <Text style={styles.dia}>
              {dia}: <Text style={styles.nombre}>{nombre}</Text>
            </Text>
          </View>
          <View>
            <Text style={styles.tiempo}>
              {formatearTiempo(tiempo)}
            </Text>
          </View>
          <Icon name="chevron-forward-outline" color={'#fff'} size={25}></Icon>
        </View>
    </Pressable>
  );
  
  return (
    
    <View style={styles.container}>
      <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:30, paddingTop:30}}>
        <View>
          <Text style={{fontSize:30, color:'#fff', fontWeight:'800', }}>
            B i e n v e n i d o
          </Text>
          <Text style={{fontSize:45, color:'#fff', fontWeight:'800', }}>
            Gonza 
          </Text>
        </View>
        <View>
          <Image style={styles.image} source={require('../assets/img/logo1.png')} />
        </View>  
      </View>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {
          rutinas?.length ? null : (
            <View style={styles.leyenda}>
              <Text style={styles.leyendaTexto}>Aun no ha programado rutinas</Text>
            </View>
          )
        }
  
        {
          rutinas?.map((e, index) => (
            <EntrenamientoItem
            dia={`DIA ${index + 1}`}
            nombre={e?.nombre}
            id={e?.id}
            key={e?.id}
            tiempo={e?.tiempo}
            />
          ))
        }
      </ScrollView>

      <Pressable
        onPressIn={presionarIn}
        onPressOut={presionarOut}
        style={styles.btnCircular}
        onPress={() => {
          setRutinaSeleccionada({});
          setModalFormRutina(true);
        }}
      >
        <Animated.Image style={[styles.agregar, {transform:[{scale: scaleAnim}]}]} source={require('../assets/img/agregar.png')} />
      </Pressable>

      <Modal
        visible={modalDetalle}
        animationType="slide"
        onRequestClose={() => setModalDetalle(false)}
      >
        <DetalleRutina
          rutinaSeleccionada={rutinaSeleccionada}
          setRutinaSeleccionada={setRutinaSeleccionada}
          rutinas={rutinas}
          setModalFormRutina={setModalFormRutina}
          modalFormRutina={modalFormRutina}
          setModalDetalle={setModalDetalle}
        />
      </Modal>

      <Modal
        visible={modalFormRutina}
        animationType="slide"
        onRequestClose={() => setModalFormRutina(false)}
      >
        <FormRutina
          rutinas={rutinas}
          setModalFormRutina={setModalFormRutina}
          rutinaSeleccionada={rutinaSeleccionada}
          setRutinaSeleccionada={setRutinaSeleccionada}
        />
      </Modal>
    </View>
  );
};

export default MisRutinas; 