import { DarkTheme, useNavigation, CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Animated,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CityScroll from '../components/citiesScroll';
import Post from '../components/post';
import * as UserProfile from '../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import { global, ResponsiveSize } from '../components/constant';
import TextC from '../components/text/text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import { useHeaderHeight } from "@react-navigation/elements";
import MainHeader from '../components/mainHeader';



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
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: ResponsiveSize(10),
    },
    imageWrapper: {
      width: windowWidth - ResponsiveSize(30),
      height: ResponsiveSize(200),
      borderRadius: ResponsiveSize(25),
      overflow: 'hidden',
      marginTop: ResponsiveSize(20),
    },
    textWrapper: {
      paddingLeft: ResponsiveSize(0),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
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
      <View style={styles.textWrapper}>
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
        <View style={{ marginLeft: ResponsiveSize(10) }}>
          <View style={styles.titleStripe}>
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
        </View>
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
  );
};

const HomeScreen = ({
  GetUserProfileReducer,
  GetProfileData,
  GetUserPosts,
  PostCreationReducer,
  route
}) => {
  const headerHeight = useHeaderHeight();
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const handleCitySelect = (city) => {
     setSelectedCity(city);
  };
  const getFeeds = async () => {
    setLoading(true);
    const result = await GetUserPosts({city: selectedCity});
    if (result) {
      setPost(result.reverse())
      setLoading(false)
      navigation.dispatch(
        CommonActions.navigate({
          index: 0,
          routes: [
            { name: 'Home' },
          ],
        })
      );
    }
    else {
      setPost([])
      setLoading(false)
      navigation.dispatch(
        CommonActions.navigate({
          index: 0,
          routes: [
            { name: 'Home' },
          ],
        })
      );
    }
  };
  useEffect(() => {
  
    GetProfileData();
    if (PostCreationReducer?.uploadLoading == false) {
      getFeeds();
    }
  }, [PostCreationReducer?.uploadLoading, route.params?.CheckInCity, selectedCity]);

  const styles = StyleSheet.create({
    UploadingLoader: {
      paddingVertical: ResponsiveSize(10),
      paddingHorizontal: ResponsiveSize(15),
      borderBottomWidth: ResponsiveSize(1),
      borderBottomColor: global.description,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImageUpload: {
      height: ResponsiveSize(30),
      width: ResponsiveSize(30),
      borderRadius: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    PostDescription: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: ResponsiveSize(8),
    },
  });


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
        <MainHeader loading={loading}/>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            ...(scheme === 'dark'
              ? { backgroundColor: DarkTheme.colors.background }
              : { backgroundColor: 'white' }),
          }}>
          <View>
            <CityScroll  onCitySelect={handleCitySelect}/>
          </View>

          {PostCreationReducer?.uploadLoading && (
            <View style={styles.UploadingLoader} >
              <TouchableOpacity onPress={() => navigation.navigate('Status')}>

     
              <ImageBackground
                style={styles.profileImageUpload}
                source={{ uri: `file://${PostCreationReducer?.uploadFiles}` }}>
                <ActivityIndicator size={'small'} color={global.white} />
              </ImageBackground>
              </TouchableOpacity>
              <View style={styles.PostDescription}>
                <TextC
                  text={'Finishing up'}
                  font={'Montserrat-SemiBold'}
                  size={ResponsiveSize(12)}
                  style={{ color: global.black }}
                />
                <AntDesign
                  name="checkcircleo"
                  color={global.secondaryColor}
                  style={{
                    marginTop: ResponsiveSize(3),
                    marginLeft: ResponsiveSize(5),
                  }}
                />
              </View>
            </View>
          )}

          {loading ? (
            <View style={{ paddingTop: ResponsiveSize(10) }}>
              <SkeletonPlaceholder />
              <SkeletonPlaceholder />
              <SkeletonPlaceholder />
            </View>
          ) : (
            <View>
              {post !== undefined &&
                post !== null &&
                post !== '' &&
                post.length > 0 ?
                post?.map(data => (
                  <Post
                    key={data?.post_id}
                    selfLiked={data?.selfLiked}
                    postId={data?.post_id}
                    timeAgo={data?.created_at}
                    userLocation={`${data?.lastCheckin?.city} | ${data?.lastCheckin?.state}`}
                    userName={data?.userDetails?.user_name}
                    profileImage={data?.userDetails?.profile_picture_url}
                    likeCount={data?.likes_count}
                    commnetCount={data?.comments_count}
                    description={data?.caption}
                    content={data?.attachments}
                    comments_show_flag={data?.comments_show_flag}
                    allow_comments_flag={data?.allow_comments_flag}
                    likes_show_flag={data?.likes_show_flag}
                    content_type={data?.content_type}
                    reshareUserDetails={data?.reshareUserDetails}
                  />
                )) :
                <View style={{ paddingTop: ResponsiveSize(30), flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <TextC
                    text={'No posts yet'}
                    font={'Montserrat-SemiBold'}
                    size={ResponsiveSize(18)}
                    style={{ color: global.primaryColor }}
                  />
                </View>
              }
            </View>
          )}
        </ScrollView>
      </SafeAreaView >
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({ GetUserProfileReducer, PostCreationReducer }) {
  return { GetUserProfileReducer, PostCreationReducer };
}
export default connect(mapStateToProps, UserProfile)(HomeScreen);