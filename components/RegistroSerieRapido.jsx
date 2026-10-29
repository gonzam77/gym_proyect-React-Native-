import { useEffect, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../styles/registroStyles';
import { colores } from '../styles/colores';
import { maxEscalaFuente } from '../styles/theme';
import { actualizarSeriesRegistro } from '../store/historialSlice';
import {
  describirSerie,
  leerPeso,
  leerRepeticiones,
  limpiarPesoEscrito,
  pesoATexto,
} from '../helpers/registroSeries';

/**
 * Carga rapida de repeticiones y peso de la serie recien terminada, en la
 * pantalla de descanso. Es opcional: se puede guardar ahora, dejarla para el
 * final del ejercicio (no hacer nada) o saltear el registro.
 */
const RegistroSerieRapido = ({ registro, numero }) => {
  const dispatch = useDispatch();
  const serie = registro?.series?.find(s => s.numero === numero);

  const [repeticiones, setRepeticiones] = useState('');
  const [peso, setPeso] = useState('');
  const [editando, setEditando] = useState(false);

  // Precarga lo ultimo que se uso en este ejercicio: en general el peso se
  // repite de una serie a la otra.
  useEffect(() => {
    if (!serie) return;
    if (serie.estado === 'registrada') {
      setRepeticiones(String(serie.repeticiones ?? ''));
      setPeso(pesoATexto(serie.peso));
      return;
    }
    const anterior = [...(registro?.series || [])]
      .reverse()
      .find(s => s.numero < numero && s.estado === 'registrada');
    setRepeticiones(String(anterior?.repeticiones ?? ''));
    setPeso(pesoATexto(anterior?.peso));
  }, [numero, registro?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!registro || !serie) {
    return null;
  }

  const guardar = estado => {
    Keyboard.dismiss();
    dispatch(actualizarSeriesRegistro({
      idRegistro: registro.id,
      series: [{
        numero,
        estado,
        repeticiones: leerRepeticiones(repeticiones),
        peso: leerPeso(peso),
      }],
    }));
    setEditando(false);
  };

  const resuelta = serie.estado !== 'pendiente' && !editando;

  return (
    <View style={styles.tarjetaCompacta}>
      <View style={styles.tarjetaEncabezado}>
        <Text style={styles.tarjetaTitulo} maxFontSizeMultiplier={1.2}>
          Serie {numero}: reps y peso
        </Text>
        {resuelta ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar el registro de la serie"
            hitSlop={10}
            onPress={() => setEditando(true)}
          >
            <Text style={styles.enlace} maxFontSizeMultiplier={1.2}>Editar</Text>
          </Pressable>
        ) : (
          <Text style={styles.tarjetaAyuda} maxFontSizeMultiplier={1.2}>Opcional</Text>
        )}
      </View>

      {resuelta ? (
        <Text
          style={serie.estado === 'registrada' ? styles.resumen : styles.filaSerieDatoTenue}
          maxFontSizeMultiplier={maxEscalaFuente}
        >
          {describirSerie(serie)}
        </Text>
      ) : (
        <View style={styles.filaCompacta}>
          <TextInput
            style={[styles.input, styles.inputCompacto]}
            value={repeticiones}
            onChangeText={v => setRepeticiones(v.replace(/[^0-9]/g, '').slice(0, 3))}
            keyboardType="number-pad"
            placeholder="Reps"
            placeholderTextColor={colores.textoTenue}
            accessibilityLabel="Repeticiones"
            maxFontSizeMultiplier={1.2}
          />
          <TextInput
            style={[styles.input, styles.inputCompacto]}
            value={peso}
            onChangeText={v => setPeso(limpiarPesoEscrito(v).slice(0, 6))}
            keyboardType="decimal-pad"
            placeholder="Kg"
            placeholderTextColor={colores.textoTenue}
            accessibilityLabel="Peso en kilos"
            maxFontSizeMultiplier={1.2}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="No registrar esta serie"
            style={({ pressed }) => [styles.botonSaltarCompacto, pressed && styles.presionado]}
            onPress={() => guardar('salteada')}
          >
            <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={1.2}>Saltar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Guardar el registro de la serie"
            accessibilityState={{ disabled: !repeticiones && !peso }}
            disabled={!repeticiones && !peso}
            style={({ pressed }) => [
              styles.botonGuardarCompacto,
              !repeticiones && !peso && styles.filaSalteada,
              pressed && styles.presionado,
            ]}
            onPress={() => guardar('registrada')}
          >
            <Icon name="checkmark" size={22} color={colores.sobreRelleno} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default RegistroSerieRapido;
