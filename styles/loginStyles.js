import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.azulProfundo,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    logo: {
        width: 110,
        height: 110,
        alignSelf: "center",
        marginBottom: 18,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.16)",
    },
    titulo: {
        color: colores.blanco,
        fontSize: 32,
        fontWeight: "800",
        textAlign: "center",
    },
    subtitulo: {
        color: colores.secundario,
        fontSize: 15,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 28,
    },
    formulario: {
        backgroundColor: colores.azulProfundoClaro,
        borderRadius: 8,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    label: {
        color: colores.blanco,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 16,
    },
    error: {
        color: colores.alert,
        fontSize: 14,
        fontWeight: "600",
        marginTop: 14,
        textAlign: "center",
    },
    boton: {
        minHeight: 48,
        backgroundColor: colores.verdeOpaco,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    botonDeshabilitado: {
        opacity: 0.65,
    },
    botonTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        textTransform: "uppercase",
    },
});

export default styles;
