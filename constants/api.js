const API_PRODUCCION = 'https://api-rutina360.devgm.com.ar';

/**
 * Servidor local para desarrollo.
 *
 * Poner USAR_SERVIDOR_LOCAL en true para que la app le pegue al servidor que
 * corre en la PC (`npm run dev:local` en rutina360_server). Solo tiene efecto en
 * modo desarrollo (__DEV__): un build de release (APK / Play / TestFlight)
 * siempre usa producción, aunque esto quede en true por error.
 *
 * Celular por USB o emulador: correr `npm run adb:local` (adb reverse) y dejar
 * localhost. Celular por Wi-Fi: usar la IP de la PC (ej. http://192.168.0.10:5000)
 * y levantar el servidor con HOST=0.0.0.0.
 */
const USAR_SERVIDOR_LOCAL = false;
const API_LOCAL = 'http://localhost:5000';

export const API_BASE_URL = __DEV__ && USAR_SERVIDOR_LOCAL ? API_LOCAL : API_PRODUCCION;

export const API_ENDPOINTS = {
  muscleGroups: '/muscleGroup',
  exercises: '/ejercice',
};
