import { Modal, Pressable, Text, View, Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import DetalleEjercicio from "./detalleEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import formatearTiempo from '../../helpers/formatearTiempo';
import { styles } from '../../styles/detalleRutinaStyles';
import { eliminarRutina, reiniciarRutina, reubicarEjercicio } from "../../store/rutinasSlice";
import { colores } from "../../styles/colores";
import { espaciado, maxEscalaFuente } from "../../styles/theme";
import BarraProgreso from "../../components/BarraProgreso";
import ProgresoSeries from "../../components/ProgresoSeries";
import HojaAcciones from "../../components/HojaAcciones";
import EstadoVacio from "../../components/EstadoVacio";
import PantallaModal from "../../components/PantallaModal";
import ListaOrdenable from "../../components/ListaOrdenable";
import { avisoExito } from "../../helpers/avisos";

const estaFinalizado = ejercicio => {
  const series = Number(ejercicio?.series) || 0;
  const realizadas = Number(ejercicio?.seriesRealizadas) || 0;
  return series > 0 && realizadas >= series;
};

const DetalleRutina = (
  {
    rutinaSeleccionada,
    setRutinaSeleccionada,
    setModalFormRutina,
    setModalDetalle
  })=>{

  const rutinaActualizada = useSelector(state =>
    state.rutinas.rutinas.find(r => r.id === rutinaSeleccionada?.id)
  );

  const copiaRutinaActualizada = rutinaActualizada
    ? JSON.parse(JSON.stringify(rutinaActualizada))
    : null;

  const dispatch = useDispatch();

  // Se guarda el id y no el ejercicio: guardar el objeto congelaba una copia del
  // momento del toque, asi que los cambios hechos adentro (la nota del descanso,
  // por ejemplo) nunca llegaban de vuelta al detalle del ejercicio.
  const [idEjercicio, setIdEjercicio] = useState(null);
  const [modalEjercicio, setModalEjercicio] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleEliminarRutina  = (id)=>{
    setRutinaSeleccionada({});
    setModalDetalle(false);
    dispatch(eliminarRutina(id));
    avisoExito('Rutina eliminada');
  };

  useEffect(()=>{
    if (rutinaActualizada) {
      setRutinaSeleccionada(rutinaActualizada);
    }
  },[rutinaActualizada, setRutinaSeleccionada]);

  const handleReiniciarRutina = () =>{
    if (!copiaRutinaActualizada) {
      return;
    }

    dispatch(reiniciarRutina(copiaRutinaActualizada));
    avisoExito('Rutina reiniciada', 'Todas las series volvieron a cero.');
  }

  const idRutina = copiaRutinaActualizada?.id;

  const reubicar = useCallback((desde, hacia) => {
    if (!idRutina) {
      return;
    }

    dispatch(reubicarEjercicio({ idRutina, desde, hacia }));
  }, [dispatch, idRutina]);

  const confirmarReiniciar = () => {
    Alert.alert(
      "Reiniciar rutina",
      "¿Querés volver todas las series de esta rutina a cero?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Reiniciar", onPress: handleReiniciarRutina },
      ],
    );
  };

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar rutina",
      `¿Querés eliminar "${copiaRutinaActualizada?.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => handleEliminarRutina(copiaRutinaActualizada.id),
        },
      ],
    );
  };

  if (!copiaRutinaActualizada) {
    return <View style={styles.container} />;
  }

  const ejercicios = copiaRutinaActualizada?.ejercicios || [];
  const completados = ejercicios.filter(estaFinalizado).length;
  const total = ejercicios.length;
  const progreso = total > 0 ? completados / total : 0;

  return (
    <PantallaModal>
      <View style={styles.cuerpo}>
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a mis rutinas"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
            onPress={() => {
              setRutinaSeleccionada({});
              setModalDetalle(false);
            }}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>

          <View style={styles.acciones}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar la rutina"
              style={({ pressed }) => [styles.botonSecundario, pressed && styles.botonIconoPresionado]}
              onPress={() => setModalFormRutina(true)}
            >
              <Icon name="pencil-outline" color={colores.textoPrimario} size={18} />
              <Text style={styles.botonSecundarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                Editar
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Más opciones de la rutina"
              hitSlop={8}
              style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
              onPress={() => setMenuVisible(true)}
            >
              <Icon name="ellipsis-vertical" color={colores.textoPrimario} size={22} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.titulo} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
          {copiaRutinaActualizada?.nombre}
        </Text>

        <View style={styles.metaFila}>
          <View style={styles.metaItem}>
            <Icon name="time-outline" size={16} color={colores.acento} />
            <Text style={styles.tiempo} maxFontSizeMultiplier={maxEscalaFuente}>
              {formatearTiempo(copiaRutinaActualizada.tiempo)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="barbell-outline" size={16} color={colores.textoSecundario} />
            <Text style={styles.metaTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              {total} {total === 1 ? 'ejercicio' : 'ejercicios'}
            </Text>
          </View>
        </View>

        {total > 0 ? (
          <View style={styles.progresoContenedor}>
            <Text style={styles.progresoTexto} maxFontSizeMultiplier={maxEscalaFuente}>
              {completados === total
                ? '¡Rutina completa!'
                : `${completados} de ${total} ejercicios hechos`}
            </Text>
            <BarraProgreso
              progreso={progreso}
              color={completados === total ? colores.exito : colores.principal}
              etiqueta="Progreso de la rutina"
            />
          </View>
        ) : null}

        <ListaOrdenable
          datos={ejercicios}
          onReordenar={reubicar}
          separacion={espaciado.lg}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          vacio={
            <EstadoVacio
              icono="barbell-outline"
              titulo="Esta rutina no tiene ejercicios"
              descripcion="Editá la rutina para agregar el primero."
              textoAccion="Agregar ejercicios"
              onAccion={() => setModalFormRutina(true)}
            />
          }
          renderItem={({ item: e, index, arrastrando, manejador, accionesOrden }) => {
            const finalizado = estaFinalizado(e);

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Entrenar ${e.nombre}. Ejercicio ${index + 1} de ${ejercicios.length}`}
                accessibilityHint="Usá las acciones Subir y Bajar para cambiarlo de lugar"
                {...accionesOrden}
                style={({ pressed }) => [
                  styles.ejercicioItem,
                  pressed && styles.ejercicioItemPresionado,
                  arrastrando && styles.ejercicioItemArrastrado,
                ]}
                onPress={() => {
                  setIdEjercicio(e.id);
                  setModalEjercicio(true);
                }}
              >
                <View style={styles.filaPrincipal}>
                  <View style={styles.datos}>
                    <Text
                      style={styles.ejercicioNombre}
                      numberOfLines={2}
                      maxFontSizeMultiplier={maxEscalaFuente}
                    >
                      {e.nombre}
                    </Text>
                    <Text style={styles.ejercicioDetalle} maxFontSizeMultiplier={maxEscalaFuente}>
                      {Number(e.seriesRealizadas) || 0} de {e.series} series
                      {e.descanso ? ` · ${e.descanso} min de descanso` : ''}
                    </Text>

                    {finalizado ? (
                      <View style={styles.badgeFinalizado}>
                        <Icon name="checkmark-circle" size={13} color={colores.exito} />
                        <Text
                          style={styles.badgeFinalizadoTexto}
                          maxFontSizeMultiplier={maxEscalaFuente}
                        >
                          Finalizado
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.actionsContainer}>
                    {/* La manija es lo unico que arrastra: el resto de la
                        tarjeta sigue scrolleando y abriendo el ejercicio. */}
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

                <View style={styles.seriesProgreso}>
                  <ProgresoSeries
                    total={e.series}
                    realizadas={e.seriesRealizadas}
                    color={finalizado ? colores.exito : colores.principal}
                  />
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      <HojaAcciones
        visible={menuVisible}
        titulo={copiaRutinaActualizada?.nombre}
        onClose={() => setMenuVisible(false)}
        opciones={[
          {
            texto: 'Reiniciar series',
            icono: 'refresh-outline',
            onPress: confirmarReiniciar,
          },
          {
            texto: 'Eliminar rutina',
            icono: 'trash-outline',
            destructivo: true,
            onPress: confirmarEliminar,
          },
        ]}
      />

      <Modal
        visible={modalEjercicio}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setModalEjercicio(false)}
      >
        <DetalleEjercicio
          ejercicio={ejercicios.find(e => e.id === idEjercicio) || {}}
          setModalEjercicio={setModalEjercicio}
          rutinaSeleccionada={copiaRutinaActualizada}
        />
      </Modal>

    </PantallaModal>
  )
}

export default DetalleRutina;
