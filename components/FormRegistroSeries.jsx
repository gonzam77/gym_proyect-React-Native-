import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaProvider, initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../styles/registroStyles';
import { colores } from '../styles/colores';
import { espaciado, maxEscalaFuente } from '../styles/theme';
import { actualizarSeriesRegistro } from '../store/historialSlice';
import { avisoExito } from '../helpers/avisos';
import {
  leerPeso,
  leerRepeticiones,
  limpiarPesoEscrito,
  pesoATexto,
} from '../helpers/registroSeries';

const filasDesde = registro =>
  (registro?.series || []).map(s => ({
    numero: s.numero,
    repeticiones: s.repeticiones === null || s.repeticiones === undefined ? '' : String(s.repeticiones),
    peso: pesoATexto(s.peso),
    salteada: s.estado === 'salteada',
  }));

const Hoja = ({ registro, titulo, onClose }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [filas, setFilas] = useState(() => filasDesde(registro));

  const cambiar = (numero, campo, valor) =>
    setFilas(prev => prev.map(f => (f.numero === numero ? { ...f, [campo]: valor, salteada: false } : f)));

  const alternarSalteada = numero =>
    setFilas(prev => prev.map(f => (f.numero === numero ? { ...f, salteada: !f.salteada } : f)));

  const guardar = ({ saltarVacias = false } = {}) => {
    const series = filas.map(f => {
      const repeticiones = leerRepeticiones(f.repeticiones);
      const peso = leerPeso(f.peso);
      if (f.salteada) return { numero: f.numero, estado: 'salteada' };
      if (repeticiones !== null || peso !== null) {
        return { numero: f.numero, estado: 'registrada', repeticiones, peso };
      }
      return { numero: f.numero, estado: saltarVacias ? 'salteada' : 'pendiente' };
    });

    dispatch(actualizarSeriesRegistro({ idRegistro: registro.id, series }));
    avisoExito(saltarVacias ? 'Registro cerrado' : 'Series guardadas');
    onClose();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fondo}>
      <Pressable style={styles.zonaCerrar} accessibilityLabel="Cerrar" onPress={onClose} />
      <View style={[styles.hoja, { paddingBottom: insets.bottom + espaciado.lg }]}>
        <View style={styles.manija} />
        <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>{titulo}</Text>
        <Text style={styles.subtitulo} maxFontSizeMultiplier={maxEscalaFuente}>
          Cargá repeticiones y peso de cada serie. Lo que dejes vacío queda pendiente.
        </Text>

        <View style={styles.encabezadoColumnas}>
          <Text style={[styles.etiquetaColumna, styles.columnaSerie]}>Serie</Text>
          <Text style={[styles.etiquetaColumna, styles.columnaDato]}>Reps</Text>
          <Text style={[styles.etiquetaColumna, styles.columnaDato]}>Peso (kg)</Text>
          <Text style={[styles.etiquetaColumna, styles.columnaAccion]}>Saltar</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          {filas.map(f => (
            <View key={f.numero} style={[styles.fila, f.salteada && styles.filaSalteada]}>
              <Text style={[styles.serieTexto, styles.columnaSerie]} maxFontSizeMultiplier={maxEscalaFuente}>
                {f.numero}
              </Text>
              <TextInput
                style={[styles.input, styles.columnaDato]}
                value={f.repeticiones}
                onChangeText={v => cambiar(f.numero, 'repeticiones', v.replace(/[^0-9]/g, '').slice(0, 3))}
                keyboardType="number-pad"
                placeholder="-"
                placeholderTextColor={colores.textoTenue}
                accessibilityLabel={`Repeticiones de la serie ${f.numero}`}
                maxFontSizeMultiplier={1.2}
              />
              <TextInput
                style={[styles.input, styles.columnaDato]}
                value={f.peso}
                onChangeText={v => cambiar(f.numero, 'peso', limpiarPesoEscrito(v).slice(0, 6))}
                keyboardType="decimal-pad"
                placeholder="-"
                placeholderTextColor={colores.textoTenue}
                accessibilityLabel={`Peso en kilos de la serie ${f.numero}`}
                maxFontSizeMultiplier={1.2}
              />
              <View style={styles.columnaAccion}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: f.salteada }}
                  accessibilityLabel={`No registrar la serie ${f.numero}`}
                  hitSlop={6}
                  style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
                  onPress={() => alternarSalteada(f.numero)}
                >
                  <Icon
                    name={f.salteada ? 'remove-circle' : 'remove-circle-outline'}
                    size={24}
                    color={f.salteada ? colores.aviso : colores.textoTenue}
                  />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="No registrar las series vacías"
            style={({ pressed }) => [styles.botonSecundario, pressed && styles.presionado]}
            onPress={() => guardar({ saltarVacias: true })}
          >
            <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>Saltar vacías</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Guardar el registro"
            style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
            onPress={() => guardar()}
          >
            <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
            <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>Guardar</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

/**
 * Hoja para cargar repeticiones y peso de las series de un ejercicio.
 * Se usa al terminar el ejercicio y desde el historial para corregir.
 */
const FormRegistroSeries = ({ visible, registro, titulo = 'Registrar series', onClose }) => {
  // La hoja se monta de nuevo en cada apertura, asi arranca con los datos
  // actuales del registro y no con lo que quedo escrito la vez anterior.
  const [clave, setClave] = useState(0);
  useEffect(() => {
    if (visible) setClave(c => c + 1);
  }, [visible]);

  return (
    <Modal
      visible={visible && Boolean(registro)}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        {registro ? <Hoja key={clave} registro={registro} titulo={titulo} onClose={onClose} /> : null}
      </SafeAreaProvider>
    </Modal>
  );
};

export default FormRegistroSeries;
