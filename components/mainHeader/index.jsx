import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { global, ResponsiveSize } from '../constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import * as UserProfile from '../../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
const width = Dimensions.get('window').width;


const MainHeader = ({ GetUserProfileReducer, loading }) => {
    const navigation = useNavigation()
    const styles = StyleSheet.create({
        NotifyPin:{
            height:ResponsiveSize(8),
            width:ResponsiveSize(8),
            borderRadius:ResponsiveSize(8),
            backgroundColor: global.red,
            position: 'absolute',
            top: ResponsiveSize(2),
            right: ResponsiveSize(2),
            zIndex:999
        }
    })
    return (
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", height: 60, width: width, backgroundColor: "white", paddingHorizontal: ResponsiveSize(15) }}>
            <Image source={require('../../assets/icons/Logo.png')} style={{ objectFit: 'contain', width: 130, height: 22 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>

                <View style={styles.locationHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('InAppCheckIn')}>
                        {loading ? <ActivityIndicator size={'small'} color={global.secondaryColor} />
                            :
                            <Text style={styles.LocationTExt}>{
                                GetUserProfileReducer?.data?.last_checkin ==
                                    'No last check-in available'
                                    ? 'No Check-in'
                                    : GetUserProfileReducer?.data?.last_checkin
                            }</Text>
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ paddingVertical: 4, paddingLeft: 10, paddingRight: 5 }} onPress={() => navigation.navigate('Notification')}>
                    <Ionicons name='notifications-outline' size={ResponsiveSize(24)} color={global.primaryColor} />
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: 4, position: 'relative' }} onPress={() => navigation.navigate('MessageList')}>
                  
                    <View style={styles.NotifyPin}></View>
                    <Image source={require('../../assets/icons/HeaderIcon2.png')} style={{ objectFit: 'contain', width: ResponsiveSize(21), height: ResponsiveSize(21) }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 4, position: 'relative' }} onPress={() => navigation.navigate('MessageList')}>
                  
                  <View style={styles.NotifyPin}></View>
                  <Image source={require('../../assets/icons/HeaderIcon2.png')} style={{ objectFit: 'contain', width: ResponsiveSize(21), height: ResponsiveSize(21) }} />
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

const styles = StyleSheet.create({
    locationHeader: {
        borderRightWidth: 1,
        borderColor: "#05348E",
        height: 20,
        paddingHorizontal: 10
    },
    LocationTExt: {
        fontFamily: "Montserrat-Bold",
        fontSize: 14,
        color: '#69BE25'
    }
})