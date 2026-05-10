import { StyleSheet, Platform } from "react-native";
import {colores} from './colores';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.azulProfundo,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingBottom: 70,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "900",
    color: colores.blanco,
    marginVertical: 35,
    textAlign: "center",
  },
  btn: {
    backgroundColor: colores.principal,
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
    marginBottom: 16,
    backgroundColor: colores.azulProfundoClaro, 
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal:20,
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
    borderRadius:10
  },
  titulo1: {
    fontSize: 24,
    color: colores.secundario,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  titulo2: {
    fontSize: 24,
    color: colores.cian,
    marginBottom: 20,
    fontWeight: 'bold',
    paddingHorizontal:15
  },
  tiempo: {
    fontSize: 48,
    color: colores.blanco,
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
  stopButton: {
    marginTop: 30,
  },
});
