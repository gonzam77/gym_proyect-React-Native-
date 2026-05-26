import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import rootReducer from './rootReducer';

const usuarioTransform = createTransform(
  (inboundState, key) => {
    if (key !== 'usuario') return inboundState;

    return {
      ...inboundState,
      authInitializing: true,
      sesion: {
        ...inboundState.sesion,
        token: null,
      },
    };
  },
  (outboundState, key) => {
    if (key !== 'usuario') return outboundState;

    return {
      ...outboundState,
      authInitializing: true,
      sesion: {
        ...outboundState.sesion,
        token: null,
      },
    };
  },
  { whitelist: ['usuario'] }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['rutinas', 'usuario', 'notasHistoricas'],
  transforms: [usuarioTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
// AsyncStorage.clear();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    })
});

export const persistor = persistStore(store);
