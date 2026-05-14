import { Modal, Pressable, Text, View, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import FormRutina from "./formRutina";
import DetalleEjercicio from "./detalleEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import formatearTiempo from '../../helpers/formatearTiempo';
import { styles } from '../../styles/detalleRutinaStyles';
import { eliminarRutina, reiniciarRutina, reordenarEjercicio } from "../../store/rutinasSlice";
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
  
  const moverEjercicio = (indexActual, direccion) => {
    if (!copiaRutinaActualizada?.id) {
      return;
    }

    dispatch(reordenarEjercicio({
      idRutina: copiaRutinaActualizada.id,
      indexActual,
      direccion,
    }));
  };

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
                  <View style={styles.actionsContainer}>
                    <View style={styles.reorderButtonsContainer}>
                      <Pressable
                        style={[styles.reorderButton, index === 0 && styles.reorderButtonDisabled]}
                        disabled={index === 0}
                        onPress={(event) => {
                          event.stopPropagation();
                          moverEjercicio(index, -1);
                        }}
                      >
                        <Icon name="chevron-up-outline" size={18} color="#fff" />
                      </Pressable>
                      <Pressable
                        style={[
                          styles.reorderButton,
                          index === copiaRutinaActualizada.ejercicios.length - 1 && styles.reorderButtonDisabled,
                        ]}
                        disabled={index === copiaRutinaActualizada.ejercicios.length - 1}
                        onPress={(event) => {
                          event.stopPropagation();
                          moverEjercicio(index, 1);
                        }}
                      >
                        <Icon name="chevron-down-outline" size={18} color="#fff" />
                      </Pressable>
                    </View>
                    <Icon name="chevron-forward-outline" color={'#fff'} size={25} />
                  </View>
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
