import {
  construirLineaDeTiempo,
  duracionTotal,
  esFuncional,
  formatearReloj,
  formatearSegundos,
  textoCambioDeFase,
  tipoRutina,
} from '../helpers/funcional';

const bloque = (nombre, trabajo, descanso) => ({
  id: nombre,
  ejercicio: { idEjercicio: 1, nombre },
  trabajoSegundos: trabajo,
  descansoSegundos: descanso,
});

// El ejemplo del documento: "Core express".
const coreExpress = {
  id: 'f1',
  tipo: 'funcional',
  nombre: 'Core express',
  vueltas: 3,
  descansoEntreVueltasSegundos: 60,
  modoPorDefecto: 'auto',
  bloques: [
    bloque('Plancha frontal', 45, 15),
    bloque('Crunch abdominal', 40, 20),
    bloque('Mountain climbers', 30, 30),
  ],
};

describe('tipo de rutina', () => {
  it('las rutinas viejas sin tipo se leen como fuerza', () => {
    expect(tipoRutina({ nombre: 'Pecho', ejercicios: [] })).toBe('fuerza');
    expect(esFuncional({ nombre: 'Pecho' })).toBe(false);
    expect(tipoRutina(undefined)).toBe('fuerza');
    expect(esFuncional(coreExpress)).toBe(true);
  });
});

describe('duracionTotal', () => {
  it('suma preparacion, trabajos, descansos y descansos entre vueltas, sin el descanso final', () => {
    // 5 + 3 x (45+15+40+20+30) + 2 x 60 = 575
    expect(duracionTotal(coreExpress)).toBe(575);
    expect(duracionTotal(coreExpress, { conPreparacion: false })).toBe(570);
  });

  it('con una vuelta ignora el descanso entre vueltas', () => {
    expect(duracionTotal({ ...coreExpress, vueltas: 1 })).toBe(5 + 45 + 15 + 40 + 20 + 30);
  });

  it('sin bloques dura 0', () => {
    expect(duracionTotal({ ...coreExpress, bloques: [] })).toBe(0);
  });
});

describe('construirLineaDeTiempo (Automatico)', () => {
  const fases = construirLineaDeTiempo(coreExpress);
  const tipos = fases.map(f => f.tipo);

  it('arranca con 5 s de preparacion', () => {
    expect(fases[0]).toEqual({ tipo: 'preparacion', vuelta: 1, bloque: 0, segundos: 5 });
  });

  it('el ultimo bloque de cada vuelta lleva el descanso entre vueltas en lugar del suyo', () => {
    expect(tipos.slice(0, 8)).toEqual([
      'preparacion', 'trabajo', 'descanso', 'trabajo', 'descanso', 'trabajo', 'descansoVueltas', 'trabajo',
    ]);
    const entreVueltas = fases.filter(f => f.tipo === 'descansoVueltas');
    expect(entreVueltas).toHaveLength(2);
    expect(entreVueltas.every(f => f.segundos === 60 && f.bloque === 2)).toBe(true);
  });

  it('en la ultima vuelta el ultimo bloque termina el entrenamiento', () => {
    const ultima = fases[fases.length - 1];
    expect(ultima).toEqual({ tipo: 'trabajo', vuelta: 3, bloque: 2, segundos: 30 });
  });

  it('un descanso en 0 no genera fase', () => {
    const sinDescanso = {
      ...coreExpress,
      vueltas: 1,
      bloques: [bloque('A', 30, 0), bloque('B', 30, 10)],
    };
    expect(construirLineaDeTiempo(sinDescanso).map(f => f.tipo)).toEqual(['preparacion', 'trabajo', 'trabajo']);
  });

  it('descanso entre vueltas en 0: pasa directo a la vuelta siguiente', () => {
    const sinEntreVueltas = { ...coreExpress, descansoEntreVueltasSegundos: 0 };
    const t = construirLineaDeTiempo(sinEntreVueltas).map(f => f.tipo);
    expect(t).not.toContain('descansoVueltas');
    expect(t.slice(5, 7)).toEqual(['trabajo', 'trabajo']);
  });
});

describe('construirLineaDeTiempo (Manual)', () => {
  const fases = construirLineaDeTiempo(coreExpress, { modo: 'manual' });

  it('cada trabajo salvo el primero espera el toque y tiene 3 s de preparacion', () => {
    expect(fases.slice(0, 6).map(f => f.tipo)).toEqual([
      'preparacion', 'trabajo', 'descanso', 'espera', 'preparacion', 'trabajo',
    ]);
    expect(fases[0].segundos).toBe(5);
    expect(fases[4].segundos).toBe(3);
    expect(fases[3].segundos).toBeNull();
    // 3 vueltas x 3 bloques = 9 trabajos; 8 esperas.
    expect(fases.filter(f => f.tipo === 'espera')).toHaveLength(8);
  });
});

describe('formatos', () => {
  it('reloj', () => {
    expect(formatearReloj(45)).toBe('0:45');
    expect(formatearReloj(750)).toBe('12:30');
    expect(formatearReloj(3900)).toBe('1:05:00');
  });

  it('segundos', () => {
    expect(formatearSegundos(0)).toBe('Sin descanso');
    expect(formatearSegundos(45)).toBe('45 s');
    expect(formatearSegundos(60)).toBe('1 min');
    expect(formatearSegundos(90)).toBe('1:30 min');
  });
});

describe('textoCambioDeFase', () => {
  const fases = construirLineaDeTiempo(coreExpress);

  it('avisa que sigue en cada descanso y al terminar', () => {
    expect(textoCambioDeFase(coreExpress, fases, { indice: 1 }).titulo).toBe('¡A trabajar! Plancha frontal');
    expect(textoCambioDeFase(coreExpress, fases, { indice: 2 }).titulo).toBe('Descanso — sigue Crunch abdominal');
    expect(textoCambioDeFase(coreExpress, fases, { tipo: 'fin' }).titulo).toBe('¡Terminaste!');
  });
});
