import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colores } from '../styles/colores';
import { radios } from '../styles/theme';

/**
 * Barra de progreso continua. `progreso` va de 0 a 1.
 *
 * Se anima el ancho (useNativeDriver: false porque el driver nativo no soporta
 * porcentajes), con una duracion corta para que no se sienta lenta.
 */
const BarraProgreso = ({
  progreso = 0,
  color = colores.acento,
  alto = 8,
  animado = true,
  etiqueta,
}) => {
  const acotado = Math.min(Math.max(progreso, 0), 1);
  const anim = useRef(new Animated.Value(acotado)).current;

  useEffect(() => {
    if (!animado) {
      anim.setValue(acotado);
      return;
    }

    Animated.timing(anim, {
      toValue: acotado,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [acotado, anim, animado]);

  const ancho = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      accessible={Boolean(etiqueta)}
      accessibilityRole="progressbar"
      accessibilityLabel={etiqueta}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(acotado * 100) }}
      style={[styles.pista, { height: alto, borderRadius: alto / 2 }]}
    >
      <Animated.View
        style={[
          styles.relleno,
          { width: ancho, backgroundColor: color, borderRadius: alto / 2 },
        ]}
      />
    </View>
  );
};

export default BarraProgreso;

const styles = StyleSheet.create({
  pista: {
    width: '100%',
    backgroundColor: colores.bordeSuave,
    overflow: 'hidden',
    borderRadius: radios.completo,
  },
  relleno: {
    height: '100%',
  },
});
