import { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/detalleRutinaStyles';
import { styles as estilos } from '../../styles/funcionalStyles';
import { colores } from '../../styles/colores';
import { espaciado, maxEscalaFuente } from '../../styles/theme';
import HojaAcciones from '../../components/HojaAcciones';
import EstadoVacio from '../../components/EstadoVacio';
import ListaOrdenable from '../../components/ListaOrdenable';
import ImagenEjercicio from '../../components/ImagenEjercicio';
import CompartirRutina from '../rutinas/compartirRutina';
import { eliminarRutina, reubicarBloque } from '../../store/rutinasSlice';
import { avisoError, avisoExito } from '../../helpers/avisos';
import { esRutinaAsignada, MENSAJE_ASIGNADA_NO_COMPARTIBLE } from '../../services/rutinasCompartidas';
import {
  MODOS,
  bloquesDe,
  descansoEntreVueltasDe,
  duracionTotal,
  etiquetaModo,
  formatearReloj,
  formatearSegundos,
  nombreBloque,
  normalizarModo,
  trabajoDe,
  descansoDe,
  vueltasDe,
} from '../../helpers/funcional';

const Dato = ({ etiqueta, valor }) => (
  <View style={estilos.dato}>
    <Text style={estilos.datoEtiqueta} maxFontSizeMultiplier={maxEscalaFuente}>{etiqueta}</Text>
    <Text style={estilos.datoValor} maxFontSizeMultiplier={maxEscalaFuente}>{valor}</Text>
  </View>
);

/**
 * Detalle de un funcional, dentro de la pestaña (como el de las rutinas).
 * Los asignados por el coach se editan igual que los propios, pero no se
 * comparten: son trabajo del coach.
 */
const DetalleFuncional = ({ funcional, onVolver, onEditar, onIniciar }) => {
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modosVisible, setModosVisible] = useState(false);
  const [compartirVisible, setCompartirVisible] = useState(false);

  const bloques = bloquesDe(funcional);
  const vueltas = vueltasDe(funcional);
  const esAsignado = esRutinaAsignada(funcional);
  const modoDefecto = normalizarModo(funcional.modoPorDefecto);
  const idRutina = funcional.id;

  const reubicar = useCallback((desde, hacia) => {
    dispatch(reubicarBloque({ idRutina, desde, hacia }));
  }, [dispatch, idRutina]);

  const abrirCompartir = () => {
    if (esAsignado) {
      avisoError('No se puede compartir', MENSAJE_ASIGNADA_NO_COMPARTIBLE);
      return;
    }
    if (!bloques.length) {
      avisoError('Funcional vacío', 'Agregale al menos un bloque antes de compartirlo.');
      return;
    }
    setCompartirVisible(true);
  };

  const confirmarEliminar = () => {
    Alert.alert(
      'Eliminar funcional',
      `¿Querés eliminar "${funcional.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onVolver();
            dispatch(eliminarRutina(funcional.id));
            avisoExito('Funcional eliminado');
          },
        },
      ],
    );
  };

  const pedirIniciar = () => {
    if (!bloques.length) {
      avisoError('Funcional vacío', 'Agregale al menos un bloque para poder iniciarlo.');
      return;
    }
    setModosVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cuerpo}>
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a mis funcionales"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={onVolver}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>

          <View style={styles.acciones}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar el funcional"
              style={({ pressed }) => [styles.botonSecundario, pressed && styles.botonIconoPresionado]}
              onPress={onEditar}
            >
              <Icon name="pencil-outline" color={colores.textoPrimario} size={18} />
              <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>Editar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Más opciones del funcional"
              hitSlop={8}
              style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
              onPress={() => setMenuVisible(true)}
            >
              <Icon name="ellipsis-vertical" color={colores.textoPrimario} size={22} />
            </Pressable>
          </View>
        </View>

        <ListaOrdenable
          datos={bloques}
          onReordenar={reubicar}
          separacion={espaciado.lg}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          encabezado={<CabeceraDetalle funcional={funcional} onIniciar={pedirIniciar} />}
          vacio={
            <EstadoVacio
              icono="layers-outline"
              titulo="Este funcional no tiene bloques"
              descripcion="Editalo para agregar el primero."
              textoAccion="Agregar bloques"
              onAccion={onEditar}
            />
          }
          renderItem={({ item: bloque, index, arrastrando, manejador, accionesOrden }) => {
            const ultimo = index === bloques.length - 1;
            return (
              <View
                accessible
                accessibilityLabel={`${nombreBloque(bloque)}. Bloque ${index + 1} de ${bloques.length}`}
                accessibilityHint="Usá las acciones Subir y Bajar para cambiarlo de lugar"
                {...accionesOrden}
                style={[styles.ejercicioItem, arrastrando && styles.ejercicioItemArrastrado]}
              >
                <View style={styles.filaPrincipal}>
                  <View style={[styles.datos, estilos.filaBloque]}>
                    <View style={estilos.numeroBloque}>
                      <Text style={estilos.numeroBloqueTexto} maxFontSizeMultiplier={1.2}>{index + 1}</Text>
                    </View>
                    <View style={styles.datos}>
                      <Text style={styles.ejercicioNombre} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
                        {nombreBloque(bloque)}
                      </Text>
                      <View style={estilos.tiemposBloque}>
                        <View style={estilos.chipTrabajo}>
                          <Text style={estilos.chipTrabajoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                            Trabajo {formatearSegundos(trabajoDe(bloque))}
                          </Text>
                        </View>
                        {/* El descanso del ultimo bloque no se usa: lo reemplaza el
                            descanso entre vueltas, o termina el entrenamiento. */}
                        {!ultimo ? (
                          <View style={estilos.chipDescanso}>
                            <Text style={estilos.chipDescansoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                              {descansoDe(bloque) ? `Descanso ${formatearSegundos(descansoDe(bloque))}` : 'Sin descanso'}
                            </Text>
                          </View>
                        ) : vueltas > 1 ? (
                          <View style={estilos.chipDescanso}>
                            <Text style={estilos.chipDescansoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                              Después, entre vueltas
                            </Text>
                          </View>
                        ) : null}
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
                  </View>
                </View>
                {bloque.nota ? (
                  <Text style={estilos.notaBloque} maxFontSizeMultiplier={maxEscalaFuente}>{bloque.nota}</Text>
                ) : null}
                <ImagenEjercicio ejercicio={bloque.ejercicio} style={estilos.imagenBloque} />
              </View>
            );
          }}
        />
      </View>

      <HojaAcciones
        visible={menuVisible}
        titulo={funcional.nombre}
        onClose={() => setMenuVisible(false)}
        opciones={[
          ...(esAsignado ? [] : [{
            texto: 'Compartir funcional',
            icono: 'share-social-outline',
            onPress: abrirCompartir,
          }]),
          {
            texto: 'Eliminar funcional',
            icono: 'trash-outline',
            destructivo: true,
            onPress: confirmarEliminar,
          },
        ]}
      />

      {/* El modo por defecto lo eligio quien armo el funcional; aca se puede
          cambiar solo para esta sesion. */}
      <HojaAcciones
        visible={modosVisible}
        titulo="¿Cómo lo querés hacer?"
        onClose={() => setModosVisible(false)}
        opciones={MODOS.map(modo => ({
          texto: modo.valor === modoDefecto ? `${modo.etiqueta} (por defecto)` : modo.etiqueta,
          icono: modo.valor === modoDefecto ? 'radio-button-on' : 'radio-button-off',
          onPress: () => onIniciar(modo.valor),
        }))}
      />

      <Modal
        visible={compartirVisible}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setCompartirVisible(false)}
      >
        <CompartirRutina rutina={funcional} onClose={() => setCompartirVisible(false)} />
      </Modal>
    </View>
  );
};

/** Cabecera del detalle: nombre, datos y el boton Iniciar. Scrollea con los bloques. */
const CabeceraDetalle = ({ funcional, onIniciar }) => {
  const vueltas = vueltasDe(funcional);
  return (
    <View style={estilos.cabeceraDetalle}>
      <Text style={styles.titulo} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
        {funcional.nombre}
      </Text>
      <View style={estilos.datosFuncional}>
        <Dato etiqueta="Duración" valor={formatearReloj(duracionTotal(funcional))} />
        <Dato etiqueta="Vueltas" valor={vueltas} />
        <Dato
          etiqueta="Entre vueltas"
          valor={vueltas > 1 ? formatearSegundos(descansoEntreVueltasDe(funcional)) : '—'}
        />
        <Dato etiqueta="Modo" valor={etiquetaModo(funcional.modoPorDefecto)} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Iniciar ${funcional.nombre}`}
        style={({ pressed }) => [estilos.botonIniciar, pressed && estilos.presionado]}
        onPress={onIniciar}
      >
        <Icon name="play" size={24} color={colores.sobreAcento} />
        <Text style={estilos.botonIniciarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Iniciar</Text>
      </Pressable>
    </View>
  );
};

export default DetalleFuncional;
