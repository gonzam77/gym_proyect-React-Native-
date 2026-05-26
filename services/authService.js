import { API_BASE_URL, AUTH_ENDPOINTS } from "../constants/auth";
import {
  guardarRefreshTokenSeguro,
  obtenerRefreshTokenSeguro,
  limpiarRefreshTokenSeguro,
} from "./secureTokenStorage";

let accessTokenMemoria = null;

export const getAccessToken = () => accessTokenMemoria;
export const setAccessToken = (token) => {
  accessTokenMemoria = token || null;
};

export const limpiarAuthLocal = async () => {
  accessTokenMemoria = null;
  await limpiarRefreshTokenSeguro();
};

const parsearJsonSeguro = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const loginAuth = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await parsearJsonSeguro(response);
  const data = body?.data || {};
  const accessToken = data?.accessToken || data?.token;
  const refreshToken = data?.refreshToken;
  const user = data?.user;

  if (!response.ok || !accessToken || !refreshToken || !user) {
    throw new Error(body?.message || body?.error || "No se pudo iniciar sesion.");
  }

  setAccessToken(accessToken);
  await guardarRefreshTokenSeguro(refreshToken);

  return { accessToken, refreshToken, user };
};

export const refreshAuthTokens = async () => {
  const refreshTokenActual = await obtenerRefreshTokenSeguro();
  if (!refreshTokenActual) {
    throw new Error("No hay refresh token almacenado.");
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refreshTokenActual }),
  });

  const body = await parsearJsonSeguro(response);
  const data = body?.data || {};
  const nuevoAccessToken = data?.accessToken || data?.token;
  const nuevoRefreshToken = data?.refreshToken;

  if (!response.ok || !nuevoAccessToken || !nuevoRefreshToken) {
    throw new Error(body?.message || body?.error || "No se pudo refrescar la sesion.");
  }

  try {
    await guardarRefreshTokenSeguro(nuevoRefreshToken);
  } catch {
    await limpiarAuthLocal();
    throw new Error("No se pudo persistir el refresh token rotado.");
  }

  setAccessToken(nuevoAccessToken);
  return { accessToken: nuevoAccessToken, refreshToken: nuevoRefreshToken };
};

export const bootstrapAuth = async () => {
  const refreshToken = await obtenerRefreshTokenSeguro();
  if (!refreshToken) {
    return null;
  }

  return refreshAuthTokens();
};

export const logoutAuth = async () => {
  const refreshToken = await obtenerRefreshTokenSeguro();
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.logout}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // La limpieza local se hace siempre por UX y seguridad.
    }
  }

  await limpiarAuthLocal();
};

export const logoutAllAuth = async () => {
  const token = getAccessToken();

  if (token) {
    try {
      await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.logoutAll}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // La limpieza local se hace siempre por UX y seguridad.
    }
  }

  await limpiarAuthLocal();
};
