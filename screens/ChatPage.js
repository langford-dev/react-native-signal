import React, { useEffect, useRef, useState, createRef } from 'react'
import { Text, View, StyleSheet, LinearGradient, StatusBar, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import io from "socket.io-client";
import storage from '../storage/storage';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from "react-native-actions-sheet";
import axios from 'axios';
// import * as Notifications from "expo-notifications";
import { parsePhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js'

// const socket = io('http://localhost:8000')
const socket = io('https://signal-v2-server.herokuapp.com/')

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//     }),
// });

const ChatPage = ({ navigation, route }) => {
    const actionSheetRef = createRef();
    const chatBackgroungImg = { uri: "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png" };
    const contactName = route.params.roomData.roomName
    const [contactNumber, setContactNumber] = useState(route.params.roomData.roomNumber)

    const [messageText, setMessageText] = useState()
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([])
    const [showSendBtn, setShowSendBtn] = useState(false)
    const [mounted, setMounted] = useState(true)
    const [myName, setmyName] = useState('Robbie')
    const [roomId, setRoomId] = useState('000')
    const [allRooms, setAllRooms] = useState([])
    const [myNumber, setMyNumber] = useState()

    const scrollViewRef = useRef();

    React.useEffect(async () => {
        const phoneNumber = parsePhoneNumber(contactNumber, 'GH')
        setContactNumber((phoneNumber.formatInternational()).split(/\s+/).join(""))

        console.log('myNumber', getRoomID())

        const initApp = async () => {
            try {
                await storage.load({ key: 'phoneNumber' }).then(number => {
                    setMyNumber(number)
                    setRoomId(getRoomID())
                    initializeChatroom()


                    // scrollViewRef.current.scrollToEnd({ animated: true })
                });
            } catch (error) {
                console.log(error)
            }
        }

        const initWebSockets = () => {
            socket.emit('join-room', roomId)
            socket.on('typing', () => { setIsTyping(true); setTimeout(() => { setIsTyping(false) }, 3000); })
            socket.on('new-message', async (data) => {
                setMessages([...messages, data])
                scrollViewRef.current.scrollToEnd()

                let a = [...messages, data]
                await storage.save({ key: roomId, data: a }).catch(e => { })
            })
        }

        await initApp()
        initWebSockets()

        navigation.addListener('beforeRemove', (e) => {
            //on screen exit
        })

        return (e) => { console.log(e) };
    }, [messages, roomId]);

    useEffect(async () => {
        const showSavedMessages = async () => {
            try {
                storage.load({ key: roomId }).then(data => {
                    console.log(data.length)
                    setMessages(data)
                    scrollViewRef.current.scrollToEnd()
                }).catch(e => console.log(e))
            } catch (error) {
                console.log(error)
            }
        }

        showSavedMessages()

        return () => { }
    }, [roomId]);


    function getRoomID() {
        if (contactNumber < myNumber) return (contactNumber + myNumber).replace(/[^a-zA-Z0-9]/g, "").split(/\s+/).join("");
        else return (myNumber + contactNumber).replace(/[^a-zA-Z0-9]/g, "").split(/\s+/).join("")
    }

    const initializeChatroom = async () => {
        storage.load({ key: 'rooms' })
            .then(data => {
                setAllRooms(data)
                const currentObject = data.find(obj => { return obj.roomNumber === contactNumber })


                if (currentObject === undefined) {
                    let savedChats = data

                    const newRoomData = {
                        roomNumber: contactNumber,
                        roomName: contactName,
                        lastMessage: `You are connected to ${contactName} 🔌`,
                        avatar: 'https://i.pinimg.com/236x/af/1c/30/af1c30d6d881d9447dec06149f61d2f9--drawings-of-girls-anime-drawings-girl.jpg',
                        lastMessageTimestamp: Date().substr(16, 5),
                    }

                    savedChats = [...data, newRoomData]

                    storage.save({
                        key: 'rooms',
                        data: savedChats
                    })
                }
            })
            .catch(e => {
                console.log(e);
                storage.save({
                    key: 'rooms',
                    data: []
                })
            })
    }

    function handleTextInput(value) {
        setMessageText(value);

        if (value.trim() != '') setShowSendBtn(true)
        else setShowSendBtn(false)

        socket.emit('typing')
    }

    function clearChat(navigation) {

        Alert.alert('', 'Are you sure you want to clear messages in this chat?', [
            { text: "CANCEL", onPress: () => { } },

            {
                text: "OK", onPress: async () => {
                    await storage.remove({
                        key: roomId
                    })

                    setMessages([])
                }
            },
        ])
    }

    async function sendMessage() {
        const messageId = Date.now() + Math.random(10000).toFixed(0)
        const newMsgObject = {
            'from': myNumber,
            'fromName': myName,
            'to': contactNumber,
            'toName': contactName,
            'msg': messageText,
            'msgId': messageId,
            'roomId': roomId,
            'timestamp': Date().substr(16, 5),
            'sent': false,
        }

        setMessages([...messages, newMsgObject])
        scrollViewRef.current.scrollToEnd()
        setMessageText('')
        setShowSendBtn(false)

        socket.emit('new-message', JSON.stringify(newMsgObject))
        editChatroomsArray(messageText)

        let a = [...messages, newMsgObject]
        await storage.save({ key: roomId, data: a }).catch(e => { })
    }

    function editChatroomsArray(msgText) {
        const currentRoom = allRooms.find(obj => { return obj.roomNumber === contactNumber })
        const rooms = allRooms
        let currentRoomIndex = 0

        for (let i = 0; i < rooms.length; i++) {
            const element = rooms[i];

            if (element === currentRoom) {
                currentRoomIndex = i
                rooms.splice(i, 1);
                const newRoomData = {
                    roomNumber: contactNumber,
                    roomName: contactName,
                    lastMessage: msgText,
                    avatar: 'https://i.pinimg.com/236x/af/1c/30/af1c30d6d881d9447dec06149f61d2f9--drawings-of-girls-anime-drawings-girl.jpg',
                    lastMessageTimestamp: Date().substr(16, 5),
                }

                rooms.push(newRoomData)
                // console.log('currentRoom', currentRoom)
            }

        }

        const newChatroomsArray = changeRoomPosition(rooms, currentRoomIndex, 0)
        storage.save({ key: 'rooms', data: newChatroomsArray })
        // console.log('currentRoomIndex', currentRoomIndex)
    }

    function changeRoomPosition(arrayList, old_index, new_index) {
        if (new_index >= arrayList.length) {
            var k = new_index - arrayList.length + 1;
            while (k--) {
                arrayList.push(undefined);
            }
        }
        arrayList.splice(new_index, 0, arrayList.splice(old_index, 1)[0]);
        return allRooms;
    };

    function isEmoji(str) {
        const ranges = [
            '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
        ];

        if (str.length === 2) {
            if (str.match(ranges.join('|'))) {
                return true;
            } else {
                return false;
            }
        }
    }

    // constants
    const typingUI = () => {
        if (isTyping)
            return <View style={globalStyles.appBarAlertUI}>
                <Text style={[globalStyles.whiteText, globalStyles.boldText]}> typing... </Text>
            </View>
    }

    const sendBtn = () => {
        if (showSendBtn) {
            return (
                <TouchableOpacity style={globalStyles.sendBtn} onPress={() => sendMessage()}>
                    <Icon name='ios-send' color='#006aee' size={35} />
                </TouchableOpacity>
            )
        }

        // else return (
        //     <View style={[globalStyles.flex, styles.textInputContainerIcons]}>
        //         <TouchableOpacity style={{
        //             backgroundColor: '#006aee',
        //             borderRadius: 100,
        //             width: 47,
        //             height: 47,
        //             marginLeft: -1,
        //             flexDirection: 'row',
        //             alignItems: 'center',
        //             justifyContent: 'center'

        //         }}><Icon name='ios-add-outline' color='#fff' size={35} /></TouchableOpacity>
        //         {/* <View style={globalStyles.space10}></View> */}
        //         {/* <TouchableOpacity><Icon name='ios-camera-outline' color='#006aee' size={29} /></TouchableOpacity> */}
        //     </View>
        // )
    }

    const MessageItemUi = (data) => {
        // my message
        if (data.from === myNumber && !isEmoji(data.msg)) return (
            <View style={[globalStyles.messageBubble, globalStyles.myMessageBubble]}>
                <Text>
                    <Text style={[globalStyles.messageText, globalStyles.myMessageText]}>{data.msg}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={[globalStyles.smallText, globalStyles.myTimestamp]}>{data.timestamp}</Text>
                </Text>
            </View >
        )

        // my emoji message
        if (data.from === myNumber && isEmoji(data.msg)) return (
            <View style={[globalStyles.emojiBubble, globalStyles.myEmojiBubble]}>
                <Text>
                    <Text style={[globalStyles.smallText, globalStyles.myTimestamp, globalStyles.greyText]}>{data.timestamp}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={[globalStyles.messageText, globalStyles.myMessageText, globalStyles.emojiText]}>{data.msg}</Text>
                </Text>
            </View>
        )

        // message
        if (data.from !== myNumber && !isEmoji(data.msg)) return (
            <View style={globalStyles.messageBubble}>
                <Text>
                    <Text style={[globalStyles.smallText, globalStyles.timestamp, globalStyles.greyText]}>{data.timestamp}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={globalStyles.messageText}>{data.msg}</Text>
                </Text>
            </View>
        )

        // emoji message
        if (data.from !== myNumber && isEmoji(data.msg)) return (
            <View>
                <Text>
                    <Text style={[globalStyles.smallText, globalStyles.timestamp, globalStyles.greyText]}>{data.timestamp}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={[globalStyles.messageText, globalStyles.myMessageText, globalStyles.emojiText]}>{data.msg}</Text>
                </Text>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.appBar}>
                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name='ios-arrow-back-outline' color='#fff' size={25} />
                    </TouchableOpacity>
                    <View style={globalStyles.space20}></View>
                    <View style={globalStyles.flex}>
                        <View style={[globalStyles.appBarAvatar, styles.chatPageAvatar]}></View>
                        <View><Text numberOfLines={1} style={globalStyles.appBarTitle}>{contactName}</Text></View>
                    </View>
                </View>

                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(); }}>
                        <Icon name='ellipsis-vertical-outline' color='#fff' size={23} />
                    </TouchableOpacity>
                </View>
            </View>

            {typingUI()}

            <Image source={chatBackgroungImg} resizeMode="cover" style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                zIndex: -100,
                position: 'absolute'
            }} />

            <ScrollView ref={scrollViewRef} style={{ marginBottom: 63 }}>
                {/* <View style={globalStyles.flexCenterColumn}>
                    <View style={globalStyles.space30}></View>
                    <View style={globalStyles.avatarMD}></View>
                    <View style={globalStyles.space30}></View>
                    <Text style={[globalStyles.whiteText, globalStyles.mdtext, globalStyles.boldText]}>{contactName}</Text>
                </View> */}

                <TouchableOpacity
                    onPress={() => Alert.alert('Privacy', 'Your conversation is relayed over a secured encrypted peer to peer connection. This means your messages stay between you and the people you choose')}
                    style={[globalStyles.flexCenter, globalStyles.e2eLabelContainer]}>
                    <Text style={globalStyles.e2eLabel}>Your chat is private and encrypted</Text>
                </TouchableOpacity>

                {
                    messages.map(
                        (msg, index) => {
                            return <View key={index}>{MessageItemUi(msg)}</View>
                        }
                    )
                }

                {/* <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}> <Text> Your Text Here </Text> </LinearGradient> */}
            </ScrollView>

            <View style={styles.textInputContainer}>
                <Image source={chatBackgroungImg} resizeMode="cover" style={{
                    width: Dimensions.get('window').width,
                    height: 70,
                    position: 'absolute',
                    // marginTop: 7,
                    // zIndex: -100,
                }} />

                <View style={[globalStyles.flex, globalStyles.inputBoxIcon]} >
                    <Icon name='happy-outline' color='#006aee' size={30} />
                    <KeyboardAvoidingView>
                        <TextInput
                            style={globalStyles.inputBoxIconInput}
                            multiline={true}
                            maxLength={300}
                            placeholder='Type a message...'
                            value={messageText}
                            onChangeText={(value) => handleTextInput(value)}
                        />
                    </KeyboardAvoidingView>
                </View>

                {sendBtn()}
                {/* {otherInputBoxButtons()} */}
            </View>

            <ActionSheet
                gestureEnabled={true}
                // bounceOnOpen={true}
                // openAnimationSpeed={10}
                // bounciness={5}
                defaultOverlayOpacity={0.05}
                elevation={0}
                ref={actionSheetRef}
                containerStyle={globalStyles.bottomSheet}
                indicatorColor={'#ccc'}>

                <View>
                    <TouchableOpacity onPress={() => clearChat(navigation)} style={globalStyles.bottomSheetItem}><Text>Clear chats</Text></TouchableOpacity>
                    <TouchableOpacity style={globalStyles.bottomSheetItem}><Text>View profile</Text></TouchableOpacity>
                    <TouchableOpacity style={globalStyles.bottomSheetItem}><Text>Hide your typing flag</Text></TouchableOpacity>
                    <TouchableOpacity style={globalStyles.bottomSheetItem}><Text>Video call</Text></TouchableOpacity>
                    <TouchableOpacity style={globalStyles.bottomSheetItem}><Text>Voice call</Text></TouchableOpacity>
                </View>
            </ActionSheet>
        </View >
    )
}



const styles = StyleSheet.create({
    appBar: {
        borderBottomColor: '#24242411',
        borderBottomWidth: 1,
        backgroundColor: '#f1f1f1',
        height: 'auto',
        paddingBottom: 10,
        marginTop: -50,
        paddingTop: StatusBar.currentHeight + 40
    },

    chatPageAvatar: {
        // backgroundColor: '#fff',
        width: 30,
        height: 30
    },

    roomName: {
        fontSize: 22,
    },

    textInputContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        // backgroundColor: '#fff',
        zIndex: 100,
        alignItems: 'baseline',
        // paddingTop: 0,
        paddingBottom: Platform.OS === 'ios' ? 35 : StatusBar.currentHeight + -20,
    },

    textInputContainerIcons: {
        marginLeft: 10
    },

    inputBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        // backgroundColor: '#ddd',
        color: '#fff',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        color: '#000',
        flex: 1,
        marginLeft: 15,
        // fontSize: 17,
    },

    textBtn: {
        marginLeft: 10
    },

    messagesContainer: {
        marginBottom: 48,
    },

    smallText: {
        fontSize: 11,
        color: '#24242466'
    },
})

export default ChatPage