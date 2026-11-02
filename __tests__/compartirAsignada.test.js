import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

let mockOpciones = null;
let mockEstado = null;
jest.mock('../components/HojaAcciones', () => props => { mockOpciones = props.opciones; return null; });
jest.mock('../components/BarraProgreso', () => () => null);
jest.mock('../components/ListaOrdenable', () => () => null);
jest.mock('../components/PantallaModal', () => ({ children }) => children);
jest.mock('../views/rutinas/detalleEjercicio', () => () => null);
jest.mock('../views/rutinas/compartirRutina', () => () => null);
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: fn => fn(mockEstado),
}));
const mockApi = jest.fn();
jest.mock('../services/apiClient', () => ({ apiJson: (...a) => mockApi(...a) }));
jest.mock('../helpers/avisos', () => ({ avisoError: jest.fn(), avisoExito: jest.fn() }));

const { compartirRutina, esRutinaAsignada } = require('../services/rutinasCompartidas');
const DetalleRutina = require('../views/rutinas/detalleRutina').default;

const ejercicios = [{ id: 'e1', nombre: 'Sentadilla', series: 3, seriesRealizadas: 0, descansoSegundos: 60, ejercicio: { idEjercicio: 1, tiempoEjecucion: 40 } }];
const propia = { id: 'r1', nombre: 'Propia', ejercicios, estado: 0, tiempo: 0 };
const asignada = { ...propia, id: 'r2', nombre: 'Del coach', origen: 'asignada', idAsignacionBackend: 7, idRoutineBackend: 3 };

const textos = () => mockOpciones.map(o => o.texto);

const render = async rutina => {
  mockEstado = { rutinas: { rutinas: [rutina] } };
  await act(async () => {
    ReactTestRenderer.create(
      <DetalleRutina enLinea rutinaSeleccionada={rutina} setRutinaSeleccionada={() => {}} setModalFormRutina={() => {}} setModalDetalle={() => {}} />,
    );
  });
};

test('esRutinaAsignada', () => {
  expect(esRutinaAsignada(asignada)).toBe(true);
  expect(esRutinaAsignada({ idAsignacionBackend: 5 })).toBe(true);
  expect(esRutinaAsignada(propia)).toBe(false);
  expect(esRutinaAsignada({ ...propia, origen: 'compartida' })).toBe(false);
  expect(esRutinaAsignada(null)).toBe(false);
});

test('rutina propia: aparece Compartir', async () => {
  await render(propia);
  expect(textos()).toContain('Compartir rutina');
});

test('rutina asignada: no aparece Compartir', async () => {
  await render(asignada);
  expect(textos()).not.toContain('Compartir rutina');
  expect(textos()).toContain('Reiniciar series');
});

test('el servicio tampoco sube una rutina asignada', async () => {
  await expect(compartirRutina(asignada)).rejects.toThrow('no se pueden compartir');
  expect(mockApi).not.toHaveBeenCalled();
});
