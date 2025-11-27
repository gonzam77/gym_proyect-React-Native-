import { StyleSheet } from "react-native"
import { colores } from './colores'

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#000',
        flex:1,
        justifyContent:'center'
    },
    label:{
        fontSize:15,
        color:"#fff",
        marginLeft:15,
    },
    input:{
        backgroundColor:'#fff',
        color:'#000',
        marginHorizontal:15,
        marginVertical:10,
        borderRadius:5,
        fontSize:15,
        textAlignVertical: "top",
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
