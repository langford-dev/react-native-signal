import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image, StatusBar, Dimensions, Alert } from 'react-native';
import { NavigationContainer, useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ActionSheet from "react-native-actions-sheet";
// import Icon from 'react-native-vector-icons/Ionicons';
// import globalStyles from './styles/globalStyles';
import ChatPage from './screens/ChatPage';
import ProfilePage from './screens/ProfilePage';
import ContactsPage from './screens/ContactsPage';
// import storage from './storage/storage';
import InputPhoneNumber from './screens/auth/InputPhoneNumber';
// import { initializeApp } from 'firebase/app';
import HomeScreen from './screens/HomeScreen';
import OTP from './screens/auth/OTP';
import storage from './storage/storage';
import { Platform } from 'expo-modules-core';

// import { initializeApp } from '@react-native-firebase/app'
// import { YellowBox } from 'react-native';

// YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

// const firebaseConfig = {
//   apiKey: "AIzaSyCcAOwdLTLXmNZ7zCy-1X3ynWkFH2AGBT4",
//   authDomain: "signal-v2.firebaseapp.com",
//   projectId: "signal-v2",
//   storageBucket: "signal-v2.appspot.com",
//   messagingSenderId: "882317468319",
//   appId: "1:882317468319:web:fc67e23a3ee92c4c48b8aa",
//   measurementId: "G-4MX5YB2QR9"
// };

// initializeApp(firebaseConfig);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabBarStyleOptions = {
  borderTopWidth: 0,
  height: 55,
  elevation: 0,
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Alert.alert(
  //   'Alert Title',
  //   'My Alert Msg',
  //   [
  //     { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     { text: 'OK', onPress: () => console.log('OK Pressed') },
  //   ],
  //   { cancelable: false },
  // );

  useEffect(() => {
    checkIsAuth()

    return () => { }
  }, [])

  async function checkIsAuth() {
    // await storage.remove({ key: 'phoneNumber' })
    // await storage.remove({ key: 'rooms' })

    storage.load({ key: 'phoneNumber' }).then(number => {
      console.log('number --->', number);
      setIsAuthenticated(true)
    }).catch(e => {
      console.log('not set');
      setIsAuthenticated(false)
    })
  }

  const initialRoute = () => {
    // console.log('isAuthenticated ----->', isAuthenticated)

    // if (isAuthenticated) return 'InputPhoneNumber'
    // if (!isAuthenticated) return 'HomeScreen'
  }

  const statusBar = () => {
    if (Platform.OS === 'ios') return <StatusBar backgroundColor="#fff" barStyle="light-content" />
    else return <StatusBar backgroundColor="#1e7ae4" barStyle="light-content" />
    // return <StatusBar backgroundColor="#fff" barStyle="dark-content" />
  }

  return <>
    <NavigationContainer>
      {statusBar()}

      <Stack.Navigator initialRouteName={initialRoute()}>
        {/* <Stack.Screen
          component={InputPhoneNumber}
          name='InputPhoneNumber'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={OTP}
          name='OTP'
          options={{ headerShown: false }}
        /> */}

        <Stack.Screen
          component={HomeScreen}
          name='HomeScreen'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={ContactsPage}
          name='ContactsPage'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={ProfilePage}
          name='ProfilePage'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={ChatPage}
          name='ChatPage'
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer >
  </>
}

// const HomeInit = ({ navigation, route }) => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         component={HomePage}
//         name='HomePage'
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         component={SearchPage}
//         name='SearchPage'
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         component={ProfilePage}
//         name='ProfilePage'
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         component={ChatPage}
//         name='ChatPage'
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   )
// }