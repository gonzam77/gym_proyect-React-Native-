import { StyleSheet } from "react-native";
import {colores} from './colores';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colores.textoPrincipal,
    marginBottom: 25,
    textAlign: "center",
  },
  seccion: {
    marginBottom: 20,
  },
  label: {
    color: colores.secundario,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: "#111111",
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
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
    marginBottom: 20,
  },
});
