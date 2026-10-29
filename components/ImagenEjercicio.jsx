import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import { urlImagenEjercicio } from '../helpers/imagenes';
import { colores } from '../styles/colores';
import { radios } from '../styles/theme';

/**
 * Ilustracion de un ejercicio (posicion inicial y final).
 *
 * Si la imagen no carga (sin conexion la primera vez, o el ejercicio no tiene
 * ilustracion) el componente no ocupa lugar: la pantalla sigue funcionando
 * igual que antes de que existieran las imagenes.
 */
const ImagenEjercicio = ({ ejercicio, style }) => {
  const uri = urlImagenEjercicio(ejercicio);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    setEstado('cargando');
  }, [uri]);

  if (!uri || estado === 'error') {
    return null;
  }

  return (
    <View style={[styles.marco, style]}>
      <Image
        source={{ uri }}
        style={styles.imagen}
        resizeMode="contain"
        onLoad={() => setEstado('lista')}
        onError={() => setEstado('error')}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Ilustración de ${ejercicio?.nombre || 'el ejercicio'}: posición inicial y final`}
      />
      {estado === 'cargando' ? (
        <View style={styles.cargando} pointerEvents="none">
          <ActivityIndicator color={colores.textoTenue} />
        </View>
      ) : null}
    </View>
  );
};

export default ImagenEjercicio;

const styles = StyleSheet.create({
  marco: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: radios.lg,
    overflow: 'hidden',
    // Mismo tono que el fondo de las ilustraciones, para que no "salte"
    // mientras carga.
    backgroundColor: '#111A2C',
    borderWidth: 1,
    borderColor: colores.bordeSuave,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  cargando: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
