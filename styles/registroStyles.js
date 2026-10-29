import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
  // --- Hoja (modal) ---
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  zonaCerrar: {
    flex: 1,
  },
  hoja: {
    maxHeight: "88%",
    backgroundColor: colores.superficie,
    borderTopLeftRadius: radios.xl,
    borderTopRightRadius: radios.xl,
    paddingTop: espaciado.md,
    paddingHorizontal: espaciado.xl,
  },
  manija: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.borde,
    marginBottom: espaciado.md,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
  },
  subtitulo: {
    ...tipografia.auxiliar,
    fontWeight: "500",
    color: colores.textoTenue,
    marginTop: espaciado.xs,
    marginBottom: espaciado.md,
  },
  encabezadoColumnas: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    paddingBottom: espaciado.xs,
  },
  columnaSerie: {
    width: 64,
  },
  columnaDato: {
    flex: 1,
  },
  columnaAccion: {
    width: toqueMinimo + 8,
    alignItems: "center",
  },
  etiquetaColumna: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: "uppercase",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    paddingVertical: espaciado.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.bordeSuave,
  },
  filaSalteada: {
    opacity: 0.5,
  },
  serieTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  input: {
    backgroundColor: colores.fondo,
    color: colores.textoPrimario,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.md,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  botonIcono: {
    minWidth: toqueMinimo,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    alignItems: "center",
    justifyContent: "center",
  },
  presionado: {
    opacity: 0.7,
  },
  botonera: {
    flexDirection: "row",
    gap: espaciado.md,
    paddingTop: espaciado.lg,
  },
  botonSecundario: {
    flex: 1,
    minHeight: toqueMinimo + 4,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: "center",
    justifyContent: "center",
  },
  botonSecundarioTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  botonPrincipal: {
    flex: 1,
    flexDirection: "row",
    gap: espaciado.sm,
    minHeight: toqueMinimo + 4,
    borderRadius: radios.completo,
    backgroundColor: colores.exito,
    alignItems: "center",
    justifyContent: "center",
  },
  botonPrincipalTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreRelleno,
  },

  // --- Tarjeta rapida compacta (pantalla de descanso) ---
  tarjetaCompacta: {
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    gap: espaciado.sm,
  },
  filaCompacta: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
  },
  inputCompacto: {
    flex: 1,
    minWidth: 0,
  },
  botonSaltarCompacto: {
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: "center",
    justifyContent: "center",
  },
  botonGuardarCompacto: {
    width: toqueMinimo,
    height: toqueMinimo,
    borderRadius: radios.completo,
    backgroundColor: colores.exito,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Tarjeta rapida (pantalla de descanso) ---
  tarjeta: {
    marginTop: espaciado.lg,
    padding: espaciado.lg,
    borderRadius: radios.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    gap: espaciado.sm,
  },
  tarjetaEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espaciado.sm,
  },
  tarjetaTitulo: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  tarjetaAyuda: {
    ...tipografia.micro,
    fontWeight: "500",
    color: colores.textoTenue,
  },
  filaInputs: {
    flexDirection: "row",
    gap: espaciado.md,
  },
  campo: {
    flex: 1,
    gap: espaciado.xs,
  },
  campoEtiqueta: {
    ...tipografia.micro,
    color: colores.textoSecundario,
  },
  enlace: {
    ...tipografia.auxiliar,
    color: colores.acento,
  },
  resumen: {
    ...tipografia.cuerpo,
    color: colores.exito,
  },

  // --- Lista de series (detalle de ejercicio / historial) ---
  listaSeries: {
    gap: espaciado.xs,
  },
  filaSerie: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espaciado.md,
    paddingVertical: espaciado.xs,
  },
  filaSerieNumero: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },
  filaSerieDato: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  filaSerieDatoTenue: {
    ...tipografia.auxiliar,
    color: colores.textoTenue,
    fontStyle: "italic",
  },
});
