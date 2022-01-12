import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, Button, Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { NavigationContainer, useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ActionSheet from "react-native-actions-sheet";
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../styles/globalStyles';
import storage from '../storage/storage';
import ContactsPage from './ContactsPage';
import io from "socket.io-client";
import * as Notifications from "expo-notifications";
import axios from 'axios';
import CountryPicker from 'react-native-country-picker-modal'
import { Platform } from 'expo-modules-core';
// import Icon from 'react-native-vector-icons/Ionicons';


const socket = io('https://signal-v2-server.herokuapp.com/')

// storage.save({ key: 'phoneNumber', data: '+233' + '550202871' })
// storage.remove({ key: 'phoneNumber' })
// storage.remove({ key: 'rooms' })

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

function HomeScreen() {
    const authActionSheetRef = createRef()
    const menuActionSheetRef = createRef()
    const navigation = useNavigation()

    const [rooms, setRooms] = useState([])
    const [hasRooms, setHasRooms] = useState([])
    const [phoneNumber, setPhoneNumber] = useState()
    const [otp, setOTP] = useState('')
    const [isAuth, setIsAuth] = useState(false)
    const [isEnteredNumber, setIsEnteredNumber] = useState(false)
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState('');
    const [sheetClosable, setSheetClosable] = useState(false)
    const [doneAuth, setDoneAuth] = useState(false)

    React.useEffect(() => {
        // authActionSheetRef.current?.setModalVisible();

        navigation.addListener('focus', async () => {

            await storage.load({ key: 'phoneNumber' })
                .then(data => {
                    if (data !== null) {
                        setPhoneNumber(data)
                        setIsEnteredNumber(true)
                        setIsAuth(true)
                    }
                })
                .catch(e => {
                    authActionSheetRef.current?.setModalVisible();
                })

            await storage.load({ key: 'rooms' })
                .then(data => {
                    setLoading(false)
                    setRooms(data);

                    if (data.length > 0) setHasRooms(true)
                    else setHasRooms(false)
                })

                .catch(e => { setLoading(false); setHasRooms(false) })
            return;
        });

        return () => { }
    }, [navigation, isEnteredNumber, isAuth]);

    const hasRoomsLabel = () => {
        if (!hasRooms && isAuth) return <View style={globalStyles.flexCenterColumn}>
            <View style={globalStyles.space30}></View>
            <Text style={globalStyles.boldText}>No chats yet</Text>
            <Text style={globalStyles.boldText}>Get started by messaging a friend</Text>
        </View>
    }

    const triggerInputNumber = async () => {
        // authActionSheetRef.current?.setModalVisible(false);
        try {

            if (phoneNumber === undefined) {
                Alert.alert('', 'Please enter your phone number');
                return;
            }

            if (phoneNumber !== undefined && phoneNumber.length <= 5) {
                Alert.alert('', 'Check the length of the number you entered');
                return
            }

            if (countryCode && !isEnteredNumber) {
                setLoading(true)

                const newNumber = countryCode + phoneNumber
                const reponse = await axios.post('https://signal-v2-auth-server.herokuapp.com/auth/number', { 'number': newNumber })

                if (reponse.status === 200) {
                    setIsEnteredNumber(true)
                    setLoading(false)
                }
            } { Alert.alert('', 'Select your country'); return }

        } catch (e) {
            setLoading(false);

            if (e.message === 'Request failed with status code 400') {
                Alert.alert('', 'You entered the wrong phone number');
                return
            }

            if (e.message === 'Request failed with status code 501') {
                Alert.alert('', 'Please check your internet connection');
                return
            }

            Alert.alert('', 'Please try again later')
        }
    }

    const checkotp = async () => {
        try {
            const newNumber = countryCode + phoneNumber
            setLoading(true)
            const reponse = await axios.post('https://signal-v2-auth-server.herokuapp.com/auth/verify/number', { 'number': newNumber, 'otp': otp })

            if (reponse.data.valid) {

                try {
                    await storage.save({ key: 'phoneNumber', data: countryCode + phoneNumber })
                    await storage.save({ key: 'rooms', data: [] })
                    await storage.save({ key: 'contacts', data: [] })
                }
                catch (e) { }

                close()
                setDoneAuth(true)
                setIsAuth(true)
                setLoading(false)
            }

            else { alert('You entered the wrong code'); setLoading(false) }

        } catch (e) {
            setLoading(false)
            alert('A network error occured. Please try again')
        }
    }

    function close() {
        setSheetClosable(true)
        authActionSheetRef.current?.setModalVisible(false);
    }

    const authInterface = () => {

        // otp
        if (isEnteredNumber && !loading && !doneAuth) return (
            <View>
                <View style={{
                    backgroundColor: '#1e7ae4',
                    width: '100%',
                    height: 200,
                    marginTop: -20,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 30
                }} >

                    <Text style={[globalStyles.lgText, globalStyles.textAlignCenter]}>
                        Verify account
                    </Text>
                </View>

                <View style={{ paddingHorizontal: 20, zIndex: 20, paddingTop: 30, backgroundColor: '#fff', height: Dimensions.get('window').height }}>

                    <View style={globalStyles.space10} />
                    <Text style={[globalStyles.textAlignCenter, globalStyles.greyText, globalStyles.lineHeight]}> Enter the SMS code you received. This extra layer of security protects your account from attackers </Text>
                    <View style={globalStyles.space10} />

                    <TouchableOpacity onPress={() => setIsEnteredNumber(false)}>
                        <Text style={[globalStyles.textBtn, globalStyles.textAlignCenter]}>  Change number {countryCode + phoneNumber}? </Text>
                    </TouchableOpacity>
                    <View style={globalStyles.space30} />

                    <TextInput
                        autoFocus={true}
                        keyboardType='phone-pad'
                        style={globalStyles.authInputBox}
                        value={otp}
                        maxLength={6}
                        onChangeText={(value) => setOTP(value.split(/\s+/).join(""))} />

                    <View style={globalStyles.space30}></View>
                    <TouchableOpacity style={globalStyles.btn} onPress={() => checkotp()}>
                        <Text style={globalStyles.btnText}>Verify</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

        // phone number
        if (!isEnteredNumber && !loading && !doneAuth) return (
            <View>
                <View style={{
                    backgroundColor: '#1e7ae4',
                    width: '100%',
                    height: 200,
                    marginTop: -20,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 30
                }} >

                    <Text style={[globalStyles.lgText, globalStyles.textAlignCenter]}>
                        Input your phone number to start private messaging
                    </Text>

                </View>

                <View style={{ paddingHorizontal: 20, zIndex: 20, paddingTop: 30, backgroundColor: '#fff', height: Dimensions.get('window').height }}>
                    {/* <View style={globalStyles.flexCenterColumn}>
                        <Text style={[globalStyles.lgText, globalStyles.textAlignCenter]}>
                            Input your phone number to start private messaging
                        </Text>
                    </View>
                    <View style={globalStyles.space20}></View> */}
                    <Text style={[globalStyles.textAlignCenter, globalStyles.greyText, globalStyles.lineHeight]}>
                        Enter your number without your country code. You will receive a verification code by SMS
                    </Text>
                    <View style={globalStyles.space30}></View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                        textAlign: 'center',
                        fontSize: 20,
                        borderWidth: 1,
                        borderColor: '#d4d5d5',
                        width: '100%',
                        padding: 15,
                        borderRadius: 10,
                    }}>
                        <CountryPicker
                            // withModal={false}
                            withCallingCode={true}
                            withFilter={true}
                            // withCountryNameButton={true}
                            // onOpen={alert('')}
                            // visible={true}
                            onSelect={code => setCountryCode('+' + code.callingCode[0])} />

                        <Text style={{
                            color: '#1e7ae4',
                            fontSize: 20
                        }}>
                            {countryCode ? '' : '+000'} {countryCode}
                        </Text>
                    </View>

                    <View style={globalStyles.space20} />

                    <View style={globalStyles.flex}>

                        {/* <Text>{countryCode ? '' : '+000'} {countryCode}</Text> */}

                        {/* <View style={globalStyles.space20} /> */}
                        <TextInput
                            autoFocus={true}
                            keyboardType='phone-pad'
                            style={globalStyles.authInputBox}
                            value={phoneNumber}
                            placeholder='eg. 550202871'
                            // onChangeText={(value) => setPhoneNumber(value)} />
                            onChangeText={(value) => setPhoneNumber(value.replace(/[^a-zA-Z0-9]/g, "").split(/\s+/).join(""))} />
                    </View>

                    <View style={globalStyles.space30}></View>

                    <TouchableOpacity style={globalStyles.btn} onPress={() => triggerInputNumber()}>
                        <Text style={globalStyles.btnText}>Next</Text>
                    </TouchableOpacity>

                    {/* <Button style={globalStyles.btn} onPress={() => triggerInputNumber()} title='dd' /> */}
                </View>
            </View >
        )

        if (doneAuth) return (
            <View style={{
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity onPress={() => authActionSheetRef.current?.setModalVisible(false)}>
                    <Icon name={'lock-open'} size={100} color='#006aee' />
                </TouchableOpacity>
                <View style={globalStyles.space30} />
                <Text style={{
                    color: '#000', fontSize: 20, textAlign: 'center',
                    paddingHorizontal: 50,
                    fontWeight: 'bold'
                }}>
                    Press the lock to complete verification
                </Text>
            </View>
        )

        if (loading) return (
            <View style={[globalStyles.loader, globalStyles.flexCenterColumn]}>
                <ActivityIndicator size={50} color="#006aee" />
            </View>
        )

    }

    // HomeScreen
    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.appBar}>
                <View style={globalStyles.flex}>
                    {/* <TouchableOpacity onPress={() => { navigation.navigate(ProfilePage) }}>
                        <View style={globalStyles.appBarAvatar}></View>
                    </TouchableOpacity> */}
                    <Text style={globalStyles.appBarTitle}>Signal v2</Text>
                </View>

                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='ios-search-outline' size={22} color='#fff' />
                    </TouchableOpacity>
                    <View style={globalStyles.space30}></View>

                    <TouchableOpacity onPress={() => menuActionSheetRef.current?.setModalVisible()}>
                        <Icon name='ellipsis-vertical-outline' color='#fff' size={23} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={globalStyles.roundedScrollView}>
                {hasRoomsLabel()}
                {
                    rooms.map(
                        (room, index) => {
                            return <ChatRoomCard
                                key={index}
                                name={room.roomName}
                                data={room}
                                content={room.lastMessage}
                                counter={0} />
                        }
                    )
                }
            </ScrollView>

            {/* <Button
                onPress={() => navigation.navigate(ContactsPage)}
                title="Learn More"
            /> */}

            {/* onPress={() => { navigation.navigate(ContactsPage) }} */}

            <TouchableOpacity style={globalStyles.fab} onPress={() => navigation.navigate('ContactsPage')}>
                <Icon name='md-pencil-sharp' color='#fff' size={30} />
            </TouchableOpacity>

            <ActionSheet
                // gestureEnabled={true}
                // openAnimationSpeed={50}
                defaultOverlayOpacity={0}
                elevation={0}
                ref={authActionSheetRef}
                closable={sheetClosable}
                containerStyle={globalStyles.bottomSheet} >
                <View style={{
                    height: Dimensions.get('window').height
                }}>
                    {authInterface()}
                </View>
            </ActionSheet>

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0.05}
                elevation={0}
                ref={menuActionSheetRef}
                containerStyle={globalStyles.bottomSheet} >
                <View style={{
                    // height: Dimensions.get('window').height - 200
                }}>

                    <TouchableOpacity style={globalStyles.bottomSheetItem}><Text>Edit profile</Text></TouchableOpacity>
                    <TouchableOpacity style={globalStyles.bottomSheetItem}><Text>Settings</Text></TouchableOpacity>

                </View>
            </ActionSheet>
        </View>
    )
}

const ChatRoomCard = (props) => {

    const navigation = useNavigation()
    // const isFocused = navigation.isFocused();

    const [roomId, setRoomId] = useState('000')
    const [myNumber, setmyNumber] = useState()
    const [isTyping, setIsTyping] = useState(false)
    const contactNumber = props.data.roomNumber

    useEffect(async () => {
        const getMyNumber = async () => {
            await storage.load({ key: 'phoneNumber' }).then(number => { setmyNumber(number) }).catch(e => { console.log(e) })
        }

        const getRoomID = () => {
            if (contactNumber < myNumber) setRoomId((contactNumber + myNumber).replace(/[^a-zA-Z0-9]/g, "").split(/\s+/).join(""));
            else setRoomId((myNumber + contactNumber).replace(/[^a-zA-Z0-9]/g, "").split(/\s+/).join(""));
        }

        const connectToSocket = () => {
            console.log('connecting to ws...', roomId)
            socket.emit('join-room', roomId)
            socket.on('typing', () => { setIsTyping(true); setTimeout(() => { setIsTyping(false) }, 3000); })
            socket.on('new-message', (data) => {
                if (data.from === props.data.roomNumber) showNotification(data)
            })
        }

        await getMyNumber()
        getRoomID()
        connectToSocket()


        return () => { }
    }, [roomId, myNumber, contactNumber])

    function showNotification(data) {
        Notifications.scheduleNotificationAsync({
            content: {
                title: `${data.fromName}: `,
                body: data.msg,
                sound: true,
                color: '#006aee'
            },
            trigger: { seconds: 1 },
        });
    }

    // constants
    const counter = () => {
        if (props.counter > 0) return (<Text style={globalStyles.badgeNum}>{props.counter}</Text>)
    }

    // const typingUi = () => {
    //     if (isTyping) return <Text style={{
    //         color: '#006aee',
    //     }}>typing...</Text>

    //     else return <Text style={globalStyles.greyText} numberOfLines={1}>{props.content}</Text>
    // }

    const styles = StyleSheet.create({
        nameTime: {
            width: Dimensions.get('window').width - 120,
        },

        smallText: {
            fontSize: 11,
        },
    })

    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#fff',
                paddingBottom: 8,
            }}
            onPress={() => { navigation.navigate('ChatPage', { roomData: props.data }) }}>
            <View style={globalStyles.userCard}>
                {/* <Image
                    style={globalStyles.userAvatar}
                    source={{ uri: 'https://i.pinimg.com/236x/af/1c/30/af1c30d6d881d9447dec06149f61d2f9--drawings-of-girls-anime-drawings-girl.jpg' }} /> */}

                <View style={[globalStyles.letterAvatar]}>
                    <Text style={globalStyles.letterAvatarText}>{props.name.split('')[0]}</Text>
                </View>

                <View>
                    <View style={[globalStyles.flexBetween, styles.nameTime]}>
                        <Text style={[globalStyles.userCardTitle, globalStyles.boldText]}>{props.name}</Text>
                        <View style={globalStyles.flex}>
                            {counter()}
                            <Text style={[globalStyles.greyText, styles.smallText]}>{props.data.lastMessageTimestamp}</Text>
                        </View>
                    </View>
                    {/* {typingUi()} */}
                    <Text style={[globalStyles.greyText, globalStyles.userCardDescription]} numberOfLines={1}>{props.content}</Text>
                </View>
            </View>

        </TouchableOpacity>

    )
}

// const SearchPage = ({ navigation }) => {
//     return (
//         <SafeAreaView style={globalStyles.container}>
//             <View style={globalStyles.appBar}>
//                 <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name='ios-arrow-back-outline' color='#006aee' size={22} /></TouchableOpacity>
//                 <TextInput autoFocus={true} style={[globalStyles.inputBox, globalStyles.searchInputBox]} placeholder='Search' />
//             </View>
//         </SafeAreaView>
//     )
// }

export default HomeScreen