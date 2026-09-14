import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: espaciado.xl,
    paddingBottom: espaciado.xxxl,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: espaciado.sm,
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
  titulo: {
    ...tipografia.display,
    color: colores.textoPrimario,
    textAlign: "center",
    marginTop: espaciado.lg,
    textTransform: 'uppercase',
  },

  // --- Progreso de series ---
  tarjetaProgreso: {
    marginTop: espaciado.xl,
    backgroundColor: colores.superficie,
    borderRadius: radios.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espaciado.xl,
    gap: espaciado.md,
    ...sombras.card,
  },
  filaProgreso: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  progresoNumero: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    color: colores.textoPrimario,
  },
  progresoTotal: {
    ...tipografia.subtitulo,
    color: colores.textoTenue,
  },
  progresoEtiqueta: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  restantes: {
    ...tipografia.cuerpoFuerte,
    color: colores.acento,
    textAlign: "right",
  },

  // --- Detalle ---
  infoBox: {
    marginTop: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: radios.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingVertical: espaciado.lg,
    paddingHorizontal: espaciado.xl,
    ...sombras.card,
  },
  filaDato: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: espaciado.sm,
  },
  separador: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colores.bordeSuave,
  },
  label: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },
  valor: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },

  // --- Nota ---
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espaciado.xl,
    borderRadius: radios.xl,
    marginTop: espaciado.lg,
    ...sombras.card,
  },
  notaTextos: {
    flex: 1,
    gap: espaciado.xs,
  },
  notaTexto: {
    ...tipografia.cuerpo,
    color: colores.textoPrimario,
  },
  notaVacia: {
    ...tipografia.cuerpo,
    color: colores.textoTenue,
    fontStyle: 'italic',
  },

  // --- Estado de la serie ---
  enCurso: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.sm,
    marginTop: espaciado.xxl,
  },
  puntoEnCurso: {
    width: 10,
    height: 10,
    borderRadius: radios.completo,
    backgroundColor: colores.principal,
  },
  enCursoTexto: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
  },
  badgeFinalizado: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: espaciado.sm,
    marginTop: espaciado.xxl,
    paddingHorizontal: espaciado.lg,
    paddingVertical: espaciado.sm,
    borderRadius: radios.completo,
    backgroundColor: 'rgba(29, 191, 132, 0.16)',
    borderWidth: 1,
    borderColor: colores.exito,
  },
  badgeFinalizadoTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.exito,
  },
  felicitaciones: {
    ...tipografia.cuerpo,
    color: colores.textoSecundario,
    textAlign: "center",
    marginTop: espaciado.md,
  },

  // --- Acciones ---
  acciones: {
    marginTop: espaciado.xxl,
    gap: espaciado.md,
  },
  botonPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.sm,
    minHeight: 60,
    borderRadius: radios.completo,
    backgroundColor: colores.principal,
  },
  botonPrincipalTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: colores.sobreAcento,
    textTransform: "uppercase",
  },
  botonCompletar: {
    backgroundColor: colores.exito,
  },
  botonCompletarTexto: {
    color: colores.sobreRelleno,
  },
  botonSecundario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.sm,
    minHeight: toqueMinimo + 4,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonSecundarioTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  error: {
    ...tipografia.cuerpo,
    color: colores.peligro,
    textAlign: 'center',
    margin: espaciado.xl,
  },
});
