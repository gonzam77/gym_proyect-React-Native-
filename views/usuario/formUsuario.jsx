import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DatePicker from "react-native-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { actualizarUsuarioSesion, guardarUsuario } from "../../store/usuarioSlice";
import styles from "../../styles/usuarioStyles";
import { SelectList } from "react-native-dropdown-select-list";
import disponibilidades from "../../helpers/disponibilidades";

const USERS_URL = "https://rutina360-server.onrender.com/users";

const generos = [
    { key: "masculino", value: "masculino" },
    { key: "femenino", value: "femenino" },
    { key: "otro", value: "otro" },
];

const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

const tieneValor = valor => valor !== undefined && valor !== null && valor !== "";

const formatearFechaInput = fecha => {
    if (!fecha) {
        return "";
    }

    return fecha.toString().split("T")[0];
};

const formatearFechaDesdeDate = fecha => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const crearFechaPicker = fecha => {
    if (!fecha) {
        return new Date();
    }

    const [year, month, day] = fecha.split("-").map(Number);

    if (!year || !month || !day) {
        return new Date();
    }

    return new Date(year, month - 1, day);
};

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

const valorTexto = valor => tieneValor(valor) ? valor.toString() : "";

const normalizarFechaPayload = fecha => {
    const fechaLimpia = fecha?.trim();

    if (!fechaLimpia) {
        return null;
    }

    return fechaLimpia.includes("T") ? fechaLimpia : `${fechaLimpia}T00:00:00.000Z`;
};

const numeroONull = valor => {
    if (!tieneValor(valor)) {
        return null;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
};

const textoONull = valor => {
    const texto = valor?.trim();
    return texto ? texto : null;
};

const crearEstadoInicial = (usuario, usuarioBackend) => ({
    id: usuario?.id || usuarioBackend?.id || generarId(),
    idUsuarioBackend: usuario?.idUsuarioBackend || usuarioBackend?.id || "",
    nombre: usuario?.nombre || usuarioBackend?.username || "",
    correo: usuario?.correo || usuarioBackend?.email || "",
    birthDate: formatearFechaInput(usuario?.birthDate || usuarioBackend?.birthDate),
    telefono: usuario?.telefono || usuarioBackend?.phone || "",
    altura: valorTexto(usuario?.altura || usuarioBackend?.height),
    peso: valorTexto(usuario?.peso || usuarioBackend?.weight),
    direccion: usuario?.direccion || usuarioBackend?.address || "",
    genero: usuario?.genero || usuarioBackend?.gender || "",
    objetivos: usuario?.objetivos || usuarioBackend?.goal || "",
    disponibilidad: usuario?.disponibilidad || usuarioBackend?.weeklyAvailability || "",
});

const obtenerUsuarioRespuesta = body => {
    if (body?.data?.user) {
        return body.data.user;
    }

    if (body?.data && !Array.isArray(body.data)) {
        return body.data;
    }

    return {};
};

const FormUsuario = ({ usuario, setFormModal }) => {
    const dispatch = useDispatch();
    const sesion = useSelector(state => state.usuario.sesion);
    const token = sesion?.token;
    const usuarioBackend = sesion?.user;

    const [nuevoUsuario, setNuevoUsuario] = useState(() =>
        crearEstadoInicial(usuario, usuarioBackend)
    );
    const [guardando, setGuardando] = useState(false);
    const [datePickerAbierto, setDatePickerAbierto] = useState(false);

    useEffect(() => {
        setNuevoUsuario(crearEstadoInicial(usuario, usuarioBackend));
    }, [usuario, usuarioBackend]);

    const defaultOptionGenero = nuevoUsuario.genero
        ? { key: nuevoUsuario.genero, value: nuevoUsuario.genero }
        : undefined;

    const defaultOptionDispo = nuevoUsuario.disponibilidad
        ? { key: nuevoUsuario.disponibilidad, value: nuevoUsuario.disponibilidad }
        : undefined;

    const handleChange = (campo, valor) => {
        setNuevoUsuario(prev => ({
            ...prev,
            [campo]: valor,
        }));
    };

    const armarPayload = () => ({
        username: nuevoUsuario.nombre.trim(),
        email: nuevoUsuario.correo.trim(),
        birthDate: normalizarFechaPayload(nuevoUsuario.birthDate),
        gender: textoONull(nuevoUsuario.genero),
        phone: textoONull(nuevoUsuario.telefono),
        height: numeroONull(nuevoUsuario.altura),
        weight: numeroONull(nuevoUsuario.peso),
        address: textoONull(nuevoUsuario.direccion),
        goal: textoONull(nuevoUsuario.objetivos),
        weeklyAvailability: textoONull(nuevoUsuario.disponibilidad),
    });

    const sincronizarEstado = (payload, body) => {
        const usuarioRespuesta = obtenerUsuarioRespuesta(body);
        const usuarioSesionActualizado = {
            ...usuarioBackend,
            ...payload,
            ...usuarioRespuesta,
            Rol: usuarioRespuesta.Rol || usuarioBackend?.Rol,
            adminOwner: usuarioRespuesta.adminOwner || usuarioBackend?.adminOwner,
        };

        const usuarioLocal = {
            ...nuevoUsuario,
            id: nuevoUsuario.id || usuarioBackend?.id || generarId(),
            idUsuarioBackend: usuarioBackend?.id,
            edad: calcularEdad(payload.birthDate),
        };

        dispatch(actualizarUsuarioSesion(usuarioSesionActualizado));
        dispatch(guardarUsuario(usuarioLocal));
    };

    const guardar = async () => {
        if (!nuevoUsuario.nombre?.trim()) {
            Alert.alert("Error", "Debe ingresar un nombre valido.");
            return;
        }

        if (!nuevoUsuario.correo?.trim()) {
            Alert.alert("Error", "Debe ingresar un correo valido.");
            return;
        }

        if (!token) {
            Alert.alert("Error", "No hay una sesion activa para actualizar el perfil.");
            return;
        }

        if (!usuarioBackend?.id) {
            Alert.alert("Error", "No se pudo identificar el usuario autenticado.");
            return;
        }

        setGuardando(true);

        try {
            const payload = armarPayload();
            const response = await fetch(`${USERS_URL}/${usuarioBackend.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            let body = {};

            try {
                body = await response.json();
            } catch {
                body = {};
            }

            if (!response.ok) {
                throw new Error(body?.message || body?.error || "No se pudo actualizar el perfil.");
            }

            sincronizarEstado(payload, body);
            Alert.alert("Perfil actualizado", "Tus datos fueron guardados correctamente.");
            setFormModal(false);
        } catch (error) {
            Alert.alert("Error", error.message || "No se pudo actualizar el perfil.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => {
                    setFormModal(false);
                }}
                style={{marginTop:20,marginLeft:10,}}
            >
                <Icon name="chevron-back-outline" color={"#fff"} size={25} />
            </Pressable>

            <Text style={styles.titulo}>Perfil</Text>

            <ScrollView
                style={{marginTop:20}}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                    placeholder="ANDRES"
                    value={nuevoUsuario.nombre}
                    onChangeText={valor => handleChange("nombre", valor)}
                    style={styles.input}
                    placeholderTextColor="#888"
                    autoCapitalize="characters"
                />

                <Text style={styles.label}>Correo</Text>
                <TextInput
                    placeholder="correo@email.com"
                    value={nuevoUsuario.correo}
                    onChangeText={valor => handleChange("correo", valor)}
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Fecha de nacimiento</Text>
                <Pressable
                    style={styles.dateButton}
                    onPress={() => setDatePickerAbierto(true)}
                >
                    <Text
                        style={[
                            styles.dateButtonText,
                            !nuevoUsuario.birthDate && styles.dateButtonPlaceholder,
                        ]}
                    >
                        {nuevoUsuario.birthDate || "Seleccionar fecha"}
                    </Text>
                    <Icon name="calendar-outline" size={22} color="#000" />
                </Pressable>

                <DatePicker
                    modal
                    mode="date"
                    open={datePickerAbierto}
                    date={crearFechaPicker(nuevoUsuario.birthDate)}
                    maximumDate={new Date()}
                    title="Fecha de nacimiento"
                    confirmText="Confirmar"
                    cancelText="Cancelar"
                    onConfirm={fecha => {
                        setDatePickerAbierto(false);
                        handleChange("birthDate", formatearFechaDesdeDate(fecha));
                    }}
                    onCancel={() => setDatePickerAbierto(false)}
                />

                <Text style={styles.label}>Telefono</Text>
                <TextInput
                    placeholder="Telefono..."
                    value={nuevoUsuario.telefono}
                    onChangeText={valor => handleChange("telefono", valor)}
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Altura en cm</Text>
                <TextInput
                    placeholder="190"
                    value={nuevoUsuario.altura}
                    onChangeText={valor => handleChange("altura", valor)}
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Peso en kg</Text>
                <TextInput
                    placeholder="110"
                    value={nuevoUsuario.peso}
                    onChangeText={valor => handleChange("peso", valor)}
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Direccion</Text>
                <TextInput
                    placeholder="Direccion..."
                    value={nuevoUsuario.direccion}
                    onChangeText={valor => handleChange("direccion", valor)}
                    style={styles.input}
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Genero</Text>
                <SelectList
                    setSelected={valor => handleChange("genero", valor)}
                    data={generos}
                    save="value"
                    placeholder="Seleccione genero..."
                    search={false}
                    boxStyles={{marginHorizontal:15, marginVertical:10, backgroundColor:"#fff"}}
                    inputStyles={{color:"#000"}}
                    dropdownStyles={{marginHorizontal:15, backgroundColor:"#fff"}}
                    dropdownTextStyles={{color:"#000"}}
                    defaultOption={defaultOptionGenero}
                />

                <Text style={styles.label}>Disponibilidad semanal</Text>
                <SelectList
                    setSelected={valor => handleChange("disponibilidad", valor)}
                    data={disponibilidades}
                    save="value"
                    placeholder="Seleccione la disponibilidad"
                    search={false}
                    boxStyles={{marginHorizontal:15, marginVertical:10, backgroundColor:"#fff"}}
                    inputStyles={{color:"#000"}}
                    dropdownStyles={{marginHorizontal:15, backgroundColor:"#fff"}}
                    dropdownTextStyles={{color:"#000"}}
                    defaultOption={defaultOptionDispo}
                />

                <Text style={styles.label}>Objetivo</Text>
                <TextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Hipertrofia / perdida de peso / ganancia de peso..."
                    value={nuevoUsuario.objetivos}
                    onChangeText={valor => handleChange("objetivos", valor)}
                    style={[styles.input,{minHeight:80}]}
                    placeholderTextColor="#888"
                />

                <Pressable
                    style={[styles.btn, guardando && styles.btnDeshabilitado]}
                    disabled={guardando}
                    onPress={guardar}
                >
                    {guardando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnTexto}>
                            GUARDAR CAMBIOS
                        </Text>
                    )}
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default FormUsuario;
