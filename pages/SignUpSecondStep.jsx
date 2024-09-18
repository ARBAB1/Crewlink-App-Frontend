import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Modal,
  Text,
  Pressable,
  Dimensions,
  PermissionsAndroid,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ButtonC from '../components/button/index';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AntDedign from 'react-native-vector-icons/AntDesign';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import * as UserRegisterAction from '../store/actions/UserRegister/index';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextC from '../components/text/text';
import {ResponsiveSize, global} from '../components/constant';
import {useToast} from '../components/Toast/ToastContext';
import DatePicker from 'react-native-date-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useBottomSheet} from '../components/bottomSheet/BottomSheet';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAvoidingView, Platform} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUp = ({insertUser, RegisterUserReducer, getAllAirline, route}) => {
  const {userName, airline, position, email, password} = route.params;
  const {showToast} = useToast();
  const navigation = useNavigation();
  const [dob, setDob] = useState(false);
  const [expiry, setExpiry] = useState(false);
  const {openBottomSheet, closeBottomSheet} = useBottomSheet();
  const [documentImage, setDocumentImage] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [document, setDocument] = useState('');
  const [isImageSave, setIsImageSave] = useState(true);
  const [isImageSaveExist, setIsImageSaveExist] = useState(false);

  const schema = yup.object().shape({
    dob: yup.string().required('Date of birth is required'),
    expiryDate: yup.string().required('Expiry date is required'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dob: '',
      expiryDate: '',
    },
  });
  const onSubmit = async data => {
    if (!documentImage == '') {
      try {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.setItem('email', email);
        const formData = new FormData();
        formData.append('user_name', userName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('user_type', position);
        formData.append('airline', airline?.toString());
        formData.append('date_of_birth', data?.dob);
        formData.append('license_expiry_date', data?.expiryDate);
        if (document[0]?.uri) {
          formData.append('employee_card', {
            uri: document[0]?.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });
        }
        const Responce = await insertUser(formData);
        if (Responce == 'Signup successfull') {
          navigation.navigate('Otp');
        } else if (Responce == 'Email already exists') {
          showToast({
            title: 'Email already exists',
            message: 'Email already exists.Please try again.',
            iconColor: 'red',
            iconName: 'mail',
            bg: '#fff2f2',
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

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
      paddingTop: ResponsiveSize(15),
      paddingBottom: ResponsiveSize(8),
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
    dateInput: {
      fontSize: ResponsiveSize(12),
      paddingHorizontal: global.inputPaddingH,
      backgroundColor: '#FFFFFF',
      width: global.inputWidth,
      fontFamily: 'Montserrat-Regular',
      height: global.inputHeight,
      color: global.black,
      borderRadius: ResponsiveSize(30),
      borderWidth: ResponsiveSize(1),
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateInputSelect: {
      fontSize: ResponsiveSize(12),
      paddingHorizontal: global.inputPaddingH,
      backgroundColor: '#FFFFFF',
      width: global.inputWidth,
      fontFamily: 'Montserrat-Regular',
      height: ResponsiveSize(180),
      color: global.black,
      borderRadius: ResponsiveSize(30),
      borderWidth: ResponsiveSize(1),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: ResponsiveSize(12),
      fontWeight: '500',
      fontFamily: 'Montserrat-Regular',
    },
    dateInputImage: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: ResponsiveSize(12),
      paddingHorizontal: ResponsiveSize(5),
      backgroundColor: '#FFFFFF',
      width: global.inputWidth,
      fontFamily: 'Montserrat-Regular',
      height: ResponsiveSize(70),
      color: global.black,
      borderRadius: ResponsiveSize(30),
      borderWidth: 0,
    },
    dateImageUpload: {
      height: ResponsiveSize(60),
      width: ResponsiveSize(70),
    },
    ImageLoader: {
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: ResponsiveSize(5),
    },
  });
  const requestCameraPermission = async () => {
    try {
      const granted =
        Platform.OS === 'android'
          ? await request(PERMISSIONS.ANDROID.CAMERA)
          : await request(PERMISSIONS.IOS.CAMERA);
      handleOpenSheet();
    } catch (err) {
      console.warn(err);
    }
  };
  const openPhotoLibrary = async () => {
    setIsImageSave(true);
    const result = await launchImageLibrary();
    if (result?.assets.length > 0) {
      setDocument(result.assets);
      setDocumentImage(result?.assets[0]?.uri);
      setDocumentName(result?.assets[0]?.fileName);
      setTimeout(() => {
        setIsImageSave(false);
      }, 1500);
      closeBottomSheet();
    }
  };
  const openMobileCamera = async () => {
    setIsImageSave(true);
    const result = await launchCamera();
    if (result?.assets.length > 0) {
      setDocument(result.assets);
      setDocumentImage(result?.assets[0]?.uri);
      setDocumentName(result?.assets[0]?.fileName);
      setTimeout(() => {
        setIsImageSave(false);
      }, 1500);
      closeBottomSheet();
    }
  };
  const handleOpenSheet = () => {
    openBottomSheet(
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(15),
          }}>
          <ButtonC
            onPress={openMobileCamera}
            BtnStyle={{width: windowWidth * 0.45}}
            TextStyle={{color: global.white}}
            bgColor={global.primaryColor}
            style={styles.openCamera}
            title={'Open camera'}></ButtonC>
          <ButtonC
            onPress={openPhotoLibrary}
            BtnStyle={{width: windowWidth * 0.45}}
            TextStyle={{color: global.white}}
            bgColor={global.primaryColor}
            style={styles.openLibrary}
            title={'Open library'}></ButtonC>
        </View>
      </>,
      ['15%'],
    );
  };
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flexGrow: 1}}
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
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleTextFirst}>
                Just, <Text style={styles.titleTextSecond}>few</Text>
              </Text>
              <Text style={styles.titleTextSecond}>step more</Text>
            </View>
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <>
                    <View style={{flexDirection: 'column'}}>
                      <View style={{paddingHorizontal: ResponsiveSize(12)}}>
                        <TextC
                          text={'Date of birth'}
                          size={ResponsiveSize(11)}
                          font={'Montserrat-Regular'}
                          style={{
                            color: 'white',
                            paddingBottom: ResponsiveSize(4),
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setDob(true)}
                        style={{
                          ...styles.dateInput,
                          ...(errors?.dob?.message === undefined
                            ? {borderColor: global.white}
                            : {borderColor: 'red'}),
                        }}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {(value && value.toLocaleString().split(',')[0]) ||
                            'Date of birth'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DatePicker
                      modal
                      open={dob}
                      date={new Date()}
                      mode="date"
                      maximumDate={new Date()}
                      onConfirm={date => {
                        setDob(false);
                        onChange(date);
                      }}
                      onCancel={() => {
                        setDob(false);
                      }}
                    />
                  </>
                )}
                name="dob"
              />
            </View>

            <View style={styles.secondInputWrapper}>
              <View style={{flexDirection: 'column'}}>
                <View style={{paddingHorizontal: ResponsiveSize(12)}}>
                  <TextC
                    text={'Employee card Image'}
                    size={ResponsiveSize(11)}
                    font={'Montserrat-Regular'}
                    style={{color: 'white', paddingBottom: ResponsiveSize(4)}}
                  />
                </View>
                {documentImage == '' ? (
                  <TouchableOpacity
                    onPress={requestCameraPermission}
                    style={{
                      ...styles.dateInputSelect,
                      ...(isImageSaveExist === false
                        ? {borderColor: global.white}
                        : {borderColor: 'red'}),
                    }}>
                    <Feather
                      name="upload-cloud"
                      size={ResponsiveSize(50)}
                      color={global.primaryColor}
                    />
                    <TextC
                      text={'Upload employee card Image'}
                      style={{color: global.primaryColor}}
                      size={ResponsiveSize(11)}
                      font={'Montserrat-Regular'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={requestCameraPermission}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.dateInputImage}>
                      <ImageBackground
                        src={documentImage}
                        borderRadius={ResponsiveSize(25)}
                        style={styles.dateImageUpload}></ImageBackground>
                      <View style={styles.ImageLoader}>
                        <TextC
                          text={documentName}
                          style={{
                            color: global.secondaryColor,
                            paddingBottom: ResponsiveSize(5),
                            width: ResponsiveSize(180),
                          }}
                          font={'Montserrat-Medium'}
                          ellipsizeMode={'tail'}
                          numberOfLines={1}
                        />
                        <Progress.Bar
                          progress={10}
                          color={global.secondaryColor}
                          animated={true}
                          indeterminate={isImageSave}
                          indeterminateAnimationDuration={1000}
                          width={ResponsiveSize(180)}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {!documentImage == '' && (
              <View style={styles.secondInputWrapper}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({field: {onChange, value}}) => (
                    <>
                      <View style={{flexDirection: 'column'}}>
                        <View style={{paddingHorizontal: ResponsiveSize(12)}}>
                          <TextC
                            text={'Expiry Date'}
                            size={ResponsiveSize(11)}
                            font={'Montserrat-Regular'}
                            style={{
                              color: 'white',
                              paddingBottom: ResponsiveSize(4),
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => setExpiry(true)}
                          style={{
                            ...styles.dateInput,
                            ...(errors?.expiryDate?.message === undefined
                              ? {borderColor: global.white}
                              : {borderColor: 'red'}),
                          }}>
                          <Text style={styles.dropdownButtonTxtStyle}>
                            {(value && value.toLocaleString().split(',')[0]) ||
                              'Expiry Date'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <DatePicker
                        modal
                        open={expiry}
                        date={new Date()}
                        mode="date"
                        minimumDate={new Date()}
                        onConfirm={date => {
                          setExpiry(false);
                          onChange(date);
                        }}
                        onCancel={() => {
                          setExpiry(false);
                        }}
                      />
                    </>
                  )}
                  name="expiryDate"
                />
              </View>
            )}

            <View style={styles.submitBtnWrapper}>
              <ButtonC
                title="Sign Up"
                bgColor={global.secondaryColor}
                disabled={RegisterUserReducer?.loading}
                loading={RegisterUserReducer?.loading}
                TextStyle={{color: global.primaryColorDark}}
                onPress={handleSubmit(onSubmit)}
                onpress2={() =>
                  !documentImage == ''
                    ? setIsImageSaveExist(false)
                    : setIsImageSaveExist(true)
                }
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
