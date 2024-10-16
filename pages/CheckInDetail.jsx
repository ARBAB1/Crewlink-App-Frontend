import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ButtonC from '../components/button/index';
import InputC from '../components/inputs/index';
import AntDedign from 'react-native-vector-icons/AntDesign';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import * as CountryAction from '../store/actions/Country/index';
import {connect} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ResponsiveSize, global} from '../components/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextC from '../components/text/text';
import { useHeaderHeight } from "@react-navigation/elements";
import {
  KeyboardAvoidingView,
  Platform,
} from 'react-native';


const CheckInDetail = ({
  CheckInReducer,
  CheckInInApp,
  getAllCountries,
  getAllStates,
  getAllCities,
  onLogin,
}) => {
  const navigation = useNavigation();
  const stateDropdown = useRef();
  const [allCountriesData, setAllCountriesData] = useState();
  const [allStateData, setAllStateData] = useState();
  const [allCityData, setAllCityData] = useState();
  const [showError, setShowError] = useState(false);
  const [currentCountry, setCurrentCountry] = useState('United States');
  const [currentState, setCurrentState] = useState('');
  const [currentCity, setCurrentCity] = useState(null);
  const [layoverTime, setLayoverTime] = useState(null);
  const [userName, setUserName] = useState();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;


  useEffect(() => {
    LoadName();
  });
  const LoadName = async () => {
    const value = await AsyncStorage.getItem('UserName');
    setUserName(value);
  };
  useEffect(() => {
    LoadCountry();
  }, []);
  useEffect(() => {
    LoadState();
  }, [currentCountry]);
  useEffect(() => {
    LoadCity();
  }, [currentState]);
  const LoadCountry = async () => {
    const loadAllCountriesDetail = await getAllCountries();
    setAllCountriesData(loadAllCountriesDetail);
  };
  const LoadState = async () => {
    const loadAllStateDetail = await getAllStates({
      country: currentCountry,
    });
    setAllStateData(loadAllStateDetail);
  };
  const LoadCity = async () => {
    const loadAllCityDetail = await getAllCities({
      country: currentCountry,
      state: currentState,
    });
    setAllCityData(loadAllCityDetail);
  };
  const onSubmit = async () => {
    if (currentCountry && currentState && currentCity && layoverTime) {
      const checkInLoad = await CheckInInApp({
        country: currentCountry,
        state: currentState,
        city: currentCity,
        layover_time: layoverTime,
      });
      if (checkInLoad.message == 'Check-in created successfully') {
        onLogin();
      }
    } else {
      setShowError(true);
    }
  };

  const SelectStateToast = () => {
    // showToast({
    //   title: 'Please select State',
    //   message: 'Please select State and try again.',
    //   iconColor: '#339a77',
    //   iconName: 'infocirlceo',
    //   bg: '#e6f5ef',
    // });
    Alert.alert('Please select State')
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
    },
    titleWrapper: {
      width: windowWidth - ResponsiveSize(30),
      paddingVertical: windowHeight * 0.05,
    },
    titleTextFirst: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: ResponsiveSize(45),
      color: 'white',
      lineHeight: ResponsiveSize(45),
    },
    titleTextSecond: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: ResponsiveSize(45),
      color: global.secondaryColor,
      width: windowWidth * 0.6,
      lineHeight: ResponsiveSize(50),
    },
    inputWrapper: {
      width: windowWidth - ResponsiveSize(30),
    },
    secondInputWrapper: {
      paddingTop: windowHeight * 0.02,
    },
    loginBtnWrapper: {
      paddingTop: windowHeight * 0.03,
    },
    haveAccoundWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: windowHeight * 0.03,
    },
    labelS: {
      color: 'white',
      fontFamily: 'Montserrat-Regular',
      fontSize: ResponsiveSize(11),
      paddingBottom: ResponsiveSize(4),
    },
    dropdownButtonStyle: {
      width: global.inputWidth,
      height: global.inputHeight,
      backgroundColor: global.white,
      borderRadius: ResponsiveSize(30),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: global.inputPaddingH,
      fontFamily: 'Montserrat-Regular',
      borderWidth: ResponsiveSize(1),
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: ResponsiveSize(11),
      fontWeight: '500',
      fontFamily: 'Montserrat-Regular',
      color: 'black',
    },
    dropdownButtonArrowStyle: {
      fontSize: ResponsiveSize(22),
      color: '#666666',
    },
    dropdownButtonIconStyle: {
      fontSize: ResponsiveSize(22),
      marginRight: ResponsiveSize(8),
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: ResponsiveSize(8),
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: ResponsiveSize(12),
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: ResponsiveSize(8),
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: ResponsiveSize(11),
      fontWeight: '500',
      color: '#151E26',
      fontFamily: 'Montserrat-Regular',
    },
    dropdownItemIconStyle: {
      fontSize: ResponsiveSize(22),
      marginRight: ResponsiveSize(8),
    },
  });
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
              <Pressable style={styles.gobackBtn} onPress={navigation.goBack}>
                <AntDedign
                  name="left"
                  size={ResponsiveSize(20)}
                  color={global.secondaryColor}
                />
              </Pressable>
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleTextFirst}>Welcome,</Text>
              <Text
                style={styles.titleTextSecond}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {userName}
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <View style={{paddingHorizontal: ResponsiveSize(12)}}>
                <TextC
                  text={'Country'}
                  size={ResponsiveSize(11)}
                  font={'Montserrat-Regular'}
                  style={{color: 'white', paddingBottom: ResponsiveSize(4)}}
                />
              </View>
              <View>
                <SelectDropdown
                  defaultValue={'United States'}
                  disableAutoScroll={true}
                  data={allCountriesData}
                  dropdownOverlayColor="rgba(0, 0, 0,0.7)"
                  onSelect={selectedItem => {
                    stateDropdown.current.reset();
                    setCurrentCountry(selectedItem.name);
                  }}
                  searchInputTxtStyle={{
                    fontSize: ResponsiveSize(11),
                  }}
                  searchInputStyle={{
                    height: ResponsiveSize(30),
                  }}
                  disabled={
                    allCountriesData?.length < 0 ||
                    allCountriesData == undefined ||
                    allCountriesData == null
                      ? true
                      : false
                  }
                  search={true}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <>
                        <View
                          style={{
                            ...styles.dropdownButtonStyle,
                            borderColor:
                              showError == false ||
                              (currentCountry !== null &&
                                currentCountry !== undefined &&
                                currentCountry !== '')
                                ? 'white'
                                : 'red',
                          }}>
                          {allCountriesData?.length < 0 ||
                          allCountriesData == undefined ||
                          allCountriesData == null ? (
                            <ActivityIndicator color={'black'} />
                          ) : (
                            <>
                              <Text
                                style={{
                                  ...styles.dropdownButtonTxtStyle,
                                  color: selectedItem
                                    ? 'black'
                                    : global.placeholderColor,
                                }}>
                                {(selectedItem && selectedItem.name) ||
                                  'United States'}
                              </Text>
                              <Icon
                                name={isOpened ? 'chevron-up' : 'chevron-down'}
                                style={styles.dropdownButtonArrowStyle}
                              />
                            </>
                          )}
                        </View>
                      </>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <>
                        <View
                          style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && {backgroundColor: '#D2D9DF'}),
                          }}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item?.name}
                          </Text>
                        </View>
                      </>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </View>
              <View style={styles.secondInputWrapper}>
                <View style={{paddingHorizontal: ResponsiveSize(12)}}>
                  <TextC
                    text={'State'}
                    size={ResponsiveSize(11)}
                    font={'Montserrat-Regular'}
                    style={{color: 'white', paddingBottom: ResponsiveSize(4)}}
                  />
                </View>
                <View>
                  <SelectDropdown
                    ref={stateDropdown}
                    disableAutoScroll={true}
                    data={allStateData}
                    dropdownOverlayColor="rgba(0, 0, 0,0.7)"
                    onSelect={selectedItem => {
                      setCurrentState(selectedItem.name);
                    }}
                    searchInputTxtStyle={{
                      fontSize: ResponsiveSize(11),
                    }}
                    searchInputStyle={{
                      height: ResponsiveSize(30),
                    }}
                    disabled={
                      allStateData?.length < 0 ||
                      allStateData == undefined ||
                      allStateData == null
                        ? true
                        : false
                    }
                    search={true}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <>
                          <View
                            style={{
                              ...styles.dropdownButtonStyle,
                              borderColor:
                                showError == false ||
                                (currentState !== null &&
                                  currentState !== undefined &&
                                  currentState !== '')
                                  ? 'white'
                                  : 'red',
                            }}>
                            {allStateData?.length < 0 ||
                            allStateData == undefined ||
                            allStateData == null ? (
                              <ActivityIndicator color={'black'} />
                            ) : (
                              <>
                                <Text
                                  style={{
                                    ...styles.dropdownButtonTxtStyle,
                                    color: selectedItem
                                      ? 'black'
                                      : global.placeholderColor,
                                  }}>
                                  {(selectedItem && selectedItem.name) ||
                                    'Select State'}
                                </Text>
                                <Icon
                                  name={
                                    isOpened ? 'chevron-up' : 'chevron-down'
                                  }
                                  style={styles.dropdownButtonArrowStyle}
                                />
                              </>
                            )}
                          </View>
                        </>
                      );
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <>
                          <View
                            style={{
                              ...styles.dropdownItemStyle,
                              ...(isSelected && {backgroundColor: '#D2D9DF'}),
                            }}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item?.name}
                            </Text>
                          </View>
                        </>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                  />
                </View>
              </View>
              <View style={styles.secondInputWrapper}>
                <View style={{paddingHorizontal: ResponsiveSize(12)}}>
                  <TextC
                    text={'City'}
                    size={ResponsiveSize(11)}
                    font={'Montserrat-Regular'}
                    style={{color: 'white', paddingBottom: ResponsiveSize(4)}}
                  />
                </View>
                <View>
                  {currentState == '' ? (
                    <TouchableOpacity
                      onPress={SelectStateToast}
                      style={{
                        ...styles.dropdownButtonStyle,
                        borderColor:
                          showError == false ||
                          (currentCity !== null &&
                            currentCity !== undefined &&
                            currentCity !== '')
                            ? 'white'
                            : 'red',
                      }}>
                      <Text style={{...styles.dropdownButtonTxtStyle}}>
                        {'Select City'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <SelectDropdown
                      disableAutoScroll={true}
                      data={allCityData}
                      dropdownOverlayColor="rgba(0, 0, 0,0.7)"
                      onSelect={selectedItem => {
                        setCurrentCity(selectedItem);
                      }}
                      disabled={
                        allCityData?.length < 0 ||
                        allCityData == undefined ||
                        allCityData == null
                          ? true
                          : false
                      }
                      search={true}
                      searchInputTxtStyle={{
                        fontSize: ResponsiveSize(11),
                      }}
                      searchInputStyle={{
                        height: ResponsiveSize(30),
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <>
                            <View
                              style={{
                                ...styles.dropdownButtonStyle,
                                borderColor:
                                  showError == false ||
                                  (currentCity !== null &&
                                    currentCity !== undefined &&
                                    currentCity !== '')
                                    ? 'white'
                                    : 'red',
                              }}>
                              {allCityData?.length < 0 ||
                              allCityData == undefined ||
                              allCityData == null ? (
                                <ActivityIndicator color={'black'} />
                              ) : (
                                <>
                                  <Text
                                    style={{
                                      ...styles.dropdownButtonTxtStyle,
                                      color: selectedItem
                                        ? 'black'
                                        : global.placeholderColor,
                                    }}>
                                    {selectedItem || 'Select City'}
                                  </Text>
                                  <Icon
                                    name={
                                      isOpened ? 'chevron-up' : 'chevron-down'
                                    }
                                    style={styles.dropdownButtonArrowStyle}
                                  />
                                </>
                              )}
                            </View>
                          </>
                        );
                      }}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <>
                            <View
                              style={{
                                ...styles.dropdownItemStyle,
                                ...(isSelected && {backgroundColor: '#D2D9DF'}),
                              }}>
                              <Text style={styles.dropdownItemTxtStyle}>
                                {item}
                              </Text>
                            </View>
                          </>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      dropdownStyle={styles.dropdownMenuStyle}
                    />
                  )}
                </View>
              </View>
              <View style={styles.secondInputWrapper}>
                <InputC
                  error={
                    showError == false ||
                    (layoverTime !== null &&
                      layoverTime !== undefined &&
                      layoverTime !== '')
                      ? undefined
                      : true
                  }
                  onChangeText={setLayoverTime}
                  max={3}
                  type={'number-pad'}
                  label={'How long is your layover ?'}
                  placeholder={'25h'}
                />
              </View>
            </View>

            <View style={styles.loginBtnWrapper}>
              <ButtonC
                title="Continue"
                disabled={CheckInReducer?.loading}
                loading={CheckInReducer?.loading}
                bgColor={global.secondaryColor}
                TextStyle={{color: global.primaryColorDark}}
                onPress={onSubmit}
              />
            </View>

            <View style={styles.haveAccoundWrapper}>
              <TextC
                text={
                  'Disclaimer: This app will not show exact locations but just the city you are currently laying over in.'
                }
                style={{color: 'white', textAlign: 'left'}}
                size={ResponsiveSize(11)}
                font={'Montserrat-ExtraLight'}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps({
  CountryReducer,
  StatesReducer,
  CityReducer,
  CheckInReducer,
}) {
  return {CountryReducer, StatesReducer, CityReducer, CheckInReducer};
}
export default connect(mapStateToProps, CountryAction)(CheckInDetail);
