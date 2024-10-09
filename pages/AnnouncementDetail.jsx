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
  RefreshControl, 
  Easing, 
  Animated, 
  ActivityIndicator,
  Pressable
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useHeaderHeight } from "@react-navigation/elements";
import { DarkTheme, useNavigation, useIsFocused } from '@react-navigation/native';
import { global, ResponsiveSize } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import TextC from '../components/text/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, apiKey } from '../store/config.json';
import io from "socket.io-client";
import { FlashList } from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';

const SkeletonPlaceholder = ({ style }) => {
  const translateX = new Animated.Value(-350);
  const windowWidth = Dimensions.get('window').width;

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
    profileImageSkelton: {
      width: ResponsiveSize(50),
      height: ResponsiveSize(50),
      borderRadius: ResponsiveSize(50),
      overflow: 'hidden',
    },
    descriptionStripe: {
      width: ResponsiveSize(80),
      height: ResponsiveSize(20),
      borderRadius: ResponsiveSize(5),
      marginTop: ResponsiveSize(12),
      overflow: 'hidden',
    },
    linearGradientLine: {
      flex: 1,
      width: ResponsiveSize(350),
    },
  });

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 350,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop(); // Clean up animation on unmount
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.profileImageSkelton}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <LinearGradient
            colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.linearGradientLine}
          />
        </Animated.View>
      </View>
      <View style={styles.descriptionStripe}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <LinearGradient
            colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.linearGradientLine}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const AnnouncementDetail = ({ route }) => {
  const windowWidth = Dimensions.get('window').width;
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [announcement, setAnnouncement] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isMore, setIsMore] = useState(true);
  const [moreLoader, setMoreLoader] = useState(false);
  const headerHeight = useHeaderHeight();
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
      padding: ResponsiveSize(15),
    },
    container: {
      paddingVertical: ResponsiveSize(10),
      position: 'relative',
    },
    SinglePost2: {
      paddingHorizontal: ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: ResponsiveSize(15),
      borderBottomColor: "#EEEEEE",
      borderBottomWidth: ResponsiveSize(1),
    },
    ProfileSide2: {
      width: windowWidth * 0.22 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'relative',
    },
    TextSide2: {
      width: windowWidth * 0.78 - ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      paddingLeft: ResponsiveSize(10),
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
    SinglePost: {
      paddingHorizontal: ResponsiveSize(15),
      
      paddingBottom: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderBottomColor: "#EEEEEE",
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
    LoadMore: {
      backgroundColor: global.primaryColor,
      height: ResponsiveSize(40),
      width: ResponsiveSize(100),
      borderRadius: ResponsiveSize(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    NoCommentText: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: ResponsiveSize(50),
    },
  });

  useEffect(() => {
    if (focus) {
      loadComments();
    }
  }, [focus]);

  const loadComments = async () => {
    setRefreshing(true);
    try {
      const Token = await AsyncStorage.getItem('Token');
      const response = await fetch(
        `${baseUrl}/announcements/get-announcement-comments/${route?.params?.details?.announcement_id}/${page}/10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'accesstoken': `Bearer ${Token}`,
        }
      });
      const result = await response.json();
      
      if (result.comments.length >= 10) {
        setAnnouncement(prev => [...prev, ...result.comments]);
      } else {
        setAnnouncement(prev => [...prev, ...result.comments]);
        setIsMore(false);
      }
    } catch (error) {
      console.error("Error loading comments", error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreComments = async (nextPage) => {
    setPage(nextPage);
    setMoreLoader(true);
    try {
      const Token = await AsyncStorage.getItem('Token');
      const response = await fetch(
        `${baseUrl}/announcements/get-announcement-comments/${route?.params?.details?.announcement_id}/${nextPage}/10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'accesstoken': `Bearer ${Token}`,
        }
      });
      const result = await response.json();

      if (result.comments.length >= 10) {
        setAnnouncement(prev => [...prev, ...result.comments]);
      } else {
        setIsMore(false);
      }
    } catch (error) {
      console.error("Error loading more comments", error);
    } finally {
      setMoreLoader(false);
    }
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    setIsMore(true);
    setAnnouncement([]);
    loadComments();
  }, []);

  const handleLike = async (commentId, isLiked) => {
    const Token = await AsyncStorage.getItem('Token');
    const updatedComments = announcement.map(comment => {
      if (comment.comment_id === commentId) {
        return {
          ...comment,
          selfLiked: !isLiked,
          likes_count: isLiked ? comment.likes_count - 1 : comment.likes_count + 1,
        };
      }
      return comment;
    });
    setAnnouncement(updatedComments);

    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': 'TwillioAPI',
        'accesstoken': `Bearer ${Token}`,
      }
    });
    socket.emit(isLiked ? 'dislikeAnnouncementComment' : 'likeAnnouncementComment', {
      "comment_id": commentId,
    });
  };

  const renderItem = useCallback(({ item }) => (
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
          <TextC
            text={`${item?.user_details?.user_name}`}
            font={'Montserrat-Bold'}
            size={ResponsiveSize(11)}
          />
          <TextC
            text={item?.comment}
            font={'Montserrat-Regular'}
            size={ResponsiveSize(12)}
            style={{ color: global.placeholderColor }}
          />
        </TouchableOpacity>
        <View style={styles.PostSetting}>
          <TouchableOpacity style={styles.Comment} onPress={() => handleLike(item?.comment_id, item?.selfLiked)}>
            {item.selfLiked ? (
              <AntDesign name="heart" size={ResponsiveSize(14)} color={global.red} />
            ) : (
              <AntDesign name="hearto" size={ResponsiveSize(14)} />
            )}
            <TextC text={`${item.likes_count}`} font={'Montserrat-Bold'} size={ResponsiveSize(9)} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [announcement]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flexGrow: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0 }
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={scheme === 'dark' ? DarkTheme.colors.background : 'white'}
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View >
          <Pressable onPress={() => navigation.goBack()} style={styles.ContainerHeader}>
            <AntDesign name="left" color={'#05348E'} size={ResponsiveSize(16)} />
            <TextC size={ResponsiveSize(12)} font={'Montserrat-Bold'} text={'Announcements'} />
          </Pressable>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {/* Render the announcement details */}
          <View style={styles.SinglePost}>
            <View style={styles.ProfileSide}>
              <FastImage
                source={route.params.details?.user_details?.profile_picture_url === ''
                  ? require('../assets/icons/avatar.png')
                  : {
                    uri: route.params.details?.user_details?.profile_picture_url,
                    priority: FastImage.priority.high,
                  }}
                style={styles.PostProfileImage2}
                resizeMode="cover"
              />
            </View>
            <View style={styles.TextSide}>
              <TextC text={route.params.details?.user_details?.user_name} font={'Montserrat-Bold'} size={ResponsiveSize(11)} />
              <TextC style={{ color: global.placeholderColor }} text={route.params.details?.message} font={'Montserrat-Regular'} size={ResponsiveSize(12)} />
            </View>
          </View>

          <View style={styles.container}>
            {announcement.length > 0 ? (
              <FlashList
                data={announcement}
                renderItem={renderItem}
                keyExtractor={item => item.comment_id}
              />
            ) : (
              <View style={styles.NoCommentText}>
                <TextC text={"No comment found"} font={'Montserrat-Medium'} />
              </View>
            )}
            {isMore && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(20) }}>
                <TouchableOpacity disabled={moreLoader} onPress={() => loadMoreComments(page + 1)} style={styles.LoadMore}>
                  {moreLoader ? (
                    <ActivityIndicator size={ResponsiveSize(15)} color={global.white} />
                  ) : (
                    <TextC text={"Load more"} font={'Montserrat-Medium'} style={{ color: global.white }} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AnnouncementDetail;
