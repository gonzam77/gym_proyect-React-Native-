import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colores } from '../styles/colores';
import { espaciado, radios } from '../styles/theme';

/**
 * Placeholder de carga.
 *
 * Da una idea de lo que esta por aparecer, en vez del ActivityIndicator suelto
 * que deja la pantalla vacia. La animacion late solo mientras esta montado.
 */
const Bloque = ({ alto = 14, ancho = '100%', opacidad }) => (
  <Animated.View
    style={[
      styles.bloque,
      { height: alto, width: ancho, opacity: opacidad },
    ]}
  />
);

const Esqueleto = ({ cantidad = 3 }) => {
  const anim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.75, duration: 650, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.35, duration: 650, useNativeDriver: true }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <View
      accessible
      accessibilityLabel="Cargando"
      accessibilityRole="progressbar"
      style={styles.contenedor}
    >
      {Array.from({ length: cantidad }, (_, index) => (
        <View key={index} style={styles.tarjeta}>
          <Bloque alto={20} ancho="65%" opacidad={anim} />
          <View style={styles.fila}>
            <Bloque alto={24} ancho={96} opacidad={anim} />
            <Bloque alto={24} ancho={68} opacidad={anim} />
          </View>
          <Bloque alto={44} opacidad={anim} />
        </View>
      ))}
    </View>
  );
};

export default Esqueleto;

const styles = StyleSheet.create({
  contenedor: {
    gap: espaciado.lg,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    padding: espaciado.xl,
    gap: espaciado.md,
  },
  fila: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  bloque: {
    backgroundColor: colores.superficieAlta,
    borderRadius: radios.sm,
  },
});
