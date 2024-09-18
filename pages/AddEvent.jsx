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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from '../components/text/text';
import TextInputC from '../components/inputs/text';
import {Calendar} from 'react-native-calendars';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';
import {ResponsiveSize, global} from '../components/constant';
import * as AllEventAction from '../store/actions/Events/index';
import {connect} from 'react-redux';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useBottomSheet} from '../components/bottomSheet/BottomSheet';
import ButtonC from '../components/button';
import {useToast} from '../components/Toast/ToastContext';
import {useSWRConfig} from 'swr';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAvoidingView, Platform} from 'react-native';

const AddEvent = ({
  AllEventReducer,
  CreateEvent,
  getMyEvents,
  getJoinedEvents,
  getAllEvents,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const scheme = useColorScheme();
  const {openBottomSheet, closeBottomSheet} = useBottomSheet();
  const [isImageSave, setIsImageSave] = useState(true);
  const [documentImage, setDocumentImage] = useState('');
  const [document, setDocument] = useState('');

    useEffect(()=>{
      return ()=>{closeBottomSheet()}
    },[])
  const handleOpenSheet = () => {
    openBottomSheet(
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height:'100%',
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
      setTimeout(() => {
        setIsImageSave(false);
      }, 1500);
      closeBottomSheet();
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: global.white,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(15),
      backgroundColor:
        scheme === 'dark' ? DarkTheme.colors.background : global.white,
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
    StartDateWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(10),
    },
    EndDateWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(10),
    },
    InputTimeStyle: {
      width: ResponsiveSize(100),
      height: ResponsiveSize(40),
      backgroundColor: '#EEEEEE',
      marginTop: ResponsiveSize(10),
      borderRadius: ResponsiveSize(30),
      paddingHorizontal: ResponsiveSize(15),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: global.description,
    },
    ImageGroup: {
      width: windowWidth - ResponsiveSize(30),
      height: ResponsiveSize(100),
      backgroundColor: '#EEEEEE',
      marginBottom: ResponsiveSize(100),
      borderRadius: ResponsiveSize(20),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: global.description,
    },
    ImageGroupInner: {
      width: windowWidth - ResponsiveSize(30),
      height: ResponsiveSize(100),
      borderWidth: 1,
      borderColor: global.description,
    },
  });

  const today = new Date();
  const [selected, setSelected] = useState(today?.toISOString()?.split('T')[0]);
  const [startTimeModal, setStartTimeModal] = useState(false);
  const [endTimeModal, setEndTimeModal] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const navigation = useNavigation();
  const {showToast} = useToast();
  const {cache} = useSWRConfig();

  const schema = yup.object().shape({
    title: yup.string().required('title is required'),
    location: yup.string().required('location is required'),
    description: yup.string().required('description is required'),
    eventDate: yup.string().required('eventDate is required'),
    startTime: yup.string().required('startTime is required'),
    endTime: yup.string().required('endTime is required'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
      eventDate: selected,
      startTime: '',
      endTime: '',
    },
  });
  console.log(document[0]?.uri)
  const onSubmit = async data => {
    if (!documentImage == '') {
      try {
        const formData = new FormData();
        formData.append('event_title', data?.title);
        formData.append('event_location', data?.location);
        formData.append('event_details', data?.description);
        formData.append('event_longitude', '-80.139198');
        formData.append('event_latitude', '25.793449');
        formData.append('event_start_time', data?.startTime);
        formData.append('event_end_time', data?.endTime);
        formData.append('event_date', data?.eventDate);
        if (document[0]?.uri) {
          formData.append('event_cover_image', {
            uri: document[0]?.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });
        }
        const Responce = await CreateEvent(formData);
        if (Responce == true) {
          getMyEvents({page: 1, refreash: true});
          getAllEvents({page: 1, refreash: true});
          getJoinedEvents({page: 1, refreash: true});
          cache?.delete('AllEvent');
          cache?.delete('JoinedEvent');
          cache?.delete('MyEvents');
          navigation.navigate('EventScreen', {Tab: 3});
        } else if (Responce == false) {
          showToast({
            title: 'Something went wrong',
            message: 'Something went wrong. Please try again.',
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
  const noFunction = () => {
    return;
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
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={styles.wrapper}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.logoSide1}>
            <AntDesign
              name="left"
              color={'#05348E'}
              size={ResponsiveSize(16)}
            />
            <Image
              source={require('../assets/icons/Logo.png')}
              style={{
                objectFit: 'contain',
                width: ResponsiveSize(70),
                height: ResponsiveSize(22),
              }}
            />
          </Pressable>
          <View style={styles.logoSide2}>
            <TextC
              size={ResponsiveSize(12)}
              font={'Montserrat-Bold'}
              text={'New Event'}
            />
          </View>
          <View style={styles.logoSide3}>
            <TouchableOpacity
              disabled={AllEventReducer?.EventCreateLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.NextBtn}>
              {AllEventReducer?.EventCreateLoading == true ? (
                <ActivityIndicator
                  size={ResponsiveSize(12)}
                  color={global.white}
                />
              ) : (
                <TextC
                  size={ResponsiveSize(11)}
                  text={'Create'}
                  font={'Montserrat-SemiBold'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={{
            flexGrow: 1,
            padding: ResponsiveSize(15),
            ...(scheme === 'dark'
              ? {backgroundColor: DarkTheme.colors.background}
              : {backgroundColor: 'white'}),
          }}>
          <View
            style={{
              paddingHorizontal: ResponsiveSize(15),
              paddingBottom: ResponsiveSize(5),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextC text={'Event title'} font={'Montserrat-Bold'} />
            {errors?.title?.message !== undefined && (
              <TextC
                text={'*'}
                font={'Montserrat-Bold'}
                style={{color: global.red, marginLeft: ResponsiveSize(3)}}
              />
            )}
          </View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, value}}) => (
              <TextInputC
                disable={AllEventReducer?.EventCreateLoading}
                value={value}
                placeholder={'Event title'}
                onChangeText={onChange}
              />
            )}
            name="title"
          />
          <View style={{paddingTop: ResponsiveSize(12)}}>
            <View
              style={{
                paddingHorizontal: ResponsiveSize(15),
                paddingBottom: ResponsiveSize(5),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextC text={'Event location'} font={'Montserrat-Bold'} />
              {errors?.location?.message !== undefined && (
                <TextC
                  text={'*'}
                  font={'Montserrat-Bold'}
                  style={{color: global.red, marginLeft: ResponsiveSize(3)}}
                />
              )}
            </View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <TextInputC
                  disable={AllEventReducer?.EventCreateLoading}
                  value={value}
                  placeholder={'Event location'}
                  onChangeText={onChange}
                />
              )}
              name="location"
            />
          </View>
          <View style={{paddingTop: ResponsiveSize(12)}}>
            <View
              style={{
                paddingHorizontal: ResponsiveSize(15),
                paddingBottom: ResponsiveSize(5),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextC text={'Select description'} font={'Montserrat-Bold'} />
              {errors?.description?.message !== undefined && (
                <TextC
                  text={'*'}
                  font={'Montserrat-Bold'}
                  style={{color: global.red, marginLeft: ResponsiveSize(3)}}
                />
              )}
            </View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <TextInputC
                  disable={AllEventReducer?.EventCreateLoading}
                  value={value}
                  style={{paddingTop: ResponsiveSize(15)}}
                  textAlignVertical={'top'}
                  height={ResponsiveSize(100)}
                  multiline={true}
                  numberOfLines={4}
                  placeholder={'Event description'}
                  onChangeText={onChange}
                />
              )}
              name="description"
            />
          </View>
          <View
            style={{
              paddingHorizontal: ResponsiveSize(15),
              paddingTop: ResponsiveSize(12),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextC text={'Select Date'} font={'Montserrat-Bold'} />
            {errors?.eventDate?.message !== undefined && (
              <TextC
                text={'*'}
                font={'Montserrat-Bold'}
                style={{color: global.red, marginLeft: ResponsiveSize(3)}}
              />
            )}
          </View>
          <View style={{position: 'relative', paddingTop: ResponsiveSize(10)}}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <Calendar
                  disabledByDefault={AllEventReducer?.EventCreateLoading}
                  style={{
                    padding: 0,
                    margin: 0,
                    borderRadius: 25,
                    overflow: 'hidden',
                  }}
                  onDayPress={day => {
                    onChange(day.dateString);
                    setSelected(day.dateString);
                  }}
                  minDate={today?.toISOString()?.split('T')[0]}
                  markedDates={{
                    [selected]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: 'red',
                    },
                  }}
                  enableSwipeMonths={true}
                  monthFormat="MMM, yyyy"
                  theme={{
                    arrowColor: '#05348E',
                    selectedDayBackgroundColor: '#05348E',
                    selectedDayTextColor: 'white',
                    textDayFontFamily: 'Montserrat-Medium',
                    textMonthFontFamily: 'Montserrat-Medium',
                    textDayHeaderFontFamily: 'Montserrat-Bold',
                    todayTextColor: '#05348E',
                    dayTextColor: '#05348E',
                    textDisabledColor: 'white',
                    calendarBackground: '#A8B8D8',
                    textSectionTitleColor: '#05348E',
                  }}
                />
              )}
              name="eventDate"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: ResponsiveSize(5),
            }}>
            <View style={styles.StartDateWrapper}>
              <View
                style={{
                  paddingHorizontal: ResponsiveSize(15),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextC text={'Start Hour'} font={'Montserrat-Bold'} />
                {errors?.startTime?.message !== undefined && (
                  <TextC
                    text={'*'}
                    font={'Montserrat-Bold'}
                    style={{color: global.red, marginLeft: ResponsiveSize(3)}}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={() =>
                  setStartTimeModal(
                    !AllEventReducer?.EventCreateLoading && true,
                  )
                }
                style={styles.InputTimeStyle}>
                <TextC
                  isTime={true}
                  font={'Montserrat-Medium'}
                  text={startTime}
                  size={ResponsiveSize(11)}
                  style={{color: '#666666'}}
                />
                <FeatherIcon
                  name="clock"
                  color={'#05348E'}
                  size={ResponsiveSize(16)}
                />
              </TouchableOpacity>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    modal
                    open={startTimeModal}
                    date={startTime}
                    mode="time"
                    onConfirm={date => {
                      setStartTime(date);
                      setStartTimeModal(false);
                      onChange(date);
                    }}
                    onCancel={() => {
                      setStartTimeModal(false);
                    }}
                  />
                )}
                name="startTime"
              />
            </View>
            <View style={styles.EndDateWrapper}>
              <View
                style={{
                  paddingHorizontal: ResponsiveSize(15),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextC text={'End Hour'} font={'Montserrat-Bold'} />
                {errors?.endTime?.message !== undefined && (
                  <TextC
                    text={'*'}
                    font={'Montserrat-Bold'}
                    style={{color: global.red, marginLeft: ResponsiveSize(3)}}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  setEndTimeModal(!AllEventReducer?.EventCreateLoading && true)
                }
                style={styles.InputTimeStyle}>
                <TextC
                  isTime={true}
                  font={'Montserrat-Medium'}
                  text={endTime}
                  size={ResponsiveSize(11)}
                  style={{color: '#666666'}}
                />
                <FeatherIcon
                  name="clock"
                  color={'#05348E'}
                  size={ResponsiveSize(16)}
                />
              </TouchableOpacity>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    modal
                    open={endTimeModal}
                    date={endTime}
                    minimumDate={startTime}
                    mode="time"
                    onConfirm={date => {
                      setEndTime(date);
                      setEndTimeModal(false);
                      onChange(date);
                    }}
                    onCancel={() => {
                      setEndTimeModal(false);
                    }}
                  />
                )}
                name="endTime"
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              paddingHorizontal: ResponsiveSize(15),
              paddingVertical: ResponsiveSize(10),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextC text={'Cover Image'} font={'Montserrat-Bold'} />
              {documentImage == '' && (
                <TextC
                  text={'*'}
                  font={'Montserrat-Bold'}
                  style={{color: global.red, marginLeft: ResponsiveSize(3)}}
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={
              !AllEventReducer?.EventCreateLoading
                ? requestCameraPermission
                : noFunction
            }
            style={styles.ImageGroup}>
            {documentImage ? (
              <>
                <ImageBackground
                  style={styles.ImageGroupInner}
                  src={documentImage}
                  resizeMode="cover"
                />
              </>
            ) : (
              <>
                <TextC
                  text={'Add Image'}
                  font={'Montserrat-Bold'}
                  style={{marginRight: ResponsiveSize(5)}}
                />
                <FeatherIcon
                  name="file-plus"
                  color={global.primaryColor}
                  size={ResponsiveSize(22)}
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({AllEventReducer}) {
  return {AllEventReducer};
}
export default connect(mapStateToProps, AllEventAction)(AddEvent);
