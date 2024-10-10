import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  Touchable,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../pages/HomeScreen';
import EventScreen from '../pages/EventScreen';
import CreatePost from '../pages/CreatePost';
import ReelScreen from '../pages/Announcement';
import ProfileScreen from '../pages/ProfileScreen';
import SignUp from '../pages/SignUp';
import Otp from '../pages/Otp';
import CheckIn from '../pages/CheckIn';
import CheckInDetail from '../pages/CheckInDetail';
import ResetPassword from '../pages/ResetPassword';
import PasswordChanged from '../pages/PasswordChanged';
import Login from '../pages/Login';
import SplashScreen from '../pages/SplashScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainHeader from '../components/mainHeader';
import CreatePostHeader from '../components/mainHeader/createPostHeader';
import EventHeader from '../components/mainHeader/event';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme,Linking,AppState } from 'react-native';


import {
  ProfileStackNavigation,
  EventStackNavigation,
  PostStackNavigation,
  HomeStackNavigation,
  GroupStackNavigation,
} from './StackNavigation';
import LoginSwitcher from '../pages/LoginSwitcher';
import { ResponsiveSize, global } from '../components/constant';
import SignUpSecondStep from '../pages/SignUpSecondStep';
import ReApplyDocument from '../pages/ReApplyDocument';
import Approval from '../pages/Approval';
import * as UserProfile from '../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import AddEvent from '../pages/AddEvent';
import PostDetail from '../pages/PostDetail';
import NotPostDetail from '../pages/NotPostDetail';
const MainNavigation = ({ GetUserProfileReducer  }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const scheme = useColorScheme();
  useEffect(() => {
    VerifyToken();
  
  }, []);

 



  const linking = {
    prefixes: ['crewlink://'],  // Same as the URL scheme defined in Xcode
    config: {
      screens: {
        Home: {
          screens: {
            HomeScreen: 'HomeScreen',
            PostDetail: 'PostDetail/:content_id/:content_type',         
            InAppCheckIn: 'InAppCheckIn',
            SearchUser: 'SearchUser',
            MessageList: 'MessageList',
            Status: 'Status',
            Message: 'Message/:receiverUserId',   //notification_type = "message" url=crewlink://message/id
            MediaDetail: 'MediaDetail',
            NewMessage: 'NewMessage',
            newGroup: 'newGroup',
            NewGroupSecondScreen: 'NewGroupSecondScreen',
            GroupMessage: 'GroupMessage',
            messageMedia: 'messageMedia',
            GroupmessageMedia: 'GroupmessageMedia',
            Notification: 'Notification',
          }
        },
        Event: {
          screens: {
            EventScreen: 'EventScreen',
            NotPostDetail: 'NotPostDetail/:content_id/:content_type',
            AddEvent: 'AddEvent',
            EventDetail: 'EventDetail',
            UpdateEvent: 'UpdateEvent',
          }
        },
        Profile: {
          screens: {
            ProfileMain: 'ProfileMain',
            EditProfile: 'EditProfile',
            Setting: 'Setting',
            ChangePassword: 'ChangePassword',
            ChangeAirline: 'ChangeAirline',
            MyPost: 'MyPost',
            Connection: 'Connection',
            UserProfileScreen: 'UserProfileScreen',
            DeleteAccount: 'DeleteAccount',
            PrivacySetting: 'PrivacySetting',
          }
        },
        CreatePost: {
          screens: {
            CreatePost: 'CreatePost',
            CreatePostTwo: 'CreatePostTwo',
            TagPeople: 'TagPeople',
            PostSetting: 'PostSetting',
          }
        },
        Reel: {
          screens: {
            announcement: 'announcement',
            createAnnouncement: 'createAnnouncement',
            announcementDetail: 'announcementDetail/:announcement_id',
          }
        },
      }
    }
  };
  const VerifyToken = async () => {
    try {
      const value = await AsyncStorage.getItem('Token');
      if (value !== null) {
        setIsLoggedIn(true);
        await notifee.requestPermission();
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      setIsLoggedIn(false);
    }

  };

  const styles = StyleSheet.create({
    centerTab: {
      height: ResponsiveSize(55),
      width: ResponsiveSize(55),
      borderRadius: 70,
      backgroundColor: global.primaryColor,
      marginBottom: ResponsiveSize(25),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });



  return (
    <NavigationContainer linking={linking}>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: '#69BE25',
              borderTopLeftRadius: ResponsiveSize(20),
              borderTopRightRadius: ResponsiveSize(20),
            },
            tabBarHideOnKeyboard: true,
          })}>
          <Tab.Screen
            name="Home"
            component={HomeStackNavigation}
            options={{
              navigationBarColor: '#69BE25',
              tabBarIcon: ({ color, size, focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={
                      !focused
                        ? require('../assets/icons/homeTab/tabHomeLight.png')
                        : require('../assets/icons/homeTab/tabHomeFill.png')
                    }
                    style={{
                      width: ResponsiveSize(25),
                      height: ResponsiveSize(20),
                      objectFit: 'contain',
                    }}
                  />
                </View>
              ),
              tabBarShowLabel: false,
              headerShown: false,
            }}
          />

          <Tab.Screen
            name="Event"
            component={EventStackNavigation}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={
                      !focused
                        ? require('../assets/icons/homeTab/tabEventLight.png')
                        : require('../assets/icons/homeTab/tabEventFill.png')
                    }
                    style={{
                      width: ResponsiveSize(25),
                      height: ResponsiveSize(20),
                      objectFit: 'contain',
                    }}
                  />
                </View>
              ),
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />

          <Tab.Screen
            name="CreatePost"
            component={PostStackNavigation}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <View style={styles.centerTab}>
                  <Image
                    source={require('../assets/icons/homeTab/centerTab.png')}
                    style={{
                      width: ResponsiveSize(25),
                      height: ResponsiveSize(20),
                      objectFit: 'contain',
                    }}
                  />
                </View>
              ),
              tabBarStyle: { display: 'none' },
              headerShown: false,
              tabBarShowLabel: false,
              headerStyle: {
                ...(scheme === 'dark'
                  ? { backgroundColor: DarkTheme.colors.background }
                  : { backgroundColor: 'white' }),
              },
            }}
          />
          <Tab.Screen
            name="Reel"
            component={GroupStackNavigation}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Image
                  source={
                    !focused
                      ? require('../assets/icons/homeTab/tabChatLight.png')
                      : require('../assets/icons/homeTab/tabChatFill.png')
                  }
                  style={{
                    width: ResponsiveSize(25),
                    height: ResponsiveSize(20),
                    objectFit: 'contain',
                  }}
                />
              ),
              tabBarShowLabel: false,
              headerShown: false,
              headerStyle: {
                ...(scheme === 'dark'
                  ? { backgroundColor: DarkTheme.colors.background }
                  : { backgroundColor: 'white' }),
              },
            }}
          />
          {/* <Tab.Screen name="Profile" component={ProfileStackNavigation}  {...props} onLogin={() => setIsLoggedIn(false)} options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Image source={GetUserProfileReducer?.data?.profile_picture_url == "" ? require('../assets/icons/avatar.png') : { uri: GetUserProfileReducer?.data?.profile_picture_url }} style={{ width: ResponsiveSize(30), height: ResponsiveSize(30), objectFit: 'cover', overflow: "hidden", borderRadius: ResponsiveSize(30) }} />
            ),
            headerShown: false,
            tabBarShowLabel: false,
            headerStyle: {
              ...(scheme === 'dark' ? { backgroundColor: DarkTheme.colors.background } : { backgroundColor: "white" }),
            }
          }} /> */}
          <Tab.Screen
            name="Profile"
            component={props => (
              <ProfileStackNavigation
                {...props}
                onLogin={() => setIsLoggedIn(false)}
              />
            )}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <>
                  {GetUserProfileReducer?.loading ? (
                    <ActivityIndicator
                      size="small"
                      color={global.primaryColor}
                    />
                  ) : (
                    <FastImage
                      source={
                        GetUserProfileReducer?.data?.profile_picture_url === ''
                          ? require('../assets/icons/avatar.png')
                          : {
                            uri: GetUserProfileReducer?.data?.profile_picture_url,
                            priority: FastImage.priority.high,
                          }
                      }
                      style={{
                        width: ResponsiveSize(30),
                        height: ResponsiveSize(30),
                        objectFit: 'cover',
                        overflow: 'hidden',
                        borderRadius: ResponsiveSize(30),
                      }}
                    />
                  )}
                </>
              ),
              headerShown: false,
              tabBarShowLabel: false,
              headerStyle: {
                ...(scheme === 'dark'
                  ? { backgroundColor: DarkTheme.colors.background }
                  : { backgroundColor: 'white' }),
              },
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="SplashScreen"
            component={SplashScreen}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="LoginSwitcher"
            component={LoginSwitcher}
          />

          <Stack.Screen options={{ navigationBarHidden: true }} name="Login">
            {props => <Login {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen options={{ navigationBarHidden: true }} name="CheckIn">
            {props => (
              <CheckIn {...props} onLogin={() => setIsLoggedIn(true)} />
            )}
          </Stack.Screen>
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="CheckInDetail">
            {props => (
              <CheckInDetail {...props} onLogin={() => setIsLoggedIn(true)} />
            )}
          </Stack.Screen>
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="SignUp"
            component={SignUp}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="SignUpSecond"
            component={SignUpSecondStep}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="Reapply"
            component={ReApplyDocument}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="Approval"
            component={Approval}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="Otp"
            component={Otp}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="ResetPassword"
            component={ResetPassword}
          />
          <Stack.Screen
            options={{ navigationBarHidden: true }}
            name="PasswordChanged"
            component={PasswordChanged}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

function mapStateToProps({ GetUserProfileReducer }) {
  return { GetUserProfileReducer };
}
export default connect(mapStateToProps, UserProfile)(MainNavigation);
const styles = StyleSheet.create({});
