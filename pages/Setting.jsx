import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  useColorScheme,
  Pressable,
  TouchableOpacity,
  Switch,
} from 'react-native';
import TextC from '../components/text/text';
import { ResponsiveSize, global } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, useNavigation } from '@react-navigation/native';
import { baseUrl, apiKey } from '../store/config.json';
import { useToast } from 'react-native-toast-notifications';
import * as UserProfile from '../store/actions/UserProfile/index';
import { connect } from 'react-redux';

const Setting = ({ onLogin, GetUserProfileReducer, GetProfileDataNoReload }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [isEnabled1, setIsEnabled1] = useState(
    GetUserProfileReducer?.data?.isMute == 'Y' ? true : false,
  );
  const toast = useToast();

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(15),
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
    bodyWrapper: {
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(15),
    },
    Head: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: global.description,
      borderBottomWidth: 1,
    },
    IconHead: {
      padding: ResponsiveSize(15),
    },
    InnerContent: {
      paddingHorizontal: ResponsiveSize(45),
    },
    ListWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: ResponsiveSize(15),
    },
    LogoutBtn: {
      backgroundColor: global.primaryColor,
      paddingHorizontal: ResponsiveSize(35),
      paddingVertical: ResponsiveSize(15),
      borderRadius: ResponsiveSize(100),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: ResponsiveSize(15),
    },
    DeleteBtn: {
      backgroundColor: global.red,
      paddingHorizontal: ResponsiveSize(35),
      paddingVertical: ResponsiveSize(15),
      borderRadius: ResponsiveSize(100),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

  const Logout = async () => {
    try {
      await AsyncStorage.removeItem('Token');
      onLogin();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSwitch1 = async () => {
    setIsEnabled1(previousState => !previousState);
    const Token = await AsyncStorage.getItem('Token');
    const response = await fetch(`${baseUrl}/users/is-mute`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        accesstoken: `Bearer ${Token}`,
      },
    });
    const dataRe = await response.json();
    console.log(dataRe)
    if (dataRe.message) {
      toast.show(isEnabled1 ? 'Unmuted' : 'Muted');
      GetProfileDataNoReload()
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={
          scheme === 'dark' ? DarkTheme.colors.background : 'white'
        }
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        style={{
          flexGrow: 1,
          ...(scheme === 'dark'
            ? { backgroundColor: DarkTheme.colors.background }
            : { backgroundColor: 'white' }),
        }}>
        <View style={styles.wrapper}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.logoSide1}>
            <AntDesign
              name="left"
              color={'#05348E'}
              size={ResponsiveSize(18)}
            />
          </Pressable>
          <View style={styles.logoSide2}>
            <TextC
              size={ResponsiveSize(16)}
              font={'Montserrat-Bold'}
              text={'Settings'}
            />
          </View>
          <View style={styles.logoSide3}></View>
        </View>

        <View style={styles.bodyWrapper}>
          <View style={styles.Head}>
            <View style={styles.IconHead}>
              <AntDesign
                name="user"
                size={ResponsiveSize(20)}
                color={global.primaryColor}
              />
            </View>
            <TextC
              size={ResponsiveSize(14)}
              style={{ color: global.secondaryColor }}
              font={'Montserrat-Bold'}
              text={'Account'}
            />
          </View>
          <View style={styles.InnerContent}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.ListWrapper}>
              <TextC text={'Edit Profile'} font={'Montserrat-Medium'} />
              <AntDesign
                name="right"
                size={ResponsiveSize(15)}
                color={global.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePassword')}
              style={styles.ListWrapper}>
              <TextC text={'Change Password'} font={'Montserrat-Medium'} />
              <AntDesign
                name="right"
                size={ResponsiveSize(15)}
                color={global.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangeAirline')}
              style={styles.ListWrapper}>
              <TextC text={'Change Airline'} font={'Montserrat-Medium'} />
              <AntDesign
                name="right"
                size={ResponsiveSize(15)}
                color={global.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListWrapper}
              onPress={() => navigation.navigate('PrivacySetting')}>
              <TextC text={'Account Privacy'} font={'Montserrat-Medium'} />
              <AntDesign
                name="right"
                size={ResponsiveSize(15)}
                color={global.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListWrapper}
              onPress={() => navigation.navigate('BlockPrivacy')}>
              <TextC text={'Blocked Accounts'} font={'Montserrat-Medium'} />
              <AntDesign
                name="right"
                size={ResponsiveSize(15)}
                color={global.primaryColor}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.Head}>
            <View style={styles.IconHead}>
              <AntDesign
                name="bells"
                size={ResponsiveSize(20)}
                color={global.primaryColor}
              />
            </View>
            <TextC
              size={ResponsiveSize(14)}
              style={{ color: global.secondaryColor }}
              font={'Montserrat-Bold'}
              text={'Sound'}
            />
          </View>

          <View style={styles.InnerContent}>
            <View style={styles.ListWrapper}>
              <TextC text={'Mute sound effects'} font={'Montserrat-Medium'} />
              <View>
                <Switch
                  trackColor={{ false: '#767577', true: global.secondaryColor }}
                  thumbColor={isEnabled1 ? 'white' : 'white'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch1}
                  value={isEnabled1}
                />
              </View>
            </View>
            {/* <View style={styles.ListWrapper}>
                            <TextC text={"App Notifications"} font={'Montserrat-Medium'} />
                            <View>
                                <Switch
                                    trackColor={{ false: '#767577', true: global.secondaryColor }}
                                    thumbColor={isEnabled2 ? 'white' : 'white'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch2}
                                    value={isEnabled2}
                                />
                            </View>
                        </View> */}
          </View>
          <View style={{ paddingTop: ResponsiveSize(20) }}>
            <TouchableOpacity
              style={styles.DeleteBtn}
              onPress={() => navigation.navigate('DeleteAccount')}>
              <TextC
                size={ResponsiveSize(14)}
                style={{ color: global.white }}
                font={'Montserrat-Medium'}
                text={'Account Delete'}
              />
              <AntDesign
                name="delete"
                size={ResponsiveSize(16)}
                color={global.white}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={Logout} style={styles.LogoutBtn}>
              <TextC
                size={ResponsiveSize(14)}
                style={{ color: global.white }}
                font={'Montserrat-Medium'}
                text={'Logout'}
              />
              <AntDesign
                name="poweroff"
                size={ResponsiveSize(16)}
                color={global.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function mapStateToProps({ GetUserProfileReducer }) {
  return { GetUserProfileReducer };
}
export default connect(mapStateToProps, UserProfile)(Setting);
