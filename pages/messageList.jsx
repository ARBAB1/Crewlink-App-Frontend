import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  View,
} from 'react-native';
import { global, ResponsiveSize } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import TextC from '../components/text/text';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeAgo from '@manu_omg/react-native-timeago';
import { baseUrl, apiKey } from '../store/config.json';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as UserProfile from '../store/actions/UserProfile/index';



const MessageList = ({ GetProfileData }) => {
  const focus = useIsFocused();
  console.log(focus,"focusfocusfocusfocusfocus")
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
      paddingVertical: ResponsiveSize(8),
      paddingHorizontal: ResponsiveSize(15),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    PostHeaderSelected: {
      flexDirection: 'row',
      paddingVertical: ResponsiveSize(8),
      paddingHorizontal: ResponsiveSize(15),
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: global.messageRgba
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
    SearchInputWrapper: {
      position: "relative",
    },
    PostProfileImageBox: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
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
  });
  const navigation = useNavigation();
  const [recentChats, setRecentChats] = useState([]);
  const [filterText, setFilterText] = useState('');

  const [loader, setLoader] = useState(false);

  const loadRecentChats = async () => {
    if (focus == true) {
      const Token = await AsyncStorage.getItem('Token');
      const socket = io(`${baseUrl}/chat`, {
        transports: ['websocket'],
        extraHeaders: {
          'x-api-key': 'TwillioAPI',
          accesstoken: `Bearer ${Token}`,
        },
      });
      socket.on('connect').on('chatList', data => {
        setLoader(false);
        setRecentChats(data);
      });
    }
  };

  useEffect(() => {
    GetProfileData();
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'flex',
        backgroundColor: '#69BE25',
        borderTopLeftRadius: ResponsiveSize(20),
        borderTopRightRadius: ResponsiveSize(20),
      },
    });

  }, []);
  // useEffect(() => {
  //   loadRecentChats();
  // }, [focus]);

  useEffect(() => {
    setLoader(true);
    loadRecentChats();
  }, [focus]);


  const [isSelectedUser, SetisSelectedUser] = useState()
  const [isSelected, SetisSelected] = useState(false)



  const SelectUser = async (e) => {
    SetisSelectedUser((prev) => {
      if (prev === e) {
        SetisSelected(false)
        return null;
      } else {
        SetisSelected(true)
        return e;
      }
    });
  }


  const [deleteChatUser, setDeleteChatUser] = useState(false)

  const deleteUserChat = async () => {
    setDeleteChatUser(true)
    const Token = await AsyncStorage.getItem('Token');
    const response = await fetch(`${baseUrl}/messages/clear-user-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'accesstoken': `Bearer ${Token}`,
      },
      body: JSON.stringify({
        chat_with_user_id: isSelectedUser,
      }),
    });
    const result = await response.json();
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket.on('connect').on('chatList', data => {
      setRecentChats(data);
      setDeleteChatUser(false)
    });
  }


  const renderItem = useCallback(({ item }) => {
    return item.type == 'direct' ? (
      <TouchableOpacity
        onPress={() => {
          if (!isSelected) {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' },
            });
            return navigation.navigate('Message', {
              receiverUserId: item?.userDetails?.user_id,
            })
          }
          else {
            SelectUser(item?.userDetails?.user_id)
          }
        }}
        onLongPress={() => SelectUser(item?.userDetails?.user_id)}
        style={isSelected == true && isSelectedUser == item?.userDetails?.user_id ? styles.PostHeaderSelected : styles.PostHeader}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ position: 'relative' }}>
            <ImageBackground
              source={
                item?.userDetails?.profile_picture_url == ''
                  ? require('../assets/icons/avatar.png')
                  : {
                    uri: item?.userDetails
                      ?.profile_picture_url,
                  }
              }
              style={styles.PostProfileImage}
              resizeMode="cover">
            </ImageBackground>
            {item?.userOnlineStatus?.isOnline == "Y" &&
              <View style={{
                height: ResponsiveSize(12),
                width: ResponsiveSize(12),
                borderRadius: ResponsiveSize(100),
                backgroundColor: global.secondaryColor,
                position: 'absolute',
                top: ResponsiveSize(-2),
                left: ResponsiveSize(2),
                borderWidth: ResponsiveSize(2),
                borderColor: global.white
              }}></View>
            }
          </View>
          <View style={styles.PostProfileImageBox}>
            <TextC
              size={ResponsiveSize(12)}
              text={item?.userDetails?.user_name}
              font={'Montserrat-Bold'}
            />
            {item?.isLastMessageMedia ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="image-outline"
                  size={ResponsiveSize(12)}
                  style={{ marginRight: ResponsiveSize(2) }}
                />
                <TextC
                  size={ResponsiveSize(10)}
                  text={'Media'}
                  font={'Montserrat-Medium'}
                  style={{
                    color: global.placeholderColor,
                    width: ResponsiveSize(140),
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
                />
              </View>
            ) : item?.is_location == "Y" ?
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="location-outline"
                  size={ResponsiveSize(12)}
                  style={{ marginRight: ResponsiveSize(2) }}
                />
                <TextC
                  size={ResponsiveSize(10)}
                  text={'Location'}
                  font={'Montserrat-Medium'}
                  style={{
                    color: global.placeholderColor,
                    width: ResponsiveSize(140),
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
                />
              </View>
              : (
                <TextC
                  size={ResponsiveSize(10)}
                  text={item?.message}
                  font={'Montserrat-Medium'}
                  style={{
                    color: global.placeholderColor,
                    width: ResponsiveSize(140),
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
                />
              )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isSelected == true && isSelectedUser == item?.userDetails?.user_id ?
            <TouchableOpacity onPress={deleteUserChat}>
              {deleteChatUser ?
                <ActivityIndicator color={global.primaryColor} size={ResponsiveSize(18)} />
                :
                <AntDesign name='delete' color={global.primaryColor} size={ResponsiveSize(18)} />
              }
            </TouchableOpacity>
            :
            <>
              <TimeAgo
                style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: ResponsiveSize(8),
                }}
                time={item?.created_at}
              />
              {item?.unreadMessagesCount > 0 && (
                <View
                  style={{
                    backgroundColor: global.secondaryColor,
                    height: ResponsiveSize(15),
                    width: ResponsiveSize(15),
                    borderRadius: ResponsiveSize(15),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: ResponsiveSize(5),
                  }}>
                  <TextC
                    font={'Montserrat-Medium'}
                    size={ResponsiveSize(8)}
                    text={item?.unreadMessagesCount}
                    style={{ color: global.white }}
                  />
                </View>
              )}
            </>
          }
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          if (!isSelected) {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' },
            });
            return navigation.navigate('GroupMessage', {
              group_id: item?.group?.group_id,
            })
          }
        }
        }
        style={styles.PostHeader}>
        <View style={{ flexDirection: 'row' }}>
          <ImageBackground
            source={
              item?.group?.profile_picture_url == ''
                ? require('../assets/icons/avatar.png')
                : { uri: item?.group?.group_image }
            }
            style={styles.PostProfileImage}
            resizeMode="cover"></ImageBackground>
          <View style={styles.PostProfileImageBox}>
            <TextC
              size={ResponsiveSize(12)}
              text={item?.group?.group_name}
              font={'Montserrat-Bold'}
            />
            {item?.group?.isLastMessageMedia ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="image-outline"
                  size={ResponsiveSize(12)}
                  style={{ marginRight: ResponsiveSize(2) }}
                />
                <TextC
                  size={ResponsiveSize(10)}
                  text={'Media'}
                  font={'Montserrat-Medium'}
                  style={{
                    color: global.placeholderColor,
                    width: ResponsiveSize(140),
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
                />
              </View>
            ) : (
              <TextC
                size={ResponsiveSize(10)}
                text={item?.group?.lastMessage}
                font={'Montserrat-Medium'}
                style={{
                  color: global.placeholderColor,
                  width: ResponsiveSize(140),
                }}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              />
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TimeAgo
            style={{
              fontFamily: 'Montserrat-Medium',
              fontSize: ResponsiveSize(8),
            }}
            time={item?.group?.created_at}
          />
          {item?.group?.unreadMessagesCount > 0 && (
            <View
              style={{
                backgroundColor: global.secondaryColor,
                height: ResponsiveSize(15),
                width: ResponsiveSize(15),
                borderRadius: ResponsiveSize(15),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: ResponsiveSize(5),
              }}>
              <TextC
                font={'Montserrat-Medium'}
                size={ResponsiveSize(8)}
                text={item?.unreadMessagesCount}
                style={{ color: global.white }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [filterText, isSelectedUser, deleteChatUser]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
      <StatusBar
        backgroundColor={scheme === 'dark' ? '#000' : 'white'}
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <StatusBar backgroundColor={global.white} />
      <View style={styles.wrapper}>
        <Pressable
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.logoSide1}>
          <AntDesign
            name="left"
            color={global.primaryColor}
            size={ResponsiveSize(22)}
          />
        </Pressable>
        <View style={styles.logoSide2}>
          <TextC
            size={ResponsiveSize(16)}
            font={'Montserrat-Bold'}
            text={'Message'}
          />
        </View>
        <View style={styles.logoSide3}>
          <TouchableOpacity
            onPress={() => navigation.navigate('newGroup')}
            style={{ marginRight: ResponsiveSize(6) }}>
            <Feather
              name="users"
              color={global.primaryColor}
              size={ResponsiveSize(20)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewMessage')}>
            <Entypo
              name="plus"
              color={global.primaryColor}
              size={ResponsiveSize(22)}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.SearchInputWrapper}>
          <AntDesign style={styles.SearchIcon} name='search1' color={global.primaryColor} size={ResponsiveSize(20)} />
          <TextInput onChangeText={(e) => setFilterText(e)} style={styles.SearchInput} placeholder="Search" />
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
          {recentChats !== undefined &&
            recentChats !== '' &&
            recentChats !== null && recentChats.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              data={recentChats.filter(item =>
              (item?.userDetails?.user_name?.toLowerCase().includes(filterText.toLowerCase()) ||
                item?.group?.group_name?.toLowerCase().includes(filterText.toLowerCase()))
              )}
              keyExtractor={(items, index) => index?.toString()}
              maxToRenderPerBatch={10}
              windowSize={10}
              renderItem={renderItem}
              extraData={isSelectedUser}
            />
            : (
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
                  text={'No chats found'}
                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(13)}
                />
                <TextC
                  text={'It seems there are no chats available at the moment.'}
                  font={'Montserrat-Medium'}
                  size={ResponsiveSize(11)}
                  style={{ marginTop: ResponsiveSize(2), color: global.placeholderColor, textAlign: 'center' }}
                />
                <TouchableOpacity onPress={() => navigation.navigate('NewMessage')} style={{ backgroundColor: global.secondaryColor, paddingVertical: ResponsiveSize(6), paddingHorizontal: ResponsiveSize(15), marginTop: ResponsiveSize(10), borderRadius: ResponsiveSize(50) }}>
                  <TextC
                    text={'start conversation'}
                    font={'Montserrat-Medium'}
                    size={ResponsiveSize(11)}
                    style={{ color: global.primaryColor }}
                  />
                </TouchableOpacity>
              </View>
            )}
        </>
      }
    </SafeAreaView>
  );
};
function mapStateToProps({ GetUserProfileReducer }) {
  return { GetUserProfileReducer };
}
export default connect(mapStateToProps, UserProfile)(MessageList);
