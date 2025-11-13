import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: "start",
  },
  titulo: {
    color: "#43d112",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 30,
  },
  infoBox: {
    backgroundColor: "#111111",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#43d112',
    borderRightWidth: 4,
    borderRightColor: '#43d112',
  },
  tituloDetalle:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'700',
    color:"#43d112",
  },
  label: {
    fontSize: 18,
    color: "#eefa07",
    fontWeight: "700",
    marginBottom: 10,
  },
  valor: {
    color: "#fff",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#43d112",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    elevation: 3,
    marginBottom:20

  },
  btnVolver: {
    backgroundColor: "#eefa07",
    borderTopStartRadius:30,
    borderBottomStartRadius:30,
    borderColor:'#43d112',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    elevation: 3,
    marginVertical:20,
    marginRight:5
  },
  btnDescanso: {
    backgroundColor: '#eefa07',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    elevation: 3,
    marginBottom:20
  },
  btnTexto: {
    fontSize:18,
    color: "#000",
    fontWeight: "900",
    textAlign: "center",
  },
  estadistica:{
    fontSize:23,
    fontWeight:'800'
  },
  iconButton: {
    marginHorizontal: 10,
    backgroundColor: "#1a1a1a",
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
