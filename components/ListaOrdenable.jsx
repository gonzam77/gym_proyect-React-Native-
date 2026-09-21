import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Vibration,
} from 'react-native';

const claveDefecto = item => item.id;

/**
 * Fila de la lista. Se encarga de su propio PanResponder y de acomodarse con
 * un spring cuando el arrastre la corre de lugar.
 *
 * El PanResponder se crea una sola vez (si se recreara en cada render se
 * cortaria el gesto en curso) y lee los callbacks desde `api`, que se refresca
 * en cada render para que nunca queden viejos.
 */
const FilaArrastrable = ({
  id,
  item,
  indice,
  total,
  y,
  separacion,
  arrastrando,
  hayArrastre,
  desplazamiento,
  medir,
  renderItem,
  alTomar,
  alMover,
  alSoltar,
  onReordenar,
}) => {
  const acomodo = useRef(new Animated.Value(0)).current;
  const yPrevia = useRef(y);
  const api = useRef(null);

  api.current = { id, indice, alTomar, alMover, alSoltar, onReordenar };

  useEffect(() => {
    const previa = yPrevia.current;
    yPrevia.current = y;

    // Solo se anima el acomodo mientras hay un arrastre en curso. Si no, la
    // fila aparece o cambia de lugar por otro motivo (se monto la lista, se
    // agrego un ejercicio) y deslizarla seria ruido.
    if (!hayArrastre || arrastrando) {
      acomodo.setValue(0);
      return;
    }

    const delta = previa - y;
    if (!delta) {
      return;
    }

    acomodo.setValue(delta);
    Animated.spring(acomodo, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  }, [y, hayArrastre, arrastrando, acomodo]);

  const responder = useRef(null);
  if (!responder.current) {
    responder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => api.current.alTomar(api.current.id),
      onPanResponderMove: (_, gesto) => api.current.alMover(gesto.dy),
      onPanResponderRelease: () => api.current.alSoltar(),
      onPanResponderTerminate: () => api.current.alSoltar(),
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    });
  }

  // Arrastrar no existe para un lector de pantalla. Las acciones van en la
  // fila entera y no en la manija: si la fila ya es accesible (una tarjeta que
  // se toca, por ejemplo), TalkBack la lee como un solo nodo y nunca llegaria
  // a enfocar la manija de adentro.
  const accionesOrden = useMemo(() => {
    const acciones = [];
    if (indice > 0) {
      acciones.push({ name: 'subir', label: 'Subir' });
    }
    if (indice < total - 1) {
      acciones.push({ name: 'bajar', label: 'Bajar' });
    }

    return {
      accessibilityActions: acciones,
      onAccessibilityAction: evento => {
        const accion = evento.nativeEvent.actionName;
        if (accion === 'subir') {
          api.current.onReordenar?.(api.current.indice, api.current.indice - 1);
        }
        if (accion === 'bajar') {
          api.current.onReordenar?.(api.current.indice, api.current.indice + 1);
        }
      },
    };
  }, [indice, total]);

  return (
    <Animated.View
      onLayout={evento => medir(id, evento.nativeEvent.layout.height)}
      style={[
        { paddingBottom: separacion },
        arrastrando && estilos.filaArrastrada,
        {
          transform: [
            { translateY: arrastrando ? desplazamiento : acomodo },
            { scale: arrastrando ? 1.02 : 1 },
          ],
        },
      ]}
    >
      {renderItem({
        item,
        index: indice,
        arrastrando,
        manejador: responder.current.panHandlers,
        accionesOrden,
      })}
    </Animated.View>
  );
};

/**
 * Lista que se reordena arrastrando, hecha solo con PanResponder y Animated:
 * no necesita gesture-handler ni reanimated.
 *
 * Como funciona:
 * - Cada fila se mide con onLayout y su alto se guarda por id, asi tolera
 *   tarjetas de distinta altura. La separacion entre filas la pone la lista
 *   como paddingBottom para que entre en la medicion.
 * - El gesto no arranca desde toda la fila sino desde un `manejador` que
 *   renderItem recibe y ubica donde quiera; el resto de la tarjeta sigue
 *   scrolleando y respondiendo al toque como siempre.
 * - Mientras dura el arrastre se trabaja sobre un orden preliminar de ids: la
 *   fila tomada sigue al dedo y las demas se acomodan solas. Recien al soltar
 *   se avisa al padre con (desde, hacia). Como el orden preliminar ya es el
 *   final, cuando llegan los datos nuevos no hay salto visual.
 *
 * Queda afuera a proposito el auto-scroll al arrastrar contra el borde: las
 * listas de la app entran casi en pantalla y agregarlo complica bastante.
 */
const ListaOrdenable = ({
  datos = [],
  claveItem = claveDefecto,
  renderItem,
  onReordenar,
  separacion = 0,
  vacio = null,
  style,
  contentContainerStyle,
  ...restoScroll
}) => {
  const [alturas, setAlturas] = useState({});
  const [ordenArrastre, setOrdenArrastre] = useState(null);
  const [idArrastrado, setIdArrastrado] = useState(null);

  const desplazamiento = useRef(new Animated.Value(0)).current;
  const refAlturas = useRef(alturas);
  const refOrden = useRef([]);
  const refOrdenInicial = useRef([]);
  const refId = useRef(null);
  const refYInicial = useRef(0);
  const refDy = useRef(0);

  refAlturas.current = alturas;

  const lista = useMemo(() => {
    if (!ordenArrastre) {
      return datos;
    }

    // Si los datos cambian en medio del arrastre (llega una sincronizacion,
    // se borra un ejercicio) el orden preliminar deja de servir.
    const porId = new Map(datos.map(item => [claveItem(item), item]));
    const ordenada = ordenArrastre.map(id => porId.get(id)).filter(Boolean);
    return ordenada.length === datos.length ? ordenada : datos;
  }, [datos, ordenArrastre, claveItem]);

  const posiciones = useMemo(() => {
    const mapa = {};
    let y = 0;
    for (const item of lista) {
      const id = claveItem(item);
      mapa[id] = y;
      y += alturas[id] || 0;
    }
    return mapa;
  }, [lista, alturas, claveItem]);

  const medir = useCallback((id, alto) => {
    setAlturas(prev => (
      Math.abs((prev[id] || 0) - alto) < 0.5 ? prev : { ...prev, [id]: alto }
    ));
  }, []);

  /** Y donde arranca una fila, segun el orden y los altos medidos. */
  const baseDe = useCallback((orden, id) => {
    let y = 0;
    for (const otro of orden) {
      if (otro === id) {
        break;
      }
      y += refAlturas.current[otro] || 0;
    }
    return y;
  }, []);

  /**
   * Deja la fila tomada donde esta el dedo. Se recalcula contra la posicion
   * que tiene en el orden preliminar: cuando el orden cambia, la fila ya se
   * movio sola en el layout y hay que descontar ese corrimiento.
   */
  const seguirDedo = useCallback(() => {
    const base = baseDe(refOrden.current, refId.current);
    desplazamiento.setValue(refYInicial.current + refDy.current - base);
  }, [baseDe, desplazamiento]);

  const alTomar = useCallback(id => {
    const orden = lista.map(claveItem);

    refOrden.current = orden;
    refOrdenInicial.current = orden;
    refId.current = id;
    refYInicial.current = baseDe(orden, id);
    refDy.current = 0;

    desplazamiento.setValue(0);
    setOrdenArrastre(orden);
    setIdArrastrado(id);

    // Un toquecito para que se note que la fila quedo agarrada. En iOS
    // Vibration.vibrate ignora la duracion y sacude el telefono entero.
    if (Platform.OS === 'android') {
      Vibration.vibrate(10);
    }
  }, [lista, claveItem, baseDe, desplazamiento]);

  const alMover = useCallback(dy => {
    const id = refId.current;
    if (!id) {
      return;
    }

    refDy.current = dy;

    const orden = refOrden.current;
    const alto = refAlturas.current[id] || 0;
    const centro = refYInicial.current + dy + alto / 2;

    // Donde habria que insertar la fila, mirando el resto como si ella no
    // estuviera: entra antes de la primera cuya mitad queda pasando el centro.
    const resto = orden.filter(otro => otro !== id);
    let acumulado = 0;
    let destino = resto.length;

    for (let i = 0; i < resto.length; i++) {
      const altoOtro = refAlturas.current[resto[i]] || 0;
      if (centro < acumulado + altoOtro / 2) {
        destino = i;
        break;
      }
      acumulado += altoOtro;
    }

    if (destino !== orden.indexOf(id)) {
      const nuevo = [...resto];
      nuevo.splice(destino, 0, id);
      refOrden.current = nuevo;
      setOrdenArrastre(nuevo);
    }

    seguirDedo();
  }, [seguirDedo]);

  const alSoltar = useCallback(() => {
    const id = refId.current;
    if (!id) {
      return;
    }

    const desde = refOrdenInicial.current.indexOf(id);
    const hacia = refOrden.current.indexOf(id);

    Animated.spring(desplazamiento, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 18,
    }).start(() => {
      refId.current = null;
      setIdArrastrado(null);
      setOrdenArrastre(null);

      if (desde !== hacia && desde >= 0 && hacia >= 0) {
        onReordenar?.(desde, hacia);
      }
    });
  }, [desplazamiento, onReordenar]);

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      scrollEnabled={!idArrastrado}
      {...restoScroll}
    >
      {lista.length === 0 ? vacio : lista.map((item, indice) => {
        const id = claveItem(item);

        return (
          <FilaArrastrable
            key={id}
            id={id}
            item={item}
            indice={indice}
            total={lista.length}
            y={posiciones[id] || 0}
            separacion={separacion}
            arrastrando={idArrastrado === id}
            hayArrastre={Boolean(idArrastrado)}
            desplazamiento={desplazamiento}
            medir={medir}
            renderItem={renderItem}
            alTomar={alTomar}
            alMover={alMover}
            alSoltar={alSoltar}
            onReordenar={onReordenar}
          />
        );
      })}
    </ScrollView>
  );
};

export default ListaOrdenable;

const estilos = StyleSheet.create({
  filaArrastrada: {
    // Sin esto la fila tomada pasa por debajo de las que vienen despues.
    zIndex: 20,
  },
});
