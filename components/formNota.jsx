import { Modal, View, Text, Pressable, StyleSheet, Animated, TextInput, ScrollView } from "react-native";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modificarEjercicio } from "../store/rutinasSlice";


const FormNota = ({onClose, visible, ejercicio})=> {
    
    console.log('ejercicio',ejercicio);
    
    const [nuevaNota, setNuevaNota] = useState('');

    const dispatch = useDispatch();

    const rutinas = useSelector(state => state.rutinas.rutinas);

    const rutinaSeleccionada = rutinas.find(rutina => rutina.ejercicios.some(e => e.id === ejercicio?.id))

    console.log('rutinaSeleccionada',rutinaSeleccionada);
    
    const fade = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(()=>{
        if(ejercicio.nota)setNuevaNota(ejercicio.nota);
    },[ejercicio.nota])

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true })
            ]).start();
        }
    }, [visible]);

    const handleChange = (valor)=>{
        setNuevaNota(valor)
    }

    const handleGuardar = () => {
        dispatch(modificarEjercicio({
            idRutina: rutinaSeleccionada.id,
            idEjercicio: ejercicio.id,
            cambios: {
                nota: nuevaNota
            }
        }))
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Animated.View style={[
                    styles.box,
                    { opacity: fade, transform: [{ scale: scale }] }
                ]}>
                    <Text style={styles.titulo}>Nota</Text>
                   <ScrollView>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            placeholder="Peso estimado, repeticiones estimadas"
                            value={nuevaNota}
                            onChangeText={(valor)=>{handleChange(valor)}}
                            style={[styles.input,{minHeight:80}]}
                            placeholderTextColor='#888'
                        ></TextInput>
                    </ScrollView> 

                    <View style={styles.btnRow}>
                        <Pressable style={[styles.btn, styles.cancelar]} onPress={onClose}>
                            <Text style={styles.txtCancelar}>Cancelar</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.btn, styles.editar]} onPress={handleGuardar}>
                            <Text style={styles.txtEditar}>Guardar</Text>
                        </Pressable>
{/* 
                        <Pressable style={[styles.btn, styles.editar]} onPress={onEditar}>
                            <Text style={styles.txtEditar}>Editar</Text>
                        </Pressable>

                        <Pressable style={[styles.btn, styles.eliminar]} onPress={onEliminar}>
                            <Text style={styles.txtEliminar}>Eliminar</Text>
                        </Pressable> */}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

export default FormNota;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center"
    },
    box: {
        width: 260,
        backgroundColor: "#000",
        borderRadius: 15,
        padding: 18,
        elevation: 6,
        minWidth:'80%',
        minHeight:'30%',
        borderWidth:2,
        borderColor:'#43d112'
    },
    titulo: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        textAlign: "center",
        marginBottom: 6
    },
    subtitulo: {
        textAlign: "center",
        color: "#555",
        marginBottom: 10
    },
    btnRow: {
        flexDirection: "row",
        flex:1,
        justifyContent: "space-between",
        alignItems:'flex-end',
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10
    },
    input:{
        backgroundColor:'#fff',
        borderRadius:5,
        paddingLeft:10
    },
    cancelar: { backgroundColor: "#eefa07" },
    editar: { backgroundColor: "#43d112" },
    eliminar: { backgroundColor: "#bd1515" },
    txtCancelar: { color: "#000", fontWeight: "700" },
    txtEditar: { color: "#000", fontWeight: "700" },
    txtEliminar: { color: "#fff", fontWeight: "700" },
});
