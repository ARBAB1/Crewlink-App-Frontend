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
import { TextInput } from "react-native-gesture-handler";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeAgo from '@manu_omg/react-native-timeago';
import { baseUrl } from '../store/config.json'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'


const MessageList = () => {
    const focus = useIsFocused();
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
            height: ResponsiveSize(45),
            width: ResponsiveSize(45),
            borderRadius: ResponsiveSize(45),
            backgroundColor: global.description,
            marginRight: ResponsiveSize(10),
            overflow: 'hidden',
        },
        PostProfileImage2: {
            height: windowWidth * 0.1,
            width: windowWidth * 0.1,
            borderRadius: windowWidth * 0.1,
            backgroundColor: global.description,
            marginRight: ResponsiveSize(10),
            overflow: 'hidden',
        },
        PostProfileImageBox: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
    });
    const navigation = useNavigation();
    const [recentChats, setRecentChats] = useState([])
    const [filterText, setFilterText] = useState("")

    const [loader, setLoader] = useState(false)

    const loadRecentChats = async () => {
        if (focus == true) {
            const Token = await AsyncStorage.getItem('Token');
            const socket = io(`${baseUrl}/chat`, {
                transports: ['websocket'],
                extraHeaders: {
                    'x-api-key': "TwillioAPI",
                    'accesstoken': `Bearer ${Token}`
                }
            });
            socket.on('connect').on('chatList', (data) => {
                setLoader(false)
                setRecentChats(data);
            })
        }
    }

    useEffect(() => {
        loadRecentChats()
    }, [focus])

    useEffect(() => {
        setLoader(true)
        loadRecentChats()
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                backgroundColor={
                    scheme === 'dark' ? "#000" : 'white'
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
                        <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"Message"} />
                    </View>
                    <View style={styles.logoSide3}>
                        <TouchableOpacity onPress={() => navigation.navigate("newGroup")} style={{ marginRight: ResponsiveSize(6) }}>
                            <Feather name='users' color={global.primaryColor} size={ResponsiveSize(20)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("NewMessage")} >
                            <Entypo name='plus' color={global.primaryColor} size={ResponsiveSize(22)} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bodyWrapper}>
                    {loader ?
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(50) }}>
                            <ActivityIndicator size={'large'} color={global.primaryColor} />
                        </View>
                        :
                        <View>
                            {recentChats !== undefined && recentChats !== "" && recentChats !== null && recentChats.length > 0 ? recentChats.map(recentChats => {
                         
                                return (
                                    recentChats.type == 'direct' ?
                                        <TouchableOpacity onPress={() => navigation.navigate('Message', {
                                            receiverUserId: recentChats?.userDetails?.user_id,
                                            profile_picture_url: recentChats?.userDetails?.profile_picture_url,
                                            user_name: recentChats?.userDetails?.user_name
                                        })} style={styles.PostHeader}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <ImageBackground
                                                    source={
                                                        recentChats?.userDetails?.profile_picture_url == ''
                                                            ? require('../assets/icons/avatar.png')
                                                            : { uri: recentChats?.userDetails?.profile_picture_url }
                                                    }
                                                    style={styles.PostProfileImage}
                                                    resizeMode="cover"></ImageBackground>
                                                <View style={styles.PostProfileImageBox}>
                                                    <TextC
                                                        size={ResponsiveSize(12)}
                                                        text={recentChats?.userDetails?.user_name}
                                                        font={'Montserrat-Bold'}
                                                    />
                                                    {recentChats?.isLastMessageMedia ?
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Ionicons name="image-outline" size={ResponsiveSize(12)} style={{ marginRight: ResponsiveSize(2) }} />
                                                            <TextC
                                                                size={ResponsiveSize(10)}
                                                                text={"Media"}
                                                                font={'Montserrat-Medium'}
                                                                style={{ color: global.placeholderColor, width: ResponsiveSize(140) }} ellipsizeMode={"tail"} numberOfLines={1}
                                                            />
                                                        </View>
                                                        :
                                                        <TextC
                                                            size={ResponsiveSize(10)}
                                                            text={recentChats?.message}
                                                            font={'Montserrat-Medium'}
                                                            style={{ color: global.placeholderColor, width: ResponsiveSize(140) }} ellipsizeMode={"tail"} numberOfLines={1}
                                                        />
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <TimeAgo
                                                    style={{ fontFamily: "Montserrat-Medium", fontSize: ResponsiveSize(8) }}
                                                    time={recentChats?.created_at}
                                                />
                                                {recentChats?.unreadMessagesCount > 0 &&
                                                    <View style={{
                                                        backgroundColor: global.secondaryColor,
                                                        height: ResponsiveSize(15),
                                                        width: ResponsiveSize(15),
                                                        borderRadius: ResponsiveSize(15),
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginTop: ResponsiveSize(5)
                                                    }}>
                                                        <TextC font={'Montserrat-Medium'} size={ResponsiveSize(8)} text={recentChats?.unreadMessagesCount} style={{ color: global.white }} />
                                                    </View>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => navigation.navigate('GroupMessage', {
                                            group_id: recentChats?.group?.group_id,
                                            profile_picture_url: recentChats?.group?.group_image,
                                            user_name: recentChats?.group?.group_name
                                        })} style={styles.PostHeader}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <ImageBackground
                                                    source={
                                                        recentChats?.group?.profile_picture_url == ''
                                                            ? require('../assets/icons/avatar.png')
                                                            : { uri: recentChats?.group?.group_image }
                                                    }
                                                    style={styles.PostProfileImage}
                                                    resizeMode="cover"></ImageBackground>
                                                <View style={styles.PostProfileImageBox}>
                                                    <TextC
                                                        size={ResponsiveSize(12)}
                                                        text={recentChats?.group?.group_name}
                                                        font={'Montserrat-Bold'}
                                                    />
                                                   {recentChats?.group?.isLastMessageMedia ?
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Ionicons name="image-outline" size={ResponsiveSize(12)} style={{ marginRight: ResponsiveSize(2) }} />
                                                            <TextC
                                                                size={ResponsiveSize(10)}
                                                                text={"Media"}
                                                                font={'Montserrat-Medium'}
                                                                style={{ color: global.placeholderColor, width: ResponsiveSize(140) }} ellipsizeMode={"tail"} numberOfLines={1}
                                                            />
                                                        </View>
                                                        :
                                                        <TextC
                                                            size={ResponsiveSize(10)}
                                                            text={recentChats?.group?.lastMessage}
                                                            font={'Montserrat-Medium'}
                                                            style={{ color: global.placeholderColor, width: ResponsiveSize(140) }} ellipsizeMode={"tail"} numberOfLines={1}
                                                        />
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <TimeAgo
                                                    style={{ fontFamily: "Montserrat-Medium", fontSize: ResponsiveSize(8) }}
                                                    time={recentChats?.group?.created_at}
                                                />
                                                {recentChats?.group?.unreadMessagesCount > 0 &&
                                                    <View style={{
                                                        backgroundColor: global.secondaryColor,
                                                        height: ResponsiveSize(15),
                                                        width: ResponsiveSize(15),
                                                        borderRadius: ResponsiveSize(15),
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginTop: ResponsiveSize(5)
                                                    }}>
                                                        <TextC font={'Montserrat-Medium'} size={ResponsiveSize(8)} text={recentChats?.unreadMessagesCount} style={{ color: global.white }} />
                                                    </View>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                )
                            }
                            ) :
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(50) }}>
                                    <TextC text={'No chats found'} font={'Montserrat-Medium'} size={ResponsiveSize(11)} style={{ color: global.black }} />
                                </View>
                            }
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default MessageList;