import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  PermissionsAndroid,
  ImageBackground,
  ActivityIndicator,
  Pressable,
  useColorScheme,
  TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { ResponsiveSize, global } from '../components/constant';
import TextC from '../components/text/text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as UserProfile from '../store/actions/UserProfile/index';
import { connect } from 'react-redux';
import PhoneInput from 'react-native-phone-number-input';
import DatePicker from 'react-native-date-picker';
import ModalSelector from 'react-native-modal-selector';
import { useBottomSheet } from '../components/bottomSheet/BottomSheet';
import ButtonC from '../components/button';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';


const EditProfile = ({
  GetUserProfileReducer,
  UpdateProfileData,
  GetProfileData,
  UpdateProfile,
  getAllCountries
}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [dialCode, setDialCode] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [documentImage, setDocumentImage] = useState('');
  const [document, setDocument] = useState('');
  const headerHeight = useHeaderHeight();

  const data = [
    { key: 1, label: 'Male' },
    { key: 2, label: 'Female' },
  ];

  useEffect(() => {
    if (GetUserProfileReducer?.data) {
      reset({
        name: GetUserProfileReducer?.data?.user_name,
        phone: GetUserProfileReducer?.data?.phone_number,
        gender: GetUserProfileReducer?.data?.gender,
        dob: GetUserProfileReducer?.data?.date_of_birth,
        description: GetUserProfileReducer?.data?.bio,
      });
      setDialCode(GetUserProfileReducer?.data?.country_code);
    }
    return () => {
      closeBottomSheet();
    };
  }, []);


  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      gender: '',
      dob: '',
      description: '',
    },
  });
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
    NextBtn: {
      backgroundColor: global.secondaryColor,
      width: ResponsiveSize(80),
      paddingVertical: ResponsiveSize(10),
      borderRadius: ResponsiveSize(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    bodyWrapper: {
      paddingHorizontal: ResponsiveSize(15),
    },
    updateImage: {
      paddingVertical: ResponsiveSize(30),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ProfileImage: {
      height: ResponsiveSize(70),
      width: ResponsiveSize(70),
      borderRadius: ResponsiveSize(70),
      backgroundColor: global.description,
    },
    bodyInitial: {
      paddingHorizontal: ResponsiveSize(15),
      borderTopWidth: 1,
      borderTopColor: global.description,
      paddingBottom: ResponsiveSize(30),
    },
    TextFeidContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    TextFeidContainer1: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    TextFeidContainerLeft: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: windowWidth * 0.3,
      height: windowHeight * 0.07,
    },
    TextFeidContainerRight: {
      borderBottomWidth: 1,
      borderBottomColor: global.description,
      color: global.placeholderColor,
      paddingHorizontal: ResponsiveSize(15),
      width: windowWidth * 0.6,
      fontFamily: 'Montserrat-Medium',
      height: windowHeight * 0.07,
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: ResponsiveSize(12),
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderRadius: 0,
    },
    TextFeidContainerRight1: {
      borderBottomWidth: 1,
      borderBottomColor: global.description,
      paddingHorizontal: ResponsiveSize(15),
      width: windowWidth * 0.6,
      fontFamily: 'Montserrat-Medium',
      color: global.placeholderColor,
      fontSize: ResponsiveSize(12),
      minHeight: windowHeight * 0.07,
      paddingTop: ResponsiveSize(15),
      textAlignVertical: 'top'
    },
    modalTopLayer: {
      paddingBottom: ResponsiveSize(20),
      paddingTop: ResponsiveSize(10),
      width: windowWidth * 0.9,
      position: 'absolute',
      backgroundColor: 'white',
      top: windowHeight * 0.3,
      borderRadius: ResponsiveSize(10),
      overflow: 'hidden',
      zIndex: 999,
      paddingHorizontal: ResponsiveSize(10),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    IndicatorDot: {
      position: 'absolute',
      height: ResponsiveSize(10),
      width: ResponsiveSize(10),
      borderRadius: ResponsiveSize(10),
      backgroundColor: global.secondaryColor,
      top: ResponsiveSize(-4),
      right: ResponsiveSize(8)
    },
    AirlineLayer: {
      height: windowHeight * 0.5,
      paddingBottom: ResponsiveSize(20),
      paddingTop: ResponsiveSize(10),
      width: windowWidth * 0.9,
      position: 'absolute',
      backgroundColor: 'white',
      top: windowHeight * 0.3,
      borderRadius: ResponsiveSize(10),
      overflow: 'hidden',
      zIndex: 999,
      paddingHorizontal: ResponsiveSize(10),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    AirlineBoundries: {
      height: windowHeight * 0.4,
      width: '100%',
      overflow: 'hidden',
      paddingBottom: ResponsiveSize(5)
    },
    ModalSearchBar: {
      backgroundColor: "#EEEEEE",
      width: '100%',
      fontFamily: 'Montserrat-Medium',
      paddingHorizontal: ResponsiveSize(10),
      paddingVertical: ResponsiveSize(5),
      borderRadius: ResponsiveSize(10),
      marginBottom: ResponsiveSize(10)
    },
    CountryModalLayers: {
      maxHeight: windowHeight * 0.7,
      paddingBottom: ResponsiveSize(20),
      paddingTop: ResponsiveSize(10),
      width: windowWidth * 0.9,
      position: 'absolute',
      backgroundColor: 'white',
      top: windowHeight * 0.2,
      borderRadius: ResponsiveSize(10),
      overflow: 'hidden',
      zIndex: 999,
      paddingHorizontal: ResponsiveSize(10),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    SelectOptions: {
      backgroundColor: '#EEEEEE',
      width: "100%",
      paddingHorizontal: ResponsiveSize(10),
      padding: ResponsiveSize(5),
      borderRadius: ResponsiveSize(10),
      marginTop: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: ResponsiveSize(10)
    },
  });
  const [country, setCountry] = useState([])

  const onSubmit = async data => {
    console.log(data, "data")
    setLoading(true);
    if (documentImage) {
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: document[0]?.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      const LoadUpdateImage = await UpdateProfile(formData);
      console.log(LoadUpdateImage
        , "LoadUpdateImage")
    }
    const LoadUpdate = await UpdateProfileData({
      user_name: data.name,
      phone_number: data.phone,
      gender: data.gender,
      date_of_birth: data.dob,
      bio: data.description,
      country_code: dialCode,
      home_base: country.length > 0 ? country[0] : ""
    });
    console.log(LoadUpdate, "LoadUpdate")
    if (LoadUpdate?.message == 'User profile updated successfully') {
      // showToast({
      //   message: 'User profile updated successfully',
      //   title: 'Profile updated',
      //   iconColor: 'green',
      //   iconName: 'lock',
      //   bg: '#abffdb',
      // });
      navigation.navigate('ProfileMain');
      GetProfileData();
    } else if (LoadUpdate?.message !== 'User profile updated successfully') {
      // showToast({
      //   message: 'Something went wrong. please try again',
      //   title: 'Something went wrong',
      //   iconColor: 'red',
      //   iconName: 'lock',
      //   bg: '#fff2f2',
      // });
    }
    setLoading(false);
  };

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const handleOpenSheet = () => {
    openBottomSheet(
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            paddingHorizontal: ResponsiveSize(15),
          }}>
          <ButtonC
            onPress={openMobileCamera}
            BtnStyle={{ width: windowWidth * 0.45 }}
            TextStyle={{ color: global.white }}
            bgColor={global.primaryColor}
            style={styles.openCamera}
            title={'Open camera'}></ButtonC>
          <ButtonC
            onPress={openPhotoLibrary}
            BtnStyle={{ width: windowWidth * 0.45 }}
            TextStyle={{ color: global.white }}
            bgColor={global.primaryColor}
            style={styles.openLibrary}
            title={'Open library'}></ButtonC>
        </View>
      </>,
      ['15%'],
    );
  };
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
    const result = await launchImageLibrary();
    if (result?.assets.length > 0) {
      setDocument(result.assets);
      setDocumentImage(result?.assets[0]?.uri);
      closeBottomSheet();
    }
  };
  const openMobileCamera = async () => {
    const result = await launchCamera();
    if (result?.assets.length > 0) {
      setDocument(result.assets);
      setDocumentImage(result?.assets[0]?.uri);
      closeBottomSheet();
    }
  };
  const [isCountryVisible, setCountryVisible] = useState(false);
  const [allCountriesData, setAllCountriesData] = useState();
  const [SearchCountry, setSearchCountry] = useState("");


  const AddCountry = async (e) => {
    setCountry([e]);
  }
  const LoadCountry = async () => {
    const loadAllCountriesDetail = await getAllCountries();
    setAllCountriesData(loadAllCountriesDetail);
    // console.log(loadAllCountriesDetail, "loadAllCountriesDetail")
  };


  useEffect(() => {
    LoadCountry();
  }, [])

  const ClearCountry = () => {
    setCountry("")
  }

  console.log(GetUserProfileReducer?.data,"aaaa")
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flexGrow: 1 }}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
      }>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          backgroundColor={'white'}
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
                size={ResponsiveSize(12)}
                font={'Montserrat-Bold'}
                text={'Update Profile'}
              />
            </View>
            <View style={styles.logoSide3}>
              <TouchableOpacity
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
                style={styles.NextBtn}>
                {loading == true ? (
                  <ActivityIndicator
                    size={ResponsiveSize(12)}
                    color={global.white}
                  />
                ) : (
                  <TextC
                    size={ResponsiveSize(11)}
                    text={'Update'}
                    font={'Montserrat-SemiBold'}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bodyWrapper}>
            <View style={styles.updateImage}>
              {documentImage !== '' ? (
                <FastImage
                  style={styles.ProfileImage}
                  source={
                    documentImage == ''
                      ? require('../assets/icons/avatar.png')
                      : {
                        uri: documentImage,
                        priority: FastImage.priority.high,
                      }
                  }
                />
              ) : (
                <FastImage
                  style={styles.ProfileImage}
                  source={
                    GetUserProfileReducer?.data?.profile_picture_url == ''
                      ? require('../assets/icons/avatar.png')
                      : {
                        uri: GetUserProfileReducer?.data?.profile_picture_url,
                        priority: FastImage.priority.high,
                      }
                  }
                />
              )}
              <TouchableOpacity
                onPress={requestCameraPermission}
                style={{ paddingTop: ResponsiveSize(10) }}>
                <TextC
                  size={ResponsiveSize(11)}
                  style={{ color: global.secondaryColor }}
                  text={'Update Profile Picture'}
                  font={'Montserrat-Bold'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bodyInitial}>
            <View style={styles.TextFeidContainer}>
              <View style={styles.TextFeidContainerLeft}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextC
                    size={ResponsiveSize(12)}
                    text={'Name'}
                    font={'Montserrat-Bold'}
                  />
                  {errors?.name?.message !== undefined && (
                    <TextC
                      size={ResponsiveSize(12)}
                      text={'*'}
                      font={'Montserrat-Medium'}
                      style={{ color: global.red, marginLeft: ResponsiveSize(5) }}
                    />
                  )}
                </View>
              </View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Name"
                    onChangeText={onChange}
                    value={value}
                    style={styles.TextFeidContainerRight}
                  />
                )}
                name="name"
              />
            </View>
            <View style={styles.TextFeidContainer}>
              <View style={styles.TextFeidContainerLeft}>
                <TextC
                  size={ResponsiveSize(12)}
                  text={'Phone'}
                  font={'Montserrat-Bold'}
                />
              </View>
              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <PhoneInput
                      containerStyle={{
                        borderBottomWidth: 1,
                        borderBottomColor: global.description,
                        width: windowWidth * 0.6,
                      }}
                      flagButtonStyle={{
                        height: windowHeight * 0.07,
                        width: ResponsiveSize(45),
                      }}
                      textContainerStyle={{
                        padding: 0,
                        height: windowHeight * 0.07,
                        backgroundColor: 'white',
                        paddingHorizontal: 0,
                      }}
                      codeTextStyle={{ display: 'none' }}
                      textInputStyle={{
                        height: windowHeight * 0.07,
                        fontFamily: 'Montserrat-Medium',
                        fontSize: ResponsiveSize(12),
                        color: global.placeholderColor,
                      }}
                      disableArrowIcon={true}
                      defaultCode={
                        GetUserProfileReducer?.data?.country_code 
                          ? GetUserProfileReducer?.data?.country_code
                          : 'US'
                      }
                      defaultValue={GetUserProfileReducer?.data?.phone_number || ''}
                      onChangeText={text => {
                        onChange(text);
                      }}
                      onChangeCountry={text => {
                        setDialCode(text.cca2);
                      }}
                    />
                  );
                }}
                name="phone"
              />
            </View>
            <View style={styles.TextFeidContainer}>
              <View style={styles.TextFeidContainerLeft}>
                <TextC
                  size={ResponsiveSize(12)}
                  text={'Gender'}
                  font={'Montserrat-Bold'}
                />
              </View>
              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => (
                  <ModalSelector
                    selectStyle={styles.TextFeidContainerRight}
                    data={data}
                    initValue={
                      GetUserProfileReducer?.data?.gender || 'Select gender'
                    }
                    onChange={option => {
                      onChange(option?.label);
                    }}
                    selectTextStyle={{ color: global.placeholderColor }}
                  />
                )}
                name="gender"
              />
            </View>
            <View style={styles.TextFeidContainer}>
              <View style={styles.TextFeidContainerLeft}>
                <TextC
                  size={ResponsiveSize(12)}
                  text={'Date of birth'}
                  font={'Montserrat-Bold'}
                />
              </View>
              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => {
                  const DateInitial = new Date(value).toDateString();
                  const timeDivide = DateInitial?.split(' ');
                  const DateValue = `${timeDivide[1]} ${timeDivide[2]} ${timeDivide[3]}`;
                  const valueTime = new Date(
                    GetUserProfileReducer?.data?.date_of_birth,
                  );
                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => setDob(true)}
                        style={styles.TextFeidContainerRight}>
                        <TextC
                          size={ResponsiveSize(12)}
                          style={{ color: global.placeholderColor }}
                          text={DateValue}
                          font={'Montserrat-Medium'}
                        />
                      </TouchableOpacity>
                      <DatePicker
                        modal
                        open={dob}
                        date={valueTime}
                        mode="date"
                        onConfirm={date => {
                          setDob(false);
                          onChange(date);
                        }}
                        onCancel={() => {
                          setDob(false);
                        }}
                      />
                    </>
                  );
                }}
                name="dob"
              />
            </View>

            <View style={styles.TextFeidContainer}>
              <View style={styles.TextFeidContainerLeft}>
                <TextC
                  size={ResponsiveSize(12)}
                  text={'Country'}
                  font={'Montserrat-Bold'}
                />
              </View>
              <TouchableOpacity
                onPress={() => setCountryVisible(true)}
                style={styles.TextFeidContainerRight}>
                {country.length > 0 && country ?
                  <TextC
                    size={ResponsiveSize(12)}
                    style={{ color: global.placeholderColor }}
                    text={country[0]}
                    font={'Montserrat-Medium'}
                  />
                  :
                  <TextC
                    size={ResponsiveSize(12)}
                    style={{ color: global.description }}
                    text={"Select Country"}
                    font={'Montserrat-Medium'}
                  />
                }

              </TouchableOpacity>
            </View>
            <View style={styles.TextFeidContainer1}>
              <View style={styles.TextFeidContainerLeft}>
                <TextC
                  size={ResponsiveSize(12)}
                  text={'Description'}
                  font={'Montserrat-Bold'}
                />
              </View>
              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Description"
                    onChangeText={onChange}
                    value={value}
                    style={styles.TextFeidContainerRight1}
                    multiline={true}
                    numberOfLines={5}
                    placeholderTextColor={global.description}
                  />
                )}
                name="description"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Country */}
      <Modal
        isVisible={isCountryVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => {
          setSearchCountry("")
          setCountryVisible(false)
        }}
        statusBarTranslucent={false}>
        <View style={styles.CountryModalLayers}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(10), width: '100%' }}>
            <TextC text={"Country"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
            <TouchableOpacity onPress={() => ClearCountry()} style={{ padding: ResponsiveSize(5) }}>
              <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
            </TouchableOpacity>
          </View>

          <TextInput value={SearchCountry} onChangeText={(e) => setSearchCountry(e)} placeholder='Search Country' style={styles.ModalSearchBar} />
          <ScrollView style={styles.AirlineBoundries} showsVerticalScrollIndicator={false}>
            {allCountriesData?.filter(item => item?.country_name?.toLowerCase().includes(SearchCountry.toLowerCase())).map(AirLine =>
              <TouchableOpacity onPress={() => AddCountry(AirLine?.country_name)} style={styles.SelectOptions}>
                <TextC
                  key={AirLine?.country_name}
                  size={ResponsiveSize(12)}
                  font={'Montserrat-Regular'}
                  text={AirLine?.country_name}
                  style={{ color: global.black }}
                />

                {country == AirLine?.country_name && (
                  <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* Country */}
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({ GetUserProfileReducer }) {
  return { GetUserProfileReducer };
}
export default connect(mapStateToProps, UserProfile)(EditProfile);