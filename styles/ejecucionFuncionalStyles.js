import { StyleSheet } from 'react-native';
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

/**
 * Pantalla de ejecucion de un funcional. Se lee con el telefono apoyado en el
 * piso a uno o dos metros: la cuenta regresiva y la fase van muy grandes, y los
 * controles quedan fijos abajo, al alcance aunque se scrollee.
 */
export const COLOR_FASE = {
  preparacion: colores.aviso,
  trabajo: colores.principal,
  descanso: colores.acento,
  descansoVueltas: colores.acento,
  espera: colores.textoSecundario,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.sm,
  },
  botonIcono: {
    minWidth: toqueMinimo,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: {
    opacity: 0.7,
  },
  nombreFuncional: {
    ...tipografia.cuerpoFuerte,
    flex: 1,
    color: colores.textoSecundario,
  },
  modo: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.md,
    gap: espaciado.md,
  },
  fase: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  ejercicio: {
    ...tipografia.titulo,
    color: colores.textoPrimario,
    textAlign: 'center',
  },
  nota: {
    ...tipografia.cuerpo,
    color: colores.textoSecundario,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  reloj: {
    fontSize: 112,
    lineHeight: 120,
    fontWeight: '200',
    color: colores.textoPrimario,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  relojPausado: {
    opacity: 0.45,
  },
  textoEspera: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
    textAlign: 'center',
  },
  posicion: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
    textAlign: 'center',
  },
  siguiente: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
  imagen: {
    alignSelf: 'center',
    maxWidth: 520,
  },
  pie: {
    paddingHorizontal: espaciado.xl,
    paddingTop: espaciado.md,
    paddingBottom: espaciado.lg,
    gap: espaciado.md,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSuave,
    backgroundColor: colores.fondo,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  botonControl: {
    alignItems: 'center',
    gap: 2,
    minWidth: 72,
    minHeight: toqueMinimo,
    justifyContent: 'center',
  },
  botonControlTexto: {
    ...tipografia.micro,
    color: colores.textoSecundario,
  },
  botonPrincipal: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.principal,
    ...sombras.flotante,
  },
  botonIniciarEspera: {
    flexDirection: 'row',
    gap: espaciado.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    borderRadius: radios.completo,
    backgroundColor: colores.principal,
    ...sombras.flotante,
  },
  botonIniciarEsperaTexto: {
    ...tipografia.subtitulo,
    color: colores.sobreAcento,
  },
  botonTerminar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xs,
    minHeight: toqueMinimo,
  },
  botonTerminarTexto: {
    ...tipografia.auxiliar,
    color: colores.peligro,
  },
  bannerPermiso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    padding: espaciado.md,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.aviso,
    backgroundColor: colores.superficie,
  },
  bannerPermisoTexto: {
    ...tipografia.auxiliar,
    flex: 1,
    color: colores.textoPrimario,
  },
});
