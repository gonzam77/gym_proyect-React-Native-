import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/formRutinaStyles';
import { styles as estilosEjercicio } from '../../styles/formEjercicioStyles';
import { styles as estilosDetalle } from '../../styles/detalleRutinaStyles';
import { styles as estilos } from '../../styles/funcionalStyles';
import { colores } from '../../styles/colores';
import { espaciado, maxEscalaFuente } from '../../styles/theme';
import PantallaModal from '../../components/PantallaModal';
import EstadoVacio from '../../components/EstadoVacio';
import ListaOrdenable from '../../components/ListaOrdenable';
import Selector from '../../components/Selector';
import FormBloque from './formBloque';
import { agregarRutina, setRutinas } from '../../store/rutinasSlice';
import { avisoError, avisoExito } from '../../helpers/avisos';
import { partirDescanso } from '../../helpers/descanso';
import {
  LIMITES,
  MAX_MINUTOS_DESCANSO_FUNCIONAL,
  MODOS,
  PASO_SEGUNDOS,
  duracionTotal,
  formatearReloj,
  formatearSegundos,
  funcionalNuevo,
  nombreBloque,
  normalizarModo,
  trabajoDe,
  descansoDe,
} from '../../helpers/funcional';

const OPCIONES_MINUTOS = Array.from({ length: MAX_MINUTOS_DESCANSO_FUNCIONAL + 1 }, (_, i) => ({
  etiqueta: `${i} min`,
  valor: String(i),
}));

const OPCIONES_SEGUNDOS = Array.from({ length: 60 / PASO_SEGUNDOS }, (_, i) => ({
  etiqueta: `${String(i * PASO_SEGUNDOS).padStart(2, '0')} s`,
  valor: String(i * PASO_SEGUNDOS),
}));

const [MIN_VUELTAS, MAX_VUELTAS] = LIMITES.vueltas;
const MAX_DESCANSO_VUELTAS = LIMITES.descansoEntreVueltas[1];

/**
 * Alta y edicion de un funcional: nombre, vueltas, descanso entre vueltas,
 * modo por defecto y bloques (que se reordenan arrastrando). Mismos avisos,
 * salida sin guardar y proteccion contra el doble toque que FormRutina.
 */
const FormFuncional = ({ funcional, onClose }) => {
  const dispatch = useDispatch();
  const esEdicion = Boolean(funcional?.id);

  const [borrador, setBorrador] = useState(() =>
    esEdicion ? JSON.parse(JSON.stringify(funcional)) : funcionalNuevo()
  );
  const inicialRef = useRef(JSON.stringify(borrador));
  const guardandoRef = useRef(false);
  const [formBloqueVisible, setFormBloqueVisible] = useState(false);
  const [idBloque, setIdBloque] = useState(null);

  const bloques = borrador.bloques || [];
  const vueltas = Number(borrador.vueltas) || 1;
  const duracion = useMemo(() => duracionTotal(borrador), [borrador]);
  const sinNombre = !borrador.nombre?.trim();

  const cambiar = (campo, valor) => setBorrador(previo => ({ ...previo, [campo]: valor }));

  const ajustarVueltas = paso =>
    setBorrador(previo => ({
      ...previo,
      vueltas: Math.min(MAX_VUELTAS, Math.max(MIN_VUELTAS, (Number(previo.vueltas) || 1) + paso)),
    }));

  const descansoVueltas = partirDescanso(borrador.descansoEntreVueltasSegundos);
  const cambiarDescansoVueltas = (parte, valor) =>
    setBorrador(previo => {
      const actual = partirDescanso(previo.descansoEntreVueltasSegundos);
      const minutos = parte === 'minutos' ? Number(valor) : actual.minutos;
      const segundos = parte === 'segundos' ? Number(valor) : actual.segundos;
      return {
        ...previo,
        descansoEntreVueltasSegundos: Math.min(MAX_DESCANSO_VUELTAS, minutos * 60 + segundos),
      };
    });

  const reubicar = useCallback((desde, hacia) => {
    setBorrador(previo => {
      const lista = [...(previo.bloques || [])];
      const [movido] = lista.splice(desde, 1);
      lista.splice(hacia, 0, movido);
      return { ...previo, bloques: lista };
    });
  }, []);

  const abrirBloque = id => {
    setIdBloque(id);
    setFormBloqueVisible(true);
  };

  const guardarBloque = bloque => {
    setBorrador(previo => {
      const lista = previo.bloques || [];
      const existe = lista.some(b => b.id === bloque.id);
      return {
        ...previo,
        bloques: existe ? lista.map(b => (b.id === bloque.id ? bloque : b)) : [...lista, bloque],
      };
    });
  };

  const quitarBloque = id =>
    setBorrador(previo => ({ ...previo, bloques: (previo.bloques || []).filter(b => b.id !== id) }));

  const tieneCambios = () => JSON.stringify(borrador) !== inicialRef.current;

  const confirmarSalir = () => {
    if (!tieneCambios()) {
      onClose();
      return;
    }
    Alert.alert(
      'Salir sin guardar',
      'Tenés cambios sin guardar. ¿Querés salir y perderlos?',
      [
        { text: 'Seguir editando', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: onClose },
      ],
    );
  };

  const guardar = () => {
    if (guardandoRef.current) {return;}
    guardandoRef.current = true;

    if (sinNombre) {
      avisoError('Falta el nombre', 'Ponele un nombre al funcional para poder guardarlo.');
      guardandoRef.current = false;
      return;
    }
    if (!bloques.length) {
      avisoError('Sin bloques', 'Agregá al menos un bloque para poder guardarlo.');
      guardandoRef.current = false;
      return;
    }

    const listo = {
      ...borrador,
      nombre: borrador.nombre.trim(),
      modoPorDefecto: normalizarModo(borrador.modoPorDefecto),
      // Con una vuelta no hay descanso entre vueltas: se guarda en 0 para que
      // no aparezca un descanso fantasma si despues se suben las vueltas.
      descansoEntreVueltasSegundos: vueltas > 1 ? borrador.descansoEntreVueltasSegundos : 0,
      tiempo: duracion,
    };

    dispatch(esEdicion ? setRutinas(listo) : agregarRutina(listo));
    avisoExito(esEdicion ? 'Funcional actualizado' : 'Funcional creado');
    onClose();
  };

  const deshabilitado = sinNombre || !bloques.length;

  return (
    <PantallaModal>
      <View style={styles.cuerpo}>
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver sin guardar"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={confirmarSalir}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Guardar el funcional"
            accessibilityState={{ disabled: deshabilitado }}
            style={({ pressed }) => [
              styles.botonGuardar,
              (deshabilitado || pressed) && styles.botonGuardarDeshabilitado,
            ]}
            disabled={deshabilitado}
            onPress={guardar}
          >
            <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
            <Text style={styles.botonGuardarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Guardar</Text>
          </Pressable>
        </View>

        <ListaOrdenable
          datos={bloques}
          onReordenar={reubicar}
          separacion={espaciado.md}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          encabezado={
            <View>
              <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
                {esEdicion ? 'Editar funcional' : 'Nuevo funcional'}
              </Text>
              <Text style={estilos.duracion} maxFontSizeMultiplier={maxEscalaFuente}>
                Duración total: {formatearReloj(duracion)}
              </Text>

              <View style={estilos.seccion}>
                <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={borrador.nombre}
                  onChangeText={valor => cambiar('nombre', valor)}
                  placeholder="Ej: Core express, HIIT 20 min..."
                  placeholderTextColor={colores.textoTenue}
                  maxFontSizeMultiplier={maxEscalaFuente}
                />
              </View>

              <View style={estilos.seccion}>
                <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Vueltas</Text>
                <View style={estilos.filaVueltas}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Una vuelta menos"
                    accessibilityState={{ disabled: vueltas <= MIN_VUELTAS }}
                    disabled={vueltas <= MIN_VUELTAS}
                    hitSlop={4}
                    style={({ pressed }) => [
                      estilosEjercicio.contadorBoton,
                      vueltas <= MIN_VUELTAS && estilosEjercicio.contadorBotonDeshabilitado,
                      pressed && estilos.presionado,
                    ]}
                    onPress={() => ajustarVueltas(-1)}
                  >
                    <Icon name="remove" size={24} color={colores.textoPrimario} />
                  </Pressable>
                  <Text
                    style={estilos.vueltasValor}
                    accessibilityLabel={`${vueltas} ${vueltas === 1 ? 'vuelta' : 'vueltas'}`}
                    maxFontSizeMultiplier={maxEscalaFuente}
                  >
                    {vueltas}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Una vuelta más"
                    accessibilityState={{ disabled: vueltas >= MAX_VUELTAS }}
                    disabled={vueltas >= MAX_VUELTAS}
                    hitSlop={4}
                    style={({ pressed }) => [
                      estilosEjercicio.contadorBoton,
                      vueltas >= MAX_VUELTAS && estilosEjercicio.contadorBotonDeshabilitado,
                      pressed && estilos.presionado,
                    ]}
                    onPress={() => ajustarVueltas(1)}
                  >
                    <Icon name="add" size={24} color={colores.textoPrimario} />
                  </Pressable>
                </View>
              </View>

              {vueltas > 1 ? (
                <View style={estilos.seccion}>
                  <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Descanso entre vueltas</Text>
                  <View style={estilosEjercicio.filaDescanso}>
                    <View style={estilosEjercicio.columnaDescanso}>
                      <Selector
                        titulo="Minutos entre vueltas"
                        opciones={OPCIONES_MINUTOS}
                        valor={String(descansoVueltas.minutos)}
                        onChange={v => cambiarDescansoVueltas('minutos', v)}
                      />
                    </View>
                    <View style={estilosEjercicio.columnaDescanso}>
                      <Selector
                        titulo="Segundos entre vueltas"
                        opciones={OPCIONES_SEGUNDOS}
                        valor={String(descansoVueltas.segundos - (descansoVueltas.segundos % PASO_SEGUNDOS))}
                        onChange={v => cambiarDescansoVueltas('segundos', v)}
                      />
                    </View>
                  </View>
                  <Text style={estilos.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
                    Va después del último bloque de cada vuelta, en lugar de su descanso. En 0 se pasa directo a la vuelta siguiente.
                  </Text>
                </View>
              ) : null}

              <View style={estilos.seccion}>
                <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Modo por defecto</Text>
                <View style={estilos.modos} accessibilityRole="radiogroup">
                  {MODOS.map(modo => {
                    const activo = normalizarModo(borrador.modoPorDefecto) === modo.valor;
                    return (
                      <Pressable
                        key={modo.valor}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: activo }}
                        accessibilityLabel={`${modo.etiqueta}. ${modo.descripcion}`}
                        style={({ pressed }) => [estilos.modo, activo && estilos.modoActivo, pressed && estilos.presionado]}
                        onPress={() => cambiar('modoPorDefecto', modo.valor)}
                      >
                        <Text style={estilos.modoTitulo} maxFontSizeMultiplier={maxEscalaFuente}>{modo.etiqueta}</Text>
                        <Text style={estilos.modoDescripcion} maxFontSizeMultiplier={maxEscalaFuente}>{modo.descripcion}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={estilos.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
                  Al tocar Iniciar se puede cambiar solo para esa vez.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Agregar un bloque al funcional"
                style={({ pressed }) => [styles.agregarEjercicio, pressed && styles.presionado]}
                onPress={() => abrirBloque(null)}
              >
                <Icon name="add-circle-outline" size={22} color={colores.principal} />
                <Text style={styles.agregarEjercicioTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                  Agregar bloque
                </Text>
              </Pressable>

              {bloques.length ? (
                <Text style={styles.seccionTitulo} maxFontSizeMultiplier={maxEscalaFuente}>
                  {bloques.length} {bloques.length === 1 ? 'bloque' : 'bloques'}
                </Text>
              ) : null}
            </View>
          }
          vacio={
            <EstadoVacio
              icono="layers-outline"
              titulo="Sin bloques"
              descripcion="Agregá el primer ejercicio con su tiempo de trabajo y de descanso."
            />
          }
          renderItem={({ item: bloque, index, arrastrando, manejador, accionesOrden }) => {
            const ultimo = index === bloques.length - 1;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Editar ${nombreBloque(bloque)}. Bloque ${index + 1} de ${bloques.length}`}
                accessibilityHint="Usá las acciones Subir y Bajar para cambiarlo de lugar"
                {...accionesOrden}
                style={({ pressed }) => [
                  styles.ejercicioItem,
                  pressed && styles.ejercicioItemPresionado,
                  arrastrando && estilosDetalle.ejercicioItemArrastrado,
                ]}
                onPress={() => abrirBloque(bloque.id)}
              >
                <View style={styles.ejercicioDatos}>
                  <Text style={styles.ejercicioNombre} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
                    {index + 1}. {nombreBloque(bloque)}
                  </Text>
                  <Text style={styles.ejercicioDetalle} maxFontSizeMultiplier={maxEscalaFuente}>
                    Trabajo {formatearSegundos(trabajoDe(bloque))}
                    {!ultimo
                      ? ` · ${descansoDe(bloque) ? `${formatearSegundos(descansoDe(bloque))} de descanso` : 'sin descanso'}`
                      : vueltas > 1 ? ' · después, descanso entre vueltas' : ''}
                  </Text>
                </View>
                <View
                  {...manejador}
                  hitSlop={8}
                  importantForAccessibility="no"
                  style={[estilosDetalle.manija, arrastrando && estilosDetalle.manijaActiva]}
                >
                  <Icon
                    name="reorder-three-outline"
                    size={22}
                    color={arrastrando ? colores.acento : colores.textoSecundario}
                  />
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      <Modal
        visible={formBloqueVisible}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setFormBloqueVisible(false)}
      >
        <FormBloque
          bloque={idBloque ? bloques.find(b => b.id === idBloque) : null}
          onGuardar={guardarBloque}
          onEliminar={quitarBloque}
          onClose={() => setFormBloqueVisible(false)}
        />
      </Modal>
    </PantallaModal>
  );
};

export default FormFuncional;
