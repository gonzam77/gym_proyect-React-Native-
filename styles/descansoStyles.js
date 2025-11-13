import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#43d112",
    marginVertical: 40,
    textAlign: "center",
  },
  tiempo: {
    fontSize: 50,
    color: "#ffffff",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#43d112",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 3,
  },
  btnTexto: {
    fontSize: 18,
    color: "#000",
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
    backgroundColor: '#000000',
    marginBottom:30,
    borderRadius:10,
    borderColor:'#43d112',
    borderWidth:2,
    padding:20
  },
  titulo2: {
    fontSize: 28,
    color: '#eefa07',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tiempo: {
    fontSize: 48,
    color: '#ffffff',
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
