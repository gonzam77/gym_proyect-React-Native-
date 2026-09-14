import { useEffect, useState } from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import styles from "../../styles/notasStyles";
import Icon from 'react-native-vector-icons/Ionicons';
import PantallaModal from "../../components/PantallaModal";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { avisoExito } from "../../helpers/avisos";
import { agregarNotas, modificarNota } from "../../store/notasHistoricasSlice";


const FormNota = ({ notaSeleccionada, setFormModal, setNotaSeleccionada }) => {

    const dispatch = useDispatch();

    const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

    const [nota, setNota] = useState({
        id: generarId(),
        titulo:'',
        tipo:'texto',
        notas:[],
    });

    useEffect(()=>{
        if(notaSeleccionada?.id) setNota(notaSeleccionada);
    },[notaSeleccionada])

    const handleChange = (campo,value)=>{
        setNota({
            ...nota,
            [campo]:value
        });
    };

    const esEdicion = Boolean(notaSeleccionada?.id);
    const sinTitulo = !nota.titulo?.trim();

    const cerrar = () => {
        setFormModal(false);
        setNotaSeleccionada({});
    };

    const handleGuardar = () => {
        if (sinTitulo) {
            return;
        }

        if(esEdicion){
            dispatch(modificarNota({
                id: nota.id,
                titulo:nota.titulo
            }))
        }else {
            dispatch(agregarNotas(nota));
        };

        avisoExito(esEdicion ? 'Sección actualizada' : 'Sección creada');
        cerrar();
    }

    return (
        <PantallaModal>
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
                    { esEdicion ? 'Editar sección' : 'Nueva sección' }
                </Text>
            </View>

            <View style={[styles.form, { marginTop: 24 }]}>
                <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Título</Text>
                <TextInput
                    placeholder="Ej: Peso muerto, sensaciones, medidas..."
                    placeholderTextColor={colores.textoTenue}
                    value={nota.titulo}
                    onChangeText={(valor)=>handleChange('titulo', valor)}
                    style={styles.input}
                    autoFocus={!esEdicion}
                    returnKeyType="done"
                    onSubmitEditing={handleGuardar}
                    maxFontSizeMultiplier={maxEscalaFuente}
                />
            </View>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel={esEdicion ? 'Guardar los cambios' : 'Crear la sección'}
                style={({ pressed }) => [
                    styles.botonGuardar,
                    (sinTitulo || pressed) && styles.botonGuardarDeshabilitado,
                ]}
                disabled={sinTitulo}
                onPress={handleGuardar}
            >
                <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
                <Text style={styles.btnTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                    {esEdicion ? 'Guardar' : 'Crear sección'}
                </Text>
            </Pressable>
        </PantallaModal>
    )
}

export default FormNota;
