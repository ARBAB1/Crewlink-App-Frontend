import React, { useEffect, useRef, useState } from "react";
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
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeAgo from '@manu_omg/react-native-timeago';
import { baseUrl } from '../store/config.json'
import * as AllConnectionsAction from "../store/actions/Connections/index";
import { connect } from "react-redux";


const NewGroupScreen = ({ getAllConnections, AllConnectionsReducer }) => {
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
            position: 'relative',
        },
        SearchInput: {
            borderRadius: ResponsiveSize(20),
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            fontSize: ResponsiveSize(12),
            fontFamily: 'Montserrat-Medium',
            borderColor: global.description,
            borderWidth: ResponsiveSize(1),
            position: 'relative',
            paddingLeft: ResponsiveSize(35),
        },
        SearchIcon: {
            position: 'absolute',
            top: ResponsiveSize(8),
            left: ResponsiveSize(10),
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
        AddonIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        NextBtn: {
            backgroundColor: '#69BE25',
            paddingHorizontal: ResponsiveSize(20),
            paddingVertical: ResponsiveSize(4),
            borderRadius: ResponsiveSize(20),
            alignItems: 'center',
            justifyContent: 'center',
        }
    });
    const navigation = useNavigation();
    const [recentChats, setRecentChats] = useState([])
    const [searchUser, setSearchUser] = useState("")
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

    const [members, setMembers] = useState([])

    const addMembers = (user) => {
        setMembers((prevItems) => {
            const exists = prevItems.some(item => item.user_id === user.user_id);
            if (exists) {
                setRecentChats((recentChats) => [user, ...recentChats.filter(item => item.user_id !== user.user_id)]);
                return prevItems.filter(item => item.user_id !== user.user_id);
            } else {
                setRecentChats((recentChats) => recentChats.filter(item => item.user_id !== user.user_id));
                return [...prevItems, user];
            }
        });
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
                    <TouchableOpacity style={styles.logoSide3}>
                        {members.length > 0 ?
                            <TouchableOpacity onPress={() => navigation.navigate('NewGroupSecondScreen', members)} style={styles.NextBtn}>
                                <TextC size={ResponsiveSize(11)} text={'Next'} font={'Montserrat-SemiBold'} />
                            </TouchableOpacity> : ""}
                    </TouchableOpacity>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.SearchInputWrapper}>
                        <AntDesign style={styles.SearchIcon} name='search1' color={global.primaryColor} size={ResponsiveSize(20)} />
                        <TextInput onChangeText={(e) => setSearchUser(e)} style={styles.SearchInput} placeholder="Search" />
                    </View>
                    {loader ?
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(50) }}>
                            <ActivityIndicator size={'large'} color={global.primaryColor} />
                        </View>
                        :
                        <View>

                            {members !== undefined && members !== "" && members !== null && members.length > 0 ? members?.map(recentChats => {
                                return (
                                    <TouchableOpacity onPress={() => addMembers(recentChats)} style={styles.PostHeader}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <ImageBackground
                                                source={
                                                    recentChats?.userDetails?.profile_picture_url == ''
                                                        ? require('../assets/icons/avatar.png')
                                                        : { uri: recentChats?.profile_picture_url }
                                                }
                                                style={styles.PostProfileImage}
                                                resizeMode="cover">
                                            </ImageBackground>
                                            <View style={styles.PostProfileImageBox}>
                                                <TextC
                                                    size={ResponsiveSize(12)}
                                                    text={recentChats?.user_name}
                                                    font={'Montserrat-Bold'}
                                                />
                                                <TextC
                                                    size={ResponsiveSize(10)}
                                                    text={recentChats.user_type == "PILOT" ? "Pilot" : recentChats.user_type == "FLIGHT ATTENDANT" ? "Flight attendent" : recentChats.user_type == "TECHNICIAN" ? "Technician" : ""}
                                                    font={'Montserrat-Medium'}
                                                    style={{ color: global.placeholderColor }}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.AddonIndicator}>
                                            <AntDesign name="checkcircleo" size={ResponsiveSize(18)} color={global.secondaryColor} />
                                        </View>
                                    </TouchableOpacity>
                                )
                            }) : ""}

                            {members.length > 0 ?
                                <View
                                    style={{
                                        borderBottomColor: global.description,
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginTop: ResponsiveSize(15)
                                    }}
                                />
                                : ""}


                            {recentChats !== undefined && recentChats !== "" && recentChats !== null && recentChats.length > 0 ? recentChats?.filter(item => item?.user_name.toLowerCase().includes(searchUser.toLowerCase())).map(recentChats => {
                                return (
                                    <TouchableOpacity style={styles.PostHeader} onPress={() => addMembers(recentChats)}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <ImageBackground
                                                source={
                                                    recentChats?.userDetails?.profile_picture_url == ''
                                                        ? require('../assets/icons/avatar.png')
                                                        : { uri: recentChats?.profile_picture_url }
                                                }
                                                style={styles.PostProfileImage}
                                                resizeMode="cover"></ImageBackground>
                                            <View style={styles.PostProfileImageBox}>
                                                <TextC
                                                    size={ResponsiveSize(12)}
                                                    text={recentChats?.user_name}
                                                    font={'Montserrat-Bold'}
                                                />
                                                <TextC
                                                    size={ResponsiveSize(10)}
                                                    text={recentChats.user_type == "PILOT" ? "Pilot" : recentChats.user_type == "FLIGHT ATTENDANT" ? "Flight attendent" : recentChats.user_type == "TECHNICIAN" ? "Technician" : ""}
                                                    font={'Montserrat-Medium'}
                                                    style={{ color: global.placeholderColor }}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            ) :
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(50) }}>
                                    <TextC text={'No Connections found'} font={'Montserrat-Medium'} size={ResponsiveSize(11)} />
                                </View>
                            }
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
function mapStateToProps({ AllConnectionsReducer }) {
    return { AllConnectionsReducer };
}
export default connect(mapStateToProps, AllConnectionsAction)(NewGroupScreen);