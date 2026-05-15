import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useDispatch } from "react-redux";
import { guardarSesion, guardarUsuario } from "../../store/usuarioSlice";
import styles from "../../styles/loginStyles";
import { guardarUsuarioBackup, mapearUsuarioBackendALocal } from "../../helpers/usuarioBackup";

const AUTH_URL = "https://rutina360-server.onrender.com/users/auth";

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const camposIncompletos = !email.trim() || !password;

    const iniciarSesion = async () => {
        if (camposIncompletos || cargando) {
            setError("Ingrese email y contrasena.");
            return;
        }

        setCargando(true);
        setError("");

        try {
            const response = await fetch(AUTH_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            let body = {};

            try {
                body = await response.json();
            } catch {
                body = {};
            }

            const token = body?.data?.token;
            const user = body?.data?.user;

            if (!response.ok || !token) {
                throw new Error(body?.message || body?.error || "No se pudo iniciar sesion.");
            }

            dispatch(guardarSesion({ token, user }));
            const usuarioLocal = mapearUsuarioBackendALocal(user);
            dispatch(guardarUsuario(usuarioLocal));
            await guardarUsuarioBackup(usuarioLocal);
            setPassword("");
        } catch (err) {
            setError(err.message || "Revise los datos e intente nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <Image style={styles.logo} source={require("../../assets/img/logo1.png")} />
                <Text style={styles.titulo}>Rutina360</Text>
                <Text style={styles.subtitulo}>Ingresa con tu cuenta para continuar</Text>

                <View style={styles.formulario}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="correo@email.com"
                        keyboardType="email-address"
                        placeholderTextColor="#777"
                        returnKeyType="next"
                    />

                    <Text style={styles.label}>Contrasena</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Ingrese su contrasena"
                        placeholderTextColor="#777"
                        returnKeyType="send"
                        onSubmitEditing={iniciarSesion}
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Pressable
                        style={[
                            styles.boton,
                            (camposIncompletos || cargando) && styles.botonDeshabilitado,
                        ]}
                        disabled={camposIncompletos || cargando}
                        onPress={iniciarSesion}
                    >
                        {cargando ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.botonTexto}>Ingresar</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
