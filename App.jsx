import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import InAppUpdates from 'react-native-in-app-updates';

import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

import { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

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
import { DESCANSO_CHANNEL_ID } from './helpers/notificationConstants';
import { bootstrapAuth, limpiarAuthLocal } from './services/authService';
import { setAccessTokenUpdateHandler, setGlobalAuthFailureHandler } from './services/apiClient';

const RootTabs = createBottomTabNavigator();

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop-alarm') {
    await notifee.cancelNotification(detail.notification?.id);
  }
});

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
    const prepararNotificaciones = async () => {
      await notifee.requestPermission();
      await notifee.createChannel({
        id: DESCANSO_CHANNEL_ID,
        name: 'Descanso',
        importance: AndroidImportance.HIGH,
        sound: 'alarm2',
        vibration: true,
        vibrationPattern: [300, 500, 300, 500],
        bypassDnd: true,
      });
    };

    const unsubscribeForeground = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop-alarm') {
        await notifee.cancelNotification(detail.notification?.id);
      }
    });

    prepararNotificaciones();
    return unsubscribeForeground;
  }, []);

  useEffect(() => {
    try {
      const inAppUpdates = new InAppUpdates(false);

      inAppUpdates.checkNeedsUpdate().then((result) => {
        if (result.shouldUpdate) {
          inAppUpdates.startUpdate({
            updateType: InAppUpdates.UPDATE_TYPE.IMMEDIATE,
          });
        }
      });
    } catch (error) {
      console.log('In-App Updates no disponible en desarrollo:', error);
    }
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
