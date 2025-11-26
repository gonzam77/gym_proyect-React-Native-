import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { colores } from '../../styles/colores'
import { agregarComentario } from "../../store/notasHistoricasSlice";
import Icon from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';

const FormComentario = ({ idNota, comentarioSeleccionado, setComentarioSeleccionado, setFormComentarioModal }) => {

    const nuevaFecha = Date.now();
    const dispatch = useDispatch();
    
    const [comentario, setComentario] = useState({
        id: uuid.v4(),
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
        <View>
            <Pressable
                onPress={()=>{
                    setFormComentarioModal(false);
                    setComentarioSeleccionado({});
                }}
                style={{marginTop:20,marginLeft:10,}}
            >
                <Icon name="chevron-back-outline" color={'#000'} size={25}></Icon>
                
            </Pressable>

            <TextInput
                multiline
                placeholder="Escriba lo que desee..."
                placeholderTextColor={'#6e6e6e'}
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


const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    input:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        minHeight: 100,
        margin:30

    },
    btn:{
        backgroundColor:colores.fondoBtn2,
        marginHorizontal:30,
        padding:10,
        borderRadius:10

    },
    btnText:{
        textAlign:'center',
        color:'#fff',
        fontSize:18,
        fontWeight:'600',        
    },
})