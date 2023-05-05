<<<<<<< HEAD
import { ActivityIndicator, Alert, BackHandler, Button, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { ref } from 'firebase/database';
import { database } from '../Firebase';
import { child, get, ref } from 'firebase/database';
import { TextInput } from 'react-native-gesture-handler';
import { NavigationAction, useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('8786786691');
    const [pin, setPin] = useState('302021');
    const [show, setShow] = useState(false);
    const databasePath = ref(database);
    const navigation = useNavigation();
    let flag = 0;
    function backActionHandler() {
        Alert.alert("", "Are sure to exit the Application", [{
            text: 'No',
            onPress: () => null,
            style: 'cancel'
        }, {
            text: 'Yes',
            onPress: () => BackHandler.exitApp(),
        }]);
        return true;
    }
    useBackHandler(backActionHandler);
    const getLoginData = () => {
        setShow(true)
        if (mobileNumber.length <= 0) {
            alert("Enter Mobile Number")
        } else if (pin.length <= 0) {
            alert("Enter Your Pin");
        }
        get(child(databasePath, "Drivers")).then((snapshot) => {
            if (snapshot.exists) {
                snapshot.forEach((value) => {
                    const driverMobileNumber = value.child("mobile").val();
                    const driverPin = value.child("pin").val()
                    if (driverMobileNumber === mobileNumber && driverPin === pin) {
                        flag = 1;
                    } else {
                        setShow(false)
                    }
                })
                if (flag === 1) {
                    AsyncStorage.setItem("userNumber", mobileNumber);
                    navigation.navigate("BottomTabScreen", { "userNumber": mobileNumber });
                    setShow(false)
                } else {
                    alert("Check Number and Password")
                }
            }

        })
    }
    return (

        <View style={styles.container}>

           
            <Image source={{ uri: "https://www.gwcindia.in/assets/backoffice.png", height: 300, width: Dimensions.get('screen').width }} />
    
            <View style={styles.inputStyle}>
             
                <Image style={styles.icon} source={{ uri: "https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg" }} />

               
                <TextInput keyboardType="numeric" placeholder='Number' style={{ color: "black", fontSize: 15, marginBottom: -10 }}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                 />

            </View>
            <View style={styles.inputStyle}>
               

                <Image style={styles.imageStyl} source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8500uKjsVedMStg1isnwiq9CArOWUVwLLzwanyk5gp0DWPxIWmAtTfYMafLzWMq9xeak&usqp=CAU" }} />
          
                <TextInput placeholder='Password' style={{ color: "black", fontSize: 15, marginBottom: -10 }} 
                 value={pin}
                 onChangeText={setPin}
                 secureTextEntry={true}
                />
            </View>
           
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => getLoginData()} >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: '700', marginTop: -5 }}>Login</Text>
                </TouchableOpacity>

            </View>

=======
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  PermissionsAndroid,
  Linking,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {database} from '../Firebase';
import {child, get, ref} from 'firebase/database';
import {TextInput} from 'react-native-gesture-handler';
import {useBackHandler} from '@react-native-community/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidSettingsTool from 'react-native-android-settings-tool';

const Login = ({navigation}) => {
  const [userName, setUserName] = useState('7737823789');
  const [pass, setPass] = useState('1234');
  const [usernameError, setUsernameError] = useState('');
  const [passError, setPassError] = useState('');
  const usernameRef = useRef(null);
  const passRef = useRef(null);
  // const [show, setShow] = useState(false);
  const databasePath = ref(database);
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
>>>>>>> ef42fbb8c190170c1a4739efe70e60bac303ac7a

  useEffect(() => {
    // requestForPermission();
  });
  //   const requestForPermission = async () => {
  //     const allLocation = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  //     ]).then(result => {
  //       if (
  //         result['android.permission.ACCESS_COARSE_LOCATION'] &&
  //         result['android.permission.ACCESS_FINE_LOCATION'] &&
  //         result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'granted'
  //       ) {
  //         console.log('granted');
  //         fetchLocation();
  //       } else if (
  //         result['android.permission.ACCESS_COARSE_LOCATION'] &&
  //         result['android.permission.ACCESS_FINE_LOCATION'] &&
  //         result['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
  //           'never_ask_again'
  //       ) {
  //         console.log('never_ask_again');
  //       } else if (
  //         result['android.permission.ACCESS_COARSE_LOCATION'] &&
  //         result['android.permission.ACCESS_FINE_LOCATION'] &&
  //         result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'denied'
  //       ) {
  //         console.log('denied');
  //       }
  //     });
  //   };

<<<<<<< HEAD
            {/* <View >
                <Text style={{
                    textAlign: 'center',
                    textAlignVertical: 'center'
                }}>Don't have an account? <Text style={{ color: '#00a2ed' }} >Sign up</Text> </Text>
            </View> */}

        </View>
=======
  //   const fetchLocation = () => {
  //     const timeInterId = setInterval(() => {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           clearInterval(timeInterId);
  //           console.log(position);
  //         },
  //         error => {
  //           if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
  //             try {
  //               console.log(error.code);
  //               RNAndroidSettingsTool.ACTION_LOCATION_SOURCE_SETTINGS();
  //             } catch (error) {
  //               console.log('Settings: ', error);
  //             }
  //           }
  //           console.log(error);
  //         },
  //       );
  //     }, 1000);
  //   };
>>>>>>> ef42fbb8c190170c1a4739efe70e60bac303ac7a

  // function backActionHandler() {
  //   Alert.alert('', 'Are sure to exit the Application', [
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
  // useBackHandler(backActionHandler);

<<<<<<< HEAD
export default Login

const styles = StyleSheet.create({
    container: {
        // width:'100%'
        // marginTop: -150,
        flex: 1,
        // height: '100%',
        // flex: 1,
        // flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'black'


    },
    loginBtn: {
        borderWidth: 1,
        borderColor: 'green',
        padding: 17,
        marginTop: 30,
        width: 170,
        textAlign: 'center',
        borderRadius: 15,
        backgroundColor: '#54B435'
    },
=======
  const getLoginData = () => {
    if (isTrue()) {
      console.log('entre');
      get(child(databasePath, 'DriversData/Auth/' + userName)).then(
        snapshot => {
          if (snapshot.exists()) {
            const username = snapshot.key;
            const password = snapshot.val().code;
            const driver = snapshot.val().driverId;
            let driverID = driver.toString();
            AsyncStorage.setItem('username', username);
            AsyncStorage.setItem('driverId', driverID);
            navigation.navigate('BottomTabScreen');
          } else {
            Alert.alert('Login Failed!!', 'Not a valid user');
          }
        },
      );
    }
  };
  function isTrue() {
    if (!userName.trim()) {
      setUsernameError('enter username');
      usernameRef.current.focus();
      return false;
    } else if (!pass.trim()) {
      setPassError('enter password');
      passRef.current.focus();
      return false;
    } else if (pass.length < 4) {
      passRef.current.focus();
      setPassError('enter 4 digit password');
      return false;
    }
    return true;
  }
>>>>>>> ef42fbb8c190170c1a4739efe70e60bac303ac7a

  //https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS42EsAolPV2NGnQO1X87f7uSZGobRNUO7SiW-qVaCLlTzmqkuuKtq8RogeO8WFJawZXxQ&usqp=CAU
  //https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBpjKV5f6Bu_km648nAq7du23ZdxgvAojNzs3RK79qG1p35IAmlVr0xVEC3-iYiXTpYw&usqp=CAU
  //https://www.shutterstock.com/image-vector/password-security-symbol-lock-icon-260nw-782799754.jpg
  return (
    <View style={styles.container}>
      {/* <ActivityIndicator
        style={styles.ActivityIndicatorLayout}
        size={'large'}
        animating={show}
        color={'black'}
      /> */}
      <Image style={styles.image} source={require('../Images/logo.jpg')} />
      <View
        style={{
          flexDirection: 'row',
          width: '70%',
          borderWidth: 1,
          borderRadius: 15,
          borderColor: 'grey',
          marginTop: 20,
          paddingLeft: 5,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
        <Image
          style={{
            width: 35,
            height: 35,
            borderRadius: 45,
            marginLeft: 3,
            marginRight: 10,
            marginTop: 5,
          }}
          source={require('../Images/userlogo.jpg')}
        />
        <TextInput
          maxLength={10}
          ref={usernameRef}
          autoFocus={true}
          placeholder="username"
          style={{width: '100%', color: 'black'}}
          value={userName}
          onChangeText={setUserName}
        />
      </View>

<<<<<<< HEAD
    }, image: {
        width: '100%',
        height: 60,
        marginBottom: 20,
        // borderRadius:75 ,
        borderWidth: 1,
        borderColor: 'green'
    },
    imageStyle: {
        padding: 10,
        margin: 8,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
        alignItems: 'center',
    }, ActivityIndicatorLayout: {
        position: 'absolute',

        left: "45%",
        top: "90%",
        zIndex: 1
    },
    inputStyle: {
        //    height:70,
        borderColor: "#000",
        borderBottomWidth: 0.5,
        marginHorizontal: 30,
        marginVertical: 8,
        // margin:80
        paddingLeft: 23,
        paddingTop: 10,
        _justifyContent: 'center',

        // alignItems:'center'

    },
    buttonStyle: {
        height: 45,
        width: '85%',
        backgroundColor: '#00a2ed',
        // marginHorizontal: 40,
        marginVertical: 30,
        borderRadius: 4,
        justifyContent: 'center',
        // marginHorizontal:20,

        alignItems: 'center'



    },
    imageStyl: {
        position: 'absolute',
        width: 20,
        height: 23,
        bottom: 3,
        left: 0,
        // right:60
        borderRadius: 10


    },
    icon: {
        position: 'absolute',
        width: 20,
        height: 20,
        bottom: 3,
        left: 0,
        // right:60
        borderRadius: 10
    },
   
=======
      <View style={{position: 'relative', right: 50}}>
        <Text style={{color: 'red', fontSize: 13}}>
          {!userName.trim() ? usernameError : ''}
        </Text>
      </View>
>>>>>>> ef42fbb8c190170c1a4739efe70e60bac303ac7a

      <View
        style={{
          flexDirection: 'row',
          width: '70%',
          borderWidth: 1,
          borderRadius: 15,
          borderColor: 'grey',
          marginTop: 20,
          paddingLeft: 5,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
        <Image
          style={{
            width: 35,
            height: 35,
            borderRadius: 40,
            marginRight: 10,
            marginTop: 5,
            marginLeft: 3,
          }}
          source={require('../Images/lock.jpg')}
        />
        <TextInput
          placeholder="password"
          style={{width: '100%', color: 'black'}}
          value={pass}
          ref={passRef}
          maxLength={4}
          autoCapitalize="none"
          onChangeText={setPass}
          secureTextEntry={true}
        />
      </View>
      <View style={{position: 'relative', right: 50}}>
        <Text style={{color: 'red', fontSize: 13}}>
          {!pass.trim() || pass.length < 4 ? passError : ''}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 15,
          borderWidth: 1,
          padding: 15,
          marginTop: 20,
          width: 165,
          backgroundColor: 'grey',
        }}>
        <TouchableOpacity onPress={() => getLoginData()}>
          {/* <View style={{}}> */}
          <Text style={styles.loginText}>LOGIN</Text>
          {/* </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginTop: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtn: {
    borderWidth: 1,
    borderColor: 'green',
    padding: 17,
    marginTop: 30,
    width: 170,
    textAlign: 'center',
    borderRadius: 15,
    backgroundColor: '#54B435',
  },

  loginText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'green',
  },
  imageStyle: {
    padding: 10,
    margin: 8,
    height: 30,
    width: 30,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  ActivityIndicatorLayout: {
    position: 'absolute',
    left: '45%',
    top: '90%',
    zIndex: 1,
  },
});
