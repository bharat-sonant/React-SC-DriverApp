import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {
  const [loginUserNumber, setLoginUserNumber] = useState("");
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    
    getLocalData();
  }, [])

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


  const webviewUri = `https://webviewpages.web.app/?loginUserNumber=${loginUserNumber}`;


  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator style={styles.ActivityIndicatorLayout} size={"large"} animating={show} color={'black'} />
      {webViewLoaded && loginUserNumber && (
        <WebView
          source={{ uri: webviewUri }}
          style={{ flex: 1 }}
          scalesPageToFit={true}
          onLoad={handleWebViewLoad}
        />
      )}
    </View>
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