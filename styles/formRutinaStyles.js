import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        color: "#43d112",
        textAlign: "center",
        marginVertical: 15,
    },
    tiempo: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2f95f5ff",
        textAlign: "center",
        marginVertical: 10,
    },
    form: {
        marginVertical: 10,
    },
    label: {
        color: "#eefa07",
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
        borderBottomColor: '#43d112',
        borderRightWidth: 2,
        borderRightColor: '#43d112',
    },
    ejercicioNombre: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 5,
    },
    ejercicioDetalle: {
        color: "#eefa07",
        fontSize: 16,
        fontWeight: "600",
    },
    iconButton: {
        marginHorizontal: 10,
        backgroundColor: "#1a1a1a",
        borderRadius: 50,
        elevation: 5,
    },
    botonera: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

});
