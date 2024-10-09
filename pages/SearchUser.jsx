import React, { useEffect, useRef, useState } from 'react';
import {
  DarkTheme,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  TouchableOpacity,
  Pressable,
  TextInput,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { global, ResponsiveSize } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from '../components/text/text';
import { useNavigation } from '@react-navigation/native';
import SearchCenter from '../components/searchBar';
import { Image } from 'react-native-elements';
import baseUrl from '../store/config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { useBottomSheet } from '../components/bottomSheet/BottomSheet';
import Modal from 'react-native-modal';
import * as UserRegisterAction from "../store/actions/UserRegister/index";
import { connect } from "react-redux";
import { set } from 'react-hook-form';
import CommnetLight from '../assets/icons/Comment.png';
import post from '../components/post';


const SearchUser = ({ getAllAirline, getAllCountries, getAllStates, getAllCities }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const scheme = useColorScheme();
  const [isVisible, setIsVisible] = useState(false);
  const [postfilter, setPostFilter] = useState(false);
  const [searchPostfilter, setSearchPostFilter] = useState(true);
  const [searchUserfilter, setSearchUserFilter] = useState(true);
  const [userfilter, setUserFilter] = useState(false);
  const [position, setPosition] = useState([])
  const [airLine, setAirline] = useState([])
  const [stayTime, setStayTime] = useState([])
  const [country, setCountry] = useState([])
  const [state, setState] = useState([])
  const [SearchCountry, setSearchCountry] = useState("");
  const [SearchState, setSearchState] = useState("");
  const [SearchCity, setSearchCity] = useState("");

  const [isPositionVisible, setPositionVisible] = useState(false);
  const [isAirLineVisible, setAirLineVisible] = useState(false);
  const [isCountryVisible, setCountryVisible] = useState(false);
  const [isStateVisible, setStateVisible] = useState(false);
  const [isCityVisible, setCityVisible] = useState(false);
  const [isTimeVisible, setTimeVisible] = useState(false);

  const [city, setCity] = useState([])
  const navigation = useNavigation();
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchedPost, setSearchedPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [countryfilter, setCountryFilter] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  useEffect(() => {
    return () => { closeBottomSheet() }
  }, [])

  const toggleVisibility = () => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsVisible(false))
    } else {
      setIsVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(15),
      paddingBottom: ResponsiveSize(10),
      backgroundColor: global.white,
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
    SearchCenter: {
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(10)
    },
    SearchCenterInput: {
      position: 'relative',
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(10)
    },
    FilterBtn: {
      width: ResponsiveSize(60),
      height: ResponsiveSize(45),
      paddingVertical: ResponsiveSize(7),
      borderRadius: ResponsiveSize(20),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 100,
      right: ResponsiveSize(0),
      bottom: ResponsiveSize(0),
    },
    SearchUserInput: {
      fontSize: ResponsiveSize(11),
      paddingHorizontal: global.inputPaddingH,
      backgroundColor: '#EEEEEE',
      width: global.inputWidth,
      fontFamily: 'Montserrat-Regular',
      height: global.inputHeight,
      color: global.black,
      borderTopLeftRadius: ResponsiveSize(23),
      borderTopRightRadius: ResponsiveSize(23),
      borderBottomLeftRadius: ResponsiveSize(isVisible ? 0 : 23),
      borderBottomRightRadius: ResponsiveSize(isVisible ? 0 : 23),
      borderWidth: 1,
      borderColor: global.description,
      zIndex: 2,
    },
    ListOfSearch: {
      paddingVertical: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    ListOfSearchPost: {
      // paddingVertical: ResponsiveSize(5),
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    ProfileImage: {
      height: ResponsiveSize(40),
      width: ResponsiveSize(40),
      borderRadius: ResponsiveSize(40),
      marginRight: ResponsiveSize(0),
      backgroundColor: global.description,
    },
    UpcomingContent: {
      paddingLeft: 10,
    },
    NextBtn: {
      backgroundColor: global.secondaryColor,
      width: ResponsiveSize(60),
      paddingVertical: ResponsiveSize(7),
      borderRadius: ResponsiveSize(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    DropdownSeeker: {
      height: !isVisible && 0,
      backgroundColor: global.description,
      // paddingBottom: ResponsiveSize(!isVisible ? 0 :userfilter ? ResponsiveSize(75) : countryfilter && isVisible ? ResponsiveSize(125) : ResponsiveSize(35)),
      paddingBottom:  ResponsiveSize(!isVisible ? 0 : (userfilter && country.length!==0) ? 130 : (userfilter && country.length===0) ? 85 : 35),
      backgroundColor: '#EEEEEE',
      borderBottomLeftRadius: ResponsiveSize(20),
      borderBottomRightRadius: ResponsiveSize(20),
      borderColor: global.description,
      borderWidth: ResponsiveSize(!isVisible ? 0 : ResponsiveSize(1)),
      width: global.inputWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(!isVisible ? 0 : ResponsiveSize(15)),
      overflow: 'hidden'
    },
    ActuallPost: {
      height: windowHeight * 0.2,
      width: windowWidth * 0.6,
     marginVertical: ResponsiveSize(15),
      borderRadius: 0,
    },
    filterTab: {
      backgroundColor: global.primaryColor,
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(5),
      borderRadius: ResponsiveSize(20),
  
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: ResponsiveSize(2),
      position: 'relative',
      width: windowWidth - ResponsiveSize(65) * 3.6,
      height: ResponsiveSize(35),
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    view: {
      width: 300,
      height: 100,
      backgroundColor: 'red',
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
    }
  });



  const LoadUserId = async () => {
    const U_id = await AsyncStorage.getItem('U_id');
    setUserId(U_id);
  };
  useEffect(() => {
    SearchUsers()
    LoadUserId();
  }, []);

  const SearchUsers = async () => {
    setLoading(true);
    const Token = await AsyncStorage.getItem('Token');

    const response = await fetch(
      `${baseUrl.baseUrl}/users/get-all-users-filter`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': baseUrl.apiKey,
          accesstoken: `Bearer ${Token}`,
        },
        body: JSON.stringify({
          airline_ids: airLine,
          check_in_cities: city ? city : [],
          user_types: position,
          time_left: stayTime ? stayTime : [],
          user_search: searchText,
          countries: country,
          states: state,
          post_search: searchText,
          is_user_search: true,
          is_post_search: true


        }),
      },
    );
    
    const result = await response.json();
    setSearchedUser(result?.users);
    setSearchedPost(result?.posts);
    setLoading(false);
  };
  const SearchUsersDirect = async (e) => {
    setLoading(true);
    const Token = await AsyncStorage.getItem('Token');
    const response = await fetch(
      `${baseUrl.baseUrl}/users/get-all-users-filter`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': baseUrl.apiKey,
          accesstoken: `Bearer ${Token}`,
        },
        body: JSON.stringify({
          airline_ids: [],
          check_in_cities: [],
          user_types: [],
          time_left: [],
          countries: [],
          states: [],
          states: state,
          user_search: e,
          post_search: e,
          is_user_search: true,
          is_post_search: true
        }),
      },
    );
    const result = await response.json();
    setSearchedUser(result?.users);
    setSearchedPost(result?.posts);
    setLoading(false);
  };








  const ClearPosition = () => {
    setPosition([])
    setPositionVisible(false)
  }
  const ClearAirline = () => {
    setAirline([])
    setAirLineVisible(false)
  }
  const ClearCountry = () => {
    setCountry("")
    setState("")
    setCity("")
    setStayTime("")
    setSearchCountry("")
    setSearchState("")
    setCountryVisible(false)
    setSearchCity("")
  }
  const ClearState = () => {
    setState("")
    setCity("")
    setStayTime("")
    setSearchState("")
    setSearchCity("")
    setStateVisible(false)
  }
  const ClearCity = () => {
    setCity("")
    setStayTime("")
    setSearchCity("")
    setCityVisible(false)
  }
  const ClearTime = () => {
    setStayTime("")
    setTimeVisible(false)
  }


  const AddPositions = (e) => {
    setPosition(prevItems => {
      if (prevItems.includes(e)) {
        return prevItems.filter(item => item !== e)
      } else {
        return [...prevItems, e];
      }
    });
  }
  const AddAirLine = (e) => {
    setAirline(prevItems => {
      if (prevItems.includes(e)) {
        return prevItems.filter(item => item !== e)
      } else {
        return [...prevItems, e];
      }
    });
  }

  const AddTime = (e) => {
    setStayTime([e]);
  }
  const AddCountry = async (e) => {
    setCountry([e]);
    const loadAllStateDetail = await getAllStates({
      country: e,
    });
    setAllStateData(loadAllStateDetail);
  }
  const AddState = async (e) => {
    setState([e]);
    const loadAllCityDetail = await getAllCities({
      country: country[0],
      state: e,
    });
    setAllCityData(loadAllCityDetail);
  }
  const AddCity = async (e) => {
    setCity([e]);
  }

  // airLine Data
  const [allAirLine, setAllAirLine] = useState()
  useEffect(() => {
    LoadAirLine()
    LoadCountry();
  }, [])


  const LoadAirLine = async () => {
    const loadAllAirLineDetail = await getAllAirline()
    setAllAirLine(loadAllAirLineDetail?.data)
  }
  // airLine Data

  const PositionData = [
    { key: 1, label: 'Pilot', data: 'PILOT' },
    { key: 2, label: 'Flight Attendant', data: 'FLIGHT ATTENDANT' },
    { key: 3, label: 'Technician', data: 'TECHNICIAN' },
  ];

  // Country Data
  const [allCountriesData, setAllCountriesData] = useState();
  const LoadCountry = async () => {
    const loadAllCountriesDetail = await getAllCountries();
    setAllCountriesData(loadAllCountriesDetail);
  };
  // Country Data

  const [allCityData, setAllCityData] = useState([]);
  const [allStateData, setAllStateData] = useState([]);

  const TimeData = [
    { key: 3, label: 'Less then 3 hours' },
    { key: 6, label: 'Less then 6 hours' },
    { key: 9, label: 'Less then 9 hours' },
    { key: 1000000, label: '10+ hours' },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
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
              color={global.primaryColor}
              size={ResponsiveSize(22)}
            />
          </Pressable>
          <View style={styles.logoSide2}>
            <TextC
              size={ResponsiveSize(13)}
              font={'Montserrat-Bold'}
              text={'Search'}
            />
          </View>
          <View style={styles.logoSide3}>
            {isVisible && (
              <Animated.View style={[styles.animatedView, { opacity }]}>
                <TouchableOpacity
                  onPress={SearchUsers}
                  style={styles.NextBtn}>
                  <TextC
                    size={ResponsiveSize(10)}
                    text={'Apply'}
                    font={'Montserrat-SemiBold'}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: global.white,
          }}>
          <View style={styles.SearchCenterInput}>

            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.SearchUserInput}
                placeholder="Search Users"
                onChangeText={(e) => isVisible ? setSearchText(e) : SearchUsersDirect(e)}
              />
              <TouchableOpacity onPress={toggleVisibility} style={styles.FilterBtn}>
                <AntDesign name='filter' color={global.primaryColor} size={ResponsiveSize(18)} />
              </TouchableOpacity>
            </View>
            <View style={styles.DropdownSeeker}>
              <TextC text={"Sort by"} font={'Montserrat-Bold'} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(10) }}>
              <TouchableOpacity onPress={() => {setPostFilter(!postfilter) ,setUserFilter(false)}} style={styles.filterTab}>
                  <TextC text={"Post"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
                  {postfilter && 
                    <View style={styles.IndicatorDot}></View>
                  }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setUserFilter(!userfilter) ,setPostFilter(false)}} style={styles.filterTab}>
                  <TextC text={"User"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
                  {userfilter  &&
                    <View style={styles.IndicatorDot}></View>
                  }
                </TouchableOpacity>
              </View>
              
{ userfilter  && (


   <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(50) }}>
              
   <TouchableOpacity onPress={() => setPositionVisible(true)} style={styles.filterTab}>
     <TextC text={"Position"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
     {position.length > 0 &&
       <View style={styles.IndicatorDot}></View>
     }
   </TouchableOpacity>

   <TouchableOpacity onPress={() => setAirLineVisible(true)} style={styles.filterTab}>
     <TextC text={"Airline"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
     {airLine.length > 0 &&
       <View style={styles.IndicatorDot}></View>
     }
   </TouchableOpacity>


   <TouchableOpacity onPress={() => {setCountryVisible(true);setCountryFilter(true);}} style={styles.filterTab}>
     <TextC text={"Country"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
     {country.length > 0 &&
       <View style={styles.IndicatorDot}></View>
     }
   </TouchableOpacity>
 </View>

)
}
           


              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(45) }}>
                {country.length > 0 &&
                  <TouchableOpacity disabled={!allStateData?.length > 0} onPress={() => setStateVisible(true)} style={styles.filterTab}>
                    {allStateData?.length > 0 ?
                      <TextC text={"State"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
                      :
                      <ActivityIndicator size={ResponsiveSize(12)} color={global.white} />
                    }
                    {state.length > 0 &&
                      <View style={styles.IndicatorDot}></View>
                    }
                  </TouchableOpacity>
                }

                {state.length > 0 &&
                  <TouchableOpacity disabled={!allCityData?.length > 0} onPress={() => setCityVisible(true)} style={styles.filterTab}>
                    {allCityData?.length > 0 ?
                      <TextC text={"City"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
                      :
                      <ActivityIndicator size={ResponsiveSize(12)} color={global.white} />
                    }
                    {city.length > 0 &&
                      <View style={styles.IndicatorDot}></View>
                    }
                  </TouchableOpacity>
                }

                {city.length > 0 &&
                  <TouchableOpacity onPress={() => setTimeVisible(true)} style={styles.filterTab}>
                    <TextC text={"Time"} style={{ color: global.white }} size={ResponsiveSize(10)} font={'Montserrat-SemiBold'} />
                    {stayTime.length > 0 &&
                      <View style={styles.IndicatorDot}></View>
                    }
                  </TouchableOpacity>
                }
              </View>

            </View>
          </View>
          <View style={styles.SearchCenter}>
            {loading ? (
              <View style={{ paddingTop: ResponsiveSize(100) }}>
                <ActivityIndicator size={'large'} color={global.primaryColor} />
              </View>
            ) : (
              <>
            
            <View>
            {searchedUser !== undefined &&
                  searchedUser !== null &&
                  searchedUser !== '' &&
                  searchedUser?.length > 0
                  ||
                  searchedPost !== undefined &&
                  searchedPost !== null &&
                  searchedPost !== '' &&
                  searchedPost?.length > 0
                  ? (
                    <>
                    {!isVisible?(

                      <TextC text={"Users"} font={'Montserrat-SemiBold'} size={ResponsiveSize(16)} style={{paddingBottom:ResponsiveSize(20)}} />
                    ):isVisible && userfilter ? (
                      <TextC text={"Users"} font={'Montserrat-SemiBold'} size={ResponsiveSize(16)} style={{paddingBottom:ResponsiveSize(20)}} />
                    ):null

                    }

                  {!isVisible?  
                  searchedUser.map(data => (
                    <>
                    <Pressable onPress={() => navigation.navigate('UserProfileScreen', { user_id: data?.user_id })} style={styles.ListOfSearch}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                          style={styles.ProfileImage}
                          source={{
                            uri: data?.profile_picture_url,
                            priority: FastImage.priority.high,
                          }}
                        />
                        <View style={styles.UpcomingContent}>
                          <TextC
                            text={data.user_name}
                            font={'Montserrat-Bold'}
                            size={ResponsiveSize(12)}
                            style={{ width: ResponsiveSize(80) }}
                            ellipsizeMode={'tail'}
                            numberOfLines={1}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextC
                          text={data.airline_abbreviation}
                          style={{
                            color: global.placeholderColor,
                            paddingVertical: ResponsiveSize(2),
                          }}
                          font={'Montserrat-Medium'}
                          size={ResponsiveSize(11)}
                        />
                        <TextC
                          text={"|"}
                          style={{
                            color: global.placeholderColor,
                            paddingHorizontal: ResponsiveSize(2),
                            paddingBottom: ResponsiveSize(2),
                          }}
                          font={'Montserrat-Medium'}
                          size={ResponsiveSize(11)}
                        />
                        <TextC
                          text={
                            data.user_type == 'PILOT'
                              ? 'P'
                              : data.user_type == 'FLIGHT ATTENDANT'
                                ? 'FA'
                                : data?.user_type == 'TECHNICIAN'
                                  ? 'TE'
                                  : ''
                          }
                          style={{
                            color: global.placeholderColor,
                            paddingVertical: ResponsiveSize(2),
                          }}
                          font={'Montserrat-Medium'}
                          size={ResponsiveSize(11)}
                        />
                      </View>


                      <TextC
                        text={`${data.checkin_remaining_time}h`}
                        style={{
                          color: global.placeholderColor,
                          paddingVertical: ResponsiveSize(2),
                        }}
                        font={'Montserrat-Medium'}
                        size={ResponsiveSize(11)}
                      />
                    </Pressable>
                    </>
                    )):isVisible && userfilter?
                    searchedUser.map(data => (
                      <>
                      <Pressable onPress={() => navigation.navigate('UserProfileScreen', { user_id: data?.user_id })} style={styles.ListOfSearch}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FastImage
                            style={styles.ProfileImage}
                            source={{
                              uri: data?.profile_picture_url,
                              priority: FastImage.priority.high,
                            }}
                          />
                          <View style={styles.UpcomingContent}>
                            <TextC
                              text={data.user_name}
                              font={'Montserrat-Bold'}
                              size={ResponsiveSize(12)}
                              style={{ width: ResponsiveSize(80) }}
                              ellipsizeMode={'tail'}
                              numberOfLines={1}
                            />
                          </View>
                        </View>
  
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TextC
                            text={data.airline_abbreviation}
                            style={{
                              color: global.placeholderColor,
                              paddingVertical: ResponsiveSize(2),
                            }}
                            font={'Montserrat-Medium'}
                            size={ResponsiveSize(11)}
                          />
                          <TextC
                            text={"|"}
                            style={{
                              color: global.placeholderColor,
                              paddingHorizontal: ResponsiveSize(2),
                              paddingBottom: ResponsiveSize(2),
                            }}
                            font={'Montserrat-Medium'}
                            size={ResponsiveSize(11)}
                          />
                          <TextC
                            text={
                              data.user_type == 'PILOT'
                                ? 'P'
                                : data.user_type == 'FLIGHT ATTENDANT'
                                  ? 'FA'
                                  : data?.user_type == 'TECHNICIAN'
                                    ? 'TE'
                                    : ''
                            }
                            style={{
                              color: global.placeholderColor,
                              paddingVertical: ResponsiveSize(2),
                            }}
                            font={'Montserrat-Medium'}
                            size={ResponsiveSize(11)}
                          />
                        </View>
  
  
                        <TextC
                          text={`${data.checkin_remaining_time}h`}
                          style={{
                            color: global.placeholderColor,
                            paddingVertical: ResponsiveSize(2),
                          }}
                          font={'Montserrat-Medium'}
                          size={ResponsiveSize(11)}
                        />
                      </Pressable>
                      </>
                      )):null
                    }

<>
{!isVisible?(
   <Pressable onPress={() => setUserFilter(true)}  style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}} >
   <TextC text={"Load More"} font={'Montserrat-SemiBold'} size={ResponsiveSize(12)}/>
   </Pressable>
):
 isVisible && userfilter ? (
  <Pressable onPress={() => setUserFilter(true)}  style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}} >
  <TextC text={"Load More"} font={'Montserrat-SemiBold'} size={ResponsiveSize(12)}/>
  </Pressable>
 ):null
}

</>



              {
!isVisible ?
              <TextC text={"Posts"} font={'Montserrat-SemiBold'} size={ResponsiveSize(16)} style={{paddingBottom:ResponsiveSize(20)}} />: isVisible && postfilter?
              <TextC text={"Posts"} font={'Montserrat-SemiBold'} size={ResponsiveSize(16)} style={{paddingBottom:ResponsiveSize(20)}} />:null
              } 
{ !isVisible?
searchedPost?.map(data => (

                    <>
                    <Pressable onPress={() =>  navigation.navigate('PostDetail',  data?.post_id )} style={styles.ListOfSearchPost}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                          style={styles.ProfileImage}
                          source={{
                            uri: data?.userDetails?.profile_picture_url,
                            priority: FastImage.priority.high,
                          }}
                        />
                        <View style={styles.UpcomingContent}>
                         
                     
             
                          <TextC
                            text={data?.userDetails?.user_name}
                            font={'Montserrat-Bold'}
                            size={ResponsiveSize(12)}
                            style={{ width: ResponsiveSize(80) }}
                            ellipsizeMode={'tail'}
                            numberOfLines={1}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: 'column', alignItems: 'center',justifyContent:'center' }}>
                      <TextC
                        text={`${data?.caption}`}
                        style={{
                          color: global.placeholderColor,
                          paddingVertical: ResponsiveSize(12),
                        }}
                        font={'Montserrat-Medium'}
                        size={ResponsiveSize(11)}
                      />
                      {data?.attachments?.length > 0 &&
                          <>
                            <FastImage
              source={{
                uri: data?.attachments[0]?.attachment_url,
                priority: FastImage.priority.high,
              }}
              style={styles.ActuallPost}
              />
             
         
                          </>

                          }


                     
                        </View>
              <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%'}}>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

               
              <AntDesign
            name={ 'hearto'}
            color={ global.primaryColor }
            size={ResponsiveSize(22)}
          />

          <TextC
            text={`${data?.likes_count} Likes`}
            style={{
              color: global.placeholderColor,
              paddingVertical: ResponsiveSize(2),
            }}
            font={'Montserrat-Medium'}
            size={ResponsiveSize(11)}
          />
           </View>
              <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <Image
              source={CommnetLight}
              style={{ height: ResponsiveSize(20), width: ResponsiveSize(20) }}
            />

          <TextC
            text={`${data?.comments_count} Comments`}
            style={{
              color: global.placeholderColor,
              paddingVertical: ResponsiveSize(2),
            }}
            font={'Montserrat-Medium'}
            size={ResponsiveSize(11)}
          />
          </View>
              </View>
                    </Pressable>
                    </>
                    ))
                    : isVisible && postfilter ? searchedPost?.map(data => (

                    <>
                    <Pressable onPress={() =>  navigation.navigate('PostDetail',  data?.post_id )} style={styles.ListOfSearchPost}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                          style={styles.ProfileImage}
                          source={{
                            uri: data?.userDetails?.profile_picture_url,
                            priority: FastImage.priority.high,
                          }}
                        />
                        <View style={styles.UpcomingContent}>
                         
                     
             
                          <TextC
                            text={data?.userDetails?.user_name}
                            font={'Montserrat-Bold'}
                            size={ResponsiveSize(12)}
                            style={{ width: ResponsiveSize(80) }}
                            ellipsizeMode={'tail'}
                            numberOfLines={1}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: 'column', alignItems: 'center',justifyContent:'center' }}>
                      <TextC
                        text={`${data?.caption}`}
                        style={{
                          color: global.placeholderColor,
                          paddingVertical: ResponsiveSize(12),
                        }}
                        font={'Montserrat-Medium'}
                        size={ResponsiveSize(11)}
                      />
                      {data?.attachments?.length > 0 &&
                          <>
                            <FastImage
              source={{
                uri: data?.attachments[0]?.attachment_url,
                priority: FastImage.priority.high,
              }}
              style={styles.ActuallPost}
              />
             
         
                          </>

                          }


                     
                        </View>
              <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%'}}>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

               
              <AntDesign
            name={ 'hearto'}
            color={ global.primaryColor }
            size={ResponsiveSize(22)}
          />

          <TextC
            text={`${data?.likes_count} Likes`}
            style={{
              color: global.placeholderColor,
              paddingVertical: ResponsiveSize(2),
            }}
            font={'Montserrat-Medium'}
            size={ResponsiveSize(11)}
          />
           </View>
              <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <Image
              source={CommnetLight}
              style={{ height: ResponsiveSize(20), width: ResponsiveSize(20) }}
            />

          <TextC
            text={`${data?.comments_count} Comments`}
            style={{
              color: global.placeholderColor,
              paddingVertical: ResponsiveSize(2),
            }}
            font={'Montserrat-Medium'}
            size={ResponsiveSize(11)}
          />
          </View>
              </View>
                    </Pressable>
                    </>
                    )):null
                  }
                    <>
{!isVisible ?(
  <Pressable onPress={() => setUserFilter(true)}  style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}} >
  <TextC text={"Load More"} font={'Montserrat-SemiBold'} size={ResponsiveSize(12)}/>
  </Pressable>
):isVisible && postfilter ? (
  <Pressable onPress={() => setUserFilter(true)}  style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}} >
  <TextC text={"Load More"} font={'Montserrat-SemiBold'} size={ResponsiveSize(12)}/>
  </Pressable>
):null

}

</>
                    </>
                  
                ) : (
                  <>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <TextC
                        size={ResponsiveSize(10)}
                        font={'Montserrat-Medium'}
                        text={'No result found'}
                      />
                    </View>
                  </>
                )}
            </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Position */}
      <Modal
        isVisible={isPositionVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setPositionVisible(false)}
        statusBarTranslucent={false}>
        <View style={styles.modalTopLayer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(15), width: '100%' }}>
            <TextC text={"Position"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
            <TouchableOpacity onPress={() => ClearPosition()} style={{ padding: ResponsiveSize(5) }}>
              <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
            </TouchableOpacity>
          </View>

          {PositionData.map(positions =>
            <TouchableOpacity onPress={() => AddPositions(positions?.data)} style={styles.SelectOptions}>
              <TextC
                key={positions?.data}
                size={ResponsiveSize(12)}
                font={'Montserrat-Regular'}
                text={positions?.label}
                style={{ color: global.black }}
              />

              {position.includes(positions?.data) && (
                <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </Modal>
      {/* Position */}

      {/* AirLine */}
      <Modal
        isVisible={isAirLineVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setAirLineVisible(false)}
        statusBarTranslucent={false}>
        <View style={styles.AirlineLayer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(10), width: '100%' }}>
            <TextC text={"Airline"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
            <TouchableOpacity onPress={() => ClearAirline()} style={{ padding: ResponsiveSize(5) }}>
              <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.AirlineBoundries} showsVerticalScrollIndicator={false}>
            {allAirLine?.map(AirLine =>
              <TouchableOpacity onPress={() => AddAirLine(AirLine?.airline_id)} style={styles.SelectOptions}>
                <TextC
                  key={AirLine?.airline_id}
                  size={ResponsiveSize(12)}
                  font={'Montserrat-Regular'}
                  text={AirLine?.title}
                  style={{ color: global.black }}
                />

                {airLine.includes(AirLine?.airline_id) && (
                  <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* AirLine */}

      {/* Country */}
      <Modal
        isVisible={isCountryVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setCountryVisible(false)}
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
            {allCountriesData?.filter(item => item?.name.toLowerCase().includes(SearchCountry.toLowerCase())).map(AirLine =>
              <TouchableOpacity onPress={() => AddCountry(AirLine?.name)} style={styles.SelectOptions}>
                <TextC
                  key={AirLine?.name}
                  size={ResponsiveSize(12)}
                  font={'Montserrat-Regular'}
                  text={AirLine?.name}
                  style={{ color: global.black }}
                />

                {country == AirLine?.name && (
                  <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* Country */}

      {/* State */}
      <Modal
        isVisible={isStateVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setStateVisible(false)}
        statusBarTranslucent={false}>
        <View style={styles.CountryModalLayers}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(10), width: '100%' }}>
            <TextC text={"State"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
            <TouchableOpacity onPress={() => ClearState()} style={{ padding: ResponsiveSize(5) }}>
              <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
            </TouchableOpacity>
          </View>

          <TextInput value={SearchState} onChangeText={(e) => setSearchState(e)} placeholder='Search State' style={styles.ModalSearchBar} />
          <ScrollView style={styles.AirlineBoundries} showsVerticalScrollIndicator={false}>
            {allStateData?.filter(item => item?.name.toLowerCase().includes(SearchState.toLowerCase())).map(AirLine =>
              <TouchableOpacity onPress={() => AddState(AirLine?.name)} style={styles.SelectOptions}>
                <TextC
                  key={AirLine?.name}
                  size={ResponsiveSize(12)}
                  font={'Montserrat-Regular'}
                  text={AirLine?.name}
                  style={{ color: global.black }}
                />

                {state == AirLine?.name && (
                  <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* State */}

      {/* City */}
      <Modal
        isVisible={isCityVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setCityVisible(false)}
        statusBarTranslucent={false}>
        <View style={styles.CountryModalLayers}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(10), width: '100%' }}>
            <TextC text={"City"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
            <TouchableOpacity onPress={() => ClearCity()} style={{ padding: ResponsiveSize(5) }}>
              <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
            </TouchableOpacity>
          </View>
          <TextInput value={SearchCity} onChangeText={(e) => setSearchCity(e)} placeholder='Search City' style={styles.ModalSearchBar} />
          <ScrollView style={styles.AirlineBoundries} showsVerticalScrollIndicator={false}>
            {allCityData?.filter(item => item?.toLowerCase().includes(SearchCity.toLowerCase())).map(AirLine =>
              <TouchableOpacity onPress={() => AddCity(AirLine)} style={styles.SelectOptions}>
                <TextC
                  key={AirLine}
                  size={ResponsiveSize(12)}
                  font={'Montserrat-Regular'}
                  text={AirLine}
                  style={{ color: global.black }}
                />

                {city == AirLine && (
                  <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* City */}

      {/* Time */}
      <Modal
        isVisible={isTimeVisible}
        style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setTimeVisible(false)}
        statusBarTranslucent={false}>
        <View style={styles.modalTopLayer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(10), width: '100%' }}>
            <TextC text={"Time"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
            <TouchableOpacity onPress={() => ClearTime()} style={{ padding: ResponsiveSize(5) }}>
              <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
            </TouchableOpacity>
          </View>
          {TimeData.map(positions =>
            <TouchableOpacity onPress={() => AddTime(positions?.key)} style={styles.SelectOptions}>
              <TextC
                key={positions?.key}
                size={ResponsiveSize(12)}
                font={'Montserrat-Regular'}
                text={positions?.label}
                style={{ color: global.black }}
              />

              {stayTime == positions?.key && (
                <AntDesign name='checkcircleo' color='green' size={ResponsiveSize(16)} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </Modal>
      {/* Time */}
    </>
  );
};
function mapStateToProps({ RegisterUserReducer }) {
  return { RegisterUserReducer };
}
export default connect(mapStateToProps, UserRegisterAction)(SearchUser);