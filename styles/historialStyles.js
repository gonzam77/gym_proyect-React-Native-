import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    padding: espaciado.lg,
    paddingBottom: espaciado.xxxl,
    gap: espaciado.md,
    flexGrow: 1,
  },
  barra: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: espaciado.xs,
  },
  barraTexto: {
    ...tipografia.auxiliar,
    color: colores.textoTenue,
  },
  botonBorrar: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.peligro,
  },
  botonBorrarTexto: {
    ...tipografia.auxiliar,
    color: colores.peligro,
  },
  presionado: {
    opacity: 0.75,
  },

  // --- Tarjeta de dia ---
  dia: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    padding: espaciado.lg,
    gap: espaciado.sm,
    ...sombras.sutil,
  },
  diaPresionado: {
    backgroundColor: colores.superficieAlta,
  },
  diaEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.md,
  },
  diaTextos: {
    flex: 1,
  },
  diaNombre: {
    ...tipografia.micro,
    color: colores.acento,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  diaFecha: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espaciado.xs,
  },
  chip: {
    paddingHorizontal: espaciado.sm,
    paddingVertical: 3,
    borderRadius: radios.completo,
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
  },
  chipTexto: {
    ...tipografia.micro,
    color: colores.textoPrimario,
  },
  meta: {
    ...tipografia.auxiliar,
    fontWeight: "500",
    color: colores.textoSecundario,
  },
  botonIcono: {
    minWidth: toqueMinimo,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Detalle del dia ---
  cuerpo: {
    flex: 1,
  },
  botonera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.sm,
  },
  detalleContenido: {
    paddingHorizontal: espaciado.lg,
    paddingBottom: espaciado.xxxl,
    gap: espaciado.md,
  },
  detalleTitulo: {
    ...tipografia.titulo,
    color: colores.textoPrimario,
  },
  seccionRutina: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: espaciado.md,
  },
  ejercicio: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    padding: espaciado.lg,
    gap: espaciado.sm,
  },
  ejercicioEncabezado: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espaciado.md,
  },
  ejercicioNombre: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
    flex: 1,
  },
  hora: {
    ...tipografia.micro,
    color: colores.textoTenue,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: espaciado.sm,
    paddingVertical: 3,
    borderRadius: radios.completo,
  },
  badgeCompleto: {
    backgroundColor: "rgba(29, 191, 132, 0.15)",
  },
  badgeIncompleto: {
    backgroundColor: "rgba(221, 92, 0, 0.15)",
  },
  badgeTexto: {
    ...tipografia.micro,
  },
  badgeTextoCompleto: {
    color: colores.exito,
  },
  badgeTextoIncompleto: {
    color: colores.aviso,
  },
  ejercicioSeparado: {
    marginTop: espaciado.sm,
  },
  imagen: {
    marginTop: espaciado.xs,
  },
  editar: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
    alignSelf: "flex-start",
    minHeight: toqueMinimo,
  },
  editarTexto: {
    ...tipografia.auxiliar,
    color: colores.acento,
  },
});
