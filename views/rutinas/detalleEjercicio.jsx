import { useEffect, useState, useRef } from "react";
import { Modal, Text, View, ScrollView, Animated, Alert, Pressable, Vibration } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from '../../styles/detalleEjercicioStyles';
import { modificarEjercicio } from '../../store/rutinasSlice';
import { cancelarDescanso } from '../../services/descansoAlarma';
import {
  mantenerPantallaEncendida,
  permitirApagarPantalla,
} from '../../services/pantallaEncendida';
import Descanso from "./descanso";
import FormNota from "../../components/formNota";
import PantallaModal from "../../components/PantallaModal";
import ProgresoSeries from "../../components/ProgresoSeries";
import Icon from "react-native-vector-icons/Ionicons";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";

const DetalleEjercicio = ({ ejercicio, setModalEjercicio, rutinaSeleccionada }) => {

  const [modalDescanso, setModalDescanso] = useState(false);
  const [modalFormNota, setModalFormNota] = useState(false);

  const [serie, setSerie] = useState(0);
  const [estado, setEstado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const pulsoAnim = useRef(new Animated.Value(0.4)).current;
  const dispatch = useDispatch();

  const ejercicioActualizado = useSelector(state =>
    state.rutinas.rutinas
      ?.find(r => r.id === rutinaSeleccionada?.id)
      ?.ejercicios?.find(e => e.id === ejercicio.id)
  );

  useEffect(()=>{
    if (!ejercicioActualizado) {
      return;
    }

    const series = Number(ejercicioActualizado.series) || 0;
    const realizadas = Number(ejercicioActualizado.seriesRealizadas) || 0;

    setFinalizado(series > 0 && realizadas >= series);
  },[ejercicioActualizado])

  useEffect(() => {
    if (ejercicioActualizado) {
      setSerie(ejercicioActualizado.seriesRealizadas ?? 0);
    }
  }, [ejercicioActualizado]);

  /**
   * El punto de "serie en curso" late solo mientras la serie esta en curso.
   * Antes la animacion corria siempre en loop, incluso con el ejercicio
   * terminado: gastaba bateria y el texto parpadeando molestaba a la vista.
   */
  useEffect(() => {
    if (!estado || finalizado) {
      pulsoAnim.setValue(0.4);
      return undefined;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulsoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulsoAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );

    loop.start();
    return () => loop.stop();
  },[estado, finalizado, pulsoAnim]);

  // Mientras la serie esta en curso la pantalla se queda prendida: el usuario
  // apoya el telefono y no lo toca hasta terminar la serie.
  useEffect(() => {
    if (!estado || finalizado) {
      return undefined;
    }

    mantenerPantallaEncendida();
    return permitirApagarPantalla;
  }, [estado, finalizado]);

  const actualizarSeries = (nuevaSerie) => {
    dispatch(
      modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { seriesRealizadas: nuevaSerie },
      })
    );
  };

  const completarSerie = () => {
    const nuevaSerie = serie + 1;
    setSerie(nuevaSerie);
    actualizarSeries(nuevaSerie);

    // Confirmacion tactil: en el gimnasio no siempre se esta mirando la pantalla.
    Vibration.vibrate(nuevaSerie === ejercicioActualizado.series ? [0, 60, 80, 60] : 50);

    if (nuevaSerie === ejercicioActualizado.series) {
      setEstado(true);
      setModalDescanso(true);
      setFinalizado(true);
    } else {
      setEstado(false);
      setModalDescanso(true);
    }
  };

  const reiniciarEjercicio = () => {
    if (!ejercicioActualizado) return;

    setEstado(false);
    setSerie(0);
    setFinalizado(false);

    dispatch(
      modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { estado: 0, seriesRealizadas: 0 },
      })
    );
  };

  const volver = () => setModalEjercicio(false);

  if (!ejercicioActualizado) {
    return (
      <PantallaModal>
        <Text style={styles.error}>No pudimos cargar el ejercicio.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          style={({ pressed }) => [styles.botonSecundario, pressed && styles.botonPresionado]}
          onPress={volver}
        >
          <Text style={styles.botonSecundarioTexto}>Volver</Text>
        </Pressable>
      </PantallaModal>
    );
  }

  const totalSeries = Number(ejercicioActualizado.series) || 0;
  const restantes = Math.max(totalSeries - serie, 0);

  return (
    <PantallaModal>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* El boton de volver esta siempre, tambien con el ejercicio terminado:
            antes desaparecia y reaparecia en otro lugar de la pantalla. */}
        <View style={styles.encabezado}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a la rutina"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={volver}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar la nota del ejercicio"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={() => setModalFormNota(true)}
          >
            <Icon name="pencil-outline" size={22} color={colores.textoPrimario} />
          </Pressable>
        </View>

        <Text style={styles.titulo} numberOfLines={3} maxFontSizeMultiplier={maxEscalaFuente}>
          {ejercicioActualizado.nombre}
        </Text>

        <View style={styles.tarjetaProgreso}>
          <Text style={styles.progresoEtiqueta} maxFontSizeMultiplier={maxEscalaFuente}>
            Series realizadas
          </Text>

          <View style={styles.filaProgreso}>
            <Text style={styles.progresoNumero} maxFontSizeMultiplier={maxEscalaFuente}>
              {serie}
              <Text style={styles.progresoTotal}> / {totalSeries}</Text>
            </Text>
            <Text style={styles.restantes} maxFontSizeMultiplier={maxEscalaFuente}>
              {restantes === 0 ? 'Sin series pendientes' : `Quedan ${restantes}`}
            </Text>
          </View>

          <ProgresoSeries
            total={totalSeries}
            realizadas={serie}
            color={finalizado ? colores.exito : colores.principal}
          />
        </View>

        <View style={styles.infoBox}>
          <View style={styles.filaDato}>
            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Series</Text>
            <Text style={styles.valor} maxFontSizeMultiplier={maxEscalaFuente}>{totalSeries}</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.filaDato}>
            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Descanso</Text>
            <Text style={styles.valor} maxFontSizeMultiplier={maxEscalaFuente}>
              {ejercicioActualizado.descanso} min
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar la nota del ejercicio"
          style={({ pressed }) => [styles.card, pressed && styles.botonIconoPresionado]}
          onPress={() => setModalFormNota(true)}
        >
          <View style={styles.notaTextos}>
            <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Nota</Text>
            <Text
              style={ejercicioActualizado.nota ? styles.notaTexto : styles.notaVacia}
              maxFontSizeMultiplier={maxEscalaFuente}
            >
              {ejercicioActualizado.nota || 'Sin notas todavía. Tocá para agregar una.'}
            </Text>
          </View>
          <Icon name="pencil-outline" size={20} color={colores.textoSecundario} />
        </Pressable>

        {estado && !finalizado ? (
          <>
            <View style={styles.enCurso}>
              <Animated.View style={[styles.puntoEnCurso, { opacity: pulsoAnim }]} />
              <Text style={styles.enCursoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Serie {serie + 1} en curso
              </Text>
            </View>

            <View style={styles.acciones}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Terminé la serie ${serie + 1}`}
                style={({ pressed }) => [
                  styles.botonPrincipal,
                  styles.botonCompletar,
                  pressed && styles.botonPresionado,
                ]}
                onPress={completarSerie}
              >
                <Icon name="checkmark-circle-outline" color={colores.sobreRelleno} size={28} />
                <Text
                  style={[styles.botonPrincipalTexto, styles.botonCompletarTexto]}
                  maxFontSizeMultiplier={maxEscalaFuente}
                >
                  Terminé la serie
                </Text>
              </Pressable>
            </View>
          </>
        ) : finalizado ? (
          <>
            <View style={styles.badgeFinalizado}>
              <Icon name="checkmark-circle" size={20} color={colores.exito} />
              <Text style={styles.badgeFinalizadoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Ejercicio finalizado
              </Text>
            </View>

            <Text style={styles.felicitaciones} maxFontSizeMultiplier={maxEscalaFuente}>
              ¡Bien ahí! Completaste las {totalSeries} series.
            </Text>

            <View style={styles.acciones}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver a la rutina"
                style={({ pressed }) => [styles.botonPrincipal, pressed && styles.botonPresionado]}
                onPress={volver}
              >
                <Icon name="arrow-back-outline" color={colores.sobreAcento} size={24} />
                <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                  Volver a la rutina
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Reiniciar este ejercicio"
                style={({ pressed }) => [styles.botonSecundario, pressed && styles.botonPresionado]}
                onPress={() => {
                  Alert.alert(
                    "Reiniciar ejercicio",
                    "¿Querés volver las series de este ejercicio a cero?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Reiniciar", onPress: reiniciarEjercicio },
                    ]
                  );
                }}
              >
                <Icon name="refresh-outline" color={colores.textoPrimario} size={20} />
                <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                  Reiniciar ejercicio
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.acciones}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Empezar la serie ${serie + 1}`}
              style={({ pressed }) => [styles.botonPrincipal, pressed && styles.botonPresionado]}
              onPress={() => setEstado(true)}
            >
              <Icon name="play" color={colores.sobreAcento} size={26} />
              <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Empezar serie {serie + 1}
              </Text>
            </Pressable>
          </View>
        )}

        <FormNota
          visible={modalFormNota}
          onClose={()=>setModalFormNota(false)}
          setModalFormNota={setModalFormNota}
          ejercicio={ejercicio}
        />

        {/* El boton atras tiene que cancelar la alarma antes de cerrar, igual
            que Saltar. Antes era un handler vacio para que no se pudiera salir,
            pero con predictive back (Android 16 / targetSdk 36) ese bloqueo se
            ignora: el modal se cerraria igual y la alarma quedaba programada. */}
        <Modal
          visible={modalDescanso}
          animationType="slide"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={async () => {
            await cancelarDescanso();
            setModalDescanso(false);
          }}
        >
          <Descanso
            ejercicio={ejercicioActualizado}
            setModalDescanso={setModalDescanso}
            serie={serie}
          />
        </Modal>
      </ScrollView>
    </PantallaModal>
  );
};

export default DetalleEjercicio;
