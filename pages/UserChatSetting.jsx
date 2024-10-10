import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    DarkTheme,
    Dimensions,
    ImageBackground,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
    Image
} from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from "../components/text/text";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeAgo from '@manu_omg/react-native-timeago';
import { baseUrl, apiKey } from '../store/config.json'
import * as AllConnectionsAction from "../store/actions/Connections/index";
import { connect } from "react-redux";
import { useBottomSheet } from "../components/bottomSheet/BottomSheet";
import ButtonC from "../components/button";
import { PERMISSIONS, request } from "react-native-permissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";


const UserChatSetting = () => {
    // console.log(route.params,"iop")
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
        bodyWrapper: {
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(5),
        },
        NextBtn: {
            backgroundColor: '#69BE25',
            paddingHorizontal: ResponsiveSize(20),
            paddingVertical: ResponsiveSize(4),
            borderRadius: ResponsiveSize(20),
            alignItems: 'center',
            justifyContent: 'center',
        },
        GroupName: {
            paddingTop: ResponsiveSize(20),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        ProfileImage: {
            height: ResponsiveSize(80),
            width: ResponsiveSize(80),
            borderRadius: ResponsiveSize(80),
            borderWidth: ResponsiveSize(1),
            borderColor: global.description,
            overflow: 'hidden'
        },

        ProfileIcons: {
            height: ResponsiveSize(60),
            width: ResponsiveSize(60),
            borderRadius: ResponsiveSize(60),
            overflow: 'hidden'
        },
        GroupNameTitle: {
            fontFamily: 'Montserrat-Bold',
            width: windowWidth * 0.8,
            textAlign: 'center',
            marginBottom: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(15),
            fontSize: ResponsiveSize(18),
            color: global.primaryColor,
        },
        Participants: {
            paddingVertical: ResponsiveSize(20),
            flexDirection: 'column',
        },
        box: {
            width: windowWidth * 0.25,
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: ResponsiveSize(10)
        },
        BoxWrapper: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
        }
    });
    const navigation = useNavigation();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const [documentImage, setDocumentImage] = useState('');
    const [document, setDocument] = useState('');
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);

  
    useEffect(() => {
        return () => {
            closeBottomSheet();
        };
    }, []);
    const handleOpenSheet = () => {
        openBottomSheet(
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        paddingHorizontal: ResponsiveSize(15),
                    }}>
                    <ButtonC
                        onPress={openMobileCamera}
                        BtnStyle={{ width: windowWidth * 0.45 }}
                        TextStyle={{ color: global.white }}
                        bgColor={global.primaryColor}
                        style={styles.openCamera}
                        title={'Open camera'}></ButtonC>
                    <ButtonC
                        onPress={openPhotoLibrary}
                        BtnStyle={{ width: windowWidth * 0.45 }}
                        TextStyle={{ color: global.white }}
                        bgColor={global.primaryColor}
                        style={styles.openLibrary}
                        title={'Open library'}></ButtonC>
                </View>
            </>,
            ['15%'],
        );
    };
    const requestCameraPermission = async () => {
        try {
            const granted = Platform.OS === 'android'
                ? await request(PERMISSIONS.ANDROID.CAMERA)
                : await request(PERMISSIONS.IOS.CAMERA);
            handleOpenSheet();
        } catch (err) {
            console.warn(err);
        }
    };
    const openPhotoLibrary = async () => {
        const result = await launchImageLibrary();
        if (result?.assets.length > 0) {
            setDocument(result.assets);
            setDocumentImage(result?.assets[0]?.uri);
            closeBottomSheet();
        }
    };
    const openMobileCamera = async () => {
        const result = await launchCamera();
        if (result?.assets.length > 0) {
            setDocument(result.assets);
            setDocumentImage(result?.assets[0]?.uri);
            closeBottomSheet();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                backgroundColor={
                    scheme === 'dark' ? DarkTheme.colors.background : 'white'
                }
                barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white }}>
                <StatusBar backgroundColor={global.white} />
                <View style={styles.wrapper}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"New Group"} />
                    </View>
                    <View style={styles.logoSide3}>
                        {groupName !== "" ?
                            <TouchableOpacity disabled={loading} onPress={() => console.log("next")} style={styles.NextBtn}>
                                {loading ?
                                    <ActivityIndicator size="small" color={global.primaryColor} />
                                    :
                                    <TextC size={ResponsiveSize(11)} text={'Next'} font={'Montserrat-SemiBold'} />
                                }
                            </TouchableOpacity>

                            : ""}
                    </View>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.GroupName}>
                        {documentImage !== '' ? (
                            <TouchableOpacity onPress={requestCameraPermission}>
                                <Image style={styles.ProfileImage} src={documentImage} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={requestCameraPermission}>
                                <Image
                                    style={styles.ProfileImage}
                                    source={require('../assets/icons/avatar.png')}
                                />
                            </TouchableOpacity>
                        )}
                        <TextInput onChangeText={(e) => setGroupName(e)} placeholder="Group Name Here" style={styles.GroupNameTitle} />
                    </View>
                </View>
                <View style={styles.Participants}>
                    <View style={{ paddingHorizontal: ResponsiveSize(15), paddingBottom: ResponsiveSize(0) }}>
                        <TextC size={ResponsiveSize(16)} font={'Montserrat-SemiBold'} text={"Participants"} />
                    </View>
                    <View style={styles.BoxWrapper}>
                        {/* {route?.params !== undefined && route?.params !== "" && route?.params !== null && route?.params.length > 0 ? route?.params?.map(recentChats => {
                            return ( */}
                                <View style={styles.box}>
                             
                                    <Image
                                        source={
                                            // recentChats?.profile_picture_url == ''
                                                // ?
                                                 require('../assets/icons/avatar.png')
                                                // : { uri: recentChats?.profile_picture_url }
                                        }
                                        style={styles.ProfileIcons}
                                        resizeMode="cover" />
                                    <TextC ellipsizeMode='tail' 
                                    numberOfLines={1} style={{ width: ResponsiveSize(60) }}
                                    //  text={recentChats?.user_name} 
                                     text={"John Doe"}
                                     font={'Montserrat-Bold'} size={ResponsiveSize(11)} />
                                </View>
                            {/* )
                        }
                        ) : */}
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(50) }}>
                                <TextC text={'No Connections found'} font={'Montserrat-Medium'} size={ResponsiveSize(11)} />
                            </View> */}
                        {/* } */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
// function mapStateToProps({ AllConnectionsReducer }) {
//     return { AllConnectionsReducer };
// }
export default UserChatSetting;