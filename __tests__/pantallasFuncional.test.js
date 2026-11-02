/**
 * Las pantallas de la pestaña Funcional se montan sin romperse con datos reales
 * (formulario, detalle, ejecucion y resumen, e historial mezclado). Los modulos
 * nativos (notificaciones, sonido, navegacion) van simulados.
 *
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { configureStore } from '@reduxjs/toolkit';

// El preset de react-native resuelve react-redux a su version ESM, que Jest no
// transforma: se usa la de CommonJS (la misma API).
jest.mock('react-redux', () =>
  jest.requireActual(require('path').resolve(__dirname, '../node_modules/react-redux/dist/cjs/index.js')),
);
const { Provider } = require('react-redux');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: View,
    useSafeAreaInsets: () => insets,
    initialWindowMetrics: { insets, frame: { x: 0, y: 0, width: 390, height: 844 } },
  };
});
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-toast-message', () => ({ __esModule: true, default: { show: jest.fn() } }));
jest.mock('react-native-sound', () => {
  class Sonido {
    static setCategory() {}
    stop(cb) { cb?.(); }
    play() {}
    release() {}
  }
  return Sonido;
});
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    getTriggerNotificationIds: jest.fn(async () => []),
    getDisplayedNotifications: jest.fn(async () => []),
    cancelTriggerNotifications: jest.fn(async () => {}),
    cancelDisplayedNotifications: jest.fn(async () => {}),
    createTriggerNotification: jest.fn(async () => {}),
    getNotificationSettings: jest.fn(async () => ({ android: { alarm: 1 } })),
    createChannel: jest.fn(async () => {}),
  },
  AlarmType: {},
  AndroidCategory: {},
  AndroidImportance: {},
  AndroidNotificationSetting: { DISABLED: 0 },
  AndroidVisibility: {},
  TriggerType: {},
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ addListener: () => () => {}, isFocused: () => true }),
}));
jest.mock('react-native-qrcode-svg', () => 'QRCode');
jest.mock('react-native-vision-camera', () => ({}));
jest.mock('../services/pitidos', () => ({
  prepararPitidos: jest.fn(),
  pitidoCorto: jest.fn(),
  pitidoLargo: jest.fn(),
  liberarPitidos: jest.fn(),
}));
jest.mock('../services/apiClient', () => ({ apiJson: jest.fn(async () => ({ data: [] })) }));

import rootReducer from '../store/rootReducer';
import FormFuncional from '../views/funcional/formFuncional';
import DetalleFuncional from '../views/funcional/detalleFuncional';
import EjecucionFuncional from '../views/funcional/ejecucionFuncional';
import ResumenFuncional from '../views/funcional/resumenFuncional';
import MisFuncionales from '../views/funcional/misFuncionales';
import DiaHistorial from '../views/historial/diaHistorial';
import Historial from '../views/historial/historial';
import MisRutinas from '../views/rutinas/misRutinas';
import RutinasAsignadas from '../views/rutinas/rutinasAsignadas';
import { apiJson } from '../services/apiClient';
import { iniciar, terminar } from '../helpers/sesionFuncional';

const funcional = {
  id: 'f1',
  tipo: 'funcional',
  nombre: 'Core express',
  vueltas: 3,
  descansoEntreVueltasSegundos: 60,
  modoPorDefecto: 'auto',
  bloques: [
    { id: 'b1', ejercicio: { idEjercicio: 1001, nombre: 'Plancha frontal', categoria: 'core' }, trabajoSegundos: 45, descansoSegundos: 15, nota: 'Glúteos firmes' },
    { id: 'b2', ejercicio: { idEjercicio: 1006, nombre: 'Crunch abdominal', categoria: 'core' }, trabajoSegundos: 40, descansoSegundos: 0, nota: '' },
  ],
};

const crearStore = estado => configureStore({ reducer: rootReducer, preloadedState: estado });

const montar = (elemento, estado = {}) => {
  const store = crearStore({
    rutinas: { rutinas: [funcional, { id: 'r1', nombre: 'Pecho', ejercicios: [] }] },
    ...estado,
  });
  let arbol;
  act(() => {
    arbol = ReactTestRenderer.create(<Provider store={store}>{elemento}</Provider>);
  });
  return { arbol, store };
};

const textoDe = hijos =>
  (Array.isArray(hijos) ? hijos : [hijos]).filter(h => typeof h === 'string' || typeof h === 'number').join('');

const textos = arbol =>
  arbol.root
    .findAll(n => n.type === 'Text' || n.type?.displayName === 'Text')
    .map(n => textoDe(n.props.children))
    .filter(Boolean)
    .join(' | ');

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  act(() => jest.runOnlyPendingTimers());
  jest.useRealTimers();
});

describe('pestaña Rutinas', () => {
  it('Mis rutinas no muestra funcionales', () => {
    const { arbol } = montar(<MisRutinas />);
    const t = textos(arbol);
    expect(t).toContain('Pecho');
    expect(t).not.toContain('Core express');
  });

  it('las asignaciones se reparten por tipo', async () => {
    apiJson.mockImplementation(async ruta => (ruta.startsWith('/routine/assign/athlete') ? {
      data: [
        { id: 1, isActive: true, Routine: { id: 10, name: 'Fuerza del coach', time: 40, Routine_Ejercices: [] } },
        { id: 2, isActive: true, Routine: { id: 11, name: 'HIIT del coach', kind: 'functional', rounds: 2, Routine_Ejercices: [] } },
      ],
    } : { data: [] }));
    const estado = { usuario: { sesion: { token: 't', user: { id: 5 } }, usuario: {}, authInitializing: false } };

    const fuerza = montar(<RutinasAsignadas />, estado);
    const funcionales = montar(<RutinasAsignadas tipo="funcional" />, estado);
    await act(async () => {});

    expect(textos(fuerza.arbol)).toContain('Fuerza del coach');
    expect(textos(fuerza.arbol)).not.toContain('HIIT del coach');
    expect(textos(funcionales.arbol)).toContain('HIIT del coach');
    expect(textos(funcionales.arbol)).not.toContain('Fuerza del coach');
  });
});

describe('pantallas del funcional', () => {
  it('la lista muestra solo funcionales', () => {
    const { arbol } = montar(<MisFuncionales />);
    const t = textos(arbol);
    expect(t).toContain('Core express');
    expect(t).not.toContain('Pecho');
  });

  it('el formulario carga un funcional para editar', () => {
    const { arbol } = montar(<FormFuncional funcional={funcional} onClose={() => {}} />);
    const t = textos(arbol);
    expect(t).toContain('Editar funcional');
    expect(t).toContain('Duración total: ');
  });

  it('el detalle muestra la duracion y los bloques', () => {
    const { arbol } = montar(
      <DetalleFuncional funcional={funcional} onVolver={() => {}} onEditar={() => {}} onIniciar={() => {}} />,
    );
    const t = textos(arbol);
    expect(t).toContain('Plancha frontal');
    expect(t).toContain('Iniciar');
  });

  it('la ejecucion arranca en la preparacion', () => {
    const sesion = iniciar(funcional, 'auto', Date.now());
    const { arbol } = montar(<EjecucionFuncional visible onClose={() => {}} />, { sesionFuncional: { sesion } });
    const t = textos(arbol);
    expect(t).toContain('Preparación');
    expect(t).toContain('Plancha frontal');
  });

  it('la ejecucion avanza con el reloj, saltea y pausa', () => {
    const { arbol, store } = montar(<EjecucionFuncional visible onClose={() => {}} />, {
      sesionFuncional: { sesion: iniciar(funcional, 'auto', Date.now()) },
    });
    act(() => jest.advanceTimersByTime(6000));
    expect(textos(arbol)).toContain('Trabajo');
    expect(store.getState().sesionFuncional.sesion.indice).toBe(1);

    const boton = etiqueta => arbol.root.find(n => n.props?.accessibilityLabel === etiqueta && n.props?.onPress);
    act(() => boton('Saltar').props.onPress());
    expect(textos(arbol)).toContain('Descanso');
    expect(textos(arbol)).toContain('Sigue: Crunch abdominal');

    act(() => boton('Pausar').props.onPress());
    expect(textos(arbol)).toContain('En pausa');
    act(() => jest.advanceTimersByTime(60000));
    expect(store.getState().sesionFuncional.sesion.indice).toBe(2);
  });

  it('el resumen y el historial muestran el funcional', () => {
    const sesion = iniciar(funcional, 'auto', 0);
    const { registro } = terminar(sesion, 60 * 1000);
    const { arbol } = montar(<ResumenFuncional registro={registro} onListo={() => {}} />);
    expect(textos(arbol)).toContain('Core express');

    const conHistorial = {
      historial: { registros: [{ ...registro, id: 'h1', fecha: '2026-11-02', creadoEn: registro.iniciadoEn }] },
    };
    const dia = montar(<DiaHistorial fecha="2026-11-02" onClose={() => {}} />, conHistorial);
    expect(textos(dia.arbol)).toContain('Core express · Funcional');
    const lista = montar(<Historial />, conHistorial);
    expect(textos(lista.arbol)).toContain('1 funcional');
  });
});
