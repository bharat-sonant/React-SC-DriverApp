import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';
import { WebView } from 'react-native-webview';

const RateList = props => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <WebView
        // source={{ uri: 'http://192.168.31.248:3000/mobilescreen-rate-list' }}
        source={{ uri: 'https://kabadiapplication.web.app/mobilescreen-rate-list' }}
        renderLoading={ActivityIndicatorElement}
        setBuiltInZoomControls={false}
        startInLoadingState={true}
      />
    </View>
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
export default RateList;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
