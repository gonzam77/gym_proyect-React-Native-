/**
 * El arrastre corta el scroll de la lista mientras dura, asi que lo unico
 * imperdonable es que se olvide de devolverlo.
 *
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ScrollView, View } from 'react-native';
import ListaOrdenable from '../components/ListaOrdenable';

const DATOS = [{ id: 'a' }, { id: 'b' }];

let reloj = 0;

/** Un toque de un dedo solo, que es lo que PanResponder necesita leer. */
const toque = (y, previa = y) => {
  reloj += 16;

  return {
    nativeEvent: { touches: [{}] },
    touchHistory: {
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: reloj,
      touchBank: [
        {
          touchActive: true,
          startPageX: 0,
          startPageY: previa,
          previousPageX: 0,
          previousPageY: previa,
          currentPageX: 0,
          currentPageY: y,
          startTimeStamp: reloj,
          previousTimeStamp: reloj,
          currentTimeStamp: reloj,
        },
      ],
    },
  };
};

const montar = () => {
  const onReordenar = jest.fn();
  const manejadores = {};
  let arbol;

  const pintar = datos => (
    <ListaOrdenable
      datos={datos}
      onReordenar={onReordenar}
      renderItem={({ item, manejador }) => {
        manejadores[item.id] = manejador;
        return <View testID={`fila-${item.id}`} />;
      }}
    />
  );

  act(() => {
    arbol = ReactTestRenderer.create(pintar(DATOS));
  });

  return {
    onReordenar,
    scrollHabilitado: () => arbol.root.findByType(ScrollView).props.scrollEnabled,
    cambiarDatos: datos => act(() => arbol.update(pintar(datos))),
    tomar: id => act(() => {
      manejadores[id].onStartShouldSetResponder(toque(0));
      manejadores[id].onResponderGrant(toque(0));
    }),
    mover: (id, dy) => act(() => {
      manejadores[id].onResponderMove(toque(dy, 0));
    }),
    soltar: id => act(() => {
      manejadores[id].onResponderRelease(toque(0));
    }),
  };
};

beforeEach(() => {
  jest.useFakeTimers();
  reloj = 0;
});

afterEach(() => {
  jest.useRealTimers();
});

test('corta el scroll mientras se arrastra una fila', () => {
  const lista = montar();

  expect(lista.scrollHabilitado()).toBe(true);

  lista.tomar('a');
  lista.mover('a', 50);

  expect(lista.scrollHabilitado()).toBe(false);
});

test('devuelve el scroll al soltar, sin esperar a que la fila se asiente', () => {
  const lista = montar();

  lista.tomar('a');
  lista.mover('a', 50);
  lista.soltar('a');

  expect(lista.scrollHabilitado()).toBe(true);
  expect(lista.onReordenar).toHaveBeenCalledWith(0, 1);
});

test('no se queda bloqueado si se agarra otra fila mientras la anterior se asienta', () => {
  const lista = montar();

  lista.tomar('a');
  lista.mover('a', 50);
  lista.soltar('a');

  // Sin avanzar el reloj: el spring de asentado sigue corriendo cuando el
  // dedo vuelve a bajar.
  lista.tomar('b');
  lista.mover('b', 50);
  lista.soltar('b');

  expect(lista.scrollHabilitado()).toBe(true);
  expect(lista.onReordenar).toHaveBeenCalledTimes(2);

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(lista.scrollHabilitado()).toBe(true);
});

test('devuelve el scroll si la fila arrastrada desaparece de los datos', () => {
  const lista = montar();

  lista.tomar('a');
  lista.mover('a', 50);
  lista.cambiarDatos([{ id: 'b' }]);

  expect(lista.scrollHabilitado()).toBe(true);
});
