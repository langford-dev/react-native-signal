import React, { useState, useEffect } from 'react'
import { ScrollView, View, TextInput, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Image, Text, } from 'react-native'
import * as Contacts from 'expo-contacts';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import ChatPage from './ChatPage';
import Icon from 'react-native-vector-icons/Ionicons';
import { parsePhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js'


const ContactsPage = () => {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()

    useEffect(() => {

        (async () => {
            // console.log('phoneNumber ---->', phoneNumber.formatInternational())

            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({ fields: [Contacts.PHONE_NUMBERS] });

                if (data.length > 0) {
                    const newContactsList = []

                    data.forEach(contact => {
                        if (typeof contact.phoneNumbers !== 'undefined') {
                            // console.log(contact.phoneNumbers[0].countryCode.toUpperCase())

                            try {
                                const phoneNumber = parsePhoneNumber(contact.phoneNumbers[0].number, 'GH')
                                contact.phoneNumbers[0].number = (phoneNumber.formatInternational()).split(/\s+/).join("")

                                // console.log(validatePhoneNumberLength(phoneNumber.formatInternational()))
                                newContactsList.push(contact)

                                console.log(contact.phoneNumbers[0].number)

                            } catch (e) { console.log(e) }
                        }
                    })
                    // console.log(newContactsList[50])

                    // for (let contactInfo = 0; contactInfo < data.length; contactInfo++) {
                    //     const element = data[contactInfo];
                    //     if (typeof element.phoneNumbers !== 'undefined') newContactsList.push(element)
                    // }



                    setContacts(newContactsList);
                    setLoading(false)

                    try {
                        // const phoneNumber = parsePhoneNumber('0550202871')
                        // console.log('phoneNumber ---->', phoneNumber.country)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        })();
    }, []);

    const loader = () => {
        if (loading) return (
            <View style={globalStyles.loader}>
                <ActivityIndicator size={50} color="#006aee" />
            </View>
        )
    }


    return (
        <View>
            <View style={globalStyles.appBar}>
                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name='ios-arrow-back-outline' color='#fff' size={25} />
                    </TouchableOpacity>
                    <View style={globalStyles.space20} />
                    <Text style={globalStyles.appBarTitle}>New Message</Text>
                </View>
                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { navigation.navigate('SearchPage') }}>
                        <Icon name='ios-search-outline' color='#fff' size={23} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={globalStyles.roundedScrollView}>
                {loader()}
                {
                    contacts.map(
                        (contact, index) => {
                            return <TouchableOpacity key={index}
                                style={{ backgroundColor: '#fff', paddingBottom: 8, }}
                                onPress={() => {
                                    navigation.navigate('ChatPage', {
                                        roomData: {
                                            roomName: contact.name,
                                            roomNumber: contact.phoneNumbers[0].number
                                        }
                                    })
                                }}>
                                <View style={globalStyles.userCard}>
                                    <View style={globalStyles.letterAvatar}>
                                        <Text style={globalStyles.letterAvatarText}>{contact.name.split('')[0]}</Text>
                                    </View>

                                    <View>
                                        <Text style={[globalStyles.userCardTitle, globalStyles.boldText]}>{contact.name}</Text>
                                        <Text style={[globalStyles.greyText, globalStyles.smallText]}>{contact.phoneNumbers[0].number}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    )
                }
            </ScrollView>
        </View>
    )

    // return (<></>)
}

export default ContactsPage