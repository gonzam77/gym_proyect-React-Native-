import { StyleSheet, View } from 'react-native';
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
 */
const PantallaModal = ({ children, style, edges = ['top', 'bottom'] }) => (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <View style={styles.fondo}>
      <SafeAreaView style={[styles.contenido, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  </SafeAreaProvider>
);

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
