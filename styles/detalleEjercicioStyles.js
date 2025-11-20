import { StyleSheet } from "react-native";
import {colores} from './colores';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: 20,
    justifyContent: "start",
  },
  titulo: {
    color: colores.principal,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 30,
  },
  finalizado :{
    color:colores.advertencia
  },
  infoBox: {
    backgroundColor: colores.fondo,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: colores.detalle,
    borderRightWidth: 4,
    borderRightColor: colores.detalle,
  },
  tituloDetalle:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'700',
    color:colores.textoPrincipal,
  },
  label: {
    fontSize: 18,
    color: colores.secundario,
    fontWeight: "700",
    marginBottom: 10,
  },
  valor: {
    color: colores.principal,
    fontWeight: "600",
  },
  btn: {
    backgroundColor: colores.detalle,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    elevation: 3,
    marginBottom:20

  },
  btnDescanso: {
    backgroundColor: colores.secundario,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    elevation: 3,
    marginBottom:20
  },
  btnTexto: {
    fontSize:18,
    color: colores.fondo,
    fontWeight: "900",
    textAlign: "center",
  },
  estadistica:{
    fontSize:23,
    fontWeight:'800'
  },
  iconButton: {
    marginHorizontal: 10,
    backgroundColor: colores.fondo,
    borderRadius: 50,
    elevation: 5,
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 20,
  },

});
