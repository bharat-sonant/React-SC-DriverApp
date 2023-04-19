import { View, Text } from 'react-native'
import React , {useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LogOut = () => {
  const navigation = useNavigation();
  useEffect(()=>{
    AsyncStorage.clear();
    navigation.navigate('Login');
   
  },[]);
  return (
    <View>
      <Text style={{color:'black'}}>LogOut</Text>
    </View>
  )
}

export default LogOut