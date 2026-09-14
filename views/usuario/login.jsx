import { useRef, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { guardarSesion, guardarUsuario } from "../../store/usuarioSlice";
import styles from "../../styles/loginStyles";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { guardarUsuarioBackup, mapearUsuarioBackendALocal } from "../../helpers/usuarioBackup";
import { loginAuth } from "../../services/authService";

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [verPassword, setVerPassword] = useState(false);
    const [campoEnfocado, setCampoEnfocado] = useState("");

    const passwordRef = useRef(null);

    const camposIncompletos = !email.trim() || !password;

    const iniciarSesion = async () => {
        if (camposIncompletos || cargando) {
            setError("Ingresá tu email y tu contraseña.");
            return;
        }

        setCargando(true);
        setError("");

        try {
            const { accessToken, user } = await loginAuth({
                email: email.trim(),
                password,
            });

            dispatch(guardarSesion({ token: accessToken, user }));
            const usuarioLocal = mapearUsuarioBackendALocal(user);
            dispatch(guardarUsuario(usuarioLocal));
            await guardarUsuarioBackup(usuarioLocal);
            setPassword("");
        } catch (err) {
            setError(err.message || "Revisá los datos e intentá de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image style={styles.logo} source={require("../../assets/img/logo1.png")} />
                    <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
                        Rutina360
                    </Text>
                    <Text style={styles.subtitulo} maxFontSizeMultiplier={maxEscalaFuente}>
                        Ingresá con tu cuenta para continuar
                    </Text>

                    <View style={styles.formulario}>
                        <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Email</Text>
                        <TextInput
                            style={[
                                styles.input,
                                campoEnfocado === 'email' && styles.inputEnfocado,
                                Boolean(error) && styles.inputConError,
                            ]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            placeholder="correo@email.com"
                            keyboardType="email-address"
                            placeholderTextColor={colores.textoTenue}
                            returnKeyType="next"
                            // Antes el returnKeyType decia "siguiente" pero la tecla no
                            // hacia nada: faltaba pasarle el foco al campo siguiente.
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            onFocus={() => setCampoEnfocado('email')}
                            onBlur={() => setCampoEnfocado('')}
                            submitBehavior="submit"
                            maxFontSizeMultiplier={maxEscalaFuente}
                        />

                        <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Contraseña</Text>
                        <View style={styles.campoPassword}>
                            <TextInput
                                ref={passwordRef}
                                style={[
                                    styles.input,
                                    styles.inputPassword,
                                    campoEnfocado === 'password' && styles.inputEnfocado,
                                    Boolean(error) && styles.inputConError,
                                ]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!verPassword}
                                autoCapitalize="none"
                                autoComplete="current-password"
                                autoCorrect={false}
                                placeholder="Tu contraseña"
                                placeholderTextColor={colores.textoTenue}
                                returnKeyType="send"
                                onSubmitEditing={iniciarSesion}
                                onFocus={() => setCampoEnfocado('password')}
                                onBlur={() => setCampoEnfocado('')}
                                maxFontSizeMultiplier={maxEscalaFuente}
                            />
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={verPassword ? "Ocultar la contraseña" : "Mostrar la contraseña"}
                                hitSlop={8}
                                style={styles.verPassword}
                                onPress={() => setVerPassword(valor => !valor)}
                            >
                                <Icon
                                    name={verPassword ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color={colores.textoSecundario}
                                />
                            </Pressable>
                        </View>

                        {error ? (
                            <View style={styles.errorCaja}>
                                <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
                                <Text style={styles.error} maxFontSizeMultiplier={maxEscalaFuente}>
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Ingresar"
                            accessibilityState={{ disabled: camposIncompletos || cargando, busy: cargando }}
                            style={({ pressed }) => [
                                styles.boton,
                                (camposIncompletos || cargando || pressed) && styles.botonDeshabilitado,
                            ]}
                            disabled={camposIncompletos || cargando}
                            onPress={iniciarSesion}
                        >
                            {cargando ? (
                                <ActivityIndicator color={colores.sobreRelleno} />
                            ) : (
                                <Text style={styles.botonTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                                    Ingresar
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
