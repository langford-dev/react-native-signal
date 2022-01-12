import React, { useEffect, useRef, useState, createRef } from 'react'
import { Text, View, StyleSheet, ImageBackground, StatusBar, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import io from "socket.io-client";
import storage from '../storage/storage';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from "react-native-actions-sheet";
import axios from 'axios';
import * as Notifications from "expo-notifications";

const socket = io('http://localhost:8000')
// const socket = io('https://signal-v2-server.herokuapp.com/')

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});


function ChatPage({ navigation, route }) {
    const actionSheetRef = createRef();
    const chatBackgroungImg = { uri: "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png" };
    const CONTACT_NAME = route.params.roomData.roomName
    const CONTACT_NUMBER = route.params.roomData.roomNumber
    // let myNumber = ''
    // let myName = 'abigail'
    // let roomId = ''
    const [messageText, setMessageText] = useState()
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([])
    const [showSendBtn, setShowSendBtn] = useState(false)
    const [mounted, setMounted] = useState(true)
    const [myName, setmyName] = useState('Robbie')
    const [myNumber, setMyNumber] = useState('')
    const [roomId, setRoomId] = useState('')
    // const [forceRerender, setForceRerender] = React.useState(true);

    // async function setMyNumber() {
    //     console.log('setting my number...');
    //     await storage.load({ key: 'phoneNumber' }).then(number => { setMyNumber(number) })
    //     console.log('setMyNumber...', myNumber);
    // }


    useEffect(async () => {
        // call functions on mount
        await storage.load({ key: 'phoneNumber' }).then(number => {
            console.log('number', number)
            setMyNumber(number)


            getRoomID()
            initializeChatroom()
            setInterval(() => { listenForSockets() }, 1000);

            console.log('my number ->', myNumber, '->', roomId, `\n`)
        })
        // await storage.load({ key: 'phoneNumber' }).then(number => { myNumber = number })

        return () => {
            setMounted(false);
            console.log('mounted', mounted)
        }
    }, [])

    // functions
    async function listenForSockets() {
        socket.on('typing', () => { setIsTyping(true); setTimeout(() => { setIsTyping(false) }, 5000); })
    }

    function getRoomID() {
        if (CONTACT_NUMBER < myNumber) setRoomId((CONTACT_NUMBER + myNumber).split(/\s+/).join(""));
        else setRoomId((myNumber + CONTACT_NUMBER).split(/\s+/).join(""));
    }

    function initializeChatroom() {
        console.log('initializing chatroom: ', roomId, `\n`);
        storage.load({ key: 'chatrooms' })
            .then(data => {
                console.log('number of rooms', data.length, `\n`);
                const currentObject = data.find(obj => { return obj.roomID === roomId })

                if (currentObject === undefined) {
                    let savedChats = data
                    const newRoomData = {
                        roomID: roomId,
                        roomNumber: CONTACT_NUMBER,
                        roomName: CONTACT_NAME,
                        lastMessage: `You are connected to ${CONTACT_NAME} 🔌`,
                        avatar: 'https://i.pinimg.com/236x/af/1c/30/af1c30d6d881d9447dec06149f61d2f9--drawings-of-girls-anime-drawings-girl.jpg',
                        lastMessageTimestamp: Date().substr(16, 5),
                    }
                    savedChats.push(newRoomData)
                    storage.save({
                        key: 'chatrooms',
                        data: savedChats
                    })
                }
            })
            .catch(e => {
                console.log(e);
                storage.save({
                    key: 'chatrooms',
                    data: []
                })
            })
    }

    function handleTextInput(value) {
        if (setMounted) setMessageText(value);
        socket.emit('typing')
        if (value.trim() != '') setShowSendBtn(true)
        else setShowSendBtn(false)
    }

    async function clearChat(navigation) {
        await storage.remove({
            key: roomId
        });
        setMessages([])
        navigation.goBack()
    }

    async function sendMessage() {

        // let myNum = ''
        // let myName = 'terry'
        // const personName = route.params.roomData.roomName
        // const personNum = route.params.roomData.roomNumber
        // let roomId = ''

        const messageId = Date.now() + Math.random(10000).toFixed(0)
        const newMsgObject = {
            'from': myNumber,
            'fromName': myName,
            'to': CONTACT_NUMBER,
            'toName': CONTACT_NAME,
            'msg': messageText,
            'msgId': messageId,
            'roomId': roomId,
            'timestamp': Date().substr(16, 5),
            'sent': false,
        }

        setMessages([...messages, newMsgObject])
        setMessageText('')
        setShowSendBtn(false)

        socket.emit('new-message', JSON.stringify(newMsgObject))
    }

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
        if (isTyping) return <View style={globalStyles.appBarAlertUI}>
            <Text style={[globalStyles.whiteText, globalStyles.boldText]}> typing... </Text>
        </View>
    }

    // const refreshUI = () => { if (refresh) return <></> }

    const sendBtn = () => {
        if (showSendBtn) {
            return (
                <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
                    <Icon name='ios-send' color='#006aee' size={35} />
                </TouchableOpacity>
            )
        }
    }

    const MessageItemUi = (data) => {
        console.log(myNumber)

        // let myNum = ''
        // await storage.load({ key: 'phoneNumber' }).then(number => { myNum = number })
        // console.log(isEmoji('myNum', myNum));

        if (data.from === myNumber && !isEmoji(data.msg)) return (
            <View style={[globalStyles.messageBubble, globalStyles.myMessageBubble]}>
                <Text>
                    <Text style={[globalStyles.messageText, globalStyles.myMessageText]}>{myNumber}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={[globalStyles.smallText, globalStyles.myTimestamp]}>{data.timestamp}</Text>
                </Text>
            </View>
        )

        if (data.from !== myNumber && !isEmoji(data.msg)) return (
            <View style={globalStyles.messageBubble}>
                <Text>
                    <Text style={globalStyles.messageText}>{myNumber}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={globalStyles.smallText}>{data.timestamp}</Text>
                </Text>
            </View>
        )

        if (data.from === myNumber && isEmoji(data.msg)) return (
            <View style={[globalStyles.emojiBubble, globalStyles.myEmojiBubble]}>
                <Text>
                    <Text style={[globalStyles.messageText, globalStyles.myMessageText, globalStyles.emojiText]}>{data.msg}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={[globalStyles.smallText, globalStyles.myTimestamp, globalStyles.greyText]}>{data.timestamp}</Text>
                </Text>
            </View>
        )

        if (data.from !== myNumber && isEmoji(data.msg)) return (
            <View>
                <Text>
                    <Text style={[globalStyles.messageText, globalStyles.myMessageText, globalStyles.emojiText]}>{data.msg}</Text>
                    <View style={globalStyles.space10}></View>
                    <Text style={[globalStyles.smallText, globalStyles.myTimestamp, globalStyles.greyText]}>{data.timestamp}</Text>
                </Text>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.appBar}>
                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name='ios-arrow-back-outline' color='#006aee' size={25} />
                    </TouchableOpacity>
                    <View style={globalStyles.space20}></View>
                    <View style={globalStyles.flex}>
                        <View style={[globalStyles.appBarAvatar, styles.chatPageAvatar]}></View>
                        <View><Text numberOfLines={1} style={globalStyles.appBarTitle}>{CONTACT_NAME}</Text></View>
                    </View>
                </View>

                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(); }}>
                        <Icon name='ellipsis-vertical-outline' color='#006aee' size={23} />
                    </TouchableOpacity>
                </View>
            </View>

            {typingUI()}
            {/* {forceRerender} */}

            <Image source={chatBackgroungImg} resizeMode="cover" style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                zIndex: -100,
                position: 'absolute'
            }} />

            <ScrollView style={{ position: 'relative', paddingTop: 50, marginBottom: 70 }}>
                <View style={globalStyles.flexCenterColumn}>
                    <View style={globalStyles.space30}></View>
                    <View style={globalStyles.avatarMD}></View>
                    <View style={globalStyles.space30}></View>
                    <Text style={[globalStyles.whiteText, globalStyles.mdtext, globalStyles.boldText]}>{CONTACT_NAME}</Text>
                </View>

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
            </ScrollView>

            <View style={styles.textInputContainer}>

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

                {/* <Icon name='ios-add-outline' color='#006aee' size={35} />
                <TextInput style={styles.inputBox}
                    multiline={true}
                    maxLength={300}
                    placeholder='Type a message...'
                    value={messageText}
                    onChangeText={(value) => handleTextInput(value)} />
                {sendBtn()} */}
            </View>

            <ActionSheet
                gestureEnabled={true}
                bounceOnOpen={true}
                openAnimationSpeed={10}
                bounciness={5}
                defaultOverlayOpacity={0.1}
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
        backgroundColor: '#fff',
        zIndex: 100,
        alignItems: 'baseline',
        paddingBottom: Platform.OS === 'ios' ? 35 : StatusBar.currentHeight + -18,
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

    sendBtn: {
        // backgroundColor: '#242424',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },

    textBtn: {
        marginLeft: 10
    },

    messagesContainer: {
        marginBottom: 48,
    },

    // messageText: {
    //     borderRadius: 20,
    //     lineHeight: 20,
    //     borderWidth: 1,
    //     borderColor: '#cccccc55',
    //     maxWidth: 300,
    //     padding: 15,
    //     paddingHorizontal: 30,
    //     paddingLeft: 15,
    //     paddingBottom: 30,
    //     // marginBottom: 10,
    //     position: 'relative',
    //     alignSelf: 'flex-start',
    //     marginBottom: 15,
    //     marginRight: 10,
    //     marginLeft: 13,
    //     // fontSize: 15
    // },

    // emojiOnly: {
    //     backgroundColor: 'transparent',
    //     padding: 0,
    //     fontSize: 65,
    //     marginTop: 0,
    //     paddingTop: 20,
    //     borderWidth: 0,
    //     marginBottom: 40,
    //     marginLeft: 12,
    // },

    // emojiOnlyItem: {
    //     height: 60,
    //     padding: 0,
    // },

    // myMessage: {
    //     backgroundColor: '#006aee',
    //     color: '#fff',
    //     alignSelf: 'flex-end',
    //     paddingRight: 15,
    //     paddingLeft: 30,
    // },

    // timestamp: {
    //     position: 'absolute',
    //     left: 25,
    //     bottom: 25,
    // },

    // myTimestamp: {
    //     position: 'absolute',
    //     right: 25,
    //     bottom: 25,
    //     color: '#fff'
    // },

    // myMessageItem: {
    //     // alignSelf: 'flex-end',
    //     width: '100%',
    //     position: 'relative',
    //     marginBottom: 10,
    // },

    smallText: {
        fontSize: 11,
        color: '#24242466'
    },
})

export default ChatPage