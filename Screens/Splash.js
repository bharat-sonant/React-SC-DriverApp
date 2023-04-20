import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationAction, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
    const navigation = useNavigation()
    useEffect(() => {
        checkAlreadyLogin();
    }, []);
    const checkAlreadyLogin = async () => {
        const getUserNumber = await AsyncStorage.getItem("userNumber")
        if (getUserNumber === null) {
            navigation.navigate("Login")
        } else {
            navigation.navigate("BottomTabScreen");
        }
    }
    return (
        <View>
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({})