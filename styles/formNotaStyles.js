import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        flex:1,
    },
    titulo:{
        fontSize:30,
        color:"#000",
        textAlign:'center',
    },
    label:{
        fontSize:15,
        color:"#000",
        textAlign:'center',
    },
    input:{
        backgroundColor:'#fff',
        color:'#000',
        borderRadius:5,
        marginHorizontal:15,
        fontSize:15,
        borderColor:'#000',
        borderWidth:2
    },
    btn:{
        backgroundColor:colores.detalle,
        margin:20,
        borderRadius:5,
    },
    btnTexto:{
        fontSize:15,
        padding:10,
        textAlign:'center',
        fontWeight:600,
        color:'#000',
    }
})

export default styles;