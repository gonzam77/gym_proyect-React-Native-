import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  cuerpo: {
    flex: 1,
    paddingHorizontal: espaciado.xl,
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: espaciado.sm,
    paddingBottom: espaciado.xs,
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
  botonSecundario: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonSecundarioTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  acciones: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
  },
  titulo: {
    ...tipografia.display,
    color: colores.textoPrimario,
    textAlign: "center",
    marginTop: espaciado.md,
  },
  metaFila: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: espaciado.lg,
    marginTop: espaciado.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
  },
  tiempo: {
    ...tipografia.cuerpoFuerte,
    color: colores.acento,
  },
  metaTexto: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },
  progresoContenedor: {
    marginTop: espaciado.lg,
    gap: espaciado.sm,
  },
  progresoTexto: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: espaciado.xl,
    paddingBottom: espaciado.xxxl,
    flexGrow: 1,
  },
  ejercicioItem: {
    backgroundColor: colores.superficie,
    borderRadius: radios.xl,
    padding: espaciado.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    overflow: 'hidden',
    ...sombras.card,
  },
  ejercicioItemPresionado: {
    backgroundColor: colores.superficieAlta,
    borderColor: colores.bordeSuave,
  },
  ejercicioItemArrastrado: {
    backgroundColor: colores.superficieAlta,
    borderColor: colores.acento,
    ...sombras.flotante,
  },
  filaPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaciado.md,
  },
  datos: {
    flex: 1,
  },
  ejercicioNombre: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
    marginBottom: espaciado.xs,
  },
  ejercicioDetalle: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },
  badgeFinalizado: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: espaciado.xs,
    marginTop: espaciado.sm,
    paddingHorizontal: espaciado.sm,
    paddingVertical: espaciado.xs,
    borderRadius: radios.md,
    backgroundColor: 'rgba(29, 191, 132, 0.16)',
    borderWidth: 1,
    borderColor: colores.exito,
  },
  badgeFinalizadoTexto: {
    ...tipografia.micro,
    color: colores.exito,
  },
  seriesProgreso: {
    marginTop: espaciado.lg,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  manija: {
    width: toqueMinimo,
    height: toqueMinimo,
    borderRadius: radios.md,
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manijaActiva: {
    backgroundColor: colores.borde,
    borderColor: colores.acento,
  },
});
