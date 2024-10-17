import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    DarkTheme,
    Dimensions,
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
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeAgo from '@manu_omg/react-native-timeago';
import { baseUrl } from '../store/config.json'
import * as AllConnectionsAction from "../store/actions/Connections/index";
import { connect } from "react-redux";


const NewMessage = ({ getAllConnections, AllConnectionsReducer }) => {
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
            paddingLeft: ResponsiveSize(40),
            width: windowWidth - ResponsiveSize(30),
            height: ResponsiveSize(40)
        },
        SearchIcon: {
            position: 'absolute',
            top: ResponsiveSize(10),
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
    const [loader, setLoader] = useState(false)

    const allEventDataLoader = async () => {
        const loadAllevent = await getAllConnections({ page: 1 })
        setRecentChats(loadAllevent)
        setLoader(false)
    }
    useEffect(() => {
        setLoader(true)
        allEventDataLoader({ refreshing: false })
    }, []);

    const renderItem = useCallback(({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Message', {
                receiverUserId: item?.user_id,
                profile_picture_url: item?.profile_picture_url,
                user_name: item?.user_name
            })} style={styles.PostHeader}>
                <View style={{ flexDirection: 'row' }}>
                    <ImageBackground
                        source={
                            item?.userDetails?.profile_picture_url == ''
                                ? require('../assets/icons/avatar.png')
                                : { uri: item?.profile_picture_url }
                        }
                        style={styles.PostProfileImage}
                        resizeMode="cover"></ImageBackground>
                    <View style={styles.PostProfileImageBox}>
                        <TextC
                            size={ResponsiveSize(12)}
                            text={item?.user_name}
                            font={'Montserrat-Bold'}
                        />
                        <TextC
                            size={ResponsiveSize(10)}
                            text={item.user_type == "PILOT" ? "Pilot" : item.user_type == "FLIGHT ATTENDANT" ? "Flight attendent" : item.user_type == "TECHNICIAN" ? "Technician" : ""}
                            font={'Montserrat-Medium'}
                            style={{ color: global.placeholderColor }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, []);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
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
                    <TextC size={ResponsiveSize(14)} font={'Montserrat-Bold'} text={"Connections"} />
                </View>
                <TouchableOpacity style={styles.logoSide3}>
                </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
                <View style={styles.SearchInputWrapper}>
                    <AntDesign style={styles.SearchIcon} name='search1' color={global.primaryColor} size={ResponsiveSize(20)} />
                    <TextInput style={styles.SearchInput} placeholder="Search Your Connections" />
                </View>
            </View>

            {loader ?
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: ResponsiveSize(50),
                        flex: 1,
                        paddingHorizontal: ResponsiveSize(40)
                    }}>
                    <ActivityIndicator size={"large"} />
                </View>
                :
                <>
                    {recentChats !== undefined && recentChats !== "" && recentChats !== null && recentChats.length > 0 ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={10}
                            data={recentChats}
                            keyExtractor={(items, index) => index?.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            renderItem={renderItem}
                            contentContainerStyle={{paddingHorizontal:ResponsiveSize(15)}}
                        />
                        :
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: ResponsiveSize(50),
                                flex: 1,
                                paddingHorizontal: ResponsiveSize(40)
                            }}>
                            <TextC
                                text={'No connections found'}
                                font={'Montserrat-Bold'}
                                size={ResponsiveSize(13)}
                            />
                            <TextC
                                text={'It seems there are no connections available at the moment.'}
                                font={'Montserrat-Medium'}
                                size={ResponsiveSize(11)}
                                style={{ marginTop: ResponsiveSize(2), color: global.placeholderColor, textAlign: 'center' }}
                            />
                            <TouchableOpacity onPress={() => navigation.navigate('NewMessage')} style={{ backgroundColor: global.secondaryColor, paddingVertical: ResponsiveSize(6), paddingHorizontal: ResponsiveSize(15), marginTop: ResponsiveSize(10), borderRadius: ResponsiveSize(50) }}>
                                <TextC
                                    text={'Find people'}
                                    font={'Montserrat-Medium'}
                                    size={ResponsiveSize(11)}
                                    style={{ color: global.primaryColor }}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </>
            }
        </SafeAreaView >
    )
}
function mapStateToProps({ AllConnectionsReducer }) {
    return { AllConnectionsReducer };
}
export default connect(mapStateToProps, AllConnectionsAction)(NewMessage);