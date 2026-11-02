import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/formEjercicioStyles';
import { styles as estilos } from '../../styles/funcionalStyles';
import { colores } from '../../styles/colores';
import { maxEscalaFuente } from '../../styles/theme';
import Selector from '../../components/Selector';
import PantallaModal from '../../components/PantallaModal';
import ImagenEjercicio from '../../components/ImagenEjercicio';
import {
  TIPO_CATALOGO_FUNCIONAL,
  getCatalogoLocalConRefresh,
  nombreCategoria,
  refrescarCatalogoRemoto,
} from '../../helpers/catalogoEjercicios';
import { partirDescanso } from '../../helpers/descanso';
import {
  LIMITES,
  MAX_MINUTOS_DESCANSO_FUNCIONAL,
  MAX_MINUTOS_TRABAJO,
  PASO_SEGUNDOS,
  SEGUNDOS_TRABAJO_DEFECTO,
  formatearSegundos,
  generarIdBloque,
} from '../../helpers/funcional';

const opcionesMinutos = maximo => Array.from({ length: maximo + 1 }, (_, i) => ({
  etiqueta: `${i} min`,
  valor: String(i),
}));

const OPCIONES_SEGUNDOS = Array.from({ length: 60 / PASO_SEGUNDOS }, (_, i) => ({
  etiqueta: `${String(i * PASO_SEGUNDOS).padStart(2, '0')} s`,
  valor: String(i * PASO_SEGUNDOS),
}));

const MINUTOS_TRABAJO = opcionesMinutos(MAX_MINUTOS_TRABAJO);
const MINUTOS_DESCANSO = opcionesMinutos(MAX_MINUTOS_DESCANSO_FUNCIONAL);

const bloqueVacio = () => ({
  id: generarIdBloque(),
  ejercicio: {},
  trabajoSegundos: null,
  descansoSegundos: 15,
  nota: '',
});

/**
 * Alta y edicion de un bloque: categoria funcional -> ejercicio (con su
 * ilustracion), trabajo (minimo 5 s, precargado con el tiempo sugerido del
 * ejercicio), descanso (puede ser 0) y nota. Solo ofrece el catalogo
 * Funcional; el de fuerza no aparece aca.
 */
const FormBloque = ({ bloque, onGuardar, onEliminar, onClose }) => {
  const usuarioBackend = useSelector(state => state.usuario.sesion?.user);
  const esEdicion = Boolean(bloque?.id);

  const [borrador, setBorrador] = useState(() => (esEdicion ? JSON.parse(JSON.stringify(bloque)) : bloqueVacio()));
  const [catalogo, setCatalogo] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(bloque?.ejercicio?.categoria || '');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vivo = true;
    const aplicar = ({ catalogo: lista, categorias: cats }) => {
      if (!vivo) {return;}
      setCatalogo(lista || []);
      setCategorias(cats || []);
    };

    const cargar = async () => {
      try {
        const local = await getCatalogoLocalConRefresh({ usuarioBackend, tipo: TIPO_CATALOGO_FUNCIONAL });
        aplicar(local);
        if (local.needsRefresh) {
          aplicar(await refrescarCatalogoRemoto(usuarioBackend, { tipo: TIPO_CATALOGO_FUNCIONAL }));
        }
      } catch {
        // Sin conexion se queda con el cache o con el respaldo local.
      } finally {
        if (vivo) {setCargando(false);}
      }
    };
    cargar();
    return () => {
      vivo = false;
    };
  }, [usuarioBackend]);

  // Al editar un bloque viejo (o importado) la categoria puede no venir:
  // se busca en el catalogo por el ejercicio.
  useEffect(() => {
    if (categoria || !borrador.ejercicio?.idEjercicio) {return;}
    const delCatalogo = catalogo.find(e => e.idEjercicio === borrador.ejercicio.idEjercicio);
    if (delCatalogo) {setCategoria(delCatalogo.categoria);}
  }, [borrador.ejercicio, catalogo, categoria]);

  const opcionesCategorias = useMemo(
    () => categorias.map(valor => ({ etiqueta: nombreCategoria(catalogo, valor), valor })),
    [catalogo, categorias],
  );

  const opcionesEjercicios = useMemo(
    () => catalogo
      .filter(e => e.categoria === categoria)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(e => ({ etiqueta: e.nombre, valor: String(e.idEjercicio) })),
    [catalogo, categoria],
  );

  const elegirEjercicio = valor => {
    const elegido = catalogo.find(e => String(e.idEjercicio) === valor);
    if (!elegido) {return;}
    setBorrador(previo => ({
      ...previo,
      ejercicio: { idEjercicio: elegido.idEjercicio, nombre: elegido.nombre, categoria: elegido.categoria },
      // El tiempo sugerido solo se pone si todavia no se eligio uno: cambiar
      // de ejercicio no pisa un tiempo que el atleta ya ajusto a mano.
      trabajoSegundos: previo.trabajoSegundos ?? (elegido.trabajoSugerido || SEGUNDOS_TRABAJO_DEFECTO),
    }));
    setError('');
  };

  const trabajo = partirDescanso(borrador.trabajoSegundos);
  const descanso = partirDescanso(borrador.descansoSegundos);
  const trabajoElegido = borrador.trabajoSegundos !== null && borrador.trabajoSegundos !== undefined;

  const cambiarTiempo = (campo, parte, valor) => {
    setBorrador(previo => {
      const actual = partirDescanso(previo[campo]);
      const minutos = parte === 'minutos' ? Number(valor) : actual.minutos;
      const segundos = parte === 'segundos' ? Number(valor) : actual.segundos;
      const maximo = campo === 'trabajoSegundos' ? LIMITES.trabajo[1] : LIMITES.descanso[1];
      return { ...previo, [campo]: Math.min(maximo, minutos * 60 + segundos) };
    });
    setError('');
  };

  const validar = () => {
    if (!categoria) {return 'Elegí una categoría.';}
    if (!borrador.ejercicio?.idEjercicio) {return 'Elegí un ejercicio.';}
    if (!(Number(borrador.trabajoSegundos) >= LIMITES.trabajo[0])) {
      return `El trabajo tiene que ser de al menos ${LIMITES.trabajo[0]} segundos.`;
    }
    return '';
  };

  const guardar = () => {
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }
    onGuardar({ ...borrador, nota: (borrador.nota || '').trim() });
    onClose();
  };

  const eliminar = () => {
    Alert.alert('Quitar bloque', '¿Querés quitar este bloque del funcional?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Quitar',
        style: 'destructive',
        onPress: () => {
          onEliminar(borrador.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <PantallaModal>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver sin guardar"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={onClose}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>
          <View style={styles.acciones}>
            {esEdicion ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Quitar este bloque del funcional"
                style={({ pressed }) => [styles.botonEliminar, pressed && styles.presionado]}
                onPress={eliminar}
              >
                <Icon name="trash-outline" size={16} color={colores.peligro} />
                <Text style={styles.botonEliminarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Quitar</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Guardar el bloque"
              style={({ pressed }) => [styles.botonGuardar, pressed && styles.presionado]}
              onPress={guardar}
            >
              <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
              <Text style={styles.botonGuardarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Guardar</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
          {esEdicion ? 'Editar bloque' : 'Nuevo bloque'}
        </Text>

        {error ? (
          <View style={styles.errorCaja}>
            <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
            <Text style={styles.error} maxFontSizeMultiplier={maxEscalaFuente}>{error}</Text>
          </View>
        ) : null}

        {!cargando && catalogo.length === 0 ? (
          <View style={estilos.avisoCatalogo}>
            <Icon name="cloud-offline-outline" size={20} color={colores.textoSecundario} />
            <Text style={estilos.avisoCatalogoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              Todavía no se pudo bajar el catálogo funcional. Conectate a internet y volvé a abrir el bloque.
            </Text>
          </View>
        ) : null}

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Categoría</Text>
          <Selector
            titulo="Categoría"
            placeholder={cargando ? 'Cargando...' : 'Elegí una categoría'}
            deshabilitado={cargando && !categorias.length}
            opciones={opcionesCategorias}
            valor={categoria}
            onChange={valor => {
              setCategoria(valor);
              setError('');
            }}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Ejercicio</Text>
          <Selector
            titulo="Ejercicio"
            placeholder={categoria ? 'Elegí un ejercicio' : 'Primero elegí la categoría'}
            deshabilitado={!categoria}
            opciones={opcionesEjercicios}
            valor={borrador.ejercicio?.idEjercicio ? String(borrador.ejercicio.idEjercicio) : ''}
            onChange={elegirEjercicio}
          />
          {borrador.ejercicio?.idEjercicio ? (
            <ImagenEjercicio ejercicio={borrador.ejercicio} style={styles.imagenEjercicio} />
          ) : null}
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Trabajo</Text>
          <View style={styles.filaDescanso}>
            <View style={styles.columnaDescanso}>
              <Selector
                titulo="Minutos de trabajo"
                placeholder="Min"
                opciones={MINUTOS_TRABAJO}
                valor={trabajoElegido ? String(trabajo.minutos) : ''}
                onChange={v => cambiarTiempo('trabajoSegundos', 'minutos', v)}
              />
            </View>
            <View style={styles.columnaDescanso}>
              <Selector
                titulo="Segundos de trabajo"
                placeholder="Seg"
                opciones={OPCIONES_SEGUNDOS}
                valor={trabajoElegido ? String(trabajo.segundos - (trabajo.segundos % PASO_SEGUNDOS)) : ''}
                onChange={v => cambiarTiempo('trabajoSegundos', 'segundos', v)}
              />
            </View>
          </View>
          <Text style={estilos.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
            {trabajoElegido ? formatearSegundos(borrador.trabajoSegundos, '0 s') : 'Mínimo 5 segundos.'}
          </Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Descanso después</Text>
          <View style={styles.filaDescanso}>
            <View style={styles.columnaDescanso}>
              <Selector
                titulo="Minutos de descanso"
                opciones={MINUTOS_DESCANSO}
                valor={String(descanso.minutos)}
                onChange={v => cambiarTiempo('descansoSegundos', 'minutos', v)}
              />
            </View>
            <View style={styles.columnaDescanso}>
              <Selector
                titulo="Segundos de descanso"
                opciones={OPCIONES_SEGUNDOS}
                valor={String(descanso.segundos - (descanso.segundos % PASO_SEGUNDOS))}
                onChange={v => cambiarTiempo('descansoSegundos', 'segundos', v)}
              />
            </View>
          </View>
          <Text style={estilos.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
            Puede ser 0. En el último bloque de la vuelta lo reemplaza el descanso entre vueltas.
          </Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Nota (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputNota]}
            value={borrador.nota}
            onChangeText={nota => setBorrador(previo => ({ ...previo, nota }))}
            placeholder="Ej: rodillas apoyadas, ritmo suave..."
            placeholderTextColor={colores.textoTenue}
            multiline
            maxFontSizeMultiplier={maxEscalaFuente}
          />
        </View>
      </ScrollView>
    </PantallaModal>
  );
};

export default FormBloque;
