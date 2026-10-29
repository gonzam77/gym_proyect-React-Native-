import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import HojaAcciones from './HojaAcciones';
import PantallaModal from './PantallaModal';
import CatalogoEjercicios from '../views/usuario/catalogoEjercicios';
import { colores } from '../styles/colores';
import { espaciado, maxEscalaFuente, radios, tipografia, toqueMinimo } from '../styles/theme';

/**
 * Menu del boton "Más" (⋮) de la barra de pestañas. No es una pantalla: abre
 * una hoja de opciones encima de la pestaña en la que se esté.
 */
const MenuMas = ({ visible, onClose }) => {
  const [catalogoVisible, setCatalogoVisible] = useState(false);

  return (
    <>
      <HojaAcciones
        visible={visible}
        titulo="Más opciones"
        onClose={onClose}
        opciones={[
          {
            texto: 'Catálogo de ejercicios',
            icono: 'barbell-outline',
            onPress: () => setCatalogoVisible(true),
          },
        ]}
      />

      <Modal
        visible={catalogoVisible}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setCatalogoVisible(false)}
      >
        <PantallaModal>
          <View style={styles.encabezado}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              hitSlop={8}
              style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
              onPress={() => setCatalogoVisible(false)}
            >
              <Icon name="chevron-back-outline" color={colores.textoPrimario} size={28} />
            </Pressable>
            <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
              Catálogo de ejercicios
            </Text>
          </View>
          <CatalogoEjercicios />
        </PantallaModal>
      </Modal>
    </>
  );
};

export default MenuMas;

const styles = StyleSheet.create({
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
    paddingHorizontal: espaciado.sm,
    paddingVertical: espaciado.xs,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeSuave,
  },
  botonIcono: {
    minWidth: toqueMinimo,
    minHeight: toqueMinimo,
    borderRadius: radios.completo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: {
    opacity: 0.75,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
  },
});
