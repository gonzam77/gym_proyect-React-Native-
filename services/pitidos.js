import Sound from 'react-native-sound';

/**
 * Pitidos de la ejecucion de un funcional (3-2-1 y el largo del cambio de
 * fase). Salen de assets/sounds/beep.mp3: el corto es su primer pitido y el
 * largo, el ultimo.
 *
 * Suenan solo con la app en primer plano. En segundo plano avisa la
 * notificacion de cada cambio de fase (services/fasesFuncional.js), que tiene
 * el mismo pitido largo como sonido.
 */

// mixWithOthers: si el atleta tiene musica, el pitido suena encima sin cortarla.
Sound.setCategory('Playback', true);

let corto = null;
let largo = null;

const cargar = (archivo) =>
  new Sound(archivo, (error) => {
    if (error) {
      console.log('No se pudo cargar el pitido:', error?.message || error);
    }
  });

export const prepararPitidos = () => {
  if (!corto) {corto = cargar(require('../assets/sounds/pitido_corto.mp3'));}
  if (!largo) {largo = cargar(require('../assets/sounds/pitido_largo.mp3'));}
};

const reproducir = (sonido) => {
  if (!sonido) {return;}
  // stop() primero: si el anterior todavia suena, arranca de cero.
  sonido.stop(() => sonido.play());
};

export const pitidoCorto = () => reproducir(corto);
export const pitidoLargo = () => reproducir(largo);

export const liberarPitidos = () => {
  corto?.release();
  largo?.release();
  corto = null;
  largo = null;
};
