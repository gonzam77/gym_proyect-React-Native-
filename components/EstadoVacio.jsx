import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { colores } from '../styles/colores';
import { espaciado, maxEscalaFuente, radios, tipografia, toqueMinimo } from '../styles/theme';

/**
 * Estado vacio con accion.
 *
 * Un estado vacio que solo dice "no hay nada" deja al usuario sin saber que
 * hacer; este ofrece la accion que corresponde en el mismo lugar donde mira.
 */
const EstadoVacio = ({
  icono = 'file-tray-outline',
  titulo,
  descripcion,
  textoAccion,
  onAccion,
}) => (
  <View style={styles.contenedor}>
    <View style={styles.circulo}>
      <Icon name={icono} size={38} color={colores.textoSecundario} />
    </View>

    <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
      {titulo}
    </Text>

    {descripcion ? (
      <Text style={styles.descripcion} maxFontSizeMultiplier={maxEscalaFuente}>
        {descripcion}
      </Text>
    ) : null}

    {textoAccion && onAccion ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={textoAccion}
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
        onPress={onAccion}
      >
        <Icon name="add" size={20} color={colores.sobreAcento} />
        <Text style={styles.botonTexto} maxFontSizeMultiplier={maxEscalaFuente}>
          {textoAccion}
        </Text>
      </Pressable>
    ) : null}
  </View>
);

export default EstadoVacio;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaciado.xxxl,
    paddingHorizontal: espaciado.xl,
    gap: espaciado.md,
  },
  circulo: {
    width: 84,
    height: 84,
    borderRadius: radios.completo,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
    textAlign: 'center',
  },
  descripcion: {
    ...tipografia.cuerpo,
    color: colores.textoTenue,
    textAlign: 'center',
    maxWidth: 320,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    minHeight: toqueMinimo,
    marginTop: espaciado.sm,
    paddingHorizontal: espaciado.xl,
    borderRadius: radios.completo,
    backgroundColor: colores.principal,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreAcento,
  },
});
