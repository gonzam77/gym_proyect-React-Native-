import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, Modal, Pressable, ScrollView, Text, Vibration, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLOR_FASE, styles } from '../../styles/ejecucionFuncionalStyles';
import { colores } from '../../styles/colores';
import { maxEscalaFuente } from '../../styles/theme';
import PantallaModal from '../../components/PantallaModal';
import BarraProgreso from '../../components/BarraProgreso';
import ImagenEjercicio from '../../components/ImagenEjercicio';
import ResumenFuncional from './resumenFuncional';
import { guardarSesionFuncional } from '../../store/sesionFuncionalSlice';
import { terminarYGuardarSesion } from '../../store/sesionFuncionalAcciones';
import {
  NOMBRES_FASE,
  bloquesDe,
  etiquetaModo,
  formatearReloj,
  indiceSiguienteTrabajo,
  nombreBloque,
  vueltasDe,
} from '../../helpers/funcional';
import {
  anterior,
  continuar,
  estadoEn,
  estaPausada,
  faseActual,
  pausar,
  progresoTotal,
  reanudar,
  restanteMs,
  saltar,
} from '../../helpers/sesionFuncional';
import { cancelarFases, programarFases } from '../../services/fasesFuncional';
import { liberarPitidos, pitidoCorto, pitidoLargo, prepararPitidos } from '../../services/pitidos';
import { mantenerPantallaEncendida, permitirApagarPantalla } from '../../services/pantallaEncendida';
import { abrirAjustesAlarmaExacta, puedeProgramarAlarmaExacta } from '../../services/descansoAlarma';

const REFRESCO_MS = 250;

const BotonControl = ({ icono, texto, onPress, deshabilitado }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={texto}
    accessibilityState={{ disabled: Boolean(deshabilitado) }}
    disabled={deshabilitado}
    hitSlop={6}
    style={({ pressed }) => [styles.botonControl, (pressed || deshabilitado) && styles.presionado]}
    onPress={onPress}
  >
    <Icon name={icono} size={32} color={deshabilitado ? colores.textoTenue : colores.textoPrimario} />
    <Text style={styles.botonControlTexto} maxFontSizeMultiplier={1.2}>{texto}</Text>
  </Pressable>
);

/**
 * Lo que se ve mientras corre la sesion. La cuenta regresiva es solo visual:
 * se recalcula cada 250 ms contra los instantes absolutos de la sesion
 * (helpers/sesionFuncional.js), nunca restando de a un segundo. Si Android
 * congela la app, al volver se pone al dia de una.
 */
const Pantalla = ({ onClose, salirRef }) => {
  const dispatch = useDispatch();
  const sesion = useSelector(state => state.sesionFuncional?.sesion);
  const [ahora, setAhora] = useState(Date.now());
  const [resumen, setResumen] = useState(null);
  const [faltaPermiso, setFaltaPermiso] = useState(false);
  const cerradaRef = useRef(false);
  const ultimoPitidoRef = useRef('');
  const indicePrevioRef = useRef(null);
  const enPrimerPlanoRef = useRef(AppState.currentState === 'active');

  const actual = useMemo(() => (sesion ? estadoEn(sesion, ahora) : null), [sesion, ahora]);
  const actualRef = useRef(actual);
  actualRef.current = actual;

  // Mientras se entrena el telefono queda apoyado: sin esto la pantalla se
  // apaga al minuto. El cleanup es obligatorio (el flag vive en la ventana).
  useEffect(() => {
    mantenerPantallaEncendida();
    prepararPitidos();
    return () => {
      permitirApagarPantalla();
      liberarPitidos();
    };
  }, []);

  useEffect(() => {
    if (resumen) {return undefined;}
    const intervalo = setInterval(() => setAhora(Date.now()), REFRESCO_MS);
    return () => clearInterval(intervalo);
  }, [resumen]);

  const revisarPermiso = useCallback(async () => {
    setFaltaPermiso(!(await puedeProgramarAlarmaExacta()));
  }, []);

  /**
   * Con la app abierta avisan los pitidos; al irse a segundo plano (o al
   * bloquear el telefono) se le pasan al sistema los proximos cambios de fase
   * como notificaciones con hora exacta. Al volver se cancelan.
   */
  useEffect(() => {
    revisarPermiso();
    cancelarFases();
    const suscripcion = AppState.addEventListener('change', estado => {
      const activa = estado === 'active';
      enPrimerPlanoRef.current = activa;
      if (activa) {
        cancelarFases();
        setAhora(Date.now());
        revisarPermiso();
      } else if (actualRef.current && !actualRef.current.terminada) {
        programarFases(actualRef.current);
      }
    });
    return () => suscripcion.remove();
  }, [revisarPermiso]);

  // La fase avanzo sola: se guarda, asi si Android mata la app se retoma ahi.
  useEffect(() => {
    if (!sesion || !actual || actual.terminada) {return;}
    if (actual.indice !== sesion.indice) {dispatch(guardarSesionFuncional(actual));}
  }, [actual, dispatch, sesion]);

  const cerrarSesion = useCallback(instante => {
    if (cerradaRef.current || !actualRef.current) {return;}
    cerradaRef.current = true;
    const registro = dispatch(terminarYGuardarSesion(actualRef.current, instante));
    setResumen(registro);
  }, [dispatch]);

  // Termino sola (paso la ultima fase).
  useEffect(() => {
    if (actual?.terminada) {
      if (enPrimerPlanoRef.current) {
        pitidoLargo();
        Vibration.vibrate([0, 400, 200, 400]);
      }
      cerrarSesion(actual.terminadaEn);
    }
  }, [actual?.terminada, actual?.terminadaEn, cerrarSesion]);

  const fase = faseActual(actual);
  const restante = restanteMs(actual, ahora);
  const segundosRestantes = restante == null ? null : Math.ceil(restante / 1000);
  const pausada = estaPausada(actual);

  // Pitidos 3-2-1 en los ultimos segundos de cada fase, y el largo al cambiar.
  useEffect(() => {
    if (!actual || actual.terminada || !enPrimerPlanoRef.current) {return;}

    if (indicePrevioRef.current !== null && indicePrevioRef.current !== actual.indice) {
      pitidoLargo();
      Vibration.vibrate(150);
    }
    indicePrevioRef.current = actual.indice;

    if (pausada || segundosRestantes == null || segundosRestantes < 1 || segundosRestantes > 3) {return;}
    const clave = `${actual.indice}-${segundosRestantes}`;
    if (ultimoPitidoRef.current === clave) {return;}
    ultimoPitidoRef.current = clave;
    pitidoCorto();
  }, [actual, pausada, segundosRestantes]);

  const aplicar = accion => {
    if (!actualRef.current || actualRef.current.terminada) {return;}
    dispatch(guardarSesionFuncional(accion(actualRef.current, Date.now())));
    setAhora(Date.now());
  };

  const confirmarTerminar = () => {
    Alert.alert('Terminar el funcional', '¿Querés terminar ahora? Se guarda lo que hiciste hasta acá.', [
      { text: 'Seguir', style: 'cancel' },
      { text: 'Terminar', style: 'destructive', onPress: () => cerrarSesion(Date.now()) },
    ]);
  };

  // Salir sin terminar deja la sesion en pausa: si siguiera corriendo, nadie
  // avisaria los cambios de fase (la app sigue abierta, en otra pantalla).
  const pedirSalir = () => {
    if (resumen || !actualRef.current) {
      onClose();
      return;
    }
    Alert.alert('Salir del funcional', 'Lo dejamos en pausa y lo podés retomar desde la pestaña Funcional.', [
      { text: 'Seguir entrenando', style: 'cancel' },
      {
        text: 'Pausar y salir',
        onPress: () => {
          aplicar(pausar);
          onClose();
        },
      },
      { text: 'Terminar y guardar', style: 'destructive', onPress: () => cerrarSesion(Date.now()) },
    ]);
  };
  salirRef.current = pedirSalir;

  if (resumen) {
    return <ResumenFuncional registro={resumen} onListo={onClose} />;
  }

  if (!actual || !fase) {
    return <PantallaModal style={styles.container} />;
  }

  const funcional = actual.funcional;
  const bloques = bloquesDe(funcional);
  const vueltas = vueltasDe(funcional);
  const enDescanso = fase.tipo === 'descanso' || fase.tipo === 'descansoVueltas';
  const indiceProximo = indiceSiguienteTrabajo(actual.fases, actual.indice);
  const proximo = indiceProximo >= 0 ? bloques[actual.fases[indiceProximo].bloque] : null;
  // En el descanso se muestra lo que viene, que es lo que hay que preparar.
  const bloqueEnPantalla = enDescanso && proximo ? proximo : bloques[fase.bloque];
  const colorFase = COLOR_FASE[fase.tipo] || colores.textoPrimario;
  const esEspera = fase.tipo === 'espera';

  return (
    <PantallaModal style={styles.container}>
      <View style={styles.barraSuperior}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salir del funcional"
          hitSlop={8}
          style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
          onPress={pedirSalir}
        >
          <Icon name="close" size={28} color={colores.textoPrimario} />
        </Pressable>
        <Text style={styles.nombreFuncional} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
          {funcional?.nombre}
        </Text>
        <Text style={styles.modo} maxFontSizeMultiplier={1.2}>{etiquetaModo(actual.modo)}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {faltaPermiso ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir los ajustes de alarmas y recordatorios"
            style={({ pressed }) => [styles.bannerPermiso, pressed && styles.presionado]}
            onPress={abrirAjustesAlarmaExacta}
          >
            <Icon name="alarm-outline" size={22} color={colores.aviso} />
            <Text style={styles.bannerPermisoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              Con la pantalla bloqueada los avisos pueden llegar tarde. Tocá para permitir alarmas exactas.
            </Text>
          </Pressable>
        ) : null}

        <Text
          style={[styles.fase, { color: colorFase }]}
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          maxFontSizeMultiplier={1.2}
        >
          {pausada ? 'En pausa' : NOMBRES_FASE[fase.tipo]}
        </Text>

        <Text style={styles.ejercicio} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
          {enDescanso ? `Sigue: ${proximo ? nombreBloque(proximo) : ''}` : nombreBloque(bloqueEnPantalla)}
        </Text>

        {esEspera ? (
          <Text style={styles.textoEspera} maxFontSizeMultiplier={maxEscalaFuente}>
            Tocá Iniciar cuando estés listo
          </Text>
        ) : (
          <Text
            style={[styles.reloj, pausada && styles.relojPausado]}
            accessibilityLabel={`Quedan ${segundosRestantes} segundos`}
            maxFontSizeMultiplier={1}
          >
            {formatearReloj(segundosRestantes)}
          </Text>
        )}

        <Text style={styles.posicion} maxFontSizeMultiplier={maxEscalaFuente}>
          {vueltas > 1 ? `Vuelta ${fase.vuelta} de ${vueltas} · ` : ''}Bloque {fase.bloque + 1} de {bloques.length}
        </Text>
        {fase.tipo === 'trabajo' && proximo ? (
          <Text style={styles.siguiente} maxFontSizeMultiplier={maxEscalaFuente}>
            Siguiente: {nombreBloque(proximo)}
          </Text>
        ) : null}

        <BarraProgreso progreso={progresoTotal(actual, ahora)} color={colorFase} etiqueta="Progreso del funcional" />

        {bloqueEnPantalla?.nota && !enDescanso ? (
          <Text style={styles.nota} maxFontSizeMultiplier={maxEscalaFuente}>{bloqueEnPantalla.nota}</Text>
        ) : null}

        <ImagenEjercicio ejercicio={bloqueEnPantalla?.ejercicio} style={styles.imagen} />
      </ScrollView>

      <View style={styles.pie}>
        {esEspera ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Iniciar ${nombreBloque(bloqueEnPantalla)}`}
            style={({ pressed }) => [styles.botonIniciarEspera, pressed && styles.presionado]}
            onPress={() => aplicar(continuar)}
          >
            <Icon name="play" size={28} color={colores.sobreAcento} />
            <Text style={styles.botonIniciarEsperaTexto} maxFontSizeMultiplier={maxEscalaFuente}>Iniciar</Text>
          </Pressable>
        ) : null}

        <View style={styles.controles}>
          <BotonControl icono="play-skip-back" texto="Anterior" onPress={() => aplicar(anterior)} />
          {esEspera ? (
            <View style={styles.botonControl} />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={pausada ? 'Reanudar' : 'Pausar'}
              style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
              onPress={() => aplicar(pausada ? reanudar : pausar)}
            >
              <Icon name={pausada ? 'play' : 'pause'} size={40} color={colores.sobreAcento} />
            </Pressable>
          )}
          <BotonControl icono="play-skip-forward" texto="Saltar" onPress={() => aplicar(saltar)} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terminar el funcional"
          style={({ pressed }) => [styles.botonTerminar, pressed && styles.presionado]}
          onPress={confirmarTerminar}
        >
          <Icon name="stop-circle-outline" size={20} color={colores.peligro} />
          <Text style={styles.botonTerminarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Terminar</Text>
        </Pressable>
      </View>
    </PantallaModal>
  );
};

/**
 * Pantalla completa de ejecucion. El boton atras de Android pasa por la misma
 * pregunta que la X (seguir, pausar y salir o terminar).
 */
const EjecucionFuncional = ({ visible, onClose }) => {
  const salirRef = useRef(null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => (salirRef.current ? salirRef.current() : onClose())}
    >
      {visible ? <Pantalla onClose={onClose} salirRef={salirRef} /> : null}
    </Modal>
  );
};

export default EjecucionFuncional;
