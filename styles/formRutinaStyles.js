import { StyleSheet } from "react-native";
import { colores } from './colores';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
        padding: 20,
    },
    scroll:{
        backgroundColor:'transparent',
        paddingVertical:50,
        flexGrow:1
    },  
    titulo: {
        fontSize: 30,
        fontWeight: "900",
        color: colores.textoPrincipal,
        textAlign: "center",
        marginVertical: 15,
    },
    tiempo: {
        fontSize: 20,
        fontWeight: "600",
        color: colores.terciario,
        textAlign: "center",
        marginVertical: 10,
    },
    form: {
        marginVertical: 10,
    },
    label: {
        color: colores.secundario,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    listaEjercicios: {
        marginTop: 10,
        marginBottom: 30,
    },
    ejercicioItem: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor: "#111111",
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
        elevation: 10,
        borderBottomWidth: 2,
        borderBottomColor: colores.detalle,
        borderRightWidth: 2,
        borderRightColor: colores.detalle,
    },
    ejercicioNombre: {
        color: colores.principal,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 5,
    },
    ejercicioDetalle: {
        color: colores.secundario,
        fontSize: 16,
        fontWeight: "600",
    },
    iconButton: {
        marginHorizontal: 10,
        backgroundColor: colores.fondo,
        borderRadius: 50,
        elevation: 5,
    },
    botonera: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

});
