import {View, Text, BackHandler, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';
import {WebView} from 'react-native-webview';

const LogOut = props => {
  const navigation = useNavigation();
  // useEffect(() => {
  //   BackgroundService.stop();
  //   AsyncStorage.clear();
  //   // props.navigation.replace("Login");
  //   BackHandler.exitApp();
  // }, []);
  return (
    <View style={{flex: 1}}> 
      <WebView
        // ref={webviewRef}
        // source={{uri: 'https://webviewpages.web.app/firstscreen'}}
        source={{uri: 'http://192.168.31.248:3000/mobilescreen-rate-list'}}
        renderLoading={ActivityIndicatorElement}
        startInLoadingState={true}
      />
      {/* <Text style={{color: 'black'}}>Log out</Text> */}
    </View>
  );
};

const ActivityIndicatorElement = () => {
  //making a view to show to while loading the webpage
  return (
    <ActivityIndicator
      color="#009688"
      size="large"
      style={styles.activityIndicatorStyle}
    />
  );
};
export default LogOut;

const styles = StyleSheet.create({
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
