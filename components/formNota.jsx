import { Modal, View, Text, Pressable, StyleSheet, Animated, TextInput, ScrollView } from "react-native";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modificarEjercicio } from "../store/rutinasSlice";
import { KeyboardAvoidingView, Platform } from "react-native";
import { colores } from "../styles/colores";


const FormNota = ({onClose, visible, ejercicio})=> {
    
    const [nuevaNota, setNuevaNota] = useState('');

    const dispatch = useDispatch();

    const rutinas = useSelector(state => state.rutinas.rutinas);

    const rutinaSeleccionada = rutinas.find(rutina => rutina.ejercicios.some(e => e.id === ejercicio?.id))

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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <Animated.View style={[
                    styles.box,
                    { opacity: fade, transform: [{ scale: scale }] }
                ]}>
                    <Text style={styles.titulo}>Nota</Text>
                    
                   <View style={{ flexGrow: 1 }}>
                        <ScrollView keyboardShouldPersistTaps="handled">
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
                    </View>

                    <View style={styles.btnRow}>
                        <Pressable style={[styles.btn, styles.cancelar]} onPress={onClose}>
                            <Text style={styles.txtCancelar}>Cancelar</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.btn, styles.editar]} onPress={handleGuardar}>
                            <Text style={styles.txtEditar}>Guardar</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default FormNota;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(8, 12, 20, 0.72)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    box: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: colores.azulProfundoClaro,
        borderRadius: 24,
        padding: 18,
        elevation: 6,
        minHeight: 220,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
    },
    titulo: {
        fontSize: 24,
        fontWeight: "800",
        color: colores.blanco,
        textAlign: "center",
        marginBottom: 12,
        textTransform: "uppercase",
    },
    subtitulo: {
        textAlign: "center",
        color: "#555",
        marginBottom: 10
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        gap: 10,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        minWidth: 110,
        alignItems: "center",
    },
    input:{
        backgroundColor: colores.azulProfundo,
        color: colores.blanco,
        borderRadius: 12,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    cancelar: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.35)",
    },
    editar: { backgroundColor: colores.verdeOpaco },
    eliminar: { backgroundColor: "#bd1515" },
    txtCancelar: { color: colores.blanco, fontWeight: "700" },
    txtEditar: { color: colores.blanco, fontWeight: "700" },
    txtEliminar: { color: "#fff", fontWeight: "700" },
});
