import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    titulo:{
        fontSize:30,
        color:colores.blanco,
        fontWeight:'600',
        textAlign:'center',
    },
    input:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        minHeight: 100,
        margin:30,
        backgroundColor:'#fff'

    },
    btn:{
        backgroundColor:colores.verdeOpaco,
        marginHorizontal:30,
        padding:10,
        borderRadius:10

    },
    btnText:{
        textAlign:'center',
        color:'#fff',
        fontSize:18,
        fontWeight:'600',        
    },
})

export default styles;