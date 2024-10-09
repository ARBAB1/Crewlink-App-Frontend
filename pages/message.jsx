import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    DarkTheme,
    Dimensions,
    Easing,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    Vibration,
    View,
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
import { baseUrl, apiKey } from '../store/config.json'
import { Animated } from "react-native";
import FastImage from "react-native-fast-image";
import { useBottomSheet } from '../components/bottomSheet/BottomSheet';
import ButtonC from "../components/button";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Modal from "react-native-modal";


const Message = ({ route }) => {
    console.log(route?.params,"route");
    const focus = useIsFocused();
    const scheme = useColorScheme();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();
    const [imageRatio, setImageRatio] = useState("")
 
    const [newMessage, setNewMessage] = useState("")
    const [recentChats, setRecentChats] = useState([])
    const [user_id, setUserId] = useState()
    const [page, setPage] = useState(2)
    const [loadMoreLoader, setLoadMoreLoader] = useState(false)
    const [isMediaDetail, setIsMediaDetail] = useState(false)
    const [hasMoreContent, setHasMoreContent] = useState(true);
    const [loader, setLoader] = useState(false)
    const [queue, setQueue] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const scrollViewRef = useRef();

    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const fetchUserDetails = async () => {
        try {
            const Token = await AsyncStorage.getItem('Token');
            const response = await fetch(`${baseUrl}/users/user-details-by-user-id/${route?.params?.receiverUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
          'accesstoken': `Bearer ${Token}`,
                },
            });
            const result = await response.json();
            if (result.statusCode === 200) {
                console.log(result.data,"userDetails");
                setUserDetails(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };

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

        MessageInput: {
            paddingHorizontal: ResponsiveSize(15),
            height: ResponsiveSize(45),
            fontFamily: "Montserrat-Medium",
            backgroundColor: "#EEEEEE",
            fontSize: ResponsiveSize(12),
            paddingVertical: ResponsiveSize(15),
            borderRadius: ResponsiveSize(15)
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
        CameraBtn: {
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
            fontSize: ResponsiveSize(12),
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
        TimeAgoWhite: {
            fontSize: ResponsiveSize(8),
            color: global.white,
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
            paddingVertical: ResponsiveSize(5),
            maxWidth: windowWidth * 0.6
        },
        otherUserText: {
            backgroundColor: global.secondaryColor,
            borderTopLeftRadius: ResponsiveSize(10),
            borderBottomLeftRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingVertical: ResponsiveSize(5),
            maxWidth: windowWidth * 0.7
        },
        ImageMessage: {
            backgroundColor: global.secondaryColor,
            borderTopLeftRadius: ResponsiveSize(10),
            borderBottomLeftRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            width: windowWidth * 0.7
        },
        messageText: {
            fontSize: 16,
        },
        leftAction: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            padding: ResponsiveSize(10),
        },
        actionText: {
            color: 'white',
            fontWeight: 'bold',
        },
        otherMedia: {
            backgroundColor: global.secondaryColor,
            borderRadius: ResponsiveSize(10),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth * 0.7,
            paddingVertical: ResponsiveSize(6),
            position: 'relative'
        },
        otherMedia2: {
            backgroundColor: global.description,
            borderRadius: ResponsiveSize(10),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth * 0.7,
            paddingVertical: ResponsiveSize(6),
            position: 'relative'
        },
        ImageMessage2: {
            backgroundColor: global.description,
            borderTopLeftRadius: ResponsiveSize(10),
            borderBottomLeftRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            width: windowWidth * 0.7
        },
        otherMediaThumbnail: {
            borderRadius: ResponsiveSize(10),
            width: windowWidth * 0.67,
            height: windowWidth * 0.67
        },
        BottomInfoBar: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: ResponsiveSize(10),
            width: windowWidth * 0.7
        },



        MessageInputWrapper: {
            width: windowWidth,
            position: 'absolute',
            paddingHorizontal: ResponsiveSize(10),
            paddingTop: ResponsiveSize(5),
            paddingBottom: ResponsiveSize(10),
            bottom: 0,
            backgroundColor: global.white,
            borderTopWidth: 1,
            borderTopColor: "#EEEEEE"
        },
        CameraBtnWrapper: {
            width: windowWidth * 0.12 - ResponsiveSize(10),
        },
        InputWrapper: {
            width: windowWidth * 0.73 - ResponsiveSize(10),
        },
        SentBtnWrapper: {
            width: windowWidth * 0.15 - ResponsiveSize(10),
        },
        ReplyBox: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(5),
            paddingBottom: ResponsiveSize(10),
        },
        ReplyInfo: {
            flexDirection: 'column',
        },
        closeReply: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        ReplyMsgBoxMine: {
            maxHeight: ResponsiveSize(60),
            backgroundColor: '#84c750',
            borderTopLeftRadius: ResponsiveSize(10),
            borderBottomLeftRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            padding: ResponsiveSize(5)
        },
        ReplyMsgBoxMine2: {
            maxHeight: ResponsiveSize(60),
            backgroundColor: '#EEEEEE',
            borderBottomLeftRadius: ResponsiveSize(10),
            borderTopRightRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            padding: ResponsiveSize(5)
        },
        ReplyMsgUserName: {
            fontSize: ResponsiveSize(11),
            color: global.primaryColor,
            fontFamily: 'Montserrat-Bold',
        },
        LoadMoreAbsolute: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        EmptyMessage: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
    const openPhotoLibrary = async () => {
        const result = await launchImageLibrary({
            mediaType: 'mixed'
        });
        if (result?.assets.length > 0) {
            closeBottomSheet();
            navigation.navigate('messageMedia', {
                media_url: result?.assets,
                receiverUserId: route?.params?.receiverUserId,
                profile_picture_url: userDetails?.profile_picture_url, // Replaced here
                user_name: userDetails?.user_name
            })
        }
    };

   
    const MediaDetail = (address, isImage) => {
        setIsMediaDetail(true)
        if (isImage) {
            Image.getSize(
                address?.media_url,
                (width, height) => {
                    const ratio = width / height;
                    navigation.navigate('MediaDetail', {
                        uri: address,
                        ratio: ratio,
                        profile_picture_url: userDetails?.profile_picture_url, // Replaced here
                        user_name: userDetails?.user_name,
                        isImage: isImage

                    })
                },
                (error) => {
                    console.error(`Couldn't get the image size: ${error}`);
                }
            );
        }
        else {
            navigation.navigate('MediaDetail', {
                uri: address,
                profile_picture_url: userDetails?.profile_picture_url, // Replaced here
                user_name: userDetails?.user_name,
                isImage: isImage
            })
        }
    }
    const handleOpenSheet = () => {
Keyboard.dismiss()
        openBottomSheet(
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        paddingHorizontal: ResponsiveSize(15),
                        paddingVertical:ResponsiveSize(15)
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


    const openMobileCamera = async () => {
        const result = await launchCamera();
        if (result?.assets.length > 0) {
            closeBottomSheet();
            navigation.navigate('messageMedia', {
                media_url: result?.assets,
                receiverUserId: route?.params?.receiverUserId,
                profile_picture_url: userDetails?.profile_picture_url, // Replaced here
                user_name: userDetails?.user_name
            })
        }
    };

    const loadRecentChats = async () => {
        setLoader(true)
        const Token = await AsyncStorage.getItem('Token');
        const U_id = await AsyncStorage.getItem('U_id');
        setUserId(U_id)
        const socket = io(`${baseUrl}/chat`, {
            transports: ['websocket'],
            extraHeaders: {
                'x-api-key': "TwillioAPI",
                'accesstoken': `Bearer ${Token}`
            }
        });
        socket.on('connect').emit('oldMessages', {
            "receiverUserId": route?.params?.receiverUserId,
        }).emit('readMessage', { receiverUserId: route?.params?.receiverUserId }).on('message', (data) => {
            if (data?.message.length >= 25) {
                setLoader(false)
                setRecentChats(data?.message);
                scrollViewRef.current.scrollToEnd({ animated: true })
            }
            else {
                setHasMoreContent(false)
                setLoader(false)
                setRecentChats(data?.message);
                scrollViewRef.current.scrollToEnd({ animated: true })
            }
        }).emit('readMessage', { receiverUserId: route?.params?.receiverUserId })
    }

    useEffect(() => {
        fetchUserDetails();
        loadRecentChats()
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        });
        return () => {
            closeBottomSheet();
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


    const addToQueue = (message) => {
        setQueue(prevQueue => [...prevQueue, message]);
        setNewMessage('')
        scrollViewRef.current.scrollToEnd({ animated: true })
    };


    const processQueue = useCallback(async () => {
        if (queue.length === 0 || isProcessing) return;
        setIsProcessing(true);
        const messagecache = queue[0];
        try {
            await sendMessage(messagecache);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setQueue(prevQueue => prevQueue.slice(1));
            setIsProcessing(false);
        }
    }, [queue, isProcessing]);

    useEffect(() => {
        if (queue.length > 0 && !isProcessing) {
            processQueue();
        }
    }, [queue, isProcessing, processQueue]);


    const sendMessage = async (message_Props) => {
        if (message_Props !== "") {
            setRecentChats(prev => [
                ...prev,
                {
                    created_at: Date.now(),
                    message: message_Props,
                    isSend: false,
                    senderUserId: user_id,
                    isReplyingWait: ReplyMessage == undefined ? false : true
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
            socket.on('connect').emit('createDirectMessage', {
                "message": message_Props,
                "receiverUserId": route?.params?.receiverUserId,
                "repliedMessageId": ReplyMessage?.message_id
            }).emit('readMessage', { receiverUserId: route?.params?.receiverUserId }).on('message', (data) => {
                CancelReply()
                setRecentChats(data?.message);
            })
        }
    }
    const [ReplyMessage, setReplyMessage] = useState()
    const GetReply = (Address) => {
        fadeIn()
        setReplyMessage(Address)
        Vibration.vibrate(100)
    }
    const CancelReply = () => {
        fadeOut()
        setReplyMessage()
    }
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };
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
                                                    source={{ uri: userDetails?.profile_picture_url, priority: FastImage.priority.high }}
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
                                                                        <Text style={styles.ReplyMsgUserName}>{userDetails?.user_name}</Text>
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
                                                                    <Text style={styles.ReplyMsgUserName}>{userDetails?.user_name}</Text>
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
                                                source={{ uri: userDetails?.profile_picture_url, priority: FastImage.priority.high }}
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
                                <>
                                    <ImageBackground
                                        source={
                                            userDetails?.profile_picture_url == ''
                                                ? require('../assets/icons/avatar.png')
                                                : { uri: userDetails?.profile_picture_url }
                                        }
                                        style={styles.PostProfileImage2}
                                        resizeMode="cover" />
                                    <Pressable onPress={() => MediaDetail(items?.item, isVideo[1] == '4' ? false : true)} onLongPress={() => GetReply(items?.item)} style={styles.otherMedia2}>
                                        {isVideo[1] == '4' ?
                                            <>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TextC text={'Video'} font={'Montserrat-Medium'} size={ResponsiveSize(12)} style={{ color: global.black }} />
                                                    <Feather name="video" color={global.black} size={ResponsiveSize(14)} style={{ marginLeft: ResponsiveSize(5) }} />
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
                                            </>
                                        }
                                    </Pressable>
                                </>
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <ImageBackground
                                        source={
                                            userDetails?.profile_picture_url == ''
                                                ? require('../assets/icons/avatar.png')
                                                : { uri: userDetails?.profile_picture_url }
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
                                                                <Text style={styles.ReplyMsgUserName}>{userDetails?.user_name}</Text>
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
                                                            <Text style={styles.ReplyMsgUserName}>{userDetails?.user_name}</Text>
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





    const GetChatHistory = async () => {
        setLoadMoreLoader(true)
        const Token = await AsyncStorage.getItem('Token');
        try {
            const response = await fetch(`${baseUrl}/messages/get-old-messages/${page}/25`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'accesstoken': `Bearer ${Token}`
                },
                body: JSON.stringify({
                    receiverUserId: route?.params?.receiverUserId,
                })
            });
            const dataRe = await response.json();
            if (dataRe?.message.length >= 25) {
                setRecentChats((prevMessages) => [...dataRe?.message, ...prevMessages])
                setPage(page + 1)
                setLoadMoreLoader(false)
            }
            else {
                setHasMoreContent(false)
                setRecentChats((prevMessages) => [...dataRe?.message, ...prevMessages])
                setPage(page + 1)
                setLoadMoreLoader(false)
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            setLoadMoreLoader(false)
        }
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flexGrow: 1 }}
            keyboardVerticalOffset={
                Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
            }>
            <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
                <StatusBar
                    backgroundColor={global.white}
                    barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
                />
                <View style={styles.wrapper}>
                    <Pressable onPress={() =>    navigation.navigate('Home', { screen: 'MessageList' }) } style={styles.logoSide1}>
                        <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <ImageBackground
                            source={
                                userDetails?.profile_picture_url == ''
                                    ? require('../assets/icons/avatar.png')
                                    : { uri: userDetails?.profile_picture_url }
                            }
                            style={styles.PostProfileImage}
                            resizeMode="cover"></ImageBackground>
                        <TextC size={ResponsiveSize(12)} font={'Montserrat-Bold'} text={userDetails?.user_name} />
                    </View>
                </View>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white, position: 'relative', paddingTop: ResponsiveSize(10), paddingBottom: ResponsiveSize(ReplyMessage?.message_id ? 100 : 65) }}
                >
                    {hasMoreContent &&
                        <>
                            {!loader &&
                                <>
                                    {loadMoreLoader ?
                                        <View style={styles.LoadMoreAbsolute}>
                                            <ActivityIndicator color={global.black} size={'small'} />
                                        </View>
                                        :
                                        <View style={styles.LoadMoreAbsolute}>
                                            <TouchableOpacity onPress={GetChatHistory} style={{ backgroundColor: global.secondaryColor, paddingHorizontal: ResponsiveSize(10), paddingVertical: ResponsiveSize(5), borderRadius: ResponsiveSize(20) }}>
                                                <TextC text={'Load More'} size={ResponsiveSize(11)} font={"Montserrat-Regular"} style={{ color: global.white }} />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </>
                            }
                        </>
                    }
                    {loader ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <ActivityIndicator size={'large'} color={global.primaryColor} />
                        </View>
                        :

                        <>
                            {recentChats?.length > 0 ?
                                <FlashList
                                    estimatedItemSize={25}
                                    showsVerticalScrollIndicator={false}
                                    data={recentChats}
                                    keyExtractor={(items, index) => index?.toString()}
                                    renderItem={renderItem}
                                    scrollEventThrottle={16}
                                />
                                :
                                <View style={styles.EmptyMessage}>
                                    <TextC text={'No messages yet.'} size={ResponsiveSize(14)} font={"Montserrat-Regular"} style={{ color: global.description }} />
                                </View>
                            }
                        </>
                    }

                </ScrollView>
                <View style={styles.MessageInputWrapper}>
                    {ReplyMessage?.message_id &&
                        <Animated.View style={{ ...styles.ReplyBox, opacity: fadeAnim }}>
                            <View style={styles.ReplyInfo}>
                                {ReplyMessage?.senderUserId == user_id ?
                                    <TextC text={`Replying to yourself`} font={"Montserrat-Medium"} size={ResponsiveSize(10)} style={{ color: global.description, paddingTop: ResponsiveSize(3), width: ResponsiveSize(220) }} ellipsizeMode='tail' numberOfLines={1} />
                                    :
                                    <TextC text={`Replying to ${userDetails?.user_name}`} font={"Montserrat-Medium"} size={ResponsiveSize(10)} style={{ color: global.description, paddingTop: ResponsiveSize(3), width: ResponsiveSize(220) }} ellipsizeMode='tail' numberOfLines={1} />
                                }
                                {ReplyMessage?.media_url ?
                                    <TextC text={"Photo"} font={"Montserrat-Medium"} size={ResponsiveSize(11)} style={{ color: global.black, paddingTop: ResponsiveSize(3), width: ResponsiveSize(220) }} ellipsizeMode='tail' numberOfLines={1} />
                                    :
                                    <TextC text={ReplyMessage?.message} font={"Montserrat-Medium"} size={ResponsiveSize(11)} style={{ color: global.black, paddingTop: ResponsiveSize(3), width: ResponsiveSize(220) }} ellipsizeMode='tail' numberOfLines={1} />
                                }
                            </View>
                            <View style={styles.closeReply}>
                                {ReplyMessage?.media_url &&
                                    <FastImage
                                        source={{ uri: ReplyMessage?.media_url, priority: FastImage.priority.high }}
                                        style={{
                                            height: ResponsiveSize(25),
                                            width: ResponsiveSize(25),
                                            borderRadius: ResponsiveSize(5),
                                        }}
                                        resizeMode="cover"
                                    />
                                }
                                <TouchableOpacity onPress={CancelReply} style={{ paddingLeft: ResponsiveSize(10), paddingVertical: ResponsiveSize(5) }}>
                                    <AntDesign name="close" color={global.black} size={ResponsiveSize(18)} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.CameraBtnWrapper}>
                            <TouchableOpacity onPress={handleOpenSheet} style={styles.CameraBtn}>
                                <Feather name="plus" color={global.black} size={ResponsiveSize(20)} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.InputWrapper}>
                            <TextInput placeholder="Message..." style={styles.MessageInput} value={newMessage} onPress={() =>
                                scrollViewRef.current.scrollToEnd({ animated: true })
                            } onChangeText={(e) => setNewMessage(e)} />
                        </View>
                        <View style={styles.SentBtnWrapper}>
                            <TouchableOpacity onPress={() => addToQueue(newMessage)} style={styles.SentBtn}>
                                <Feather name="send" color={global.white} size={ResponsiveSize(16)} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
export default Message;