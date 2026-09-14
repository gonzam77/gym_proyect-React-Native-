import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, tipografia, toqueMinimo } from "./theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        padding: espaciado.xxl,
    },
    logo: {
        width: 104,
        height: 104,
        alignSelf: "center",
        marginBottom: espaciado.lg,
        borderRadius: radios.completo,
        borderWidth: 2,
        borderColor: colores.borde,
    },
    titulo: {
        ...tipografia.display,
        color: colores.textoPrimario,
        textAlign: "center",
    },
    subtitulo: {
        ...tipografia.cuerpo,
        color: colores.textoSecundario,
        textAlign: "center",
        marginTop: espaciado.sm,
        marginBottom: espaciado.xxl,
    },
    formulario: {
        backgroundColor: colores.superficie,
        borderRadius: radios.lg,
        padding: espaciado.xl,
        borderWidth: 1,
        borderColor: colores.borde,
    },
    label: {
        ...tipografia.auxiliar,
        color: colores.textoSecundario,
        marginBottom: espaciado.sm,
        marginTop: espaciado.md,
    },
    input: {
        backgroundColor: colores.fondo,
        color: colores.textoPrimario,
        borderRadius: radios.md,
        borderWidth: 1,
        borderColor: colores.borde,
        paddingHorizontal: espaciado.lg,
        paddingVertical: espaciado.md,
        fontSize: 16,
        minHeight: toqueMinimo + 4,
    },
    inputEnfocado: {
        borderColor: colores.acento,
    },
    inputConError: {
        borderColor: colores.peligro,
    },
    campoPassword: {
        position: "relative",
        justifyContent: "center",
    },
    inputPassword: {
        paddingRight: 52,
    },
    verPassword: {
        position: "absolute",
        right: espaciado.xs,
        minWidth: toqueMinimo,
        minHeight: toqueMinimo,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radios.completo,
    },
    errorCaja: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaciado.sm,
        marginTop: espaciado.lg,
        padding: espaciado.md,
        borderRadius: radios.md,
        borderWidth: 1,
        borderColor: colores.peligro,
        backgroundColor: "rgba(229, 72, 77, 0.12)",
    },
    error: {
        flex: 1,
        ...tipografia.auxiliar,
        color: colores.peligro,
    },
    boton: {
        minHeight: 52,
        backgroundColor: colores.exito,
        borderRadius: radios.completo,
        justifyContent: "center",
        alignItems: "center",
        marginTop: espaciado.xxl,
    },
    botonDeshabilitado: {
        opacity: 0.5,
    },
    botonTexto: {
        color: colores.sobreRelleno,
        ...tipografia.cuerpoFuerte,
        textTransform: "uppercase",
    },
});

export default styles;
