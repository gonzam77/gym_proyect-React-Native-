import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, Modal, ScrollView, Alert, Animated } from "react-native";
import FormEjercicio from "./formEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from "react-redux";
import { agregarRutina, setRutinas } from '../../store/rutinasSlice';
import formatearTiempo from '../../helpers/formatearTiempo';
import { styles } from '../../styles/formRutinaStyles';
import { BotonGuardar, BotonVolver } from "../../components/botones/botones";
import uuid from 'react-native-uuid';

const FormRutina = ({setModalFormRutina, rutinaSeleccionada, setRutinaSeleccionada}) => {
    
    const dispatch = useDispatch();

    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const [modalFormEjercicio, setModalFormEjercicio] = useState(false);
    const [estaDeshabilitado, setEstaDeshabilitado] = useState(false);
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState();
    const [tiempoEstimado, setTiempoEstimado] = useState(0);
    
    const [nuevaRutina, setNuevaRutina] = useState({
        id: '',
        nombre:'',
        ejercicios:[],
        estado: 0,
        tiempo: 0
    })

    const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

    //Calcula el tiempo estimado de la rutina
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

    //Setea el tiempo estimado de la rutina
    useEffect(()=>{
        setNuevaRutina({
            ...nuevaRutina,
            tiempo: tiempoEstimado
        });
    },[tiempoEstimado])

    //Revisa si va a editar o a crear una rutina nueva
    useEffect(() => {
        if (rutinaSeleccionada?.id) {
            setNuevaRutina(JSON.parse(JSON.stringify(rutinaSeleccionada)));
        } else {
            setNuevaRutina({
                id: generarId(),
                nombre: '',
                ejercicios: [],
                estado: 0,
                tiempo:0
            });
        }
    }, [rutinaSeleccionada]);

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
            setEstaDeshabilitado(false);
            return;
        }

        if (rutinaSeleccionada?.id) {
            dispatch(setRutinas(nuevaRutina))
            setRutinaSeleccionada(nuevaRutina);
        } else {
            dispatch(agregarRutina(nuevaRutina));
        }

        setNuevaRutina({});
        setModalFormRutina(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 120, flexGrow: 1, minHeight: '120%' }}
            >

                <View style={styles.botonera}>
                    <BotonVolver
                        onPress={()=>{
                            setNuevaRutina({});
                            setModalFormRutina(false)
                        }}
                    />
                    <BotonGuardar
                        estaDeshabilitado={estaDeshabilitado}
                        onPress={()=>{
                            setEstaDeshabilitado(true);
                            handleGuardar();
                        }}
                    />
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
                    placeholder="Ej: Pecho, Piernas, Fullbody..."
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
                            <Animated.Image style={
                                {
                                    width:80,
                                    height:80,
                                    transform: [{ scale: scaleAnim }]
                                }} source={require('../../assets/img/ejercicio.png')} />

                        </Pressable>
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
        </View>

    );
};

export default FormRutina;
