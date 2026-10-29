import { useCallback, useEffect, useState, useRef } from "react";
import { Modal, Text, View, ScrollView, Animated, Alert, Pressable, Vibration } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from '../../styles/detalleEjercicioStyles';
import { modificarEjercicio } from '../../store/rutinasSlice';
import {
  cerrarRegistros,
  registrarSerieHecha,
  seleccionarRegistroAbierto,
} from '../../store/historialSlice';
import { fechaLocal } from '../../helpers/fechas';
import { describirSerie, seriesPendientes } from '../../helpers/registroSeries';
import FormRegistroSeries from '../../components/FormRegistroSeries';
import { styles as estilosRegistro } from '../../styles/registroStyles';
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
import ImagenEjercicio from "../../components/ImagenEjercicio";
import { formatearDescanso, segundosDescanso } from "../../helpers/descanso";

const DetalleEjercicio = ({ ejercicio, setModalEjercicio, rutinaSeleccionada }) => {

  const [modalDescanso, setModalDescanso] = useState(false);
  const [modalFormNota, setModalFormNota] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);

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

  // Registro de hoy de este ejercicio (historial): series hechas, reps y peso.
  const registroHoy = useSelector(state =>
    seleccionarRegistroAbierto(state, fechaLocal(), rutinaSeleccionada?.id, ejercicio?.id)
  );

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

    dispatch(registrarSerieHecha({
      fecha: fechaLocal(),
      hechaEn: new Date().toISOString(),
      rutina: { id: rutinaSeleccionada.id, nombre: rutinaSeleccionada.nombre },
      ejercicio: ejercicioActualizado,
      numero: nuevaSerie,
    }));

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

    // Lo hecho queda en el historial; si se vuelve a hacer, es otro registro.
    dispatch(cerrarRegistros({
      idRutina: rutinaSeleccionada.id,
      idEjercicioRutina: ejercicioActualizado.id,
    }));

    dispatch(
      modificarEjercicio({
        idEjercicio: ejercicioActualizado.id,
        idRutina: rutinaSeleccionada.id,
        cambios: { estado: 0, seriesRealizadas: 0 },
      })
    );
  };

  const volver = () => setModalEjercicio(false);

  const cerrarNota = useCallback(() => setModalFormNota(false), []);

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

  const pendientes = registroHoy ? seriesPendientes(registroHoy).length : 0;

  return (
    <PantallaModal>
      {/* Pantalla compacta: entra sin scroll en un telefono comun. El scroll
          queda solo como respaldo para pantallas chicas o letra grande. Los
          botones de accion van fijos abajo, fuera del scroll. */}
      <View style={styles.encabezado}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver a la rutina"
          hitSlop={8}
          style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
          onPress={volver}
        >
          <Icon name="chevron-back-outline" color={colores.textoPrimario} size={28} />
        </Pressable>

        <View style={styles.espaciador} />

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo} numberOfLines={2} maxFontSizeMultiplier={1.3}>
          {ejercicioActualizado.nombre}
        </Text>

        <ImagenEjercicio
          ejercicio={ejercicioActualizado.ejercicio}
          style={styles.imagen}
        />

        {/* Progreso + datos del ejercicio en una sola tarjeta. */}
        <View style={styles.tarjetaProgreso}>
          <View style={styles.filaProgreso}>
            <View>
              <Text style={styles.progresoEtiqueta} maxFontSizeMultiplier={maxEscalaFuente}>
                Series
              </Text>
              <Text style={styles.progresoNumero} maxFontSizeMultiplier={1.2}>
                {serie}
                <Text style={styles.progresoTotal}> / {totalSeries}</Text>
              </Text>
            </View>
            <View style={styles.datosDerecha}>
              <Text style={styles.restantes} maxFontSizeMultiplier={maxEscalaFuente}>
                {restantes === 0 ? 'Sin series pendientes' : `Quedan ${restantes}`}
              </Text>
              <View style={styles.dato}>
                <Icon name="timer-outline" size={15} color={colores.textoSecundario} />
                <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                  {formatearDescanso(segundosDescanso(ejercicioActualizado))} de descanso
                </Text>
              </View>
            </View>
          </View>

          <ProgresoSeries
            total={totalSeries}
            realizadas={serie}
            color={finalizado ? colores.exito : colores.principal}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar la nota del ejercicio"
          style={({ pressed }) => [styles.card, pressed && styles.botonIconoPresionado]}
          onPress={() => setModalFormNota(true)}
        >
          <Icon name="document-text-outline" size={18} color={colores.textoSecundario} />
          <Text
            style={[styles.notaTextos, ejercicioActualizado.nota ? styles.notaTexto : styles.notaVacia]}
            numberOfLines={2}
            maxFontSizeMultiplier={maxEscalaFuente}
          >
            {ejercicioActualizado.nota || 'Sin nota. Tocá para agregar una.'}
          </Text>
        </Pressable>

        {registroHoy?.series?.length ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cargar o editar repeticiones y peso de las series de hoy"
            style={({ pressed }) => [styles.registro, pressed && styles.botonIconoPresionado]}
            onPress={() => setModalRegistro(true)}
          >
            <View style={styles.registroEncabezado}>
              <Text style={styles.progresoEtiqueta} maxFontSizeMultiplier={maxEscalaFuente}>
                Registro de hoy
              </Text>
              <Text style={estilosRegistro.enlace} maxFontSizeMultiplier={maxEscalaFuente}>
                {pendientes ? `Cargar (${pendientes})` : 'Editar'}
              </Text>
            </View>
            <View style={styles.chipsSeries}>
              {registroHoy.series.map(s => (
                <View
                  key={s.numero}
                  style={[styles.chipSerie, s.estado === 'registrada' && styles.chipSerieRegistrada]}
                >
                  <Text style={styles.chipSerieTexto} maxFontSizeMultiplier={1.2}>
                    S{s.numero} · {describirSerie(s)}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ) : null}

        {estado && !finalizado ? (
          <View style={styles.enCurso}>
            <Animated.View style={[styles.puntoEnCurso, { opacity: pulsoAnim }]} />
            <Text style={styles.enCursoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              Serie {serie + 1} en curso
            </Text>
          </View>
        ) : null}

        {finalizado ? (
          <View style={styles.badgeFinalizado}>
            <Icon name="checkmark-circle" size={18} color={colores.exito} />
            <Text style={styles.badgeFinalizadoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              ¡Completaste las {totalSeries} series!
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.pie}>
        {estado && !finalizado ? (
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
            <Icon name="checkmark-circle-outline" color={colores.sobreRelleno} size={26} />
            <Text
              style={[styles.botonPrincipalTexto, styles.botonCompletarTexto]}
              maxFontSizeMultiplier={1.2}
            >
              Terminé la serie
            </Text>
          </Pressable>
        ) : finalizado ? (
          <View style={styles.filaBotones}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reiniciar este ejercicio"
              style={({ pressed }) => [styles.botonSecundario, styles.botonFlexible, pressed && styles.botonPresionado]}
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
              <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={1.2}>
                Reiniciar
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver a la rutina"
              style={({ pressed }) => [styles.botonPrincipal, styles.botonFlexible, pressed && styles.botonPresionado]}
              onPress={volver}
            >
              <Icon name="arrow-back-outline" color={colores.sobreAcento} size={22} />
              <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={1.2}>
                Volver
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Empezar la serie ${serie + 1}`}
            style={({ pressed }) => [styles.botonPrincipal, pressed && styles.botonPresionado]}
            onPress={() => setEstado(true)}
          >
            <Icon name="play" color={colores.sobreAcento} size={24} />
            <Text style={styles.botonPrincipalTexto} maxFontSizeMultiplier={1.2}>
              Empezar serie {serie + 1}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Los dos Modal van fuera del ScrollView: abren su propia ventana, pero
          como hijos del scroll igual participan del layout y se re-miden con
          cada scroll y con cada ajuste del teclado. */}
      <FormNota
        visible={modalFormNota}
        onClose={cerrarNota}
        ejercicio={ejercicioActualizado}
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
          registro={registroHoy}
        />
      </Modal>

      <FormRegistroSeries
        visible={modalRegistro}
        registro={registroHoy}
        titulo={`${ejercicioActualizado.nombre}: series de hoy`}
        onClose={() => setModalRegistro(false)}
      />
    </PantallaModal>
  );
};

export default DetalleEjercicio;
