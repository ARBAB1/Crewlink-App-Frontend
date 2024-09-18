import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { ResponsiveSize, global } from '../constant';
import Feather from 'react-native-vector-icons/Feather'


const EventHeader = ({ backgroundColor }) => {
    const width = Dimensions.get('window').width;
    const navigation = useNavigation()
    const styles = StyleSheet.create({
        HeaderWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: backgroundColor,
            paddingVertical: ResponsiveSize(15),
            paddingHorizontal: ResponsiveSize(15),
        },
        HeaderLogo: {
            width: ResponsiveSize(130),
            height: ResponsiveSize(22),
            resizeMode: 'contain',
        }
    })

    return (
        <View style={styles.HeaderWrapper}>
            <Image source={require('../../assets/icons/Logo.png')} style={styles.HeaderLogo} />
            <View style={{ flexDirection: 'row' }}>
                {/* <TouchableOpacity onPress={() => {}} style={{ marginRight: ResponsiveSize(15) }}>
                    <Feather name='search' color={global.primaryColor} size={ResponsiveSize(18)} />
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => navigation.navigate('AddEvent')}>
                    <Image source={require('../../assets/icons/addEventIcon.png')} style={{ objectFit: 'contain', width: 19, height: 21 }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EventHeader;
