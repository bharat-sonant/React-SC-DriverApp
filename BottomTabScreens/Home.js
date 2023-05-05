import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Linking,
  Button,
  AppState,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useBackHandler} from '@react-native-community/hooks';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';
import {get, ref, set, update} from 'firebase/database';
import {database} from '../Firebase';
import RNAndroidSettingsTool from 'react-native-android-settings-tool';
import moment from 'moment';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const latLngArr = [];
let time = moment().format('hh:mm');
const Home = ({route, driverId}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
  const LOCATION_TRACKING = 'location-tracking';
  const [loginUserNumber, setLoginUserNumber] = useState('');
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [show, setShow] = useState(false);
  const webviewRef = useRef();
  const [driverID, setDriverId] = useState('');
  const [count, setCount] = useState(0);
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;

  async function startBackgroundService() {
    await BackgroundService.start(veryIntensiveTask, options);
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('driverId');
      if (value !== null) {
        setDriverId(value);
        requestForPermission();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
    // const subscription = AppState.addEventListener('change', nextAppState => {
    //   if (
    //     appState.current.match(/inactive|background/) &&
    //     nextAppState === 'active'
    //   ) {
    //     BackgroundService.stop();
    //     console.log('App has come to the foreground!');
    //   } else {
    //     startBackgroundService();
    //     console.log('App has come to the background!');
    //   }

    //   appState.current = nextAppState;
    //   setAppStateVisible(appState.current);
    //   console.log('AppState', appState.current);
    // });

    // return () => {
    //   subscription.remove();
    // };
  }, []);

  const requestForPermission = async () => {
    const allLocation = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    ]).then(result => {
      if (
        result['android.permission.ACCESS_COARSE_LOCATION'] &&
        result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'granted'
      ) {
        console.log('granted');
        fetchLocation();
      } else if (
        result['android.permission.ACCESS_COARSE_LOCATION'] &&
        result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
          'never_ask_again'
      ) {
        console.log('never_ask_again');
      } else if (
        result['android.permission.ACCESS_COARSE_LOCATION'] &&
        result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'denied'
      ) {
        console.log('denied');
      }
    });
  };

  const fetchLocation = () => {
    const timeInterId = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          clearInterval(timeInterId);
          // let latitude = position.coords.latitude;
          // let longitude = position.coords.longitude;
          // sendDataToDatabase(latitude, longitude);
          setInterval(() => {
            let latitude = parseFloat(position.coords.latitude);
            let longitude = parseFloat(position.coords.longitude);
            sendDataToDatabase(latitude, longitude);
          }, 2000);
        },
        error => {
          if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
            try {
              console.log(error.code);
              RNAndroidSettingsTool.ACTION_LOCATION_SOURCE_SETTINGS();
            } catch (error) {
              console.log('Settings: ', error);
            }
          }
          console.log(error);
        },
      );
    }, 1000);
  };

  // useEffect(() => {
  //   // requestLocationPermission();
  //   // locationPermission();
  //   // startBackgroundService();
  //   // getLocalData();
  //   // registerBackgroundTask()
  // }, []);
  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        Geolocation.getCurrentPosition(
          position => {
            let latitude = parseFloat(position.coords.latitude);
            let longitude = parseFloat(position.coords.longitude);
            sendDataToDatabase(latitude, longitude);
          },
          error => {
            console.log(error.code, error.message);
          },
        );
        await sleep(delay);
      }
    });
  };
  const options = {
    taskName: 'Background',
    taskTitle: 'Background Services',
    taskDesc: 'Fetching Latitude Logitude',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    parameters: {
      delay: 2000,
    },
  };

  function sendDataToDatabase(latitude, longitude) {
    let date = moment(new Date()).format('yyyy-MM-DD');
    let month = moment().format('MMMM');
    let year = moment().format('YYYY');
    let hour = moment().format('hh:mm');

    let latlng = '(' + latitude + ',' + longitude + ')';
    if (time === hour) {
      latLngArr.push(latlng);
    } else {
      latLngArr.length = 0;
      time = hour;
      latLngArr.push(latlng);
    }
    console.log(latlng);
    set(
      ref(
        database,
        'TravelPath/' +
          driverID +
          '/' +
          year +
          '/' +
          month +
          '/' +
          date +
          '/' +
          hour,
      ),
      {
        latlng: latLngArr.toString(),
      },
    );
  }

  // const locationPermission = async () => {
  //   try {
  //     const result = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  //       {
  //         title: 'Geolocation Permission',
  //         message: 'Can we access your location?',
  //         buttonNeutral: 'NEVER_ASK_AGAIN',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (result === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('Location Permission Granted.');
  //     } else if (result === PermissionsAndroid.RESULTS.DENIED) {
  //       console.log('Location Permission Denied.');
  //     } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //       console.log('Location Permission Denied with Never Ask Again.');
  //       Alert.alert(
  //         'Location Permission Required',
  //         'App needs access to your Location to read files. Please go to app settings and grant permission.',
  //         [
  //           {text: 'Cancel', style: 'cancel'},
  //           {text: 'Open Settings', onPress: openSettings},
  //         ],
  //         {cancelable: false},
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const checkLocationPermission = async () => {
  //   const permission =
  //     Platform.OS === 'ios'
  //       ? PERMISSIONS.IOS.LOCATION_ALWAYS
  //       : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;

  //   const status = await check(permission);
  //   console.log(status);
  //   if (status === 'granted') {
  //     console.log('Location permission granted');
  //   } else if (status === 'denied') {
  //     Alert.alert(
  //       'Location Permission Required',
  //       'Please enable location services in your device settings to use this feature.',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => console.log('Cancel Pressed'),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'OK',
  //           onPress: async () => {
  //             const result = await request(permission);
  //             if (result === 'granted') {
  //               console.log('Location permission granted');
  //             }
  //           },
  //         },
  //       ],
  //       {cancelable: false},
  //     );
  //   }
  // };

  // function BackHandler() {
  //   Alert.alert('', 'Are you sure to exit the Application', [
  //     {
  //       text: 'No',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'Yes',
  //       onPress: () => BackHandler.exitApp(),
  //     },
  //   ]);
  //   return true;
  // }
  // useBackHandler(BackHandler);

  // function sendDataToWebView() {
  //   if (webviewRef.current && webViewLoaded) {
  //     console.log('hey');
  //     webviewRef.current.postMessage('Data from React Native App', '*');
  //   }
  // }

  // const getLocalData = async () => {
  //   setShow(true);
  //   const number = await AsyncStorage.getItem('userNumber');
  //   setLoginUserNumber(number);
  //   setWebViewLoaded(true);
  // };

  // const handleWebViewLoad = () => {
  //   setWebViewLoaded(true);
  //   setShow(false);
  // };

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webviewRef}
        source={{uri: 'https://webviewpages.web.app/firstscreen'}}
      />
    </View>
    // <View style={{flex: 1}}>
    //   <ActivityIndicator
    //     style={styles.ActivityIndicatorLayout}
    //     size={'large'}
    //     animating={show}
    //     color={'black'}
    //   />
    //   {webViewLoaded && loginUserNumber && (
    //     <WebView
    //       ref={webviewRef}
    //       source={{uri: 'https://webviewpages.web.app/firstscreen'}}
    //       style={{flex: 1}}
    //       scalesPageToFit={true}
    //       onLoad={handleWebViewLoad}
    //     />
    //   )}
    // </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  ActivityIndicatorLayout: {
    position: 'absolute',
    left: '45%',
    top: '30%',
    zIndex: 1,
  },
});
