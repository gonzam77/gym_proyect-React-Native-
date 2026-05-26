import * as Keychain from "react-native-keychain";
import { REFRESH_TOKEN_KEYCHAIN_SERVICE } from "../constants/auth";

const KEYCHAIN_USERNAME = "refreshToken";

export const guardarRefreshTokenSeguro = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token invalido.");
  }

  await Keychain.setGenericPassword(KEYCHAIN_USERNAME, refreshToken, {
    service: REFRESH_TOKEN_KEYCHAIN_SERVICE,
  });
};

export const obtenerRefreshTokenSeguro = async () => {
  const creds = await Keychain.getGenericPassword({
    service: REFRESH_TOKEN_KEYCHAIN_SERVICE,
  });

  if (!creds) {
    return null;
  }

  return creds.password || null;
};

export const limpiarRefreshTokenSeguro = async () => {
  await Keychain.resetGenericPassword({
    service: REFRESH_TOKEN_KEYCHAIN_SERVICE,
  });
};
