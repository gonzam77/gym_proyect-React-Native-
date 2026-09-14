import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, sombras, tipografia, toqueMinimo } from "./theme";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colores.fondo,
        flex: 1,
    },
    content: {
        paddingBottom: espaciado.xxl,
    },
    card: {
        backgroundColor: colores.superficie,
        padding: espaciado.xl,
        borderRadius: radios.lg,
        margin: espaciado.xl,
        borderWidth: 1,
        borderColor: colores.borde,
        ...sombras.card,
    },
    editarBoton: {
        alignSelf: "flex-end",
        minWidth: toqueMinimo,
        minHeight: toqueMinimo,
        borderRadius: radios.completo,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: espaciado.xl,
    },
    nombre: {
        marginTop: espaciado.sm,
        ...tipografia.titulo,
        color: colores.textoPrimario,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: espaciado.md,
        paddingVertical: espaciado.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colores.bordeSuave,
    },
    label: {
        ...tipografia.auxiliar,
        color: colores.textoSecundario,
    },
    value: {
        ...tipografia.cuerpo,
        color: colores.textoPrimario,
        flexShrink: 1,
        textAlign: "right",
    },
    objetivos: {
        alignSelf: "flex-start",
        ...tipografia.cuerpo,
        paddingTop: espaciado.sm,
        color: colores.textoPrimario,
    },
    boton: {
        minHeight: toqueMinimo + 4,
        borderRadius: radios.sm,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        marginTop: espaciado.md,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: espaciado.sm,
    },
    botonPresionado: {
        opacity: 0.75,
    },
    catalogButton: {
        backgroundColor: colores.exito,
    },
    logoutButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colores.borde,
    },
    logoutAllButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colores.peligro,
    },
    botonTexto: {
        color: colores.sobreRelleno,
        ...tipografia.cuerpoFuerte,
    },
    botonTextoSecundario: {
        color: colores.textoPrimario,
        ...tipografia.cuerpoFuerte,
    },
    botonTextoPeligro: {
        color: colores.peligro,
        ...tipografia.cuerpoFuerte,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colores.fondo,
        paddingHorizontal: espaciado.md,
        paddingVertical: espaciado.sm,
        borderBottomWidth: 1,
        borderBottomColor: colores.bordeSuave,
    },
    modalHeaderTitulo: {
        color: colores.textoPrimario,
        ...tipografia.subtitulo,
        marginLeft: espaciado.sm,
    },
    botonIcono: {
        minWidth: toqueMinimo,
        minHeight: toqueMinimo,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radios.completo,
    },
});

export default styles;
