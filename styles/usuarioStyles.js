import { StyleSheet } from "react-native"
import { colores } from './colores'

const styles = StyleSheet.create({
    container:{
        backgroundColor: colores.azulProfundo,
        flex:1,
        justifyContent:'center'
    },
    titulo:{
        fontSize:30,
        color:colores.blanco,
        fontWeight:'600',
        textAlign:'center',
    },
    label:{
        fontSize:15,
        color:colores.blanco,
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
        backgroundColor:colores.verdeOpaco,
        margin:20,
        borderRadius:5,
    },
    btnTexto:{
        fontSize:16,
        padding:10,
        textAlign:'center',
        fontWeight:600,
        color:'#fff',
    }

});

export default styles;
