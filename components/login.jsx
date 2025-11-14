import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { guardarUsuario } from "../store/rutinasSlice";
import { colores } from "../styles/colores";

const login = ({setLogin})=>{

    const [usuario, setUsuario] = useState({
        nombre:""
    });

    const usarioRegistrado = useSelector(state=> state.rutinas.usuario)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(usarioRegistrado.nombre) setUsuario(usarioRegistrado);
    },[usarioRegistrado]);

    const validacion = ()=>{
        if(usuario.nombre.length === 0 || !usuario.nombre){
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
        setLogin(false);  
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

export default login;


const styles = StyleSheet.create({
    container:{
        display:'flex',
        backgroundColor: '#000',
        flex:1,
    },
    label:{
        fontSize:30,
        color:"#fff",
        textAlign:'center',
        marginTop:50,
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