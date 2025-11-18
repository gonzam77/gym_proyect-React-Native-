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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "react-native-vector-icons/Ionicons";

import MisRutinas from './components/misRutinas';
import Login from './components/login';
import RutinasPredefinidas from './components/rutinasPredefiidas'


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
    Home: MisRutinas,
    Login: Login,
    Rutinas: RutinasPredefinidas
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
                  } else if (route.name === 'Rutinas') {
                    iconName = focused ? 'barbell' : 'barbell-outline'
                  } else if (route.name === 'Perfil')
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
                name='Perfil'
                component={Login}
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
                name='Rutinas'
                component={RutinasPredefinidas}
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
