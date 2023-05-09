import {View, Text, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';

const LogOut = props => {
  const navigation = useNavigation();
  useEffect(() => {
    BackgroundService.stop();
    AsyncStorage.clear();
    // props.navigation.replace("Login");
    BackHandler.exitApp();
  }, []);
  return (
    <View>
      <Text style={{color: 'black'}}>Log out</Text>
    </View>
  );
};
export default LogOut;
