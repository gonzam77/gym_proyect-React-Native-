import { Modal, Pressable, StyleSheet, Text, View, Alert, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import FormRutina from "./formRutina";
import DetalleEjercicio from "./detalleEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import formatearTiempo from '../helpers/formatearTiempo';
import { styles } from '../styles/detalleRutinaStyles';

const DetalleRutina = (
  {
    rutinaSeleccionada, 
    setRutinaSeleccionada, 
    modalFormRutina, 
    setModalFormRutina, 
    setModalDetalle
  })=>{  
    
  const rutinas = useSelector(state => state.rutinas.rutinas);
  const rutinaActualizada = useSelector(state =>
    state.rutinas.rutinas.find(r => r.id === rutinaSeleccionada?.id)
  );

  const dispatch = useDispatch();
  const [ejercicio, setEjercicio] = useState({});
  const [modalEjercicio, setModalEjercicio] = useState(false);

  const eliminarRutina = (id)=>{
    dispatch({
      type: 'rutinas/eliminarRutina',
      payload: id
    });
    setRutinaSeleccionada({});
    setModalDetalle(false);
  };

  const reiniciarRutina = ()=>{
    const rutinaReiniciada = 
    {...rutinaActualizada,
      ejercicios: rutinaActualizada?.ejercicios?.map(e=>{
            return(
              { ...e,
                seriesRealizadas: 0
              }
            )
          })
    }

    const rutinasActualizadas = rutinas?.map(r =>{
      return r.id === rutinaReiniciada.id ? rutinaReiniciada : r
    })
    
    dispatch({
      type:'rutinas/setRutinas',
      payload: rutinasActualizadas
    })
  }
  
  useEffect(()=>{  
  },[rutinaActualizada])
  
  return (
    <View style={styles.container}>
      <View style={styles.botonera}>
        <Pressable
            style={[styles.iconButton,{alignItems:'center'}]}
            onPress={() => {
              setRutinaSeleccionada({});
              setModalDetalle(false);
            }}
        >
            <Image style={styles.iconos} source={require('../assets/img/volver.png')}></Image>
        </Pressable>

        <Pressable
          style={[styles.iconButton,{alignItems:'center'}]}
          onPress={() => {
            setModalFormRutina(true);
          }}
        >
            <Image style={{ width:55, height:55 }} source={require('../assets/img/editar.png')}></Image>
        </Pressable>
        <Pressable 
          onPress={()=>{
              Alert.alert("Reiniciar", "Desea reiniciar los ejercicios?", [
                { text: "Cancelar" },
                {
                  text: "Ok, Reiciciar ejercicios",
                  onPress: () => {
                    reiniciarRutina();
                  },
                },
              ]);
          }}
        >
          <Image style={{width:45,height:45, alignSelf:'center'}} source={require('../assets/img/reiniciar.png')}></Image>
        </Pressable>

        <Pressable
          style={[styles.iconButton,{alignItems:'center'}]}
          onPress={() => {
            Alert.alert("Eliminar", "Desea eliminar la rutina?", [
              { text: "Cancelar" },
              {
                text: "Ok, Eliminar",
                onPress: () => {
                  eliminarRutina(rutinaActualizada.id);
                },
              },
            ]);
          }}
        >
          <Image style={styles.iconos} source={require('../assets/img/eliminar.png')}></Image>
        </Pressable>
      </View>
      <View>
        <Text style={styles.titulo}>{rutinaActualizada?.nombre}</Text>
      </View>
      <Text style={styles.tiempo}>
        Tiempo Estimado: {formatearTiempo(rutinaSeleccionada.tiempo)}
      </Text>
      
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120, flexGrow: 1, minHeight: '120%' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listaEjercicios}>
          {
            rutinaActualizada?.ejercicios?.map((e, index) => (
              <Pressable 
                key={e.id} 
                style={styles.ejercicioItem}
                onPress={() => {
                  setEjercicio(e);
                  setModalEjercicio(true)
                }} 
              >
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <View style={{maxWidth:280}}>
                    <Text style={styles.ejercicioNombre}>{e.nombre}</Text>
                    <Text style={styles.ejercicioDetalle}>{e.series} series</Text>
                    {e.seriesRealizadas >= e.series ? <Text style={styles.finalizado}>FINALIZADO</Text> : null}
                  </View>
                  <Icon name="chevron-forward-outline" color={'#fff'} size={25} />
                </View>  
              </Pressable>
            ))
          }
        </View>
        
      </ScrollView>
      
      <Modal
        visible={modalFormRutina}
        animationType="slide"
        onRequestClose={() => setModalFormRutina(false)}
      >
        <FormRutina 
          rutinaSeleccionada={rutinaActualizada}
          setModalFormRutina={setModalFormRutina}
        />
      </Modal>

      <Modal
        visible={modalEjercicio}
        animationType="slide"
        onRequestClose={()=>{setModalEjercicio(false)}}
      >
        <DetalleEjercicio
          ejercicio={ejercicio}
          setModalEjercicio={setModalEjercicio}
          rutinaSeleccionada={rutinaActualizada}
        />
      </Modal>

    </View>
  )
}

export default DetalleRutina;
