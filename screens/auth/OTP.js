// import React, { createRef, useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import globalStyles from '../../styles/globalStyles';
// import HomeScreen from '../HomeScreen';
// import OTPInputView from '@twotalltotems/react-native-otp-input'
// // import auth from '@firebase/auth';

// import { getAuth } from '@firebase/auth';

// // import firebase from 'firebase/app';
// // import 'firebase/auth';



// function OTP({ navigation, route }) {
//     const number = route.params.number;
//     const [initializing, setInitializing] = useState(true);
//     const [user, setUser] = useState();
//     const [confirm, setConfirm] = useState(null);
//     const [code, setCode] = useState('');

//     // const auth = firebase.auth

//     console.log(getAuth())

//     // Handle the verify phone button press
//     async function verifyPhoneNumber() {
//         // try {
//         //     const confirmation = await auth().verifyPhoneNumber(number);
//         //     setConfirm(confirmation);

//         //     console.log('confirmation')
//         // } catch (error) { console.log(error) }
//     }

//     // Handle confirm code button press
//     // async function confirmCode() {
//     //     try {
//     //         const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
//     //         let userData = await auth().currentUser.linkWithCredential(credential);
//     //         setUser(userData.user);
//     //     } catch (error) {
//     //         if (error.code == 'auth/invalid-verification-code') {
//     //             console.log('Invalid code.');
//     //         } else {
//     //             console.log('Account linking error');
//     //         }
//     //     }
//     // }

//     return (
//         <ScrollView style={[globalStyles.container, globalStyles.bigPadding]}>
//             <Text style={{ color: '#006aee', textAlign: 'center' }}>Verify  {number}</Text>
//             <View style={globalStyles.space10}></View>
//             <View style={globalStyles.flexCenterColumn}>
//                 <Text style={[globalStyles.lgText, globalStyles.textAlignCenter]}>
//                     Verify your phone number
//                 </Text>
//             </View>
//             <View style={globalStyles.space30}></View>
//             <Text style={[globalStyles.textAlignCenter, globalStyles.greyText, globalStyles.lineHeight]}>
//                 Wait to automatically detect the SMS sent to {number}
//             </Text>
//             <View style={globalStyles.space30}></View>

//             <View style={{ height: 60 }}>
//                 <OTPInputView
//                     autoFocusOnLoad
//                     pinCount={4}
//                     codeInputHighlightStyle={{ borderBottomColor: '#006aee' }}
//                     codeInputFieldStyle={{
//                         color: '#000',
//                         fontSize: 18,
//                         borderColor: '#fff',
//                         borderBottomColor: '#f1f1f1'
//                     }}
//                     onCodeFilled={(code => {
//                         console.log(`Code is ${code}, you are good to go!`)
//                     })} />
//             </View>

//             <View style={globalStyles.space30}></View>
//             <TouchableOpacity onPress={() => verifyPhoneNumber()} style={styles.btn}>
//                 <Text style={styles.btnText}>Next</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     )
// }

// const styles = StyleSheet.create({
//     inputField: {
//         borderColor: '#f1f1f1',
//         borderWidth: 1,
//         padding: 20,
//         fontSize: 17
//     },

//     btn: {
//         backgroundColor: '#006aee',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 15,
//         borderRadius: 5,
//     },

//     btnText: {
//         color: '#fff',
//         fontWeight: 'bold'
//     },

// })

// export default OTP