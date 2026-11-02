import {
  anterior,
  continuar,
  contarEstados,
  estadoEn,
  faseActual,
  iniciar,
  pausar,
  proximosCambios,
  reanudar,
  restanteMs,
  saltar,
  terminar,
} from '../helpers/sesionFuncional';

const bloque = (nombre, trabajo, descanso) => ({
  id: nombre,
  ejercicio: { idEjercicio: 1, nombre },
  trabajoSegundos: trabajo,
  descansoSegundos: descanso,
});

const coreExpress = {
  id: 'f1',
  tipo: 'funcional',
  nombre: 'Core express',
  vueltas: 3,
  descansoEntreVueltasSegundos: 60,
  bloques: [
    bloque('Plancha frontal', 45, 15),
    bloque('Crunch abdominal', 40, 20),
    bloque('Mountain climbers', 30, 30),
  ],
};

// Fases en Automatico: 0 prep 5 · 1 T(1,0) 45 · 2 D 15 · 3 T(1,1) 40 · 4 D 20 ·
// 5 T(1,2) 30 · 6 entre vueltas 60 · 7 T(2,0) ...
const T0 = 1_000_000;
const s = segundos => T0 + segundos * 1000;

describe('sesion en Automatico', () => {
  it('arranca en la preparacion con instantes absolutos', () => {
    const sesion = iniciar(coreExpress, 'auto', T0);
    expect(sesion.indice).toBe(0);
    expect(sesion.finFase).toBe(s(5));
    expect(restanteMs(sesion, s(2))).toBe(3000);
  });

  it('avanza sola por las fases vencidas (app congelada o cerrada)', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(51));
    expect(faseActual(sesion).tipo).toBe('descanso');
    expect(sesion.indice).toBe(2);
    // El descanso arranco cuando termino el trabajo, no cuando se miro.
    expect(sesion.inicioFase).toBe(s(50));
    expect(sesion.cumplidos['1-0']).toBe(45);
  });

  it('termina sola al final y el registro queda completo', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(1000));
    expect(sesion.terminada).toBe(true);
    expect(sesion.terminadaEn).toBe(s(575));

    const { registro } = terminar(sesion, s(1000));
    expect(registro.vueltasCompletadas).toBe(3);
    expect(registro.segundosTotales).toBe(575);
    expect(registro.bloques).toHaveLength(9);
    expect(contarEstados(registro.bloques)).toEqual({ completo: 9, parcial: 0, salteado: 0 });
  });
});

describe('pausar y reanudar', () => {
  it('la pausa congela la fase y al reanudar se corre el fin', () => {
    let sesion = iniciar(coreExpress, 'auto', T0);
    sesion = pausar(sesion, s(20)); // 15 s dentro del primer trabajo
    expect(estadoEn(sesion, s(200)).indice).toBe(1);
    expect(restanteMs(sesion, s(200))).toBe(30000);

    sesion = reanudar(sesion, s(100));
    expect(sesion.finFase).toBe(s(130));
    expect(sesion.msInactivo).toBe(80000);
    expect(proximosCambios(pausar(sesion, s(101)), s(101))).toEqual([]);
  });

  it('el tiempo en pausa no cuenta como entrenamiento', () => {
    let sesion = iniciar(coreExpress, 'auto', T0);
    sesion = pausar(sesion, s(20));
    sesion = reanudar(sesion, s(80));
    const { registro } = terminar(sesion, s(2000));
    expect(registro.segundosTotales).toBe(575);
  });
});

describe('saltar', () => {
  it('a mitad del trabajo deja el bloque parcial', () => {
    let sesion = iniciar(coreExpress, 'auto', T0);
    sesion = saltar(sesion, s(20)); // 15 s de 45
    expect(sesion.indice).toBe(2);
    expect(sesion.inicioFase).toBe(s(20));
    expect(sesion.cumplidos['1-0']).toBe(15);
  });

  it('sin hacer nada deja el bloque salteado', () => {
    let sesion = iniciar(coreExpress, 'auto', T0);
    sesion = saltar(sesion, s(1)); // saltea la preparacion
    expect(faseActual(sesion).tipo).toBe('trabajo');
    sesion = saltar(sesion, s(1)); // saltea el trabajo entero
    const { registro } = terminar(sesion, s(2));
    expect(registro.bloques[0]).toMatchObject({ estado: 'salteado', segundosCumplidos: 0 });
    expect(registro.vueltasCompletadas).toBe(0);
  });
});

describe('anterior', () => {
  it('en el trabajo de Y vuelve al inicio de Y-1', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(66)); // trabajo del bloque 2
    expect(sesion.indice).toBe(3);
    const atras = anterior(sesion, s(66));
    expect(atras.indice).toBe(1);
    expect(atras.finFase).toBe(s(66 + 45));
  });

  it('en el descanso posterior a Y vuelve al inicio de Y', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(55));
    expect(faseActual(sesion).tipo).toBe('descanso');
    expect(anterior(sesion, s(55)).indice).toBe(1);
  });

  it('en el primero de una vuelta va al ultimo de la vuelta anterior', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(5 + 150 + 60 + 1));
    expect(faseActual(sesion)).toMatchObject({ tipo: 'trabajo', vuelta: 2, bloque: 0 });
    expect(faseActual(anterior(sesion, s(216)))).toMatchObject({ tipo: 'trabajo', vuelta: 1, bloque: 2 });
  });

  it('en el primero de todos reinicia la preparacion', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(10));
    expect(anterior(sesion, s(10)).indice).toBe(0);
  });

  it('no pierde lo que ya estaba hecho al repetir un bloque', () => {
    let sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(66)); // bloque 1 completo
    sesion = anterior(sesion, s(66));
    sesion = saltar(sesion, s(70)); // repite 4 s y saltea
    expect(sesion.cumplidos['1-0']).toBe(45);
  });
});

describe('modo Manual', () => {
  it('se queda esperando el toque despues del descanso', () => {
    // prep 5 · T 45 · D 15 · espera · prep 3 · T 40 ...
    const sesion = estadoEn(iniciar(coreExpress, 'manual', T0), s(500));
    expect(faseActual(sesion).tipo).toBe('espera');
    expect(sesion.inicioFase).toBe(s(65));
    expect(restanteMs(sesion, s(500))).toBeNull();
  });

  it('Iniciar arranca 3 s de preparacion y el tiempo de espera no cuenta', () => {
    let sesion = estadoEn(iniciar(coreExpress, 'manual', T0), s(500));
    sesion = continuar(sesion, s(500));
    expect(faseActual(sesion)).toMatchObject({ tipo: 'preparacion', segundos: 3, bloque: 1 });
    expect(sesion.finFase).toBe(s(503));
    expect(sesion.msInactivo).toBe((500 - 65) * 1000);
  });

  it('solo programa avisos hasta el proximo punto de espera', () => {
    const cambios = proximosCambios(iniciar(coreExpress, 'manual', T0), T0);
    expect(cambios).toEqual([
      { en: s(5), indice: 1 },
      { en: s(50), indice: 2 },
      { en: s(65), indice: 3 },
    ]);
  });

  it('Anterior desde un trabajo vuelve a la preparacion del bloque anterior', () => {
    let sesion = estadoEn(iniciar(coreExpress, 'manual', T0), s(500));
    sesion = continuar(sesion, s(500));
    sesion = estadoEn(sesion, s(510)); // trabajo del bloque 2 de la vuelta 1
    expect(faseActual(sesion)).toMatchObject({ tipo: 'trabajo', bloque: 1 });
    // El bloque 1 es el primero de todo: no tiene preparacion propia de 3 s.
    expect(faseActual(anterior(sesion, s(510)))).toMatchObject({ tipo: 'trabajo', bloque: 0 });
  });
});

describe('proximosCambios en Automatico', () => {
  it('programa todos los cambios hasta el final', () => {
    const sesion = iniciar(coreExpress, 'auto', T0);
    const cambios = proximosCambios(sesion, T0);
    expect(cambios[0]).toEqual({ en: s(5), indice: 1 });
    expect(cambios[cambios.length - 1]).toEqual({ en: s(575), tipo: 'fin' });
    expect(cambios).toHaveLength(sesion.fases.length);
  });

  it('respeta el maximo (iOS)', () => {
    expect(proximosCambios(iniciar(coreExpress, 'auto', T0), T0, 4)).toHaveLength(4);
  });
});

describe('terminar antes', () => {
  it('guarda lo hecho y deja afuera lo que no se llego a hacer', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(110)); // descanso tras el bloque 2
    expect(faseActual(sesion).tipo).toBe('descanso');
    const { registro } = terminar(sesion, s(110));
    expect(registro.bloques.map(b => b.estado)).toEqual(['completo', 'completo']);
    expect(registro.vueltasCompletadas).toBe(0);
    expect(registro.segundosTotales).toBe(110);
  });

  it('a mitad de un trabajo lo deja parcial', () => {
    const sesion = estadoEn(iniciar(coreExpress, 'auto', T0), s(20));
    const { registro } = terminar(sesion, s(20));
    expect(registro.bloques).toEqual([
      expect.objectContaining({ segundosCumplidos: 15, segundosObjetivo: 45, estado: 'parcial' }),
    ]);
  });
});
