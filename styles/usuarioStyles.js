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
    dateButton:{
        backgroundColor:'#fff',
        marginHorizontal:15,
        marginVertical:10,
        borderRadius:5,
        minHeight:44,
        paddingHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    dateButtonText:{
        color:'#000',
        fontSize:15,
    },
    dateButtonPlaceholder:{
        color:'#888',
    },
    scrollContent:{
        paddingBottom:40,
    },
    btn:{
        backgroundColor:colores.verdeOpaco,
        margin:20,
        borderRadius:5,
    },
    btnDeshabilitado:{
        opacity:0.65,
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
