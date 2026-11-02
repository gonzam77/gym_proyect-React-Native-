import { useState } from "react";
import { ActivityIndicator, Keyboard, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

import PantallaModal from "../../components/PantallaModal";
import EscanerQR from "../../components/EscanerQR";
import { styles } from "../../styles/compartirStyles";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { agregarRutina } from "../../store/rutinasSlice";
import { avisoExito } from "../../helpers/avisos";
import { formatearDescanso } from "../../helpers/descanso";
import {
  buscarRutinaCompartida,
  codigoCompleto,
  convertirCompartidaEnRutinaLocal,
  normalizarCodigo,
} from "../../services/rutinasCompartidas";

/**
 * Importar una rutina que otro usuario compartio con un codigo, tipeandolo o
 * escaneando su QR. Primero se muestra una vista previa y recien al confirmar
 * se guarda la copia.
 */
const ImportarRutina = ({ onClose }) => {
  const dispatch = useDispatch();

  const [codigo, setCodigo] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');
  const [compartida, setCompartida] = useState(null);
  const [escaneando, setEscaneando] = useState(false);

  // valor: el codigo leido del QR. Sin el (o con el evento del boton) usa lo tipeado.
  const buscar = async valor => {
    const codigoBuscado = typeof valor === 'string' ? valor : codigo;
    if (!codigoCompleto(codigoBuscado) || buscando) return;

    Keyboard.dismiss();
    setBuscando(true);
    setError('');
    setCompartida(null);
    try {
      setCompartida(await buscarRutinaCompartida(codigoBuscado));
    } catch (e) {
      setError(e?.message || 'No pudimos buscar la rutina. Revisá tu conexión.');
    } finally {
      setBuscando(false);
    }
  };

  const abrirEscaner = () => {
    Keyboard.dismiss();
    setError('');
    setEscaneando(true);
  };

  const alLeerQR = codigoLeido => {
    setEscaneando(false);
    setCodigo(codigoLeido);
    buscar(codigoLeido);
  };

  const importar = () => {
    if (!compartida) return;
    const rutina = convertirCompartidaEnRutinaLocal(compartida);
    dispatch(agregarRutina(rutina));
    avisoExito('Rutina importada', `"${rutina.nombre}" ya está en Mis rutinas.`);
    onClose();
  };

  const ejercicios = compartida?.exercises || [];

  return (
    <PantallaModal>
      <ScrollView
        style={styles.cuerpo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
            onPress={onClose}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>
        </View>

        <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>Importar rutina</Text>
        <Text style={styles.subtitulo} maxFontSizeMultiplier={maxEscalaFuente}>
          Ingresá el código que te pasaron o escaneá su QR. Vas a recibir una copia que podés modificar
          como quieras.
        </Text>

        <TextInput
          style={styles.input}
          value={codigo}
          onChangeText={texto => {
            setCodigo(normalizarCodigo(texto));
            setError('');
          }}
          placeholder="ABCD-1234"
          placeholderTextColor={colores.textoTenue}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          maxLength={9}
          returnKeyType="search"
          onSubmitEditing={buscar}
          accessibilityLabel="Código de la rutina"
          maxFontSizeMultiplier={1.2}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !codigoCompleto(codigo) || buscando, busy: buscando }}
          disabled={!codigoCompleto(codigo) || buscando}
          style={({ pressed }) => [
            styles.botonPrincipal,
            (!codigoCompleto(codigo) || buscando) && styles.botonDeshabilitado,
            pressed && styles.presionado,
          ]}
          onPress={buscar}
        >
          {buscando ? (
            <ActivityIndicator color={colores.sobreRelleno} />
          ) : (
            <Icon name="search-outline" size={20} color={colores.sobreRelleno} />
          )}
          <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            Buscar rutina
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Escanear el código QR de la rutina"
          accessibilityState={{ disabled: buscando }}
          disabled={buscando}
          style={({ pressed }) => [
            styles.botonSecundario,
            buscando && styles.botonDeshabilitado,
            pressed && styles.presionado,
          ]}
          onPress={abrirEscaner}
        >
          <Icon name="qr-code-outline" size={20} color={colores.textoPrimario} />
          <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            Escanear QR
          </Text>
        </Pressable>

        {error ? (
          <View style={styles.errorCaja}>
            <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
            <Text style={styles.error} maxFontSizeMultiplier={maxEscalaFuente}>{error}</Text>
          </View>
        ) : null}

        {compartida ? (
          <>
            <View style={styles.vistaPrevia}>
              <Text style={styles.previaNombre} maxFontSizeMultiplier={maxEscalaFuente}>
                {compartida.name}
              </Text>
              <Text style={styles.previaAutor} maxFontSizeMultiplier={maxEscalaFuente}>
                {compartida.isOwn
                  ? 'La compartiste vos'
                  : `Compartida por ${compartida.owner?.username || 'otro usuario'}`}
                {` · ${ejercicios.length} ${ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}`}
              </Text>
              {ejercicios.map((e, indice) => (
                <View key={`${e.name}-${indice}`} style={styles.previaEjercicio}>
                  <Text style={styles.previaEjercicioNombre} maxFontSizeMultiplier={maxEscalaFuente}>
                    {e.name}
                  </Text>
                  <Text style={styles.previaEjercicioDato} maxFontSizeMultiplier={maxEscalaFuente}>
                    {e.series} series · {formatearDescanso(e.restSeconds)}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Agregar la rutina a Mis rutinas"
              style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
              onPress={importar}
            >
              <Icon name="download-outline" size={20} color={colores.sobreRelleno} />
              <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Agregar a Mis rutinas
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>

      <Modal
        visible={escaneando}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setEscaneando(false)}
      >
        <PantallaModal edges={[]}>
          <EscanerQR onLeido={alLeerQR} onCancelar={() => setEscaneando(false)} />
        </PantallaModal>
      </Modal>
    </PantallaModal>
  );
};

export default ImportarRutina;
