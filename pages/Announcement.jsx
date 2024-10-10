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
  Animated 
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useHeaderHeight } from "@react-navigation/elements";
import { DarkTheme, useNavigation, useIsFocused } from '@react-navigation/native';
import { global, ResponsiveSize } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FastImage from 'react-native-fast-image';
import TextC from '../components/text/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../store/config.json';
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

const Announcement = () => {
  const windowWidth = Dimensions.get('window').width;
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [announcement, setAnnouncement] = useState([]);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
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
    }
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
          'x-api-key': "TwillioAPI",
          'accesstoken': `Bearer ${Token}`,
        }
      });

      socket.on('announcement', (data) => {
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
    // Re-trigger socket connection refresh
  }, []);

  const handleLike = async (Like_id, isLiked) => {
    const Token = await AsyncStorage.getItem('Token');
    const updatedAnnouncements = announcement.map(comment => {
      if (comment.announcement_id === Like_id) {
        return {
          ...comment,
          self_liked: !isLiked,
          likes_count: isLiked ? comment.likes_count - 1 : comment.likes_count + 1,
        };
      }
      return comment;
    });
    setAnnouncement(updatedAnnouncements);

    const socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': "TwillioAPI",
        'accesstoken': `Bearer ${Token}`,
      }
    });
    socket.emit(isLiked ? 'dislikeAnnouncement' : 'likeAnnouncement', {
      "announcement_id": Like_id,
    });
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.SinglePost}>
        <View style={styles.ProfileSide}>
          <FastImage
            source={item?.user_details?.profile_picture_url
              ? { uri: item?.user_details?.profile_picture_url, priority: FastImage.priority.high }
              : require('../assets/icons/avatar.png')}
            style={styles.PostProfileImage2}
            resizeMode="cover"
          />
        </View>
        <View style={styles.TextSide}>
          <TouchableOpacity onPress={() => navigation.navigate("announcementDetail", { announcement_id: item?.announcement_id })}>
            <View style={styles.ProfileDetail}>
              <TextC text={`${item?.user_details?.user_name}`} font={'Montserrat-Bold'} size={ResponsiveSize(11)} />
            </View>
            <TextC style={{ color: global.placeholderColor }} text={item?.message} font={'Montserrat-Regular'} size={ResponsiveSize(12)} />
          </TouchableOpacity>
          <View style={styles.PostSetting}>
            <TouchableOpacity onPress={() => navigation.navigate('createAnnouncement', { Reply_user_name: item?.user_details?.user_name, user_Profile: profilePicture, isReply: true, announcement_id: item?.announcement_id })} style={styles.Comment}>
              <Fontisto name='comment' size={ResponsiveSize(13)} />
              <TextC text={item?.comments_count} font={'Montserrat-Bold'} size={ResponsiveSize(9)} style={{ paddingLeft: ResponsiveSize(3) }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.Comment} onPress={() => handleLike(item?.announcement_id, item?.self_liked)}>
              {item?.self_liked ? 
                <AntDesign color={global.red} name='heart' size={ResponsiveSize(14)} /> :
                <AntDesign name='hearto' size={ResponsiveSize(14)} />}
              <TextC text={item?.likes_count} font={'Montserrat-Bold'} size={ResponsiveSize(9)} style={{ paddingLeft: ResponsiveSize(3) }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [profilePicture, announcement]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flexGrow: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={scheme === 'dark' ? DarkTheme.colors.background : 'white'}
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View style={styles.ContainerHeader}>
          <View style={styles.HeaderLeft}>
            <TextInput style={styles.SearchHeader} placeholder='Search Announcement' />
          </View>
          <View style={styles.HeaderRight}>
            <TouchableOpacity style={styles.ShareBtn} onPress={() => navigation.navigate('createAnnouncement', { user_name: userName, user_Profile: profilePicture })}>
              <AntDesign name='plus' size={ResponsiveSize(22)} color={global.white} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white }}>
          <View style={styles.container}>
            {refreshing ?
              <>
                <SkeletonPlaceholder />
                <SkeletonPlaceholder />
                <SkeletonPlaceholder />
              </> :
              <FlashList
                data={announcement}
                renderItem={renderItem}
                keyExtractor={item => item.announcement_id}
              />
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Announcement;
