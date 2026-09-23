import { Modal, View, Text, Pressable, StyleSheet, Animated, TextInput } from "react-native";
import { useRef, useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modificarEjercicio } from "../store/rutinasSlice";
import { KeyboardAvoidingView } from "react-native";
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

    // Al cerrar, las animaciones vuelven al inicio: si no, la segunda apertura
    // arrancaba con el cuadro ya visible y sin transicion.
    useEffect(() => {
        if (!visible) {
            fade.setValue(0);
            scale.setValue(0.9);
            return;
        }

        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true })
        ]).start();
    }, [fade, scale, visible]);

    const handleChange = useCallback((valor)=>{
        setNuevaNota(valor)
    }, [])

    const handleGuardar = () => {
        if (!rutinaSeleccionada || !ejercicio) {
            onClose();
            return;
        }

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
            {/*
              behavior="padding" en las dos plataformas a proposito. Con "height",
              KeyboardAvoidingView calcula el alto nuevo sumando el desplazamiento
              anterior (state.bottom + frame.y + frame.height - keyboardY): si llega
              un evento del teclado antes de que el layout previo se asiente, ese
              desplazamiento se acumula, el cuadro se achica, eso dispara otro
              layout y arranca el bucle. Era el "loop" al editar la nota.
              "padding" calcula el desplazamiento solo a partir del frame, asi que
              no se realimenta.

              El Modal usa navigationBarTranslucent, que apaga el fitsSystemWindows
              de su ventana: el dialogo NO se achica solo con el teclado, por eso el
              KeyboardAvoidingView sigue haciendo falta.
            */}
            <KeyboardAvoidingView
                behavior="padding"
                style={styles.overlay}
            >
                <Animated.View style={[
                    styles.box,
                    { opacity: fade, transform: [{ scale: scale }] }
                ]}>
                    <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>Nota</Text>

                    {/*
                      Sin ScrollView y con alto acotado: un TextInput multiline ya
                      scrollea solo. Antes el input crecia con el texto dentro de un
                      contenedor flexGrow, el cuadro se re-media en cada tecla y eso
                      realimentaba el ajuste del teclado.
                    */}
                    <TextInput
                        multiline
                        textAlignVertical="top"
                        placeholder="Peso estimado, repeticiones estimadas"
                        value={nuevaNota}
                        onChangeText={handleChange}
                        style={styles.input}
                        placeholderTextColor={colores.textoTenue}
                        maxFontSizeMultiplier={maxEscalaFuente}
                        accessibilityLabel="Nota del ejercicio"
                    />

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

// Memoizado: en Descanso el contador re-renderiza el arbol 4 veces por segundo.
// Sin esto cada tick volvia a renderizar el Modal (y su ventana nativa) justo
// mientras se escribia la nota.
export default memo(FormNota);

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
        minHeight: 96,
        maxHeight: 160,
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
