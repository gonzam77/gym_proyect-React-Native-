import { StyleSheet } from "react-native";
import { colores } from './colores'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colores.fondo,
    paddingHorizontal: 20,
    paddingTop:30,
  },
  scroll: {
    flex: 1,
  },
  finalizado: {
    color: colores.advertencia
  },
  titulo: {
    fontSize: 35,
    fontWeight: "700",
    color: colores.principal,
    textAlign: "center",
  },
  tiempo: {
    fontSize: 20,
    fontWeight: "600",
    color: colores.terciario,
    textAlign: "center",
    marginVertical: 10,
  },
  listaEjercicios:{
    marginVertical:30
  },
  ejercicioItem: {
    backgroundColor: colores.fondo,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 10,
    borderBottomWidth: 2,
    borderBottomColor: colores.detalle,
    borderRightWidth: 2,
    borderRightColor: colores.detalle,
    opacity:1
  },
  ejercicioNombre: {
    color: colores.principal,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  ejercicioDetalle: {
    color: colores.secundario,
    fontSize: 16,
    fontWeight: "600",
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 10,
  },
})