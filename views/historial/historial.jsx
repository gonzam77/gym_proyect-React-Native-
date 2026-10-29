import { useMemo, useState } from "react";
import { Alert, FlatList, Modal, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

import EstadoVacio from "../../components/EstadoVacio";
import HojaAcciones from "../../components/HojaAcciones";
import DiaHistorial from "./diaHistorial";
import { styles } from "../../styles/historialStyles";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { eliminarDiaHistorial, eliminarHistorial, registroCompleto } from "../../store/historialSlice";
import { etiquetaDia, formatearFecha } from "../../helpers/fechas";
import { avisoExito } from "../../helpers/avisos";

/** Arma el resumen por dia, del mas reciente al mas viejo. */
const agruparPorDia = registros => {
  const dias = new Map();
  for (const r of registros) {
    if (!dias.has(r.fecha)) {
      dias.set(r.fecha, { fecha: r.fecha, rutinas: [], ejercicios: 0, completos: 0, series: 0 });
    }
    const dia = dias.get(r.fecha);
    if (!dia.rutinas.includes(r.nombreRutina)) dia.rutinas.push(r.nombreRutina);
    dia.ejercicios += 1;
    dia.series += r.series.length;
    if (registroCompleto(r)) dia.completos += 1;
  }
  return [...dias.values()].sort((a, b) => b.fecha.localeCompare(a.fecha));
};

const Historial = () => {
  const dispatch = useDispatch();
  const registros = useSelector(state => state.historial?.registros || []);
  const dias = useMemo(() => agruparPorDia(registros), [registros]);

  const [diaAbierto, setDiaAbierto] = useState(null);
  const [menuDia, setMenuDia] = useState(null);

  const confirmarEliminarDia = fecha => {
    Alert.alert(
      "Eliminar día",
      `¿Querés borrar el registro del ${formatearFecha(fecha)}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            dispatch(eliminarDiaHistorial(fecha));
            avisoExito('Día eliminado del historial');
          },
        },
      ],
    );
  };

  const confirmarEliminarTodo = () => {
    Alert.alert(
      "Borrar historial",
      "Se va a borrar todo el historial de entrenamientos. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar todo",
          style: "destructive",
          onPress: () => {
            dispatch(eliminarHistorial());
            avisoExito('Historial borrado');
          },
        },
      ],
    );
  };

  const renderDia = ({ item: dia }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${etiquetaDia(dia.fecha)} ${formatearFecha(dia.fecha)}. ${dia.ejercicios} ejercicios. Ver detalle`}
      style={({ pressed }) => [styles.dia, pressed && styles.diaPresionado]}
      onPress={() => setDiaAbierto(dia.fecha)}
      onLongPress={() => setMenuDia(dia.fecha)}
    >
      <View style={styles.diaEncabezado}>
        <View style={styles.diaTextos}>
          <Text style={styles.diaNombre} maxFontSizeMultiplier={maxEscalaFuente}>{etiquetaDia(dia.fecha)}</Text>
          <Text style={styles.diaFecha} maxFontSizeMultiplier={maxEscalaFuente}>{formatearFecha(dia.fecha)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Opciones del ${formatearFecha(dia.fecha)}`}
          hitSlop={8}
          style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
          onPress={() => setMenuDia(dia.fecha)}
        >
          <Icon name="ellipsis-vertical" size={20} color={colores.textoSecundario} />
        </Pressable>
        <Icon name="chevron-forward-outline" size={22} color={colores.textoSecundario} />
      </View>

      <View style={styles.chips}>
        {dia.rutinas.map(nombre => (
          <View key={nombre} style={styles.chip}>
            <Text style={styles.chipTexto} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>{nombre}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.meta} maxFontSizeMultiplier={maxEscalaFuente}>
        {dia.ejercicios} {dia.ejercicios === 1 ? 'ejercicio' : 'ejercicios'}
        {` · ${dia.completos} ${dia.completos === 1 ? 'completo' : 'completos'}`}
        {` · ${dia.series} ${dia.series === 1 ? 'serie' : 'series'}`}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dias}
        keyExtractor={dia => dia.fecha}
        renderItem={renderDia}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          dias.length ? (
            <View style={styles.barra}>
              <Text style={styles.barraTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                {dias.length} {dias.length === 1 ? 'día entrenado' : 'días entrenados'}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Borrar todo el historial"
                style={({ pressed }) => [styles.botonBorrar, pressed && styles.presionado]}
                onPress={confirmarEliminarTodo}
              >
                <Icon name="trash-outline" size={16} color={colores.peligro} />
                <Text style={styles.botonBorrarTexto} maxFontSizeMultiplier={maxEscalaFuente}>Borrar todo</Text>
              </Pressable>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EstadoVacio
            icono="calendar-outline"
            titulo="Todavía no hay entrenamientos"
            descripcion="Cada serie que termines queda anotada acá, agrupada por día."
          />
        }
      />

      <HojaAcciones
        visible={Boolean(menuDia)}
        titulo={menuDia ? formatearFecha(menuDia) : ''}
        onClose={() => setMenuDia(null)}
        opciones={[
          {
            texto: 'Ver detalle',
            icono: 'list-outline',
            onPress: () => setDiaAbierto(menuDia),
          },
          {
            texto: 'Eliminar este día',
            icono: 'trash-outline',
            destructivo: true,
            onPress: () => confirmarEliminarDia(menuDia),
          },
        ]}
      />

      <Modal
        visible={Boolean(diaAbierto)}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setDiaAbierto(null)}
      >
        {diaAbierto ? <DiaHistorial fecha={diaAbierto} onClose={() => setDiaAbierto(null)} /> : null}
      </Modal>
    </View>
  );
};

export default Historial;
