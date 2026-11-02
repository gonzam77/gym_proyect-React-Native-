import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Image, Modal, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/misRutinasStyles';
import { styles as estilos } from '../../styles/funcionalStyles';
import { colores } from '../../styles/colores';
import { espaciado, maxEscalaFuente } from '../../styles/theme';
import EstadoVacio from '../../components/EstadoVacio';
import ListaOrdenable from '../../components/ListaOrdenable';
import ImportarRutina from '../rutinas/importarRutina';
import FormFuncional from './formFuncional';
import DetalleFuncional from './detalleFuncional';
import EjecucionFuncional from './ejecucionFuncional';
import { reubicarRutinaDelTipo, seleccionarFuncionales } from '../../store/rutinasSlice';
import { guardarSesionFuncional } from '../../store/sesionFuncionalSlice';
import { terminarYGuardarSesion } from '../../store/sesionFuncionalAcciones';
import { TIPO_FUNCIONAL, bloquesDe, duracionTotal, formatearReloj, vueltasDe } from '../../helpers/funcional';
import { iniciar } from '../../helpers/sesionFuncional';
import { avisoExito } from '../../helpers/avisos';

const TarjetaFuncional = ({ funcional, index, total, onAbrir, arrastrando, manejador, accionesOrden }) => {
  const bloques = bloquesDe(funcional).length;
  const vueltas = vueltasDe(funcional);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${funcional.nombre}. Funcional ${index + 1} de ${total}`}
      accessibilityHint="Usá las acciones Subir y Bajar para cambiarlo de lugar"
      {...accionesOrden}
      onPress={() => onAbrir(funcional.id)}
      style={({ pressed }) => [
        styles.entrenamiento,
        pressed && styles.entrenamientoPresionado,
        arrastrando && styles.entrenamientoArrastrado,
      ]}
    >
      <View style={styles.filaPrincipal}>
        <View style={styles.datos}>
          <Text style={styles.nombre} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
            {funcional.nombre}
          </Text>

          {funcional.tieneCambiosAsignados ? (
            <View style={styles.syncBadge}>
              <Icon name="sync-outline" size={13} color={colores.acento} />
              <Text style={styles.syncBadgeText} maxFontSizeMultiplier={maxEscalaFuente}>
                Actualizado por el coach
              </Text>
            </View>
          ) : null}

          <View style={styles.metaFila}>
            <View style={styles.metaItem}>
              <Icon name="time-outline" size={16} color={colores.acento} />
              <Text style={styles.tiempo} maxFontSizeMultiplier={maxEscalaFuente}>
                {formatearReloj(duracionTotal(funcional))}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="layers-outline" size={16} color={colores.textoSecundario} />
              <Text style={styles.metaTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                {bloques} {bloques === 1 ? 'bloque' : 'bloques'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="repeat-outline" size={16} color={colores.textoSecundario} />
              <Text style={styles.metaTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                {vueltas} {vueltas === 1 ? 'vuelta' : 'vueltas'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <View
            {...manejador}
            hitSlop={8}
            importantForAccessibility="no"
            style={[styles.manija, arrastrando && styles.manijaActiva]}
          >
            <Icon
              name="reorder-three-outline"
              size={22}
              color={arrastrando ? colores.acento : colores.textoSecundario}
            />
          </View>
          <Icon name="chevron-forward-outline" color={colores.textoSecundario} size={24} />
        </View>
      </View>
    </Pressable>
  );
};

/**
 * "Mis funcionales": el listado de la pestaña Funcional. Igual que Mis rutinas:
 * reordenar arrastrando, detalle dentro de la pestaña, formulario e importar.
 * Ademas es donde vive la pantalla de ejecucion, para poder retomarla desde el
 * aviso de sesion sin terminar.
 *
 * activo: es el segmento visible; si no, no escucha el boton atras.
 */
const MisFuncionales = ({ activo = true }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const funcionales = useSelector(seleccionarFuncionales);
  const sesion = useSelector(state => state.sesionFuncional?.sesion);

  const [idDetalle, setIdDetalle] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [importarVisible, setImportarVisible] = useState(false);
  const [ejecucionVisible, setEjecucionVisible] = useState(false);

  const detalle = funcionales.find(f => f.id === idDetalle) || null;
  const cerrarDetalle = useCallback(() => setIdDetalle(null), []);

  // Mismo criterio que Mis rutinas: el detalle esta dentro de la pestaña, asi
  // que el boton atras de Android y volver a tocar la pestaña lo cierran.
  useEffect(() => {
    if (!detalle || !activo) {return undefined;}

    const atras = BackHandler.addEventListener('hardwareBackPress', () => {
      cerrarDetalle();
      return true;
    });
    const tab = navigation.addListener('tabPress', () => {
      if (navigation.isFocused()) {cerrarDetalle();}
    });
    return () => {
      atras.remove();
      tab();
    };
  }, [activo, cerrarDetalle, detalle, navigation]);

  const reubicar = useCallback((desde, hacia) => {
    dispatch(reubicarRutinaDelTipo({ tipo: TIPO_FUNCIONAL, desde, hacia }));
  }, [dispatch]);

  const nuevo = () => {
    setIdEditando(null);
    setFormVisible(true);
  };

  const editar = id => {
    setIdEditando(id);
    setFormVisible(true);
  };

  const empezar = (funcional, modo) => {
    dispatch(guardarSesionFuncional(iniciar(funcional, modo, Date.now())));
    setEjecucionVisible(true);
  };

  // Hay una sola sesion a la vez: si quedo otra abierta, se guarda lo hecho
  // antes de empezar la nueva (como cuando se termina antes).
  const pedirIniciar = (funcional, modo) => {
    if (!sesion || sesion.terminada) {
      empezar(funcional, modo);
      return;
    }

    Alert.alert(
      'Tenés un funcional sin terminar',
      `"${sesion.funcional?.nombre}" quedó a mitad. Si empezás otro, se guarda lo que hiciste hasta ahí.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Retomar el otro', onPress: () => setEjecucionVisible(true) },
        {
          text: 'Guardar y empezar',
          onPress: () => {
            dispatch(terminarYGuardarSesion(sesion));
            empezar(funcional, modo);
          },
        },
      ],
    );
  };

  const terminarPendiente = () => {
    Alert.alert(
      'Terminar el funcional',
      'Se guarda en el historial lo que hiciste hasta ahora.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Terminar y guardar',
          onPress: () => {
            dispatch(terminarYGuardarSesion(sesion));
            avisoExito('Funcional guardado', 'Lo encontrás en el historial.');
          },
        },
      ],
    );
  };

  const sesionPendiente = sesion && !sesion.terminada && !ejecucionVisible;

  return (
    <SafeAreaView style={styles.fondo} edges={[]}>
      {detalle ? (
        <DetalleFuncional
          funcional={detalle}
          onVolver={cerrarDetalle}
          onEditar={() => editar(detalle.id)}
          onIniciar={modo => pedirIniciar(detalle, modo)}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTextos}>
              <Text style={styles.saludo} maxFontSizeMultiplier={maxEscalaFuente}>Por tiempo</Text>
              <Text style={styles.userName} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
                Funcional
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Importar un funcional con un código"
              hitSlop={6}
              style={({ pressed }) => [styles.botonImportar, pressed && styles.botonImportarPresionado]}
              onPress={() => setImportarVisible(true)}
            >
              <Icon name="download-outline" size={18} color={colores.textoPrimario} />
              <Text style={styles.botonImportarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Importar
              </Text>
            </Pressable>
          </View>

          {sesionPendiente ? (
            <View style={estilos.sesionPendiente}>
              <View style={estilos.sesionPendienteFila}>
                <Icon name="pause-circle-outline" size={24} color={colores.acento} />
                <Text style={estilos.sesionPendienteTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                  Tenés "{sesion.funcional?.nombre}" sin terminar.
                </Text>
              </View>
              <View style={estilos.sesionPendienteBotones}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Retomar el funcional"
                  style={({ pressed }) => [estilos.botonPrimario, pressed && estilos.presionado]}
                  onPress={() => setEjecucionVisible(true)}
                >
                  <Icon name="play" size={18} color={colores.sobreAcento} />
                  <Text style={estilos.botonPrimarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>Retomar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Terminar y guardar lo hecho"
                  style={({ pressed }) => [estilos.botonContorno, pressed && estilos.presionado]}
                  onPress={terminarPendiente}
                >
                  <Text style={estilos.botonContornoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                    Terminar y guardar
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <ListaOrdenable
            datos={funcionales}
            onReordenar={reubicar}
            separacion={espaciado.lg}
            style={styles.lista}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            vacio={
              <EstadoVacio
                icono="timer-outline"
                titulo="Todavía no tenés funcionales"
                descripcion="Armá un entrenamiento por tiempo: bloques de trabajo y descanso que se repiten en vueltas. También podés agregar los que te asigne tu coach o importar uno con un código."
                textoAccion="Crear un funcional"
                onAccion={nuevo}
              />
            }
            renderItem={({ item, index, arrastrando, manejador, accionesOrden }) => (
              <TarjetaFuncional
                funcional={item}
                index={index}
                total={funcionales.length}
                onAbrir={setIdDetalle}
                arrastrando={arrastrando}
                manejador={manejador}
                accionesOrden={accionesOrden}
              />
            )}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Crear un funcional nuevo"
            style={styles.btnCircular}
            onPress={nuevo}
          >
            <Image style={styles.agregar} source={require('../../assets/img/agregar.png')} />
          </Pressable>
        </View>
      )}

      <Modal
        visible={formVisible}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setFormVisible(false)}
      >
        <FormFuncional
          funcional={idEditando ? funcionales.find(f => f.id === idEditando) : null}
          onClose={() => setFormVisible(false)}
        />
      </Modal>

      <Modal
        visible={importarVisible}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setImportarVisible(false)}
      >
        <ImportarRutina onClose={() => setImportarVisible(false)} />
      </Modal>

      <EjecucionFuncional visible={ejecucionVisible} onClose={() => setEjecucionVisible(false)} />
    </SafeAreaView>
  );
};

export default MisFuncionales;
