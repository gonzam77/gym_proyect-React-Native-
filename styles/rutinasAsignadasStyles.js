import { StyleSheet } from "react-native";
import { colores } from "./colores";
import { espaciado, radios, sombras, tipografia, toqueMinimo } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  content: {
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.lg,
    paddingBottom: espaciado.xxxl,
    flexGrow: 1,
  },

  // --- Encabezado ---
  header: {
    paddingHorizontal: espaciado.xxl,
    paddingTop: espaciado.sm,
    paddingBottom: espaciado.sm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: espaciado.md,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: colores.textoPrimario,
    fontWeight: "900",
  },
  refreshButton: {
    width: toqueMinimo + 2,
    height: toqueMinimo + 2,
    borderRadius: radios.completo,
    backgroundColor: colores.superficie,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colores.borde,
  },
  refreshButtonPresionado: {
    backgroundColor: colores.superficieAlta,
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },

  // --- Coach y gym ---
  infoGrid: {
    flexDirection: "row",
    gap: espaciado.md,
    marginTop: espaciado.lg,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: radios.md,
    padding: espaciado.md,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    gap: espaciado.xs,
  },
  infoLabel: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  infoSubvalue: {
    ...tipografia.micro,
    color: colores.textoSecundario,
    fontWeight: "500",
  },
  infoError: {
    ...tipografia.micro,
    color: colores.peligro,
  },

  // --- Banner de cambios del coach ---
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.md,
    marginHorizontal: espaciado.lg,
    marginTop: espaciado.md,
    padding: espaciado.md,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.acento,
    backgroundColor: "rgba(0, 224, 255, 0.12)",
  },
  bannerTexto: {
    flex: 1,
    ...tipografia.auxiliar,
    color: colores.textoPrimario,
  },
  bannerCerrar: {
    minWidth: toqueMinimo - 8,
    minHeight: toqueMinimo - 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Tarjeta de rutina asignada ---
  card: {
    marginBottom: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    padding: espaciado.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    ...sombras.card,
  },
  cardPresionada: {
    backgroundColor: colores.superficieAlta,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: espaciado.md,
  },
  routineName: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: espaciado.md,
    gap: espaciado.sm,
  },
  pill: {
    borderRadius: radios.sm,
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.xs,
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
  },
  pillText: {
    ...tipografia.micro,
    color: colores.acento,
  },
  pillInactiva: {
    borderColor: "transparent",
  },
  pillTextInactiva: {
    color: colores.textoSecundario,
  },

  // --- Boton agregar / actualizar ---
  addButton: {
    minHeight: toqueMinimo + 4,
    marginTop: espaciado.lg,
    borderRadius: radios.completo,
    backgroundColor: colores.exito,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: espaciado.sm,
    paddingHorizontal: espaciado.lg,
  },
  addButtonActualizar: {
    backgroundColor: colores.acento,
  },
  addButtonPresionado: {
    opacity: 0.8,
  },
  detailAddButton: {
    marginTop: espaciado.lg,
    marginBottom: espaciado.xs,
  },
  addButtonDisabled: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colores.borde,
  },
  addButtonText: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreRelleno,
    textAlign: "center",
  },
  addButtonTextDisabled: {
    color: colores.textoSecundario,
  },
  addButtonTextActualizar: {
    color: colores.sobreAcento,
  },

  // --- Errores y vacios ---
  emptyText: {
    ...tipografia.cuerpo,
    color: colores.textoTenue,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "rgba(229, 72, 77, 0.12)",
    borderColor: colores.peligro,
    borderWidth: 1,
    borderRadius: radios.md,
    padding: espaciado.lg,
    marginHorizontal: espaciado.lg,
    marginTop: espaciado.md,
    gap: espaciado.md,
  },
  errorFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
  },
  errorText: {
    flex: 1,
    ...tipografia.auxiliar,
    color: colores.peligro,
  },
  retryButton: {
    alignSelf: "center",
    minHeight: toqueMinimo,
    justifyContent: "center",
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.peligro,
    paddingHorizontal: espaciado.xl,
  },
  retryText: {
    ...tipografia.auxiliar,
    color: colores.peligro,
  },

  // --- Detalle de la rutina asignada ---
  detailContainer: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  detailContent: {
    paddingHorizontal: espaciado.xl,
    paddingBottom: espaciado.xxxl,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    paddingHorizontal: espaciado.md,
    paddingTop: espaciado.sm,
    marginBottom: espaciado.md,
  },
  detailTitle: {
    ...tipografia.titulo,
    color: colores.textoPrimario,
    flex: 1,
  },
  botonIcono: {
    minWidth: toqueMinimo,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    alignItems: "center",
    justifyContent: "center",
  },
  botonIconoPresionado: {
    backgroundColor: colores.superficieAlta,
  },
  sectionTitle: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
    marginTop: espaciado.lg,
    marginBottom: espaciado.md,
  },
  exerciseCard: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    marginBottom: espaciado.md,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
  },
  exerciseName: {
    ...tipografia.cuerpoFuerte,
    fontSize: 17,
    color: colores.textoPrimario,
  },
  exerciseGroup: {
    ...tipografia.micro,
    color: colores.acento,
    marginTop: espaciado.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  exerciseInfo: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
    marginTop: espaciado.sm,
  },
  comments: {
    ...tipografia.auxiliar,
    fontWeight: "500",
    color: colores.textoPrimario,
    marginTop: espaciado.sm,
    lineHeight: 20,
    paddingTop: espaciado.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.bordeSuave,
  },
});
