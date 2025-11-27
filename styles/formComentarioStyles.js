import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    input:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        minHeight: 100,
        margin:30

    },
    btn:{
        backgroundColor:colores.fondoBtn2,
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