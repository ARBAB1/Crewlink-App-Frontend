import { DarkTheme, useNavigation, CommonActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  RefreshControl,
  FlatList,
  ScrollView,
  Image
} from 'react-native';
import CityScroll from '../components/citiesScroll';
import Post from '../components/post/index';
import PostReshare from '../components/postReshare/index';
import * as UserProfile from '../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import { global, ResponsiveSize } from '../components/constant';
import TextC from '../components/text/text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import { useHeaderHeight } from "@react-navigation/elements";
import MainHeader from '../components/mainHeader';
import { useSWRConfig } from 'swr';
import { useToast } from "react-native-toast-notifications";



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
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();


  const handleCitySelect = (city) => {
    console.log(city, 'city')
    setSelectedCity(city);
  };
  const getFeeds = async () => {
    console.log(selectedCity,"bydefaultcity")
    setLoading(true);
    const result = await GetUserPosts({ city: selectedCity, page: page });
    if (result?.status == "No_Post_Found") {
      toast.show("No Posts Found on this airline")
      setLoading(false)
      setPost([])
    }
    else if (result?.status == "something_Went_Wrong") {
      toast.show("Something Went Wrong")
      setLoading(false)
      setPost([])
    }
    else if (result?.status == "Post_Found") {
      if (result?.data?.length >= 15) {
        cacheloader(result?.data)
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
        cacheloader(result?.data)
        setHasMoreContent(false)
        navigation.dispatch(
          CommonActions.navigate({
            index: 0,
            routes: [
              { name: 'Home' },
            ],
          })
        );
      }
    }

  };


  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(true);



  const getMoreFeeds = async () => {
    setLoadingMore(true);
    const result = await GetUserPosts({ city: selectedCity, page: page });
    if (result?.status == "No_Post_Found") {
      toast.show("No Posts Found")
      setLoading(false)
      setPost([])
    }
    else if (result?.status == "something_Went_Wrong") {
      toast.show("Something Went Wrong")
      setLoading(false)
      setPost([])
    }
    else if (result?.status == "Post_Found") {
      if (result?.data?.length >= 15) {
        cacheloader(result?.data)
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
        cacheloader(result?.data)
        setHasMoreContent(false)
        navigation.dispatch(
          CommonActions.navigate({
            index: 0,
            routes: [
              { name: 'Home' },
            ],
          })
        );
      }
    }
  };


  useEffect(() => {
    getMoreFeeds();
  }, [page]);


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

  const onRefresh = async () => {
    cache.delete('UserFeed')
    setRefreshing(true);
    getFeeds()
    setPage(1)
    setHasMoreContent(true)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }
  const { cache } = useSWRConfig()
  const cacheloader = async (loadAllFeed) => {
    const preLoad = cache.get('UserFeed')
    const combinedData = [...preLoad || [], ...(loadAllFeed || [])];
    const uniqueData = Array.from(
      combinedData.reduce((map, item) => {
        map.set(item?.post_id, item);
        return map;
      }, new Map()).values()
    );
    cache.set("UserFeed", uniqueData)
    setPost(cache.get('UserFeed'))
    setLoadingMore(false)
    setLoading(false)
  }







  const renderItem = useCallback((items) => {
    console.log(items.item)
    return (
      <>
        {items?.item?.content_type == "POST_RESHARE" ?
          <PostReshare
            key={items?.item?.post_id}
            selfLiked={items?.item?.selfLiked}
            postId={items?.item?.post_id}
            timeAgo={items?.item?.created_at}
            post_city={`${items?.item?.post_city}`}
            userName={items?.item?.userDetails?.user_name}
            profileImage={items?.item?.userDetails?.profile_picture_url}
            likeCount={items?.item?.likes_count}
            commnetCount={items?.item?.comments_count}
            description={items?.item?.caption}
            content={items?.item?.attachments}
            comments_show_flag={items?.item?.comments_show_flag}
            allow_comments_flag={items?.item?.allow_comments_flag}
            likes_show_flag={items?.item?.likes_show_flag}
            content_type={items?.item?.content_type}
            reshareUserDetails={items?.item?.reshareUserDetails}
            user_idIn={items?.item?.user_id}
          />
          :
          <Post
            key={items?.item?.post_id}
            selfLiked={items?.item?.selfLiked}
            postId={items?.item?.post_id}
            timeAgo={items?.item?.created_at}
            post_city={`${items?.item?.post_city}`}
            userName={items?.item?.userDetails?.user_name}
            profileImage={items?.item?.userDetails?.profile_picture_url}
            likeCount={items?.item?.likes_count}
            commnetCount={items?.item?.comments_count}
            description={items?.item?.caption}
            content={items?.item?.attachments}
            comments_show_flag={items?.item?.comments_show_flag}
            allow_comments_flag={items?.item?.allow_comments_flag}
            likes_show_flag={items?.item?.likes_show_flag}
            content_type={items?.item?.content_type}
            user_idIn={items?.item?.user_id}
          />
        }
      </>
    );
  }, []);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flexGrow: 1 }}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
      }>
      <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
        <StatusBar
          backgroundColor={
            scheme === 'dark' ? DarkTheme.colors.background : 'white'
          }
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <MainHeader loading={loading} />
        {loading ? (
          <View style={{ paddingTop: ResponsiveSize(10) }}>
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
          </View>
        ) : (
          <>
            {post !== undefined &&
              post !== null &&
              post !== '' &&
              post.length > 0 ?
              <FlatList
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                data={post}
                keyExtractor={(items, index) => index?.toString()}
                maxToRenderPerBatch={10}
                windowSize={10}
                onEndReachedThreshold={0.5}
                renderItem={renderItem}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListHeaderComponent={
                  <>
                    <View>
                      <CityScroll onCitySelect={handleCitySelect} />
                    </View>
                    {PostCreationReducer?.uploadLoading && (
                      <View style={styles.UploadingLoader} >
                        <TouchableOpacity>
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
                  </>
                }
                ListFooterComponent={
                  hasMoreContent &&
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: ResponsiveSize(30), paddingTop: ResponsiveSize(10) }}>
                    {loadingMore ?
                      <ActivityIndicator size={ResponsiveSize(21)} color={global.primaryColor} />
                      :
                      <TouchableOpacity onPress={() => setPage(page + 1)} style={{ backgroundColor: global.secondaryColor, paddingHorizontal: ResponsiveSize(20), paddingVertical: ResponsiveSize(8), borderRadius: ResponsiveSize(30) }}>
                        <TextC
                          text={'Load more'}
                          font={'Montserrat-SemiBold'}
                          size={ResponsiveSize(11)}
                          style={{ color: global.primaryColor }}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                }
              />
              :
              <>
                <View>
                  <CityScroll onCitySelect={handleCitySelect} />
                </View>
                <ScrollView refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                } contentContainerStyle={{ flex: 1, paddingHorizontal: ResponsiveSize(30), flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <TextC
                    text={'No posts found'}
                    font={'Montserrat-Bold'}
                    size={ResponsiveSize(18)}
                    style={{ color: global.primaryColor }}
                  />
                  <TextC
                    text={'No posts available to display. Check back later for updates or new content!'}
                    font={'Montserrat-Medium'}
                    size={ResponsiveSize(11)}
                    style={{ color: global.placeholderColor, textAlign: 'center', paddingTop: ResponsiveSize(5) }}
                  />
                </ScrollView>
              </>
            }
          </>
        )}
      </SafeAreaView >
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({ GetUserProfileReducer, PostCreationReducer }) {
  return { GetUserProfileReducer, PostCreationReducer };
}
export default connect(mapStateToProps, UserProfile)(HomeScreen);