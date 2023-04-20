import { ActivityIndicator, Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { ref } from 'firebase/database';
import { database } from '../Firebase';
import { child, get, ref } from 'firebase/database';
import { TextInput } from 'react-native-gesture-handler';
import { NavigationAction, useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('8786786691');
    const [pin, setPin] = useState('302021');
    const [show, setShow] = useState(false);
    const databasePath = ref(database);
    const navigation = useNavigation();
    let flag = 0;
    function backActionHandler() {
        Alert.alert("", "Are sure to exit the Application", [{
            text: 'No',
            onPress: () => null,
            style: 'cancel'
        }, {
            text: 'Yes',
            onPress: () => BackHandler.exitApp(),
        }]);
        return true;
    }
    useBackHandler(backActionHandler);
    const getLoginData = () => {
        setShow(true)
        if (mobileNumber.length <= 0) {
            alert("Enter Mobile Number")
        } else if (pin.length <= 0) {
            alert("Enter Your Pin");
        }
        get(child(databasePath, "Drivers")).then((snapshot) => {
            if (snapshot.exists) {
                snapshot.forEach((value) => {
                    const driverMobileNumber = value.child("mobile").val();
                    const driverPin = value.child("pin").val()
                    if (driverMobileNumber === mobileNumber && driverPin === pin) {
                        flag = 1;
                    } else {
                        setShow(false)
                    }
                })
                if (flag === 1) {
                    AsyncStorage.setItem("userNumber", mobileNumber);
                    navigation.navigate("BottomTabScreen", { "userNumber": mobileNumber });
                    setShow(false)
                } else {
                    alert("Check Number and Password")
                }
            }

        })
    }
    return (
        <View style={styles.container}>
            <ActivityIndicator style={styles.ActivityIndicatorLayout} size={'large'} animating={show} color={'black'} />
            <Image style={styles.image} source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS42EsAolPV2NGnQO1X87f7uSZGobRNUO7SiW-qVaCLlTzmqkuuKtq8RogeO8WFJawZXxQ&usqp=CAU" }} />
            <View style={{ flexDirection: 'row', width: "70%", borderWidth: 1, borderRadius: 15, borderColor: 'grey', marginTop: 20, paddingLeft: 5, paddingTop: 8, paddingBottom: 8 }} >
                <Image style={{ width: 35, height: 35, borderRadius: 45, marginLeft: 3, marginRight: 10, marginTop: 5 }} source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBpjKV5f6Bu_km648nAq7du23ZdxgvAojNzs3RK79qG1p35IAmlVr0xVEC3-iYiXTpYw&usqp=CAU" }} />
                <TextInput keyboardType="numeric" maxLength={10} placeholder='Emp Id' style={{ width: "100%", color: 'black' }}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                />
            </View>
            <View style={{ flexDirection: 'row', width: "70%", borderWidth: 1, borderRadius: 15, borderColor: 'grey', marginTop: 20, paddingLeft: 5, paddingTop: 8, paddingBottom: 8 }} >
                <Image style={{ width: 35, height: 35, borderRadius: 40, marginRight: 10, marginTop: 5, marginLeft: 3 }} source={{ uri: "https://www.shutterstock.com/image-vector/password-security-symbol-lock-icon-260nw-782799754.jpg" }} />
                <TextInput placeholder='Password' style={{ width: "100%", color: 'black' }}
                    value={pin}
                    onChangeText={setPin}
                    secureTextEntry={true}
                />
            </View>
            <TouchableOpacity onPress={() => getLoginData()} >
                <View style={{ borderRadius: 15, borderWidth: 1, padding: 15, marginTop: 25, width: 165, backgroundColor: 'grey' }} >
                    <Text style={styles.loginText}>LOGIN</Text>

                </View>
            </TouchableOpacity>


        </View>

    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        marginTop: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtn: {
        borderWidth: 1,
        borderColor: 'green',
        padding: 17,
        marginTop: 30,
        width: 170,
        textAlign: 'center',
        borderRadius: 15,
        backgroundColor: '#54B435'
    },

    loginText: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: '700'

    }, image: {
        width: 120,
        height: 120,
        marginBottom: 20,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: 'green'
    },
    imageStyle: {
        padding: 10,
        margin: 8,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
        alignItems: 'center',
    }, ActivityIndicatorLayout: {
        position: 'absolute',
        left: "45%",
        top: "90%",
        zIndex: 1
    }


})


