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
    Image,
    Text,
} from "react-native";
import Modal from "react-native-modal";
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from "../components/text/text";
import { TextInput } from "react-native-gesture-handler";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
import Icon from 'react-native-vector-icons/FontAwesome';
import { useToast } from "react-native-toast-notifications";




const UserChatSetting = ({ route }) => {
    const scheme = useColorScheme();
    const focus = useIsFocused();
    const windowHeight = Dimensions.get('window').height;
    const [isVisible, setIsVisible] = useState(false);
    const windowWidth = Dimensions.get('window').width;
    const [inputText, setInputText] = useState('');
    const styles = StyleSheet.create({
        BoxWrapper1: {
            padding: 20,
            backgroundColor: '#fff',  // White background for the box
        },
        actionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,  // Space between each action item
        },
        icon: {
            marginRight: 15,  // Space between the icon and the text
        },
        text: {
            fontSize: 16,
            color: '#000',  // Black text for "Add to Favourites"
        },
        textRed: {
            fontSize: 16,
            color: '#d9232d',  // Red text for "Block" and "Report"
        },
        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth,
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(15),
            backgroundColor: global.white,

        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 15,
        },
        textInput: {
            width: '100%',
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 20,
        },
        attachmentButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        attachmentText: {
            fontSize: 16,
            marginLeft: 10,
        },
        closeButton: {
            backgroundColor: '#d9232d',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginRight: 10
        },
        closeButtonText: {
            color: 'white',
            fontSize: 16,

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
            overflow: 'hidden',
            marginBottom: ResponsiveSize(10),
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
        },
        modalTopLayerReportSecond: {
            height: windowHeight * 0.35,
            width: windowWidth * 0.8,
            paddingTop: 10,
            backgroundColor: 'white',
            borderRadius: ResponsiveSize(15),
            overflow: 'hidden',
            zIndex: 999,
            flexDirection: 'column',
            alignItems: 'center'
        },
        modalTopLayer2: {
            height: windowHeight * 0.20,
            width: windowWidth * 0.8,
            backgroundColor: 'white',
            borderRadius: ResponsiveSize(15),
            overflow: 'hidden',
            zIndex: 999,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        BlockDone: {
            width: ResponsiveSize(80),
            height: ResponsiveSize(38),
            backgroundColor: global.primaryColor,
            borderRadius: ResponsiveSize(10),
            justifyContent: 'center',
            marginLeft: ResponsiveSize(5),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        NotBlock: {
            width: ResponsiveSize(80),
            height: ResponsiveSize(38),
            backgroundColor: global.primaryColor,
            borderRadius: ResponsiveSize(10),
            justifyContent: 'center',
            marginRight: ResponsiveSize(5),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
    });
    const navigation = useNavigation();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const [documentImage, setDocumentImage] = useState('');
    const [document, setDocument] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [blocked, setBlocked] = useState(false);
    const [storedId, setStoredId] = useState();
    const toast = useToast();



    const fetchUserDetails = async () => {
        try {
            const Token = await AsyncStorage.getItem('Token');
            const response = await fetch(`${baseUrl}/users/user-details-by-user-id/${route?.params?.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'accesstoken': `Bearer ${Token}`,
                },
            });
            const result = await response.json();
            if (result.statusCode === 200) {
                console.log(result.data, "userDetails");
                setUserDetails(result.data);
                if (result.data?.blocked_by_me === "true") {
                    setBlocked(true)
                } else {
                    setBlocked(false)
                }
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };

    const LoadUserId = async () => {
        const userId = await AsyncStorage.getItem('U_id');
        setStoredId(userId);
    }
    useEffect(() => {
        fetchUserDetails();
        closeBottomSheet();
        LoadUserId()
    }, [focus]);
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





    const [reportLoading, setReportLoading] = useState(false)
    const [isReportSecondVisible, setIsReportSecondVisible] = useState(false);
    const [reportPostDescription, setReportPostDescription] = useState("")

    const addReportPost = async () => {
        setReportLoading(true)
        const Token = await AsyncStorage.getItem('Token');
        const response = await fetch(`${baseUrl}/report/report-user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
                parent_id: route.params?.user_id,
                report_reason: reportPostDescription
            })

        });
        const res = await response?.json();
        console.log(res);
        if (res?.statusCode == 200) {
            toast.show("User report submitted successfully.")
            setReportLoading(false)
            setIsReportSecondVisible(false)
        }
        else if (res?.statusCode == 400) {
            toast.show("You have already reported this user.")
            setReportLoading(false)
            setIsReportSecondVisible(false)
        }
        else {
            toast.show("Something went wrong")
            setReportLoading(false)
            setIsReportSecondVisible(false)
        }
    }

    const OpenReportConfirm = () => {
        setIsReportSecondVisible(true)
    }
    const [isBlockModalConfirm, setIsBlockModalConfirm] = useState(false);


    const OpenBlockModal = () => {
        setIsBlockModalConfirm(true)
    }



    const [blockUserLoader, setBlockUserLoader] = useState(false);
    const BlockUser = async () => {
        setBlockUserLoader(true)
        const Token = await AsyncStorage.getItem('Token');
        const response = await fetch(
            `${baseUrl}/block/block-unblock-user`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    accesstoken: `Bearer ${Token}`,
                },
                body: JSON.stringify({ blocked_id: route?.params?.user_id }),
            },
        );
        const result = await response.json();
        if (result.statusCode === 201) {
            if (result.message == "User blocked") {
                setBlocked(true)
            }
            else if (result.message == "User Unblocked") {
                setBlocked(false)
            }
            setBlockUserLoader(false)
            setIsBlockModalConfirm(false)
        }
    }


    console.log(storedId, route?.params?.user_id)
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
                    <Pressable onPress={() => {
                        navigation.getParent()?.setOptions({
                            tabBarStyle: { display: 'none' },
                        });
                        return navigation.goBack()
                    }} style={styles.logoSide1}>
                        <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        {/* <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"New Group"} /> */}
                    </View>
                    <View style={styles.logoSide2}>

                    </View>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.GroupName}>
                        {userDetails?.profile_picture_url !== '' ? (
                            <View >
                                <Image style={styles.ProfileImage} src={userDetails?.profile_picture_url} />
                            </View>
                        ) : (
                            <TouchableOpacity onPress={storedId == route?.params?.user_id ? requestCameraPermission : undefined}>
                                <Image
                                    style={styles.ProfileImage}
                                    source={require('../assets/icons/avatar.png')}
                                />
                            </TouchableOpacity>
                        )}
                        <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={userDetails?.user_name} />
                        {/* <TextInput onChangeText={(e) => setGroupName(e)} placeholder="Group Name Here" style={styles.GroupNameTitle} /> */}
                    </View>
                </View>
                <View style={styles.BoxWrapper1}>
                    {/* Add to Favourites */}
                    {/* Block Ali Medical */}
                    <TouchableOpacity style={styles.actionItem} onPress={OpenBlockModal}>
                        <Icon name="ban" size={20} color="#d9232d" style={styles.icon} />
                        {
                            blocked ? <TextC size={ResponsiveSize(16)} style={{ color: '#d9232d' }} font={'Montserrat-Medium'} text={`Unblock ${userDetails?.user_name}`} /> :
                                <TextC size={ResponsiveSize(16)} style={{ color: '#d9232d' }} font={'Montserrat-Medium'} text={`Block ${userDetails?.user_name}`} />
                        }
                    </TouchableOpacity>

                    {/* Report Ali Medical */}
                    <TouchableOpacity style={styles.actionItem} onPress={OpenReportConfirm}>
                        <Icon name="thumbs-down" size={20} color="#d9232d" style={styles.icon} />
                        <TextC size={ResponsiveSize(16)} style={{ color: '#d9232d' }} font={'Montserrat-Medium'} text={`Report ${userDetails?.user_name}`} />
                    </TouchableOpacity>
                </View>


            </ScrollView>
            <Modal
                isVisible={isReportSecondVisible}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                }}
                animationIn={'bounceInUp'}
                avoidKeyboard={true}
                onBackdropPress={() => setIsReportSecondVisible(false)}
                statusBarTranslucent={false}>
                <View style={styles.modalTopLayerReportSecond}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextC text={"Report"} font={"Montserrat-Bold"} />
                    </View>
                    <View style={{ paddingTop: ResponsiveSize(20) }}>
                        <TextInput onChangeText={(e) => setReportPostDescription(e)} placeholder='Enter some description about post' style={{ fontSize: ResponsiveSize(11), fontFamily: "Montserrat-Medium", borderWidth: ResponsiveSize(1), borderColor: "#EEEEEE", padding: ResponsiveSize(10), width: windowWidth * 0.7, height: ResponsiveSize(100), borderRadius: ResponsiveSize(10) }} />
                    </View>
                    <View style={{ paddingTop: ResponsiveSize(20) }}>
                        <TouchableOpacity disabled={reportLoading} onPress={addReportPost} style={{ backgroundColor: global.primaryColor, padding: ResponsiveSize(10), borderRadius: ResponsiveSize(10), width: windowWidth * 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            {reportLoading ?
                                <ActivityIndicator size={'small'} color={global.white} />
                                :
                                <TextC text={"Submit"} font={"Montserrat-Bold"} size={ResponsiveSize(11)} style={{ color: global.white }} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={isBlockModalConfirm}
                style={{ margin: 0, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                animationIn={'bounceInUp'}
                avoidKeyboard={true}
                onBackdropPress={() => setIsBlockModalConfirm(false)}
                statusBarTranslucent={false}>
                <View style={styles.modalTopLayer2}>
                    <TextC text={'Are you sure'} font={"Montserrat-Bold"} style={{}} />
                    <TextC size={ResponsiveSize(10)} font={"Montserrat-Medium"} text={`are you sure you want to ${blocked ? "Unblock" : "block"} this user?`} style={{ color: global.placeholderColor }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: ResponsiveSize(15) }}>
                        <TouchableOpacity onPress={() => setIsBlockModalConfirm(false)} style={styles.NotBlock}>
                            <TextC text={'No'} font={"Montserrat-Bold"} style={{ color: global.white }} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={blockUserLoader} style={styles.BlockDone} onPress={BlockUser}>
                            {blockUserLoader ?
                                <ActivityIndicator size={ResponsiveSize(15)} color={global.white} />
                                :
                                <TextC text={'Yes'} font={"Montserrat-Bold"} style={{ color: global.white }} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>



    )
}
// function mapStateToProps({ AllConnectionsReducer }) {
//     return { AllConnectionsReducer };
// }
export default UserChatSetting;