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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.xl,
  },
  image: {
    alignSelf: 'center',
    height: 110,
    width: 110,
    borderRadius: radios.completo,
  },
  titulo: {
    ...tipografia.display,
    color: colores.textoPrimario,
    marginTop: espaciado.lg,
    textAlign: "center",
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  titulo1: {
    ...tipografia.cuerpo,
    color: colores.textoSecundario,
    marginTop: espaciado.xs,
    marginBottom: espaciado.xl,
    textAlign: 'center',
  },

  // --- Tarjeta del contador ---
  contenedor: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: radios.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingVertical: espaciado.xxl,
    paddingHorizontal: espaciado.xl,
    gap: espaciado.lg,
    ...sombras.card,
  },
  titulo2: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  tiempo: {
    fontSize: 68,
    lineHeight: 74,
    fontWeight: '200',
    color: colores.textoPrimario,
    fontVariant: ['tabular-nums'],
  },
  tiempoTerminado: {
    color: colores.principal,
  },
  barra: {
    width: '100%',
  },
  botones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xl,
    marginTop: espaciado.xs,
  },
  botonRedondo: {
    width: 64,
    height: 64,
    borderRadius: radios.completo,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficieAlta,
  },
  botonPresionado: {
    opacity: 0.7,
  },

  // --- Ajustes rapidos de tiempo ---
  ajustes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: espaciado.md,
    marginTop: espaciado.md,
    width: '100%',
  },
  botonAjuste: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xs,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonAjusteTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  botonAjusteDeshabilitado: {
    opacity: 0.35,
  },

  // --- Nota del ejercicio ---
  tarjetaNota: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: espaciado.md,
    alignSelf: 'stretch',
    marginTop: espaciado.lg,
    padding: espaciado.lg,
    borderRadius: radios.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  notaTextos: {
    flex: 1,
    gap: espaciado.xs,
  },
  notaEtiqueta: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: 'uppercase',
    letterSpacing: 1,
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

  // --- Cierre ---
  aviso: {
    ...tipografia.cuerpoFuerte,
    color: colores.aviso,
    textAlign: 'center',
    marginTop: espaciado.xl,
  },
  botonSaltar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    alignSelf: 'stretch',
    minHeight: 56,
    marginTop: espaciado.xl,
    borderRadius: radios.completo,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonSaltarTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
    textTransform: 'uppercase',
  },
  botonDetener: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    alignSelf: 'stretch',
    minHeight: 64,
    marginTop: espaciado.md,
    borderRadius: radios.completo,
    backgroundColor: colores.peligro,
  },
  botonDetenerTexto: {
    fontSize: 18,
    fontWeight: '900',
    color: colores.sobreRelleno,
    textTransform: 'uppercase',
  },

  // --- Banner de permiso ---
  bannerPermiso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    marginBottom: espaciado.xl,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.aviso,
    backgroundColor: colores.superficie,
  },
  bannerPermisoTexto: {
    flex: 1,
    ...tipografia.auxiliar,
    color: colores.textoPrimario,
  },
});
