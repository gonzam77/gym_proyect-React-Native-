import { Modal, Pressable, Text, View, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import FormRutina from "./formRutina";
import DetalleEjercicio from "./detalleEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import formatearTiempo from '../../helpers/formatearTiempo';
import { styles } from '../../styles/detalleRutinaStyles';
import { eliminarRutina, reiniciarRutina } from "../../store/rutinasSlice";
import { BotonVolver, BotonEditar, BotonReiniciar, BotonBorrar } from "../../components/botones/botones";

const DetalleRutina = (
  {
    rutinaSeleccionada, 
    setRutinaSeleccionada, 
    modalFormRutina, 
    setModalFormRutina, 
    setModalDetalle
  })=>{  
    
  const rutinaActualizada = useSelector(state =>
    state.rutinas.rutinas.find(r => r.id === rutinaSeleccionada?.id)
  );

  const copiaRutinaActualizada = JSON.parse(JSON.stringify(rutinaActualizada));

  const dispatch = useDispatch();
  const [ejercicio, setEjercicio] = useState({});
  const [modalEjercicio, setModalEjercicio] = useState(false);

  const handleEliminarRutina  = (id)=>{
    dispatch(eliminarRutina(id));
    setRutinaSeleccionada({});
    setModalDetalle(false);
  };
  
  useEffect(()=>{  
  },[copiaRutinaActualizada]);

  const handleReiniciarRutina = () =>{
    dispatch(reiniciarRutina(copiaRutinaActualizada));
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.botonera}>
        <BotonVolver 
          onPress={() => {
              setRutinaSeleccionada({});
              setModalDetalle(false);
          }}
        />
        <BotonEditar
          onPress={() => {
            setModalFormRutina(true);
          }}
        />
        <BotonReiniciar 
          onPress={()=>{
              Alert.alert("Reiniciar", "Desea reiniciar los ejercicios?", [
                { text: "Cancelar" },
                {
                  text: "Ok, Reiciciar ejercicios",
                  onPress: () => {
                    handleReiniciarRutina();
                  },
                },
              ]);
          }}
        />
        <BotonBorrar 
          onPress={() => {
            Alert.alert("Eliminar", "Desea eliminar la rutina?", [
              { text: "Cancelar" },
              {
                text: "Ok, Eliminar",
                onPress: () => {
                  handleEliminarRutina(copiaRutinaActualizada.id);
                },
              },
            ]);
          }}
        />
      </View>
      <View>
        <Text style={styles.titulo}>{copiaRutinaActualizada?.nombre}</Text>
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
            copiaRutinaActualizada?.ejercicios?.map((e, index) => (
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
          rutinaSeleccionada={copiaRutinaActualizada}
          setModalFormRutina={setModalFormRutina}
        />
      </Modal>

      <Modal
        visible={modalEjercicio}
        animationType="slide"
      >
        <DetalleEjercicio
          ejercicio={ejercicio}
          setModalEjercicio={setModalEjercicio}
          rutinaSeleccionada={copiaRutinaActualizada}
        />
      </Modal>

    </View>
  )
}

export default DetalleRutina;
