import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
  
  const webviewRef = useRef();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  function getInjectableJSMessage(message) {
    return `
      (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: ${JSON.stringify(message)}
        }));
      })();
    `;
  }

  useEffect(() => {
    setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          sendDataToWeb(latitude, longitude);
        },
        error => {
          console.log(error);
        },
      );
    }, 2000);
  }, []);

  function sendDataToWeb(latitude, longitude) {
    webviewRef.current?.injectJavaScript(
      getInjectableJSMessage({
        latitude: latitude,
        longitude: longitude,
      }),
    );
  }

  return (
    <WebView
      style={{
        flex: 1,
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
      }}
      ref={webviewRef}
      // source={{uri: 'https://webviewpages.web.app/firstscreen'}}
      source={{uri: 'http://192.168.31.248:3000/mobilescreen-mapscreen'}}
      renderLoading={ActivityIndicatorElement}
      startInLoadingState={true}
    />
  );
};

const ActivityIndicatorElement = () => {
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

export default MapScreen;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
