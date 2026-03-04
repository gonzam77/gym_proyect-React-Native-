import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Alert, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from "react-redux";
import { guardarUsuario } from "../../store/usuarioSlice";
import styles from "../../styles/usuarioStyles";
import { SelectList } from "react-native-dropdown-select-list";
import disponibilidades from '../../helpers/disponibilidades';

const FormUsuario = ({ usuario, setFormModal })=>{

    const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

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

    const defaultOptionGenero = usuario
    ? { key: usuario.id, value: usuario.genero }
    : undefined; 

    const defaultOptionDispo = usuario
    ? { key: usuario.id, value: usuario.disponibilidad }
    : undefined; 

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

    const handleChange = (campo, valor)=>{
        setNuevoUsuario(prev =>( {
            ...prev,
            [campo]: valor
        }));
    };

    const handleSelectList = (campo , valor)=>{
        setNuevoUsuario(prev =>( {
            ...prev,
            [campo]: valor
        }));
    }

    const guardar = () => {
        dispatch(guardarUsuario(nuevoUsuario));
        setFormModal(false);
    };

    return(
        <View style={styles.container}>
            <Pressable
                    onPress={()=>{
                        setFormModal(false);
                    }}
                    style={{marginTop:20,marginLeft:10,}}
                >
                    <Icon name="chevron-back-outline" color={'#fff'} size={25}></Icon>
                    
            </Pressable>
            <Text style={styles.titulo}>Perfil</Text>
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
                <SelectList
                    setSelected={(valor)=>handleSelectList('genero', valor)}
                    data={[{key:1, value:'Masculino'},{ key:2, value:'Femenino'},{ key:3, value:'Otro'}]}
                    save='value'
                    placeholder="Seleccione genero..."
                    search={false}
                    boxStyles={{marginHorizontal:15, marginVertical:10, backgroundColor:'#fff'}}
                    inputStyles={{color:'#000'}}
                    dropdownStyles={{marginHorizontal:15, backgroundColor:'#fff'}}
                    dropdownTextStyles={{color:'#000'}}
                    defaultOption={defaultOptionGenero}
                />
                <Text style={styles.label}>Disponibilidad Semanal</Text>
                <SelectList
                    setSelected={(valor)=>handleSelectList('disponibilidad', valor)}
                    data={disponibilidades}
                    save='value'
                    placeholder="Seleccione la disponibilidad"
                    search={false}
                    boxStyles={{marginHorizontal:15, marginVertical:10, backgroundColor:'#fff'}}
                    inputStyles={{color:'#000'}}
                    dropdownStyles={{marginHorizontal:15, backgroundColor:'#fff'}}
                    dropdownTextStyles={{color:'#000'}}
                    defaultOption={defaultOptionDispo}
                />
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