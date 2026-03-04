import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { agregarComentario } from "../../store/notasHistoricasSlice";
import Icon from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';
import styles from "../../styles/formComentarioStyles";
import { colores } from "../../styles/colores";

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

    const handleGuardar = ()=>{
        dispatch(agregarComentario({idNota, comentario}));
        setComentarioSeleccionado({});
        setComentario({});
        setFormComentarioModal(false);
    };

    return (
        <View style={{flex:1, backgroundColor:colores.azulProfundo}}>
            <Pressable
                onPress={()=>{
                    setFormComentarioModal(false);
                    setComentarioSeleccionado({});
                }}
                style={{marginTop:20,marginLeft:10,}}
            >
                <Icon name="chevron-back-outline" color={'#fff'} size={25}></Icon>
                
            </Pressable>

            <Text style={styles.titulo}>{idNota ? 'Editar Comentario' : 'Nuevo Comentario' }</Text>

            <TextInput
                multiline
                placeholder="Escriba lo que desee..."
                placeholderTextColor={'#ccc'}
                onChangeText={(valor)=>handeChange('nota',valor)}
                numberOfLines={10}
                style={styles.input}
                value={comentario.nota}
            />

            <Pressable
                style={styles.btn}
                onPress={handleGuardar}
            >
                <Text
                    style={styles.btnText}
                >Enviar</Text>
            </Pressable>
        </View>
    )
};

export default FormComentario;