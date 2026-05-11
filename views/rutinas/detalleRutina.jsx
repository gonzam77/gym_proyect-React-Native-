import { Modal, Pressable, Text, View, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import FormRutina from "./formRutina";
import DetalleEjercicio from "./detalleEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import formatearTiempo from '../../helpers/formatearTiempo';
import { styles } from '../../styles/detalleRutinaStyles';
import { eliminarRutina, reiniciarRutina } from "../../store/rutinasSlice";
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

  const copiaRutinaActualizada = rutinaActualizada
    ? JSON.parse(JSON.stringify(rutinaActualizada))
    : null;

  const dispatch = useDispatch();
  const [ejercicio, setEjercicio] = useState({});
  const [modalEjercicio, setModalEjercicio] = useState(false);

  const handleEliminarRutina  = (id)=>{
    setRutinaSeleccionada({});
    setModalDetalle(false);
    dispatch(eliminarRutina(id));
  };

  useEffect(()=>{
    if (rutinaActualizada) {
      setRutinaSeleccionada(rutinaActualizada);
    }
  },[rutinaActualizada, setRutinaSeleccionada]);

  const handleReiniciarRutina = () =>{
    if (!copiaRutinaActualizada) {
      return;
    }

    dispatch(reiniciarRutina(copiaRutinaActualizada));
  }

  if (!copiaRutinaActualizada) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.botonera}>
        <Pressable
          onPress={() => {
            setRutinaSeleccionada({});
            setModalDetalle(false);
          }}
          >
          <Icon name="chevron-back-outline" color={'#fff'} size={35} />
        </Pressable>
        <Pressable
          style={{borderRadius:8, backgroundColor:colores.azulClaro}}
          onPress={() => {
            setModalFormRutina(true);
          }}
          >
            <Text style={{color:'#fff', fontSize:16, fontWeight:'900', padding:10}}>Editar</Text>

        </Pressable>

        <Pressable
          style={{borderRadius:8, backgroundColor:colores.verdeOpaco}}
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
            <Text style={{color:'#fff', fontSize:16, fontWeight:'900', padding:10}}>Reiniciar</Text>
        </Pressable>

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
            <Text style={{color:'#fff', fontSize:16, fontWeight:'900', padding:10}}>Eliminar</Text>
        </Pressable>

      </View>

      <View>
        <Text style={styles.titulo}>{copiaRutinaActualizada?.nombre}</Text>
      </View>

      <Text style={styles.tiempo}>
        Tiempo Estimado: {formatearTiempo(copiaRutinaActualizada.tiempo)}
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
