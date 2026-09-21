import { Modal, View, Text, Pressable, StyleSheet, Animated, TextInput, ScrollView } from "react-native";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modificarEjercicio } from "../store/rutinasSlice";
import { KeyboardAvoidingView, Platform } from "react-native";
import { colores } from "../styles/colores";
import { espaciado, maxEscalaFuente, radios, sombras, tipografia, toqueMinimo } from "../styles/theme";
import { avisoExito } from "../helpers/avisos";


const FormNota = ({onClose, visible, ejercicio})=> {

    const [nuevaNota, setNuevaNota] = useState('');

    const dispatch = useDispatch();

    const rutinas = useSelector(state => state.rutinas.rutinas);

    const rutinaSeleccionada = rutinas.find(rutina => rutina.ejercicios.some(e => e.id === ejercicio?.id))

    const fade = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    // La nota se recarga cada vez que se abre el modal. Antes solo se copiaba
    // cuando habia nota guardada, asi que un texto tipeado y cancelado volvia a
    // aparecer como borrador la proxima vez que se abria.
    useEffect(()=>{
        if(visible) setNuevaNota(ejercicio?.nota ?? '');
    },[ejercicio?.nota, visible])

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true })
            ]).start();
        }
    }, [fade, scale, visible]);

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
        avisoExito('Nota guardada');
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <Animated.View style={[
                    styles.box,
                    { opacity: fade, transform: [{ scale: scale }] }
                ]}>
                    <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>Nota</Text>

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
                                placeholderTextColor={colores.textoTenue}
                                maxFontSizeMultiplier={maxEscalaFuente}
                                accessibilityLabel="Nota del ejercicio"
                            />
                        </ScrollView>
                    </View>

                    <View style={styles.btnRow}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Cancelar"
                            style={({ pressed }) => [styles.btn, styles.cancelar, pressed && styles.presionado]}
                            onPress={onClose}
                        >
                            <Text style={styles.txtCancelar} maxFontSizeMultiplier={maxEscalaFuente}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Guardar la nota"
                            style={({ pressed }) => [styles.btn, styles.editar, pressed && styles.presionado]}
                            onPress={handleGuardar}
                        >
                            <Text style={styles.txtEditar} maxFontSizeMultiplier={maxEscalaFuente}>
                                Guardar
                            </Text>
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
        paddingHorizontal: espaciado.xl,
    },
    box: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: colores.superficie,
        borderRadius: radios.xl,
        padding: espaciado.xl,
        minHeight: 220,
        borderWidth: 1,
        borderColor: colores.borde,
        ...sombras.flotante,
    },
    titulo: {
        ...tipografia.titulo,
        color: colores.textoPrimario,
        textAlign: "center",
        marginBottom: espaciado.md,
        textTransform: "uppercase",
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: espaciado.lg,
        gap: espaciado.md,
    },
    btn: {
        flex: 1,
        minHeight: toqueMinimo,
        paddingHorizontal: espaciado.lg,
        borderRadius: radios.md,
        alignItems: "center",
        justifyContent: "center",
    },
    presionado: {
        opacity: 0.75,
    },
    input: {
        backgroundColor: colores.fondo,
        color: colores.textoPrimario,
        borderRadius: radios.md,
        paddingHorizontal: espaciado.md,
        paddingVertical: espaciado.md,
        borderWidth: 1,
        borderColor: colores.borde,
        fontSize: 16,
    },
    cancelar: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colores.borde,
    },
    editar: {
        backgroundColor: colores.exito,
    },
    txtCancelar: {
        ...tipografia.cuerpoFuerte,
        color: colores.textoSecundario,
    },
    txtEditar: {
        ...tipografia.cuerpoFuerte,
        color: colores.sobreRelleno,
    },
});
