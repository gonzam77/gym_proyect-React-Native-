import { StyleSheet } from "react-native";
import {colores} from './colores';

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
    color: colores.secundario,
    fontSize: 20,
    fontWeight: '900',
  },
  entrenamiento: {
    marginHorizontal: 15,
    marginVertical: 12,
    backgroundColor: colores.fondo,
    borderRadius: 20,
    padding: 15,
    paddingVertical:25,
    elevation: 10,
    borderBottomWidth: 2,
    borderBottomColor: colores.detalle,
    borderRightWidth: 2,
    borderRightColor: colores.detalle,
    opacity:0.95
  },
  dia: {
    color: colores.textoPrincipal,
    fontSize: 26,
    fontWeight: '600',
  },
  tiempo: {
    fontSize: 20,
    fontWeight: "250",
    color: colores.terciario,
    textAlign: "start"
  },
  tiempoContenedor:{
    marginLeft:"5",
    marginTop:"5"
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