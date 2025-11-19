import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { guardarUsuario } from "../store/usuarioSlice";
import { colores } from "../styles/colores";
import { useNavigation } from "@react-navigation/native";

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
        // setLogin(false);
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


const styles = StyleSheet.create({
    container:{
        backgroundColor: '#000',
        flex:1,
        justifyContent:'center'
    },
    label:{
        fontSize:30,
        color:"#fff",
        textAlign:'center',
    },
    input:{
        backgroundColor:'#fff',
        color:'#000',
        margin:20,
        borderRadius:5,
        fontSize:15,
    },
    btn:{
        backgroundColor:colores.detalle,
        margin:20,
        borderRadius:5,
    },
    btnTexto:{
        fontSize:15,
        padding:10,
        textAlign:'center',
        fontWeight:600,
        color:colores.principal,
    }

})