import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  scrollContent: {
    paddingHorizontal: espaciado.xl,
    paddingBottom: espaciado.xxxl,
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: espaciado.sm,
    paddingTop: espaciado.sm,
  },
  acciones: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
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
  botonEliminar: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.peligro,
  },
  botonEliminarTexto: {
    ...tipografia.auxiliar,
    color: colores.peligro,
  },
  botonGuardar: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    minHeight: toqueMinimo,
    paddingHorizontal: espaciado.xl,
    borderRadius: radios.completo,
    backgroundColor: colores.exito,
  },
  botonGuardarTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreRelleno,
  },
  presionado: {
    opacity: 0.75,
  },
  titulo: {
    ...tipografia.titulo,
    color: colores.textoPrimario,
    textAlign: "center",
    marginTop: espaciado.lg,
    marginBottom: espaciado.xl,
  },
  seccion: {
    marginBottom: espaciado.xl,
    gap: espaciado.sm,
  },
  label: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },
  ayuda: {
    ...tipografia.micro,
    color: colores.textoTenue,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colores.superficie,
    color: colores.textoPrimario,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.md,
    fontSize: 16,
    minHeight: toqueMinimo + 4,
    textAlignVertical: "top",
  },
  inputNota: {
    minHeight: 110,
  },
  errorCaja: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    marginBottom: espaciado.xl,
    padding: espaciado.md,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.peligro,
    backgroundColor: "rgba(229, 72, 77, 0.12)",
  },
  error: {
    flex: 1,
    ...tipografia.auxiliar,
    color: colores.peligro,
  },
});
