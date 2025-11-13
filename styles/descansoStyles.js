import { StyleSheet } from "react-native";
import {colores} from './colores';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: colores.textoPrincipal,
    marginVertical: 40,
    textAlign: "center",
  },
  tiempo: {
    fontSize: 50,
    color: colores.secundario,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: colores.detalle,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 3,
  },
  btnTexto: {
    fontSize: 18,
    color: colores.fondo,
    fontWeight: "bold",
    textAlign: "center",
  },
  image:{
    alignSelf:'center',
    height:150,
    width:150,
    padding:20,
    borderRadius:50
  },
  contenedor: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    marginBottom:30,
    borderRadius:10,
    borderColor:colores.detalle,
    borderWidth:2,
    padding:20
  },
  titulo1: {
    fontSize: 28,
    color: colores.secundario,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  titulo2: {
    fontSize: 28,
    color: colores.terciario,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tiempo: {
    fontSize: 48,
    color: colores.principal,
    marginBottom: 40,
  },
  botones: {
    flexDirection: 'row',
    gap: 40,
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
