import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, sombras, tipografia, toqueMinimo } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  content: {
    padding: espaciado.lg,
    paddingBottom: espaciado.xxxl,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espaciado.lg,
    marginBottom: espaciado.md,
    ...sombras.card,
  },
  tituloTarjeta: {
    ...tipografia.cuerpoFuerte,
    fontSize: 17,
    color: colores.textoPrimario,
  },
  dato: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
    marginTop: espaciado.xs,
    fontWeight: "500",
  },
  boton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.sm,
    minHeight: toqueMinimo,
    marginTop: espaciado.lg,
    borderRadius: radios.completo,
    backgroundColor: colores.exito,
  },
  botonPresionado: {
    opacity: 0.75,
  },
  botonTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreRelleno,
  },
  errorCaja: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    marginTop: espaciado.md,
    padding: espaciado.md,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.peligro,
    backgroundColor: "rgba(229, 72, 77, 0.12)",
  },
  errorTexto: {
    flex: 1,
    ...tipografia.auxiliar,
    color: colores.peligro,
  },
  categoria: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    marginBottom: espaciado.md,
    overflow: "hidden",
  },
  categoriaEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espaciado.md,
    minHeight: toqueMinimo + 8,
    paddingHorizontal: espaciado.lg,
  },
  categoriaEncabezadoPresionado: {
    backgroundColor: colores.superficieAlta,
  },
  categoriaNombre: {
    flex: 1,
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  contador: {
    ...tipografia.micro,
    color: colores.acento,
  },
  listaEjercicios: {
    paddingHorizontal: espaciado.lg,
    paddingBottom: espaciado.lg,
    gap: espaciado.sm,
  },
  ejercicio: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    paddingTop: espaciado.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.bordeSuave,
  },
  ejercicioNombre: {
    flex: 1,
    ...tipografia.cuerpo,
    color: colores.textoSecundario,
  },
});

export default styles;
