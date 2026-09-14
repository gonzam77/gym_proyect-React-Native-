import React, { useState } from "react";
import { View, Text, Pressable, Modal, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FormUsuario from "./formUsuario";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/perfilStyles";
import { colores } from "../../styles/colores";
import { cerrarSesion, limpiarUsuario } from "../../store/usuarioSlice";
import CatalogoEjercicios from "./catalogoEjercicios";
import PantallaModal from "../../components/PantallaModal";
import { logoutAllAuth, logoutAuth } from "../../services/authService";

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

const Dato = ({ etiqueta, valor }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{etiqueta}</Text>
        <Text style={styles.value}>{valor || "-"}</Text>
    </View>
);

const Perfil = () => {

    const [formModal, setFormModal] = useState(false);
    const [catalogoModal, setCatalogoModal] = useState(false);

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
            "Cerrar sesión",
            "¿Querés cerrar la sesión actual?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: async () => {
                        await logoutAuth();
                        dispatch(cerrarSesion());
                        dispatch(limpiarUsuario());
                    },
                },
            ],
        );
    };

    const confirmarCerrarSesionGlobal = () => {
        Alert.alert(
            "Cerrar sesión en todos los dispositivos",
            "Esto cerrará todas tus sesiones activas. ¿Querés continuar?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar todas",
                    style: "destructive",
                    onPress: async () => {
                        await logoutAllAuth();
                        dispatch(cerrarSesion());
                        dispatch(limpiarUsuario());
                    },
                },
            ],
        );
    };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.card}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Editar mis datos"
                hitSlop={8}
                style={({ pressed }) => [styles.editarBoton, pressed && styles.botonPresionado]}
                onPress={() => setFormModal(true)}
            >
                <Icon name="pencil-outline" size={24} color={colores.acento} />
            </Pressable>

            {/* Foto o icono */}
            <View style={styles.header}>
                <Icon name="person-circle-outline" size={80} color={colores.acento} />
                <Text style={styles.nombre} numberOfLines={2}>{usuarioPerfil.nombre || "Usuario"}</Text>
            </View>

            {/* Datos */}
            <Dato etiqueta="Correo" valor={usuarioPerfil.correo} />
            <Dato etiqueta="Edad" valor={usuarioPerfil.edad} />
            <Dato etiqueta="Teléfono" valor={usuarioPerfil.telefono} />
            <Dato etiqueta="Altura" valor={usuarioPerfil.altura ? usuarioPerfil.altura + " cm" : ""} />
            <Dato etiqueta="Peso" valor={usuarioPerfil.peso ? usuarioPerfil.peso + " kg" : ""} />
            <Dato etiqueta="Dirección" valor={usuarioPerfil.direccion} />
            <Dato etiqueta="Género" valor={usuarioPerfil.genero} />
            <Dato etiqueta="Disponibilidad" valor={usuarioPerfil.disponibilidad} />
        </View>

        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.label}>Objetivos</Text>
                <Text style={styles.objetivos}>{usuarioPerfil.objetivos || "-"}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <Dato etiqueta="Cuenta" valor={usuarioBackend?.username} />
            <Dato etiqueta="Rol" valor={usuarioBackend?.Rol?.name} />
            <Dato etiqueta="Gym" valor={usuarioBackend?.adminOwner?.username} />

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir catálogo de ejercicios"
                style={({ pressed }) => [styles.boton, styles.catalogButton, pressed && styles.botonPresionado]}
                onPress={() => setCatalogoModal(true)}
            >
                <Icon name="barbell-outline" size={20} color={colores.sobreRelleno} />
                <Text style={styles.botonTexto}>Catálogo de ejercicios</Text>
            </Pressable>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar sesión"
                style={({ pressed }) => [styles.boton, styles.logoutButton, pressed && styles.botonPresionado]}
                onPress={confirmarCerrarSesion}
            >
                <Icon name="log-out-outline" size={20} color={colores.textoPrimario} />
                <Text style={styles.botonTextoSecundario}>Cerrar sesión</Text>
            </Pressable>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar sesión en todos los dispositivos"
                style={({ pressed }) => [styles.boton, styles.logoutAllButton, pressed && styles.botonPresionado]}
                onPress={confirmarCerrarSesionGlobal}
            >
                <Icon name="shield-outline" size={20} color={colores.peligro} />
                <Text style={styles.botonTextoPeligro}>Cerrar en todos</Text>
            </Pressable>
        </View>

        <Modal
            visible={formModal}
            animationType="slide"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={() => setFormModal(false)}
        >
            <FormUsuario
                usuario={usuarioPerfil}
                setFormModal={setFormModal}
            />
        </Modal>

        <Modal
            visible={catalogoModal}
            animationType="slide"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={() => setCatalogoModal(false)}
        >
            <PantallaModal>
                <View style={styles.modalHeader}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Volver al perfil"
                        hitSlop={8}
                        style={({ pressed }) => [styles.botonIcono, pressed && styles.botonPresionado]}
                        onPress={() => setCatalogoModal(false)}
                    >
                        <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
                    </Pressable>
                    <Text style={styles.modalHeaderTitulo}>Configuración del catálogo</Text>
                </View>
                <CatalogoEjercicios />
            </PantallaModal>
        </Modal>
    </ScrollView>
  );
};

export default Perfil;
