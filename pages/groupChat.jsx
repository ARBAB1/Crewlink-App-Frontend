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
    let lastElement = recentChats[recentChats.length - 1]
    const renderItem = useCallback((items) => {
        const isVideo = items?.item?.media_url?.split('.mp')
        const date = new Date(items.item.created_at);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
        return (
            <>
                <View style={styles.messageWrapper}>
                    {items?.item?.senderUserId == user_id ?
                        <Pressable onLongPress={() => GetReply(items?.item)} style={styles.messageContainer2}>
                            <View style={styles.empty}></View>
                            {items?.item?.is_media == "Y" ?
                                <>
                                    <Pressable onPress={() => MediaDetail(items?.item, isVideo[1] == '4' ? false : true)} onLongPress={() => GetReply(items?.item)}>
                                        <View style={styles.otherMedia}>
                                            {isVideo[1] == '4' ?
                                                <>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TextC text={'Video'} font={'Montserrat-Medium'} size={ResponsiveSize(12)} style={{ color: global.white }} />
                                                        <Feather name="video" color={global.white} size={ResponsiveSize(14)} style={{ marginLeft: ResponsiveSize(5) }} />
                                                    </View>
                                                    {items?.item?.message !== "" ?
                                                        <View style={styles.ImageMessage}>
                                                            <Text style={styles.messageUser}>{items.item.message}</Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                                                {items?.item?.isSend == false ?
                                                                    <AntDesign name="clockcircleo" />
                                                                    :
                                                                    <>
                                                                        {items?.item?.read_status == "N" ?
                                                                            < AntDesign name="check" />
                                                                            :
                                                                            ""
                                                                        }
                                                                    </>
                                                                }
                                                            </View>
                                                        </View>
                                                        :
                                                        <View style={styles.BottomInfoBar}>
                                                            <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                                            {items?.item?.isSend == false ?
                                                                <AntDesign name="clockcircleo" color={global.white} />
                                                                :
                                                                <>
                                                                    {items?.item?.read_status == "N" ?
                                                                        <AntDesign name="check" />
                                                                        :
                                                                        ""
                                                                    }
                                                                </>
                                                            }
                                                        </View>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <FastImage
                                                        source={
                                                            items?.item?.media_url == ''
                                                                ? require('../assets/icons/avatar.png')
                                                                : { uri: items?.item?.media_url, priority: FastImage.priority.high }
                                                        }
                                                        style={styles.otherMediaThumbnail}
                                                        resizeMode="cover"
                                                    />
                                                    {items?.item?.message !== "" ?
                                                        <View style={styles.ImageMessage}>
                                                            <Text style={styles.messageUser}>{items.item.message}</Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                                                {items?.item?.isSend == false ?
                                                                    <AntDesign name="clockcircleo" />
                                                                    :
                                                                    <>
                                                                        {items?.item?.read_status == "N" ?
                                                                            < AntDesign name="check" />
                                                                            :
                                                                            ""
                                                                        }
                                                                    </>
                                                                }
                                                            </View>
                                                        </View>
                                                        :
                                                        <View style={styles.BottomInfoBar}>
                                                            <Text style={styles.TimeAgoWhite}>{formattedTime}</Text>
                                                            {items?.item?.isSend == false ?
                                                                <AntDesign name="clockcircleo" color={global.white} />
                                                                :
                                                                <>
                                                                    {items?.item?.read_status == "N" ?
                                                                        <AntDesign name="check" color={global.white} />
                                                                        :
                                                                        ""
                                                                    }
                                                                </>
                                                            }
                                                        </View>
                                                    }
                                                </>
                                            }

                                        </View>
                                        {lastElement?.message_id == items?.item?.message_id && items?.item?.read_status == "Y" ?
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: ResponsiveSize(5) }}>
                                                <TextC text={"seen by"} font={'Montserrat-Medium'} size={ResponsiveSize(9)} style={{ color: global.black }} />
                                                <FastImage
                                                    source={{ uri: route?.params?.profile_picture_url, priority: FastImage.priority.high }}
                                                    style={{
                                                        height: ResponsiveSize(15),
                                                        width: ResponsiveSize(15),
                                                        borderRadius: ResponsiveSize(15),
                                                        marginLeft: ResponsiveSize(3)
                                                    }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            : ""
                                        }
                                    </Pressable>
                                </>
                                :
                                <View>
                                    <View style={styles.otherUserText}>
                                        {items?.item?.isReplyingWait ?
                                            <View style={{ paddingHorizontal: ResponsiveSize(5), width: '100%' }}>
                                                <View style={{
                                                    backgroundColor: '#84c750',
                                                    borderTopLeftRadius: ResponsiveSize(10),
                                                    borderBottomLeftRadius: ResponsiveSize(10),
                                                    borderBottomRightRadius: ResponsiveSize(10),
                                                    padding: ResponsiveSize(5)
                                                }}>
                                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                                        <Text style={styles.ReplyMsgUserName}>Replying</Text>
                                                        <ActivityIndicator size={'small'} color={global.white} style={{ marginLeft: ResponsiveSize(10) }} />
                                                    </View>
                                                </View>
                                            </View>
                                            :
                                            <>
                                                {items?.item?.repliedMessage != null &&
                                                    <View style={{ paddingHorizontal: ResponsiveSize(5), width: '100%', marginBottom: ResponsiveSize(5) }}>
                                                        {items?.item?.repliedMessage?.is_media == "Y" ?
                                                            <View style={{ ...styles.ReplyMsgBoxMine, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                {items?.item?.repliedMessage?.senderUserId == user_id ?
                                                                    <View>
                                                                        <Text style={styles.ReplyMsgUserName}>You</Text>
                                                                        <Text ellipsizeMode='tail' numberOfLines={2} style={{ ...styles.messageUser, width: '100%' }}>Photo</Text>
                                                                    </View>
                                                                    :
                                                                    <View>
                                                                        <Text style={styles.ReplyMsgUserName}>{route?.params?.user_name}</Text>
                                                                        <Text ellipsizeMode='tail' numberOfLines={2} style={{ ...styles.messageUser, width: '100%' }}>Photo</Text>
                                                                    </View>
                                                                }
                                                                <FastImage
                                                                    source={{ uri: items?.item?.repliedMessageMedia?.media_url, priority: FastImage.priority.high }}
                                                                    style={{
                                                                        height: ResponsiveSize(25),
                                                                        width: ResponsiveSize(25),
                                                                        borderRadius: ResponsiveSize(5),
                                                                        marginLeft: ResponsiveSize(10)
                                                                    }}
                                                                    resizeMode="cover"
                                                                />
                                                            </View>
                                                            :
                                                            <View style={styles.ReplyMsgBoxMine}>
                                                                {items?.item?.repliedMessage?.senderUserId == user_id ?
                                                                    <Text style={styles.ReplyMsgUserName}>You</Text>
                                                                    :
                                                                    <Text style={styles.ReplyMsgUserName}>{route?.params?.user_name}</Text>
                                                                }
                                                                <Text ellipsizeMode='tail' numberOfLines={2} style={{ ...styles.messageUser, width: '100%' }}>{items?.item?.repliedMessage?.message}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                }
                                            </>
                                        }
                                        <View style={{ paddingHorizontal: ResponsiveSize(10), paddingVertical: ResponsiveSize(1) }}>
                                            <Text style={styles.messageUser}>{items.item.message}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                                {items?.item?.isSend == false ?
                                                    <AntDesign name="clockcircleo" />
                                                    :
                                                    <>
                                                        {items?.item?.read_status == "N" ?
                                                            < AntDesign name="check" />
                                                            :
                                                            ""
                                                        }
                                                    </>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    {lastElement?.message_id == items?.item?.message_id && items?.item?.read_status == "Y" ?
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: ResponsiveSize(5) }}>
                                            <TextC text={"seen by"} font={'Montserrat-Medium'} size={ResponsiveSize(9)} style={{ color: global.black }} />
                                            <FastImage
                                                source={{ uri: route?.params?.profile_picture_url, priority: FastImage.priority.high }}
                                                style={{
                                                    height: ResponsiveSize(15),
                                                    width: ResponsiveSize(15),
                                                    borderRadius: ResponsiveSize(15),
                                                    marginLeft: ResponsiveSize(3)
                                                }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        : ""
                                    }
                                </View>
                            }
                        </Pressable>
                        :
                        <Pressable onLongPress={() => GetReply(items?.item)} style={styles.messageContainer1}>
                            {items?.item?.is_media == "Y" ?
                                <Pressable onPress={() => MediaDetail(items?.item, isVideo[1] == '4' ? false : true)} onLongPress={() => GetReply(items?.item)} style={styles.otherMedia2}>
                                    <FastImage
                                        source={
                                            items?.item?.media_url == ''
                                                ? require('../assets/icons/avatar.png')
                                                : { uri: items?.item?.media_url, priority: FastImage.priority.high }
                                        }
                                        style={styles.otherMediaThumbnail}
                                        resizeMode="cover"
                                    />
                                    {items?.item?.message !== "" ?
                                        <View style={styles.ImageMessage2}>
                                            <Text style={styles.message}>{items.item.message}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                                {items?.item?.isSend == false ?
                                                    <AntDesign name="clockcircleo" />
                                                    :
                                                    < AntDesign name="check" />
                                                }
                                            </View>
                                        </View>
                                        :
                                        <View style={styles.BottomInfoBar}>
                                            <Text style={styles.TimeAgoWhite}>{formattedTime}</Text>
                                            {items?.item?.isSend == false ?
                                                <AntDesign name="clockcircleo" color={global.white} />
                                                :
                                                <AntDesign name="check" color={global.white} />
                                            }
                                        </View>
                                    }
                                </Pressable>
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <ImageBackground
                                        source={
                                            route?.params?.profile_picture_url == ''
                                                ? require('../assets/icons/avatar.png')
                                                : { uri: route?.params?.profile_picture_url }
                                        }
                                        style={styles.PostProfileImage2}
                                        resizeMode="cover" />
                                    <View style={styles.thisUserText}>
                                        {items?.item?.repliedMessage != null &&
                                            <View style={{ width: '100%', marginBottom: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(5) }}>
                                                {items?.item?.repliedMessage?.is_media == "Y" ?
                                                    <View style={{ ...styles.ReplyMsgBoxMine2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        {items?.item?.repliedMessage?.senderUserId == user_id ?
                                                            <View>
                                                                <Text style={styles.ReplyMsgUserName}>You</Text>
                                                                <Text ellipsizeMode='tail' numberOfLines={2} style={{ ...styles.messageUser, width: '100%', color: global.black }}>Photo</Text>
                                                            </View>
                                                            :
                                                            <View>
                                                                <Text style={styles.ReplyMsgUserName}>{route?.params?.user_name}</Text>
                                                                <Text ellipsizeMode='tail' numberOfLines={2} style={{ ...styles.messageUser, width: '100%', color: global.black }}>Photo</Text>
                                                            </View>
                                                        }
                                                        <FastImage
                                                            source={{ uri: items?.item?.repliedMessageMedia?.media_url, priority: FastImage.priority.high }}
                                                            style={{
                                                                height: ResponsiveSize(25),
                                                                width: ResponsiveSize(25),
                                                                borderRadius: ResponsiveSize(5),
                                                                marginLeft: ResponsiveSize(10)
                                                            }}
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                    :
                                                    <View style={styles.ReplyMsgBoxMine2}>
                                                        {items?.item?.repliedMessage?.senderUserId == user_id ?
                                                            <Text style={styles.ReplyMsgUserName}>You</Text>
                                                            :
                                                            <Text style={styles.ReplyMsgUserName}>{route?.params?.user_name}</Text>
                                                        }
                                                        <Text ellipsizeMode='tail' numberOfLines={2} style={{ ...styles.messageUser, width: '100%', color: global.black }}>{items?.item?.repliedMessage?.message}</Text>
                                                    </View>
                                                }
                                            </View>
                                        }
                                        <View style={{ paddingHorizontal: ResponsiveSize(10) }}>
                                            <Text style={styles.message}>{items.item.message}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.TimeAgo}>{formattedTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            }
                            <View style={styles.empty}></View>
                        </Pressable>
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