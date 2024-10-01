import { Platform, StatusBar, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, View, useColorScheme, ScrollView, TouchableOpacity, TextInput, RefreshControl, Easing, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useHeaderHeight } from "@react-navigation/elements";
import { DarkTheme, useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { global, ResponsiveSize } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FastImage from 'react-native-fast-image';
import TextC from '../components/text/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, apiKey } from '../store/config.json'
import io from "socket.io-client";
import { FlashList } from '@shopify/flash-list';
import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';



const SkeletonPlaceholder = ({ style, refreshing }) => {
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
      marginBottom: ResponsiveSize(10),
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
          <Animated.View style={[styles.gradient, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradientLine}
            />
          </Animated.View>
        </View>
      </View>
      <View style={styles.textWrapper}>
        <View style={styles.descriptionStripe}>
          <Animated.View
            style={[styles.gradient, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradientLine}
            />
          </Animated.View>
        </View>
        <View style={styles.imageWrapper}>
          <Animated.View style={[styles.gradient, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradient}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};


const AnnouncementDetail = ({ route }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [announcement, SetAnnouncement] = useState([])
  const [page, setPage] = useState(1)
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = React.useState(false);
  const focus = useIsFocused();


  const styles = StyleSheet.create({
    BottomSpacer: {
      paddingBottom: ResponsiveSize(30),
    },
    ContainerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: global.white,
      borderBottomColor: '#eeeeee',
      borderBottomWidth: ResponsiveSize(1),
      padding: ResponsiveSize(15)

    },
    HeaderLeft: {
      width: windowWidth * 0.8 - ResponsiveSize(15),
    },
    HeaderRight: {
      width: windowWidth * 0.2 - ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    SearchHeader: {
      backgroundColor: "#EEEEEE",
      paddingHorizontal: ResponsiveSize(15),
      height: ResponsiveSize(40),
      borderRadius: ResponsiveSize(50),
      fontFamily: "Montserrat-Medium",
      fontSize: ResponsiveSize(11)
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
      paddingHorizontal: ResponsiveSize(15),
      borderBottomColor: "#EEEEEE",
      borderBottomWidth: ResponsiveSize(1),
    },
    SinglePost2: {
      paddingHorizontal: ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: ResponsiveSize(15),
      borderBottomColor: "#EEEEEE",
      borderBottomWidth: ResponsiveSize(1),
    },
    ProfileSide: {
      width: windowWidth * 0.22 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative'
    },
    ProfileSide2: {
      width: windowWidth * 0.22 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'relative',
    },
    TextSide: {
      width: windowWidth * 0.78 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
    },
    TextSide2: {
      width: windowWidth * 0.78 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      paddingLeft: ResponsiveSize(10),
    },
    PostProfileImage2: {
      height: ResponsiveSize(45),
      width: ResponsiveSize(45),
      borderRadius: ResponsiveSize(40),
      backgroundColor: global.description,
      overflow: 'hidden',
    },
    PostProfileImage3: {
      height: ResponsiveSize(35),
      width: ResponsiveSize(35),
      borderRadius: ResponsiveSize(35),
      backgroundColor: global.description,
      overflow: 'hidden',
    },
    ProfileDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: ResponsiveSize(3)
    },
    PostSetting: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: ResponsiveSize(8)
    },
    Comment: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: ResponsiveSize(15)
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
    CommentBanner: {
      top: ResponsiveSize(60),
      left: windowWidth * 0.11 - ResponsiveSize(12),
      width: ResponsiveSize(2),
      flex: 1,
      backgroundColor: global.primaryColor,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(15),
      backgroundColor:
        scheme === 'dark' ? DarkTheme.colors.background : global.white,
    },
    logoSide1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    LoadMore: {
      backgroundColor: global.primaryColor,
      height: ResponsiveSize(40),
      width: ResponsiveSize(100),
      borderRadius: ResponsiveSize(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }
  })

  useEffect(() => {
    loadRecentChats()
  }, [focus])


  const loadRecentChats = async () => {
    if (focus == true) {
      setRefreshing(true);
      const Token = await AsyncStorage.getItem('Token');
      const CommentResult = await fetch(`${baseUrl}/announcements/get-announcement-comments/${route?.params?.details?.announcement_id}/${page}/10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'accesstoken': `Bearer ${Token}`
        }
      })
      const Result = await CommentResult.json()
      SetAnnouncement(Result?.comments)
      setRefreshing(false);
    }
  }


  const [moreLoader, setModeLoader] = useState(false)
  const [isMore, setIsMore] = useState(true)
  const loadMoreComments = async (page_Number) => {
    setPage(page_Number)
    setModeLoader(true);
    const Token = await AsyncStorage.getItem('Token');
    const CommentResult = await fetch(`${baseUrl}/announcements/get-announcement-comments/${route?.params?.details?.announcement_id}/${page_Number}/10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'accesstoken': `Bearer ${Token}`
      }
    })
    const Result = await CommentResult.json()
  
    if (Result.comments.length >= 10) {
      SetAnnouncement(prev => [...prev, ...Result?.comments])
      setModeLoader(false);
    }
    else {
      SetAnnouncement(prev => [...prev, ...Result?.comments])
      setIsMore(false)

    }
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsMore(true)
    setModeLoader(false)
    setPage(1)
    loadRecentChats();
  }, []);


  const GetLike = async (Like_id) => {
    const Token = await AsyncStorage.getItem('Token');
    const filterCommentDat = announcement.map(comment => {
      if (comment.announcement_id == Like_id) {
        return {
          ...comment,
          self_liked: true,
          likes_count: comment?.likes_count + 1
        };
      }
      return comment;
    });
    SetAnnouncement(filterCommentDat);
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': "TwillioAPI",
        'accesstoken': `Bearer ${Token}`
      }
    });
    socket.on('connect').emit('likeAnnouncementComment', {
      "comment_id": Like_id,
    }).on('announcement ', (data) => {
      SetAnnouncement(data)
    })
  }
  const GetUnLike = async (Like_id) => {
    const Token = await AsyncStorage.getItem('Token');
    const filterCommentDat = announcement.map(comment => {
      if (comment.announcement_id == Like_id) {
        return {
          ...comment,
          self_liked: false,
          likes_count: comment?.likes_count - 1
        };
      }
      return comment;
    });
    SetAnnouncement(filterCommentDat);
    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': "TwillioAPI",
        'accesstoken': `Bearer ${Token}`
      }
    });
    socket.on('connect').emit('dislikeAnnouncementComment', {
      "comment_id": Like_id,
    }).on('announcement', (data) => {
      SetAnnouncement(data)
    })
  }

  const renderItem = useCallback(({ item }) => {
    console.log(item)
    return (
      <View style={styles.SinglePost2}>
        <View style={styles.ProfileSide2}>
          <FastImage
            source={
              item?.user_details?.profile_picture_url === ''
                ? require('../assets/icons/avatar.png')
                : {
                  uri: item?.user_details?.profile_picture_url,
                  priority: FastImage.priority.high,
                }
            }
            style={styles.PostProfileImage3}
            resizeMode="cover"
          />
        </View>
        <View style={styles.TextSide2}>
          <TouchableOpacity>
            <View style={styles.ProfileDetail}>
              <TextC text={`${item?.user_details?.user_name}`} font={'Montserrat-Bold'} size={ResponsiveSize(11)} />
            </View>
            <TextC style={{ color: global.placeholderColor }} text={item?.comment} font={'Montserrat-Regular'} size={ResponsiveSize(12)} />
          </TouchableOpacity>
          <View style={styles.PostSetting}>
          <TouchableOpacity style={styles.Comment} onPress={() => !item?.self_liked ? GetLike(item?.comment_id) : GetUnLike(item?.comment_id)} >
              {item?.self_liked ?
                <AntDesign color={global.red} name='heart' size={ResponsiveSize(14)} />
                :
                <AntDesign name='hearto' size={ResponsiveSize(14)} />
              }
              <TextC text={item?.likes_count} font={'Montserrat-Bold'} size={ResponsiveSize(9)} style={{ paddingLeft: ResponsiveSize(3) }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
    [],
  );



  
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

        <View style={styles.ContainerHeader}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.logoSide1}>
            <AntDesign
              name="left"
              color={'#05348E'}
              size={ResponsiveSize(16)}
            />
            <TextC
              size={ResponsiveSize(12)}
              font={'Montserrat-Bold'}
              text={'Announcements'}
            />
          </Pressable>
        </View>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white }}>
          <View style={styles.container}>
            <View style={styles.SinglePost}>
              <View style={styles.ProfileSide}>
                <FastImage
                  source={
                    route.params.details?.user_details?.profile_picture_url === ''
                      ? require('../assets/icons/avatar.png')
                      : {
                        uri: route.params.details?.user_details?.profile_picture_url,
                        priority: FastImage.priority.high,
                      }
                  }
                  style={styles.PostProfileImage2}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.TextSide}>
                <View style={styles.ProfileDetail}>
                  <TextC text={route.params.details?.user_details?.user_name} font={'Montserrat-Bold'} size={ResponsiveSize(11)} />
                </View>
                <TextC style={{ color: global.placeholderColor }} text={route.params.details?.message} font={'Montserrat-Regular'} size={ResponsiveSize(12)} />
                {/* <View style={styles.PostSetting}>
                  <TouchableOpacity style={styles.Comment}>
                    <Fontisto name='comment' size={ResponsiveSize(13)} />
                    <TextC text={route.params.details?.comments_count} font={'Montserrat-Bold'} size={ResponsiveSize(9)} style={{ paddingLeft: ResponsiveSize(3) }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Comment} onPress={() => !route.params.details?.self_liked ? GetLike(route.params.details?.announcement_id) : GetUnLike(route.params.details?.announcement_id)}>
                    {route.params.details?.self_liked ?
                      <AntDesign color={global.red} name='heart' size={ResponsiveSize(14)} />
                      :
                      <AntDesign name='hearto' size={ResponsiveSize(14)} />
                    }
                    <TextC text={route.params.details?.likes_count} font={'Montserrat-Bold'} size={ResponsiveSize(9)} style={{ paddingLeft: ResponsiveSize(3) }} />
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>

            <View style={styles.BottomSpacer}>
              {refreshing ?
                <>
                  <SkeletonPlaceholder />
                  <SkeletonPlaceholder />
                  <SkeletonPlaceholder />
                </>
                :
                <>
                  <FlashList
                    data={announcement}
                    renderItem={renderItem}
                    keyExtractor={item => item.comment_id}
                  />
                  {isMore &&
                    <View style={{ width: windowWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(20) }}>
                      <TouchableOpacity disabled={moreLoader} onPress={() => loadMoreComments(page + 1)} style={styles.LoadMore}>
                        {moreLoader ?
                          <ActivityIndicator size={ResponsiveSize(15)} color={global.white} />
                          :
                          <TextC text={"Load more"} font={'Montserrat-Medium'} style={{ color: global.white }} />
                        }
                      </TouchableOpacity>
                    </View>
                  }
                </>
              }
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default AnnouncementDetail;
