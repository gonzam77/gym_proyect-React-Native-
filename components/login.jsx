import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { guardarUsuario } from "../store/rutinasSlice";

const login = ({setLogin})=>{

    const [usuario, setUsuario] = useState({
        nombre:""
    });

    const usarioRegistrado = useSelector(state=> state.rutinas.usuario)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(usarioRegistrado.nombre) setUsuario(usarioRegistrado);
    },[usarioRegistrado])

    const handleChange = (campo, value)=>{
        if(value){
            setUsuario({
                ...usuario,
                [campo]: value
            });
        }
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
                onPress={guardar}
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

    },
    label:{

    },
    input:{

    },
    btnTexto:{

    }

})