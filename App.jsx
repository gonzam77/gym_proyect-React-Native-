import {
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

import { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import notifee, { EventType } from '@notifee/react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import MisRutinas from './views/rutinas/misRutinas';
import RutinasAsignadas from './views/rutinas/rutinasAsignadas';
import Perfil from './views/usuario/perfil';
import Notas from './views/notas/notas';
import Login from './views/usuario/login';
import StartupLoader from './components/StartupLoader';
import { colores } from './styles/colores';
import { cargarUsuarioBackup, guardarUsuarioBackup, mapearUsuarioBackendALocal } from './helpers/usuarioBackup';
import { cerrarSesion, guardarSesion, guardarUsuario, limpiarUsuario, setAuthInitializing } from './store/usuarioSlice';
import { bootstrapAuth, limpiarAuthLocal } from './services/authService';
import { setAccessTokenUpdateHandler, setGlobalAuthFailureHandler } from './services/apiClient';
import { DESCANSO_PROGRESO_ID } from './helpers/notificationConstants';
import {
  cancelarDescanso,
  esNotificacionDeDescanso,
  prepararNotificacionesDescanso,
} from './services/descansoAlarma';

const RootTabs = createBottomTabNavigator();

/**
 * Handler unico de eventos de notificacion.
 *
 * Cancela la alarma del descanso por id fijo, sin depender de que el modal de
 * descanso siga montado: cuando la alarma suena con la app cerrada, Android
 * levanta este handler en headless JS y desde aca se puede apagar.
 */
const manejarEventoNotificacion = async ({ type, detail }) => {
  const idNotificacion = detail?.notification?.id;
  const idAccion = detail?.pressAction?.id;

  if (!esNotificacionDeDescanso(idNotificacion, idAccion)) {
    return;
  }

  // Tocar la notificacion, DETENER o Saltar terminan el descanso.
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    await cancelarDescanso();
    return;
  }

  // Descartar la cuenta regresiva solo saca esa notificacion de la barra; la
  // alarma sigue en pie. Solo descartar la alarma misma la apaga.
  if (type === EventType.DISMISSED && idNotificacion !== DESCANSO_PROGRESO_ID) {
    await cancelarDescanso();
  }
};

notifee.onBackgroundEvent(manejarEventoNotificacion);

const AppContent = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.sesion?.token);
  const usuarioSesion = useSelector(state => state.usuario.sesion?.user);
  const usuarioLocal = useSelector(state => state.usuario.usuario);
  const authInitializing = useSelector(state => state.usuario.authInitializing);

  useEffect(() => {
    const bootstrapSesion = async () => {
      dispatch(setAuthInitializing(true));
      try {
        const refresh = await bootstrapAuth();
        if (refresh?.accessToken) {
          dispatch(guardarSesion({
            token: refresh.accessToken,
            user: usuarioSesion || null,
          }));
        } else {
          dispatch(cerrarSesion());
        }
      } catch {
        await limpiarAuthLocal();
        dispatch(cerrarSesion());
        dispatch(limpiarUsuario());
      } finally {
        dispatch(setAuthInitializing(false));
      }
    };

    bootstrapSesion();
  }, [dispatch]);

  useEffect(() => {
    setGlobalAuthFailureHandler(async () => {
      await limpiarAuthLocal();
      dispatch(cerrarSesion());
      dispatch(limpiarUsuario());
    });
    setAccessTokenUpdateHandler((nuevoAccessToken) => {
      dispatch(guardarSesion({
        token: nuevoAccessToken,
        user: store.getState().usuario.sesion?.user || null,
      }));
    });
  }, [dispatch]);

  useEffect(() => {
    const restaurarUsuario = async () => {
      const tieneUsuarioLocal = usuarioLocal && Object.keys(usuarioLocal).length > 0;

      if (tieneUsuarioLocal) {
        return;
      }

      if (usuarioSesion?.id) {
        const usuarioMapeado = mapearUsuarioBackendALocal(usuarioSesion);
        dispatch(guardarUsuario(usuarioMapeado));
        await guardarUsuarioBackup(usuarioMapeado);
        return;
      }

      const usuarioBackup = await cargarUsuarioBackup();
      if (usuarioBackup && Object.keys(usuarioBackup).length > 0) {
        dispatch(guardarUsuario(usuarioBackup));
      }
    };

    restaurarUsuario();
  }, [dispatch, usuarioLocal, usuarioSesion]);

  if (authInitializing) {
    return <StartupLoader message='Validando sesion...' />;
  }

  if (!token) {
    return <Login />;
  }

  return (
    <RootTabs.Navigator
      initialRouteName='MisRutinas'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'MisRutinas') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'RutinasAsignadas') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Notas') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colores.azulProfundo,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <RootTabs.Screen
        name='Perfil'
        component={Perfil}
      />
      <RootTabs.Screen
        name='MisRutinas'
        component={MisRutinas}
        options={{
          tabBarLabel: 'Mis Rutinas',
          headerTitle: 'Mis Rutinas',
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

        }}
      />
      <RootTabs.Screen
        name='RutinasAsignadas'
        component={RutinasAsignadas}
        options={{
          tabBarLabel: 'Asignadas',
          headerTitle: 'Rutinas Asignadas',
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <RootTabs.Screen
        name='Notas'
        component={Notas}
      />
    </RootTabs.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    const unsubscribeForeground = notifee.onForegroundEvent(manejarEventoNotificacion);

    prepararNotificacionesDescanso();
    return unsubscribeForeground;
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const verificarActualizacion = async () => {
      try {
        await checkForUpdate(UpdateFlow.IMMEDIATE);
      } catch (error) {
        console.log('In-App Updates no disponible:', error?.message || error);
      }
    };

    verificarActualizacion();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<StartupLoader message='Preparando tu app...' />} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
