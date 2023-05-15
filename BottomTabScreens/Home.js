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
import {getDistance} from 'geolib';

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
  const [isLoading, setIsLoading] = useState(true);
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
      const driverUsername = await AsyncStorage.getItem('username');
      if (value !== null && driverUsername !== null) {
        setDriverId(value);
        requestForPermission(value);
        sendDatatoWeb(value, driverUsername);
      }
    } catch (e) {
      console.log(e);
    }
  };

  function sendDatatoWeb(value, driverUsername) {
    const timeInterval = setInterval(() => {
      webviewRef.current?.injectJavaScript(
        getInjectableJSMessage({
          driverId: value,
          driverUsername: driverUsername,
        }),
      );
    }, 1000);

    setTimeout(() => {
      clearInterval(timeInterval);
    }, 2000);
  }

  useEffect(() => {
    getData();
  }, []);

  const requestForPermission = async value => {
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
        fetchLocation(value);
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

  const fetchLocation = value => {
    const timeInterId = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          clearInterval(timeInterId);
          setInterval(() => {
            let latitude = parseFloat(position.coords.latitude);
            let longitude = parseFloat(position.coords.longitude);
            sendDataToDatabase(latitude, longitude, value);
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

  function sendDataToDatabase(latitude, longitude, value) {
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

    var slatVal = latLngArr[0];
    var dlatVal = latLngArr[latLngArr.length - 1];
    var slat = slatVal.split(',')[0];
    var slng = slatVal.split(',')[1];
    var dlat = dlatVal.split(',')[0];
    var dlng = dlatVal.split(',')[1];
    var slatitude = slat.replace('(', '');
    var slongutitue = slng.replace(')', '');
    var dlatitude = dlat.replace('(', '');
    var dlongutitue = dlng.replace(')', '');
    var dis = getDistance(
      {latitude: slatitude, longitude: slongutitue},
      {latitude: dlatitude, longitude: dlongutitue},
    );

    // console.log(latlng, value);
    // set(
    //   ref(
    //     database,
    //     'TravelPath/' +
    //       value +
    //       '/' +
    //       year +
    //       '/' +
    //       month +
    //       '/' +
    //       date +
    //       '/' +
    //       hour,
    //   ),
    //   {
    //     distance_in_meter: dis,
    //     latlng: latLngArr.toString(),
    //   },
    // );
  }

  function getInjectableJSMessage(message) {
    console.log(message);
    return `
      (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: ${JSON.stringify(message)}
        }));
      })();
    `;
  }

  return (
    <WebView
      ref={webviewRef}
      // source={{uri: 'https://webviewpages.web.app/firstscreen'}}
      source={{uri: 'http://192.168.31.248:3000/mobilescreen-calculation'}}
      renderLoading={ActivityIndicatorElement}
      startInLoadingState={true}
    />
  );
};

const ActivityIndicatorElement = () => {
  return (
    <ActivityIndicator
      color="#009688"
      size="large"
      style={styles.activityIndicatorStyle}
    />
  );
};

export default Home;

const styles = StyleSheet.create({
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
