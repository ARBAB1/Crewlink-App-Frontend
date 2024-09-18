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
import React, { useEffect, useState } from 'react';
import TextC from '../components/text/text';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { global, ResponsiveSize } from '../components/constant';
import ReadMore from '@fawazahmed/react-native-read-more';
import * as UserProfile from '../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import baseUrl from '../store/config.json';


const UserProfileScreen = ({ GetUserProfileReducer, route, LoadUserProfile }) => {
  console.log(route?.params?.user_id)
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
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
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(8),
      borderRadius: ResponsiveSize(20),
    },
    SetttingBtn1: {
      backgroundColor: '#05348E',
      width: "50%",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(8),
      borderRadius: ResponsiveSize(20),
    },
    SetttingBtnDisconnect: {
      backgroundColor: global.red,
      width: "48%",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(8),
      borderRadius: ResponsiveSize(20),
    },
    SetttingBtnText: {
      color: 'white',
      fontFamily: 'Montserrat-Medium',
      fontSize: ResponsiveSize(12),
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
  });

  const LoadProfile = async () => {
    setLoading(true)
    const result = await LoadUserProfile(route?.params?.user_id)
    setUserProfile(result?.data)
    setLoading(false)
  }

  useEffect(() => {
    LoadProfile()
  }, [])


  const ConnectUser = async (e) => {
    setConnectLoading(true)
    const Token = await AsyncStorage.getItem('Token');
    const response = await fetch(
      `${baseUrl.baseUrl}/connect/request-connection`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': baseUrl.apiKey,
          accesstoken: `Bearer ${Token}`,
        },
        body: JSON.stringify({ user_id: e }),
      },
    );
    const result = await response.json();
    if (result.statusCode === 200) {
      setConnectLoading(false)
      navigation.navigate('Home')
    };
  }

  const RemoveConnectUser = async (e) => {
    setConnectLoading(true)
    const Token = await AsyncStorage.getItem('Token');
    const response = await fetch(
      `${baseUrl.baseUrl}/connect/remove-connection/${e}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': baseUrl.apiKey,
          accesstoken: `Bearer ${Token}`,
        },
      },
    );
    const result = await response.json();
    if (result.statusCode === 200) {
      setConnectLoading(false)
      navigation.navigate('Home')
    };
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    LoadProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={global.primaryColor} />
        </View>
      ) : (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={{ flexGrow: 1 }}>
          <View style={styles.ProfileHeader}>
            <View style={{ width: 25 }}></View>
            <View>
              <TextC
                font={'Montserrat-Bold'}
                text={userProfile?.user_name}
                size={ResponsiveSize(14)}
              />
            </View>
            <TouchableOpacity>
              <Entypo name="menu" size={26} color={'#05348E'} />
            </TouchableOpacity>
          </View>

          <View style={styles.ProfileInfo}>
            <View style={styles.profileImageWrapper}>
              <View style={styles.ProfileImage}>
                <FastImage
                  style={styles.ProfileImageMain}
                  source={
                    userProfile?.profile_picture_url == ''
                      ? require('../assets/icons/avatar.png')
                      : { uri: userProfile?.profile_picture_url, priority: FastImage.priority.high }
                  }
                />
              </View>
            </View>
            <View style={styles.ProfilePostInfo}>
              <View style={styles.ProfilePostInfoInnerCard1}>
                <TextC
                  text={userProfile?.post_count || 0}
                  font={'Montserrat-SemiBold'}
                  size={ResponsiveSize(20)}
                  style={{ color: '#69BE25' }}
                />
                <TextC
                  text={'Posts'}
                  font={'Montserrat-SemiBold'}
                  size={ResponsiveSize(12)}
                />
              </View>

              <View style={styles.ProfilePostInfoInnerCard}>
                {/* <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('Connection')}> */}
                <TextC
                  text={userProfile?.connection_count || 0}
                  font={'Montserrat-SemiBold'}
                  size={ResponsiveSize(20)}
                  style={{ color: '#69BE25' }}
                />
                <TextC
                  text={'Connects'}
                  font={'Montserrat-SemiBold'}
                  size={ResponsiveSize(12)}
                />
                {/* </TouchableOpacity> */}
              </View>

              <View style={styles.ProfilePostInfoInnerCard}>
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={ResponsiveSize(20)}
                  color={'#69BE25'}
                />
                <TextC
                  text={
                    userProfile?.last_checkin ==
                      'No last check-in available'
                      ? 'No Check-in'
                      : userProfile?.last_checkin
                  }
                  font={'Montserrat-SemiBold'}
                  size={ResponsiveSize(12)}
                  style={{ width: '100%', textAlign: 'center' }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
                />
              </View>
            </View>
          </View>

          <View style={styles.ProfileTitleDescription}>
            <TextC
              font={'Montserrat-SemiBold'}
              text={userProfile?.user_name}
              size={16}
            />
            {userProfile?.bio && (
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
                {userProfile?.bio}
              </ReadMore>
            )}
          </View>
          {userProfile?.myConnection ?
            <View style={styles.ProfileSettingBtn}>
              <TouchableOpacity
                onPress={() => RemoveConnectUser(route?.params?.user_id)}
                style={styles.SetttingBtnDisconnect}>
                {connectLoading ?
                  <ActivityIndicator size="small" color={global.white} />
                  :
                  <Text style={styles.SetttingBtnText}>Connect</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.SetttingBtn1}
                onPress={() => navigation.navigate('Message', {
                  receiverUserId: route?.params?.user_id,
                  profile_picture_url: userProfile?.profile_picture_url,
                  user_name: userProfile?.user_name
                })}
              >
                <Text style={styles.SetttingBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.ProfileSettingBtn}>
              <TouchableOpacity
                style={styles.SetttingBtn}
                onPress={() => ConnectUser(route?.params?.user_id)}>
                {connectLoading ?
                  <ActivityIndicator size="small" color={global.white} />
                  :
                  <Text style={styles.SetttingBtnText}>Connect</Text>
                }
              </TouchableOpacity>
            </View>
          }

          <ScrollView style={{ flexGrow: 1 }}>
            <View style={styles.wrapper}>
              {userProfile?.posts !== undefined &&
                userProfile?.posts !== null &&
                userProfile?.posts !== '' &&
                userProfile?.posts?.length > 0 ? (
                userProfile?.posts.map(userPosts => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MyPost', { user_id: route?.params?.user_id })}
                    key={userPosts?.parent_id}
                    style={styles.box}>
                    <Image
                      style={{
                        resizeMode: 'cover',
                        height: '100%',
                        width: '100%',
                      }}
                      source={{ uri: userPosts?.attachment_thumbnail_url }}
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
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

function mapStateToProps({ GetUserProfileReducer }) {
  return { GetUserProfileReducer };
}
export default connect(mapStateToProps, UserProfile)(UserProfileScreen);
