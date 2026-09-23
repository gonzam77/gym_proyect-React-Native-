import { StyleSheet } from "react-native";
import { colores } from './colores';
import { espaciado, radios, sombras, tipografia, toqueMinimo } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondo: {
    backgroundColor: colores.fondo,
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: espaciado.xxl,
    paddingTop: espaciado.sm,
    paddingBottom: espaciado.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaciado.md,
  },
  headerTextos: {
    flex: 1,
  },
  saludo: {
    ...tipografia.micro,
    color: colores.textoTenue,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  userName: {
    fontSize: 30,
    lineHeight: 36,
    color: colores.textoPrimario,
    fontWeight: '900',
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: radios.completo,
    borderWidth: 2,
    borderColor: colores.borde,
  },
  lista: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.sm,
    paddingBottom: 120,
    flexGrow: 1,
  },
  entrenamiento: {
    backgroundColor: colores.superficie,
    borderRadius: radios.xl,
    padding: espaciado.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    overflow: 'hidden',
    ...sombras.card,
  },
  entrenamientoPresionado: {
    backgroundColor: colores.superficieAlta,
    borderColor: colores.bordeSuave,
  },
  entrenamientoArrastrado: {
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
  nombre: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.textoPrimario,
    letterSpacing: 0.5,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: espaciado.sm,
    paddingHorizontal: espaciado.sm,
    paddingVertical: espaciado.xs,
    borderRadius: radios.md,
    backgroundColor: 'rgba(0, 224, 255, 0.16)',
    borderWidth: 1,
    borderColor: colores.acento,
    gap: espaciado.xs,
  },
  syncBadgeText: {
    ...tipografia.micro,
    color: colores.acento,
  },
  metaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: espaciado.md,
    marginTop: espaciado.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
  },
  tiempo: {
    ...tipografia.auxiliar,
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
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  btnCircular: {
    position: 'absolute',
    right: espaciado.xxl,
    bottom: espaciado.xxxl,
    zIndex: 10,
    borderRadius: radios.completo,
  },
  agregar: {
    width: 72,
    height: 72,
    shadowColor: colores.principal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
});
