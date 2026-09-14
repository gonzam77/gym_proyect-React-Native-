import { Modal, Pressable, Text, View } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import styles from "../styles/hojaAccionesStyles";
import { colores } from "../styles/colores";
import { espaciado, maxEscalaFuente } from "../styles/theme";

const Contenido = ({ titulo, opciones, onClose }) => {
  // Vive dentro de un provider propio: adentro de un Modal el provider de la
  // app no llega y los insets volverian 0, dejando "Cancelar" abajo de la barra
  // de navegacion del sistema.
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      style={styles.fondo}
      accessibilityLabel="Cerrar menú"
      accessibilityRole="button"
      onPress={onClose}
    >
      {/* El onPress vacio evita que el toque dentro de la hoja la cierre. */}
      <Pressable
        style={[styles.hoja, { paddingBottom: insets.bottom + espaciado.xl }]}
        onPress={() => {}}
      >
        <View style={styles.manija} />

        {titulo ? (
          <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente} numberOfLines={1}>
            {titulo}
          </Text>
        ) : null}

        {opciones.map((opcion, index) => (
          <View key={opcion.texto}>
            {index > 0 ? <View style={styles.separador} /> : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={opcion.texto}
              style={({ pressed }) => [styles.opcion, pressed && styles.opcionPresionada]}
              onPress={() => {
                onClose();
                // Se deja cerrar la hoja antes de abrir lo que siga (otro modal
                // o un Alert), para que no se pisen las animaciones.
                requestAnimationFrame(() => opcion.onPress?.());
              }}
            >
              <Icon
                name={opcion.icono}
                size={22}
                color={opcion.destructivo ? colores.peligro : colores.textoPrimario}
              />
              <Text
                style={[styles.opcionTexto, opcion.destructivo && styles.opcionTextoPeligro]}
                maxFontSizeMultiplier={maxEscalaFuente}
              >
                {opcion.texto}
              </Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          style={({ pressed }) => [styles.cancelar, pressed && styles.opcionPresionada]}
          onPress={onClose}
        >
          <Text style={styles.cancelarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            Cancelar
          </Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

/**
 * Menu contextual que sube desde abajo.
 *
 * Reemplaza a los Alert.alert que se usaban como menu de opciones: se puede
 * cerrar tocando afuera o con el boton atras, marca la opcion destructiva en
 * rojo y respeta el area minima de toque.
 *
 * opciones: [{ texto, icono, onPress, destructivo }]
 */
const HojaAcciones = ({ visible, titulo, opciones = [], onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent
    navigationBarTranslucent
    onRequestClose={onClose}
  >
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Contenido titulo={titulo} opciones={opciones} onClose={onClose} />
    </SafeAreaProvider>
  </Modal>
);

export default HojaAcciones;
