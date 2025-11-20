import { useState } from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/formNotaDiarioStyles";


const FormNotasDiario = () => {

    const dispatch = useDispatch();

    const [comentario, setComentario] = useState({
        id,
        fecha,
        nota:'',
    });

    const handleChange = (campo,value)=>{
        setComentario({
            ...comentario,
            [campo]:value
        });
    };

    const handleGuardar = () => {

    }

    return (
        <View>
            <Text>
                Nueva Nota
            </Text>
            <Text
                style={styles.label}
            >Nota</Text>
            <TextInput
                editable
                multiline
                numberOfLines={6}
                maxLength={500}
                placeholder="Que piensas?..."
                placeholderTextColor={'#5e5c5cff'}
                value={comentario.nota}
                onChangeText={(valor)=>handleChange('nota', valor)}
                style={styles.input}
            ></TextInput>
            <Pressable
                style={styles.btnGuardar}
                onPress={handleGuardar}
            >
                <Text
                    style={styles.btnTexto}
                >Guardar Nota</Text>
            </Pressable>
        </View>
    )
}

export default FormNotasDiario;