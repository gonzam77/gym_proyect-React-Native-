import { PermissionsAndroid, Platform, View, Text, Pressable, Modal, Image, Animated, FlatList } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { styles } from '../../styles/misRutinasStyles';
import { colores } from '../../styles/colores';
import { maxEscalaFuente } from '../../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import formatearTiempo from '../../helpers/formatearTiempo';
import FormRutina from "./formRutina";
import DetalleRutina from "./detalleRutina";
import BarraProgreso from "../../components/BarraProgreso";
import EstadoVacio from "../../components/EstadoVacio";
import { reordenarRutina } from "../../store/rutinasSlice";

async function requestNotificationPermission() {

  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: "Permiso de notificaciones",
        message: "La app necesita notificarte cuando termine el descanso.",
        buttonPositive: "Aceptar",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

/** Cuenta cuantos ejercicios de la rutina ya tienen todas sus series hechas. */
const contarProgreso = (ejercicios = []) => {
  const total = ejercicios.length;
  const completados = ejercicios.filter(e => {
    const series = Number(e.series) || 0;
    const realizadas = Number(e.seriesRealizadas) || 0;
    return series > 0 && realizadas >= series;
  }).length;

  return { total, completados };
};

const EntrenamientoItem = ({
  rutina,
  index,
  esUltima,
  onAbrir,
  onMover,
}) => {
  const { total, completados } = contarProgreso(rutina.ejercicios);
  const progreso = total > 0 ? completados / total : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir rutina ${rutina.nombre}`}
      onPress={() => onAbrir(rutina.id)}
      style={({ pressed }) => [styles.entrenamiento, pressed && styles.entrenamientoPresionado]}
    >
      <View style={styles.filaPrincipal}>
        <View style={styles.datos}>
          <Text style={styles.nombre} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
            {rutina.nombre}
          </Text>

          {rutina.tieneCambiosAsignados ? (
            <View style={styles.syncBadge}>
              <Icon name="sync-outline" size={13} color={colores.acento} />
              <Text style={styles.syncBadgeText} maxFontSizeMultiplier={maxEscalaFuente}>
                Actualizada por el coach
              </Text>
            </View>
          ) : null}

          <View style={styles.metaFila}>
            <View style={styles.metaItem}>
              <Icon name="time-outline" size={16} color={colores.acento} />
              <Text style={styles.tiempo} maxFontSizeMultiplier={maxEscalaFuente}>
                {formatearTiempo(rutina.tiempo)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="barbell-outline" size={16} color={colores.textoSecundario} />
              <Text style={styles.metaTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                {total} {total === 1 ? 'ejercicio' : 'ejercicios'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.reorderButtonsContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Subir ${rutina.nombre} en la lista`}
              style={({ pressed }) => [
                styles.reorderButton,
                pressed && styles.reorderButtonPresionado,
                index === 0 && styles.reorderButtonDisabled,
              ]}
              disabled={index === 0}
              onPress={(event) => {
                event.stopPropagation();
                onMover(index, -1);
              }}
            >
              <Icon name="chevron-up-outline" size={20} color={colores.textoPrimario} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Bajar ${rutina.nombre} en la lista`}
              style={({ pressed }) => [
                styles.reorderButton,
                pressed && styles.reorderButtonPresionado,
                esUltima && styles.reorderButtonDisabled,
              ]}
              disabled={esUltima}
              onPress={(event) => {
                event.stopPropagation();
                onMover(index, 1);
              }}
            >
              <Icon name="chevron-down-outline" size={20} color={colores.textoPrimario} />
            </Pressable>
          </View>
          <Icon name="chevron-forward-outline" color={colores.textoSecundario} size={24} />
        </View>
      </View>

      {total > 0 ? (
        <View style={styles.progresoContenedor}>
          <Text style={styles.progresoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            {completados === total
              ? 'Rutina completa'
              : `${completados} de ${total} ejercicios hechos`}
          </Text>
          <BarraProgreso
            progreso={progreso}
            color={completados === total ? colores.exito : colores.principal}
            etiqueta={`Progreso de ${rutina.nombre}`}
          />
        </View>
      ) : null}
    </Pressable>
  );
};

const MisRutinas = () => {

  const dispatch = useDispatch();
  const rutinas = useSelector(state => state.rutinas.rutinas);
  const usuario = useSelector(state => state.usuario.usuario);
  const usuarioBackend = useSelector(state => state.usuario.sesion?.user);

  const [modalFormRutina, setModalFormRutina] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(()=>{
    requestNotificationPermission();
  },[]);

  const moverRutina = useCallback((indexActual, direccion) => {
    dispatch(reordenarRutina({ indexActual, direccion }));
  }, [dispatch]);

  const abrirRutina = useCallback((id) => {
    const selectedRutina = rutinas?.find(e => e.id === id);
    setRutinaSeleccionada(selectedRutina);
    setModalDetalle(true);
  }, [rutinas]);

  const nuevaRutina = useCallback(() => {
    setRutinaSeleccionada({});
    setModalFormRutina(true);
  }, []);

  const presionarIn = () => {
    Animated.spring(scaleAnim, {
    toValue: 0.90,
    useNativeDriver: true,
    }).start();
  };

  const presionarOut = () => {
    Animated.spring(scaleAnim, {
    toValue: 1,
    friction: 3,
    tension: 40,
    useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.fondo} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextos}>
            <Text style={styles.saludo} maxFontSizeMultiplier={maxEscalaFuente}>Bienvenido</Text>
            <Text style={styles.userName} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
              {usuarioBackend?.username || usuario?.nombre || 'Atleta'}
            </Text>
          </View>
          <Image style={styles.image} source={require('../../assets/img/logo1.png')} />
        </View>

        <FlatList
          data={rutinas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <EntrenamientoItem
              rutina={item}
              index={index}
              esUltima={index === rutinas.length - 1}
              onAbrir={abrirRutina}
              onMover={moverRutina}
            />
          )}
          ListEmptyComponent={() => (
            <EstadoVacio
              icono="barbell-outline"
              titulo="Todavía no tenés rutinas"
              descripcion="Armá tu primera rutina o traé una de las que te asignó tu coach."
              textoAccion="Crear una rutina"
              onAccion={nuevaRutina}
            />
          )}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Crear una rutina nueva"
          onPressIn={presionarIn}
          onPressOut={presionarOut}
          style={styles.btnCircular}
          onPress={nuevaRutina}
        >
          <Animated.Image style={[styles.agregar, {transform:[{scale: scaleAnim}]}]} source={require('../../assets/img/agregar.png')} />
        </Pressable>
      </View>

      <Modal
        visible={modalDetalle}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setModalDetalle(false)}
      >
        <DetalleRutina
          rutinaSeleccionada={rutinaSeleccionada}
          setRutinaSeleccionada={setRutinaSeleccionada}
          rutinas={rutinas}
          setModalFormRutina={setModalFormRutina}
          setModalDetalle={setModalDetalle}
        />
      </Modal>

      <Modal
        visible={modalFormRutina}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setModalFormRutina(false)}
      >
        <FormRutina
          rutinas={rutinas}
          setModalFormRutina={setModalFormRutina}
          rutinaSeleccionada={rutinaSeleccionada}
          setRutinaSeleccionada={setRutinaSeleccionada}
        />
      </Modal>

    </SafeAreaView>

  );
};

export default MisRutinas;
