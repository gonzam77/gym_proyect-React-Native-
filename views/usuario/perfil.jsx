import React, { useState } from "react";
import { View, Text, Pressable, Modal, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FormUsuario from "./formUsuario";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/perfilStyles";
import { cerrarSesion } from "../../store/usuarioSlice";

const tieneValor = valor => valor !== undefined && valor !== null && valor !== "";

const calcularEdad = fechaNacimiento => {
    if (!fechaNacimiento) {
        return "";
    }

    const nacimiento = new Date(fechaNacimiento);

    if (Number.isNaN(nacimiento.getTime())) {
        return "";
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad -= 1;
    }

    return edad.toString();
};

const formatearFechaInput = fecha => {
    if (!fecha) {
        return "";
    }

    return fecha.toString().split("T")[0];
};

const valorPerfil = (local, remoto) => {
    if (tieneValor(local)) {
        return local;
    }

    return tieneValor(remoto) ? remoto : "";
};

const Perfil = () => {

    const [formModal, setFormModal] = useState(false);

    const dispatch = useDispatch();
    const usuario = useSelector(state => state.usuario.usuario);
    const sesion = useSelector(state => state.usuario.sesion);
    const usuarioBackend = sesion?.user;
    const perfilLocalMismoUsuario = usuario?.idUsuarioBackend === usuarioBackend?.id
        || usuario?.id === usuarioBackend?.id;
    const usuarioBackendPerfil = {
        id: usuarioBackend?.id,
        idUsuarioBackend: usuarioBackend?.id,
        nombre: usuarioBackend?.username || "",
        correo: usuarioBackend?.email || "",
        birthDate: formatearFechaInput(usuarioBackend?.birthDate),
        edad: calcularEdad(usuarioBackend?.birthDate),
        telefono: usuarioBackend?.phone || "",
        altura: tieneValor(usuarioBackend?.height) ? usuarioBackend.height.toString() : "",
        peso: tieneValor(usuarioBackend?.weight) ? usuarioBackend.weight.toString() : "",
        direccion: usuarioBackend?.address || "",
        genero: usuarioBackend?.gender || "",
        objetivos: usuarioBackend?.goal || "",
        disponibilidad: usuarioBackend?.weeklyAvailability || "",
    };
    const usuarioPerfil = perfilLocalMismoUsuario
        ? {
            ...usuarioBackendPerfil,
            id: valorPerfil(usuario.id, usuarioBackendPerfil.id),
            idUsuarioBackend: usuarioBackend?.id,
            nombre: valorPerfil(usuario.nombre, usuarioBackendPerfil.nombre),
            correo: valorPerfil(usuario.correo, usuarioBackendPerfil.correo),
            birthDate: valorPerfil(usuario.birthDate, usuarioBackendPerfil.birthDate),
            edad: valorPerfil(usuario.edad, usuarioBackendPerfil.edad),
            telefono: valorPerfil(usuario.telefono, usuarioBackendPerfil.telefono),
            altura: valorPerfil(usuario.altura, usuarioBackendPerfil.altura),
            peso: valorPerfil(usuario.peso, usuarioBackendPerfil.peso),
            direccion: valorPerfil(usuario.direccion, usuarioBackendPerfil.direccion),
            genero: valorPerfil(usuario.genero, usuarioBackendPerfil.genero),
            objetivos: valorPerfil(usuario.objetivos, usuarioBackendPerfil.objetivos),
            disponibilidad: valorPerfil(usuario.disponibilidad, usuarioBackendPerfil.disponibilidad),
        }
        : usuarioBackendPerfil;

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
                <Text style={styles.nombre}>{usuarioPerfil.nombre || "Usuario"}</Text>
            </View>

            {/* Datos */}
            <View style={styles.row}>
                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.value}>{usuarioPerfil.correo || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Edad:</Text>
                <Text style={styles.value}>{usuarioPerfil.edad || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Telefono:</Text>
                <Text style={styles.value}>{usuarioPerfil.telefono || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Altura:</Text>
                <Text style={styles.value}>{usuarioPerfil.altura ? usuarioPerfil.altura + " cm" : "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Peso:</Text>
                <Text style={styles.value}>{usuarioPerfil.peso ? usuarioPerfil.peso + " kg" : "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Direccion:</Text>
                <Text style={styles.value}>{usuarioPerfil.direccion || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Género:</Text>
                <Text style={styles.value}>{usuarioPerfil.genero || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Disponibilidad:</Text>
                <Text style={styles.value}>{usuarioPerfil.disponibilidad || "-"}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.label}>Objetivos:</Text>
                <Text style={styles.objetivos}>{usuarioPerfil.objetivos || "-"}</Text>
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
            <View style={styles.row}>
                <Text style={styles.label}>Gym:</Text>
                <Text style={styles.value}>{usuarioBackend?.adminOwner?.username || "-"}</Text>
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
                usuario={usuarioPerfil}
                setFormModal={setFormModal}
            />
        </Modal>
    </ScrollView>
  );
};

export default Perfil;
