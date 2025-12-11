import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { Dimensions } from "react-native";

const size = Dimensions.get("window").width * 0.3;

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
        width: size,
        height: size,
        borderRadius: size/2,  
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        alignSelf: 'center',
    },
    btnTexto: {
        fontSize: 18,
        color: colores.fondo,
        fontWeight: "900",
        textAlign: "center",
    },
    iconos:{
        width:50,
        height:50
    }
    
})

export default styles;