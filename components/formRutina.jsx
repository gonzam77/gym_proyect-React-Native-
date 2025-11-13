import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet, Modal, ScrollView, Alert, Image, Animated } from "react-native";
import FormEjercicio from "./formEjercicio";
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import { agregarRutina } from '../store/rutinasSlice';

const FormRutina = ({setModalFormRutina, rutinaSeleccionada, setRutinaSeleccionada}) => {
    
    const rutinas = useSelector(state=> state.rutinas.rutinas);
    const dispatch = useDispatch();

    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const [modalFormEjercicio, setModalFormEjercicio] = useState(false);
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState();
    const [tiempoEstimado, setTiempoEstimado] = useState(0);
    
    const [nuevaRutina, setNuevaRutina] = useState({
        id: '',
        nombre:'',
        ejercicios:[],
        estado: 0,
        tiempo: 0
    })

    useEffect(() => {
        if (nuevaRutina.ejercicios.length > 0) {
            const tiempoTotalSegundos = nuevaRutina.ejercicios.reduce((acumulador, e) => {
            const tiempoSeries = e.ejercicio.tiempoEjecucion * e.series;
            const tiempoDescanso = e.descanso * e.series * 60;
            return acumulador + tiempoSeries + tiempoDescanso;
            }, 0);

            setTiempoEstimado(tiempoTotalSegundos);
        } else {
            setTiempoEstimado(0);
        }
    }, [nuevaRutina.ejercicios]);

    useEffect(()=>{
        setNuevaRutina({
            ...nuevaRutina,
            tiempo: tiempoEstimado
        });
    },[tiempoEstimado])

    useEffect(() => {
        if (rutinaSeleccionada?.id) {
            setNuevaRutina(rutinaSeleccionada);
        } else {
            setNuevaRutina({
                id: '',
                nombre: '',
                ejercicios: [],
                estado: 0,
                tiempo:0
            });
        }
    }, [rutinaSeleccionada]);

    const formatearTiempo = (segundos) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const seg = segundos % 60;

        return `${horas > 0 ? `${horas}h ` : ''}${minutos}m ${seg.toString().padStart(2, '0')}s`;
    };

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

    const handleChange =(campo, valor) =>{
        setNuevaRutina({
            ...nuevaRutina,
            [campo]:valor
        });
    };

    const editarEjercicio = (id)=>{
        setEjercicioSeleccionado(id);
        setModalFormEjercicio(true);
    }



    const handleGuardar = () => {
        if (!nuevaRutina.nombre.trim()) {
            Alert.alert('Error', 'El nombre de la rutina es obligatorio.');
            return;
        }

        if (rutinaSeleccionada?.id) {
            // Actualizar rutina existente
            dispatch({
                type: 'rutinas/setRutinas',
                payload: rutinas.map(rutina => 
                    rutina.id === rutinaSeleccionada.id ? nuevaRutina : rutina
                )
            });
            setRutinaSeleccionada(nuevaRutina);
        } else {
            // Agregar nueva rutina con id único
            dispatch(agregarRutina({ ...nuevaRutina, id: Date.now() }));
        }

        Toast.show({
            type: 'success',
            text1: '¡Guardado con éxito!',
            text2: 'Tu rutina fue guardada correctamente.',
        });
        
        setTimeout(() => {
            setNuevaRutina({
                id: '',
                nombre: '',
                ejercicios: [],
                estado: 0
            });
            setModalFormRutina(false);
        }, 2000);
        
    };

  
    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 120, flexGrow: 1, minHeight: '120%' }}
            >

                    <View style={styles.botonera}>
                        <Pressable 
                            style={[styles.iconButton,{alignItems:'center'}]}
                            onPress={()=>{
                                setNuevaRutina({
                                    id: '',
                                    nombre:'',
                                    ejercicios:[]
                                });
                                setModalFormRutina(false)
                            }}
                        >
                            <Image style={{width:50,height:50}} source={require('../assets/img/volver.png')}></Image>
                            {/* <Icon name="arrow-back-circle" size={40} color="#eefa07"></Icon> */}
                            {/* <Text style={{color:'#fff',textAlign:'center'}}>Cancelar</Text> */}
                        </Pressable>
                        <Pressable 
                            style={[styles.iconButton,{alignItems:'center'}]}
                            onPress={()=>{
                                handleGuardar();
                            }}
                        >
                            <Image style={{width:60,height:60}} source={require('../assets/img/guardar.png')}></Image>
                            {/* <Icon name="save-sharp" size={35} color="#43d112" ></Icon> */}
                                {/* <Text style={{color:'#fff',textAlign:'center'}}>Guardar</Text> */}
                        </Pressable>
                    </View>
                    
                    <Text style={styles.titulo}>
                        {rutinaSeleccionada?.id ? 'Editar Rutina' : 'Nueva Rutina'}
                    </Text>

                    <Text style={styles.tiempo}>
                        Tiempo Estimado: {formatearTiempo(tiempoEstimado)}
                    </Text>


                    <View style={styles.form}>
                        <Text style={styles.label}>Nombre de la rutina</Text>
                        <TextInput
                        style={styles.input}
                        value={nuevaRutina.nombre}
                        onChangeText={(valor)=>{handleChange('nombre',valor)}}
                        placeholder="Ej: Pecho, piernas, fullbody..."
                        placeholderTextColor="#888"
                        />
                        <View style={[styles.botonera,{flexDirection:'column'}]}>
                            <Pressable 
                                onPressIn={presionarIn}
                                onPressOut={presionarOut}
                                onPress={()=>{
                                    setModalFormEjercicio(true)
                                }}
                            >
                                {/* <Icon name="barbell-sharp" size={30} color="#43d112" /> */}
                                <Animated.Image style={
                                    {
                                        width:80,
                                        height:80,
                                        transform: [{ scale: scaleAnim }]
                                    }} source={require('../assets/img/ejercicio.png')} />


                            </Pressable>
                                {/* <Text style={{color:'#fff',textAlign:'center', marginTop:5}}>Agregar</Text> */}
                        </View>
                    </View>
                    <View style={styles.listaEjercicios}>
                        {
                            nuevaRutina?.ejercicios?.map((e, index) => (
                                <Pressable key={e.id} style={styles.ejercicioItem} onPress={()=>{editarEjercicio(e.id)}}>
                                        <View style={{maxWidth:300}}>
                                            <Text style={styles.ejercicioNombre}>{e.nombre}</Text>
                                            <Text style={styles.ejercicioDetalle}>{e.series} series </Text>
                                        </View>
                                        <View>
                                            <Icon  name="chevron-forward-outline" size={30} color="#fff" />
                                        </View>
                                </Pressable>
                            ))
                        }
                    </View>
        </ScrollView>

                <Modal
                    visible={modalFormEjercicio}
                    animationType="slide"
                    onRequestClose={() =>{
                        setEjercicioSeleccionado(null);
                        setModalFormEjercicio(false);
                    }}
                >
                    <FormEjercicio 
                        nuevaRutina={nuevaRutina}
                        setNuevaRutina={setNuevaRutina}
                        ejercicioSeleccionado={ejercicioSeleccionado}
                        setEjercicioSeleccionado={setEjercicioSeleccionado}
                        modalFormEjercicio={modalFormEjercicio}
                        setModalFormEjercicio={setModalFormEjercicio}
                    /> 
                </Modal>
                <Toast />
            </View>

    );
};

export default FormRutina;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    scroll:{
        backgroundColor:'transparent',
        paddingVertical:50,
        flexGrow:1
    },  
    titulo: {
        fontSize: 30,
        fontWeight: "900",
        color: "#43d112",
        textAlign: "center",
        marginVertical: 15,
    },
    tiempo: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2f95f5ff",
        textAlign: "center",
        marginVertical: 10,
    },
    form: {
        marginVertical: 10,
    },
    label: {
        color: "#eefa07",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    listaEjercicios: {
        marginTop: 10,
        marginBottom: 30,
    },
    ejercicioItem: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor: "#111111",
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
        elevation: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#43d112',
        borderRightWidth: 2,
        borderRightColor: '#43d112',
    },
    ejercicioNombre: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 5,
    },
    ejercicioDetalle: {
        color: "#eefa07",
        fontSize: 16,
        fontWeight: "600",
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
    },

});
