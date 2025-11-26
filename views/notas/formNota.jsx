import { useEffect, useState } from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/formNotaStyles";
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import { agregarNotas, modificarNota } from "../../store/notasHistoricasSlice";


const FormNota = ({ notaSeleccionada, setFormModal }) => {

    const dispatch = useDispatch();

    const [nota, setNota] = useState({
        id:uuid.v4(),
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
    
    const handleGuardar = () => {
        
        if(notaSeleccionada?.id){
            dispatch(modificarNota({
                id: nota.id,
                titulo:nota.titulo
            }))
        }else {
            dispatch(agregarNotas(nota));
        };

        setFormModal(false);
    }

    return (
        <View style={styles.container}>
            <Pressable
                onPress={()=>setFormModal(false)}
                style={{marginTop:20,marginLeft:10,}}
            >
                <Icon name="chevron-back-outline" color={'#000'} size={25}></Icon>
                
            </Pressable>
            <Text style={styles.titulo}>
                Nueva Nota
            </Text>
            <View style={styles.form}>
                <Text
                    style={styles.label}
                >Titulo</Text>
                <TextInput
                    placeholder="Titulo..."
                    placeholderTextColor={'#5e5c5cff'}
                    value={nota.titulo}
                    onChangeText={(valor)=>handleChange('titulo', valor)}
                    style={styles.input}
                />
                </View>
            <Pressable
                style={styles.btn}
                onPress={handleGuardar}
            >
                <Text
                    style={styles.btnTexto}
                >Guardar Nota</Text>
            </Pressable>
        </View>
    )
}

export default FormNota;