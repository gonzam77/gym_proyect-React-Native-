import { StyleSheet } from 'react-native';
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

/**
 * Estilos propios de la pestaña Funcional (listado, detalle, formulario y
 * resumen). Lo que es igual a las rutinas de fuerza se toma de sus estilos
 * (misRutinasStyles, detalleRutinaStyles, formRutinaStyles,
 * formEjercicioStyles); aca va solo lo nuevo.
 */
export const styles = StyleSheet.create({
  // --- Aviso de sesion sin terminar ---
  sesionPendiente: {
    marginHorizontal: espaciado.lg,
    marginBottom: espaciado.md,
    padding: espaciado.lg,
    gap: espaciado.md,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.acento,
    backgroundColor: colores.superficie,
  },
  sesionPendienteFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  sesionPendienteTexto: {
    ...tipografia.auxiliar,
    flex: 1,
    color: colores.textoPrimario,
  },
  sesionPendienteBotones: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },

  // --- Botones genericos ---
  botonPrimario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xs,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.completo,
    backgroundColor: colores.principal,
  },
  botonPrimarioTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreAcento,
  },
  botonContorno: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xs,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonContornoTexto: {
    ...tipografia.auxiliar,
    color: colores.textoPrimario,
  },
  presionado: {
    opacity: 0.75,
  },

  // --- Detalle ---
  cabeceraDetalle: {
    marginBottom: espaciado.xl,
  },
  botonIniciar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    minHeight: 56,
    marginTop: espaciado.lg,
    borderRadius: radios.completo,
    backgroundColor: colores.principal,
    ...sombras.flotante,
  },
  botonIniciarTexto: {
    ...tipografia.subtitulo,
    color: colores.sobreAcento,
  },
  datosFuncional: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
    marginTop: espaciado.md,
  },
  dato: {
    flexGrow: 1,
    minWidth: '45%',
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
  },
  datoEtiqueta: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  datoValor: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
    marginTop: 2,
  },
  imagenBloque: {
    marginTop: espaciado.md,
  },
  notaBloque: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
    fontStyle: 'italic',
    marginTop: espaciado.xs,
  },
  numeroBloque: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficieAlta,
  },
  numeroBloqueTexto: {
    ...tipografia.micro,
    color: colores.acento,
  },
  filaBloque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
  },
  tiemposBloque: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.xs,
    marginTop: espaciado.xs,
  },
  chipTrabajo: {
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    borderRadius: radios.completo,
    backgroundColor: 'rgba(70, 237, 52, 0.12)',
  },
  chipTrabajoTexto: {
    ...tipografia.micro,
    color: colores.principal,
  },
  chipDescanso: {
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    borderRadius: radios.completo,
    backgroundColor: 'rgba(0, 224, 255, 0.10)',
  },
  chipDescansoTexto: {
    ...tipografia.micro,
    color: colores.acento,
  },

  // --- Formulario ---
  filaVueltas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.lg,
  },
  vueltasValor: {
    ...tipografia.titulo,
    minWidth: 48,
    textAlign: 'center',
    color: colores.textoPrimario,
    fontVariant: ['tabular-nums'],
  },
  modos: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  modo: {
    flex: 1,
    padding: espaciado.md,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    gap: 2,
  },
  modoActivo: {
    borderColor: colores.principal,
    backgroundColor: colores.superficieAlta,
  },
  modoTitulo: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  modoDescripcion: {
    ...tipografia.micro,
    fontWeight: '500',
    color: colores.textoSecundario,
  },
  duracion: {
    ...tipografia.auxiliar,
    color: colores.acento,
  },
  seccion: {
    marginTop: espaciado.lg,
    gap: espaciado.sm,
  },
  ayuda: {
    ...tipografia.micro,
    fontWeight: '500',
    color: colores.textoTenue,
  },
  avisoCatalogo: {
    flexDirection: 'row',
    gap: espaciado.sm,
    alignItems: 'center',
    padding: espaciado.md,
    borderRadius: radios.md,
    backgroundColor: colores.superficie,
  },
  avisoCatalogoTexto: {
    ...tipografia.auxiliar,
    flex: 1,
    color: colores.textoSecundario,
  },

  // --- Resumen ---
  resumen: {
    flexGrow: 1,
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.xl,
    gap: espaciado.lg,
  },
  // El boton de "Listo" va solo en una columna: sin flex, ocupa su alto.
  botonAncho: {
    flex: 0,
    minHeight: 52,
  },
  resumenIcono: {
    alignSelf: 'center',
  },
  resumenTitulo: {
    ...tipografia.display,
    color: colores.textoPrimario,
    textAlign: 'center',
  },
  resumenSubtitulo: {
    ...tipografia.cuerpo,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
  resumenGrilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
  },
  resumenBloques: {
    gap: espaciado.xs,
  },
  resumenFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espaciado.md,
    paddingVertical: espaciado.xs,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeSuave,
  },
  resumenFilaNombre: {
    ...tipografia.auxiliar,
    flex: 1,
    color: colores.textoPrimario,
  },
  resumenFilaDato: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
    fontVariant: ['tabular-nums'],
  },
  estadoCompleto: {
    color: colores.exito,
  },
  estadoParcial: {
    color: colores.aviso,
  },
  estadoSalteado: {
    color: colores.textoTenue,
  },
});
