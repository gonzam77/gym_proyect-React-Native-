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
import { colores } from "../../styles/colores";

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
    setRutinaSeleccionada(rutinaActualizada);
  },[copiaRutinaActualizada]);

  const handleReiniciarRutina = () =>{
    dispatch(reiniciarRutina(copiaRutinaActualizada));
  }

  // <IconButton 
  //   icon="trash-can-outline" 
  //   iconColor="#FF5252" 
  //   size={24} 
  //   onPress={handleEliminarCategoria}
  // />

  return (
    <View style={styles.container}>
      <View style={styles.botonera}>
        {/*BOTON VOLVER*/}
        <Pressable
          onPress={() => {
            setRutinaSeleccionada({});
            setModalDetalle(false);
          }}
          >
          <Icon name="chevron-back-outline" color={'#fff'} size={35} />
        </Pressable>
        {/* <BotonVolver 
          onPress={() => {
              setRutinaSeleccionada({});
              setModalDetalle(false);
          }}
        /> */}

        {/*BOTON EDITAR*/}
        {/* <Ionicons name="pencil-outline" size={24} color="black" /> */}
        <Pressable
          style={{borderRadius:8, backgroundColor:colores.terciario}}
          onPress={() => {
            setModalFormRutina(true);
          }}
          >
            <Text style={{color:colores.blanco, fontSize:16, fontWeight:'900', padding:10}}>Editar</Text>

            {/* <Icon name="pencil-outline" color={'#fff'} size={35} /> */}
        </Pressable>
        {/* <BotonEditar
          onPress={() => {
            }}
            /> */}

        {/*BOTON REINICIAR*/}
        <Pressable
          style={{borderRadius:8, backgroundColor:colores.principal}}
          onPress={() => {
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
          >
            <Text style={{color:colores.blanco, fontSize:16, fontWeight:'900', padding:10}}>Reiniciar</Text>
            {/* <Icon name="refresh-outline" color={'#43d112'} size={35} /> */}
        </Pressable>
        {/* <BotonReiniciar 
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
                  /> */}

        {/*BOTON BORRAR*/}
        <Pressable
          style={{borderRadius:8, backgroundColor:colores.alert}}
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
          >
            <Text style={{color:colores.blanco, fontSize:16, fontWeight:'900', padding:10}}>Eliminar</Text>
            {/* <Icon name="trash-outline" color={'#FF5252'} size={35} /> */}
        </Pressable>
        {/* <BotonBorrar 
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
        /> */}
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
