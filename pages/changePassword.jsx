import {DarkTheme, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
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
import {global, ResponsiveSize} from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from '../components/text/text';
import TextInputC from '../components/inputs/text';
import ButtonC from '../components/button';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as UserRegisterAction from '../store/actions/UserRegister/index';
import {connect} from 'react-redux';
import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAvoidingView, Platform} from 'react-native';

const ChangePassword = ({changePassword}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const headerHeight = useHeaderHeight();
  const scheme = useColorScheme();
  const navigation = useNavigation();
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
      width: '20%',
    },
    logoSide2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60%',
    },
    logoSide3: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '20%',
    },
    bodyWrapper: {
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(60),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const schema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be 8+ characters.'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Confirm passwords must match'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    const LoadChangePassword = await changePassword({
      old_password: data?.currentPassword,
      new_password: data?.password,
    });
    if (LoadChangePassword == 'Password Changed successfully') {
      // showToast({
      //   message: 'Password changed successfully. Your account is now secure.',
      //   title: 'Password Changed successfully',
      //   iconColor: 'green',
      //   iconName: 'lock',
      //   bg: '#abffdb',
      // });
      setLoading(false);
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    }
    if (LoadChangePassword == 'Old Password is Wrong') {
      // showToast({
      //   message: 'Current password is incorrect. please try again',
      //   title: 'Current password is incorrect',
      //   iconColor: 'red',
      //   iconName: 'lock',
      //   bg: '#fff2f2',
      // });
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flexGrow: 1}}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
      }>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{
            flexGrow: 1,
            ...(scheme === 'dark'
              ? {backgroundColor: DarkTheme.colors.background}
              : {backgroundColor: 'white'}),
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
                size={ResponsiveSize(13)}
                font={'Montserrat-Bold'}
                text={'Change Password'}
              />
            </View>
            <View style={styles.logoSide3}></View>
          </View>

          <View style={styles.bodyWrapper}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <View>
                  <TextInputC
                    disable={loading}
                    error={errors?.currentPassword?.message}
                    onChangeText={onChange}
                    placeholder={'Current Password'}
                    secureTextEntry={true}
                  />
                  {errors?.currentPassword?.message !== undefined && (
                    <TextC
                      text={errors?.currentPassword?.message}
                      size={ResponsiveSize(10)}
                      style={{
                        color: global.red,
                        marginTop: ResponsiveSize(2),
                        marginLeft: ResponsiveSize(10),
                      }}
                    />
                  )}
                </View>
              )}
              name="currentPassword"
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <View>
                  <TextInputC
                    disable={loading}
                    error={errors?.password?.message}
                    onChangeText={onChange}
                    placeholder={'New Password'}
                    secureTextEntry={true}
                  />
                  {errors?.password?.message !== undefined && (
                    <TextC
                      text={errors?.password?.message}
                      size={ResponsiveSize(10)}
                      style={{
                        color: global.red,
                        marginTop: ResponsiveSize(2),
                        marginLeft: ResponsiveSize(10),
                      }}
                    />
                  )}
                </View>
              )}
              name="password"
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <View>
                  <TextInputC
                    disable={loading}
                    error={errors?.confirmPassword?.message}
                    onChangeText={onChange}
                    placeholder={'Confirm Password'}
                    secureTextEntry={true}
                  />
                  {errors?.confirmPassword?.message !== undefined && (
                    <TextC
                      text={errors?.confirmPassword?.message}
                      size={ResponsiveSize(10)}
                      style={{
                        color: global.red,
                        marginTop: ResponsiveSize(2),
                        marginLeft: ResponsiveSize(10),
                      }}
                    />
                  )}
                </View>
              )}
              name="confirmPassword"
            />

            <ButtonC
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              title={'Submit'}
              bgColor={global.secondaryColor}
              BtnStyle={{marginTop: ResponsiveSize(15)}}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({RegisterUserReducer}) {
  return {RegisterUserReducer};
}
export default connect(mapStateToProps, UserRegisterAction)(ChangePassword);
