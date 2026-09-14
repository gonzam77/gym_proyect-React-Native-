import { StyleSheet } from "react-native"
import { colores } from './colores'
import { espaciado, radios, tipografia, toqueMinimo } from './theme'

const styles = StyleSheet.create({
    container:{
        backgroundColor: colores.fondo,
        flex:1,
    },
    encabezado: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaciado.sm,
        paddingHorizontal: espaciado.md,
        paddingTop: espaciado.sm,
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
    titulo:{
        ...tipografia.titulo,
        color: colores.textoPrimario,
        flex: 1,
    },
    scrollContent:{
        paddingHorizontal: espaciado.xl,
        paddingTop: espaciado.xl,
        paddingBottom: espaciado.xxxl,
    },
    seccion: {
        marginBottom: espaciado.xxl,
        gap: espaciado.md,
    },
    seccionTitulo: {
        ...tipografia.micro,
        color: colores.textoTenue,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    campo: {
        gap: espaciado.xs,
    },
    label:{
        ...tipografia.auxiliar,
        color: colores.textoSecundario,
    },
    ayuda: {
        ...tipografia.micro,
        color: colores.textoTenue,
        fontWeight: '500',
    },
    input:{
        backgroundColor: colores.superficie,
        color: colores.textoPrimario,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: radios.md,
        paddingHorizontal: espaciado.lg,
        paddingVertical: espaciado.md,
        fontSize: 15,
        minHeight: toqueMinimo + 4,
        textAlignVertical: "top",
    },
    inputMultilinea: {
        minHeight: 100,
    },
    campoPassword: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputPassword: {
        paddingRight: 52,
    },
    verPassword: {
        position: 'absolute',
        right: espaciado.xs,
        minWidth: toqueMinimo,
        minHeight: toqueMinimo,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radios.completo,
    },
    dateButton:{
        backgroundColor: colores.superficie,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: radios.md,
        minHeight: toqueMinimo + 4,
        paddingHorizontal: espaciado.lg,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        gap: espaciado.md,
    },
    dateButtonPresionado: {
        backgroundColor: colores.superficieAlta,
    },
    dateButtonText:{
        color: colores.textoPrimario,
        fontSize: 15,
    },
    dateButtonPlaceholder:{
        color: colores.textoTenue,
    },
    errorCaja: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaciado.sm,
        marginBottom: espaciado.lg,
        padding: espaciado.md,
        borderRadius: radios.md,
        borderWidth: 1,
        borderColor: colores.peligro,
        backgroundColor: 'rgba(229, 72, 77, 0.12)',
    },
    errorTexto: {
        flex: 1,
        ...tipografia.auxiliar,
        color: colores.peligro,
    },
    btn:{
        backgroundColor: colores.exito,
        borderRadius: radios.completo,
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: espaciado.sm,
        marginTop: espaciado.sm,
    },
    btnDeshabilitado:{
        opacity: 0.5,
    },
    btnTexto:{
        ...tipografia.cuerpoFuerte,
        color: colores.sobreRelleno,
        textTransform: 'uppercase',
    }

});

export default styles;
