import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent', // importante para que se vea el fondo
    flex:1
  },
  scroll:{
    backgroundColor:'transparent',
    paddingVertical:50,
    flexGrow:1
  },
  agregar:{
    width:80,
    height:80
  },  
  leyendaTexto: {
    textAlign: 'center',
    color: '#eefa07',
    fontSize: 20,
    fontWeight: '900',
  },
  entrenamiento: {
    marginHorizontal: 15,
    marginVertical: 12,
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 15,
    paddingVertical:25,
    elevation: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#43d112',
    borderRightWidth: 2,
    borderRightColor: '#43d112',
    opacity:0.95
  },
  dia: {
    color: '#99df99ff',
    fontSize: 26,
    fontWeight: '600',
  },
  tiempo: {
    fontSize: 20,
    fontWeight: "250",
    // color: "#2f95f5ff",
    color: "#fff",
    textAlign: "center"
  },
  nombre: {
    fontSize: 26,
    fontWeight: '600',
  },
  image:{
    height:100,
    width:100,
    borderRadius:50
  },
  btnCircular: {
    position:'absolute',
    right:30,
    bottom:30,
  },
});