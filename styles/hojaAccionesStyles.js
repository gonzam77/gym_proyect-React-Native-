import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, sombras, tipografia, toqueMinimo } from "./theme";

export const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: radios.xl,
    borderTopRightRadius: radios.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colores.borde,
    paddingTop: espaciado.md,
    paddingBottom: espaciado.xxl,
    paddingHorizontal: espaciado.lg,
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
    ...tipografia.auxiliar,
    color: colores.textoTenue,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: espaciado.sm,
    paddingHorizontal: espaciado.xs,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.md,
    minHeight: toqueMinimo + 8,
    paddingHorizontal: espaciado.xs,
    borderRadius: radios.md,
  },
  opcionPresionada: {
    backgroundColor: colores.superficieAlta,
  },
  opcionTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  opcionTextoPeligro: {
    color: colores.peligro,
  },
  separador: {
    height: 1,
    backgroundColor: colores.bordeSuave,
    marginVertical: espaciado.xs,
  },
  cancelar: {
    marginTop: espaciado.md,
    minHeight: toqueMinimo,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelarTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoSecundario,
  },
});

export default styles;
