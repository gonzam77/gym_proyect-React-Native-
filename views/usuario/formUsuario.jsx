import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Alert, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { guardarUsuario } from "../../store/usuarioSlice";
import styles from "../../styles/usuarioStyles";

const FormUsuario = ({ usuario, setFormModal })=>{

    const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

    console.log('form', usuario);
    
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
        if(usuario.nombre) {
            setNuevoUsuario(usuario);
        } else {
            setNuevoUsuario({
                ...nuevoUsuario,
                id: generarId(),
            })
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
        setFormModal(false)
    };

    return(
        <View style={styles.container}>
            <ScrollView style={{marginTop:20}}>

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
                <Text style={styles.label}>Disponibilidad Semanal</Text>
                <TextInput
                    placeholder="1 dia, 2 dias, 3 dias a la semana..."
                    value={nuevoUsuario.disponibilidad}
                    onChangeText={(valor)=>{handleChange('disponibilidad',valor)}}
                    style={styles.input}
                    placeholderTextColor='#888'
                ></TextInput>
                <Text style={styles.label}>Objetivos</Text>
                <TextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Hipertrofia/Perdida de peso/Ganancia de peso..."
                    value={nuevoUsuario.objetivos}
                    onChangeText={(valor)=>{handleChange('objetivos',valor)}}
                    style={[styles.input,{minHeight:80}]}
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
            </ScrollView>
        </View>
    )

};

export default FormUsuario;