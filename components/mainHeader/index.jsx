import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { global, ResponsiveSize } from '../constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import * as UserProfile from '../../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import TextC from '../text/text';
const width = Dimensions.get('window').width;


const MainHeader = ({ GetUserProfileReducer, loading }) => {
    const navigation = useNavigation()
    const styles = StyleSheet.create({
        NotifyPin: {
            height: ResponsiveSize(8),
            width: ResponsiveSize(8),
            borderRadius: ResponsiveSize(8),
            backgroundColor: global.red,
            position: 'absolute',
            top: ResponsiveSize(2),
            right: ResponsiveSize(2),
            zIndex: 999
        },
        LocationTExt: {
            fontFamily: "Montserrat-Bold",
            fontSize: ResponsiveSize(11),
            color: '#69BE25'
        }
    })
    return (
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", height: ResponsiveSize(60), width: width, backgroundColor: "white", paddingHorizontal: ResponsiveSize(15) }}>
            <Image source={require('../../assets/icons/Logo.png')} style={{ objectFit: 'contain', width: ResponsiveSize(115), height: ResponsiveSize(22) }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>

                <View style={styles.locationHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('InAppCheckIn')}>
                        {loading ? <ActivityIndicator size={'small'} color={global.secondaryColor} />
                            :
                            <TextC style={styles.LocationTExt} text={GetUserProfileReducer?.data?.last_checkin ==
                                'No last check-in available'
                                ? 'No Check-in'
                                : GetUserProfileReducer?.data?.last_checkin} />
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ paddingVertical: ResponsiveSize(4), paddingLeft: ResponsiveSize(10), paddingRight: ResponsiveSize(5) }} onPress={() => navigation.navigate('Notification')}>
                    <Ionicons name='notifications-outline' size={ResponsiveSize(20)} color={global.primaryColor} />
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: ResponsiveSize(4), position: 'relative' }} onPress={() => navigation.navigate('MessageList')}>
                    <View style={styles.NotifyPin}></View>
                    <Image source={require('../../assets/icons/HeaderIcon2.png')} style={{ objectFit: 'contain', width: ResponsiveSize(19), height: ResponsiveSize(19) }} />
                </TouchableOpacity>


                <TouchableOpacity style={{ padding: ResponsiveSize(4), position: 'relative' }} onPress={() => navigation.navigate('SearchUser')}>
                    <Feather name='search' size={ResponsiveSize(20)} color={global.primaryColor} />
                </TouchableOpacity>
                {/*                 
                <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={{ padding: 4 }}>
                    <MaterialIcons name='notifications-none' size={ResponsiveSize(26)} color={global.primaryColor} />
                </TouchableOpacity> */}
            </View>
        </View>
    )
}


function mapStateToProps({ GetUserProfileReducer }) {
    return { GetUserProfileReducer };
}
export default connect(mapStateToProps, UserProfile)(MainHeader);