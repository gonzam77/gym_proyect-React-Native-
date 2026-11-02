import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

import { colores } from "../styles/colores";
import { espaciado, maxEscalaFuente, radios, tipografia, toqueMinimo } from "../styles/theme";
import { codigoDesdeQR } from "../services/rutinasCompartidas";

const TAMANO_VISOR = 240;

/**
 * Camara a pantalla completa que lee el QR de una rutina compartida.
 *
 * Cuando encuentra un QR de Rutina360 llama a onLeido(codigo) una sola vez, con
 * el codigo ya normalizado ("ABCD-EFGH"). Si el QR es de otra cosa avisa y sigue
 * buscando. El permiso de camara se pide recien al abrir el escaner.
 */
const EscanerQR = ({ onLeido, onCancelar }) => {
  const insets = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [pidiendoPermiso, setPidiendoPermiso] = useState(!hasPermission);
  const [appActiva, setAppActiva] = useState(AppState.currentState === 'active');
  const [linterna, setLinterna] = useState(false);
  const [aviso, setAviso] = useState('');

  const yaLeido = useRef(false);
  const ultimoInvalido = useRef(null);

  // Pedir el permiso una vez, al abrir. Si lo niega se muestra como habilitarlo.
  useEffect(() => {
    if (hasPermission) return undefined;
    let vigente = true;
    requestPermission().finally(() => {
      if (vigente) setPidiendoPermiso(false);
    });
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // La camara se apaga si la app pasa a segundo plano.
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', estado => setAppActiva(estado === 'active'));
    return () => suscripcion.remove();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codigos => {
      if (yaLeido.current) return;

      for (const leido of codigos) {
        const codigo = codigoDesdeQR(leido.value);
        if (codigo) {
          yaLeido.current = true;
          Vibration.vibrate(50);
          onLeido(codigo);
          return;
        }
      }

      // Un QR que no es de Rutina360: avisar una vez por QR, no en cada cuadro.
      const valor = codigos[0]?.value;
      if (valor && valor !== ultimoInvalido.current) {
        ultimoInvalido.current = valor;
        setAviso('Ese QR no es de una rutina de Rutina360.');
      }
    },
  });

  const habilitarCamara = async () => {
    const concedido = await requestPermission();
    // Si ya lo nego "para siempre", el sistema no vuelve a preguntar: a Ajustes.
    if (!concedido) Linking.openSettings();
  };

  const botonVolver = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver a ingresar el código"
      hitSlop={8}
      style={({ pressed }) => [styles.botonRedondo, pressed && styles.presionado]}
      onPress={onCancelar}
    >
      <Icon name="chevron-back-outline" color={colores.sobreRelleno} size={28} />
    </Pressable>
  );

  // --- Sin camara disponible: esperando permiso, permiso negado o sin camara ---
  if (!hasPermission || !device) {
    let contenido;
    if (!hasPermission && pidiendoPermiso) {
      contenido = <ActivityIndicator color={colores.principal} />;
    } else if (!hasPermission) {
      contenido = (
        <>
          <Icon name="camera-outline" size={48} color={colores.textoSecundario} />
          <Text style={styles.mensaje} maxFontSizeMultiplier={maxEscalaFuente}>
            Para escanear el QR, Rutina360 necesita permiso para usar la cámara.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
            onPress={habilitarCamara}
          >
            <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              Permitir la cámara
            </Text>
          </Pressable>
        </>
      );
    } else {
      contenido = (
        <>
          <Icon name="camera-outline" size={48} color={colores.textoSecundario} />
          <Text style={styles.mensaje} maxFontSizeMultiplier={maxEscalaFuente}>
            No encontramos una cámara en este teléfono. Ingresá el código a mano.
          </Text>
        </>
      );
    }

    return (
      <View style={[styles.fondo, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.barra}>{botonVolver}</View>
        <View style={styles.centro}>{contenido}</View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.enlace, pressed && styles.presionado]}
          onPress={onCancelar}
        >
          <Text style={styles.enlaceTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            Ingresar el código a mano
          </Text>
        </Pressable>
      </View>
    );
  }

  // --- Camara ---
  return (
    <View style={styles.fondo}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={appActiva}
        codeScanner={codeScanner}
        torch={linterna && device.hasTorch ? 'on' : 'off'}
        enableZoomGesture
      />

      <View
        style={[styles.capa, { paddingTop: insets.top, paddingBottom: insets.bottom + espaciado.xl }]}
        pointerEvents="box-none"
      >
        <View style={styles.barra}>{botonVolver}</View>

        <View style={styles.centro} pointerEvents="none">
          <Text style={styles.instruccion} maxFontSizeMultiplier={maxEscalaFuente}>
            Apuntá la cámara al QR de la rutina
          </Text>
          <View style={styles.visor} />
          {aviso ? (
            <View style={styles.aviso}>
              <Icon name="alert-circle-outline" size={18} color={colores.sobreRelleno} />
              <Text style={styles.avisoTexto} maxFontSizeMultiplier={maxEscalaFuente}>{aviso}</Text>
            </View>
          ) : null}
        </View>

        {device.hasTorch ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={linterna ? 'Apagar la linterna' : 'Prender la linterna'}
            accessibilityState={{ selected: linterna }}
            style={({ pressed }) => [
              styles.botonRedondo,
              styles.botonLinterna,
              linterna && styles.botonLinternaActivo,
              pressed && styles.presionado,
            ]}
            onPress={() => setLinterna(valor => !valor)}
          >
            <Icon
              name={linterna ? 'flashlight' : 'flashlight-outline'}
              size={26}
              color={linterna ? colores.sobreAcento : colores.sobreRelleno}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default EscanerQR;

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "#000000",
  },
  capa: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  barra: {
    alignSelf: "stretch",
    flexDirection: "row",
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.sm,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.xl,
    paddingHorizontal: espaciado.xxl,
  },
  botonRedondo: {
    width: toqueMinimo + 4,
    height: toqueMinimo + 4,
    borderRadius: radios.completo,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  presionado: {
    opacity: 0.75,
  },
  instruccion: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreRelleno,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowRadius: 6,
  },
  visor: {
    width: TAMANO_VISOR,
    height: TAMANO_VISOR,
    borderRadius: radios.xl,
    borderWidth: 3,
    borderColor: colores.principal,
  },
  aviso: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.md,
    backgroundColor: "rgba(229, 72, 77, 0.9)",
  },
  avisoTexto: {
    ...tipografia.auxiliar,
    color: colores.sobreRelleno,
    flexShrink: 1,
  },
  botonLinterna: {
    width: toqueMinimo + 16,
    height: toqueMinimo + 16,
  },
  botonLinternaActivo: {
    backgroundColor: colores.principal,
  },
  mensaje: {
    ...tipografia.cuerpo,
    color: colores.textoPrimario,
    textAlign: "center",
  },
  botonPrincipal: {
    minHeight: toqueMinimo + 8,
    paddingHorizontal: espaciado.xl,
    borderRadius: radios.completo,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.exito,
  },
  botonPrincipalTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.sobreRelleno,
  },
  enlace: {
    alignSelf: "center",
    minHeight: toqueMinimo,
    justifyContent: "center",
    paddingHorizontal: espaciado.lg,
    marginBottom: espaciado.lg,
  },
  enlaceTexto: {
    ...tipografia.cuerpoFuerte,
    color: colores.acento,
  },
});
