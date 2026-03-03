import { StyleSheet } from "react-native";
import { colores } from './colores'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colores.negro,
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
    fontSize: 28,
    fontWeight: "500",
    color: colores.blanco,
    textAlign: "center",
    marginTop:20
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
      marginBottom: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      borderRadius: 24,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        android: {
          elevation: 6,
        }
      }),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      overflow: 'hidden',
  },
  ejercicioNombre: {
    color: colores.blanco,
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