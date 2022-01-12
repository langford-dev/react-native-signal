import React from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native'
import globalStyles from '../styles/globalStyles'
import Icon from 'react-native-vector-icons/Ionicons';

const ProfilePage = ({ navigation }) => {
    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.appBar}>
                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name='ios-arrow-back-outline' color='#006aee' size={25} />
                    </TouchableOpacity>
                    <Text style={globalStyles.appBarTitle}>Settings</Text>
                </View>

                <View style={globalStyles.flex}>
                    <TouchableOpacity onPress={() => { navigation.navigate('SearchPage') }}>
                        <Icon name='ios-search-outline' color='#006aee' size={25} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.container}>
                <TouchableOpacity activeOpacity={0.6} style={[globalStyles.flex, styles.profileImgContainer]}>
                    <View style={styles.avatarMD}></View>
                    <View style={globalStyles.space20}></View>
                    <View>
                        <Text style={globalStyles.mdtext} numberOfLines={1}>Gerald</Text>
                        <Text style={globalStyles.greyText} numberOfLines={1}>just Google it 🌼</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.flexBetween, globalStyles.touchableTextUI]}>
                    <View style={globalStyles.flex}>
                        <Icon name='ios-person-outline' color='#000' size={25} />
                        <View style={globalStyles.space20}></View>
                        <Text style={globalStyles.touchableTextUIText}>Account</Text>
                    </View>
                    {/* <Icon name='ios-chevron-forward-outline' color='#006aee' size={25} /> */}
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.flexBetween, globalStyles.touchableTextUI]}>
                    <View style={globalStyles.flex}>
                        <Icon name='ios-shield-checkmark-outline' color='#000' size={25} />
                        <View style={globalStyles.space20}></View>
                        <Text style={globalStyles.touchableTextUIText}>Privacy</Text>
                    </View>
                    {/* <Icon name='ios-chevron-forward-outline' color='#006aee' size={25} /> */}
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.flexBetween, globalStyles.touchableTextUI]}>
                    <View style={globalStyles.flex}>
                        <Icon name='brush-outline' color='#000' size={25} />
                        <View style={globalStyles.space20}></View>
                        <Text style={globalStyles.touchableTextUIText}>Appearance</Text>
                    </View>
                    {/* <Icon name='ios-chevron-forward-outline' color='#006aee' size={25} /> */}
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.flexBetween, globalStyles.touchableTextUI]}>
                    <View style={globalStyles.flex}>
                        <Icon name='ios-save-outline' color='#000' size={25} />
                        <View style={globalStyles.space20}></View>
                        <Text style={globalStyles.touchableTextUIText}>Storage and data</Text>
                    </View>
                    {/* <Icon name='ios-chevron-forward-outline' color='#006aee' size={25} /> */}
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.flexBetween, globalStyles.touchableTextUI]}>
                    <View style={globalStyles.flex}>
                        <Icon name='ios-help-outline' color='#000' size={25} />
                        <View style={globalStyles.space20}></View>
                        <Text style={globalStyles.touchableTextUIText}>Help</Text>
                    </View>
                    {/* <Icon name='ios-chevron-forward-outline' color='#006aee' size={25} /> */}
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarMD: {
        width: 80,
        height: 80,
        backgroundColor: '#f1f1f1',
        borderRadius: 100,
    },

    profileImgContainer: {
        // borderBottomColor: '#f1f1f1',
        // borderBottomWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },

    container: {
        backgroundColor: '#fff'
    }
})

export default ProfilePage