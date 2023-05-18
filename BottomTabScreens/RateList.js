import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';
import {WebView} from 'react-native-webview';

const RateList = props => {
  
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
    <View style={{flex: 15, justifyContent: 'center', alignItems: 'center'}}>
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
export default RateList;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
