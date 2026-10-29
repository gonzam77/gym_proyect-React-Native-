import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

import PantallaModal from "../../components/PantallaModal";
import FormRegistroSeries from "../../components/FormRegistroSeries";
import { styles } from "../../styles/historialStyles";
import { styles as estilosRegistro } from "../../styles/registroStyles";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { eliminarDiaHistorial, registroCompleto } from "../../store/historialSlice";
import { etiquetaDia, formatearFecha, horaLocal } from "../../helpers/fechas";
import { describirSerie } from "../../helpers/registroSeries";
import { avisoExito } from "../../helpers/avisos";

/** Detalle de un dia del historial: ejercicios agrupados por rutina. */
const DiaHistorial = ({ fecha, onClose }) => {
  const dispatch = useDispatch();
  const registros = useSelector(state => state.historial.registros);
  const [idEditando, setIdEditando] = useState(null);

  // Agrupa por rutina, en el orden en que se entrenaron.
  const grupos = useMemo(() => {
    const delDia = registros
      .filter(r => r.fecha === fecha)
      .sort((a, b) => String(a.creadoEn).localeCompare(String(b.creadoEn)));

    const porRutina = new Map();
    for (const r of delDia) {
      const clave = `${r.idRutina}`;
      if (!porRutina.has(clave)) porRutina.set(clave, { nombre: r.nombreRutina, registros: [] });
      porRutina.get(clave).registros.push(r);
    }
    return [...porRutina.values()];
  }, [registros, fecha]);

  const editando = registros.find(r => r.id === idEditando) || null;

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar día",
      `¿Querés borrar el registro del ${formatearFecha(fecha)}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            onClose();
            dispatch(eliminarDiaHistorial(fecha));
            avisoExito('Día eliminado del historial');
          },
        },
      ],
    );
  };

  return (
    <PantallaModal>
      <View style={styles.cuerpo}>
        <View style={styles.botonera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al historial"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
            onPress={onClose}
          >
            <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Eliminar este día del historial"
            hitSlop={8}
            style={({ pressed }) => [styles.botonIcono, pressed && styles.presionado]}
            onPress={confirmarEliminar}
          >
            <Icon name="trash-outline" color={colores.peligro} size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.detalleContenido} showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.diaNombre} maxFontSizeMultiplier={maxEscalaFuente}>{etiquetaDia(fecha)}</Text>
            <Text style={styles.detalleTitulo} maxFontSizeMultiplier={maxEscalaFuente}>{formatearFecha(fecha)}</Text>
          </View>

          {grupos.map(grupo => (
            <View key={grupo.nombre + grupo.registros[0].id}>
              <Text style={styles.seccionRutina} maxFontSizeMultiplier={maxEscalaFuente}>{grupo.nombre}</Text>

              {grupo.registros.map(r => {
                const completo = registroCompleto(r);
                return (
                  <View key={r.id} style={[styles.ejercicio, styles.ejercicioSeparado]}>
                    <View style={styles.ejercicioEncabezado}>
                      <Text style={styles.ejercicioNombre} maxFontSizeMultiplier={maxEscalaFuente}>
                        {r.nombreEjercicio}
                      </Text>
                      <Text style={styles.hora} maxFontSizeMultiplier={maxEscalaFuente}>{horaLocal(r.creadoEn)}</Text>
                    </View>

                    <View style={[styles.badge, completo ? styles.badgeCompleto : styles.badgeIncompleto]}>
                      <Icon
                        name={completo ? 'checkmark-circle' : 'ellipse-outline'}
                        size={13}
                        color={completo ? colores.exito : colores.aviso}
                      />
                      <Text
                        style={[styles.badgeTexto, completo ? styles.badgeTextoCompleto : styles.badgeTextoIncompleto]}
                        maxFontSizeMultiplier={maxEscalaFuente}
                      >
                        {completo
                          ? `Completo · ${r.series.length} series`
                          : `Incompleto · ${r.series.length} de ${r.seriesObjetivo} series`}
                      </Text>
                    </View>

                    <View style={estilosRegistro.listaSeries}>
                      {r.series.map(s => (
                        <View key={s.numero} style={estilosRegistro.filaSerie}>
                          <Text style={estilosRegistro.filaSerieNumero} maxFontSizeMultiplier={maxEscalaFuente}>
                            Serie {s.numero}
                          </Text>
                          <Text
                            style={s.estado === 'registrada' ? estilosRegistro.filaSerieDato : estilosRegistro.filaSerieDatoTenue}
                            maxFontSizeMultiplier={maxEscalaFuente}
                          >
                            {describirSerie(s)}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Editar repeticiones y peso de ${r.nombreEjercicio}`}
                      style={({ pressed }) => [styles.editar, pressed && styles.presionado]}
                      onPress={() => setIdEditando(r.id)}
                    >
                      <Icon name="create-outline" size={18} color={colores.acento} />
                      <Text style={styles.editarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                        Editar reps y peso
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      <FormRegistroSeries
        visible={Boolean(editando)}
        registro={editando}
        titulo={editando ? editando.nombreEjercicio : ''}
        onClose={() => setIdEditando(null)}
      />
    </PantallaModal>
  );
};

export default DiaHistorial;
