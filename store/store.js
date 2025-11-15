import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['rutinas', 'usuario'],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: {
    app: persistedReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    })
});

export const persistor = persistStore(store);
