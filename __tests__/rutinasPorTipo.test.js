import reducer, {
  reubicarBloque,
  reubicarRutina,
  reubicarRutinaDelTipo,
  seleccionarFuncionales,
  seleccionarRutinasFuerza,
} from '../store/rutinasSlice';
import historialReducer, {
  corregirBloqueFuncional,
  registrarFuncional,
  registrarSerieHecha,
  registroCompleto,
} from '../store/historialSlice';

// Rutinas guardadas antes de esta version: no tienen tipo.
const vieja1 = { id: 'r1', nombre: 'Pecho', ejercicios: [] };
const vieja2 = { id: 'r2', nombre: 'Piernas', ejercicios: [] };
const func1 = { id: 'f1', tipo: 'funcional', nombre: 'Core', bloques: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
const func2 = { id: 'f2', tipo: 'funcional', nombre: 'HIIT', bloques: [] };

const estado = rutinas => ({ rutinas: { rutinas } });

describe('rutinas por tipo', () => {
  const todas = [vieja1, func1, vieja2, func2];

  it('las rutinas viejas sin tipo siguen en Rutinas y no aparecen en Funcional', () => {
    expect(seleccionarRutinasFuerza(estado(todas)).map(r => r.id)).toEqual(['r1', 'r2']);
    expect(seleccionarFuncionales(estado(todas)).map(r => r.id)).toEqual(['f1', 'f2']);
  });

  it('reordenar en una pestaña usa los indices visibles y no mueve las del otro tipo', () => {
    // En Rutinas se ve [Pecho, Piernas]: mover Piernas arriba.
    let s = reducer({ rutinas: todas }, reubicarRutinaDelTipo({ tipo: 'fuerza', desde: 1, hacia: 0 }));
    expect(s.rutinas.map(r => r.id)).toEqual(['r2', 'r1', 'f1', 'f2']);
    expect(seleccionarFuncionales(estado(s.rutinas)).map(r => r.id)).toEqual(['f1', 'f2']);

    s = reducer({ rutinas: todas }, reubicarRutinaDelTipo({ tipo: 'funcional', desde: 0, hacia: 1 }));
    expect(seleccionarFuncionales(estado(s.rutinas)).map(r => r.id)).toEqual(['f2', 'f1']);
    expect(seleccionarRutinasFuerza(estado(s.rutinas)).map(r => r.id)).toEqual(['r1', 'r2']);
  });

  it('sin funcionales, reordenar fuerza da lo mismo que antes', () => {
    const soloFuerza = [vieja1, vieja2, { id: 'r3', nombre: 'Espalda', ejercicios: [] }];
    const antes = reducer({ rutinas: soloFuerza }, reubicarRutina({ desde: 0, hacia: 2 }));
    const ahora = reducer({ rutinas: soloFuerza }, reubicarRutinaDelTipo({ tipo: 'fuerza', desde: 0, hacia: 2 }));
    expect(ahora.rutinas).toEqual(antes.rutinas);
  });

  it('reubica los bloques de un funcional', () => {
    const s = reducer({ rutinas: todas }, reubicarBloque({ idRutina: 'f1', desde: 2, hacia: 0 }));
    expect(s.rutinas.find(r => r.id === 'f1').bloques.map(b => b.id)).toEqual(['c', 'a', 'b']);
  });
});

describe('historial mezclado', () => {
  const registroFuncional = {
    tipo: 'funcional',
    idRutina: 'f1',
    nombreRutina: 'Core',
    modo: 'auto',
    vueltasObjetivo: 1,
    vueltasCompletadas: 1,
    segundosTotales: 95,
    iniciadoEn: '2026-11-02T10:00:00.000Z',
    terminadoEn: '2026-11-02T10:01:35.000Z',
    bloques: [
      { vuelta: 1, idEjercicio: 1001, nombreEjercicio: 'Plancha', segundosObjetivo: 45, segundosCumplidos: 45, estado: 'completo' },
      { vuelta: 1, idEjercicio: 1006, nombreEjercicio: 'Crunch', segundosObjetivo: 40, segundosCumplidos: 10, estado: 'parcial' },
    ],
  };

  it('guarda el funcional junto a las series de fuerza del dia', () => {
    let s = historialReducer(undefined, registrarSerieHecha({
      fecha: '2026-11-02',
      hechaEn: '2026-11-02T09:00:00.000Z',
      rutina: { id: 'r1', nombre: 'Pecho' },
      ejercicio: { id: 'e1', nombre: 'Press plano', series: 3, ejercicio: { idEjercicio: 1 } },
      numero: 1,
    }));
    s = historialReducer(s, registrarFuncional({ fecha: '2026-11-02', registro: registroFuncional }));

    expect(s.registros).toHaveLength(2);
    expect(s.registros[0].tipo).toBeUndefined();
    expect(s.registros[1]).toMatchObject({ tipo: 'funcional', fecha: '2026-11-02', segundosTotales: 95 });
    expect(registroCompleto(s.registros[0])).toBe(false);
    expect(registroCompleto(s.registros[1])).toBe(false);
  });

  it('corregir el tiempo cumplido recalcula el estado y el total', () => {
    let s = historialReducer(undefined, registrarFuncional({ fecha: '2026-11-02', registro: registroFuncional }));
    const id = s.registros[0].id;
    s = historialReducer(s, corregirBloqueFuncional({ idRegistro: id, indiceBloque: 1, segundosCumplidos: 40 }));
    expect(s.registros[0].bloques[1]).toMatchObject({ segundosCumplidos: 40, estado: 'completo' });
    expect(s.registros[0].segundosTotales).toBe(125);
    expect(registroCompleto(s.registros[0])).toBe(true);
  });
});
