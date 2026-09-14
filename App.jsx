import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

import { useEffect } from 'react';

import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import notifee, { EventType } from '@notifee/react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import MisRutinas from './views/rutinas/misRutinas';
import RutinasAsignadas from './views/rutinas/rutinasAsignadas';
import Perfil from './views/usuario/perfil';
import Notas from './views/notas/notas';
import Login from './views/usuario/login';
import StartupLoader from './components/StartupLoader';
import AvisosToast from './components/AvisosToast';
import { colores } from './styles/colores';
import { tipografia } from './styles/theme';
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

/** Tema de navegacion, para que no se vea el flash blanco entre pantallas. */
const temaNavegacion = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colores.principal,
    background: colores.fondo,
    card: colores.superficie,
    text: colores.textoPrimario,
    border: colores.bordeSuave,
    notification: colores.acento,
  },
};

const ICONOS_TABS = {
  MisRutinas: ['fitness', 'fitness-outline'],
  RutinasAsignadas: ['clipboard', 'clipboard-outline'],
  Notas: ['create', 'create-outline'],
  Perfil: ['person', 'person-outline'],
};

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
    return <StartupLoader message='Validando tu sesión...' />;
  }

  if (!token) {
    return <Login />;
  }

  return (
    <RootTabs.Navigator
      initialRouteName='MisRutinas'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [activo, inactivo] = ICONOS_TABS[route.name] || [];
          return <Ionicons name={focused ? activo : inactivo} size={size} color={color} />;
        },
        tabBarActiveTintColor: colores.principal,
        tabBarInactiveTintColor: colores.textoSecundario,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        headerTitleAlign: 'center',
        headerStyle: styles.header,
        headerShadowVisible: false,
        headerTintColor: colores.textoPrimario,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <RootTabs.Screen
        name='MisRutinas'
        component={MisRutinas}
        options={{
          tabBarLabel: 'Mis rutinas',
          // La pantalla ya trae su propio encabezado con el saludo; un header
          // del navegador arriba de eso serian dos titulos para lo mismo.
          headerShown: false,
        }}
      />
      <RootTabs.Screen
        name='RutinasAsignadas'
        component={RutinasAsignadas}
        options={{
          tabBarLabel: 'Asignadas',
          headerShown: false,
        }}
      />
      <RootTabs.Screen
        name='Notas'
        component={Notas}
        options={{
          tabBarLabel: 'Notas',
          headerTitle: 'Mis notas',
        }}
      />
      <RootTabs.Screen
        name='Perfil'
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          headerTitle: 'Mi perfil',
        }}
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
        <SafeAreaProvider>
          {/* Sin backgroundColor: con edge-to-edge (Android 15+) ese prop es
              no-op y ademas esta deprecado; el fondo lo pinta la pantalla. */}
          <StatusBar barStyle='light-content' translucent />
          <View style={styles.container}>
            <NavigationContainer theme={temaNavegacion}>
              <AppContent />
            </NavigationContainer>
          </View>
          <AvisosToast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  // Sin height ni paddingBottom a mano: bottom-tabs le suma el inset inferior
  // solo cuando no se le pisa la altura, y asi la barra no queda abajo de la
  // barra de navegacion del sistema.
  tabBar: {
    backgroundColor: colores.superficie,
    borderTopColor: colores.bordeSuave,
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  tabBarLabel: {
    ...tipografia.micro,
    marginBottom: 2,
  },
  header: {
    backgroundColor: colores.fondo,
  },
  headerTitle: {
    ...tipografia.subtitulo,
    color: colores.textoPrimario,
  },
});
