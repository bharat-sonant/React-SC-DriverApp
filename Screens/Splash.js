import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 3000);
  }, []);

  const getData = async () => {
    try {
      const isLogin = await AsyncStorage.getItem('login');
      if (isLogin !== null) {
        navigation.navigate('BottomTabScreen');
      } else {
        navigation.navigate('Login');
      }
    } catch (e) {}
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        style={{
          height:Dimensions.get("screen").height,
          width:Dimensions.get("screen").width,
        }}
        source={require('../Images/preloader.gif')}
      
      />
    </View>
  );
};

export default Splash;
