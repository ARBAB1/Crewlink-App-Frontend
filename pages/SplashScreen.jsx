import { StyleSheet, Text, View, Image, ImageBackground, StatusBar, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ResponsiveSize,global } from '../components/constant';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const SplashScreen = () => {
  const navigation = useNavigation()
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('LoginSwitcher');
    }, 1500);
  }, [navigation]);
  return (
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <ImageBackground source={require('../assets/icons/splashScreenBack.png')} style={styles.container}>
        <Image style={styles.ImageCenter} source={require('../assets/icons/splashLoader.png')} />
        <ActivityIndicator color={global.secondaryColor} size={ResponsiveSize(39)} style={{ paddingTop: ResponsiveSize(30) }} />
      </ImageBackground>
    </>

  );
};

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageCenter: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.3,
  }
})