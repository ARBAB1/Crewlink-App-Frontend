import {
  Dimensions,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import TextC from '../components/text/text';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {global, ResponsiveSize} from '../components/constant';
import ReadMore from '@fawazahmed/react-native-read-more';
import * as UserProfile from '../store/actions/UserProfile/index';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

const ProfileScreen = ({GetUserProfileReducer, GetProfileData}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: global.white,
    },
    ProfileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(15),
    },
    ProfileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: ResponsiveSize(15),
    },
    ProfileImage: {
      height: ResponsiveSize(70),
      width: ResponsiveSize(70),
      borderRadius: ResponsiveSize(70),
    },
    ProfileImageMain: {
      height: '100%',
      width: '100%',
      borderRadius: ResponsiveSize(70),
      borderWidth: 1,
      borderColor: global.description,
    },
    profileImageWrapper: {
      width: '25%',
    },
    ProfilePostInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      width: '75%',
      position: 'relative',
      paddingBottom: 15,
    },
    ProfilePostInfoInnerCard: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '33.33%',
      height: 80,
      borderRadius: 20,
    },

    ProfilePostInfoInnerCard1: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '20%',
      height: 80,
      borderRadius: 20,
    },
    ProfileTitleDescription: {
      paddingHorizontal: ResponsiveSize(15),
    },
    ProfileSettingBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(15),
    },
    SetttingBtn: {
      backgroundColor: '#05348E',
      width: '32%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      borderRadius: 20,
    },
    SetttingBtnText: {
      color: 'white',
      fontFamily: 'Montserrat-Medium',
      fontSize: 12,
    },
    CollapseSlider: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopColor: '',
    },
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
      paddingTop: ResponsiveSize(15),
    },
    box: {
      height: ResponsiveSize(90),
      width: '25%',
      borderWidth: 1,
      borderColor: global.description,
    },
    DescriptionStyle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: ResponsiveSize(10),
      marginTop: ResponsiveSize(5),
      color: global.primaryColor,
    },
    AirlineTag: {
      backgroundColor: '#EEEEEE',
      borderRadius: ResponsiveSize(20),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: ResponsiveSize(8),
      paddingVertical: ResponsiveSize(5),
      marginLeft: ResponsiveSize(5),
    },
    CountryModalLayers: {
      height: windowWidth * 0.6,
      width: windowWidth * 0.6,
      top: windowHeight * 0.3,
      left: windowWidth * 0.2 - ResponsiveSize(20),
      position: 'absolute',
      borderRadius: windowWidth * 0.4,
      overflow: 'hidden',
      zIndex: 999,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetProfileData();
  }, []);

  const [viewProfile, setViewProfile] = useState(false);

  console.log(GetUserProfileReducer?.data, 'lastcheckin');
  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        {GetUserProfileReducer?.loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={global.primaryColor} />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{flexGrow: 1}}>
            <View style={styles.ProfileHeader}>
              <View style={{width: 25}}></View>
              <View>
                <TextC
                  font={'Montserrat-Bold'}
                  text={GetUserProfileReducer?.data?.user_name}
                  size={ResponsiveSize(14)}
                />
              </View>
              <TouchableOpacity>
                <Entypo name="menu" size={26} color={global.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.ProfileInfo}>
              <View style={styles.profileImageWrapper}>
                <TouchableOpacity
                  style={styles.ProfileImage}
                  onPress={() => setViewProfile(true)}>
                  <FastImage
                    source={
                      GetUserProfileReducer?.data?.profile_picture_url == ''
                        ? require('../assets/icons/avatar.png')
                        : {
                            uri: GetUserProfileReducer?.data
                              ?.profile_picture_url,
                            priority: FastImage.priority.high,
                          }
                    }
                    style={styles.ProfileImageMain}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ProfilePostInfo}>
                <View style={styles.ProfilePostInfoInnerCard1}>
                  <TextC
                    text={GetUserProfileReducer?.data?.post_count || 0}
                    font={'Montserrat-SemiBold'}
                    size={ResponsiveSize(20)}
                    style={{color: '#69BE25'}}
                  />
                  <TextC
                    text={'Posts'}
                    font={'Montserrat-SemiBold'}
                    size={ResponsiveSize(12)}
                  />
                </View>

                <View style={styles.ProfilePostInfoInnerCard}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => navigation.navigate('Connection')}>
                    <TextC
                      text={GetUserProfileReducer?.data?.connection_count || 0}
                      font={'Montserrat-SemiBold'}
                      size={ResponsiveSize(20)}
                      style={{color: '#69BE25'}}
                    />
                    <TextC
                      text={'Connects'}
                      font={'Montserrat-SemiBold'}
                      size={ResponsiveSize(12)}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.ProfilePostInfoInnerCard}>
                  <MaterialCommunityIcons
                    name="timer-sand"
                    size={ResponsiveSize(20)}
                    color={'#69BE25'}
                  />
                  <TextC
                    text={
                      GetUserProfileReducer?.data?.last_checkin ==
                        'No last check-in available' &&
                      GetUserProfileReducer?.data?.last_checkin == undefined &&
                      GetUserProfileReducer?.data?.last_checkin == null &&
                      GetUserProfileReducer?.data?.last_checkin == ''
                        ? 'No Check-in'
                        : GetUserProfileReducer?.data?.last_checkin
                    }
                    font={'Montserrat-SemiBold'}
                    size={ResponsiveSize(12)}
                    style={{width: '100%', textAlign: 'center'}}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                  />
                </View>
              </View>
            </View>

            <View style={styles.ProfileTitleDescription}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextC
                  font={'Montserrat-SemiBold'}
                  text={GetUserProfileReducer?.data?.user_name}
                  size={ResponsiveSize(15)}
                />
                {GetUserProfileReducer?.data?.airline && (
                  <View style={styles.AirlineTag}>
                    <TextC
                      font={'Montserrat-SemiBold'}
                      text={GetUserProfileReducer?.data?.airline}
                      size={ResponsiveSize(10)}
                      style={{color: global.primaryColor}}
                    />
                  </View>
                )}
              </View>
              {GetUserProfileReducer?.data?.bio && (
                <ReadMore
                  seeLessStyle={{
                    fontFamily: 'Montserrat-Bold',
                    color: global.primaryColor,
                  }}
                  seeMoreStyle={{
                    fontFamily: 'Montserrat-Bold',
                    color: global.primaryColor,
                  }}
                  numberOfLines={3}
                  style={styles.DescriptionStyle}>
                  {GetUserProfileReducer?.data?.bio}
                </ReadMore>
              )}
            </View>

            <View style={styles.ProfileSettingBtn}>
              <TouchableOpacity
                style={styles.SetttingBtn}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.SetttingBtnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.SetttingBtn}
                onPress={() => navigation.navigate('Suggestion')}>
                <Text style={styles.SetttingBtnText}>Suggestions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Setting')}
                style={styles.SetttingBtn}>
                <Text style={styles.SetttingBtnText}>Setting</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{flexGrow: 1}}>
              <View style={styles.wrapper}>
                {GetUserProfileReducer?.data?.posts !== undefined &&
                GetUserProfileReducer?.data?.posts !== null &&
                GetUserProfileReducer?.data?.posts !== '' &&
                GetUserProfileReducer?.data?.posts?.length > 0 ? (
                  GetUserProfileReducer?.data?.posts.map(userPosts => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('PostDetail', {
                          content_id: userPosts?.parent_id,
                        })
                      }
                      key={userPosts?.parent_id}
                      style={styles.box}>
                      <FastImage
                        style={{
                          resizeMode: 'cover',
                          height: '100%',
                          width: '100%',
                        }}
                        source={{
                          uri: userPosts?.attachment_thumbnail_url,
                          priority: FastImage.priority.high,
                        }}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    style={{
                      paddingTop: ResponsiveSize(80),
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: windowWidth,
                      borderTopColor: global.description,
                      borderTopWidth: 1,
                    }}>
                    <TextC
                      text={'No Post Available Yet'}
                      font={'Montserrat-Bold'}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#05348E',
                        width: ResponsiveSize(150),
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: ResponsiveSize(10),
                        borderRadius: ResponsiveSize(30),
                        marginTop: ResponsiveSize(10),
                      }}
                      onPress={() => navigation.navigate('CreatePost')}>
                      <TextC
                        text={'Start Your First Post'}
                        font={'Montserrat-Medium'}
                        size={ResponsiveSize(11)}
                        style={{color: 'white'}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </SafeAreaView>
      <Modal
        isVisible={viewProfile}
        style={{margin: 0, paddingHorizontal: windowWidth * 0.05}}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setViewProfile(false)}
        statusBarTranslucent={false}>
        <FastImage
          source={
            GetUserProfileReducer?.data?.profile_picture_url == ''
              ? require('../assets/icons/avatar.png')
              : {
                  uri: GetUserProfileReducer?.data?.profile_picture_url,
                  priority: FastImage.priority.high,
                }
          }
          style={styles.CountryModalLayers}
        />
      </Modal>
    </>
  );
};

function mapStateToProps({GetUserProfileReducer}) {
  return {GetUserProfileReducer};
}
export default connect(mapStateToProps, UserProfile)(ProfileScreen);
