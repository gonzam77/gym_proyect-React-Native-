import React, { useState } from "react";
import { View, Text, Pressable, Modal, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FormUsuario from "./formUsuario";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/perfilStyles";
import { cerrarSesion } from "../../store/usuarioSlice";

const Perfil = () => {

    const [formModal, setFormModal] = useState(false);

    const dispatch = useDispatch();
    const usuario = useSelector(state => state.usuario.usuario);
    const sesion = useSelector(state => state.usuario.sesion);
    const usuarioBackend = sesion?.user;

    const confirmarCerrarSesion = () => {
        Alert.alert(
            "Cerrar sesion",
            "Desea cerrar la sesion actual?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar sesion",
                    style: "destructive",
                    onPress: () => dispatch(cerrarSesion()),
                },
            ],
        );
    };
    

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.card}>
            <Pressable
                onPress={()=>setFormModal(true)}
            >

                <View style={{alignSelf:'flex-end'}}>
                    <Icon name="pencil-outline" size={25}></Icon>
                </View>
            </Pressable>

            {/* Foto o icono */}
            <View style={styles.header}>
                <Icon name="person-circle-outline" size={80} color="#4A90E2" />
                <Text style={styles.nombre}>{usuario.nombre || usuarioBackend?.username || "Usuario"}</Text>
            </View>

            {/* Datos */}
            <View style={styles.row}>
                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.value}>{usuario.correo || usuarioBackend?.email || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Edad:</Text>
                <Text style={styles.value}>{usuario.edad || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Altura:</Text>
                <Text style={styles.value}>{usuario.altura ? usuario.altura + " cm" : "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Peso:</Text>
                <Text style={styles.value}>{usuario.peso ? usuario.peso + " kg" : "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Género:</Text>
                <Text style={styles.value}>{usuario.genero || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Disponibilidad:</Text>
                <Text style={styles.value}>{usuario.disponibilidad || "-"}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.label}>Objetivos:</Text>
                <Text style={styles.objetivos}>{usuario.objetivos || "-"}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.label}>Cuenta:</Text>
                <Text style={styles.value}>{usuarioBackend?.username || "-"}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Rol:</Text>
                <Text style={styles.value}>{usuarioBackend?.Rol?.name || "-"}</Text>
            </View>
            <Pressable
                style={styles.logoutButton}
                onPress={confirmarCerrarSesion}
            >
                <Icon name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Cerrar sesion</Text>
            </Pressable>
        </View>

        <Modal
            visible={formModal}
            animationType="slide"
            onRequestClose={() => setFormModal(false)}
        >
            <FormUsuario
                usuario={usuario}
                setFormModal={setFormModal}
            />
        </Modal>
    </ScrollView>
  );
};

export default Perfil;
