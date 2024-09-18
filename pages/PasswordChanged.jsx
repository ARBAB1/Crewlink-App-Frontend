import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  Text,
} from 'react-native';
import React from 'react';
import InputC from '../components/inputs/index';
import ButtonC from '../components/button/index';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AntDedign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {CheckBox} from '@rneui/themed';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAvoidingView, Platform} from 'react-native';

const PasswordChanged = () => {
  const headerHeight = useHeaderHeight();

  const navigation = useNavigation();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#05348E',
    },
    ResetPasswordTop: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 35,
      color: '#69BE25',
    },
    ResetPasswordSecond: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 16,
      color: 'white',
      textAlign: 'center',
      paddingBottom: 15,
      paddingTop: 10,
    },
    titleWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flexGrow: 1}}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
      }>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'#05348E'} />
        <View style={styles.titleWrapper}>
          <Text style={styles.ResetPasswordTop}>Reset password</Text>
          <Text style={styles.ResetPasswordSecond}>
            Please type something{'\n'}you’ll remember
          </Text>
          <View style={{}}>
            <ButtonC
              title="Back to login"
              bgColor={'#69BE25'}
              TextStyle={{color: '#002245'}}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PasswordChanged;
