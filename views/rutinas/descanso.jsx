import { AppState, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/descansoStyles';
import { Boton } from '../../components/botones/botones';
import { colores } from '../../styles/colores';
import {
  abrirAjustesAlarmaExacta,
  cancelarDescanso,
  programarDescanso,
  puedeProgramarAlarmaExacta,
} from '../../services/descansoAlarma';

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

  // Unica fuente de verdad mientras corre el descanso.
  const finEnRef = useRef(Date.now() + totalMs);

  const faltaPermisoRef = useRef(false);

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
    }
  }, []);

  const programar = useCallback((finEn) => {
    finEnRef.current = finEn;
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

  const termino = totalMs > 0 && restanteMs === 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image style={styles.image} source={require('../../assets/img/descanso.png')} />
        <Text style={styles.titulo}>DESCANSO</Text>
        <Text style={styles.titulo1}>Series realizadas {serie} de {ejercicio.series}</Text>

        {faltaPermisoAlarma && (
          <Pressable style={styles.bannerPermiso} onPress={abrirAjustesAlarmaExacta}>
            <Icon name='alarm-outline' size={24} color={colores.advertencia} />
            <Text style={styles.bannerPermisoTexto}>
              Activá "Alarmas y recordatorios" para que el aviso suene puntual aunque
              uses otra app. Tocá acá.
            </Text>
          </Pressable>
        )}

        <View style={styles.contenedor}>
          <Text style={styles.titulo2}>Tiempo Restante</Text>
          <Text style={styles.tiempo}>{formatoTiempo(restanteMs)}</Text>

          <View style={styles.botones}>
            {activo ? (
              <Pressable onPress={pausar}>
                <Icon name='pause-circle-outline' size={60} color={colores.turquesa} />
              </Pressable>
            ) : (
              <Pressable onPress={reanudar} disabled={restanteMs === 0}>
                <Icon
                  name='play-circle-outline'
                  size={60}
                  color={restanteMs === 0 ? colores.secundario : colores.principal}
                />
              </Pressable>
            )}
            <Pressable onPress={reiniciar}>
              <Icon name='refresh-outline' size={55} color={colores.turquesa} />
            </Pressable>
          </View>
        </View>

        {termino ? (
          <>
            <Text style={styles.aviso}>Tocá STOP para silenciar la alarma</Text>
            <Pressable onPress={cerrar} style={styles.stopButton}>
              <Icon name='stop-circle-outline' size={100} color={colores.alert} />
            </Pressable>
          </>
        ) : (
          <Boton onPress={cerrar}>Saltar</Boton>
        )}
      </ScrollView>
    </View>
  );
};

export default Descanso;
