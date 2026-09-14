import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { agregarComentario } from "../../store/notasHistoricasSlice";
import Icon from 'react-native-vector-icons/Ionicons';
import styles from "../../styles/notasStyles";
import PantallaModal from "../../components/PantallaModal";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { avisoExito } from "../../helpers/avisos";

const FormComentario = ({ idNota, comentarioSeleccionado, setComentarioSeleccionado, setFormComentarioModal }) => {

    const nuevaFecha = Date.now();
    const dispatch = useDispatch();

    const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

    const [comentario, setComentario] = useState({
        id: generarId(),
        fecha: nuevaFecha,
        nota:'',
    });

    useEffect(()=>{
        if(comentarioSeleccionado?.id)setComentario(comentarioSeleccionado);
    },[comentarioSeleccionado])


    const handeChange = (campo, valor) => {
        setComentario({
            ...comentario,
            [campo]: valor
        })
    };

    const esEdicion = Boolean(comentarioSeleccionado?.id);
    const sinTexto = !comentario.nota?.trim();

    const cerrar = () => {
        setFormComentarioModal(false);
        setComentarioSeleccionado({});
    };

    const handleGuardar = ()=>{
        if (sinTexto) {
            return;
        }

        dispatch(agregarComentario({idNota, comentario}));
        avisoExito(esEdicion ? 'Nota actualizada' : 'Nota guardada');
        setComentarioSeleccionado({});
        setComentario({});
        setFormComentarioModal(false);
    };

    return (
        <PantallaModal>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.encabezado}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Volver sin guardar"
                        hitSlop={8}
                        style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
                        onPress={cerrar}
                    >
                        <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
                    </Pressable>
                    <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
                        {esEdicion ? 'Editar nota' : 'Nueva nota'}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.form}>
                        <TextInput
                            multiline
                            placeholder="Escribí lo que quieras registrar..."
                            placeholderTextColor={colores.textoTenue}
                            onChangeText={(valor)=>handeChange('nota',valor)}
                            style={[styles.input, styles.inputMultilinea]}
                            value={comentario.nota}
                            autoFocus={!esEdicion}
                            maxFontSizeMultiplier={maxEscalaFuente}
                        />
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={esEdicion ? 'Guardar los cambios' : 'Guardar la nota'}
                        style={({ pressed }) => [
                            styles.botonGuardar,
                            (sinTexto || pressed) && styles.botonGuardarDeshabilitado,
                        ]}
                        disabled={sinTexto}
                        onPress={handleGuardar}
                    >
                        <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
                        <Text style={styles.btnTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                            Guardar
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </PantallaModal>
    )
};

export default FormComentario;
