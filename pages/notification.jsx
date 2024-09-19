import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    DarkTheme,
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from "../components/text/text";
import { useNavigation, useIsFocused } from "@react-navigation/native";



const Notification = () => {
    const scheme = useColorScheme();
    const windowWidth = Dimensions.get('window').width;
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth,
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(15),
            backgroundColor: global.white
        },
        logoSide1: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '33.33%',
        },
        logoSide2: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33.33%',
        },
        logoSide3: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '33.33%',
        },
        NotificationWrapper:{
            padding:ResponsiveSize(15),
        },
        NotificationBox:{
            backgroundColor:'#EEEEEE',
            padding:ResponsiveSize(20),
            borderRadius:ResponsiveSize(10)
        }
    });
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={global.white} />
            <View style={styles.wrapper}>
                <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                    <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                </Pressable>
                <View style={styles.logoSide2}>
                    <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"Notification"} />
                </View>
                <View style={styles.logoSide3}>
                    <TouchableOpacity onPress={() => navigation.navigate("NewMessage")} >
                        <AntDesign name='setting' color={global.primaryColor} size={ResponsiveSize(22)} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white,borderTopColor:'#EEEEEE',borderTopWidth:ResponsiveSize(1) }}>
                <View style={styles.NotificationWrapper}>
                    <View style={styles.NotificationBox}></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Notification;