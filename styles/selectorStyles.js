import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, sombras, tipografia, toqueMinimo } from "./theme";

export const styles = StyleSheet.create({
  // --- Disparador ---
  disparador: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espaciado.md,
    minHeight: toqueMinimo + 4,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  disparadorPresionado: {
    backgroundColor: colores.superficieAlta,
  },
  disparadorDeshabilitado: {
    opacity: 0.5,
  },
  valor: {
    flex: 1,
    ...tipografia.cuerpo,
    color: colores.textoPrimario,
  },
  placeholder: {
    color: colores.textoTenue,
  },

  // --- Hoja de opciones ---
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  hoja: {
    maxHeight: "85%",
    backgroundColor: colores.superficie,
    borderTopLeftRadius: radios.xl,
    borderTopRightRadius: radios.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colores.borde,
    paddingTop: espaciado.md,
    ...sombras.flotante,
  },
  manija: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: radios.completo,
    backgroundColor: colores.borde,
    marginBottom: espaciado.md,
  },
  titulo: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
    paddingHorizontal: espaciado.xl,
    marginBottom: espaciado.md,
  },
  buscador: {
    marginHorizontal: espaciado.xl,
    marginBottom: espaciado.sm,
    paddingHorizontal: espaciado.lg,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.fondo,
    color: colores.textoPrimario,
    fontSize: 16,
  },
  lista: {
    paddingHorizontal: espaciado.md,
    paddingBottom: espaciado.md,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espaciado.md,
    minHeight: toqueMinimo + 4,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.md,
  },
  opcionPresionada: {
    backgroundColor: colores.superficieAlta,
  },
  opcionTexto: {
    flex: 1,
    ...tipografia.cuerpo,
    color: colores.textoPrimario,
  },
  opcionTextoSeleccionada: {
    color: colores.principal,
    fontWeight: "700",
  },
  vacio: {
    ...tipografia.cuerpo,
    color: colores.textoTenue,
    textAlign: "center",
    paddingVertical: espaciado.xl,
  },
  cerrar: {
    minHeight: toqueMinimo,
    marginHorizontal: espaciado.xl,
    marginTop: espaciado.sm,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: "center",
    justifyContent: "center",
  },
  cerrarTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoSecundario,
  },
});

export default styles;
