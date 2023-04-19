import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {
  const [loginUserNumber, setLoginUserNumber] = useState("");
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  useEffect(() => {
    getLocalData();
  }, [])

  const getLocalData = async () => {
    const number = await AsyncStorage.getItem("userNumber");
    setLoginUserNumber(number);
    setWebViewLoaded(true);
  }

  const webviewUri = `https://webviewpages.web.app/?loginUserNumber=${loginUserNumber}`;
  console.log(webviewUri);

  return (
    <View style={{ flex: 1 }}>
      {webViewLoaded && loginUserNumber && (
        <WebView
          source={{ uri: webviewUri }}
          style={{ flex: 1 }}
          scalesPageToFit={true}
        />
      )}
    </View>
  )
}


export default Home

const styles = StyleSheet.create({})    