import {
  SafeAreaView,
  StyleSheet,
  ImageBackground
} from 'react-native';

import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

import {  NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "react-native-vector-icons/Ionicons";

import MisRutinas from './views/rutinas/misRutinas';
import Usuario from './views/usuario/usuario';
import Notas from './views/notas/notas';


PushNotification.configure({
  onNotification: function (notification) {
    console.log("Notificación recibida:", notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: "descanso-channel",
    channelName: "Notificaciones de Descanso",
    importance: 4,
    vibrate: true,
    soundName: 'default',
    playSound: true,
  },
  (created) => console.log(`Canal creado: ${created}`)
);

const RootTabs = createBottomTabNavigator({
  screens: {
    Usuario: Usuario,
    Home: MisRutinas,
    Notas: Notas
  },
});


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ImageBackground
          source={require('./assets/img/fondo.png')}
          style={styles.fondo}
          resizeMode=""
        >
          
          <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <RootTabs.Navigator
              initialRouteName='MisRutinas'
              screenOptions={({route})=>({
                tabBarIcon:({focused,color, size})=>{
                  let iconName;
                  if(route.name === 'MisRutinas'){
                    iconName = focused ? 'fitness' : 'fitness-outline'
                  } else if (route.name === 'Notas') {
                    iconName = focused ? 'create' : 'create-outline'
                  } else if (route.name === 'Usuario')
                  iconName = focused ? 'person' : 'person-outline'
                  return <Ionicons name={iconName} size={size} color={color}/>
                },
                headerTitleAlign:'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
              })}
            >
              <RootTabs.Screen
                name='Usuario'
                component={Usuario}
                />
              <RootTabs.Screen
                name='MisRutinas'
                component={MisRutinas}
                options={{
                  tabBarLabel:'Mis Rutinas',
                  headerTitle: 'Mis Rutinas',
                  headerTitleAlign:'center',
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
          </NavigationContainer>
          </SafeAreaView>
        </ImageBackground>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  titulo: {
    textAlign: 'center',
    color: 'green',
  },
});
