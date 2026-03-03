import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { Dimensions } from "react-native";

const size = Dimensions.get("window").width * 0.3;

const styles = StyleSheet.create({
    iconButton: {
        marginHorizontal: 10,
        backgroundColor: colores.negro,
        borderRadius: 50,
        elevation: 5,
        alignItems:'center'
    },
    btn: {
        width: size,
        height: size,
        borderRadius: size/2,  
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        alignSelf: 'center',
        borderColor:colores.reiniciar,
        borderWidth: 4,
        marginTop:20
    },
    btnTexto: {
        fontSize: 16,
        color: colores.reiniciar,
        fontWeight: "600",
        textAlign: "center",
        textTransform:'uppercase'
    },
    iconos:{
        width:50,
        height:50
    }
    
})

export default styles;