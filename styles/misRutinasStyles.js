import { StyleSheet, Platform } from "react-native";
import { colores } from './colores';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondo: {
    backgroundColor:colores.azulProfundo,
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saludo: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  userName: {
    fontSize: 36,
    color: colores.blanco,
    fontWeight: '900',
    marginTop: -5,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  scroll: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 120, 
    flexGrow: 1,
  },
  entrenamiento: {
    marginBottom: 16,
    backgroundColor: colores.azulProfundoClaro, 
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width:0, height:8},
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      }
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.blanco,
    letterSpacing: 0.5,
  },
  tiempoContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tiempo: {
    fontSize: 16,
    fontWeight: "700",
    color: colores.cian,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reorderButtonsContainer: {
    gap: 6,
  },
  reorderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderButtonDisabled: {
    opacity: 0.35,
  },
  btnCircular: {
    position: 'absolute',
    right: 25,
    bottom: 35,
    zIndex: 10,
  },
  agregar: {
    width: 75,
    height: 75,
    shadowColor: colores.detalle,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  leyenda: {
    marginTop: 40,
    padding: 20,
    alignItems: 'center',
  },
  leyendaTexto: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
