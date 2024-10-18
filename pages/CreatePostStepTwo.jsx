import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {global, ResponsiveSize} from '../components/constant';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import TextC from '../components/text/text';
import {useNavigation, CommonActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalSelector from 'react-native-modal-selector';
import Carousel from 'react-native-reanimated-carousel';
import * as PostCreationAction from '../store/actions/PostCreation/index';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useHeaderHeight} from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl,apiKey} from '../store/config.json';

const CreatePostTwo = ({
  route,
  PostCreationReducer,
  CreatePostFunction,
  ExludeConnection,
  CommentSwitch,
  CommentCountSwitch,
  LikeCountSwitch,
  EmptyConnection,
}) => {
  const headerHeight = useHeaderHeight();
  const CurrentIndex = useRef(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ScreenHeight = Dimensions.get('screen').height;
  const [videoLink, setVideoLink] = useState(route?.params?.post?.originalPath);
  const navigation = useNavigation();
  const ref = React.useRef(null);
  const [privacy, setPrivacy] = useState('Public');
  const [caption, setCaption] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [canPost, setCanPost] = useState(true);

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: ResponsiveSize(55),
      backgroundColor: global.white,
      paddingHorizontal: ResponsiveSize(15),
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
    NextBtn: {
      backgroundColor: '#69BE25',
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(4),
      borderRadius: ResponsiveSize(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    singlePostContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(15),
      height: windowHeight * 0.3,
      width: windowWidth,
      overflow: 'hidden',
      borderRadius: ResponsiveSize(10),
    },
    singlePostInner: {
      height: windowHeight * 0.3,
      width: windowWidth * 0.7,
      backgroundColor: global.placeholderColor,
      borderRadius: ResponsiveSize(10),
      overflow: 'hidden',
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      borderWidth: 1,
      borderColor: global.description,
      backgroundColor: 'white',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 2,
    },
    CarouselShadow: {
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      borderWidth: 0,
      shadowOpacity: 0.7,
      shadowRadius: 9,
      elevation: 5,
      borderRadius: ResponsiveSize(10),
    },
    singlePostInnerCarousel: {
      height: windowHeight * 0.27,
      width: windowWidth,
      backgroundColor: global.placeholderColor,
      borderRadius: ResponsiveSize(10),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: global.description,
    },
    descriptionCenter: {
      paddingHorizontal: ResponsiveSize(15),
      paddingBottom: ResponsiveSize(15),
      borderBottomColor: global.description,
      borderBottomWidth: 1,
      marginBottom: ResponsiveSize(20),
      paddingTop: ResponsiveSize(10),
    },
    TextFeidContainerRight1: {
      paddingHorizontal: ResponsiveSize(15),
      fontFamily: 'Montserrat-Medium',
      color: global.placeholderColor,
      fontSize: ResponsiveSize(12),
      minHeight: windowHeight * 0.07,
      paddingTop: ResponsiveSize(15),
    },
    TextFeidContainerRightOnlyText: {
      paddingHorizontal: ResponsiveSize(15),
      fontFamily: 'Montserrat-Medium',
      color: global.placeholderColor,
      fontSize: ResponsiveSize(12),
      minHeight: windowHeight * 0.07,
      paddingTop: ResponsiveSize(15),
      borderWidth: ResponsiveSize(1),
      borderColor: '#EEEEEE',
      borderRadius: ResponsiveSize(10),
    },
    SettingList: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: ResponsiveSize(15),
      paddingBottom: ResponsiveSize(20),
    },
    CompleteOverlay: {
      height: ScreenHeight,
      width: windowWidth,
      backgroundColor: 'rgba(0, 0, 0,0.6)',
      position: 'absolute',
      left: 0,
      zIndex: 1000,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    Loader: {
      height: windowHeight * 0.15,
      width: windowWidth * 0.3,
      backgroundColor: global.white,
      borderRadius: ResponsiveSize(10),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagCapsule: {
      backgroundColor: '#EEEEEE',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: ResponsiveSize(10),
      paddingRight: ResponsiveSize(5),
      paddingVertical: ResponsiveSize(3),
      borderRadius: ResponsiveSize(5),
      marginLeft: ResponsiveSize(5),
    },
    TagedPeople: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
    },
    playPausedSingle: {
      height: windowHeight * 0.3,
      width: windowWidth * 0.7,
      position: 'absolute',
      top: 0,
      left: 0,
      borderWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playPaused: {
      position: 'absolute',
      top: 0,
      left: 0,
      borderWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: windowHeight * 0.3,
      width: windowWidth,
    },
  });
  const data = [
    {key: 'PUBLIC', label: 'Public'},
    {key: 'PRIVATE', label: 'Private'},
    {key: 'FOLLOWERS', label: 'Connections only'},
  ];

  const getDetailUser = async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
      const response = await fetch(`${baseUrl}/users/user-details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          accesstoken: `Bearer ${Token}`,
        },
      });
      const res = await response.json();
      setCanPost(
        res?.data?.last_checkin == 'No last check-in available' ? true : false,
      );
      console.log(res?.data?.last_checkin)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetailUser();
  }, []);

  const goHome = async () => {
    await CommentSwitch(false);
    await CommentCountSwitch(false);
    await LikeCountSwitch(false);
    await EmptyConnection();
    navigation.navigate('Home');
  };

  const CreatePostFinalStep = async () => {
    setPostLoading(true);
    const Tags = PostCreationReducer?.searchConnectionData?.map(
      item => item.user_id,
    );
    const stringNumbers = Tags.map(String);
    const timestamp = new Date().getTime();
    const dynamicName = `photo_${timestamp}.jpg`;
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append(
        'privacy_setting',
        data
          ?.filter(d => d.label == privacy)
          .map(b => {
            return b?.key;
          })[0],
      );
      formData.append('tags', JSON.stringify(stringNumbers));
      formData.append(
        'comments_show_flag',
        PostCreationReducer?.isCommentCount == true ? 'N' : 'Y',
      );
      formData.append(
        'likes_show_flag',
        PostCreationReducer?.isLikeCount == true ? 'N' : 'Y',
      );
      formData.append(
        'allow_comments_flag',
        PostCreationReducer?.isCommentOff == true ? 'N' : 'Y',
      );
      if (route?.params?.isMultiple == false) {
        if (route?.params?.post?.type == 'image') {
          formData.append('post_attachments', {
            uri: `file://${route?.params?.post?.content}`,
            name: dynamicName,
            type: 'image/jpeg',
          });
        } else {
          formData.append('post_attachments', {
            uri: `file://${route?.params?.post?.originalPath}`,
            name: 'video.mp4',
            type: 'video/mp4',
          });
        }
      } else {
        route?.params?.post?.map(dev => {
          if (dev.type == 'image') {
            formData.append('post_attachments', {
              uri: `file://${dev?.content}`,
              name: 'photo.jpg',
              type: 'image/jpeg',
            });
          } else {
            formData.append('post_attachments', {
              uri: `file://${dev?.content}`,
              name: 'video.mp4',
              type: 'video/mp4',
            });
          }
        });
      }
      const result = await CreatePostFunction(
        formData,
        route?.params?.isMultiple
          ? route?.params?.post[0]?.content
          : route?.params?.post?.content,
        goHome,
      );
    } catch (error) {
      console.log(error);
    }
  };
  const excludeConections = async r => {
    ExludeConnection(r);
  };

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flexGrow: 1}}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
        }>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: global.white,
            position: 'relative',
          }}>
          <ScrollView>
            <View style={styles.wrapper}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.logoSide1}>
                <AntDesign
                  name="left"
                  color={'#05348E'}
                  size={ResponsiveSize(16)}
                />
                <Image
                  source={require('../assets/icons/Logo.png')}
                  style={{
                    objectFit: 'contain',
                    width: ResponsiveSize(70),
                    height: ResponsiveSize(22),
                  }}
                />
              </TouchableOpacity>
              <View style={styles.logoSide2}>
                <TextC font={'Montserrat-SemiBold'} text={'Post'} />
              </View>

              <View style={styles.logoSide3}>
                <TouchableOpacity
                  // disabled={canPost}
                  onPress={() => canPost ? (Alert.alert('Alert','Please check-in before posting')) : CreatePostFinalStep()}
                  style={styles.NextBtn}>
                  <TextC
                    size={ResponsiveSize(11)}
                    text={'Post'}
                    font={'Montserrat-SemiBold'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {route.params?.isTextOnly == false && (
              <View style={styles.singlePostContainer}>
                {route?.params?.isMultiple == true ? (
                  <Carousel
                    ref={ref}
                    width={windowWidth}
                    height={windowHeight * 0.3}
                    loop={false}
                    autoPlay={false}
                    mode="parallax"
                    modeConfig={{
                      parallaxScrollingScale: 0.9,
                      parallaxScrollingOffset: 50,
                    }}
                    data={route?.params?.post}
                    renderItem={items => {
                      return (
                        <>
                          {items?.item?.type == 'video' ? (
                            <>
                              <Video
                                source={{
                                  uri: 'file://' + items?.item?.originalPath,
                                }}
                                controls={true}
                                ref={videoRef1}
                                style={styles.singlePostInnerCarousel}
                              />
                            </>
                          ) : (
                            <Image
                              ref={CurrentIndex}
                              key={'1'}
                              style={styles.singlePostInnerCarousel}
                              source={{uri: 'file://' + items?.item?.content}}
                            />
                          )}
                        </>
                      );
                    }}
                  />
                ) : (
                  <>
                    {route?.params?.post?.type == 'video' ? (
                      <>
                        {videoLink && (
                          <Video
                            controls={true}
                            source={{
                              uri: 'file://' + videoLink,
                            }}
                            ref={videoRef2}
                            style={styles.singlePostInner}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <Image
                          ref={CurrentIndex}
                          key={'1'}
                          style={styles.singlePostInner}
                          source={{
                            uri: 'file://' + route?.params?.post?.content,
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </View>
            )}
            <View style={styles.descriptionCenter}>
              <TextInput
                placeholder="Write a caption"
                style={
                  route.params?.isTextOnly == true
                    ? styles.TextFeidContainerRightOnlyText
                    : styles.TextFeidContainerRight1
                }
                multiline={true}
                numberOfLines={route.params?.isTextOnly == true ? 6 : 2}
                textAlignVertical="top"
                onChangeText={text => setCaption(text)}
              />
              <View style={styles.TagedPeople}>
                {PostCreationReducer?.searchConnectionData?.map(date => (
                  <View style={styles.tagCapsule}>
                    <TextC
                      text={date?.user_name}
                      font={'Montserrat-Medium'}
                      size={ResponsiveSize(11)}
                      style={{color: global.black}}
                    />
                    <TouchableOpacity
                      onPress={() => excludeConections(date)}
                      style={{marginLeft: ResponsiveSize(5)}}>
                      <Entypo
                        name="cross"
                        color={global.black}
                        size={ResponsiveSize(18)}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('TagPeople')}
              style={styles.SettingList}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AntDesign
                  name="adduser"
                  color={global.primaryColor}
                  size={ResponsiveSize(28)}
                />
                <TextC
                  text={'Tag People'}
                  font={'Montserrat-Medium'}
                  size={ResponsiveSize(12)}
                  style={{
                    color: global?.placeholderColor,
                    marginLeft: ResponsiveSize(5),
                  }}
                />
              </View>
              <View>
                <AntDesign
                  name="right"
                  color={global.primaryColor}
                  size={ResponsiveSize(18)}
                />
              </View>
            </TouchableOpacity>
            <ModalSelector
              style={styles.SettingList}
              data={data}
              onChange={option => {
                setPrivacy(option?.label);
              }}
              selectTextStyle={{color: global.placeholderColor}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AntDesign
                    name="user"
                    color={global.primaryColor}
                    size={ResponsiveSize(28)}
                  />
                  <TextC
                    text={'Audience'}
                    font={'Montserrat-Medium'}
                    size={ResponsiveSize(12)}
                    style={{
                      color: global?.placeholderColor,
                      marginLeft: ResponsiveSize(5),
                    }}
                  />
                </View>
                <View>
                  <TextC
                    text={privacy}
                    font={'Montserrat-Medium'}
                    size={ResponsiveSize(10)}
                    style={{
                      color: global?.placeholderColor,
                      marginLeft: ResponsiveSize(5),
                      backgroundColor: global.description,
                      paddingHorizontal: ResponsiveSize(15),
                      paddingVertical: ResponsiveSize(5),
                      borderRadius: ResponsiveSize(10),
                      overflow: 'hidden',
                    }}
                  />
                </View>
              </View>
            </ModalSelector>
            <TouchableOpacity
              onPress={() => navigation.navigate('PostSetting')}
              style={styles.SettingList}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons
                  name="settings-outline"
                  color={global.primaryColor}
                  size={ResponsiveSize(28)}
                />
                <TextC
                  text={'Advance Settings'}
                  font={'Montserrat-Medium'}
                  size={ResponsiveSize(12)}
                  style={{
                    color: global?.placeholderColor,
                    marginLeft: ResponsiveSize(5),
                  }}
                />
              </View>
              <View>
                <AntDesign
                  name="right"
                  color={global.primaryColor}
                  size={ResponsiveSize(18)}
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

function mapStateToProps({PostCreationReducer}) {
  return {PostCreationReducer};
}
export default connect(mapStateToProps, PostCreationAction)(CreatePostTwo);
