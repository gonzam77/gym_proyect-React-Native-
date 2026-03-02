import { StyleSheet } from "react-native";
import {colores} from './colores';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.negro,
    padding: 20,
    justifyContent: "start",
  },
  titulo: {
    color: colores.blanco,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 30,
    textTransform:'uppercase'
  },
  finalizado :{
    color:colores.advertencia
  },
  infoBox: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism ligero
    borderRadius: 24,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal:20,
    // Sombra sutil para profundidad
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
  tituloDetalle:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'500',
    color:colores.blanco,
    paddingBottom:10
  },
  label: {
    fontSize: 18,
    color: colores.secundario,
    fontWeight: "700",
    marginBottom: 10,
  },
  valor: {
    color: colores.blanco,
    fontWeight: "600",
  },
  btn: {
    backgroundColor: colores.principal,
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
    color: colores.negro,
    fontWeight: "900",
    textAlign: "center",
  },
  estadistica:{
    fontSize:18,
    fontWeight:'500'
  },
  iconButton: {
    marginHorizontal: 10,
    backgroundColor: colores.negro,
    borderRadius: 50,
    elevation: 5,
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 20,
  },
  objetivos:{
    fontSize:15,
    paddingTop:10,
  },
  label2: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
  },
  card: {
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    alignItems: "flex-start",
    marginVertical: 20,
  },

});
