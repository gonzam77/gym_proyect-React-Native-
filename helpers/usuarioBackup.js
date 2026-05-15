import AsyncStorage from "@react-native-async-storage/async-storage";

const USUARIO_BACKUP_KEY = "@rutina360_usuario_backup_v1";

const tieneValor = valor => valor !== undefined && valor !== null && valor !== "";

export const mapearUsuarioBackendALocal = usuarioBackend => ({
    id: usuarioBackend?.id || "",
    idUsuarioBackend: usuarioBackend?.id || "",
    nombre: usuarioBackend?.username || "",
    correo: usuarioBackend?.email || "",
    birthDate: usuarioBackend?.birthDate ? usuarioBackend.birthDate.toString().split("T")[0] : "",
    telefono: usuarioBackend?.phone || "",
    altura: tieneValor(usuarioBackend?.height) ? usuarioBackend.height.toString() : "",
    peso: tieneValor(usuarioBackend?.weight) ? usuarioBackend.weight.toString() : "",
    direccion: usuarioBackend?.address || "",
    genero: usuarioBackend?.gender || "",
    objetivos: usuarioBackend?.goal || "",
    disponibilidad: usuarioBackend?.weeklyAvailability || "",
});

export const guardarUsuarioBackup = async usuario => {
    try {
        await AsyncStorage.setItem(USUARIO_BACKUP_KEY, JSON.stringify(usuario || {}));
    } catch (error) {
        console.log("No se pudo guardar backup local del usuario:", error);
    }
};

export const cargarUsuarioBackup = async () => {
    try {
        const data = await AsyncStorage.getItem(USUARIO_BACKUP_KEY);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    } catch (error) {
        console.log("No se pudo leer backup local del usuario:", error);
        return null;
    }
};
