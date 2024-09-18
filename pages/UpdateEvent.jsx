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

const UpdateEvent = ({
  AllEventReducer,
  UpdateEvent,
  getMyEvents,
  getEventDetail,
  route,
  getJoinedEvents,
  getAllEvents,
}) => {
  const {id} = route.params;
  const windowWidth = Dimensions.get('window').width;
  const scheme = useColorScheme();
  const {openBottomSheet, closeBottomSheet} = useBottomSheet();
  const [documentImage, setDocumentImage] = useState('');
  const [eventDetail, setEventDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(today?.toISOString()?.split('T')[0]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const {showToast} = useToast();
  const [isImage, setIsImage] = useState('');
  const {cache} = useSWRConfig();

  useEffect(() => {
    if (eventDetail) {
      reset({
        title: eventDetail?.event_title,
        location: eventDetail?.event_location,
        description: eventDetail?.event_details,
        eventDate: eventDetail?.event_date,
        startTime: new Date(eventDetail?.original_event_start_time),
        endTime: new Date(eventDetail?.original_event_end_time),
      });
      setSelected(eventDetail?.event_date);
      setStartTime(new Date(eventDetail?.original_event_start_time));
      setEndTime(new Date(eventDetail?.original_event_end_time));
      setDocumentImage(eventDetail?.event_cover_image_thumbnail);
    } else {
      loadEventDetail();
    }
  }, [eventDetail]);

  const loadEventDetail = async () => {
    setLoading(true);
    const loadingDetail = await getEventDetail({id});
    if (loadingDetail) {
      setEventDetail(loadingDetail);
      setLoading(false);
    } else {
      setLoading(false);
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
      setDocumentImage(result?.assets[0]?.uri);
      setIsImage(result?.assets);
      closeBottomSheet();
    }
  };
  const openMobileCamera = async () => {
    const result = await launchCamera();
    if (result?.assets.length > 0) {
      setDocumentImage(result?.assets[0]?.uri);
      setIsImage(result?.assets);
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
      marginBottom: ResponsiveSize(50),
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
  const [startTimeModal, setStartTimeModal] = useState(false);
  const [endTimeModal, setEndTimeModal] = useState(false);
  const navigation = useNavigation();
  const [errorType, setErrorType] = useState('');

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
      eventDate: '',
      startTime: '',
      endTime: '',
    },
  });
  const onSubmit = async data => {
    if (!documentImage == '') {
      try {
        const Responce = await UpdateEvent({
          ...data,
          ...{id: id, documentImage: documentImage, isImage: isImage},
        });
        if (Responce == true) {
          getMyEvents({page: 1, refreash: true});
          getJoinedEvents({page: 1, refreash: true});
          getAllEvents({page: 1, refreash: true});
          cache?.delete('AllEvent');
          cache?.delete('JoinedEvent');
          cache?.delete('MyEvents');
          navigation.navigate('EventScreen', {Tab: 3});
        } else if (Responce == 'Server error') {
          setErrorType(Responce);
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
        <StatusBar
          translucent={false}
          backgroundColor={
            scheme === 'dark' ? DarkTheme.colors.background : 'white'
          }
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        />
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
              text={'Upadte Event'}
            />
          </View>
          <View style={styles.logoSide3}>
            <TouchableOpacity
              disabled={AllEventReducer?.EventUpdateLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.NextBtn}>
              {AllEventReducer?.EventUpdateLoading ? (
                <ActivityIndicator
                  size={ResponsiveSize(12)}
                  color={global.white}
                />
              ) : (
                <TextC size={12} text={'Update'} font={'Montserrat-SemiBold'} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {AllEventReducer?.networkError ? (
          <ScrollView style={{flexGrow: 1, padding: ResponsiveSize(15)}}>
            <View
              style={{
                paddingTop: ResponsiveSize(180),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  paddingBottom: ResponsiveSize(5),
                  paddingHorizontal: ResponsiveSize(50),
                }}>
                <Image
                  style={{
                    height: ResponsiveSize(80),
                    width: ResponsiveSize(80),
                  }}
                  source={require('../assets/icons/something-went-wrong.png')}
                />
              </View>
              <TextC
                text={'Something went wrong'}
                font={'Montserrat-Bold'}
                size={ResponsiveSize(15)}
              />
              <TextC
                style={{textAlign: 'center', color: global?.black}}
                text={'Brace yourself till we get the error fixed'}
                font={'Montserrat-Medium'}
                size={ResponsiveSize(10)}
              />
            </View>
          </ScrollView>
        ) : errorType == 'Server error' ? (
          <ScrollView style={{flexGrow: 1, padding: ResponsiveSize(15)}}>
            <View
              style={{
                paddingTop: ResponsiveSize(180),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  paddingBottom: ResponsiveSize(5),
                  paddingHorizontal: ResponsiveSize(50),
                }}>
                <Image
                  style={{
                    height: ResponsiveSize(80),
                    width: ResponsiveSize(80),
                  }}
                  source={require('../assets/icons/something-went-wrong.png')}
                />
              </View>
              <TextC
                text={'Internal server error'}
                font={'Montserrat-Bold'}
                size={ResponsiveSize(15)}
              />
              <TextC
                style={{textAlign: 'center', color: global?.black}}
                text={'Brace yourself till we get the error fixed'}
                font={'Montserrat-Medium'}
                size={ResponsiveSize(10)}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={{flexGrow: 1, padding: ResponsiveSize(15)}}>
            {loading ? (
              <ActivityIndicator size={'large'} color={global.primaryColor} />
            ) : (
              <>
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
                      disable={AllEventReducer?.EventUpdateLoading}
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
                        style={{
                          color: global.red,
                          marginLeft: ResponsiveSize(3),
                        }}
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
                        disable={AllEventReducer?.EventUpdateLoading}
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
                    <TextC
                      text={'Select description'}
                      font={'Montserrat-Bold'}
                    />
                    {errors?.description?.message !== undefined && (
                      <TextC
                        text={'*'}
                        font={'Montserrat-Bold'}
                        style={{
                          color: global.red,
                          marginLeft: ResponsiveSize(3),
                        }}
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
                        disable={AllEventReducer?.EventUpdateLoading}
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
                <View
                  style={{
                    position: 'relative',
                    paddingTop: ResponsiveSize(10),
                  }}>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({field: {onChange, value}}) => (
                      <Calendar
                        disabledByDefault={AllEventReducer?.EventUpdateLoading}
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
                          style={{
                            color: global.red,
                            marginLeft: ResponsiveSize(3),
                          }}
                        />
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        setStartTimeModal(
                          !AllEventReducer?.EventUpdateLoading && true,
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
                          style={{
                            color: global.red,
                            marginLeft: ResponsiveSize(3),
                          }}
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        setEndTimeModal(
                          !AllEventReducer?.EventUpdateLoading && true,
                        )
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
                        style={{
                          color: global.red,
                          marginLeft: ResponsiveSize(3),
                        }}
                      />
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={
                    !AllEventReducer?.EventUpdateLoading
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
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({AllEventReducer}) {
  return {AllEventReducer};
}
export default connect(mapStateToProps, AllEventAction)(UpdateEvent);
