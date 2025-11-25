import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: "#f0f0f0",
    },

    card: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3, // Sombra Android
        shadowColor: "#000", // Sombra iOS
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },

    commentContainer: {
        backgroundColor: "#fafafa",
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal:10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    commentDate: {
        fontSize: 12,
        color: "#777",
        marginBottom: 4,
    },
    commentText: {
        fontSize: 15,
        color: "#333",
    },
    titulo:{
        textAlign:'center',
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#333",
    },
    btn: {
        backgroundColor: colores.fondoBtn2,
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 18,
        elevation: 3,
        marginHorizontal:10,
    },
    btnTexto: {
        fontSize: 18,
        color: colores.fondo,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default styles;
