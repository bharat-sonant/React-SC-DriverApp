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

      // <Tab.Navigator
      //   screenOptions={({ route }) => ({
      //     headerShown: false,
      //     tabBarStyle: {
      //       height: 50,
      //     },
      //     tabBarIcon: ({ focused, size, colour }) => {
      //       let iconName;
      //       if (route.name === "Home") {
      //         iconName = focused ? "home" : "home-outline";
      //         size = focused ? size + 7 : size + 4;
      //       } else if (route.name === "Profile") {
      //         iconName = focused
      //           ? "person-circle-sharp"
      //           : "person-circle-outline";
      //         size = focused ? size + 11 : size + 8;
      //       } else if (route.name == "Complaints") {
      //         iconName = focused ? "md-person-sharp" : "person-outline";
      //         size = focused ? size + 7 : size + 2;
      //       }
      //       return <Ionic name={iconName} size={size} color={colour} />;
      //     },
      //   })}
      // >
      //   <Tab.Screen name="Home" component={Home} />
      //   <Tab.Screen name="Profile" component={Logout} />
      //   <Tab.Screen name="Complaints" component={MapScreen} />
      // </Tab.Navigator>






      // <Tab.Navigator
      //   screenOptions={{ headerShown: false, statusBarColor: "fade" }}
      // >
      //   <Tab.Screen name="Calculation" component={Home}
      //     options={{
      //       tabBarLabel: 'Calculation',
      //       tabBarIcon: ({ color, size }) => (
      //         // <Ionicons name="leftcircle" color={color} size={size} />
      //         <Ionicons name="calculator" size={size} color={color}></Ionicons>
      //       ),
      //     }}
      //   />
      //   <Tab.Screen name="Ratelist" component={Logout} options={{
      //     tabBarLabel: 'Rate List',
      //     tabBarIcon: ({ color, size }) => (

      //       <Ionicons name="pricetags" color={color} size={size} />
      //     ),
      //   }} />
      //   <Tab.Screen name="Travel" component={MapScreen} options={{
      //     tabBarLabel: 'Travel',
      //     tabBarIcon: ({ color, size }) => (
      //       <Ionicons name="navigate" color={color} size={size} />
      //     ),
      //   }} />
      // </Tab.Navigator>
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
