import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container:{
        backgroundColor:colores.azulProfundo,
        flex:1
    },
    content: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        margin: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    nombre: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 0.4,
        borderColor: "#ccc",
    },
    label: {
        fontSize: 18,
        color: "#555",
        fontWeight: "600",
    },
    value: {
        fontSize: 16,
        color: "#333",
        flexShrink: 1,
        textAlign: "right",
    },
    objetivos:{
        alignSelf:'flex-start',
        fontSize:15,
        paddingTop:10,
    },
    logoutButton: {
        backgroundColor: colores.alert,
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default styles;
