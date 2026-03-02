import { PermissionsAndroid, Platform, View, Text, Pressable, Modal, Image, Animated, FlatList } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { styles } from '../../styles/misRutinasStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import formatearTiempo from '../../helpers/formatearTiempo';
import FormRutina from "./formRutina";
import DetalleRutina from "./detalleRutina";

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
  const usuario = useSelector(state => state.usuario.usuario);
  
  const [modalFormRutina, setModalFormRutina] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
 
  useEffect(()=>{
    requestNotificationPermission();
  },[]);

  const EntrenamientoItem = ({ nombre, id, tiempo }) => (
    <Pressable onPress={()=>{
        const selectedRutina = 
          rutinas?.find(e => e.id === id);
        setRutinaSeleccionada(selectedRutina);
        setModalDetalle(true)
      }} style={styles.entrenamiento}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.nombre}>{nombre}</Text>
            <View style={styles.tiempoContenedor}>
              <Icon name="time-outline" size={16} color="#fff" style={{marginRight: 5}} />
              <Text style={styles.tiempo}>{formatearTiempo(tiempo)}</Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" color={'#fff'} size={25} />
        </View>
      </View>
    </Pressable>
  );

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
  
  return (
    <View
          style={styles.fondo}
          resizeMode=""
        >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.saludo}>Bienvenido</Text>
            <Text style={styles.userName}>{usuario?.nombre || 'Atleta'}</Text>
          </View>
          <Image style={styles.image} source={require('../../assets/img/logo1.png')} />
        </View>
        
        <FlatList
          data={rutinas} // El array de datos
          keyExtractor={(item) => item.id.toString()} // Identificador único
          renderItem={({ item }) => (
            <EntrenamientoItem
              nombre={item.nombre}
              id={item.id}
              tiempo={item.tiempo}
            />
          )}
          // Esto reemplaza tu lógica de "Aún no ha programado rutinas"
          ListEmptyComponent={() => (
            <View style={styles.leyenda}>
              <Text style={styles.leyendaTexto}>Aún no ha programado rutinas</Text>
            </View>
          )}
          // Estilos del contenedor interno
          contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} 
          // Optimización: evita que el rebote blanco se vea mal
          showsVerticalScrollIndicator={false}
        />

        <Pressable
          onPressIn={presionarIn}
          onPressOut={presionarOut}
          style={styles.btnCircular}
          onPress={() => {
            setRutinaSeleccionada({});
            setModalFormRutina(true);
          }}
        >
          <Animated.Image style={[styles.agregar, {transform:[{scale: scaleAnim}]}]} source={require('../../assets/img/agregar.png')} />
        </Pressable>
      </View>

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