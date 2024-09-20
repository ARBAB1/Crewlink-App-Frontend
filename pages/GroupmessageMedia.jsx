import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import FastImage from "react-native-fast-image";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl, apiKey } from '../store/config.json'
import io from "socket.io-client";
import TextC from "../components/text/text";
import Video from "react-native-video";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useBottomSheet } from "../components/bottomSheet/BottomSheet";

const GroupmessageMedia = ({ route }) => {
    const [imageRatio, setImageRatio] = useState("")
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState("")
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const centerX = (windowWidth - 40) / 2;
    const centerY = (windowHeight - 40) / 2;


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: global.black,
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        TopBar: {
            width: windowWidth,
            height: ResponsiveSize(60),
            position: 'absolute',
            top: ResponsiveSize(30),
            left: 0,
            zIndex: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(15),
        },
        closeBtn: {
            backgroundColor: "#EEEEEE",
            height: ResponsiveSize(40),
            width: ResponsiveSize(40),
            borderRadius: ResponsiveSize(40),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        BottomBar: {
            width: windowWidth,
            height: ResponsiveSize(60),
            position: 'absolute',
            bottom: ResponsiveSize(20),
            left: 0,
            zIndex: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(15),
        },
        DescriptionInput: {
            backgroundColor: "#EEEEEE",
            width: windowWidth - ResponsiveSize(80),
            borderRadius: ResponsiveSize(20),
            paddingHorizontal: ResponsiveSize(15),
            fontFamily: 'Montserrat-Medium'
        },
        SentBtn: {
            height: ResponsiveSize(40),
            width: ResponsiveSize(40),
            backgroundColor: global.secondaryColor,
            borderRadius: ResponsiveSize(15),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        },
        userInfo: {
            backgroundColor: '#EEEEEE',
            height: ResponsiveSize(40),
            borderRadius: ResponsiveSize(40),
            paddingLeft: ResponsiveSize(2.5),
            paddingRight: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        FirstImage: {
            width: windowWidth,
            height: windowHeight,
            position: 'relative',
        },
        PauseBtn: {
            position: 'absolute',
            left: centerX,
            top: centerY,
            color: global.white,
            borderRadius: ResponsiveSize(15),
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
        }
    })

    useEffect(() => {
        if (!route?.params?.media_url[0]?.type == "video/mp4" == false) {
            Image.getSize(
                route?.params?.media_url[0].uri,
                (width, height) => {
                    const ratio = width / height;
                    setImageRatio(ratio)
                },
                (error) => {
                    console.error(`Couldn't get the image size: ${error}`);
                }
            );
        }
    }, [])
    const headerHeight = useHeaderHeight();
    const [isPause, setIsPaused] = useState(true)

    const sendMessage = async () => {
        setLoading(true)
        const Token = await AsyncStorage.getItem('Token');
        const formData = new FormData()
        if (route?.params?.media_url[0]?.type == "video/mp4") {
            formData.append('message_attachment', {
                uri: route?.params?.media_url[0].uri,
                name: 'photo.mp4',
                type: 'video/mp4',
            });
        }
        else {
            formData.append('message_attachment', {
                uri: route?.params?.media_url[0].uri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
        }
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

            console.log(response)

            const socket = io(`${baseUrl}/chat`, {
                transports: ['websocket'],
                extraHeaders: {
                    'x-api-key': "TwillioAPI",
                    'accesstoken': `Bearer ${Token}`
                }
            });
            socket.on('connect').emit('createGroupMessage', {
                "message": description,
                "group_id": route?.params?.group_id,
                "media_url": response.fileUrl
            }).emit('oldGroupMessages', { group_id: route?.params?.group_id }).on('groupMessages', (data) => {
                setDescription("")
                setLoading(false)
                navigation.navigate('GroupMessage', {
                    group_id: route?.params?.group_id,
                    profile_picture_url: route?.params?.profile_picture_url,
                    user_name: route?.params?.user_name
                })
            })
        }
        else {
            console.log(uploadImage, 'error Response')
            alert("Failed to send message")
            setLoading(false)
            navigation.goBack()
        }
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flexGrow: 1 }}
            keyboardVerticalOffset={
                Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
            }>
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                {route?.params?.media_url[0]?.type == "video/mp4" ?
                    <Pressable onPress={() => setIsPaused(!isPause)} style={{ width: windowWidth, height: windowHeight, position: 'relative' }}>
                        <Video
                            source={{
                                uri: 'file://' + route?.params?.media_url[0]?.originalPath,
                            }}
                            style={{ width: windowWidth, height: windowHeight }}
                            controls={false}
                            paused={isPause}
                        />
                        {isPause &&
                            <FontAwesome5 name="play" style={styles.PauseBtn} size={ResponsiveSize(40)} />
                        }
                    </Pressable>
                    :
                    <FastImage style={{ aspectRatio: imageRatio, width: windowWidth }} source={{ uri: route?.params?.media_url[0].uri }} />
                }
                <View style={styles.TopBar}>
                    <View style={styles.userInfo}>
                        <FastImage
                            source={{ uri: route?.params?.profile_picture_url, priority: FastImage.priority.high }}
                            style={{
                                height: ResponsiveSize(35),
                                width: ResponsiveSize(35),
                                borderRadius: ResponsiveSize(35),
                            }}
                            resizeMode="cover"
                        />
                        <TextC text={route?.params?.user_name} font={"Montserrat-Bold"} style={{ marginLeft: ResponsiveSize(10) }} />
                    </View>

                    <TouchableOpacity disabled={loading} style={styles.closeBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={ResponsiveSize(20)} color={global.black} />
                    </TouchableOpacity>
                </View>
                <View style={styles.BottomBar}>
                    <TextInput onChangeText={(e) => setDescription(e)} style={styles.DescriptionInput} placeholder="Add Description" />
                    <TouchableOpacity disabled={loading} onPress={sendMessage} style={styles.SentBtn}>
                        {loading ?
                            <ActivityIndicator color={global.white} size={ResponsiveSize(16)} />
                            :
                            <Feather name="send" color={global.white} size={ResponsiveSize(16)} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}


export default GroupmessageMedia;