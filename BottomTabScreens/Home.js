import { ActivityIndicator, Alert, PermissionsAndroid, StyleSheet, Text, View, Linking, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useBackHandler } from '@react-native-community/hooks';
import Geolocation from '@react-native-community/geolocation';
// import BackgroundTimer from 'react-native-background-timer';
import BackgroundService from 'react-native-background-actions';

const Home = () => {
  const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
  const LOCATION_TRACKING = 'location-tracking';
  const [loginUserNumber, setLoginUserNumber] = useState("");
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [show, setShow] = useState(false);
  const webviewRef = useRef();
  const [location, setLocation] = useState(false);
  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const [locationNew, setLocationNew] = useState({
    latitude: 0,
    longitude: 0,
  });
  useEffect(() => {
    const veryIntensiveTask = async (taskDataArguments) => {
      // Example of an infinite loop task
      const { delay } = taskDataArguments;
      await new Promise( async (resolve) => {
          for (let i = 0; BackgroundService.isRunning(); i++) {
              console.log(i);
              await sleep(delay);
          }
      });
  };
  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 1000,
    },
};
    Geolocation.getCurrentPosition(data => setLatitude(data.coords.latitude));
    Geolocation.getCurrentPosition(data => setLongitude(data.coords.longitude));
    getLocalData();
    locationPermission();
    // timerTask();
  }, []);
  const timerTask = () => {
    // console.log("hey125");
    // BackgroundTimer.runBackgroundTimer(() => {
      Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setLocationNew({
            latitude: latitude,
            longitude: longitude,
          });
        },
        error => {
          console.log(`Error: ${error.message}`);
        },
        {
          enableHighAccuracy: false,
          timeout: 1000,
          maximumAge: 0,
          distanceFilter: 1, // set the minimum distance in meters that should trigger a position update
          interval: 3000// set the time interval in milliseconds for updating the position
        }
      );
    // },
    //   1000);
    //rest of code will be performing for iOS on background too

    // BackgroundTimer.stopBackgroundTimer();
  }
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      console.warn(err);
    }
  };

  const locationPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location Permission Granted.');
      } else if (result === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Location Permission Denied.');
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Location Permission Denied with Never Ask Again.');
        Alert.alert(
          'Location Permission Required',
          'App needs access to your Location to read files. Please go to app settings and grant permission.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ],
        );
      }
    } catch (err) {
      console.log(err);
    }

  }
  const checkLocationPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;

    const status = await check(permission);
    console.log(status);
    if (status === 'granted') {
      console.log('Location permission granted');
    } else if (status === 'denied') {
      Alert.alert(
        'Location Permission Required',
        'Please enable location services in your device settings to use this feature.',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              const result = await request(permission);
              if (result === 'granted') {
                console.log('Location permission granted');
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  };


  function BackHandler() {
    Alert.alert("", "Are you sure to exit the Application", [{
      text: 'No',
      onPress: () => null,
      style: 'cancel'
    }, {
      text: 'Yes',
      onPress: () => BackHandler.exitApp(),
    }]);
    return true;
  }
  useBackHandler(BackHandler);

  function sendDataToWebView() {
    if (webviewRef.current && webViewLoaded) {
      console.log("hey");
      webviewRef.current.postMessage('Data from React Native App', '*');
    }
  }


  const getLocalData = async () => {
    setShow(true)
    const number = await AsyncStorage.getItem("userNumber");
    setLoginUserNumber(number);
    setWebViewLoaded(true);
  }

  const handleWebViewLoad = () => {
    setWebViewLoaded(true);
    setShow(false); // set show to false once webview is loaded
  };


  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'black' }}>Latitude: {locationNew.latitude}</Text>
        <Text style={{ color: 'black' }}>Longitude: {locationNew.longitude}</Text>
      </View>

      <ActivityIndicator style={styles.ActivityIndicatorLayout} size={"large"} animating={show} color={'black'} />
      {
        webViewLoaded && loginUserNumber && (
          <WebView
            ref={webviewRef}
            source={{ uri: "https://webviewpages.web.app/firstscreen" }}
            style={{ flex: 1 }}
            scalesPageToFit={true}
            onLoad={handleWebViewLoad}
          />
        )
      }
    </View >
  )
}

export default Home

const styles = StyleSheet.create({
  ActivityIndicatorLayout: {
    position: 'absolute',
    left: "45%",
    top: "30%",
    zIndex: 1
  }
})
