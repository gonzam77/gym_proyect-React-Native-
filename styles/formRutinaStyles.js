import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    cuerpo: {
        flex: 1,
        paddingHorizontal: espaciado.xl,
    },
    botonera: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: espaciado.sm,
    },
    botonIcono: {
        minWidth: toqueMinimo,
        minHeight: toqueMinimo,
        borderRadius: radios.completo,
        alignItems: "center",
        justifyContent: "center",
    },
    botonIconoPresionado: {
        backgroundColor: colores.superficieAlta,
    },
    botonGuardar: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaciado.sm,
        minHeight: toqueMinimo,
        paddingHorizontal: espaciado.xl,
        borderRadius: radios.completo,
        backgroundColor: colores.exito,
    },
    botonGuardarDeshabilitado: {
        opacity: 0.5,
    },
    botonGuardarTexto: {
        ...tipografia.cuerpoFuerte,
        color: colores.sobreRelleno,
    },
    titulo: {
        ...tipografia.titulo,
        color: colores.textoPrimario,
        textAlign: "center",
        marginTop: espaciado.lg,
    },
    tiempo: {
        ...tipografia.auxiliar,
        color: colores.acento,
        textAlign: "center",
        marginTop: espaciado.xs,
        marginBottom: espaciado.xl,
    },
    form: {
        gap: espaciado.sm,
    },
    label: {
        ...tipografia.auxiliar,
        color: colores.textoSecundario,
    },
    input: {
        backgroundColor: colores.superficie,
        color: colores.textoPrimario,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: radios.md,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        fontSize: 16,
        minHeight: toqueMinimo + 4,
    },
    agregarEjercicio: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: espaciado.sm,
        minHeight: 52,
        marginTop: espaciado.xl,
        borderRadius: radios.md,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colores.principal,
    },
    agregarEjercicioTexto: {
        ...tipografia.cuerpoFuerte,
        color: colores.principal,
    },
    presionado: {
        opacity: 0.75,
    },
    scroll: {
        flex: 1,
        marginTop: espaciado.xl,
    },
    scrollContent: {
        paddingBottom: espaciado.xxxl,
        flexGrow: 1,
    },
    seccionTitulo: {
        ...tipografia.micro,
        color: colores.textoTenue,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: espaciado.md,
    },
    listaEjercicios: {
        marginBottom: espaciado.xl,
    },
    ejercicioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: espaciado.md,
        marginBottom: espaciado.md,
        backgroundColor: colores.superficie,
        borderRadius: radios.lg,
        padding: espaciado.lg,
        borderWidth: 1,
        borderColor: colores.borde,
        ...sombras.card,
    },
    ejercicioItemPresionado: {
        backgroundColor: colores.superficieAlta,
    },
    ejercicioDatos: {
        flex: 1,
    },
    ejercicioNombre: {
        ...tipografia.cuerpoFuerte,
        fontSize: 17,
        color: colores.textoPrimario,
        marginBottom: espaciado.xs,
    },
    ejercicioDetalle: {
        ...tipografia.auxiliar,
        color: colores.textoSecundario,
    },
});
