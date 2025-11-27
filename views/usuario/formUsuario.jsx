import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { guardarUsuario } from "../../store/usuarioSlice";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/usuarioStyles";

const FormUsuario = ({ usuario, formModal })=>{

    const navigation = useNavigation();

    const [nuevoUsuario, setNuevoUsuario] = useState({
        id:'',
        nombre:"",
        correo:"",
        edad:"",
        altura:"",
        peso:"",
        genero:"",
        objetivos:"",
        disponibilidad:"",
    });

    const dispatch = useDispatch();

    useEffect(()=>{
        if(usuario.id) {
            const copiaUsuario = JSON.parse(JSON.stringify(usuario));
            setNuevoUsuario(copiaUsuario);
        }
    },[usuario]);

    const validacion = ()=>{
        if(!nuevoUsuario.nombre?.trim()){
            Alert.alert('Debe ingresar un nombre válido.');
        } else {
            guardar();
        }
    };

    const handleChange = (campo, value)=>{
            setNuevoUsuario({
                ...nuevoUsuario,
                [campo]: value
            });
    };

    const guardar = () => {
        dispatch(guardarUsuario(nuevoUsuario));
        navigation.navigate('Perfil')  
    };

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Ingrese su nombre</Text>
            <TextInput
                placeholder="Nombre..."
                value={nuevoUsuario.nombre}
                onChangeText={(valor)=>{handleChange('nombre',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Ingrese su correo</Text>
            <TextInput
                placeholder="Correo..."
                value={nuevoUsuario.correo}
                onChangeText={(valor)=>{handleChange('correo',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Ingrese su edad</Text>
            <TextInput
                placeholder="Edad..."
                value={nuevoUsuario.edad}
                onChangeText={(valor)=>{handleChange('edad',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Ingrese su altura en cm</Text>
            <TextInput
                placeholder="175..."
                value={nuevoUsuario.altura}
                onChangeText={(valor)=>{handleChange('altura',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Ingrese su peso en kg.</Text>
            <TextInput
                placeholder="65..."
                value={nuevoUsuario.peso}
                onChangeText={(valor)=>{handleChange('peso',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Ingrese su genero</Text>
            <TextInput
                placeholder="Masculino/Femenino/No especificar..."
                value={nuevoUsuario.genero}
                onChangeText={(valor)=>{handleChange('genero',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Objetivos</Text>
            <TextInput
                placeholder="Hipertrofia/Perdida de peso/Ganancia de peso..."
                value={nuevoUsuario.objetivos}
                onChangeText={(valor)=>{handleChange('objetivos',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Text style={styles.label}>Disponibilidad Semanal</Text>
            <TextInput
                placeholder="1, 2, 3, 4, 5, 6, 7...."
                value={nuevoUsuario.disponibilidad}
                onChangeText={(valor)=>{handleChange('disponibilidad',valor)}}
                style={styles.input}
                placeholderTextColor='#888'
            ></TextInput>
            <Pressable
                style={styles.btn}
                onPress={validacion}
            >
                <Text style={styles.btnTexto}>
                    GUARDAR CAMBIOS
                </Text>
            </Pressable>
        </View>
    )

};

export default FormUsuario;