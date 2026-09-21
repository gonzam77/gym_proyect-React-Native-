import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from '../../styles/formEjercicioStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import Selector from "../../components/Selector";
import PantallaModal from "../../components/PantallaModal";
import { avisoExito } from "../../helpers/avisos";
import { useSelector } from "react-redux";
import {
  getCatalogoLocalConRefresh,
  refrescarCatalogoRemoto,
} from "../../helpers/catalogoEjercicios";

const OPCIONES_DESCANSO = Array.from({ length: 10 }, (_, i) => ({
  etiqueta: `${i + 1} ${i === 0 ? 'minuto' : 'minutos'}`,
  valor: String(i + 1),
}));

const MIN_SERIES = 1;
const MAX_SERIES = 20;

const FormEjercicio = ({ nuevaRutina, setNuevaRutina, setModalFormEjercicio, ejercicioSeleccionado, setEjercicioSeleccionado}) => {
  const sesion = useSelector(state => state.usuario.sesion);
  const usuarioBackend = sesion?.user;

  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const [catalogoEjercicios, setCatalogoEjercicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errores, setErrores] = useState("");

  const [ejercicioNuevo, setEjercicioNuevo] = useState({
    id: '',
    ejercicio:{},
    series: "",
    descanso: "",
    seriesRealizadas:0,
    nota:''
  });

  useEffect(() => {
    const aplicarCatalogo = ({ catalogo, categorias }) => {
      setCatalogoEjercicios(catalogo || []);
      setCategorias(categorias || []);
    };

    const hidratarYActualizar = async () => {
      try {
        const local = await getCatalogoLocalConRefresh({ usuarioBackend });
        aplicarCatalogo(local);

        if (local.needsRefresh) {
          const remoto = await refrescarCatalogoRemoto(usuarioBackend);
          aplicarCatalogo(remoto);
        }
      } catch {
        // Se mantiene lo que ya este visible en pantalla.
      }
    };

    hidratarYActualizar();
  }, [usuarioBackend?.adminOwner?.id, usuarioBackend?.id, usuarioBackend?.idAdminOwner]);

  const idCargadoRef = useRef(null);

  useEffect(() => {
    if (!ejercicioSeleccionado) {
      idCargadoRef.current = null;
      return;
    }

    const seleccionado = nuevaRutina.ejercicios.find(e => e.id === ejercicioSeleccionado);
    if (!seleccionado) {
      return;
    }

    if (idCargadoRef.current !== ejercicioSeleccionado) {
      setEjercicioNuevo(JSON.parse(JSON.stringify(seleccionado)));
      idCargadoRef.current = ejercicioSeleccionado;
    }

    if (!selectedCategory) {
      const categoria = catalogoEjercicios.find(e => e.idEjercicio === seleccionado.ejercicio?.idEjercicio)?.categoria;
      if (categoria) {
        setSelectedCategory(categoria);
      }
    }
  },[catalogoEjercicios, ejercicioSeleccionado, nuevaRutina.ejercicios, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      setEjerciciosFiltrados(
        catalogoEjercicios.filter(e => e.categoria === selectedCategory)
      );
    } else {
      setEjerciciosFiltrados([]);
    }
  }, [catalogoEjercicios, selectedCategory]);

  const eliminarEjercicio = ()=>{
    Alert.alert(
      'Eliminar ejercicio',
      '¿Querés quitar este ejercicio de la rutina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: ()=>{
            setNuevaRutina({
              ...nuevaRutina,
              ejercicios: nuevaRutina.ejercicios.filter(e => e.id !== ejercicioSeleccionado)
            });

            setEjercicioSeleccionado(null);
            setModalFormEjercicio(false);
            avisoExito('Ejercicio eliminado');
          },
        },
      ]
    )

  };

  const validarFormulario = () => {
    if (!selectedCategory) return "Elegí una categoría.";
    if (!ejercicioNuevo.ejercicio?.idEjercicio) return "Elegí un ejercicio.";
    if (!ejercicioNuevo.series || ejercicioNuevo.series <= 0) return "Las series tienen que ser mayores a cero.";
    if (!ejercicioNuevo.descanso || ejercicioNuevo.descanso <= 0) return "Elegí cuántos minutos de descanso.";
    return "";
  };

  const handleChange = (campo, valor) => {
    if (campo === 'nota') {
      setEjercicioNuevo(prev => ({
            ...prev,
            [campo]: valor
      }));
    } else {
      const soloNumeros = String(valor).replace(/[^0-9]/g, "");
      if (soloNumeros === "") {
        setEjercicioNuevo(prev => ({ ...prev, [campo]: "" }));
        return;
      }

      const numero = Number(soloNumeros);
      setEjercicioNuevo(prev => ({
        ...prev,
        [campo]: campo === 'series' ? Math.min(MAX_SERIES, numero) : numero,
      }))
    };
  };

  // El + y el - trabajan sobre el valor actual; si el campo esta vacio arrancan
  // desde el minimo, asi un toque siempre deja un numero valido.
  const ajustarSeries = (paso) => {
    setEjercicioNuevo(prev => {
      const actual = Number(prev.series) || 0;
      return {
        ...prev,
        series: Math.min(MAX_SERIES, Math.max(MIN_SERIES, actual + paso)),
      };
    });
  };

  const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

  const handleGuardar = () => {
    const error = validarFormulario();
    if (error) {
      // El error se muestra arriba del formulario, no en un alert() del
      // navegador: ese dialogo no se puede estilar y tapa el campo que hay
      // que corregir.
      setErrores(error);
      return;
    }

    setErrores("");

    if(ejercicioSeleccionado){
      setNuevaRutina({
        ...nuevaRutina,
        ejercicios: nuevaRutina.ejercicios.map(e => e.id !== ejercicioSeleccionado ? e : ejercicioNuevo)
      })
    } else {
      setNuevaRutina({
        ...nuevaRutina,
        ejercicios: [
          ...nuevaRutina.ejercicios,
          { ...ejercicioNuevo, id: generarId() }
        ],
      });

    }
    setModalFormEjercicio(false);
    setEjercicioSeleccionado(null)
  };

  const opcionesCategorias = useMemo(() => categorias.map(categoria => ({
    etiqueta: categoria.charAt(0).toUpperCase() + categoria.slice(1),
    valor: categoria,
  })), [categorias]);

  const opcionesEjercicios = useMemo(() => ejerciciosFiltrados
    .filter(e => e.categoria === selectedCategory)
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map(e => ({ etiqueta: e.nombre, valor: e.nombre })), [ejerciciosFiltrados, selectedCategory]);

  const seriesActuales = Number(ejercicioNuevo.series) || 0;
  const puedeBajarSeries = seriesActuales > MIN_SERIES;
  const puedeSubirSeries = seriesActuales < MAX_SERIES;

  return (
    <PantallaModal>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver sin guardar"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={() => {
              setEjercicioSeleccionado(null);
              setModalFormEjercicio(false);
            }}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>

          <View style={styles.acciones}>
            {ejercicioSeleccionado ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Eliminar este ejercicio de la rutina"
                style={({ pressed }) => [styles.botonEliminar, pressed && styles.presionado]}
                onPress={() => {eliminarEjercicio()}}
              >
                <Icon name="trash-outline" size={16} color={colores.peligro} />
                <Text style={styles.botonEliminarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                  Eliminar
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Guardar el ejercicio"
              style={({ pressed }) => [styles.botonGuardar, pressed && styles.presionado]}
              onPress={handleGuardar}
            >
              <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
              <Text style={styles.botonGuardarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Guardar
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
          {ejercicioSeleccionado ? 'Editar ejercicio' : 'Nuevo ejercicio'}
        </Text>

        {errores !== "" ? (
          <View style={styles.errorCaja}>
            <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
            <Text style={styles.error} maxFontSizeMultiplier={maxEscalaFuente}>{errores}</Text>
          </View>
        ) : null}

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Categoría</Text>
          <Selector
            titulo="Categoría"
            placeholder="Elegí una categoría"
            opciones={opcionesCategorias}
            valor={selectedCategory}
            onChange={valor => setSelectedCategory(valor)}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Ejercicio</Text>
          <Selector
            titulo="Ejercicio"
            placeholder={selectedCategory ? 'Elegí un ejercicio' : 'Primero elegí la categoría'}
            deshabilitado={!selectedCategory}
            opciones={opcionesEjercicios}
            valor={ejercicioNuevo.ejercicio?.nombre || ""}
            onChange={valor => {
              const ejercicioDelCatalogo = ejerciciosFiltrados.find(e => e.nombre === valor);
              if (ejercicioDelCatalogo) {
                setEjercicioNuevo(prev => ({
                  ...prev,
                  ejercicio: ejercicioDelCatalogo,
                  nombre: ejercicioDelCatalogo.nombre
                }));
              } else {
                setEjercicioNuevo(prev => ({
                  ...prev,
                  ejercicio: {},
                  nombre: ""
                }));
              }
            }}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Series</Text>
          <View style={styles.contadorSeries}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Quitar una serie"
              accessibilityState={{ disabled: !puedeBajarSeries }}
              disabled={!puedeBajarSeries}
              hitSlop={4}
              style={({ pressed }) => [
                styles.contadorBoton,
                !puedeBajarSeries && styles.contadorBotonDeshabilitado,
                pressed && styles.presionado,
              ]}
              onPress={() => ajustarSeries(-1)}
            >
              <Icon name="remove" size={24} color={colores.textoPrimario} />
            </Pressable>

            <TextInput
              keyboardType="numeric"
              value={String(ejercicioNuevo.series ?? "")}
              style={[styles.input, styles.inputSeries]}
              placeholder="0"
              placeholderTextColor={colores.textoTenue}
              onChangeText={v => handleChange("series", v)}
              accessibilityLabel="Cantidad de series"
              maxFontSizeMultiplier={maxEscalaFuente}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Agregar una serie"
              accessibilityState={{ disabled: !puedeSubirSeries }}
              disabled={!puedeSubirSeries}
              hitSlop={4}
              style={({ pressed }) => [
                styles.contadorBoton,
                !puedeSubirSeries && styles.contadorBotonDeshabilitado,
                pressed && styles.presionado,
              ]}
              onPress={() => ajustarSeries(1)}
            >
              <Icon name="add" size={24} color={colores.textoPrimario} />
            </Pressable>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Descanso entre series</Text>
          <Selector
            titulo="Descanso entre series"
            placeholder="Elegí los minutos"
            opciones={OPCIONES_DESCANSO}
            valor={ejercicioNuevo.descanso ? String(ejercicioNuevo.descanso) : ""}
            onChange={v => handleChange("descanso", v)}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>Nota</Text>
          <Text style={styles.ayuda} maxFontSizeMultiplier={maxEscalaFuente}>
            Opcional. Te la vas a encontrar mientras entrenás.
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Peso estimado, repeticiones estimadas"
            value={ejercicioNuevo.nota}
            onChangeText={(valor)=>{handleChange('nota',valor)}}
            style={[styles.input, styles.inputNota]}
            placeholderTextColor={colores.textoTenue}
            accessibilityLabel="Nota del ejercicio"
            maxFontSizeMultiplier={maxEscalaFuente}
          />
        </View>
      </ScrollView>
    </PantallaModal>
  );
};

export default FormEjercicio;
