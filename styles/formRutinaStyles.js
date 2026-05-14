import { Platform, StyleSheet } from "react-native";
import { colores } from './colores';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.azulProfundo,
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
        color: colores.blanco,
        textAlign: "center",
        marginTop: 25,
    },
    tiempo: {
        fontSize: 18,
        fontWeight: "500",
        color: colores.cian,
        textAlign: "center",
        marginVertical: 20,
    },
    label: {
        color: colores.blanco,
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        color: colores.azulProfundo,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    listaEjercicios: {
        marginBottom: 30,
    },
    ejercicioItem: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom: 16,
        backgroundColor: colores.azulProfundoClaro,
        borderRadius: 24,
        padding: 20,
        ...Platform.select({
            ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            },
            android: {
            elevation: 6,
            }
        }),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
    },
    ejercicioNombre: {
        color: colores.blanco,
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
        backgroundColor: colores.azulProfundo,
        borderRadius: 50,
        elevation: 5,
    },
    botonera: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

});
