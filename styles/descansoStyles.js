import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

// Pantalla compacta: todo entra sin scroll en un telefono comun. Saltar /
// Detener van fijos abajo (estilo "pie").
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
    justifyContent: "center",
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.lg,
    gap: espaciado.lg,
  },

  // --- Encabezado ---
  encabezado: {
    alignItems: 'center',
    gap: espaciado.sm,
  },
  image: {
    height: 84,
    width: 84,
    borderRadius: radios.completo,
  },
  encabezadoTextos: {
    alignItems: 'center',
  },
  titulo: {
    ...tipografia.display,
    color: colores.textoPrimario,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  titulo1: {
    ...tipografia.cuerpo,
    color: colores.textoSecundario,
  },

  // --- Tarjeta del contador ---
  contenedor: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: radios.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingVertical: espaciado.xl,
    paddingHorizontal: espaciado.lg,
    gap: espaciado.md,
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
    gap: espaciado.md,
    marginTop: espaciado.sm,
    width: '100%',
  },
  botonRedondo: {
    width: 60,
    height: 60,
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
  botonAjuste: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  // --- Nota del ejercicio (una o dos lineas) ---
  tarjetaNota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    alignSelf: 'stretch',
    minHeight: toqueMinimo + 8,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
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

  // --- Pie fijo ---
  pie: {
    paddingHorizontal: espaciado.xl,
    paddingTop: espaciado.md,
    paddingBottom: espaciado.lg,
    gap: espaciado.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.bordeSuave,
  },
  aviso: {
    ...tipografia.cuerpoFuerte,
    color: colores.aviso,
    textAlign: 'center',
  },
  botonSaltar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    minHeight: 56,
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
    minHeight: 62,
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
    gap: espaciado.sm,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.aviso,
    backgroundColor: colores.superficie,
  },
  bannerPermisoTexto: {
    flex: 1,
    ...tipografia.micro,
    fontWeight: '500',
    color: colores.textoPrimario,
  },
});
