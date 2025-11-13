import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor:'#000',
  paddingHorizontal: 20,
  paddingTop:30,
},
scroll: {
  flex: 1,
},
iconos:{
  width:50,
  height:50
}, 
titulo: {
  fontSize: 35,
  fontWeight: "700",
  color: "#43d112",
  textAlign: "center",
},
tiempo: {
  fontSize: 20,
  fontWeight: "600",
  color: "#2f95f5ff",
  textAlign: "center",
  marginVertical: 10,
},
listaEjercicios:{
  marginVertical:30
},
ejercicioItem: {
  backgroundColor: "#111111",
  borderRadius: 10,
  padding: 15,
  marginBottom: 15,
  elevation: 10,
  borderBottomWidth: 2,
  borderBottomColor: '#43d112',
  borderRightWidth: 2,
  borderRightColor: '#43d112',
  opacity:1
},
ejercicioNombre: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 5,
},
ejercicioDetalle: {
  color: "#eefa07",
  fontSize: 16,
  fontWeight: "600",
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
  marginVertical: 10,
},
})