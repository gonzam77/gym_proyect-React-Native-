import { StyleSheet } from "react-native"
import { colores } from './colores'

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#000',
        flex:1,
        justifyContent:'center'
    },
    label:{
        fontSize:30,
        color:"#fff",
        textAlign:'center',
    },
    input:{
        backgroundColor:'#fff',
        color:'#000',
        margin:20,
        borderRadius:5,
        fontSize:15,
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
        color:colores.principal,
    }

});

export default styles;
