import { Platform, StatusBar, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, View, useColorScheme, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useHeaderHeight } from "@react-navigation/elements";
import { DarkTheme, useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { global, ResponsiveSize } from '../components/constant';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextC from '../components/text/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client";
import { baseUrl, apiKey } from '../store/config.json'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useBottomSheet } from '../components/bottomSheet/BottomSheet';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



const UpdateAnnouncement = ({ route }) => {
    const windowWidth = Dimensions.get('window').width;
    const [ShareText, setShareText] = useState("")
    const [loading, setLoading] = useState(false)
    const scheme = useColorScheme();
    const focus = useIsFocused();
    const navigation = useNavigation();
    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        });
        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    display: 'flex',
                    backgroundColor: '#69BE25',
                    borderTopLeftRadius: ResponsiveSize(20),
                    borderTopRightRadius: ResponsiveSize(20),
                },
            });
        }
    }, []);


    console.log(route.params,'routekaparams')
    // const sendMessage = async () => {
    //     if (ShareText !== "") {
    //         setLoading(true)
    //         const Token = await AsyncStorage.getItem('Token');
    //         const socket = io(`${baseUrl}/chat`, {
    //             transports: ['websocket'],
    //             extraHeaders: {
    //                 'x-api-key': "TwillioAPI",
    //                 'accesstoken': `Bearer ${Token}`
    //             }
    //         });
    //         socket.on('connect').emit('createAnnouncement', {
    //             "announcement": ShareText,
    //         }, () => {
    //             setLoading(false)
    //             setShareText("")
    //             navigation.navigate('announcement')
    //         })
    //     }
    // }

    const sendReply = async () => {
        if (ShareText !== "") {
            setLoading(true)
            const Token = await AsyncStorage.getItem('Token');
            const socket = io(`${baseUrl}/chat`, {
                transports: ['websocket'],
                extraHeaders: {
                    'x-api-key': "TwillioAPI",
                    'accesstoken': `Bearer ${Token}`
                }
            });
            socket.on('connect').emit('createAnnouncementComment', {
                "comment_type": "ANNOUNCEMENT_COMMENT",
                "comment": ShareText,
                "parent_id": route?.params?.announcement_id
            }, () => {
                navigation.navigate('announcement')
                setLoading(false)
                setShareText("")
            })
        }
    }





    const [documentImage, setDocumentImage] = useState('');
    const [document, setDocument] = useState('');


    const createGroup = async () => {
        const Token = await AsyncStorage.getItem('Token');
        const timestamp = new Date().getTime();
        const dynamicName = `photo_${timestamp}.jpg`;
        const formData = new FormData();
        if (document[0]?.uri !== undefined) {
            formData.append('message_attachment', {
                uri: document[0]?.uri,
                name: dynamicName,
                type: 'image/jpeg',
            });
            setLoading(true);
            const uploadImage = await fetch(`${baseUrl}/messages/upload-message-attachment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-api-key': apiKey,
                    'accesstoken': `Bearer ${Token}`
                },
                body: formData
            })
            if (uploadImage.ok == true) {
                const response = await uploadImage.json()
                if (ShareText !== "") {
                    setLoading(true)
                    const Token = await AsyncStorage.getItem('Token');
                    const socket = io(`${baseUrl}/chat`, {
                        transports: ['websocket'],
                        extraHeaders: {
                            'x-api-key': "TwillioAPI",
                            'accesstoken': `Bearer ${Token}`
                        }
                    });
                    socket.on('connect').emit('createAnnouncement', {
                        "announcement": ShareText,
                        "fileUrls": response?.fileUrl,
                        "thumbnailUrls": response?.thumbnailUrl
                    }, () => {
                        setLoading(false)
                        setShareText("")
                        navigation.navigate('announcement')
                    })
                }
            }
            else {
                alert("Failed to send message")
                setLoading(false)
                navigation.goBack()
            }
        }
        else {
            if (ShareText !== "") {
                setLoading(true)
                const Token = await AsyncStorage.getItem('Token');
                const socket = io(`${baseUrl}/chat`, {
                    transports: ['websocket'],
                    extraHeaders: {
                        'x-api-key': "TwillioAPI",
                        'accesstoken': `Bearer ${Token}`
                    }
                });
                socket.on('connect').emit('createAnnouncement', {
                    "announcement": ShareText,
                }, () => {
                    setLoading(false)
                    setShareText("")
                    navigation.navigate('announcement')
                })
            }
        }
    }






    const headerHeight = useHeaderHeight();
    const styles = StyleSheet.create({
        ContainerHeader: {
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(15),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: '#eeeeee',
            borderBottomWidth: ResponsiveSize(1),
        },
        container: {
            paddingVertical: ResponsiveSize(10),
            position: 'relative',
            flex: 1,
        },
        SinglePost: {
            paddingHorizontal: ResponsiveSize(15),
            paddingBottom: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: ResponsiveSize(15),
            flex: 1,
        },
        ProfileSide: {
            width: windowWidth * 0.22 - ResponsiveSize(15),
            paddingVertical: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        TextSide: {
            width: windowWidth * 0.78 - ResponsiveSize(15),
            paddingVertical: ResponsiveSize(10),
        },
        PostProfileImage2: {
            height: ResponsiveSize(45),
            width: ResponsiveSize(45),
            borderRadius: ResponsiveSize(40),
            backgroundColor: global.description,
            overflow: 'hidden',
        },
        TextInputSent: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: ResponsiveSize(13),
            color: global.textColor,
            paddingVertical: ResponsiveSize(10),
            textAlignVertical: 'top',
        },
        SentBtn: {
            backgroundColor: global.secondaryColor,
            borderRadius: ResponsiveSize(50),
            paddingHorizontal: ResponsiveSize(20),
            paddingVertical: ResponsiveSize(5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ImageContainer: {
            height: ResponsiveSize(100),
            width: windowWidth - ResponsiveSize(30),
            borderWidth: ResponsiveSize(1),
            borderColor: '#EEEEEE'
        },
        mediaUpload: {
            borderRadius: ResponsiveSize(50),
            height: ResponsiveSize(50),
            width: ResponsiveSize(50),
            backgroundColor: global.secondaryColor,
            position: 'absolute',
            right: ResponsiveSize(20),
            bottom: ResponsiveSize(20),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        attachmentBottom: {
            height: ResponsiveSize(100),
            width: ResponsiveSize(100),
            backgroundColor: '#69BE25',
            borderRadius: ResponsiveSize(5),
            justifyContent: 'center',
            alignItems: 'center',
        },
        AnnounceView: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            height: ResponsiveSize(100),
            width: ResponsiveSize(100),
        }
    })


    const requestCameraPermission = async () => {
        try {
            const granted =
                Platform.OS === 'android'
                    ? await request(PERMISSIONS.ANDROID.CAMERA)
                    : await request(PERMISSIONS.IOS.CAMERA);
            if (granted == "granted") {
                openPhotoLibrary();
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const openPhotoLibrary = async () => {
        const result = await launchImageLibrary();
        if (result?.assets.length > 0) {
            setDocument(result.assets);
            setDocumentImage(result?.assets[0]?.uri);
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flexGrow: 1 }}
            keyboardVerticalOffset={
                Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
            }>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={
                        scheme === 'dark' ? DarkTheme.colors.background : 'white'
                    }
                    barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white }}>
                    <View style={styles.ContainerHeader}>
                        <Pressable onPress={() => navigation.navigate('announcement')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="left" color={'#05348E'} size={ResponsiveSize(16)} />
                            <TextC size={ResponsiveSize(12)} font={'Montserrat-Bold'} text={'Announcements'} />
                        </Pressable>


                        <TouchableOpacity onPress={route?.params?.isReply ? sendReply : createGroup} disabled={ShareText !== "" ? false : true} style={styles.SentBtn}>
                            {loading ?
                                <ActivityIndicator size={ResponsiveSize(13)} color={global.white} />
                                :
                                <TextC text={'Update'} font={'Montserrat-Medium'} style={{ color: global.white }} size={ResponsiveSize(12)} />
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.container}>
                        <View style={styles.SinglePost}>
                            <View style={styles.ProfileSide}>
                                <FastImage
                                    source={{ uri: route?.params?.user_Profile, priority: FastImage.priority.high }}
                                    style={styles.PostProfileImage2}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.TextSide}>
                                {route?.params?.isReply &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextC text={`Replying to`} size={ResponsiveSize(10)} font={'Montserrat-Medium'} style={{ color: global.placeholderColor, marginRight: ResponsiveSize(3) }} />
                                        <TextC text={route?.params?.Reply_user_name} size={ResponsiveSize(10)} font={'Montserrat-Medium'} style={{ color: global.primaryColor, marginRight: ResponsiveSize(3) }} />
                                    </View>
                                }
                                <TextInput defaultValue={route.params?.caption} onChangeText={(e) => setShareText(e)} blurOnSubmit={false} multiline={true} style={styles.TextInputSent} placeholder="What's happening?" />
                                {documentImage &&
                                    <View style={styles.AnnounceView}>
                                        <FastImage
                                            source={
                                                documentImage == ''
                                                    ? require('../assets/icons/avatar.png')
                                                    : { uri: documentImage, priority: FastImage.priority.high }
                                            }
                                            style={styles.attachmentBottom}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity onPress={() => {
                                            setDocument("")
                                            setDocumentImage("")
                                        }} style={{
                                            position: 'absolute', top: ResponsiveSize(-5), left: ResponsiveSize(-5), borderRadius: ResponsiveSize(50), height: ResponsiveSize(30), width: ResponsiveSize(30), backgroundColor: 'red', flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <MaterialCommunityIcons name='trash-can-outline' size={ResponsiveSize(18)} color={global.white} />
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={requestCameraPermission} style={styles.mediaUpload}>
                        <Feather name='camera' size={ResponsiveSize(22)} color={global.white} />
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default UpdateAnnouncement
