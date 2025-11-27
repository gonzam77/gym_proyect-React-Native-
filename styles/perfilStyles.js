import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#000',
        flex:1
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
    },
    objetivos:{
        alignSelf:'flex-start',
        fontSize:15,
        paddingTop:10,
    }
});

export default styles;