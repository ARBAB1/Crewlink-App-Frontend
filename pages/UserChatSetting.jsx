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
import { useNavigation } from "@react-navigation/native";
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

const UserChatSetting = ({route}) => {
     console.log(route.params,"iop")
    const scheme = useColorScheme();
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
            marginRight:10
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
        }
    });
    const navigation = useNavigation();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const [documentImage, setDocumentImage] = useState('');
    const [document, setDocument] = useState('');
    const [groupName, setGroupName] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const allBlockedUsers = async () => {
        try {
            const Token = await AsyncStorage.getItem('Token');
            const page = 1
            const limit = 100
            const response = await fetch(`${baseUrl}/block/get-all-blocked-users/${page}/${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'accesstoken': `Bearer ${Token}`,
                },
            });
            const result = await response.json();

            console.log(result, "allBlockedUsers");
            if (result.statusCode === 200) {
                setBlocked(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch blocked users:", error);
        }
    }
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
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };
    const BlockUser = async () => {
        try {
            const Token = await AsyncStorage.getItem('Token');
            const response = await fetch(`${baseUrl}/block/block-unblock-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'accesstoken': `Bearer ${Token}`,
                },
                body: JSON.stringify({ blocked_id: route?.params?.user_id }),
            });
            const result = await response.json();
            console.log(result, "BlockUser");
            if (result.statusCode === 201) {
      setBlocked(!blocked)
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };
    useEffect(() => {
        
            fetchUserDetails();
            closeBottomSheet();
            allBlockedUsers();
        
    }, []);
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
                            tabBarStyle: {display: 'none'},
                          });
                        return navigation.goBack()
                        }} style={styles.logoSide1}>
                        <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        {/* <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"New Group"} /> */}
                    </View>
                 <View  style={styles.logoSide2}>
                    
                 </View>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.GroupName}>
                        {userDetails?.profile_picture_url !== '' ? (
                            <View >
                                <Image style={styles.ProfileImage} src={userDetails?.profile_picture_url} />
                            </View>
                        ) : (
                            <TouchableOpacity onPress={requestCameraPermission}>
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
      <TouchableOpacity style={styles.actionItem} onPress={() => BlockUser()}>
        <Icon name="ban" size={20} color="#d9232d" style={styles.icon} />
        {
            blocked ? <TextC size={ResponsiveSize(16)} style={{color: '#d9232d'}} font={'Montserrat-Medium'} text={`Unblock ${userDetails?.user_name}`} /> :
            <TextC size={ResponsiveSize(16)} style={{color: '#d9232d'}} font={'Montserrat-Medium'} text={`Block ${userDetails?.user_name}`} />
        }
      </TouchableOpacity>

      {/* Report Ali Medical */}
      <TouchableOpacity style={styles.actionItem} onPress={() => setIsVisible(!isVisible)}>
        <Icon name="thumbs-down" size={20} color="#d9232d" style={styles.icon} />
        <TextC size={ResponsiveSize(16)} style={{color: '#d9232d'}} font={'Montserrat-Medium'} text={`Report ${userDetails?.user_name}`} />
      </TouchableOpacity>
    </View>
            </ScrollView>
            <Modal isVisible={isVisible}>
            <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Report User</Text>
          <TouchableOpacity style={styles.attachmentButton} onPress={() => requestCameraPermission()}>
            <Icon name="paperclip" size={20} color="#000" />
            <Text style={styles.attachmentText}>Attach File</Text>
          </TouchableOpacity>
          {/* Text Input Field */}
          <TextInput
            placeholder="Enter your message..."
            style={styles.textInput}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />

          {/* Attachment Button */}
       
<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
<TouchableOpacity onPress={()=> setIsVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setIsVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Report User</Text>
          </TouchableOpacity>
</View>
          {/* Close Button */}
      
        </View>
      </Modal>
        </SafeAreaView>
    )
}
// function mapStateToProps({ AllConnectionsReducer }) {
//     return { AllConnectionsReducer };
// }
export default UserChatSetting;