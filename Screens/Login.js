import { ActivityIndicator, Alert, BackHandler, Button, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

           
            <Image source={{ uri: "https://www.gwcindia.in/assets/backoffice.png", height: 300, width: Dimensions.get('screen').width }} />
    
            <View style={styles.inputStyle}>
             
                <Image style={styles.icon} source={{ uri: "https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg" }} />

               
                <TextInput keyboardType="numeric" placeholder='Number' style={{ color: "black", fontSize: 15, marginBottom: -10 }}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                 />

            </View>
            <View style={styles.inputStyle}>
               

                <Image style={styles.imageStyl} source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8500uKjsVedMStg1isnwiq9CArOWUVwLLzwanyk5gp0DWPxIWmAtTfYMafLzWMq9xeak&usqp=CAU" }} />
          
                <TextInput placeholder='Password' style={{ color: "black", fontSize: 15, marginBottom: -10 }} 
                 value={pin}
                 onChangeText={setPin}
                 secureTextEntry={true}
                />
            </View>
           
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => getLoginData()} >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: '700', marginTop: -5 }}>Login</Text>
                </TouchableOpacity>

            </View>



            {/* <View >
                <Text style={{
                    textAlign: 'center',
                    textAlignVertical: 'center'
                }}>Don't have an account? <Text style={{ color: '#00a2ed' }} >Sign up</Text> </Text>
            </View> */}

        </View>

    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        // width:'100%'
        // marginTop: -150,
        flex: 1,
        // height: '100%',
        // flex: 1,
        // flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'black'


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
        width: '100%',
        height: 60,
        marginBottom: 20,
        // borderRadius:75 ,
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
    },
    inputStyle: {
        //    height:70,
        borderColor: "#000",
        borderBottomWidth: 0.5,
        marginHorizontal: 30,
        marginVertical: 8,
        // margin:80
        paddingLeft: 23,
        paddingTop: 10,
        _justifyContent: 'center',

        // alignItems:'center'

    },
    buttonStyle: {
        height: 45,
        width: '85%',
        backgroundColor: '#00a2ed',
        // marginHorizontal: 40,
        marginVertical: 30,
        borderRadius: 4,
        justifyContent: 'center',
        // marginHorizontal:20,

        alignItems: 'center'



    },
    imageStyl: {
        position: 'absolute',
        width: 20,
        height: 23,
        bottom: 3,
        left: 0,
        // right:60
        borderRadius: 10


    },
    icon: {
        position: 'absolute',
        width: 20,
        height: 20,
        bottom: 3,
        left: 0,
        // right:60
        borderRadius: 10
    },
   


})


