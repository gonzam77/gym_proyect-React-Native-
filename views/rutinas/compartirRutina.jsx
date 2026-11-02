import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Share, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";

import PantallaModal from "../../components/PantallaModal";
import { styles } from "../../styles/compartirStyles";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { compartirRutina, textoQR } from "../../services/rutinasCompartidas";

// Negro sobre blanco y con margen: es lo que mejor leen las camaras, aunque la
// app sea oscura.
const TAMANO_QR = 200;

const formatearVencimiento = valor => {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
};

/**
 * Genera el codigo para compartir una rutina. Se muestra como texto y como QR
 * (para escanearlo desde "Importar" en otro telefono), y se puede enviar con el
 * menu nativo de compartir (WhatsApp, Telegram, mail...). Quien lo recibe se
 * lleva una copia.
 */
const CompartirRutina = ({ rutina, onClose }) => {
  const [estado, setEstado] = useState('cargando');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const generar = useCallback(async () => {
    setEstado('cargando');
    setError('');
    try {
      const datos = await compartirRutina(rutina);
      setResultado(datos);
      setEstado('listo');
    } catch (e) {
      setError(e?.message || 'No se pudo generar el código. Revisá tu conexión.');
      setEstado('error');
    }
  }, [rutina]);

  useEffect(() => {
    generar();
  }, [generar]);

  const enviar = async () => {
    if (!resultado?.code) return;
    try {
      await Share.share({
        message:
          `Te comparto mi rutina "${rutina?.nombre}" en Rutina360. ` +
          `Abrí la app, en Mis rutinas tocá "Importar" e ingresá el código: ${resultado.code}`,
      });
    } catch {
      // El usuario cerro el menu de compartir: no hay nada que hacer.
    }
  };

  const vence = resultado?.expiresAt ? formatearVencimiento(resultado.expiresAt) : null;

  return (
    <PantallaModal>
      <ScrollView
        style={styles.cuerpo}
        contentContainerStyle={styles.contenidoScroll}
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

        <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>Compartir rutina</Text>
        <Text style={styles.subtitulo} maxFontSizeMultiplier={maxEscalaFuente}>
          Quien reciba el código se lleva una copia de "{rutina?.nombre}". Lo que cambie en su copia no
          toca la tuya.
        </Text>

        {estado === 'cargando' ? (
          <View style={styles.tarjeta}>
            <ActivityIndicator color={colores.principal} />
            <Text style={styles.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>Generando el código...</Text>
          </View>
        ) : null}

        {estado === 'error' ? (
          <>
            <View style={styles.errorCaja}>
              <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
              <Text style={styles.error} maxFontSizeMultiplier={maxEscalaFuente}>{error}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
              onPress={generar}
            >
              <Icon name="refresh-outline" size={20} color={colores.sobreRelleno} />
              <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>Reintentar</Text>
            </Pressable>
          </>
        ) : null}

        {estado === 'listo' ? (
          <>
            <View style={styles.tarjeta}>
              <View
                style={styles.qrMarco}
                accessible
                accessibilityRole="image"
                accessibilityLabel="Código QR de la rutina. Se escanea desde Importar, en otro teléfono."
              >
                <QRCode
                  value={textoQR(resultado.code)}
                  size={TAMANO_QR}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                  ecl="M"
                />
              </View>
              <Text style={styles.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
                Escanealo desde Importar → Escanear QR, en el otro teléfono.
              </Text>

              <Text style={[styles.etiqueta, styles.etiquetaSeparada]} maxFontSizeMultiplier={maxEscalaFuente}>
                O ingresá el código
              </Text>
              {/* selectable: mantener apretado para copiarlo. */}
              <Text
                selectable
                style={styles.codigo}
                maxFontSizeMultiplier={1.2}
                accessibilityLabel={`Código ${resultado.code.split('').join(' ')}`}
              >
                {resultado.code}
              </Text>
              {vence ? (
                <Text style={styles.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
                  Sirve hasta el {vence}. Mantené apretado el código para copiarlo.
                </Text>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar el código"
              style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
              onPress={enviar}
            >
              <Icon name="share-social-outline" size={20} color={colores.sobreRelleno} />
              <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Enviar código
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </PantallaModal>
  );
};

export default CompartirRutina;
