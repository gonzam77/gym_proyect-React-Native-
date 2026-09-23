import { AppState, Image, Pressable, ScrollView, Text, Vibration, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/descansoStyles';
import { colores } from '../../styles/colores';
import { maxEscalaFuente } from '../../styles/theme';
import BarraProgreso from '../../components/BarraProgreso';
import FormNota from '../../components/formNota';
import PantallaModal from '../../components/PantallaModal';
import {
  abrirAjustesAlarmaExacta,
  cancelarDescanso,
  programarDescanso,
  puedeProgramarAlarmaExacta,
} from '../../services/descansoAlarma';
import {
  mantenerPantallaEncendida,
  permitirApagarPantalla,
} from '../../services/pantallaEncendida';

const AJUSTE_MS = 30 * 1000;

/**
 * Pantalla de descanso.
 *
 * El contador de esta pantalla es puramente visual: quien realmente mide el
 * descanso es el sistema operativo, via la alarma que programa
 * services/descansoAlarma. Por eso el tiempo se calcula siempre a partir de
 * finEnRef (un instante absoluto) y nunca restando de a un segundo, que es lo
 * que se desincronizaba cuando Android congelaba el proceso en segundo plano.
 */
const Descanso = ({ setModalDescanso, ejercicio, serie }) => {
  const totalMs = (Number(ejercicio?.descanso) || 0) * 60 * 1000;

  const [restanteMs, setRestanteMs] = useState(totalMs);
  const [activo, setActivo] = useState(totalMs > 0);
  const [faltaPermisoAlarma, setFaltaPermisoAlarma] = useState(false);
  const [modalFormNota, setModalFormNota] = useState(false);

  const termino = totalMs > 0 && restanteMs === 0;

  // Unica fuente de verdad mientras corre el descanso.
  const finEnRef = useRef(Date.now() + totalMs);

  const faltaPermisoRef = useRef(false);

  // Para no vibrar dos veces por el mismo descanso.
  const yaVibroRef = useRef(false);

  // Datos de la notificacion en un ref, para que programar() sea estable y no
  // reprograme la alarma cada vez que el ejercicio se re-renderiza.
  const datosRef = useRef(null);
  datosRef.current = {
    ejercicio: ejercicio?.nombre,
    serie,
    totalSeries: ejercicio?.series,
  };

  const sincronizar = useCallback(() => {
    const restante = Math.max(finEnRef.current - Date.now(), 0);
    setRestanteMs(restante);

    if (restante === 0) {
      setActivo(false);

      // Aviso tactil al terminar, para cuando la app esta en pantalla y el
      // sonido del gimnasio tapa la alarma.
      if (!yaVibroRef.current) {
        yaVibroRef.current = true;
        Vibration.vibrate([0, 400, 200, 400]);
      }
    }
  }, []);

  const programar = useCallback((finEn) => {
    finEnRef.current = finEn;
    yaVibroRef.current = false;
    setRestanteMs(Math.max(finEn - Date.now(), 0));
    setActivo(true);
    programarDescanso({ finEn, ...datosRef.current });
  }, []);

  /**
   * Con targetSdk 35 el permiso de "alarmas y recordatorios" viene denegado por
   * defecto. Sin el, el servicio cae a una alarma inexacta que puede llegar
   * tarde, asi que se le avisa al usuario. Si vuelve de los ajustes con el
   * permiso ya dado, se reprograma para aprovechar la alarma exacta.
   */
  const revisarPermisoAlarma = useCallback(async ({ reprogramar = false } = {}) => {
    const puede = await puedeProgramarAlarmaExacta();
    const acabaDeConcederse = puede && faltaPermisoRef.current;

    faltaPermisoRef.current = !puede;
    setFaltaPermisoAlarma(!puede);

    if (acabaDeConcederse && reprogramar && finEnRef.current > Date.now()) {
      programar(finEnRef.current);
    }
  }, [programar]);

  useEffect(() => {
    revisarPermisoAlarma();
  }, [revisarPermisoAlarma]);

  // Durante el descanso el telefono queda apoyado mostrando el contador; sin
  // esto Android apaga la pantalla al minuto. El cleanup es obligatorio: el
  // flag vive en la ventana de la Activity, no en este componente.
  useEffect(() => {
    mantenerPantallaEncendida();
    return permitirApagarPantalla;
  }, []);

  // Arranca el descanso y le delega la cuenta al sistema.
  useEffect(() => {
    if (totalMs <= 0) {
      setActivo(false);
      setRestanteMs(0);
      return;
    }

    programar(Date.now() + totalMs);
  }, [programar, totalMs]);

  // Refresco visual. Si la app se congela, este intervalo se detiene y no pasa
  // nada: al volver se recalcula contra finEnRef.
  useEffect(() => {
    if (!activo) {
      return undefined;
    }

    const intervalo = setInterval(sincronizar, 250);
    return () => clearInterval(intervalo);
  }, [activo, sincronizar]);

  // Cuando suena la alarma la nota se cierra sola: si queda abierta tapa el
  // boton de Detener justo cuando hay que silenciar el aviso.
  useEffect(() => {
    if (termino) {
      setModalFormNota(false);
    }
  }, [termino]);

  // Al volver del segundo plano el contador se pone al dia de una.
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado !== 'active') {
        return;
      }

      if (activo) {
        sincronizar();
      }

      revisarPermisoAlarma({ reprogramar: activo });
    });

    return () => suscripcion.remove();
  }, [activo, revisarPermisoAlarma, sincronizar]);

  const pausar = () => {
    setActivo(false);
    setRestanteMs(Math.max(finEnRef.current - Date.now(), 0));
    cancelarDescanso();
  };

  const reanudar = () => {
    if (restanteMs <= 0) {
      return;
    }

    programar(Date.now() + restanteMs);
  };

  const reiniciar = () => {
    if (totalMs <= 0) {
      return;
    }

    programar(Date.now() + totalMs);
  };

  /**
   * Suma o resta tiempo al descanso en curso. Es el ajuste que mas se usa en el
   * gimnasio: la serie salio mas dura de lo previsto y hacen falta 30 segundos
   * mas, o sobran y se quiere arrancar antes.
   */
  const ajustar = (segundos) => {
    const delta = segundos * 1000;

    if (activo) {
      const nuevoFin = Math.max(finEnRef.current + delta, Date.now());
      programar(nuevoFin);
      return;
    }

    setRestanteMs(previo => Math.max(previo + delta, 0));
    if (delta > 0) {
      yaVibroRef.current = false;
    }
  };

  // Estable a proposito: el contador re-renderiza este componente 4 veces por
  // segundo y, si onClose cambiara de identidad en cada tick, el FormNota
  // memoizado se volveria a renderizar igual mientras se escribe la nota.
  const cerrarNota = useCallback(() => setModalFormNota(false), []);

  const cerrar = async () => {
    setActivo(false);
    await cancelarDescanso();
    setModalDescanso(false);
  };

  const formatoTiempo = (ms) => {
    const totalSegundos = Math.ceil(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  const progreso = totalMs > 0 ? 1 - Math.min(restanteMs / totalMs, 1) : 0;

  return (
    <PantallaModal style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image style={styles.image} source={require('../../assets/img/descanso.png')} />
        <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>Descanso</Text>
        <Text style={styles.titulo1} maxFontSizeMultiplier={maxEscalaFuente}>
          Series realizadas {serie} de {ejercicio.series}
        </Text>

        {faltaPermisoAlarma && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir los ajustes de alarmas y recordatorios"
            style={({ pressed }) => [styles.bannerPermiso, pressed && styles.botonPresionado]}
            onPress={abrirAjustesAlarmaExacta}
          >
            <Icon name='alarm-outline' size={24} color={colores.aviso} />
            <Text style={styles.bannerPermisoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              Activá "Alarmas y recordatorios" para que el aviso suene puntual aunque
              uses otra app. Tocá acá.
            </Text>
          </Pressable>
        )}

        <View style={styles.contenedor}>
          <Text style={styles.titulo2} maxFontSizeMultiplier={maxEscalaFuente}>
            {termino ? 'Descanso terminado' : 'Tiempo restante'}
          </Text>
          <Text
            style={[styles.tiempo, termino && styles.tiempoTerminado]}
            maxFontSizeMultiplier={1}
            accessibilityLabel={`Quedan ${formatoTiempo(restanteMs)} minutos`}
          >
            {formatoTiempo(restanteMs)}
          </Text>

          <View style={styles.barra}>
            <BarraProgreso
              progreso={progreso}
              color={termino ? colores.principal : colores.acento}
              alto={6}
              etiqueta="Progreso del descanso"
            />
          </View>

          <View style={styles.botones}>
            {activo ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pausar el descanso"
                style={({ pressed }) => [styles.botonRedondo, pressed && styles.botonPresionado]}
                onPress={pausar}
              >
                <Icon name='pause' size={30} color={colores.turquesa} />
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Reanudar el descanso"
                style={({ pressed }) => [
                  styles.botonRedondo,
                  pressed && styles.botonPresionado,
                  restanteMs === 0 && styles.botonAjusteDeshabilitado,
                ]}
                onPress={reanudar}
                disabled={restanteMs === 0}
              >
                <Icon
                  name='play'
                  size={30}
                  color={restanteMs === 0 ? colores.textoSecundario : colores.principal}
                />
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reiniciar el descanso"
              style={({ pressed }) => [styles.botonRedondo, pressed && styles.botonPresionado]}
              onPress={reiniciar}
            >
              <Icon name='refresh-outline' size={28} color={colores.turquesa} />
            </Pressable>
          </View>

          <View style={styles.ajustes}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restar 30 segundos al descanso"
              style={({ pressed }) => [
                styles.botonAjuste,
                pressed && styles.botonPresionado,
                restanteMs <= 0 && styles.botonAjusteDeshabilitado,
              ]}
              disabled={restanteMs <= 0}
              onPress={() => ajustar(-30)}
            >
              <Icon name="remove" size={18} color={colores.textoPrimario} />
              <Text style={styles.botonAjusteTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                30 s
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sumar 30 segundos al descanso"
              style={({ pressed }) => [styles.botonAjuste, pressed && styles.botonPresionado]}
              onPress={() => ajustar(30)}
            >
              <Icon name="add" size={18} color={colores.textoPrimario} />
              <Text style={styles.botonAjusteTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                30 s
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar la nota del ejercicio"
          style={({ pressed }) => [styles.tarjetaNota, pressed && styles.botonPresionado]}
          onPress={() => setModalFormNota(true)}
        >
          <View style={styles.notaTextos}>
            <Text style={styles.notaEtiqueta} maxFontSizeMultiplier={maxEscalaFuente}>Nota</Text>
            <Text
              style={ejercicio?.nota ? styles.notaTexto : styles.notaVacia}
              numberOfLines={2}
              maxFontSizeMultiplier={maxEscalaFuente}
            >
              {ejercicio?.nota || 'Sin notas todavía. Tocá para agregar una.'}
            </Text>
          </View>
          <Icon name="pencil-outline" size={20} color={colores.textoSecundario} />
        </Pressable>

        {termino ? (
          <>
            <Text style={styles.aviso} maxFontSizeMultiplier={maxEscalaFuente}>
              Tocá DETENER para silenciar la alarma
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Detener la alarma y volver al ejercicio"
              style={({ pressed }) => [styles.botonDetener, pressed && styles.botonPresionado]}
              onPress={cerrar}
            >
              <Icon name='stop-circle-outline' size={28} color={colores.sobreRelleno} />
              <Text style={styles.botonDetenerTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Detener
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Saltar el descanso y volver al ejercicio"
            style={({ pressed }) => [styles.botonSaltar, pressed && styles.botonPresionado]}
            onPress={cerrar}
          >
            <Icon name="play-skip-forward-outline" size={20} color={colores.textoPrimario} />
            <Text style={styles.botonSaltarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              Saltar descanso
            </Text>
          </Pressable>
        )}

      </ScrollView>

      {/* Fuera del ScrollView: un Modal abre su propia ventana, pero como hijo
          del scroll igual participa del layout y se re-media con cada scroll y
          con cada ajuste del teclado. */}
      <FormNota
        visible={modalFormNota}
        onClose={cerrarNota}
        ejercicio={ejercicio}
      />
    </PantallaModal>
  );
};

export default Descanso;
