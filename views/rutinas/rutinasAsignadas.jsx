import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../../styles/rutinasAsignadasStyles";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import EstadoVacio from "../../components/EstadoVacio";
import Esqueleto from "../../components/Esqueleto";
import PantallaModal from "../../components/PantallaModal";
import { avisoError, avisoExito } from "../../helpers/avisos";
import {
  actualizarRutinaAsignadaLocal,
  agregarRutina,
  sincronizarEstadoRutinasAsignadas,
} from "../../store/rutinasSlice";
import listadoEjercicios from "../../helpers/ejercicios";
import { apiJson } from "../../services/apiClient";

const DEFAULT_EXERCISE_SECONDS = 40;

const generarId = () =>
  Math.random().toString(36).substring(2, 10) +
  Date.now().toString(36);

const normalizarTexto = texto =>
  texto
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const mapearCategoria = grupoMuscular => {
  const grupo = normalizarTexto(grupoMuscular);
  const categorias = {
    abdomen: "abdominales",
    abdominales: "abdominales",
    aductores: "aductores",
    antebrazos: "antebrazos",
    biceps: "biceps",
    cuadriceps: "cuadriceps",
    espalda: "espalda",
    gemelos: "gemelos",
    gluteo: "gluteos",
    gluteos: "gluteos",
    hombro: "hombros",
    hombros: "hombros",
    isquiotibiales: "isquiotibiales",
    lumbares: "lumbares",
    pecho: "pecho",
    triceps: "triceps",
  };

  return categorias[grupo] || grupo || "";
};

const buscarEjercicioLocal = ejercicioBackend => {
  const nombre = normalizarTexto(ejercicioBackend?.name);
  const idBackend = ejercicioBackend?.id;

  return listadoEjercicios.find(e => normalizarTexto(e.nombre) === nombre)
    || listadoEjercicios.find(e => e.idEjercicio === idBackend);
};

const construirHuellaAsignacion = asignacion => {
  const rutina = asignacion?.Routine;
  const ejercicios = (rutina?.Routine_Ejercices || [])
    .map(item => ({
      id: item?.id || 0,
      idEjercicio: item?.Ejercice?.id || 0,
      nombre: normalizarTexto(item?.Ejercice?.name) || "",
      series: Number(item?.series) || 0,
      descanso: Number(item?.rest) || 0,
      comentarios: (item?.comments || "").trim(),
    }))
    .sort((a, b) => a.id - b.id);

  return JSON.stringify({
    idAsignacion: asignacion?.id || 0,
    idRoutine: rutina?.id || 0,
    nombre: normalizarTexto(rutina?.name) || "",
    tiempo: Number(rutina?.time) || 0,
    ejercicios,
  });
};

const convertirAsignacionEnRutinaLocal = asignacion => {
  const rutina = asignacion?.Routine;
  const ejerciciosBackend = rutina?.Routine_Ejercices || [];

  const ejercicios = ejerciciosBackend.map(item => {
    const ejercicioBackend = item.Ejercice;
    const ejercicioLocal = buscarEjercicioLocal(ejercicioBackend);
    const categoria = mapearCategoria(ejercicioBackend?.MuscleGroup?.name);
    const ejercicio = ejercicioLocal || {
      idEjercicio: ejercicioBackend?.id,
      categoria,
      nombre: ejercicioBackend?.name || "Ejercicio",
      tiempoEjecucion: DEFAULT_EXERCISE_SECONDS,
    };

    return {
      id: generarId(),
      idBackend: item.id,
      ejercicio,
      nombre: ejercicio.nombre,
      series: Number(item.series) || 0,
      descanso: Number(item.rest) || 0,
      seriesRealizadas: 0,
      nota: item.comments || "",
    };
  });

  const tiempoCalculado = ejercicios.reduce((total, item) => {
    const tiempoEjecucion = item.ejercicio?.tiempoEjecucion || DEFAULT_EXERCISE_SECONDS;
    return total + (tiempoEjecucion * item.series) + (item.descanso * item.series * 60);
  }, 0);

  return {
    id: generarId(),
    idAsignacionBackend: asignacion?.id,
    idRoutineBackend: rutina?.id,
    huellaAsignacion: construirHuellaAsignacion(asignacion),
    huellaAsignacionActual: construirHuellaAsignacion(asignacion),
    tieneCambiosAsignados: false,
    origen: "asignada",
    nombre: rutina?.name || "Rutina asignada",
    ejercicios,
    estado: 0,
    tiempo: tiempoCalculado || ((Number(rutina?.time) || 0) * 60),
  };
};

/** Boton de agregar / actualizar, con los tres estados posibles. */
const BotonAgregar = ({ yaAgregada, tieneCambios, onAgregar, onActualizar, extra, compacto }) => {
  const deshabilitado = yaAgregada && !tieneCambios;
  const texto = tieneCambios
    ? (compacto ? "Actualizar" : "Actualizar en mis rutinas")
    : yaAgregada
      ? (compacto ? "Agregada" : "Agregada a mis rutinas")
      : "Agregar a mis rutinas";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={texto}
      accessibilityState={{ disabled: deshabilitado }}
      style={({ pressed }) => [
        styles.addButton,
        extra,
        tieneCambios && styles.addButtonActualizar,
        deshabilitado && styles.addButtonDisabled,
        pressed && styles.addButtonPresionado,
      ]}
      disabled={deshabilitado}
      onPress={tieneCambios ? onActualizar : onAgregar}
    >
      <Icon
        name={
          tieneCambios
            ? "sync-outline"
            : yaAgregada
              ? "checkmark-circle-outline"
              : "add-circle-outline"
        }
        color={
          tieneCambios
            ? colores.sobreAcento
            : deshabilitado
              ? colores.textoSecundario
              : colores.sobreRelleno
        }
        size={20}
      />
      <Text
        style={[
          styles.addButtonText,
          tieneCambios && styles.addButtonTextActualizar,
          deshabilitado && styles.addButtonTextDisabled,
        ]}
        maxFontSizeMultiplier={maxEscalaFuente}
      >
        {texto}
      </Text>
    </Pressable>
  );
};

const RutinaAsignadaDetalle = ({
  asignacion,
  visible,
  onClose,
  onAgregar,
  onActualizar,
  yaAgregada,
  tieneCambios,
}) => {
  const rutina = asignacion?.Routine;
  const ejercicios = rutina?.Routine_Ejercices || [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <PantallaModal>
        <View style={styles.detailHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a las rutinas asignadas"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={onClose}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>
          <Text style={styles.detailTitle} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
            {rutina?.name || "Rutina asignada"}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText} maxFontSizeMultiplier={maxEscalaFuente}>
                {ejercicios.length} {ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText} maxFontSizeMultiplier={maxEscalaFuente}>
                {rutina?.time || 0} min
              </Text>
            </View>
            {asignacion?.isActive ? (
              <View style={styles.pill}>
                <Text style={styles.pillText} maxFontSizeMultiplier={maxEscalaFuente}>Activa</Text>
              </View>
            ) : null}
          </View>

          <BotonAgregar
            yaAgregada={yaAgregada}
            tieneCambios={tieneCambios}
            onAgregar={() => onAgregar(asignacion)}
            onActualizar={() => onActualizar(asignacion)}
            extra={styles.detailAddButton}
          />

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={maxEscalaFuente}>Ejercicios</Text>

          {ejercicios.length ? (
            ejercicios.map(item => (
              <View key={item.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseName} maxFontSizeMultiplier={maxEscalaFuente}>
                  {item.Ejercice?.name || "Ejercicio"}
                </Text>
                <Text style={styles.exerciseGroup} maxFontSizeMultiplier={maxEscalaFuente}>
                  {item.Ejercice?.MuscleGroup?.name || "Grupo muscular"}
                </Text>
                <Text style={styles.exerciseInfo} maxFontSizeMultiplier={maxEscalaFuente}>
                  {item.series || 0} series · {item.rest || 0} min de descanso
                </Text>
                {item.comments ? (
                  <Text style={styles.comments} maxFontSizeMultiplier={maxEscalaFuente}>
                    {item.comments}
                  </Text>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText} maxFontSizeMultiplier={maxEscalaFuente}>
              Esta rutina no tiene ejercicios cargados.
            </Text>
          )}
        </ScrollView>
      </PantallaModal>
    </Modal>
  );
};

const RutinasAsignadas = () => {
  const dispatch = useDispatch();
  const sesion = useSelector(state => state.usuario.sesion);
  const rutinasLocales = useSelector(state => state.rutinas.rutinas);
  const usuarioBackend = sesion?.user;
  const athleteId = usuarioBackend?.id ?? null;

  const [asignaciones, setAsignaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState("");
  const [coach, setCoach] = useState(null);
  const [cargandoCoach, setCargandoCoach] = useState(false);
  const [errorCoach, setErrorCoach] = useState("");
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const gym = usuarioBackend?.adminOwner;
  const cambiosNotificadosRef = useRef(0);

  const obtenerRutinas = useCallback(async ({ refresh = false } = {}) => {
    if (!athleteId) {
      setAsignaciones([]);
      setError("");
      return;
    }

    if (refresh) {
      setRefrescando(true);
    } else {
      setCargando(true);
    }

    setError("");

    try {
      const body = await apiJson(`/routine/assign/athlete/${athleteId}`, {
        method: "GET",
      });

      setAsignaciones(Array.isArray(body?.data) ? body.data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las rutinas.");
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [athleteId]);

  const obtenerCoach = useCallback(async () => {
    if (!athleteId) {
      setCoach(null);
      setErrorCoach("");
      return;
    }

    setCargandoCoach(true);
    setErrorCoach("");

    try {
      const body = await apiJson("/users/link", {
        method: "GET",
      });

      const relaciones = Array.isArray(body?.data) ? body.data : [];
      const relacionActiva = relaciones.find(item =>
        item?.idAthlete === athleteId
        && item?.isActive
        && !item?.isDeleted
        && item?.coach
      );

      if (relacionActiva?.coach) {
        setCoach({
          id: relacionActiva.coach.id,
          username: relacionActiva.coach.username,
          email: relacionActiva.coach.email,
        });
      } else {
        setCoach(null);
      }
    } catch (err) {
      setCoach(null);
      setErrorCoach(err.message || "No se pudo cargar el coach.");
    } finally {
      setCargandoCoach(false);
    }
  }, [athleteId]);

  const refrescarDatos = useCallback(() => {
    obtenerRutinas({ refresh: true });
    obtenerCoach();
  }, [obtenerCoach, obtenerRutinas]);

  useEffect(() => {
    obtenerRutinas();
    obtenerCoach();
  }, [obtenerCoach, obtenerRutinas]);

  useEffect(() => {
    if (!asignaciones.length) {
      return;
    }

    const estadoAsignaciones = asignaciones.map(asignacion => ({
      idAsignacionBackend: asignacion?.id,
      idRoutineBackend: asignacion?.Routine?.id,
      huellaAsignacion: construirHuellaAsignacion(asignacion),
    }));

    dispatch(sincronizarEstadoRutinasAsignadas(estadoAsignaciones));
  }, [asignaciones, dispatch]);

  const totalCambios = rutinasLocales.filter(r => r.tieneCambiosAsignados).length;

  /**
   * Los cambios del coach se avisan con un banner en la pantalla, no con un
   * Alert: el Alert saltaba solo al entrar a la pestania, tapaba el contenido y
   * habia que cerrarlo para poder mirar las rutinas.
   */
  useEffect(() => {
    if (totalCambios > 0 && totalCambios !== cambiosNotificadosRef.current) {
      setBannerVisible(true);
      cambiosNotificadosRef.current = totalCambios;
    } else if (totalCambios === 0) {
      cambiosNotificadosRef.current = 0;
    }
  }, [totalCambios]);

  const rutinaYaAgregada = asignacion => {
    const idAsignacion = asignacion?.id;
    const idRoutine = asignacion?.Routine?.id;

    if (!idAsignacion && !idRoutine) {
      return false;
    }

    return rutinasLocales.some(rutina =>
      (idAsignacion && rutina.idAsignacionBackend === idAsignacion)
      || (idRoutine && rutina.idRoutineBackend === idRoutine)
    );
  };

  const agregarAMisRutinas = asignacion => {
    if (!asignacion?.Routine) {
      avisoError("No se pudo leer la rutina asignada");
      return;
    }

    if (rutinaYaAgregada(asignacion)) {
      avisoError("Esa rutina ya está en Mis Rutinas");
      return;
    }

    const rutinaLocal = convertirAsignacionEnRutinaLocal(asignacion);
    dispatch(agregarRutina(rutinaLocal));
    avisoExito("Rutina agregada", "Ya la tenés disponible en Mis Rutinas.");
  };

  const actualizarRutinaLocal = asignacion => {
    if (!asignacion?.Routine) {
      avisoError("No se pudo leer la rutina asignada");
      return;
    }

    const rutinaLocal = convertirAsignacionEnRutinaLocal(asignacion);
    dispatch(actualizarRutinaAsignadaLocal({ rutinaActualizada: rutinaLocal }));
    avisoExito("Rutina actualizada", "Se aplicaron los cambios del coach.");
  };

  const renderRutina = ({ item }) => {
    const rutina = item.Routine;
    const ejercicios = rutina?.Routine_Ejercices || [];
    const yaAgregada = rutinaYaAgregada(item);
    const rutinaLocalVinculada = rutinasLocales.find(r =>
      (item?.id && r.idAsignacionBackend === item.id)
      || (item?.Routine?.id && r.idRoutineBackend === item.Routine.id)
    );
    const tieneCambios = Boolean(rutinaLocalVinculada?.tieneCambiosAsignados);

    return (
      <View style={styles.card}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver la rutina ${rutina?.name || 'asignada'}`}
          style={({ pressed }) => [pressed && styles.cardPresionada]}
          onPress={() => setAsignacionSeleccionada(item)}
        >
          <View style={styles.cardTop}>
            <Text style={styles.routineName} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
              {rutina?.name || "Rutina asignada"}
            </Text>
            <Icon name="chevron-forward-outline" color={colores.textoSecundario} size={24} />
          </View>
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText} maxFontSizeMultiplier={maxEscalaFuente}>
                {ejercicios.length} {ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText} maxFontSizeMultiplier={maxEscalaFuente}>
                {rutina?.time || 0} min
              </Text>
            </View>
            <View style={[styles.pill, !item.isActive && styles.pillInactiva]}>
              <Text
                style={[styles.pillText, !item.isActive && styles.pillTextInactiva]}
                maxFontSizeMultiplier={maxEscalaFuente}
              >
                {item.isActive ? "Activa" : "Inactiva"}
              </Text>
            </View>
          </View>
        </Pressable>

        <BotonAgregar
          compacto
          yaAgregada={yaAgregada}
          tieneCambios={tieneCambios}
          onAgregar={() => agregarAMisRutinas(item)}
          onActualizar={() => actualizarRutinaLocal(item)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow} maxFontSizeMultiplier={maxEscalaFuente}>
              Plan del entrenador
            </Text>
            <Text style={styles.title} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
              Rutinas asignadas
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Actualizar las rutinas asignadas"
            accessibilityState={{ busy: cargando || refrescando || cargandoCoach }}
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshButtonPresionado,
              (cargando || refrescando || cargandoCoach) && styles.refreshButtonDisabled,
            ]}
            disabled={cargando || refrescando || cargandoCoach}
            onPress={refrescarDatos}
          >
            <Icon name="refresh-outline" color={colores.textoPrimario} size={22} />
          </Pressable>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel} maxFontSizeMultiplier={maxEscalaFuente}>Coach</Text>
            <Text style={styles.infoValue} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
              {cargandoCoach ? "Buscando..." : coach?.username || "Sin coach asignado"}
            </Text>
            {coach?.email ? (
              <Text style={styles.infoSubvalue} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
                {coach.email}
              </Text>
            ) : null}
            {errorCoach ? (
              <Text style={styles.infoError} maxFontSizeMultiplier={maxEscalaFuente}>{errorCoach}</Text>
            ) : null}
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel} maxFontSizeMultiplier={maxEscalaFuente}>Gym</Text>
            <Text style={styles.infoValue} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
              {gym?.username || "Sin gym asignado"}
            </Text>
            {gym?.email ? (
              <Text style={styles.infoSubvalue} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
                {gym.email}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {totalCambios > 0 && bannerVisible ? (
        <View style={styles.banner}>
          <Icon name="sync-circle-outline" size={22} color={colores.acento} />
          <Text style={styles.bannerTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            Tenés {totalCambios} {totalCambios > 1 ? 'rutinas' : 'rutina'} en Mis Rutinas con
            cambios del coach. Tocá "Actualizar" para aplicarlos.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ocultar el aviso de cambios"
            hitSlop={8}
            style={styles.bannerCerrar}
            onPress={() => setBannerVisible(false)}
          >
            <Icon name="close" size={20} color={colores.textoSecundario} />
          </Pressable>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <View style={styles.errorFila}>
            <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
            <Text style={styles.errorText} maxFontSizeMultiplier={maxEscalaFuente}>{error}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reintentar"
            style={({ pressed }) => [styles.retryButton, pressed && styles.addButtonPresionado]}
            onPress={() => obtenerRutinas()}
          >
            <Text style={styles.retryText} maxFontSizeMultiplier={maxEscalaFuente}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {cargando ? (
        <View style={styles.content}>
          <Esqueleto cantidad={3} />
        </View>
      ) : (
        <FlatList
          data={asignaciones}
          keyExtractor={item => item.id.toString()}
          renderItem={renderRutina}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={refrescarDatos}
              tintColor={colores.acento}
              colors={[colores.acento]}
            />
          }
          ListEmptyComponent={() => (
            athleteId ? (
              <EstadoVacio
                icono="clipboard-outline"
                titulo="No tenés rutinas asignadas"
                descripcion="Cuando tu coach te asigne una, va a aparecer acá. Desliza hacia abajo para actualizar."
              />
            ) : (
              <EstadoVacio
                icono="person-circle-outline"
                titulo="No pudimos identificar tu usuario"
                descripcion="Volvé a iniciar sesión para ver las rutinas que te asignaron."
              />
            )
          )}
        />
      )}

      <RutinaAsignadaDetalle
        visible={Boolean(asignacionSeleccionada)}
        asignacion={asignacionSeleccionada}
        onClose={() => setAsignacionSeleccionada(null)}
        onAgregar={agregarAMisRutinas}
        onActualizar={actualizarRutinaLocal}
        yaAgregada={rutinaYaAgregada(asignacionSeleccionada)}
        tieneCambios={Boolean(rutinasLocales.find(r =>
          (asignacionSeleccionada?.id && r.idAsignacionBackend === asignacionSeleccionada.id)
          || (asignacionSeleccionada?.Routine?.id && r.idRoutineBackend === asignacionSeleccionada.Routine.id)
        )?.tieneCambiosAsignados)}
      />
    </SafeAreaView>
  );
};

export default RutinasAsignadas;
