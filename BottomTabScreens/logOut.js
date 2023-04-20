import { View, Text } from 'react-native'
import React , {useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LogOut = (props) => {
  const navigation = useNavigation();
  useEffect(()=>{
    AsyncStorage.clear();
    props.navigation.replace("Login");
  },[]);
  return (
    <View>
      <Text style={{color:'black'}}>LogOut</Text>
    </View>
  )
}
export default LogOut