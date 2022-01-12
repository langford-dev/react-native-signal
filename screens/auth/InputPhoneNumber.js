// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import globalStyles from '../../styles/globalStyles';
// import HomeScreen from '../HomeScreen';
// import OTP from './OTP';
// import storage from '../../storage/storage';

// function InputPhoneNumber({ navigation }) {
//     const [phoneNumber, setPhoneNumber] = useState()

//     async function next() {
//         console.log(phoneNumber);
//         await storage.save({ key: 'phoneNumber', data: phoneNumber })
//         // navigation.navigate('HomeScreen')
//         navigation.navigate('OTP', { 'number': phoneNumber })
//     }

//     return (
//         <ScrollView style={[globalStyles.container, globalStyles.bigPadding]}>
//             {/* <Text style={{ color: '#006aee', textAlign: 'center' }}>Verify your number</Text> */}
//             <View style={globalStyles.space10}></View>
//             <View style={globalStyles.flexCenterColumn}>
//                 <Text style={[globalStyles.lgText, globalStyles.textAlignCenter]}>
//                     Input your phone number to get started
//                 </Text>
//             </View>
//             <View style={globalStyles.space30}></View>
//             <Text style={[globalStyles.textAlignCenter, globalStyles.greyText, globalStyles.lineHeight]}>
//                 You will receive an SMS message to verify your phone number. Enter your phone number to continue
//             </Text>
//             <View style={globalStyles.space30}></View>

//             <TextInput
//                 autoFocus={true}
//                 keyboardType='phone-pad'
//                 style={styles.inputField}
//                 placeholder='eg. 0550202871'
//                 value={phoneNumber}
//                 onChangeText={(value) => setPhoneNumber(value)} />

//             <View style={globalStyles.space30}></View>
//             <TouchableOpacity onPress={() => next()} style={styles.btn}>
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

// export default InputPhoneNumber