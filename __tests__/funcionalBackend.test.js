jest.mock('../services/apiClient', () => ({ apiJson: jest.fn() }));

import {
  construirHuellaFuncional,
  convertirAsignacionFuncional,
  esAsignacionFuncional,
} from '../helpers/funcionalBackend';
import { convertirCompartidaEnRutinaLocal } from '../services/rutinasCompartidas';
import { duracionTotal } from '../helpers/funcional';

const asignacion = {
  id: 7,
  isActive: true,
  Routine: {
    id: 11,
    name: 'Core express',
    kind: 'functional',
    rounds: 3,
    roundRestSeconds: 60,
    defaultMode: 'manual',
    Routine_Ejercices: [
      // Llegan desordenados a proposito: manda position.
      { id: 32, position: 2, workSeconds: 40, restSeconds: 20, comments: '', Ejercice: { id: 1006, name: 'Crunch abdominal', MuscleGroup: { name: 'Core' } } },
      { id: 31, position: 1, workSeconds: 45, restSeconds: 15, comments: 'Glúteos apretados', Ejercice: { id: 1001, name: 'Plancha frontal', MuscleGroup: { name: 'Core' } } },
      { id: 33, position: 3, workSeconds: 30, restSeconds: 0, comments: '', Ejercice: { id: 1021, name: 'Mountain climbers', MuscleGroup: { name: 'Cardio' } } },
    ],
  },
};

describe('asignaciones funcionales', () => {
  it('reconoce un funcional por kind', () => {
    expect(esAsignacionFuncional(asignacion)).toBe(true);
    expect(esAsignacionFuncional({ Routine: { kind: 'strength' } })).toBe(false);
    expect(esAsignacionFuncional({ Routine: {} })).toBe(false);
  });

  it('convierte la asignacion en un funcional local en el orden del coach', () => {
    const local = convertirAsignacionFuncional(asignacion);
    expect(local).toMatchObject({
      tipo: 'funcional',
      origen: 'asignada',
      idAsignacionBackend: 7,
      idRoutineBackend: 11,
      nombre: 'Core express',
      vueltas: 3,
      descansoEntreVueltasSegundos: 60,
      modoPorDefecto: 'manual',
      tieneCambiosAsignados: false,
    });
    expect(local.bloques.map(b => b.ejercicio.nombre)).toEqual([
      'Plancha frontal', 'Crunch abdominal', 'Mountain climbers',
    ]);
    expect(local.bloques[0]).toMatchObject({
      idBackend: 31,
      trabajoSegundos: 45,
      descansoSegundos: 15,
      nota: 'Glúteos apretados',
      ejercicio: { idEjercicio: 1001, categoria: 'core' },
    });
    expect(local.tiempo).toBe(duracionTotal(local));
  });

  it('la huella cambia si el coach toca un tiempo, y no si cambia el orden de llegada', () => {
    const huella = construirHuellaFuncional(asignacion);
    const reordenada = {
      ...asignacion,
      Routine: { ...asignacion.Routine, Routine_Ejercices: [...asignacion.Routine.Routine_Ejercices].reverse() },
    };
    expect(construirHuellaFuncional(reordenada)).toBe(huella);

    const modificada = JSON.parse(JSON.stringify(asignacion));
    modificada.Routine.Routine_Ejercices[0].workSeconds = 50;
    expect(construirHuellaFuncional(modificada)).not.toBe(huella);

    const otraVuelta = JSON.parse(JSON.stringify(asignacion));
    otraVuelta.Routine.rounds = 4;
    expect(construirHuellaFuncional(otraVuelta)).not.toBe(huella);
  });
});

describe('rutinas compartidas', () => {
  it('un funcional compartido se importa como funcional', () => {
    const local = convertirCompartidaEnRutinaLocal({
      name: 'Core express',
      kind: 'functional',
      rounds: 2,
      roundRestSeconds: 30,
      defaultMode: 'auto',
      exercises: [{ idEjercice: 1001, name: 'Plancha frontal', category: 'core', workSeconds: 45, restSeconds: 0, note: '' }],
      owner: { username: 'ana' },
    });
    expect(local).toMatchObject({
      tipo: 'funcional',
      origen: 'compartida',
      compartidaPor: 'ana',
      vueltas: 2,
      descansoEntreVueltasSegundos: 30,
    });
    expect(local.bloques[0]).toMatchObject({ trabajoSegundos: 45, descansoSegundos: 0 });
  });

  it('una rutina de fuerza compartida sigue igual que antes (sin tipo)', () => {
    const local = convertirCompartidaEnRutinaLocal({
      name: 'Pecho',
      exercises: [{ idEjercice: 1, name: 'Press plano', category: 'pecho', series: 4, restSeconds: 90, executionSeconds: 45 }],
    });
    expect(local.tipo).toBeUndefined();
    expect(local.ejercicios[0]).toMatchObject({ series: 4, descansoSegundos: 90 });
  });
});
