import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import Modal from 'react-native-modal';
import {global, ResponsiveSize} from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from '../components/text/text';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeAgo from '@manu_omg/react-native-timeago';
import {baseUrl, apiKey} from '../store/config.json';
import * as AllConnectionsAction from '../store/actions/Connections/index';
import {connect} from 'react-redux';
import {useBottomSheet} from '../components/bottomSheet/BottomSheet';
import ButtonC from '../components/button';
import {PERMISSIONS, request} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {set} from 'react-hook-form';
import * as UserProfile from '../store/actions/UserProfile/index';

const GroupChatSetting = ({route, GetUserProfileReducer, GetProfileData}) => {
  console.log(route.params, 'iop');
  const group_id = route?.params?.group_id;
  const scheme = useColorScheme();
  const windowWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    BoxWrapper1: {
      padding: 20,
      backgroundColor: '#fff', // White background for the box
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15, // Space between each action item
    },
    icon: {
      marginRight: 15, // Space between the icon and the text
    },
    text: {
      fontSize: 16,
      color: '#000', // Black text for "Add to Favourites"
    },
    textRed: {
      fontSize: 16,
      color: '#d9232d', // Red text for "Block" and "Report"
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
      justifyContent: 'center',
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
      overflow: 'hidden',
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
    profileContainer: {
      marginRight: 10,
      borderWidth: 1,
      borderRadius: 20, // Makes the image circular
    },
    profileIcon: {
      width: 40, // Adjust for size similar to WhatsApp profile icons
      height: 40,
      borderRadius: 20, // Makes the image circular
    },
    detailsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    roleText: {
      fontSize: 12,
      color: 'green', // Admin status in green like in WhatsApp
    },
    userNameText: {
      fontSize: 16,
      color: '#000', // Username in black
    },
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      display: 'flex',
      width: windowWidth,

      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    BoxWrapper: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    icon: {
      marginRight: 15,
    },
    actionText: {
      fontSize: 16,
      color: '#000',
    },
    actionTextRed: {
      fontSize: 16,
      color: '#d9232d',
    },
  });
  const navigation = useNavigation();
  const {openBottomSheet, closeBottomSheet} = useBottomSheet();
  const [documentImage, setDocumentImage] = useState('');
  const [GroupMember, setGroupMember] = useState([]);
  const [GroupDetail, setGroupDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [EditVisible, setEditVisible] = useState(false);
  const [GroupName, setGroupName] = useState('');
  const [selectedMember, setSelectedMember] = useState(null); // Store selected member
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const handleUpdateGroupName = async () => {
    console.log(GroupName, 'GroupName');
    setEditVisible(!EditVisible);
    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket
      .on('connect')
      .emit('updateGroup', {
        groupId: group_id,
        groupName: GroupName,
      })
      .emit('getGroupMemberDetails', {
        group_id: group_id,
      })
      .on('getGroupMemberDetails', data => {
        console.log(data, 'data');
        setGroupDetail(data?.groupDetails);
        setGroupMember(data?.groupMembers);
      });
  };
  const handleUpdateGroup = async imageUri => {
    console.log(imageUri, 'imageUri');
    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket
      .on('connect')
      .emit('updateGroup', {
        groupId: group_id,
        groupName: GroupName || GroupDetail.group_name,
        fileUrl: imageUri,
      })
      .emit('getGroupMemberDetails', {
        group_id: group_id,
      })
      .on('getGroupMemberDetails', data => {
        console.log(data, 'data');
        setGroupDetail(data?.groupDetails);
        setGroupMember(data?.groupMembers);
      });
  };
  const handleMakeGroupAdmin = async groupMemberId => {
    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket
      .on('connect')
      .emit('makeGroupAdmin', {
        groupId: group_id,
        groupMemberId: groupMemberId,
      })
      .emit('getGroupMemberDetails', {
        group_id: group_id,
      })
      .on('getGroupMemberDetails', data => {
        console.log(data, 'data');
        setGroupDetail(data?.groupDetails);
        setGroupMember(data?.groupMembers);
      });
    closeModal();
  };
  const handleRemoveGroupAdmin = async groupMemberId => {
    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket
      .on('connect')
      .emit('removeGroupAdmin', {
        groupId: group_id,
        groupMemberId: groupMemberId,
      })
      .emit('getGroupMemberDetails', {
        group_id: group_id,
      })
      .on('getGroupMemberDetails', data => {
        console.log(data, 'data');
        setGroupDetail(data?.groupDetails);
        setGroupMember(data?.groupMembers);
        closeModal();
      });
  };
  const handleRemoveUserInGroup = async groupMemberId => {
    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket
      .on('connect')
      .emit('removeUserInGroup', {
        groupId: group_id,
        groupMemberId: groupMemberId,
      })
      .emit('getGroupMemberDetails', {
        group_id: group_id,
      })
      .on('getGroupMemberDetails', data => {
        console.log(data, 'data');
        setGroupDetail(data?.groupDetails);
        setGroupMember(data?.groupMembers);
        closeModal();
      });
  };
  const handleMemberClick = member => {
    setSelectedMember(member);
    setIsModalVisible(true); // Show modal
  };
  const closeModal = () => {
    setSelectedMember(null);
    setIsModalVisible(false); // Hide modal
  };
  const GroupDetails = async group_id => {
    console.log(group_id, 'grouid');

    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });

    socket
      .on('connect')
      .emit('getGroupMemberDetails', {
        group_id: group_id,
      })
      .on('getGroupMemberDetails', data => {
        console.log(data, 'data');
        setGroupDetail(data?.groupDetails);
        setGroupMember(data?.groupMembers);
      });
  };
  console.log(GetUserProfileReducer?.data, 'GetUserProfileReducer');
  useEffect(() => {
    const group_id = route?.params?.group_id;

    closeBottomSheet();
    GroupDetails(group_id);
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
            BtnStyle={{width: windowWidth * 0.45}}
            TextStyle={{color: global.white}}
            bgColor={global.primaryColor}
            style={styles.openCamera}
            title={'Open camera'}></ButtonC>
          <ButtonC
            onPress={openPhotoLibrary}
            BtnStyle={{width: windowWidth * 0.45}}
            TextStyle={{color: global.white}}
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
      const granted =
        Platform.OS === 'android'
          ? await request(PERMISSIONS.ANDROID.CAMERA)
          : await request(PERMISSIONS.IOS.CAMERA);
      const result = await launchImageLibrary();
      if (result?.assets?.length > 0) {
        const imageUri = result.assets[0].uri;
        setDocumentImage(imageUri);
        handleUpdateGroup(imageUri);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const openPhotoLibrary = async () => {
    const result = await launchImageLibrary();
    if (result?.assets.length > 0) {
      setDocument(result.assets);
      setDocumentImage(result?.assets[0]?.uri);
      handleUpdateGroup(result?.assets[0]?.uri);
    }
  };
  const openMobileCamera = async () => {
    const result = await launchCamera();
    if (result?.assets.length > 0) {
      setDocument(result.assets);
      setDocumentImage(result?.assets[0]?.uri);
      handleUpdateGroup(result?.assets[0]?.uri);
    }
  };
  let filterAdmin
 filterAdmin =  GroupMember && ( GroupMember?.filter(x => {
    console.log(x.user_id)
   return x.user_id === GetUserProfileReducer.data.user_id;
  }))
  console.log(filterAdmin, 'filterAdmin');

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        backgroundColor={
          scheme === 'dark' ? DarkTheme.colors.background : 'white'
        }
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: global.white}}>
        <StatusBar backgroundColor={global.white} />
        <View style={styles.wrapper}>
          <Pressable
            onPress={() => {
              navigation.getParent()?.setOptions({
                tabBarStyle: {display: 'none'},
              });
              navigation.goBack();
            }}
            style={styles.logoSide1}>
            <AntDesign
              name="left"
              color={global.primaryColor}
              size={ResponsiveSize(22)}
            />
          </Pressable>
          <View style={styles.logoSide2}>
            {/* <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"New Group"} /> */}
          </View>
          <View style={styles.logoSide3}></View>
        </View>
        <View style={styles.bodyWrapper}>
          <View style={styles.GroupName}>
            {GroupDetail.group_image !== '' ? (
              <TouchableOpacity onPress={requestCameraPermission}>
                <Image
                  style={styles.ProfileImage}
                  src={GroupDetail.group_image}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={requestCameraPermission}>
                <Image
                  style={styles.ProfileImage}
                  source={require('../assets/icons/avatar.png')}
                />
              </TouchableOpacity>
            )}
            {!EditVisible ? (
              <TextC
                ellipsizeMode="tail"
                numberOfLines={1}
                text={GroupDetail.group_name}
                // text={member?.isAdmin ? "Group Admin" : "Member"}

                font={'Montserrat-Bold'}
                size={ResponsiveSize(18)}
              />
            ) : (
              <TextInput
                onChangeText={e => setGroupName(e)}
                placeholder="Group Name Here"
                style={styles.GroupNameTitle}
              />
            )}

            {/* <TextC size={ResponsiveSize(18)}  font={'Montserrat-SemiBold'} text={GroupDetail.group_name} /> */}
            {!EditVisible ? (
              <TouchableOpacity onPress={() => setEditVisible(!EditVisible)}>
                <TextC
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.roleText}
                  text={'Change Group Name'}
                  // text={member?.isAdmin ? "Group Admin" : "Member"}

                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(10)}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleUpdateGroupName()}>
                <TextC
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.roleText}
                  text={'Confirm'}
                  // text={member?.isAdmin ? "Group Admin" : "Member"}

                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(10)}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.Participants}>
          <View
            style={{
              paddingHorizontal: ResponsiveSize(15),
              paddingBottom: ResponsiveSize(0),
            }}>
            <TextC
              size={ResponsiveSize(16)}
              font={'Montserrat-SemiBold'}
              text={'Participants'}
            />
          </View>
          <View style={styles.BoxWrapper}>
            <View style={styles.box}>
              <View style={styles.profileContainer}>
                <Image
                  source={require('../assets/icons/user2.png')}
                  style={styles.profileIcon}
                  resizeMode="cover"
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('GroupChatMember')}
                style={styles.detailsContainer}>
                {/* Role (Admin/Member) */}
                <TextC
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.roleText}
                  text={'Add Participants'}
                  // text={member?.isAdmin ? "Group Admin" : "Member"}

                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(10)}
                />

                {/* Username */}
              </TouchableOpacity>
            </View>
            {GroupMember !== undefined &&
            GroupMember !== '' &&
            GroupMember !== null &&
            GroupMember.length > 0 ? (
              GroupMember?.map((member, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.box}
                    onPress={() => handleMemberClick(member)}>
                    <View style={styles.profileContainer}>
                      <Image
                        source={
                          member?.profile_picture_url === ''
                            ? require('../assets/icons/avatar.png')
                            : {uri: member?.profile_picture_url}
                        }
                        style={styles.profileIcon}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.detailsContainer}>
                      {/* Role (Admin/Member) */}
                      <TextC
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.roleText}
                        text={member?.isAdmin ? 'Group Admin' : 'Member'}
                        font={'Montserrat-Bold'}
                        size={ResponsiveSize(10)}
                      />

                      {/* Username */}
                      <TextC
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.userNameText}
                        text={member?.user_name}
                        font={'Montserrat-Bold'}
                        size={ResponsiveSize(14)}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: ResponsiveSize(50),
                }}>
                <TextC
                  text={'No Connections found'}
                  font={'Montserrat-Medium'}
                  size={ResponsiveSize(11)}
                />
              </View>
            )}
          </View>
          <View style={styles.BoxWrapper1}>
            {/* Add to Favourites */}

            {/* Block Ali Medical */}
            <TouchableOpacity style={styles.actionItem}>
              <Icon name="ban" size={20} color="#d9232d" style={styles.icon} />
              <TextC
                size={ResponsiveSize(16)}
                style={{color: '#d9232d'}}
                font={'Montserrat-Medium'}
                text={`Exit ${GroupDetail?.group_name}`}
              />
            </TouchableOpacity>

            {/* Report Ali Medical */}
            <TouchableOpacity style={styles.actionItem}>
              <Icon
                name="thumbs-down"
                size={20}
                color="#d9232d"
                style={styles.icon}
              />
              <TextC
                size={ResponsiveSize(16)}
                style={{color: '#d9232d'}}
                font={'Montserrat-Medium'}
                text={`Report ${GroupDetail?.group_name}`}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Modal for Member Options */}
      {console.log(selectedMember, 'selectedMember')}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>
              {selectedMember?.user_name}
            </Text>


            {selectedMember?.isAdmin && filterAdmin[0]?.isAdmin===true &&

            selectedMember?.user_id === GetUserProfileReducer.data.user_id ? (
              //mai admin hn or meri userid bhi same hai or mainai khud par tap kia hai
              //me = admin tap= admin
              <>
              
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleRemoveGroupAdmin(selectedMember?.group_member_id)
                  }>
                  <Icon name="user" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>Remove From Group Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleRemoveUserInGroup(selectedMember?.group_member_id)
                  }>
                  <Icon name="shield" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Exit From Group
                  </Text>
                </TouchableOpacity>
               
              </>
            ) : filterAdmin[0]?.isAdmin===true &&
              selectedMember?.isAdmin &&
              GetUserProfileReducer.data.user_id !== selectedMember?.user_id ? (
              // selected member admin hai lekin mainai dusray admin par tap kia hai
              //me = admin tap= admin but other
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    navigation.navigate('Message', {
                      receiverUserId: selectedMember?.user_id,
                    })
                  }>
                  <Icon name="wechat" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Message {selectedMember?.user_name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleRemoveUserInGroup(selectedMember?.group_member_id)
                  }>
                  <Icon name="shield" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Remove {selectedMember?.user_name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleRemoveGroupAdmin(selectedMember?.group_member_id)
                  }>
                  <Icon name="user" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>Remove From Admin</Text>
                </TouchableOpacity>
              </>
            ) : selectedMember?.isAdmin === false &&
              selectedMember?.user_id !== GetUserProfileReducer.data.user_id &&
              filterAdmin[0]?.isAdmin===true ? (
              //jo tap kia hai wo admin bhi nai hai lekin mai admin hn
              //me = admin tap = user(not admin)
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    navigation.navigate('Message', {
                      receiverUserId: selectedMember?.user_id,
                    })
                  }>
                  <Icon name="wechat" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Message {selectedMember?.user_name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleMakeGroupAdmin(selectedMember?.group_member_id)
                  }>
                  <Icon name="user" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>Make Group Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleRemoveUserInGroup(selectedMember?.group_member_id)
                  }>
                  <Icon name="shield" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Remove {selectedMember?.user_name}
                  </Text>
                </TouchableOpacity>
              </>
            ) : 
            selectedMember?.isAdmin == true &&
              selectedMember?.user_id !== GetUserProfileReducer.data.user_id &&
              filterAdmin[0]?.isAdmin===false ? (

                //me = not admin tap = admin
              //jo tap kia hai wo admin bhi nai hai lekin mai admin hn
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    navigation.navigate('Message', {
                      receiverUserId: selectedMember?.user_id,
                    })
                  }>
                  <Icon name="wechat" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Message {selectedMember?.user_name}
                  </Text>
                </TouchableOpacity>
              </>
            ) : selectedMember?.isAdmin === false &&
              selectedMember?.user_id !== GetUserProfileReducer.data.user_id &&
              filterAdmin[0]?.isAdmin===false ? (
              //jo tap kia hai wo admin bhi nai hai lekin mai admin hn

              // me = not admin tap = user(not admin)
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    navigation.navigate('Message', {
                      receiverUserId: selectedMember?.user_id,
                    })
                  }>
                  <Icon name="wechat" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Message {selectedMember?.user_name}
                  </Text>
                </TouchableOpacity>
              </>
            ) :selectedMember?.isAdmin === false &&
            selectedMember?.user_id === GetUserProfileReducer.data.user_id &&
            filterAdmin[0]?.isAdmin===false ? (<>
              <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() =>
                    handleRemoveUserInGroup(selectedMember?.group_member_id)
                  }>
                  <Icon name="shield" size={20} style={styles.icon} />
                  <Text style={styles.actionText}>
                    Exit From Group
                  </Text>
                </TouchableOpacity>
            </>):<></>}

            <TouchableOpacity style={styles.actionItem} onPress={closeModal}>
              <Icon name="close" size={20} style={styles.icon} />
              <Text style={styles.actionTextRed}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
// function mapStateToProps({ AllConnectionsReducer }) {
//     return { AllConnectionsReducer };
// }
function mapStateToProps({GetUserProfileReducer}) {
  return {GetUserProfileReducer};
}
export default connect(mapStateToProps, UserProfile)(GroupChatSetting);
// export default GroupChatSetting;
