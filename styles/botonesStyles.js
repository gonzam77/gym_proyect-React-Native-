import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    iconButton: {
        marginHorizontal: 10,
        backgroundColor: colores.fondo,
        borderRadius: 50,
        elevation: 5,
        alignItems:'center'
    },
    btn: {
        backgroundColor: colores.fondoBtn1,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 30,
        elevation: 3,
    },
    btnTexto: {
        fontSize: 18,
        color: colores.fondo,
        fontWeight: "bold",
        textAlign: "center",
    },
    iconos:{
        width:50,
        height:50
    }
    
})

export default styles;