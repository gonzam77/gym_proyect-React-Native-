import { StyleSheet, View } from 'react-native';

import { colores } from '../styles/colores';
import { espaciado, radios } from '../styles/theme';

/**
 * Progreso de series como segmentos: uno por serie, lleno si ya se hizo.
 *
 * Se lee de un vistazo cuantas quedan, que es lo que uno mira entre serie y
 * serie. Si hay muchas series los segmentos se hacen finitos, asi que arriba de
 * 12 se cae a una sola barra continua.
 */
const ProgresoSeries = ({ total = 0, realizadas = 0, color = colores.exito }) => {
  const cantidad = Number(total) || 0;
  const hechas = Math.min(Math.max(Number(realizadas) || 0, 0), cantidad);

  if (cantidad <= 0) {
    return null;
  }

  const segmentos = cantidad <= 12 ? cantidad : 1;
  const proporcion = cantidad > 0 ? hechas / cantidad : 0;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${hechas} de ${cantidad} series completadas`}
      accessibilityValue={{ min: 0, max: cantidad, now: hechas }}
      style={styles.fila}
    >
      {segmentos === 1 ? (
        <View style={styles.pistaContinua}>
          <View
            style={[
              styles.rellenoContinuo,
              { width: `${proporcion * 100}%`, backgroundColor: color },
            ]}
          />
        </View>
      ) : (
        Array.from({ length: cantidad }, (_, index) => (
          <View
            key={index}
            style={[
              styles.segmento,
              index < hechas && { backgroundColor: color },
            ]}
          />
        ))
      )}
    </View>
  );
};

export default ProgresoSeries;

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espaciado.xs,
    width: '100%',
  },
  segmento: {
    flex: 1,
    height: 8,
    borderRadius: radios.completo,
    backgroundColor: colores.bordeSuave,
  },
  pistaContinua: {
    flex: 1,
    height: 8,
    borderRadius: radios.completo,
    backgroundColor: colores.bordeSuave,
    overflow: 'hidden',
  },
  rellenoContinuo: {
    height: '100%',
    borderRadius: radios.completo,
  },
});
