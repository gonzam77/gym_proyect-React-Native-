import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

let mockEscanear = null;
let mockPermiso = true;
const mockRequest = jest.fn(async () => mockPermiso);
jest.mock('react-native-vision-camera', () => {
  const R = require('react');
  const { View } = require('react-native');
  return {
    Camera: props => R.createElement(View, { testID: 'camara', ...props }),
    useCameraDevice: () => ({ id: 'back', hasTorch: true }),
    useCameraPermission: () => ({ hasPermission: mockPermiso, requestPermission: mockRequest }),
    useCodeScanner: cfg => { mockEscanear = cfg.onCodeScanned; return cfg; },
  };
});
jest.mock('react-native-qrcode-svg', () => {
  const R = require('react'); const { View } = require('react-native');
  return props => R.createElement(View, { testID: 'qr', qrValue: props.value });
});
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-safe-area-context', () => {
  const R = require('react'); const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => R.createElement(View, null, children),
    initialWindowMetrics: null,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('../store/rutinasSlice', () => ({ agregarRutina: r => ({ type: 'add', r }) }));
jest.mock('../helpers/avisos', () => ({ avisoExito: jest.fn() }));
const mockBuscar = jest.fn(async () => ({ name: 'Piernas', exercises: [], owner: { username: 'ana' } }));
jest.mock('../services/apiClient', () => ({
  apiJson: jest.fn(async (url) => {
    if (url === '/routine/share') return { data: { code: 'ABCD-EF23', expiresAt: '2026-11-28T00:00:00Z' } };
    return { data: await mockBuscar(url) };
  }),
}));

const { codigoDesdeQR, textoQR } = require('../services/rutinasCompartidas');
const ImportarRutina = require('../views/rutinas/importarRutina').default;
const CompartirRutina = require('../views/rutinas/compartirRutina').default;

const flush = () => act(async () => { await new Promise(r => setTimeout(r, 0)); });

test('formato del QR', () => {
  expect(textoQR('abcdef23')).toBe('RUTINA360:ABCD-EF23');
  expect(codigoDesdeQR('RUTINA360:ABCD-EF23')).toBe('ABCD-EF23');
  expect(codigoDesdeQR('rutina360:abcdef23')).toBe('ABCD-EF23');
  expect(codigoDesdeQR('ABCD-EF23')).toBe('ABCD-EF23');
  expect(codigoDesdeQR('https://google.com')).toBeNull();
  expect(codigoDesdeQR('RUTINA360:ABC')).toBeNull();
  expect(codigoDesdeQR('')).toBeNull();
});

test('compartir muestra el QR con el codigo', async () => {
  let r;
  await act(async () => { r = ReactTestRenderer.create(<CompartirRutina rutina={{ nombre: 'X', ejercicios: [] }} onClose={() => {}} />); });
  await flush();
  expect(r.root.findByProps({ testID: 'qr' }).props.qrValue).toBe('RUTINA360:ABCD-EF23');
});

test('importar: escanear un QR busca la rutina', async () => {
  let r;
  await act(async () => { r = ReactTestRenderer.create(<ImportarRutina onClose={() => {}} />); });
  const boton = r.root.findAll(n => n.props.accessibilityLabel === 'Escanear el código QR de la rutina' && n.props.onPress)[0];
  await act(async () => { boton.props.onPress(); });
  expect(r.root.findAllByProps({ testID: 'camara' }).length).toBeGreaterThan(0);

  // QR ajeno: avisa y sigue escaneando
  await act(async () => { mockEscanear([{ value: 'https://otra.cosa' }]); });
  expect(JSON.stringify(r.toJSON())).toContain('Ese QR no es de una rutina');
  expect(mockBuscar).not.toHaveBeenCalled();

  // QR valido (llamado dos veces: solo cuenta una)
  await act(async () => { mockEscanear([{ value: 'RUTINA360:ABCD-EF23' }]); mockEscanear([{ value: 'RUTINA360:ABCD-EF23' }]); });
  await flush();
  expect(mockBuscar).toHaveBeenCalledTimes(1);
  const txt = JSON.stringify(r.toJSON());
  expect(txt).toContain('Piernas');
  expect(r.root.findAllByProps({ testID: 'camara' }).length).toBe(0);
});

test('sin permiso de cámara muestra como habilitarlo', async () => {
  mockPermiso = false;
  const EscanerQR = require('../components/EscanerQR').default;
  let r;
  await act(async () => { r = ReactTestRenderer.create(<EscanerQR onLeido={() => {}} onCancelar={() => {}} />); });
  await flush();
  expect(JSON.stringify(r.toJSON())).toContain('Permitir la cámara');
  expect(mockRequest).toHaveBeenCalled();
});
