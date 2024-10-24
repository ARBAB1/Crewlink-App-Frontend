import {
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Easing,
  Animated,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useHeaderHeight} from '@react-navigation/elements';
import {DarkTheme, useNavigation, useIsFocused} from '@react-navigation/native';
import {global, ResponsiveSize} from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FastImage from 'react-native-fast-image';
import TextC from '../components/text/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import {FlashList} from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import * as UserProfile from '../store/actions/UserProfile/index';
import {connect} from 'react-redux';
import {useBottomSheet} from '../components/bottomSheet/BottomSheet';
import ButtonC from '../components/button';
import Modal from 'react-native-modal';
import {baseUrl, apiKey} from '../store/config.json';
import SoundPlayer from 'react-native-sound-player'



const SkeletonPlaceholder = ({style, refreshing}) => {
  const translateX = new Animated.Value(-350);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const styles = StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: '#F5F5F5',
      padding: ResponsiveSize(15),
      borderRadius: ResponsiveSize(0),
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
    },
    ProfileWrapper: {
      width: windowWidth * 0.25 - ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    textWrapper: {
      width: windowWidth * 0.75 - ResponsiveSize(15),
      paddingLeft: ResponsiveSize(0),
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    imageWrapper: {
      width: windowWidth * 0.75 - ResponsiveSize(15),
      height: ResponsiveSize(100),
      borderRadius: ResponsiveSize(25),
      overflow: 'hidden',
      marginTop: ResponsiveSize(20),
    },
    profileImageSkelton: {
      width: ResponsiveSize(50),
      height: ResponsiveSize(50),
      borderRadius: ResponsiveSize(50),
      overflow: 'hidden',
    },
    titleStripe: {
      width: ResponsiveSize(80),
      height: ResponsiveSize(10),
      borderRadius: ResponsiveSize(5),
      overflow: 'hidden',
    },
    descriptionStripe: {
      width: ResponsiveSize(80),
      height: ResponsiveSize(20),
      borderRadius: ResponsiveSize(5),
      marginTop: ResponsiveSize(12),
      overflow: 'hidden',
    },

    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    linearGradient: {
      flex: 1,
      width: ResponsiveSize(350),
    },
    linearGradientLine: {
      flex: 1,
      width: ResponsiveSize(350),
    },
  });
  Animated.loop(
    Animated.timing(translateX, {
      toValue: 350,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
  ).start();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.ProfileWrapper}>
        <View style={styles.profileImageSkelton}>
          <Animated.View style={[styles.gradient, {transform: [{translateX}]}]}>
            <LinearGradient
              colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradientLine}
            />
          </Animated.View>
        </View>
      </View>
      <View style={styles.textWrapper}>
        <View style={styles.descriptionStripe}>
          <Animated.View style={[styles.gradient, {transform: [{translateX}]}]}>
            <LinearGradient
              colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradientLine}
            />
          </Animated.View>
        </View>
        <View style={styles.imageWrapper}>
          <Animated.View style={[styles.gradient, {transform: [{translateX}]}]}>
            <LinearGradient
              colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradient}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const Announcement = ({GetUserProfileReducer}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [announcement, setAnnouncement] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState();
  const [caption, setCaption] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const focus = useIsFocused();
  const headerHeight = useHeaderHeight();

  const styles = StyleSheet.create({
    ContainerHeader: {
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: global.white,
      borderBottomColor: '#eeeeee',
      borderBottomWidth: ResponsiveSize(1),
    },
    HeaderLeft: {
      width: windowWidth * 0.8 - ResponsiveSize(15),
    },
    HeaderRight: {
      width: windowWidth * 0.2 - ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    SearchHeader: {
      backgroundColor: '#EEEEEE',
      paddingHorizontal: ResponsiveSize(15),
      height: ResponsiveSize(40),
      borderRadius: ResponsiveSize(50),
      fontFamily: 'Montserrat-Medium',
      fontSize: ResponsiveSize(11),
    },
    container: {
      paddingVertical: ResponsiveSize(10),
      position: 'relative',
    },
    SinglePost: {
      paddingHorizontal: ResponsiveSize(15),
      paddingBottom: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderBottomColor: '#EEEEEE',
      borderBottomWidth: ResponsiveSize(1),
    },
    ProfileSide: {
      width: windowWidth * 0.22 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    TextSide: {
      width: windowWidth * 0.78 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
    },
    PostProfileImage2: {
      height: ResponsiveSize(45),
      width: ResponsiveSize(45),
      borderRadius: ResponsiveSize(40),
      backgroundColor: global.description,
      overflow: 'hidden',
    },
    
    AnnouncementMedia: {
      height: ResponsiveSize(150),
      width: windowWidth * 0.78 - ResponsiveSize(15),
      borderRadius: ResponsiveSize(10),
      backgroundColor: global.description,
      overflow: 'hidden',
      marginTop:ResponsiveSize(10)
    },
    ProfileDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: ResponsiveSize(3),
    },
    PostSetting: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: ResponsiveSize(8),
    },
    Comment: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: ResponsiveSize(15),
    },
    ShareBtn: {
      backgroundColor: global.primaryColor,
      height: ResponsiveSize(40),
      width: ResponsiveSize(40),
      borderRadius: ResponsiveSize(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTopLayer: {
      height: windowHeight * 0.3,
      width: windowWidth * 0.7,
      paddingTop: 10,
      backgroundColor: 'white',
      bottom: ResponsiveSize(0),
      borderRadius: ResponsiveSize(15),
      overflow: 'hidden',
      zIndex: 999,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },

    modalTopLayer2: {
      height: windowHeight * 0.25,
      width: windowWidth * 0.7,
      paddingTop: 10,
      backgroundColor: 'white',
      bottom: ResponsiveSize(0),
      borderRadius: ResponsiveSize(15),
      overflow: 'hidden',
      zIndex: 999,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    CancelBtnModal: {
      width: windowWidth * 0.6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(10),
      marginTop: ResponsiveSize(20),
      borderWidth: ResponsiveSize(1),
      borderColor: global.description,
      borderRadius: ResponsiveSize(50),
    },
    DeleteBtnModal: {
      width: windowWidth * 0.6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(10),
      marginTop: ResponsiveSize(10),
      borderWidth: ResponsiveSize(1),
      borderColor: global.description,
      borderRadius: ResponsiveSize(50),
      backgroundColor: global.red,
    },
  });

  useEffect(() => {
    const initializeData = async () => {
      const Token = await AsyncStorage.getItem('Token');
      const Picture = await AsyncStorage.getItem('Picture');
      const Name = await AsyncStorage.getItem('Name');
      setProfilePicture(Picture);
      setUserName(Name);
      const socket = io(`${baseUrl}/chat`, {
        transports: ['websocket'],
        extraHeaders: {
          'x-api-key': 'TwillioAPI',
          accesstoken: `Bearer ${Token}`,
        },
      });
      socket.on('announcement', data => {
        setAnnouncement(data);
        setRefreshing(false);
      });
      return () => {
        socket.disconnect();
      };
    };
    if (focus) {
      setRefreshing(true);
      initializeData();
    }
  }, [focus]);





  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const handleLike = async (Like_id, isLiked) => {
    if (GetUserProfileReducer?.data?.isMute == 'N') {
      SoundPlayer.playSoundFile('tapnotification', 'mp3');
    }
    const Token = await AsyncStorage.getItem('Token');
    const updatedAnnouncements = announcement.map(comment => {
      if (comment.announcement_id === Like_id) {
        return {
          ...comment,
          self_liked: !isLiked,
          likes_count: isLiked
            ? comment.likes_count - 1
            : comment.likes_count + 1,
        };
      }
      return comment;
    });
    setAnnouncement(updatedAnnouncements);

    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        accesstoken: `Bearer ${Token}`,
      },
    });
    socket.emit(isLiked ? 'dislikeAnnouncement' : 'likeAnnouncement', {
      announcement_id: Like_id,
    });
  };

  const [page, setPage] = useState(2);
  const [hasMoreContent, setHasMoreContent] = useState(true);

  // const loadMoreAnnouncement = async () => {
  //   try {
  //     const Token = await AsyncStorage.getItem('Token');
  //     const response = await fetch(`${baseUrl}/announcements/get-all-announcement/${page}/25`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-api-key': apiKey,
  //         'accesstoken': `Bearer ${Token}`,
  //       },
  //     });
  //     const result = await response.json();
  //     if (dataRe?.message.length >= 25) {
  //       setAnnouncement((prevMessages) => [...dataRe?.message, ...prevMessages])
  //       setPage(page + 1)
  //       setLoadMoreLoader(false)
  //   }
  //   else {
  //       setHasMoreContent(false)
  //       setAnnouncement((prevMessages) => [...dataRe?.message, ...prevMessages])
  //       setPage(page + 1)
  //       setLoadMoreLoader(false)
  //   }
  //   } catch (error) {
  //     console.error("Failed to fetch user details:", error);
  //   }
  // };

  // loadMoreAnnouncement()u

  useEffect(() => {
    const loadUserId = async () => {
      const user_ID = await AsyncStorage.getItem('U_id');
      setUserId(user_ID);
    };
    loadUserId();
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);
  const [editAndDelete, setEditAndDelete] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteAnnouncement = async () => {
    setDeleteLoading(true);
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
      .emit('deleteAnnouncement', {
        announcement_id: selectedAnnouncement,
      })
      .on('announcement', data => {
        setAnnouncement(data);
        setDeleteLoading(false);
        setModalVisible(false);
        setSelectedAnnouncement();
      });
  };

  const requestCameraPermission = async (announcement_id, captions) => {
    setSelectedAnnouncement(announcement_id);
    setCaption(captions);
    try {
      setEditAndDelete(true);
    } catch (err) {
      console.warn(err);
    }
  };

  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity
          onLongPress={() =>
            item?.user_details?.user_id == userId
              ? requestCameraPermission(item?.announcement_id, item?.message)
              : undefined
          }
          style={styles.SinglePost}>
          <View style={styles.ProfileSide}>
            <FastImage
              source={
                item?.user_details?.profile_picture_url
                  ? {
                      uri: item?.user_details?.profile_picture_url,
                      priority: FastImage.priority.high,
                    }
                  : require('../assets/icons/avatar.png')
              }
              style={styles.PostProfileImage2}
              resizeMode="cover"
            />
          </View>
          <View style={styles.TextSide}>
            <TouchableOpacity
              onLongPress={() =>
                item?.user_details?.user_id == userId
                  ? requestCameraPermission(
                      item?.announcement_id,
                      item?.message,
                    )
                  : undefined
              }
              onPress={() =>
                navigation.navigate('announcementDetail', {
                  announcement_id: item?.announcement_id,
                })
              }>
              <View style={styles.ProfileDetail}>
                <TextC
                  text={`${item?.user_details?.user_name}`}
                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(12)}
                />
              </View>
              <TextC
                style={{color: global.placeholderColor}}
                text={item?.message}
                font={'Montserrat-Regular'}
                size={ResponsiveSize(11)}
              />
            </TouchableOpacity>
            <View style={styles.PostSetting}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('createAnnouncement', {
                    Reply_user_name: item?.user_details?.user_name,
                    user_Profile: profilePicture,
                    isReply: true,
                    announcement_id: item?.announcement_id,
                  })
                }
                style={styles.Comment}>
                <Fontisto name="comment" size={ResponsiveSize(13)} />
                <TextC
                  text={item?.comments_count}
                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(9)}
                  style={{paddingLeft: ResponsiveSize(3)}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Comment}
                onPress={() =>
                  handleLike(item?.announcement_id, item?.self_liked)
                }>
                {item?.self_liked ? (
                  <AntDesign
                    color={global.red}
                    name="heart"
                    size={ResponsiveSize(14)}
                  />
                ) : (
                  <AntDesign name="hearto" size={ResponsiveSize(14)} />
                )}
                <TextC
                  text={item?.likes_count}
                  font={'Montserrat-Bold'}
                  size={ResponsiveSize(9)}
                  style={{paddingLeft: ResponsiveSize(3)}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [profilePicture, announcement],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flexGrow: 1}}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
      }>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          backgroundColor={
            scheme === 'dark' ? DarkTheme.colors.background : 'white'
          }
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: ResponsiveSize(60),
            width: windowWidth,
            backgroundColor: 'white',
            paddingHorizontal: ResponsiveSize(15),
            borderBottomWidth: ResponsiveSize(1),
            borderBottomColor: '#EEEEEE',
          }}>
          <View>
            <Image source={require('../assets/icons/Logo.png')} style={{ objectFit: 'contain', width: ResponsiveSize(115), height: ResponsiveSize(22) }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextC text={GetUserProfileReducer?.data?.airline} font={"Montserrat-Bold"} />
              <FastImage
                source={GetUserProfileReducer?.data?.airlineLogo
                  ? { uri: GetUserProfileReducer?.data?.airlineLogo, priority: FastImage.priority.high }
                  : require('../assets/icons/avatar.png')}
                style={{ height: ResponsiveSize(30), width: ResponsiveSize(30) }}
                resizeMode="cover"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={styles.ShareBtn}
              onPress={() =>
                navigation.navigate('createAnnouncement', {
                  user_name: userName,
                  user_Profile: profilePicture,
                })
              }>
              <AntDesign
                name="plus"
                size={ResponsiveSize(22)}
                color={global.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{flexGrow: 1, backgroundColor: global.white}}>
          {refreshing ? (
            <>
              <SkeletonPlaceholder />
              <SkeletonPlaceholder />
              <SkeletonPlaceholder />
            </>
          ) : (
            <FlashList
              data={announcement}
              renderItem={renderItem}
              keyExtractor={item => item.announcement_id}
            />
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        isVisible={isModalVisible}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalTopLayer}>
          <TextC
            text={'Are you sure?'}
            size={ResponsiveSize(13)}
            font={'Montserrat-Bold'}
          />
          <TextC
            text={'This action cannot be undone.'}
            size={ResponsiveSize(10)}
            font={'Montserrat-Medium'}
          />

          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={styles.CancelBtnModal}>
            <TextC text={'Cancel'} font={'Montserrat-SemiBold'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteAnnouncement()}
            style={styles.DeleteBtnModal}>
            {deleteLoading ? (
              <ActivityIndicator color={global.white} size={'small'} />
            ) : (
              <TextC
                text={'Delete'}
                font={'Montserrat-SemiBold'}
                style={{color: global.white}}
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={editAndDelete}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setEditAndDelete(false)}>
        <View style={styles.modalTopLayer2}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: ResponsiveSize(15),
            }}>
            <ButtonC
              onPress={() => {
                setEditAndDelete(false);
                setModalVisible(true);
              }}
              BtnStyle={{width: windowWidth * 0.45}}
              TextStyle={{color: global.white}}
              bgColor={global.red}
              style={{borderColor: '#EEEEEE', borderWidth: ResponsiveSize(1)}}
              title={'Delete'}></ButtonC>
            <View style={{marginTop: ResponsiveSize(10)}}>
              <ButtonC
                onPress={() => {
                  setEditAndDelete(false)
                  navigation.navigate('UpdateAnnouncement', { user_name: userName, user_Profile: profilePicture, caption: caption, announcement_id: selectedAnnouncement })
                }}
                BtnStyle={{width: windowWidth * 0.45}}
                TextStyle={{color: global.white}}
                bgColor={global.secondaryColor}
                style={{borderColor: '#EEEEEE', borderWidth: ResponsiveSize(1)}}
                title={'Update'}></ButtonC>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({GetUserProfileReducer}) {
  return {GetUserProfileReducer};
}
export default connect(mapStateToProps, UserProfile)(Announcement);
