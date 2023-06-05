import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackHandler } from '@react-native-community/hooks';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';
import { ref, set } from 'firebase/database';
import { database } from '../Firebase';
import RNAndroidSettingsTool from 'react-native-android-settings-tool';
import moment from 'moment';
import { getDistance } from 'geolib';
import RNExitApp from 'react-native-exit-app';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import PipHandler, { usePipModeListener } from 'react-native-pip-android';

// import { requestBatteryPermission, registerBackgroundTask } from './BatteryPermission';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

let latLngArr = [];
let time = moment().format('hh:mm');
let timeInterval;
const Home = () => {
  const webviewRef = useRef();
  const [driverID, setDriverId] = useState('');
  let [webStatus, setWebStatus] = useState('');
  // const [load, setLoad] = useState(true);
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
  // const [getDataFromReact, setDataFromReact] = useState('');
  const inPipMode = usePipModeListener();

  function backActionHandler() {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'YES', onPress: () => PipHandler.enterPipMode(300, 400) },
    ]);
    return true;
  }
  useBackHandler(backActionHandler);

  async function startBackgroundService() {
    AsyncStorage.setItem('Service', 'start');
    await BackgroundService.start(veryIntensiveTask, options);
  }

  const getBacgroundServiceData = useCallback(async () => {
    const value = await AsyncStorage.getItem('Service');
    if (value === null) {
      startBackgroundService();
    } else {
      // console.log('already started');
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('driverId');
      const driverUsername = await AsyncStorage.getItem('username');
      if (value !== null && driverUsername !== null) {
        console.log("driverId: ", value, " driverser: ", driverUsername);
        setDriverId(value);
        requestForPermission(value, driverUsername);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const requestForPermission = async (value, driverUsername) => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ])
        .then(result => {
          // console.log('RESULT: ', result);
          if (
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.ACCESS_FINE_LOCATION'] &&
            result['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
            'granted'
          ) {
            // setLoad(false);
            // console.log('granted');
            getBacgroundServiceData(value);
            sendDatatoWeb(value, driverUsername);
            // startBackgroundService();
            // fetchLocation(value);
          } else if (
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.ACCESS_FINE_LOCATION'] &&
            result['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
            'never_ask_again'
          ) {
            // console.log('never_ask_again');
            showLocationPermissionBlockedDialog();
          } else if (
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.ACCESS_FINE_LOCATION'] &&
            result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'denied'
          ) {
            // console.log('Permission: denied');
            showLocationPermissionBlockedDialog();
          }
        })
        .catch(error => {
          console.log('ERROR: ', error);
        });
    } catch (error) {
      console.error('Error requesting location permissions:', error);
    }
  };

  function onMessage(data) {
    let getData = data.nativeEvent.data;
    if (getData !== null) {
      console.log("stop")
      clearInterval(timeInterval);
      setWebStatus(getData);
    }
  }

  function sendDatatoWeb(value, driverUsername) {
    timeInterval = setInterval(() => {
      console.log("enter")
      webviewRef.current?.injectJavaScript(
        getInjectableJSMessage({
          driverId: value,
          driverUsername: driverUsername,
        }),
      );
    }, 1000);
  }

  const showLocationPermissionBlockedDialog = () => {
    Alert.alert(
      'Location Permission Required',
      'Please grant location permission (Allow All the time) in your device settings permission to use this app.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => RNExitApp.exitApp(),
        },
        {
          text: 'Open Settings',
          onPress: openAppSettings,
        },
      ],
    );
  };

  const openAppSettings = () => {
    Linking.openSettings();
    RNExitApp.exitApp();
  };

  // const fetchLocation = value => {
  //   const timeInterId = setInterval(() => {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         clearInterval(timeInterId);
  //         setInterval(() => {
  //           let latitude = parseFloat(position.coords.latitude);
  //           let longitude = parseFloat(position.coords.longitude);
  //           sendDataToDatabase(latitude, longitude, value);
  //         }, 2000);
  //       },
  //       error => {
  //         if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
  //           try {
  //             console.log(error.code);
  //             RNAndroidSettingsTool.ACTION_LOCATION_SOURCE_SETTINGS();
  //           } catch (error) {
  //             console.log('Settings: ', error);
  //           }
  //         }
  //         console.log(error);
  //       },
  //     );
  //   }, 1000);
  // };

  const veryIntensiveTask = async taskDataArguments => {
    const { delay } = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        // console.log('Position: ' + i);
        Geolocation.getCurrentPosition(
          async position => {
            let latitude = parseFloat(position.coords.latitude);
            let longitude = parseFloat(position.coords.longitude);
            let value = await AsyncStorage.getItem('driverId');
            sendDataToDatabase(latitude, longitude, value);
          },
          error => {
            if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
              try {
                console.log(error);
                RNAndroidSettingsTool.ACTION_LOCATION_SOURCE_SETTINGS();
              } catch (error) {
                console.log('Settings: ', error);
              }
            }
            console.log(error.message);
          },
          // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
        await sleep(delay);
        // }
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
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
      delay: 2000,
    },
  };

  function sendDataToDatabase(latitude, longitude, value) {
    // console.log('Driver: ', value);
    // console.log('DATA: ', latitude, longitude, value);
    let date = moment(new Date()).format('yyyy-MM-DD');
    let month = moment().format('MMMM');
    let year = moment().format('YYYY');
    let hour = moment().format('hh:mm');

    let latlng = '(' + latitude + ',' + longitude + ')';
    let modifiedValues;
    if (time === hour) {
      // console.log('IF TIME: ', time, 'HOURS: ', hour);
      latLngArr.push(latlng);
      modifiedValues = latLngArr.join('~');
    } else {
      // console.log('ELSE TIME: ', time, 'HOURS: ', hour);
      latLngArr = [];
      time = hour;
      latLngArr.push(latlng);
      modifiedValues = latLngArr.join('~');
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
      { latitude: slatitude, longitude: slongutitue },
      { latitude: dlatitude, longitude: dlongutitue },
    );

    set(
      ref(
        database,
        'TravelPath/' +
        value +
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
        'distance-in-meter': dis,
        'lat-lng': modifiedValues,
      },
    );
  }

  function getInjectableJSMessage(message) {
    return `
      (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: ${JSON.stringify(message)}
        }));
      })();
    `;
  }

  if (inPipMode) {
    return (
      <View style={{ width: 250, height: 350 }}>
        <WebView
          style={{ width: 250, height: 350 }}
          source={{uri: 'https://kabadiapplication.web.app/mobilescreen-calculation'}}
          // source={{ uri: 'http://192.168.31.248:3000/mobilescreen-calculation' }}
        />
      </View>
    );
  }

  return (
    <WebView
      ref={webviewRef}
      // source={{ uri: 'http://192.168.31.248:3000/mobilescreen-calculation' }}
      source={{uri: 'https://kabadiapplication.web.app/mobilescreen-calculation'}}
      renderLoading={ActivityIndicatorElement}
      startInLoadingState={true}
      setBuiltInZoomControls={false}
      onMessage={onMessage}
    // scalesPageToFit={true}
    />
  );
};

const ActivityIndicatorElement = () => {
  return (
    <View style={{ flex: 15, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color="#000" size={50} />
        <Text
          style={{
            fontSize: 17,
            fontWeight: '400',
            color: '#000',
            marginStart: 5,
          }}>
          Please wait....
        </Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
