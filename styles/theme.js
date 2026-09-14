import { Platform } from "react-native";

/** Escala de espaciado. Todo margin/padding nuevo sale de aca. */
export const espaciado = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/** Radios de borde. */
export const radios = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  completo: 999,
};

/** Escala tipografica. */
export const tipografia = {
  display: { fontSize: 32, fontWeight: "800" },
  titulo: { fontSize: 24, fontWeight: "800" },
  subtitulo: { fontSize: 20, fontWeight: "700" },
  cuerpoFuerte: { fontSize: 16, fontWeight: "700" },
  cuerpo: { fontSize: 16, fontWeight: "500" },
  auxiliar: { fontSize: 14, fontWeight: "600" },
  micro: { fontSize: 12, fontWeight: "700" },
};

/**
 * Area minima de toque recomendada (Material: 48dp, HIG: 44pt).
 * Se usa como minWidth/minHeight en botones chicos.
 */
export const toqueMinimo = 44;

/** Limite de escalado de fuente del sistema, para que no rompa el layout. */
export const maxEscalaFuente = 1.4;

const sombra = (elevacion, opacidad, radio) => Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Math.round(elevacion * 1.3) },
    shadowOpacity: opacidad,
    shadowRadius: radio,
  },
  android: {
    elevation: elevacion,
  },
});

export const sombras = {
  card: sombra(6, 0.2, 10),
  flotante: sombra(10, 0.3, 14),
  sutil: sombra(3, 0.15, 5),
};
