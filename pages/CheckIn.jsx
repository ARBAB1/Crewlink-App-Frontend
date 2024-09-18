import { SafeAreaView, StyleSheet, StatusBar, View, Text, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ButtonC from '../components/button/index';
import AntDedign from "react-native-vector-icons/AntDesign"
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponsiveSize } from '../components/constant';
import TextC from '../components/text/text';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;




const CheckIn = ({ onLogin }) => {
  const [userName, setUserName] = useState()
  useEffect(() => {
    LoadName()
  })
  const LoadName = async () => {
    const value = await AsyncStorage.getItem('UserName');
    setUserName(value)
  }
  const navigation = useNavigation()
  const homeWithoutCheckIn = () => {
    onLogin()
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#05348E'
    },
    bodyWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: ResponsiveSize(15),
      position: 'relative',
      flex: 1
    },
    header: {
      paddingTop: windowHeight * 0.06,
      width: windowWidth - ResponsiveSize(30)
    },
    titleWrapper: {
      width: windowWidth - ResponsiveSize(30),
      paddingVertical: windowHeight * 0.05
    },
    titleTextFirst: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: ResponsiveSize(45),
      color: 'white',
      lineHeight: ResponsiveSize(45)
    },
    titleTextSecond: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: ResponsiveSize(45),
      color: '#69BE25',
      width: windowWidth * 0.6,
      lineHeight: ResponsiveSize(50)
    },
    contentWrapper: {
      paddingVertical: 70,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    CheckInHeading: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: ResponsiveSize(18),
      color: 'white',
      paddingBottom: ResponsiveSize(10)
    },
    haveAccoundWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: windowHeight * 0.015,
      paddingHorizontal: ResponsiveSize(30),
      position: 'absolute',
      bottom: ResponsiveSize(30)
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar backgroundColor={'#05348E'} />
        <View style={styles.bodyWrapper}>
          <View style={styles.header}>
            <Pressable style={styles.gobackBtn} onPress={navigation.goBack}>
              <AntDedign name='left' size={ResponsiveSize(20)} color={'#69BE25'} />
            </Pressable>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleTextFirst}>Welcome,</Text>
            <Text style={styles.titleTextSecond} ellipsizeMode={"tail"} numberOfLines={1}>{userName}</Text>
          </View>
          <View style={styles.contentWrapper}>
            <TextC text={'Would you like to check in ?'} style={{ color: 'white', textAlign: 'center' }} size={ResponsiveSize(18)} font={"Montserrat-SemiBold"} />
            <View style={{ paddingVertical: ResponsiveSize(20) }}>
              <ButtonC title="Yes" bgColor={'#69BE25'} TextStyle={{ color: '#002245' }} onPress={() => navigation.navigate('CheckInDetail')} />
            </View>
            <ButtonC title="No" bgColor={'#002245'} TextStyle={{ color: 'white' }} onPress={() => homeWithoutCheckIn()} />
          </View>
          <View style={styles.haveAccoundWrapper}>
            <TextC text={'Your CheckIn preference can be changed at any time in Settings.'} style={{ color: 'white', textAlign: 'center' }} size={ResponsiveSize(11)} font={"Montserrat-Regular"} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}

export default CheckIn