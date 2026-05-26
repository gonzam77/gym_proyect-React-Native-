import { API_BASE_URL } from "../constants/auth";
import { getAccessToken, refreshAuthTokens } from "./authService";

let isRefreshing = false;
let refreshPromise = null;
let globalAuthFailureHandler = null;
let accessTokenUpdateHandler = null;

export const setGlobalAuthFailureHandler = (handler) => {
  globalAuthFailureHandler = handler;
};

export const setAccessTokenUpdateHandler = (handler) => {
  accessTokenUpdateHandler = handler;
};

const parsearJsonSeguro = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const hacerRefreshConLock = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshAuthTokens()
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiFetch = async (
  endpoint,
  options = {},
  config = {}
) => {
  const { requiresAuth = true, retryOn401 = true, onAuthFailure } = config;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAccessToken();
  if (requiresAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && requiresAuth && retryOn401) {
    try {
      const refreshed = await hacerRefreshConLock();
      const reintentoHeaders = {
        ...headers,
        Authorization: `Bearer ${refreshed.accessToken}`,
      };
      if (accessTokenUpdateHandler) {
        accessTokenUpdateHandler(refreshed.accessToken);
      }

      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: reintentoHeaders,
      });
    } catch (error) {
      if (onAuthFailure) {
        await onAuthFailure(error);
      } else if (globalAuthFailureHandler) {
        await globalAuthFailureHandler(error);
      }
      throw error;
    }
  }

  return response;
};

export const apiJson = async (endpoint, options = {}, config = {}) => {
  const response = await apiFetch(endpoint, options, config);
  const body = await parsearJsonSeguro(response);

  if (!response.ok) {
    throw new Error(body?.message || body?.error || "Error en la solicitud.");
  }

  return body;
};
