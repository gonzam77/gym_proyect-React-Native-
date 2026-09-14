import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import styles from "../styles/selectorStyles";
import { colores } from "../styles/colores";
import { espaciado, maxEscalaFuente } from "../styles/theme";

const MINIMO_PARA_BUSCAR = 10;

const normalizar = texto => texto
  ?.toString()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const Hoja = ({ titulo, opciones, valor, onSelect, onClose }) => {
  // Provider propio: adentro de un Modal los insets del provider de la app no
  // llegan y la lista quedaria abajo de la barra de navegacion.
  const insets = useSafeAreaInsets();
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    if (!busqueda.trim()) {
      return opciones;
    }

    const termino = normalizar(busqueda);
    return opciones.filter(opcion => normalizar(opcion.etiqueta)?.includes(termino));
  }, [busqueda, opciones]);

  const conBuscador = opciones.length >= MINIMO_PARA_BUSCAR;

  return (
    <Pressable
      style={styles.fondo}
      accessibilityRole="button"
      accessibilityLabel="Cerrar el selector"
      onPress={onClose}
    >
      <Pressable style={[styles.hoja, { paddingBottom: insets.bottom + espaciado.lg }]} onPress={() => {}}>
        <View style={styles.manija} />

        {titulo ? (
          <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>{titulo}</Text>
        ) : null}

        {conBuscador ? (
          <TextInput
            style={styles.buscador}
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar..."
            placeholderTextColor={colores.textoTenue}
            autoCorrect={false}
            accessibilityLabel="Buscar en la lista"
            maxFontSizeMultiplier={maxEscalaFuente}
          />
        ) : null}

        <FlatList
          data={visibles}
          keyExtractor={item => item.valor.toString()}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <Text style={styles.vacio} maxFontSizeMultiplier={maxEscalaFuente}>
              No hay resultados
            </Text>
          )}
          renderItem={({ item }) => {
            const seleccionada = item.valor === valor;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.etiqueta}
                accessibilityState={{ selected: seleccionada }}
                style={({ pressed }) => [styles.opcion, pressed && styles.opcionPresionada]}
                onPress={() => {
                  onSelect(item.valor);
                  onClose();
                }}
              >
                <Text
                  style={[styles.opcionTexto, seleccionada && styles.opcionTextoSeleccionada]}
                  maxFontSizeMultiplier={maxEscalaFuente}
                >
                  {item.etiqueta}
                </Text>
                {seleccionada ? (
                  <Icon name="checkmark" size={22} color={colores.principal} />
                ) : null}
              </Pressable>
            );
          }}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          style={({ pressed }) => [styles.cerrar, pressed && styles.opcionPresionada]}
          onPress={onClose}
        >
          <Text style={styles.cerrarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Cancelar</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

/**
 * Selector de una opcion.
 *
 * Reemplaza al Picker nativo, que no se puede tematizar en Android: al ponerle
 * color de texto claro los items del desplegable quedan blanco sobre blanco.
 * Ademas, con muchas opciones (el catalogo de ejercicios) el spinner del
 * sistema obliga a scrollear a ciegas; aca hay buscador a partir de 10 items.
 *
 * opciones: [{ etiqueta, valor }]
 */
const Selector = ({
  titulo,
  placeholder = 'Seleccionar...',
  opciones = [],
  valor,
  onChange,
  deshabilitado,
}) => {
  const [abierto, setAbierto] = useState(false);

  const seleccionada = opciones.find(opcion => opcion.valor === valor);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${titulo || 'Seleccionar'}: ${seleccionada?.etiqueta || 'sin seleccionar'}`}
        accessibilityState={{ disabled: Boolean(deshabilitado), expanded: abierto }}
        style={({ pressed }) => [
          styles.disparador,
          pressed && styles.disparadorPresionado,
          deshabilitado && styles.disparadorDeshabilitado,
        ]}
        disabled={deshabilitado}
        onPress={() => setAbierto(true)}
      >
        <Text
          style={[styles.valor, !seleccionada && styles.placeholder]}
          numberOfLines={1}
          maxFontSizeMultiplier={maxEscalaFuente}
        >
          {seleccionada?.etiqueta || placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={colores.textoSecundario} />
      </Pressable>

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setAbierto(false)}
      >
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <Hoja
            titulo={titulo}
            opciones={opciones}
            valor={valor}
            onSelect={onChange}
            onClose={() => setAbierto(false)}
          />
        </SafeAreaProvider>
      </Modal>
    </>
  );
};

export default Selector;
