import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../../styles/rutinasAsignadasStyles";
import { colores } from "../../styles/colores";
import {
  actualizarRutinaAsignadaLocal,
  agregarRutina,
  sincronizarEstadoRutinasAsignadas,
} from "../../store/rutinasSlice";
import listadoEjercicios from "../../helpers/ejercicios";

const API_URL = "https://rutina360-server.onrender.com/routine/assign/athlete";
const USER_LINK_URL = "https://rutina360-server.onrender.com/users/link";
const FALLBACK_ATHLETE_ID = 10;
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
      onRequestClose={onClose}
    >
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <Pressable onPress={onClose}>
            <Icon name="chevron-back-outline" color={colores.blanco} size={35} />
          </Pressable>
          <Text style={styles.detailTitle}>{rutina?.name || "Rutina asignada"}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{ejercicios.length} ejercicios</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{rutina?.time || 0} min</Text>
            </View>
            {asignacion?.isActive ? (
              <View style={styles.pill}>
                <Text style={styles.pillText}>Activa</Text>
              </View>
            ) : null}
          </View>

          <Pressable
            style={[
              styles.addButton,
              styles.detailAddButton,
              yaAgregada && !tieneCambios && styles.addButtonDisabled,
            ]}
            disabled={yaAgregada && !tieneCambios}
            onPress={() => (tieneCambios ? onActualizar(asignacion) : onAgregar(asignacion))}
          >
            <Icon
              name={
                tieneCambios
                  ? "sync-outline"
                  : yaAgregada
                    ? "checkmark-circle-outline"
                    : "add-circle-outline"
              }
              color="#fff"
              size={20}
            />
            <Text style={styles.addButtonText}>
              {tieneCambios ? "Actualizar en mis rutinas" : yaAgregada ? "Agregada a mis rutinas" : "Agregar a mis rutinas"}
            </Text>
          </Pressable>

          <Text style={styles.sectionTitle}>Ejercicios</Text>

          {ejercicios.length ? (
            ejercicios.map(item => (
              <View key={item.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{item.Ejercice?.name || "Ejercicio"}</Text>
                <Text style={styles.exerciseGroup}>
                  {item.Ejercice?.MuscleGroup?.name || "Grupo muscular"}
                </Text>
                <Text style={styles.exerciseInfo}>
                  Series: {item.series || 0} | Descanso: {item.rest || 0} min
                </Text>
                {item.comments ? (
                  <Text style={styles.comments}>{item.comments}</Text>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Esta rutina no tiene ejercicios cargados.</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const RutinasAsignadas = () => {
  const dispatch = useDispatch();
  const sesion = useSelector(state => state.usuario.sesion);
  const rutinasLocales = useSelector(state => state.rutinas.rutinas);
  const token = sesion?.token;
  const usuarioBackend = sesion?.user;
  const athleteId = usuarioBackend?.idRole === 4 && usuarioBackend?.id
    ? usuarioBackend.id
    : FALLBACK_ATHLETE_ID;

  const [asignaciones, setAsignaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState("");
  const [coach, setCoach] = useState(null);
  const [cargandoCoach, setCargandoCoach] = useState(false);
  const [errorCoach, setErrorCoach] = useState("");
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const gym = usuarioBackend?.adminOwner;
  const cambiosNotificadosRef = useRef(0);

  const obtenerRutinas = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) {
      setRefrescando(true);
    } else {
      setCargando(true);
    }

    setError("");

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/${athleteId}`, {
        method: "GET",
        headers,
      });

      let body = {};

      try {
        body = await response.json();
      } catch {
        body = {};
      }

      if (!response.ok) {
        throw new Error(body?.message || body?.error || "No se pudieron cargar las rutinas.");
      }

      setAsignaciones(Array.isArray(body?.data) ? body.data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las rutinas.");
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [athleteId, token]);

  const obtenerCoach = useCallback(async () => {
    setCargandoCoach(true);
    setErrorCoach("");

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(USER_LINK_URL, {
        method: "GET",
        headers,
      });

      let body = {};

      try {
        body = await response.json();
      } catch {
        body = {};
      }

      if (!response.ok) {
        throw new Error(body?.message || body?.error || "No se pudo cargar el coach.");
      }

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
  }, [athleteId, token]);

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

  useEffect(() => {
    const totalCambios = rutinasLocales.filter(r => r.tieneCambiosAsignados).length;
    if (totalCambios > 0 && totalCambios !== cambiosNotificadosRef.current) {
      Alert.alert(
        "Rutinas actualizadas",
        `Tenes ${totalCambios} rutina${totalCambios > 1 ? "s" : ""} en Mis Rutinas con cambios del coach.`
      );
      cambiosNotificadosRef.current = totalCambios;
    } else if (totalCambios === 0) {
      cambiosNotificadosRef.current = 0;
    }
  }, [rutinasLocales]);

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
      Alert.alert("Error", "No se pudo leer la rutina asignada.");
      return;
    }

    if (rutinaYaAgregada(asignacion)) {
      Alert.alert("Rutina ya agregada", "Esta rutina ya esta disponible en Mis Rutinas.");
      return;
    }

    const rutinaLocal = convertirAsignacionEnRutinaLocal(asignacion);
    dispatch(agregarRutina(rutinaLocal));
    Alert.alert("Rutina agregada", "La rutina fue agregada a Mis Rutinas.");
  };

  const actualizarRutinaLocal = asignacion => {
    if (!asignacion?.Routine) {
      Alert.alert("Error", "No se pudo leer la rutina asignada.");
      return;
    }

    const rutinaLocal = convertirAsignacionEnRutinaLocal(asignacion);
    dispatch(actualizarRutinaAsignadaLocal({ rutinaActualizada: rutinaLocal }));
    Alert.alert("Rutina actualizada", "La rutina en Mis Rutinas se actualizo con los cambios del coach.");
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
        <Pressable onPress={() => setAsignacionSeleccionada(item)}>
          <View style={styles.cardTop}>
            <Text style={styles.routineName}>{rutina?.name || "Rutina asignada"}</Text>
            <Icon name="chevron-forward-outline" color={colores.blanco} size={25} />
          </View>
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{ejercicios.length} ejercicios</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{rutina?.time || 0} min</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{item.isActive ? "Activa" : "Inactiva"}</Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          style={[styles.addButton, yaAgregada && !tieneCambios && styles.addButtonDisabled]}
          disabled={yaAgregada && !tieneCambios}
          onPress={() => (tieneCambios ? actualizarRutinaLocal(item) : agregarAMisRutinas(item))}
        >
          <Icon
            name={
              tieneCambios
                ? "sync-outline"
                : yaAgregada
                  ? "checkmark-circle-outline"
                  : "add-circle-outline"
            }
            color="#fff"
            size={20}
          />
          <Text style={styles.addButtonText}>
            {tieneCambios ? "Actualizar" : yaAgregada ? "Agregada" : "Agregar a mis rutinas"}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Plan del entrenador</Text>
            <Text style={styles.title}>Rutinas asignadas</Text>
            <Text style={styles.subtitle}>
              Atleta #{athleteId}
            </Text>
          </View>

          <Pressable
            style={[
              styles.refreshButton,
              (cargando || refrescando || cargandoCoach) && styles.refreshButtonDisabled,
            ]}
            disabled={cargando || refrescando || cargandoCoach}
            onPress={refrescarDatos}
          >
            <Icon name="refresh-outline" color={colores.blanco} size={24} />
          </Pressable>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Coach</Text>
            <Text style={styles.infoValue}>
              {cargandoCoach ? "Buscando..." : coach?.username || "Sin coach asignado"}
            </Text>
            {coach?.email ? <Text style={styles.infoSubvalue}>{coach.email}</Text> : null}
            {errorCoach ? <Text style={styles.infoError}>{errorCoach}</Text> : null}
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Gym</Text>
            <Text style={styles.infoValue}>
              {gym?.username || (usuarioBackend?.idAdminOwner ? `Gym #${usuarioBackend.idAdminOwner}` : "Sin gym asignado")}
            </Text>
            {gym?.email ? <Text style={styles.infoSubvalue}>{gym.email}</Text> : null}
          </View>
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => obtenerRutinas()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {cargando ? (
        <ActivityIndicator style={styles.loading} color={colores.cian} size="large" />
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
              tintColor={colores.cian}
              colors={[colores.cian]}
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No hay rutinas asignadas para este atleta.</Text>
            </View>
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
    </View>
  );
};

export default RutinasAsignadas;
