import React from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import globalStyles from '../styles/globalStyles'
import ChatPage from '../screens/ChatPage'

const ContactCard = (props) => {
    const styles = StyleSheet.create({
        nameTime: {
            width: Dimensions.get('window').width - 120,
        },

        smallText: {
            fontSize: 11,
        },
    })
    const counter = () => {
        if (props.counter > 0) return (<Text style={globalStyles.badgeNum}>{props.counter}</Text>)
    }

    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#fff',
                paddingBottom: 8,
            }}
            onPress={() => { navigation.navigate('ChatPage') }}>
            <View style={globalStyles.userCard}>
                <Image
                    style={globalStyles.userAvatar}
                    source={{ uri: 'https://i.pinimg.com/236x/af/1c/30/af1c30d6d881d9447dec06149f61d2f9--drawings-of-girls-anime-drawings-girl.jpg' }} />

                <View>
                    <View style={[globalStyles.flexBetween, styles.nameTime]}>
                        <Text style={[globalStyles.userCardTitle, globalStyles.boldText]}>{props.name}</Text>
                        <View style={globalStyles.flex}>
                            {counter()}
                            <Text style={[globalStyles.greyText, styles.smallText]}>12:45pm</Text>
                        </View>
                    </View>
                    <Text style={globalStyles.greyText} numberOfLines={1}>{props.username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ContactCard