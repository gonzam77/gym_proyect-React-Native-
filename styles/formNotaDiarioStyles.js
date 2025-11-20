import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container:{
        backgroundColor:colores.fondo,
    },
    titulo:{
        fontSize:18,
        fontWeight:'900',
        color:colores.principal
    },
    input:{
        borderColor:colores.detalle,
        borderWidth:2
    },
    label:{
        fontSize:12,
        color:colores.principal
    },
    btn:{
        padding:15,
        backgroundColor:colores.detalle
    },
    btnTexto:{
        color:colores.principal,
        fontWeight:'600',
        fontSize:12
    },
})

export default styles;