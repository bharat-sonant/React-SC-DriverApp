import { ActivityIndicator, Alert, PermissionsAndroid, StyleSheet, Text, View, Linking, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useBackHandler } from '@react-native-community/hooks';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';
import { get, ref, set, update } from 'firebase/database';
import { database } from '../Firebase';
const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
const Home = () => {
  const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
  const LOCATION_TRACKING = 'location-tracking';
  const [loginUserNumber, setLoginUserNumber] = useState("");
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [show, setShow] = useState(false);
  const webviewRef = useRef();
  const [count, setCount] = useState(0);
  async function startBackgroundService() {
    await BackgroundService.start(veryIntensiveTask, options);
  }
  
  useEffect(() => {
    locationPermission();
    startBackgroundService();
    getLocalData();
  
    // registerBackgroundTask()
  }, []);
  const veryIntensiveTask = async (taskDataArguments) => {
    //     // Example of an infinite loop task
    let newlatio ;
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
          for (let i = 0; BackgroundService.isRunning(); i++) {
            try {
              console.log(i);
              Geolocation.getCurrentPosition(position=>{
               console.log(position.coords.longitude)
               set(ref(database,"demoLatitude"),{
                longitude:position.coords.longitude,
                count:i
              })
              })
             
               
            } catch (error) {
              console.log(error);
            }
           
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
          delay: 5000,
        },
      };

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
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'NEVER_ASK_AGAIN',
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
          {cancelable:false}
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
// const timerTask = () => {
//   // console.log("hey125");
//   // BackgroundTimer.runBackgroundTimer(() => {
//   Geolocation.watchPosition(
//     position => {
//       const { latitude, longitude } = position.coords;
//       console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//       setLocationNew({
//         latitude: latitude,
//         longitude: longitude,
//       });
//     },
//     error => {
//       console.log(`Error: ${error.message}`);
//     },
//     {
//       enableHighAccuracy: false,
//       timeout: 1000,
//       maximumAge: 0,
//       distanceFilter: 1, // set the minimum distance in meters that should trigger a position update
//       interval: 3000// set the time interval in milliseconds for updating the position
//     }
//   );
//   // },
//   //   1000);
//   //rest of code will be performing for iOS on background too

//   // BackgroundTimer.stopBackgroundTimer();
// }
// useEffect(() => {
//   const veryIntensiveTask = async (taskDataArguments) => {
//     // Example of an infinite loop task
//     const { delay } = taskDataArguments;
//     await new Promise(async (resolve) => {
//       for (let i = 0; BackgroundService.isRunning(); i++) {
//         console.log(i);
//         await sleep(delay);
//       }
//     });
//   };
//   const options = {
//     taskName: 'Example',
//     taskTitle: 'ExampleTask title',
//     taskDesc: 'ExampleTask description',
//     taskIcon: {
//       name: 'ic_launcher',
//       type: 'mipmap',
//     },
//     color: '#ff00ff',
//     linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
//     parameters: {
//       delay: 1000,
//     },
//   };
// })



//=================================================================//


 // let status = await BackgroundFetch.configure(
    //   {
    //     minimumFetchInterval: 15,
    //     forceAlarmManager: true,
    //     stopOnTerminate: false,
    //     startOnBoot: true,
    //     enableHeadless: true,
    //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    //   },
    //   async (taskId) => {
    //     console.log("[BackgroundFetch] taskId: ", taskId);
    //     BackgroundFetch.finish(taskId);
    //   },
    //   async (taskId) => {
    //     console.log("[BackgroundFetch] timeout taskId: ", taskId);
    //     BackgroundFetch.finish(taskId);
    //   }
    // );
  
    // console.log("[BackgroundFetch] status: ", status);
  
    // // Start the background fetch service

//====================================================================================================================//

    // const backgroundGeo = async()=>{
    //   const options = {
    //     desiredAccuracy: 10,
    //     stationaryRadius: 50,
    //     distanceFilter: 10,
    //     notification: {
    //       title: 'My App is using location services',
    //       text: 'Enable location services to allow us to notify you of nearby deals.'
    //     },
    //     debug: false,
    //     startOnBoot: true,
    //     stopOnTerminate: false,
    //   };
      
    //   BackgroundGeolocation.ready(options);
    //   BackgroundGeolocation.start();
  
    //   BackgroundGeolocation.on('location', (location) => {
    //     setLatitude(location.coords.latitude)
    //       setLongitude(location.coords.longitude)
    //       console.log(location.coords.latitude +" && "+location.coords.longitude);
    //   });
    //   BackgroundGeolocation.on('error', (error) => {
    //     console.warn('[BackgroundGeolocation] Error:', error);
    //   });
    // BackgroundGeolocation.onLocation(location => {
    //   console.log('Latitude: ', location.coords.latitude);
    //   console.log('Longitude: ', location.coords.longitude);
    //   setLatitude("location.coords.latitude")
    //   setLongitude(location.coords.longitude)
    // }, error => {
    //   console.warn('BackgroundGeolocation error: ', error);
    // });
    
    // BackgroundGeolocation.start();
    // BackgroundGeolocation.ready({
    //   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH, 
    //   distanceFilter: 50
    // }).then(state => {
    //   console.log('- BackgroundGeolocation is ready: ', state);
    // }).catch(error => {
    //   console.warn('- BackgroundGeolocation error: ', error);
    // });
    // // Or use await in an async function
    // try {
    //   const state = await BackgroundGeolocation.ready({
    //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH, 
    //     distanceFilter: 50
    //   })
    //   console.log('- BackgroundGeolocation is ready: ', state);
    // } catch (error) {
    //   console.warn('- BackgroundGeolocation error: ', error);
    // }
  
    
  
    
  //===========================================================//
  // const fetchLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const newLocation = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       };
  //       console.log("[Location] New location:", newLocation);
  
  //       if (
  //         lastLocation &&
  //         newLocation.latitude === lastLocation.latitude &&
  //         newLocation.longitude === lastLocation.longitude
  //       ) {
  //         console.log("[Location] Location is same as last known location, ignoring.");
  //         return;
  //       }
  
  //       setLatitude(newLocation.latitude);
  //       setLongitude(newLocation.longitude);
  //       setLastLocation(newLocation);
  
  //       console.log("[Location] Location changed:", newLocation);
  //     },
  //     error => {
  //       console.log(`[Location] Error: ${error.message}`);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  //   // fetchLocation();
  
  // // Update location every 15 seconds
  // setInterval(fetchLocation, 15000);
  // };
  
  // // Call fetchLocation() once before setInterval to get the initial location
  
  
 
   
    
  

  // const onBackgroundFetch = async taskId => {
  //   console.log(`[BackgroundFetch] Task ${taskId} received`);
  //   Geolocation.getCurrentPosition(
  //     position => {

  //       console.log(`[BackgroundFetch] Location: ${position.coords.latitude}, ${position.coords.longitude}`);
  //     } ,error => {
  //       console.log(`[BackgroundFetch] Error getting location: ${error.message}`);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  //   const status = await BackgroundFetch.configure(
  //     {
  //       minimumFetchInterval: 15, 
  //       forceAlarmManager: true,
  //       stopOnTerminate: false,
  //       startOnBoot: true,
  //       enableHeadless: true,
  //       requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
  //     },
  //     onBackgroundFetch,
  //     error => {
  //       console.log(`[BackgroundFetch] Failed to configure: ${error}`);
  //     }
  //   );
   
  //   await BackgroundFetch.start();
  // };

//============================================================================================================//


// async function registerBackgroundTask() {
//   // Request location permissions
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     );
//     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Location permission denied');
//       return;
//     }
//   } catch (error) {
//     console.log("==="+error);
//     return;
//   }

//   // Register the background task handler
//   BackgroundFetch.configure(
//     {
//       minimumFetchInterval: 15, // fetch interval in minutes
//       stopOnTerminate: false, // continue background fetch even if app is terminated
//       startOnBoot: true, // start background fetch on device boot
//       enableHeadless: true, // enable headless background fetch (only available on Android)
//     },
//     async (taskId) => {
//       console.log(taskId);
//       try {
//         Geolocation.getCurrentPosition(
//           (position) => {
//             console.log('Location:', position.coords.latitude, position.coords.longitude);
//             // send the location to your server or save it to a local database
//           },
//           (error) => {
//             console.log("="+error);
//           },
//           { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
//         );
//       } catch (error) {
//         console.log("=="+error);
//       } finally {
        
//         BackgroundFetch.finish(taskId);
//       }
//     },
//     (error) => {
//       console.log("====="+error);
//     },
//   );

//   // Start the background task
//   BackgroundFetch.start().then((status) => {
//     console.log('Background fetch started:', status);
//   });
// }