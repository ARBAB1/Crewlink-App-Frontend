import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Modal,
  Text,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import InputC from '../components/inputs/index';
import ButtonC from '../components/button/index';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AntDedign from 'react-native-vector-icons/AntDesign';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {CheckBox} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import SelectC from '../components/select';
import * as UserRegisterAction from '../store/actions/UserRegister/index';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextC from '../components/text/text';
import {ResponsiveSize, global} from '../components/constant';
import { useHeaderHeight } from "@react-navigation/elements";



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUp = ({insertUser, RegisterUserReducer, getAllAirline}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [allAirLine, setAllAirLine] = useState();
  useEffect(() => {
    LoadAirLine();
  }, []);
  const LoadAirLine = async () => {
    const loadAllAirLineDetail = await getAllAirline();
    setAllAirLine(loadAllAirLineDetail?.data);
  };
  const schema = yup.object().shape({
    userName: yup.string().required('User name is required'),
    airline: yup.number().required('Air line is required'),
    position: yup.string().required('Position is required'),
    email: yup.string().required('Email is required').email('Invalid email'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be 8+ characters.'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    termsOfService: yup
      .boolean()
      .oneOf([true], 'Accept terms & privacy policy.')
      .required()
      .default(false),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userName: '',
      airline: '',
      position: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsOfService: false,
    },
  });
  const onSubmit = data => {
    navigation.navigate('SignUpSecond', data);
  };
  const Positions = [
    {title: 'FLIGHT ATTENDANT', icon: 'emoticon-happy-outline'},
    {title: 'PILOT', icon: 'emoticon-cool-outline'},
    {title: 'TECHNICIAN', icon: 'emoticon-lol-outline'},
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: global.primaryColor,
    },
    bodyWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: ResponsiveSize(15),
    },
    header: {
      paddingTop: windowHeight * 0.06,
      width: windowWidth - ResponsiveSize(30),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleWrapper: {
      width: windowWidth - ResponsiveSize(30),
      paddingTop: windowHeight * 0.05,
    },
    titleTextFirst: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: ResponsiveSize(50),
      color: global.white,
      lineHeight: ResponsiveSize(50),
    },
    titleTextSecond: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: ResponsiveSize(50),
      color: global.secondaryColor,
      lineHeight: ResponsiveSize(50),
    },
    secondInputWrapper: {
      paddingTop: windowHeight * 0.02,
    },
    termsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    haveAccoundWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: windowHeight * 0.01,
      paddingBottom: windowHeight * 0.05,
    },
    submitBtnWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: ResponsiveSize(8),
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: windowWidth * 0.8,
      height: windowHeight * 0.56,
      backgroundColor: '#7891C2',
      borderRadius: ResponsiveSize(20),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(20),
    },
    modalTextHeading: {
      fontFamily: 'Montserrat-Bold',
      fontSize: ResponsiveSize(13),
      color: global.white,
    },
  });
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flexGrow:1}}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
      }>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <StatusBar backgroundColor={global.primaryColor} />
          <View style={styles.bodyWrapper}>
            <View style={styles.header}>
              <Pressable onPress={navigation.goBack}>
                <AntDedign
                  name="left"
                  size={ResponsiveSize(20)}
                  color={global.secondaryColor}
                />
              </Pressable>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <AntDedign
                  name="infocirlceo"
                  size={ResponsiveSize(20)}
                  color={global.secondaryColor}
                />
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                presentationStyle={'overFullScreen'}
                statusBarTranslucent={true}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View
                      style={{
                        paddingBottom: ResponsiveSize(15),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AntDedign
                          name="infocirlceo"
                          size={ResponsiveSize(12)}
                          color={global.white}
                        />
                        <TextC
                          size={ResponsiveSize(18)}
                          text={'Form Info'}
                          style={{color: global.white, marginLeft: 5}}
                          font={'Montserrat-Bold'}
                        />
                      </View>
                      <Pressable onPress={() => setModalVisible(!modalVisible)}>
                        <AntDedign
                          name="close"
                          size={ResponsiveSize(22)}
                          color={global.white}
                        />
                      </Pressable>
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'User name'}
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'user name is required.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'Air line'}
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'air line is required.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'Position'}
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'position is required.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'Email'}
                        sty
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'email is required.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'Email'}
                        sty
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'Email is required.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'Password'}
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'Password must be 8+ characters.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>

                    <View style={{paddingBottom: ResponsiveSize(15)}}>
                      <TextC
                        text={'Terms & privacy'}
                        size={ResponsiveSize(11)}
                        style={{color: global.white}}
                        font={'Montserrat-Bold'}
                      />
                      <TextC
                        size={ResponsiveSize(12)}
                        text={'Accept terms & privacy policy.'}
                        style={{color: global.white}}
                        font={'Montserrat-Regular'}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleTextFirst}>
                Let's, <Text style={styles.titleTextSecond}>get</Text>
              </Text>
              <Text style={styles.titleTextSecond}>started</Text>
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <InputC
                    label={'User name'}
                    max={20}
                    error={errors?.userName?.message}
                    value={value}
                    onChangeText={onChange}
                    placeholder={'User name'}
                    secureTextEntry={false}
                  />
                )}
                name="userName"
              />
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <SelectC
                    label={'Air line'}
                    data={allAirLine}
                    placeholder={'Select airline'}
                    error={errors?.airline?.message}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={false}
                  />
                )}
                name="airline"
              />
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <SelectC
                    label={'Position'}
                    data={Positions}
                    placeholder={'Select position'}
                    error={errors?.position?.message}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={false}
                  />
                )}
                name="position"
              />
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <InputC
                    label={'Email'}
                    error={errors?.email?.message}
                    value={value}
                    onChangeText={onChange}
                    placeholder={'Your email'}
                    secureTextEntry={false}
                  />
                )}
                name="email"
              />
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <InputC
                    label={'Password'}
                    error={errors?.password?.message}
                    value={value}
                    onChangeText={onChange}
                    placeholder={'Your password'}
                    secureTextEntry={true}
                  />
                )}
                name="password"
              />
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <InputC
                    label={'Confirm password'}
                    error={errors?.confirmPassword?.message}
                    value={value}
                    onChangeText={onChange}
                    placeholder={'Repeat password'}
                    secureTextEntry={true}
                  />
                )}
                name="confirmPassword"
              />
            </View>
            <View style={styles.termsWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: ResponsiveSize(8),
                    }}>
                    <CheckBox
                      containerStyle={{
                        backgroundColor: 'transparent',
                        margin: 0,
                        padding: 0,
                      }}
                      checked={value}
                      size={ResponsiveSize(16)}
                      checkedColor={global.white}
                      onPress={() => onChange(!value)}
                    />
                    <TextC
                      text={'I accept the terms and privacy policy'}
                      style={{
                        color:
                          errors?.termsOfService?.message == undefined
                            ? global.white
                            : 'red',
                      }}
                      font={'Montserrat-Light'}
                      size={ResponsiveSize(11)}
                    />
                  </View>
                )}
                name="termsOfService"
              />
            </View>
            <View style={styles.submitBtnWrapper}>
              <ButtonC
                title="Contiue"
                bgColor={global.secondaryColor}
                disabled={RegisterUserReducer?.loading}
                loading={RegisterUserReducer?.loading}
                TextStyle={{color: global.primaryColorDark}}
                onPress={handleSubmit(onSubmit)}
              />
            </View>

            <View style={styles.haveAccoundWrapper}>
              <TextC
                text={'Already have an account?'}
                style={{color: global.white}}
                size={ResponsiveSize(11)}
                font={'Montserrat-Regular'}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <TextC
                  text={'Login'}
                  style={{
                    color: global.secondaryColor,
                    marginLeft: ResponsiveSize(5),
                  }}
                  size={ResponsiveSize(11)}
                  font={'Montserrat-Bold'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({RegisterUserReducer}) {
  return {RegisterUserReducer};
}
export default connect(mapStateToProps, UserRegisterAction)(SignUp);
