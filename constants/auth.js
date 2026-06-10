export { API_BASE_URL } from './api';

export const AUTH_ENDPOINTS = {
  login: "/users/auth",
  refresh: "/users/auth/refresh",
  logout: "/users/auth/logout",
  logoutAll: "/users/auth/logout-all",
};

export const REFRESH_TOKEN_KEYCHAIN_SERVICE = "com.rutina360.refreshToken";
