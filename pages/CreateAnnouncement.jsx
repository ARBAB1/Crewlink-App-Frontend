import { Platform, StatusBar, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, View, useColorScheme, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useHeaderHeight } from "@react-navigation/elements";
import { DarkTheme, useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { global, ResponsiveSize } from '../components/constant';
import FastImage from 'react-native-fast-image';
import TextC from '../components/text/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client";
import { baseUrl } from '../store/config.json'


const CreateAnnouncement = ({ route }) => {
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

    const sendMessage = async () => {
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

    const sendReply = async () => {
        if (ShareText !== "") {
            setLoading(true)
            console.log('pkkkkkk')
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
            flex: 1
        },
        SentBtn: {
            backgroundColor: global.secondaryColor,
            borderRadius: ResponsiveSize(50),
            paddingHorizontal: ResponsiveSize(20),
            paddingVertical: ResponsiveSize(5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }
    })


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
                        <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
                            <TextC text={'close'} font={'Montserrat-Medium'} size={ResponsiveSize(13)} />
                        </TouchableOpacity>


                        <TouchableOpacity onPress={route?.params?.isReply ? sendReply : sendMessage} disabled={ShareText !== "" ? false : true} style={styles.SentBtn}>
                            {loading ?
                                <ActivityIndicator size={ResponsiveSize(13)} color={global.white} />
                                :
                                <TextC text={'Post'} font={'Montserrat-Medium'} style={{ color: global.white }} size={ResponsiveSize(13)} />
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
                                <TextInput onChangeText={(e) => setShareText(e)} blurOnSubmit={false} numberOfLines={10} multiline={true} style={styles.TextInputSent} placeholder="What's happening?" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default CreateAnnouncement
