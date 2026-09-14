import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

import { colores } from '../styles/colores';
import { espaciado, maxEscalaFuente, radios, sombras, tipografia } from '../styles/theme';

const Aviso = ({ icono, color, text1, text2 }) => (
  <View style={[styles.contenedor, { borderLeftColor: color }]}>
    <Icon name={icono} size={22} color={color} />
    <View style={styles.textos}>
      <Text style={styles.titulo} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
        {text1}
      </Text>
      {text2 ? (
        <Text style={styles.detalle} numberOfLines={3} maxFontSizeMultiplier={maxEscalaFuente}>
          {text2}
        </Text>
      ) : null}
    </View>
  </View>
);

const configuracion = {
  exito: props => <Aviso {...props} icono="checkmark-circle" color={colores.exito} />,
  error: props => <Aviso {...props} icono="alert-circle" color={colores.peligro} />,
  info: props => <Aviso {...props} icono="information-circle" color={colores.acento} />,
};

/**
 * Se monta una sola vez, en la raiz de la app.
 *
 * El desplazamiento superior sale del inset real y no de un numero fijo: con
 * edge-to-edge la barra de estado mide distinto en cada equipo y el aviso
 * quedaba pisado por el reloj.
 */
const AvisosToast = () => {
  const insets = useSafeAreaInsets();

  return <Toast config={configuracion} topOffset={insets.top + espaciado.md} />;
};

export default AvisosToast;

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    width: '92%',
    backgroundColor: colores.superficieAlta,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.borde,
    borderLeftWidth: 4,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    ...sombras.flotante,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    ...tipografia.cuerpoFuerte,
    color: colores.textoPrimario,
  },
  detalle: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
    marginTop: 2,
  },
});
