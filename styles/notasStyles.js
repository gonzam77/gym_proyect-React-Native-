import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, sombras, tipografia, toqueMinimo } from "./theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    content: {
        padding: espaciado.md,
        paddingBottom: 110,
        flexGrow: 1,
    },

    // --- Tarjeta de seccion ---
    card: {
        backgroundColor: colores.superficie,
        padding: espaciado.lg,
        borderRadius: radios.lg,
        borderWidth: 1,
        borderColor: colores.borde,
        marginBottom: espaciado.lg,
        ...sombras.card,
    },
    cardPresionada: {
        backgroundColor: colores.superficieAlta,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: espaciado.sm,
    },
    cardTitle: {
        ...tipografia.subtitulo,
        color: colores.textoPrimario,
        flex: 1,
    },
    etiqueta: {
        ...tipografia.micro,
        color: colores.textoTenue,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: espaciado.xs,
    },

    // --- Comentarios ---
    commentContainer: {
        backgroundColor: colores.superficieAlta,
        padding: espaciado.md,
        borderRadius: radios.md,
        marginTop: espaciado.md,
        borderWidth: 1,
        borderColor: colores.bordeSuave,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: espaciado.sm,
    },
    commentDate: {
        ...tipografia.micro,
        color: colores.textoTenue,
        marginBottom: espaciado.xs,
    },
    commentText: {
        ...tipografia.cuerpo,
        color: colores.textoPrimario,
    },
    sinNotas: {
        ...tipografia.cuerpo,
        color: colores.textoTenue,
        fontStyle: 'italic',
        marginTop: espaciado.sm,
    },
    verMas: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: espaciado.xs,
        marginTop: espaciado.md,
    },
    verMasTexto: {
        ...tipografia.auxiliar,
        color: colores.acento,
    },

    // --- Encabezado del detalle ---
    encabezado: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaciado.sm,
        paddingHorizontal: espaciado.md,
        paddingTop: espaciado.sm,
    },
    titulo: {
        ...tipografia.titulo,
        color: colores.textoPrimario,
        flex: 1,
    },
    botonIcono: {
        minWidth: toqueMinimo,
        minHeight: toqueMinimo,
        borderRadius: radios.completo,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonIconoPresionado: {
        backgroundColor: colores.superficieAlta,
    },

    // --- Boton flotante ---
    btn: {
        position: 'absolute',
        right: espaciado.xl,
        width: 60,
        height: 60,
        borderRadius: radios.completo,
        backgroundColor: colores.exito,
        alignItems: 'center',
        justifyContent: 'center',
        ...sombras.flotante,
    },
    btnPresionado: {
        opacity: 0.85,
    },

    // --- Formularios de notas ---
    form: {
        paddingHorizontal: espaciado.xl,
        gap: espaciado.sm,
    },
    label: {
        ...tipografia.auxiliar,
        color: colores.textoSecundario,
    },
    input: {
        backgroundColor: colores.superficie,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: radios.md,
        color: colores.textoPrimario,
        paddingHorizontal: espaciado.lg,
        paddingVertical: espaciado.md,
        fontSize: 16,
        minHeight: toqueMinimo + 4,
    },
    inputMultilinea: {
        minHeight: 160,
        textAlignVertical: 'top',
    },
    botonGuardar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: espaciado.sm,
        minHeight: 52,
        marginHorizontal: espaciado.xl,
        marginTop: espaciado.xl,
        borderRadius: radios.completo,
        backgroundColor: colores.exito,
    },
    botonGuardarDeshabilitado: {
        opacity: 0.5,
    },
    btnTexto: {
        ...tipografia.cuerpoFuerte,
        color: colores.sobreRelleno,
        textTransform: 'uppercase',
    },
});

export default styles;
