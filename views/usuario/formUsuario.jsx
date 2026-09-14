import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
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
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import Selector from "../../components/Selector";
import PantallaModal from "../../components/PantallaModal";
import { avisoError, avisoExito } from "../../helpers/avisos";
import disponibilidades from "../../helpers/disponibilidades";
import { guardarUsuarioBackup } from "../../helpers/usuarioBackup";
import { apiJson } from "../../services/apiClient";

const generos = [
    { etiqueta: "Masculino", valor: "masculino" },
    { etiqueta: "Femenino", valor: "femenino" },
    { etiqueta: "Otro", valor: "otro" },
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
    const usuarioBackend = sesion?.user;

    const [nuevoUsuario, setNuevoUsuario] = useState(() =>
        crearEstadoInicial(usuario, usuarioBackend)
    );
    const [guardando, setGuardando] = useState(false);
    const [datePickerAbierto, setDatePickerAbierto] = useState(false);
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [verContrasena, setVerContrasena] = useState(false);
    const [error, setError] = useState("");

    const usuarioCargadoRef = useRef(null);

    useEffect(() => {
        const idUsuario = usuarioBackend?.id ?? usuario?.id ?? null;

        if (usuarioCargadoRef.current === idUsuario) {
            return;
        }

        usuarioCargadoRef.current = idUsuario;
        setNuevoUsuario(crearEstadoInicial(usuario, usuarioBackend));
    }, [usuario, usuarioBackend]);

    const opcionesDisponibilidad = useMemo(
        () => disponibilidades.map(item => ({ etiqueta: item.value, valor: item.value })),
        [],
    );

    const handleChange = (campo, valor) => {
        setNuevoUsuario(prev => ({
            ...prev,
            [campo]: valor,
        }));
    };

    const armarPayload = () => {
        const payload = {
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
        };

        const password = nuevaContrasena.trim();
        if (password) {
            payload.password = password;
        }

        return payload;
    };

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
        guardarUsuarioBackup(usuarioLocal);
    };

    /**
     * Los errores de validacion se muestran en el formulario, no en un Alert:
     * el Alert tapa justo el campo que hay que corregir y hay que cerrarlo para
     * poder verlo.
     */
    const validar = () => {
        if (!nuevoUsuario.nombre?.trim()) {
            return "Ingresá tu nombre de usuario.";
        }

        if (!nuevoUsuario.correo?.trim()) {
            return "Ingresá tu correo.";
        }

        if (!usuarioBackend?.id) {
            return "No pudimos identificar tu usuario. Volvé a iniciar sesión.";
        }

        const password = nuevaContrasena.trim();
        const passwordConfirm = confirmarContrasena.trim();

        if (password || passwordConfirm) {
            if (password.length < 6) {
                return "La nueva contraseña necesita al menos 6 caracteres.";
            }

            if (password !== passwordConfirm) {
                return "Las dos contraseñas no coinciden.";
            }
        }

        return "";
    };

    const guardar = async () => {
        const errorValidacion = validar();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setError("");
        setGuardando(true);

        try {
            const payload = armarPayload();
            const body = await apiJson(`/users/${usuarioBackend.id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            sincronizarEstado(payload, body);
            setNuevaContrasena("");
            setConfirmarContrasena("");
            avisoExito("Perfil actualizado", "Tus datos se guardaron correctamente.");
            setFormModal(false);
        } catch (err) {
            avisoError("No se pudo actualizar", err.message || "Intentá de nuevo en un momento.");
        } finally {
            setGuardando(false);
        }
    };

    const hayCambiosDeContrasena = Boolean(nuevaContrasena || confirmarContrasena);

    const cerrar = () => {
        if (hayCambiosDeContrasena) {
            Alert.alert(
                "Salir sin guardar",
                "Escribiste una contraseña nueva que todavía no se guardó. ¿Querés salir?",
                [
                    { text: "Seguir editando", style: "cancel" },
                    { text: "Salir", style: "destructive", onPress: () => setFormModal(false) },
                ],
            );
            return;
        }

        setFormModal(false);
    };

    return (
        <PantallaModal>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.encabezado}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Volver al perfil"
                        hitSlop={8}
                        style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
                        onPress={cerrar}
                    >
                        <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
                    </Pressable>
                    <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
                        Editar perfil
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {error ? (
                        <View style={styles.errorCaja}>
                            <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
                            <Text style={styles.errorTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.seccion}>
                        <Text style={styles.seccionTitulo} maxFontSizeMultiplier={maxEscalaFuente}>
                            Datos personales
                        </Text>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                                Nombre de usuario
                            </Text>
                            <TextInput
                                placeholder="Tu nombre"
                                value={nuevoUsuario.nombre}
                                onChangeText={valor => handleChange("nombre", valor)}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                autoCapitalize="words"
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Correo</Text>
                            <TextInput
                                placeholder="correo@email.com"
                                value={nuevoUsuario.correo}
                                onChangeText={valor => handleChange("correo", valor)}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                                Fecha de nacimiento
                            </Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Elegir la fecha de nacimiento"
                                style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPresionado]}
                                onPress={() => setDatePickerAbierto(true)}
                            >
                                <Text
                                    style={[
                                        styles.dateButtonText,
                                        !nuevoUsuario.birthDate && styles.dateButtonPlaceholder,
                                    ]}
                                    maxFontSizeMultiplier={maxEscalaFuente}
                                >
                                    {nuevoUsuario.birthDate || "Seleccionar fecha"}
                                </Text>
                                <Icon name="calendar-outline" size={20} color={colores.textoSecundario} />
                            </Pressable>
                        </View>

                        <DatePicker
                            modal
                            mode="date"
                            theme="dark"
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

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Teléfono</Text>
                            <TextInput
                                placeholder="Ej: 2664123456"
                                value={nuevoUsuario.telefono}
                                onChangeText={valor => handleChange("telefono", valor)}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                keyboardType="phone-pad"
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Dirección</Text>
                            <TextInput
                                placeholder="Calle y número"
                                value={nuevoUsuario.direccion}
                                onChangeText={valor => handleChange("direccion", valor)}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Género</Text>
                            <Selector
                                titulo="Género"
                                placeholder="Elegí una opción"
                                opciones={generos}
                                valor={nuevoUsuario.genero}
                                onChange={valor => handleChange("genero", valor)}
                            />
                        </View>
                    </View>

                    <View style={styles.seccion}>
                        <Text style={styles.seccionTitulo} maxFontSizeMultiplier={maxEscalaFuente}>
                            Entrenamiento
                        </Text>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Altura en cm</Text>
                            <TextInput
                                placeholder="190"
                                value={nuevoUsuario.altura}
                                onChangeText={valor => handleChange("altura", valor)}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                keyboardType="numeric"
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Peso en kg</Text>
                            <TextInput
                                placeholder="110"
                                value={nuevoUsuario.peso}
                                onChangeText={valor => handleChange("peso", valor)}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                keyboardType="numeric"
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                                Disponibilidad semanal
                            </Text>
                            <Selector
                                titulo="Disponibilidad semanal"
                                placeholder="Elegí cuántos días"
                                opciones={opcionesDisponibilidad}
                                valor={nuevoUsuario.disponibilidad}
                                onChange={valor => handleChange("disponibilidad", valor)}
                            />
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Objetivo</Text>
                            <TextInput
                                multiline
                                numberOfLines={4}
                                placeholder="Hipertrofia, pérdida de peso, ganancia de peso..."
                                value={nuevoUsuario.objetivos}
                                onChangeText={valor => handleChange("objetivos", valor)}
                                style={[styles.input, styles.inputMultilinea]}
                                placeholderTextColor={colores.textoTenue}
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>
                    </View>

                    <View style={styles.seccion}>
                        <Text style={styles.seccionTitulo} maxFontSizeMultiplier={maxEscalaFuente}>
                            Contraseña
                        </Text>
                        <Text style={styles.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
                            Dejalo vacío si no querés cambiarla. Mínimo 6 caracteres.
                        </Text>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                                Nueva contraseña
                            </Text>
                            <View style={styles.campoPassword}>
                                <TextInput
                                    placeholder="Nueva contraseña"
                                    value={nuevaContrasena}
                                    onChangeText={setNuevaContrasena}
                                    style={[styles.input, styles.inputPassword]}
                                    placeholderTextColor={colores.textoTenue}
                                    secureTextEntry={!verContrasena}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    maxFontSizeMultiplier={maxEscalaFuente}
                                />
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={verContrasena ? "Ocultar las contraseñas" : "Mostrar las contraseñas"}
                                    hitSlop={8}
                                    style={styles.verPassword}
                                    onPress={() => setVerContrasena(valor => !valor)}
                                >
                                    <Icon
                                        name={verContrasena ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={colores.textoSecundario}
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                                Confirmar contraseña
                            </Text>
                            <TextInput
                                placeholder="Repetí la nueva contraseña"
                                value={confirmarContrasena}
                                onChangeText={setConfirmarContrasena}
                                style={styles.input}
                                placeholderTextColor={colores.textoTenue}
                                secureTextEntry={!verContrasena}
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                        </View>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Guardar los cambios del perfil"
                        accessibilityState={{ disabled: guardando, busy: guardando }}
                        style={({ pressed }) => [
                            styles.btn,
                            (guardando || pressed) && styles.btnDeshabilitado,
                        ]}
                        disabled={guardando}
                        onPress={guardar}
                    >
                        {guardando ? (
                            <ActivityIndicator color={colores.sobreRelleno} />
                        ) : (
                            <>
                                <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
                                <Text style={styles.btnTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                                    Guardar cambios
                                </Text>
                            </>
                        )}
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </PantallaModal>
    );
};

export default FormUsuario;
