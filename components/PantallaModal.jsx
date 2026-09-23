import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { colores } from '../styles/colores';

/**
 * Raiz de las pantallas que se muestran dentro de un <Modal>.
 *
 * Un Modal de React Native abre su propia ventana, asi que queda fuera del
 * arbol del SafeAreaProvider de la app: adentro del modal los insets vuelven 0
 * y no falla, simplemente no aplica nada. Por eso cada modal necesita su propio
 * provider, sembrado con initialWindowMetrics.
 *
 * Con edge-to-edge (Android 15+) el contenido se dibuja atras de la barra de
 * estado y de la de navegacion, asi que por defecto se protegen los dos bordes.
 *
 * La altura va explicita a proposito: no alcanza con flex: 1. El <View> que el
 * Modal pone arriba de todo no tiene alto definido en la primera pasada de
 * layout, asi que un hijo con flex: 1 se estira hasta el alto de su contenido
 * en vez de quedar acotado a la ventana. Con un ScrollView adentro eso se nota
 * fuerte: queda mas alto que la pantalla, cree que su contenido entra entero y
 * no scrollea hasta que algo fuerza otra pasada (reordenar la lista, por
 * ejemplo).
 */
const PantallaModal = ({ children, style, edges = ['top', 'bottom'] }) => {
  const { height } = useWindowDimensions();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={[styles.fondo, { height }]}>
        <SafeAreaView style={[styles.contenido, style]} edges={edges}>
          {children}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default PantallaModal;

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    flex: 1,
  },
});
