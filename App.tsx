import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login';
import CalculationScreen from './Screens/CalculationScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './BottomTabScreens/Home';
import LogOut from './BottomTabScreens/logOut';
import Splash from './Screens/Splash';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function App() {
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 50,
          },
          tabBarIcon: ({ focused, size, color }: { focused: boolean, size: number, color: string }) => {
            // let iconName = 'home-outline'; // default value
            // if (route.name === "Home") {
            //   iconName = focused ? "home" : "home-outline";
            //   size = focused ? size + 8 : size + 8;
            // } else if (route.name === "Location") {
            //   iconName = focused ? "person-circle-sharp" : "person-circle-outline";
            //   size = focused ? size + 8 : size + 8;
            // }
            // return <Icon name={iconName} size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{tabBarLabelStyle: { fontSize: 15,marginBottom:10,fontWeight:'800' }}} />
        <Tab.Screen name="LogOut" component={LogOut} options={{tabBarLabelStyle: { fontSize: 15, marginBottom:10,fontWeight:'800' }}} />

      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name='Splash' component={Splash} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="CalculationScreen" component={CalculationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTabScreen" component={BottomTabScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;