import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './Screens/Login';
import Splash from './Screens/Splash';
import Home from './BottomTabScreens/Home';
import MapScreen from './BottomTabScreens/MapScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RateList from './BottomTabScreens/RateList';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const BottomTabScreen = () => {
    return (

      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: '#51a4e3',
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calculator-variant" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="RateList"
          component={RateList}
          options={{
            tabBarLabel: 'Rate List',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetag" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Travel"
          component={MapScreen}
          options={{
            tabBarLabel: 'Travel',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map-marker-path" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTabScreen"
          component={BottomTabScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
