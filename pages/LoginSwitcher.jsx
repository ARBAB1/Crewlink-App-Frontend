import { StyleSheet, Text, View, Image, ImageBackground, StatusBar, Dimensions, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import TextC from '../components/text/text';
import { ResponsiveSize,global } from '../components/constant';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const LoginSwitcher = () => {
  const navigation = useNavigation()
  const sliderWidth = windowWidth * 0.79
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overLayWrapper: {
      width: windowWidth,
      height: "100%",
      position: 'relative',
      backgroundColor: 'rgba(5,52,142,0.1)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    TextWrapper: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    ButtonWrapper: {
      position: 'absolute',
      bottom: 0,
      width: windowWidth,
      paddingBottom: windowHeight * 0.06,
      flexDirection: 'column',
      alignItems: 'center',
    },
    LoginSlider: {
      width: sliderWidth,
      backgroundColor: global.primaryColorDark,
      height: windowHeight * 0.07,
      borderRadius: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
    },
    LoginSliderLeft: {
      width: sliderWidth * 0.5,
      height: windowHeight * 0.07,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

    },
    LoginSliderRight: {
      width: sliderWidth * 0.5,
      height: windowHeight * 0.07,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    LoginSliderAbsolute: {
      width: sliderWidth * 0.5,
      height: windowHeight * 0.07,
      backgroundColor: global.secondaryColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      borderRadius: 50,
    }
  })


  const [currentRoute, setCurrentRoute] = useState("Login")
  const Switcher = (r) => {
    setCurrentRoute(r)
  }

  return (
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <ImageBackground source={require('../assets/icons/welcomeBanner.jpg')} style={styles.container}>
        <View style={styles.overLayWrapper}>
          <View style={styles.TextWrapper}>
            <TextC text={"Social"} font={'Montserrat-ExtraBold'} size={ResponsiveSize(50)} style={{ lineHeight: ResponsiveSize(55), color: global.primaryColor }} />
            <TextC text={"Crew"} font={'Montserrat-ExtraBold'} size={ResponsiveSize(50)} style={{ lineHeight: ResponsiveSize(50), color: global.primaryColor }} />
            <TextC text={"Team."} font={'Montserrat-ExtraBold'} size={ResponsiveSize(50)} style={{ lineHeight: ResponsiveSize(50), color: global.primaryColor }} />
          </View>

          <View style={styles.ButtonWrapper}>
            <View style={{ paddingBottom: ResponsiveSize(30) }} >
            </View>
            <View style={styles.LoginSlider}>
              <TouchableOpacity onPress={() => Switcher('Login')} style={styles.LoginSliderLeft}>
                <TextC size={ResponsiveSize(11)} text={'Login'} style={{ color: global.white }} font={'Montserrat-Bold'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Switcher('SignUp')} style={styles.LoginSliderRight}>
                <TextC size={ResponsiveSize(11)} text={'SignUp'} style={{ color: global.white }} font={'Montserrat-Bold'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                if (currentRoute == 'Login') {
                  navigation.navigate('Login')
                }
                else {
                  navigation.navigate('SignUp')
                }
              }} style={{ ...styles.LoginSliderAbsolute, ...(currentRoute === 'Login' ? { left: 0 } : { right: 0 }) }}>
                <TextC size={ResponsiveSize(11)} text={currentRoute} font={'Montserrat-Bold'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default LoginSwitcher

