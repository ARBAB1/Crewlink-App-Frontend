import { SafeAreaView, StyleSheet, StatusBar, View, Dimensions, Text, ActivityIndicator, Pressable, PermissionsAndroid, ImageBackground } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ButtonC from '../components/button/index';
import AntDedign from "react-native-vector-icons/AntDesign"
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import TextC from '../components/text/text';
import * as ReApplyAction from "../store/actions/ReApplyDoc/index";
import { connect } from "react-redux";
import { ResponsiveSize, global } from '../components/constant';
import InputC from '../components/inputs';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useBottomSheet } from '../components/bottomSheet/BottomSheet';
import Feather from 'react-native-vector-icons/Feather'
import * as Progress from 'react-native-progress';
import SelectC from '../components/select';





const ReApplyDocument = ({ ReApplyDocReducer, getAllAirline }) => {
  const navigation = useNavigation()
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [expiry, setExpiry] = useState(false)
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const [documentImage, setDocumentImage] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [document, setDocument] = useState('')
  const [isImageSave, setIsImageSave] = useState(true)
  const [isImageSaveExist, setIsImageSaveExist] = useState(false)


  const schema = yup.object().shape({
    user_type: yup
      .string()
      .required('Position is required'),
    airline: yup
      .string()
      .required('Air line is required'),
    license_expiry_date: yup
      .string()
      .required('license_expiry_date is required')
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      user_type: '',
      airline: '',
      license_expiry_date: '',
    },

  });

  const onSubmit = async (data) => {
    const sentemailLoad = await sendEmail({
      email: data.email
    })
    if (sentemailLoad.message == "Password reset email sent.") {
      navigation.navigate('Login')
    }
    else {
      // showToast({
      //   title: "Email not found",
      //   message: "Please check your email. and try again.",
      //   iconColor: "red",
      //   iconName: "mail",
      //   bg: "#fff2f2"
      // })
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: global.primaryColor
    },
    bodyWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: ResponsiveSize(15)
    },
    header: {
      paddingTop: windowHeight * 0.06,
      width: windowWidth - ResponsiveSize(30),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    contentWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: windowHeight * 0.1
    },
    centerContentWrapper: {
      paddingVertical: windowHeight * 0.03,
      paddingHorizontal: windowHeight * 0.03
    },
    inputWrapper: {
      paddingHorizontal: ResponsiveSize(20)
    },
    loginBtnWrapper: {
      paddingTop: windowHeight * 0.03,
    },
    gobackBtn: {
      width: windowWidth * 0.08,
      height: windowHeight * 0.04,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    secondInputWrapper: {
      paddingTop: windowHeight * 0.02
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
      alignItems: 'center'
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
      fontFamily: 'Montserrat-Regular'
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
      paddingLeft: ResponsiveSize(5)
    }
  })

  const [allAirLine, setAllAirLine] = useState()

  useEffect(() => {
    LoadAirLine()
    return () => { closeBottomSheet() }
  }, [])
  const LoadAirLine = async () => {
    const loadAllAirLineDetail = await getAllAirline()
    setAllAirLine(loadAllAirLineDetail?.data)
  }


  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleOpenSheet()
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const openPhotoLibrary = async () => {
    setIsImageSave(true)
    const result = await launchImageLibrary();
    if (result?.assets.length > 0) {
      setDocument(result.assets)
      setDocumentImage(result?.assets[0]?.uri)
      setDocumentName(result?.assets[0]?.fileName)
      setTimeout(() => {
        setIsImageSave(false)
      }, 1500);
      closeBottomSheet()
    }
  }
  const openMobileCamera = async () => {
    setIsImageSave(true)
    const result = await launchCamera();
    if (result?.assets.length > 0) {
      setDocument(result.assets)
      setDocumentImage(result?.assets[0]?.uri)
      setDocumentName(result?.assets[0]?.fileName)
      setTimeout(() => {
        setIsImageSave(false)
      }, 1500);
      closeBottomSheet()
    }
  }
  const handleOpenSheet = () => {
    openBottomSheet(
      <>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height:'100%',
            paddingHorizontal: ResponsiveSize(15),
          }}>
          <ButtonC onPress={openMobileCamera} BtnStyle={{ width: windowWidth * 0.45 }} TextStyle={{ color: global.white }} bgColor={global.primaryColor} style={styles.openCamera} title={"Open camera"}></ButtonC>
          <ButtonC onPress={openPhotoLibrary} BtnStyle={{ width: windowWidth * 0.45 }} TextStyle={{ color: global.white }} bgColor={global.primaryColor} style={styles.openLibrary} title={"Open library"}></ButtonC>
        </View>
      </>
      , ["15%"]
    );
  };

  const Positions = [
    { title: 'FLIGHT ATTENDANT', icon: 'emoticon-happy-outline' },
    { title: 'PILOT', icon: 'emoticon-cool-outline' },
    { title: 'TECHNICIAN', icon: 'emoticon-lol-outline' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar backgroundColor={global.primaryColor} />
        <View style={styles.bodyWrapper}>
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <TextC text={"Apply again"} size={ResponsiveSize(22)} style={{ color: global.secondaryColor }} font={'Montserrat-Bold'} />
            </View>

            <View style={styles.centerContentWrapper}>
              <TextC text={"Please fill out details for approval, We will review and approve your submission."} size={ResponsiveSize(12)} style={{ color: global.white, textAlign: 'center' }} font={'Montserrat-Regular'} />
            </View>
          </View>

          <View style={styles.secondInputWrapper}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <SelectC label={"Air line"} data={allAirLine} placeholder={'Select airline'} error={errors?.airline?.message} value={value} onChangeText={onChange} secureTextEntry={false} />
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
              render={({ field: { onChange, value } }) => (
                <SelectC label={"Position"} data={Positions} placeholder={'Select position'} error={errors?.position?.message} value={value} onChangeText={onChange} secureTextEntry={false} />
              )}
              name="position"
            />
          </View>

          <View style={styles.secondInputWrapper}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ paddingHorizontal: ResponsiveSize(12) }}>
                <TextC text={"Employee card Image"} size={ResponsiveSize(11)} font={'Montserrat-Regular'} style={{ color: 'white', paddingBottom: ResponsiveSize(4) }} />
              </View>
              {documentImage == "" ?
                <TouchableOpacity onPress={requestCameraPermission} style={{ ...styles.dateInputSelect, ...(isImageSaveExist === false ? { borderColor: global.white } : { borderColor: 'red' }) }}>
                  <Feather name='upload-cloud' size={ResponsiveSize(50)} color={global.primaryColor} />
                  <TextC text={'Upload employee card Image'} style={{ color: global.primaryColor }} size={ResponsiveSize(11)} font={"Montserrat-Regular"} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={requestCameraPermission} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.dateInputImage}>
                    <ImageBackground src={documentImage} borderRadius={ResponsiveSize(25)} style={styles.dateImageUpload}></ImageBackground>
                    <View style={styles.ImageLoader}>
                      <TextC text={documentName} style={{ color: global.secondaryColor, paddingBottom: ResponsiveSize(5), width: ResponsiveSize(180) }} font={'Montserrat-Medium'} ellipsizeMode={"tail"} numberOfLines={1} />
                      <Progress.Bar progress={10} color={global.secondaryColor} animated={true} indeterminate={isImageSave} indeterminateAnimationDuration={1000} width={ResponsiveSize(180)} />
                    </View>
                  </View>
                </TouchableOpacity>
              }
            </View>
          </View>
          {!documentImage == "" &&
            <View style={styles.secondInputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ paddingHorizontal: ResponsiveSize(12) }}>
                        <TextC text={"Expiry Date"} size={ResponsiveSize(11)} font={'Montserrat-Regular'} style={{ color: 'white', paddingBottom: ResponsiveSize(4) }} />
                      </View>
                      <TouchableOpacity onPress={() => setExpiry(true)} style={{ ...styles.dateInput, ...(errors?.expiryDate?.message === undefined ? { borderColor: global.white } : { borderColor: 'red' }) }}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {(value && value.toLocaleString().split(",")[0]) || "Expiry Date"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DatePicker
                      modal
                      open={expiry}
                      date={new Date()}
                      mode="date"
                      minimumDate={new Date()}
                      onConfirm={(date) => {
                        setExpiry(false)
                        onChange(date)
                      }}
                      onCancel={() => {
                        setExpiry(false)
                      }}
                    />
                  </>
                )}
                name="expiryDate"
              />
            </View>}

          <View style={styles.loginBtnWrapper}>
            <ButtonC title="Apply" disabled={ReApplyDocReducer?.loading} loading={ReApplyDocReducer?.loading} bgColor={global.secondaryColor} TextStyle={{ color: global.primaryColorDark }} onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function mapStateToProps({ ReApplyDocReducer }) {
  return { ReApplyDocReducer };
}
export default connect(mapStateToProps, ReApplyAction)(ReApplyDocument);