import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

// Pantalla compacta: todo tiene que entrar sin scroll en un telefono comun
// (~ 800 dp de alto util). Los botones de accion van fijos abajo.
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
    paddingBottom: espaciado.lg,
    gap: espaciado.lg,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
    paddingHorizontal: espaciado.md,
    paddingTop: espaciado.sm,
  },
  espaciador: {
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
  titulo: {
    ...tipografia.titulo,
    color: colores.textoPrimario,
    textAlign: "center",
    textTransform: 'uppercase',
  },
  imagen: {
    width: '100%',
  },

  // --- Progreso de series + datos ---
  tarjetaProgreso: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espaciado.lg,
    gap: espaciado.md,
    ...sombras.card,
  },
  filaProgreso: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: espaciado.md,
  },
  progresoNumero: {
    fontSize: 38,
    lineHeight: 42,
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
  datosDerecha: {
    alignItems: "flex-end",
    gap: 2,
    flexShrink: 1,
  },
  dato: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restantes: {
    ...tipografia.cuerpoFuerte,
    color: colores.acento,
    textAlign: "right",
  },
  label: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },

  // --- Nota (una o dos lineas) ---
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    minHeight: toqueMinimo + 8,
    borderRadius: radios.lg,
  },
  notaTextos: {
    flex: 1,
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

  // --- Registro de hoy (chips) ---
  registro: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.lg,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    gap: espaciado.sm,
  },
  registroEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chipsSeries: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espaciado.xs,
  },
  chipSerie: {
    paddingHorizontal: espaciado.md,
    paddingVertical: 5,
    borderRadius: radios.completo,
    backgroundColor: colores.superficieAlta,
  },
  chipSerieRegistrada: {
    backgroundColor: 'rgba(29, 191, 132, 0.16)',
  },
  chipSerieTexto: {
    ...tipografia.auxiliar,
    color: colores.textoPrimario,
  },

  // --- Estado de la serie ---
  enCurso: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.sm,
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

  // --- Acciones (fijas abajo) ---
  pie: {
    paddingHorizontal: espaciado.xl,
    paddingTop: espaciado.md,
    paddingBottom: espaciado.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.bordeSuave,
  },
  filaBotones: {
    flexDirection: "row",
    gap: espaciado.md,
  },
  botonFlexible: {
    flex: 1,
  },
  botonPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.sm,
    minHeight: 58,
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
    minHeight: 58,
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
