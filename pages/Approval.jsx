import { SafeAreaView, StyleSheet, StatusBar, View, Dimensions, Linking } from 'react-native'
import React, { useState } from 'react'
import { ResponsiveSize, global } from '../components/constant';
import TextC from '../components/text/text';
import { Button } from 'react-native-elements';
import ButtonC from '../components/button';
import { useNavigation } from '@react-navigation/native';

const Approval = ({ route }) => {
  const { status } = route.params;
  const windowWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: global.primaryColor
    },
    bodyWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ResponsiveSize(15),
      flex: 1
    },
  })
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={global.primaryColor} />
      <View style={styles.bodyWrapper}>
        <TextC size={ResponsiveSize(30)} font={"Montserrat-Bold"} text={status == "IN_REVIEW" ? "Your application is under review" : status == "REJECTED" ? "Your application is Rejected" : ""} style={{ color: global.secondaryColor, textAlign: 'center' }} />
        {status == "IN_REVIEW" ?
          <View style={{ width: windowWidth * 0.8, paddingTop: ResponsiveSize(6) }}>
            <TextC size={ResponsiveSize(11)} font={"Montserrat-Regular"} text={"Your application has been submitted & will be reviewed by out team. You will be notified if any extra information is needed"} style={{ color: global.white, textAlign: 'center' }} />
          </View> :
          <View style={{ width: windowWidth * 0.8, paddingTop: ResponsiveSize(6) }}>
            <TextC size={ResponsiveSize(11)} font={"Montserrat-Regular"} text={"We regret to inform you that your application has not been successful on this occasion. We appreciate your interest and thank you for applying."} style={{ color: global.white, textAlign: 'center' }} />
          </View>
        }
        {status == "IN_REVIEW" ?
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(18) }}>
            <ButtonC bgColor={global.secondaryColor} title={"Contact Us"} onPress={() => Linking.openURL(`tel:${'00000000000'}`)} />
          </View> :
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(18) }}>
            <ButtonC bgColor={global.secondaryColor} title={"Apply again"} onPress={() => navigation.navigate('Reapply')} />
          </View>
        }
      </View>
    </SafeAreaView>
  )
}


export default Approval