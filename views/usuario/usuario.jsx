import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { guardarUsuario } from "../../store/usuarioSlice";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/usuarioStyles";

const Usuario = ()=>{

    const navigation = useNavigation();

    const [usuario, setUsuario] = useState({
        nombre:""
    });

    const usarioRegistrado = useSelector(state=> state.usuario.usuario)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(usarioRegistrado.nombre) setUsuario(usarioRegistrado);
    },[usarioRegistrado]);

    const validacion = ()=>{
        if(!usuario.nombre?.trim()){
            Alert.alert('Debe ingresar un nombre válido.');
        } else {
            guardar();
        }
    };

    const handleChange = (campo, value)=>{
            setUsuario({
                ...usuario,
                [campo]: value
            });
    };

    const guardar = () => {
        dispatch(guardarUsuario(usuario));
        navigation.navigate('MisRutinas')  
    };

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Ingrese su nombre</Text>
            <TextInput
                placeholder="Nombre..."
                value={usuario.nombre}
                onChangeText={(valor)=>{handleChange('nombre',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Pressable
                style={styles.btn}
                onPress={validacion}
            >
                <Text style={styles.btnTexto}>
                    GUARDAR
                </Text>
            </Pressable>
        </View>
    )

};

export default Usuario;