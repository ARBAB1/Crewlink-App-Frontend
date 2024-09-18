import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    DarkTheme,
    Dimensions,
    Easing,
    ImageBackground,
    KeyboardAvoidingView,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from "../components/text/text";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import { useHeaderHeight } from '@react-navigation/elements';
import { TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from '../store/config.json'
import { Animated } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { PanGestureHandler, State } from "react-native-gesture-handler";



const GroupMessage = ({ route }) => {
    const focus = useIsFocused();
    const scheme = useColorScheme();
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth,
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(15),
            backgroundColor: global.white,
            borderBottomColor: global.description,
            borderBottomWidth: ResponsiveSize(1)
        },
        logoSide1: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        logoSide2: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: ResponsiveSize(5)
        },
        bodyWrapper: {
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(5),
        },
        SearchInputWrapper: {
            position: "relative",
        },
        SearchInput: {
            borderRadius: ResponsiveSize(20),
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            fontSize: ResponsiveSize(12),
            fontFamily: 'Montserrat-Regular',
            borderColor: global.description,
            borderWidth: ResponsiveSize(1),
            position: "relative",
            paddingLeft: ResponsiveSize(35)
        },
        SearchIcon: {
            position: 'absolute',
            top: ResponsiveSize(8),
            left: ResponsiveSize(10)
        },
        PostHeader: {
            flexDirection: 'row',
            paddingTop: ResponsiveSize(15),
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        PostProfileImage: {
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            borderRadius: ResponsiveSize(30),
            backgroundColor: global.description,
            marginRight: ResponsiveSize(5),
            overflow: 'hidden',
        },
        PostProfileImage2: {
            height: windowWidth * 0.07,
            width: windowWidth * 0.07,
            borderRadius: windowWidth * 0.1,
            backgroundColor: global.description,
            marginRight: ResponsiveSize(5),
            overflow: 'hidden',
        },
        PostProfileImageBox: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        MessageInputWrapper: {
            width: windowWidth,
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            paddingHorizontal: ResponsiveSize(10),
            paddingTop: ResponsiveSize(5),
            paddingBottom: ResponsiveSize(10),
            bottom: 0,
            backgroundColor: global.white,
        },
        MessageInput: {
            paddingHorizontal: ResponsiveSize(15),
            height: ResponsiveSize(45),
            fontFamily: "Montserrat-Medium",
            backgroundColor: "#EEEEEE",
            width: windowWidth - ResponsiveSize(20),
            fontSize: ResponsiveSize(12),
            paddingVertical: ResponsiveSize(15),
            borderRadius: ResponsiveSize(15)
        },
        SentBtn: {
            position: 'absolute',
            height: ResponsiveSize(40),
            width: ResponsiveSize(40),
            backgroundColor: global.secondaryColor,
            right: ResponsiveSize(13),
            top: ResponsiveSize(8),
            borderRadius: ResponsiveSize(15),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        },
        messageWrapper: {
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(5)
        },
        messageContainer1: {
            flexDirection: "row",
            flex: 1,
        },
        messageContainer2: {
            justifyContent: "flex-end",
            flexDirection: "row",
            flex: 1,
        },
        message: {
            fontSize: ResponsiveSize(11),
            color: global.black,
            fontFamily: 'Montserrat-Regular',
        },
        TimeAgo: {
            fontSize: ResponsiveSize(8),
            color: global.black,
            fontFamily: 'Montserrat-Regular',
            marginTop: ResponsiveSize(3),
            marginRight: ResponsiveSize(3)
        },
        messageUser: {
            fontSize: ResponsiveSize(12),
            color: global.white,
            fontFamily: 'Montserrat-Regular',
        },
        empty: {
            flex: 1,
        },
        thisUserText: {
            backgroundColor: global.description,
            borderBottomLeftRadius: ResponsiveSize(10),
            borderTopRightRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            maxWidth: windowWidth * 0.6
        },
        otherUserText: {
            backgroundColor: global.secondaryColor,
            borderTopLeftRadius: ResponsiveSize(10),
            borderBottomLeftRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            flexDirection: 'column',
            alignItems: 'flex-end',
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            maxWidth: windowWidth * 0.7
        },
        messageOwner: {
            fontFamily: 'Montserrat-Bold',
            fontSize: ResponsiveSize(9),
            marginBottom: ResponsiveSize(5),
            color: global.black,
        }
    });

    const [newMessage, setNewMessage] = useState("")
    const [recentChats, setRecentChats] = useState([])
    const [user_id, setUserId] = useState()
    const [loader, setLoader] = useState(false)
    const scrollViewRef = useRef();

    const loadRecentChats = async () => {
        const Token = await AsyncStorage.getItem('Token'); U_id
        const U_id = await AsyncStorage.getItem('U_id');
        setUserId(U_id)
        const socket = io(`${baseUrl}/chat`, {
            transports: ['websocket'],
            extraHeaders: {
                'x-api-key': "TwillioAPI",
                'accesstoken': `Bearer ${Token}`
            }
        });
        socket.on('connect').emit('oldGroupMessages', { group_id: route?.params?.group_id }).on('groupMessages', (data) => {
            if (data?.message.length > 0) {
                setLoader(false)
                setRecentChats(data?.message);
            }
            setLoader(false)
        })
    }

    useEffect(() => {
        setLoader(true)
        loadRecentChats()
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
        if (newMessage !== "") {
            setRecentChats(prev => [
                ...prev,
                {
                    created_at: Date.now(),
                    message: newMessage,
                    isSend: false,
                    senderUserId: user_id
                },
            ]);
            const Token = await AsyncStorage.getItem('Token');
            const socket = io(`${baseUrl}/chat`, {
                transports: ['websocket'],
                extraHeaders: {
                    'x-api-key': "TwillioAPI",
                    'accesstoken': `Bearer ${Token}`
                }
            });
            socket.on('connect').emit('createGroupMessage', {
                "message": newMessage,
                "group_id": route?.params?.group_id,
            }).emit('oldGroupMessages', { group_id: route?.params?.group_id }).on('groupMessages', (data) => {
                if (data?.message.length > 0) {
                    setNewMessage("")
                    setRecentChats(data);
                }
                setLoader(false)
            })
        }
    }

    const renderItem = useCallback((items) => {
        console.log(items?.item, 'item render item render')
        const date = new Date(items.item.created_at);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
        return (
            <>
                <View style={styles.messageWrapper}>
                    {items?.item?.senderUserId == user_id ?
                        <View style={styles.messageContainer2}>
                            <View style={styles.empty}></View>
                            <View style={styles.otherUserText}>
                                <Text style={styles.messageUser}>{items.item.message}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                    {items?.item?.isSend == false ?
                                        <AntDesign name="clockcircleo" />
                                        :
                                        <>
                                            < AntDesign name="check" />
                                        </>
                                    }
                                </View>
                            </View>
                        </View>
                        :
                        <View style={styles.messageContainer1}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <ImageBackground
                                    source={
                                        items?.item?.userDetails?.profile_picture_url == ''
                                            ? require('../assets/icons/avatar.png')
                                            : { uri: items?.item?.userDetails?.profile_picture_url }
                                    }
                                    style={styles.PostProfileImage2}
                                    resizeMode="cover" />
                                <View style={styles.thisUserText}>
                                    <Text style={styles.messageOwner}>{items?.item?.userDetails?.user_name}</Text>
                                    <Text style={styles.message}>{items.item.message}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.empty}></View>
                        </View>
                    }
                </View>
            </>
        );
    }, [recentChats]);
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
                <View style={styles.wrapper}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <ImageBackground
                            source={
                                route?.params?.profile_picture_url == ''
                                    ? require('../assets/icons/avatar.png')
                                    : { uri: route?.params?.profile_picture_url }
                            }
                            style={styles.PostProfileImage}
                            resizeMode="cover"></ImageBackground>
                        <TextC size={ResponsiveSize(12)} font={'Montserrat-Bold'} text={route?.params?.user_name} />
                    </View>
                </View>
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white, position: 'relative', paddingTop: ResponsiveSize(10), paddingBottom: ResponsiveSize(65) }}>
                    {loader ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <ActivityIndicator size={'large'} color={global.primaryColor} />
                        </View>
                        :
                        <FlashList
                            estimatedItemSize={25}
                            showsVerticalScrollIndicator={false}
                            data={recentChats}
                            keyExtractor={(items, index) => index?.toString()}
                            renderItem={renderItem}
                        />
                    }
                </ScrollView>
                <View style={styles.MessageInputWrapper}>
                    <TextInput placeholder="Message..." style={styles.MessageInput} value={newMessage} onPress={() =>
                        scrollViewRef.current.scrollToEnd({ animated: true })
                    } onChangeText={(e) => setNewMessage(e)} />
                    <TouchableOpacity onPress={sendMessage} style={styles.SentBtn}>
                        <Feather name="send" color={global.white} size={ResponsiveSize(16)} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
export default GroupMessage;