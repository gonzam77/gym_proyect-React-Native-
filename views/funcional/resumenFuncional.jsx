import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles as estilos } from '../../styles/funcionalStyles';
import { colores } from '../../styles/colores';
import { maxEscalaFuente } from '../../styles/theme';
import PantallaModal from '../../components/PantallaModal';
import { formatearReloj } from '../../helpers/funcional';
import { contarEstados } from '../../helpers/sesionFuncional';

const ESTILO_ESTADO = {
  completo: estilos.estadoCompleto,
  parcial: estilos.estadoParcial,
  salteado: estilos.estadoSalteado,
};

const Dato = ({ etiqueta, valor }) => (
  <View style={estilos.dato}>
    <Text style={estilos.datoEtiqueta} maxFontSizeMultiplier={maxEscalaFuente}>{etiqueta}</Text>
    <Text style={estilos.datoValor} maxFontSizeMultiplier={maxEscalaFuente}>{valor}</Text>
  </View>
);

/** Resumen al terminar (o cortar antes). Ya quedo guardado en el historial. */
const ResumenFuncional = ({ registro, onListo }) => {
  const estados = contarEstados(registro.bloques);
  const completo = registro.vueltasCompletadas >= registro.vueltasObjetivo && estados.parcial === 0 && estados.salteado === 0;

  return (
    <PantallaModal>
      <ScrollView contentContainerStyle={estilos.resumen} showsVerticalScrollIndicator={false}>
        <Icon
          name={completo ? 'trophy-outline' : 'checkmark-done-outline'}
          size={64}
          color={completo ? colores.principal : colores.acento}
          style={estilos.resumenIcono}
        />
        <Text style={estilos.resumenTitulo} maxFontSizeMultiplier={maxEscalaFuente}>
          {completo ? '¡Terminaste!' : 'Listo por hoy'}
        </Text>
        <Text style={estilos.resumenSubtitulo} maxFontSizeMultiplier={maxEscalaFuente}>
          {registro.nombreRutina}
          {registro.bloques.length ? ' · quedó guardado en el historial' : ' · no se llegó a hacer ningún bloque'}
        </Text>

        <View style={estilos.resumenGrilla}>
          <Dato etiqueta="Tiempo total" valor={formatearReloj(registro.segundosTotales)} />
          <Dato etiqueta="Vueltas" valor={`${registro.vueltasCompletadas} de ${registro.vueltasObjetivo}`} />
          <Dato etiqueta="Completos" valor={estados.completo} />
          <Dato etiqueta="Parciales / salteados" valor={`${estados.parcial} / ${estados.salteado}`} />
        </View>

        <View style={estilos.resumenBloques}>
          {registro.bloques.map((bloque, indice) => (
            <View key={`${bloque.vuelta}-${indice}`} style={estilos.resumenFila}>
              <Text style={estilos.resumenFilaNombre} numberOfLines={1} maxFontSizeMultiplier={maxEscalaFuente}>
                {registro.vueltasObjetivo > 1 ? `V${bloque.vuelta} · ` : ''}{bloque.nombreEjercicio}
              </Text>
              <Text style={[estilos.resumenFilaDato, ESTILO_ESTADO[bloque.estado]]} maxFontSizeMultiplier={maxEscalaFuente}>
                {formatearReloj(bloque.segundosCumplidos)} / {formatearReloj(bloque.segundosObjetivo)}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar el resumen"
          style={({ pressed }) => [estilos.botonPrimario, estilos.botonAncho, pressed && estilos.presionado]}
          onPress={onListo}
        >
          <Text style={estilos.botonPrimarioTexto} maxFontSizeMultiplier={maxEscalaFuente}>Listo</Text>
        </Pressable>
      </ScrollView>
    </PantallaModal>
  );
};

export default ResumenFuncional;
