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
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {database} from '../Firebase';
import {child, get, ref} from 'firebase/database';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {useBackHandler} from '@react-native-community/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passError, setPassError] = useState('');
  const usernameRef = useRef(null);
  const passRef = useRef(null);
  const [show, setShow] = useState(true);
  const databasePath = ref(database);
  const [dataList, setDataList] = useState([]);

  function backActionHandler() {
    BackHandler.exitApp();
  }
  useBackHandler(backActionHandler);

  const getAuthData = useCallback(() => {
    const datalist = [];
    setDataList([]);
    get(child(databasePath, 'DriversData/Auth'))
      .then(snapshot => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const keyArray = Object.keys(snapshot.val()).filter(
            key => key !== 'lastKey',
          );

          for (let i = 0; i < keyArray.length; i++) {
            let key = keyArray[i];
            let username = key;
            let password = val[key]['code'];
            let driverId = val[key]['driverId'];

            datalist.push({
              username: username,
              password: password,
              driverId: driverId,
            });
          }
          setDataList(datalist);
        } else {
          setDataList([]);
          datalist = [];
          console.log('No data available');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getAuthData();
  }, [getAuthData]);

  const getLoginData = () => {
    if (isTrue()) {
      const user = dataList.find(user => user.username == userName);
      if (user) {
        if (user.password == pass) {
          setShow(false);
          const driverID = user.driverId.toString();
          get(child(databasePath, 'DriversData/Drivers/' + driverID))
            .then(snapshot => {
              if (snapshot.exists()) {
                const vehicleId = snapshot.child('vehicleId').val();
                if (vehicleId !== null && vehicleId !== '') {
                  setShow(true);
                  setPassError(false);
                  // const driverID = user.driverId.toString();
                  const username = user.username;
                  AsyncStorage.setItem('username', username);
                  AsyncStorage.setItem('driverId', driverID);
                  AsyncStorage.setItem('login', 'true');
                  navigation.navigate('BottomTabScreen');
                } else {
                  setShow(true);
                  Alert.alert(
                    'सावधान !!',
                    'आपको कोई व्हीकल असाइन नहीं है, कृप्या सुपरवाइजर से मिले',
                  );
                }
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          setPassError(true);
          setPassError('password incorrect');
        }
      } else {
        Alert.alert('', 'Login Failed!!!');
      }
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

  const ActivityIndicatorElement = () => {
    //making a view to show to while loading the webpage
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

  return (
    <View style={styles.container}>
      {/* {show ? ( */}
      <ScrollView
        style={{
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
        }}>
        <Image
          style={styles.loginImage}
          source={require('../Images/login-Image.png')}
        />
        <View style={styles.inputStyle}>
          <Image
            style={styles.icon}
            source={{
              uri: 'https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg',
            }}
          />
          <TextInput
            style={{color: 'black', fontSize: 15, marginBottom: -10}}
            maxLength={10}
            ref={usernameRef}
            autoFocus={false}
            placeholder="username"
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        <View style={{position: 'relative', left: 30}}>
          <Text style={{color: 'red', fontSize: 13}}>
            {!userName.trim() ? usernameError : ''}
          </Text>
        </View>
        <View style={styles.inputStyle}>
          <Image
            style={styles.imageStyl}
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8500uKjsVedMStg1isnwiq9CArOWUVwLLzwanyk5gp0DWPxIWmAtTfYMafLzWMq9xeak&usqp=CAU',
            }}
          />
          <TextInput
            placeholder="Password"
            style={{color: 'black', fontSize: 15, marginBottom: -10}}
            value={pass}
            ref={passRef}
            maxLength={4}
            autoCapitalize="none"
            onChangeText={setPass}
            secureTextEntry={true}
          />
        </View>
        <View style={{position: 'relative', left: 30}}>
          <Text style={{color: 'red', fontSize: 13}}>
            {!pass.trim() || pass.length < 4 || passError ? passError : ''}
          </Text>
        </View>
        {show ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => getLoginData()}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '700',
                  marginTop: -5,
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ActivityIndicatorElement />
        )}
      </ScrollView>
      {/* ) : ( */}
      {/* <ActivityIndicatorElement /> */}
      {/* )} */}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  imageStyl: {
    position: 'absolute',
    width: 20,
    height: 23,
    bottom: 3,
    left: 0,
    borderRadius: 10,
  },
  icon: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 3,
    left: 0,
    borderRadius: 10,
  },

  buttonStyle: {
    height: 45,
    width: '85%',
    backgroundColor: '#00a2ed',
    marginVertical: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputStyle: {
    borderColor: '#000',
    borderBottomWidth: 0.5,
    marginHorizontal: 30,
    marginVertical: 8,
    paddingLeft: 23,
    paddingTop: 10,
    justifyContent: 'center',
  },

  image: {
    width: 120,
    height: 120,
    width: '100%',
    height: 60,
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'green',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loginBtn: {
    borderWidth: 1,
    fontWeight: '700',
  },
  loginImage: {
    height: 350,
    width: Dimensions.get('screen').width,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
