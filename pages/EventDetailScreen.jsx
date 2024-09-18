import { StyleSheet, SafeAreaView, StatusBar, View, Modal, TouchableOpacity, Dimensions, ScrollView, Animated, Pressable, ActivityIndicator, Image, ImageBackground } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { global, ResponsiveSize } from '../components/constant';
import TextC from '../components/text/text';
import AntDedign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import * as AllEventAction from "../store/actions/Events/index";
import { connect } from "react-redux";
import { useSWRConfig } from 'swr';
import Entypo from 'react-native-vector-icons/Entypo'
import MapView, { Marker } from 'react-native-maps';
import { Text } from 'react-native-elements';
import TimeAgo from '@manu_omg/react-native-timeago';


const EventDetail = ({ route, getEventDetail, DeleteEvent, AllEventReducer, JoinEvents, LeaveEvents, getAllEvents, getJoinedEvents, getMyEvents }) => {
  const { id } = route.params;
  const [eventDetail, setEventDetail] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false);
  const { cache } = useSWRConfig()
  const navigation = useNavigation()
  const { getParent } = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const gMap = useRef(null)
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    loadEventDetail()
    const parent = getParent();
    parent?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: '#69BE25',
          borderTopLeftRadius: ResponsiveSize(20),
          borderTopRightRadius: ResponsiveSize(20)
        },
      });
    };
  }, [])
  const loadEventDetail = async () => {
    setLoading(true)
    const loadingDetail = await getEventDetail({ id })
    if (loadingDetail) {
      setEventDetail(loadingDetail)
      setPosition({
        latitude: Number(loadingDetail?.event_latitude),
        longitude: Number(loadingDetail?.event_longitude),
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
      setLoading(false)
    }
    else {
      setLoading(false)
    }
  }


  const joinEvent = async (id) => {
    const isJoin = await JoinEvents({
      event_id: id
    })
    if (isJoin == true) {
      getAllEvents({ page: 1, refreash: true })
      getJoinedEvents({ page: 1, refreash: true })
      getMyEvents({ page: 1, refreash: true })
      cache?.delete('AllEvent')
      cache?.delete('JoinedEvent')
      cache?.delete('MyEvents')
      navigation.navigate("EventScreen", { Tab: 1 })
    }
    else if (isJoin == false) {
      setDeleteModal(false)
    }
  }
  const leaveEvent = async (id) => {
    const isJoin = await LeaveEvents({
      event_id: id
    })
    if (isJoin == true) {
      getAllEvents({ page: 1, refreash: true })
      getJoinedEvents({ page: 1, refreash: true })
      getMyEvents({ page: 1, refreash: true })
      cache?.delete('AllEvent')
      cache?.delete('JoinedEvent')
      cache?.delete('MyEvents')
      navigation.navigate("EventScreen", { Tab: 1 })
    }
    else if (isJoin == false) {
      setDeleteModal(false)
    }
  }
  const deleteEvent = async (id) => {
    const isDelete = await DeleteEvent(id)
    if (isDelete == true) {
      getAllEvents({ page: 1, refreash: true })
      getJoinedEvents({ page: 1, refreash: true })
      getMyEvents({ page: 1, refreash: true })
      cache?.delete('AllEvent')
      cache?.delete('JoinedEvent')
      cache?.delete('MyEvents')
      navigation.navigate("EventScreen", { Tab: 1 })
    }
    else if (isDelete == false) {
      setDeleteModal(false)
    }
  }
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [ResponsiveSize(300), ResponsiveSize(550)],
  });

  const styles = StyleSheet.create({
    map: {
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: global.white
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: ResponsiveSize(45),
      width: windowWidth - ResponsiveSize(30),
      position: 'absolute',
      top: ResponsiveSize(40),
      left: ResponsiveSize(15),
      zIndex: loading ? 0 : 1,
      elevation: 10,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      backgroundColor: global.white,
      borderRadius: ResponsiveSize(50),
      paddingHorizontal: ResponsiveSize(15),
    },
    backBtn: {
      width: ResponsiveSize(50),
      height: ResponsiveSize(50),
      borderRadius: ResponsiveSize(50),
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    actionBtn: {
      height: ResponsiveSize(50),
      borderRadius: ResponsiveSize(50),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    deleteBtn: {
      backgroundColor: global?.red,
      paddingHorizontal: ResponsiveSize(20),
      borderRadius: ResponsiveSize(50),
      paddingVertical: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

    },
    editBtn: {
      backgroundColor: global?.secondaryColor,
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(5),
      borderRadius: ResponsiveSize(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: ResponsiveSize(5)
    },
    bottomContent: {
      position: 'absolute',
      bottom: ResponsiveSize(0),
      left: ResponsiveSize(0),
      zIndex: loading ? 0 : 1,
      backgroundColor: global.white,
      width: windowWidth,
      elevation: 10,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      borderRadius: ResponsiveSize(30),
      paddingHorizontal: ResponsiveSize(15),
      paddingBottom: ResponsiveSize(20),
      paddingTop: ResponsiveSize(10)
    },
    Expender: {
      height: ResponsiveSize(15),
      width: ResponsiveSize(60),
    },
    ProfileImage: {
      width: ResponsiveSize(40),
      height: ResponsiveSize(40),
      borderRadius: ResponsiveSize(20),
      overflow: 'hidden',
    }
  })

  return (
    <>
      <SafeAreaView style={styles.container}>
        {AllEventReducer?.networkError ?
          <ScrollView style={{ flexGrow: 1, padding: ResponsiveSize(15) }}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={"dark-content"} />
            <View style={{ height: windowHeight, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ paddingBottom: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                <Image style={{ height: ResponsiveSize(80), width: ResponsiveSize(80) }} source={require('../assets/icons/something-went-wrong.png')} />
              </View>
              <TextC text={"Something went wrong"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} />
              <TextC style={{ textAlign: 'center', color: global?.black }} text={"Brace yourself till we get the error fixed"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
            </View>
          </ScrollView> :
          <>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={"dark-content"} />

            {loading ?
              <View style={{ flex: 1, width: '100%', backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={global.secondaryColor} size={'large'} />
              </View>
              :
              <>
                <View style={{ flex: 1 }}>
                  <View style={styles.header}>
                    <View style={styles.backBtn}>
                      <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <AntDedign name="left" size={ResponsiveSize(20)} color={global.black} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      {eventDetail?.is_myevent == 1 ?
                        <View style={styles.actionBtn}>
                          <TouchableOpacity disabled={AllEventReducer?.deleteEventLoading} style={styles.deleteBtn} onPress={() => deleteEvent(eventDetail?.event_id)}>
                            {AllEventReducer?.deleteEventLoading ?
                              <ActivityIndicator color={'white'} size={'small'} /> :
                              <Text style={{ fontFamily: 'Montserrat-Medium', color: global.white }}>Delete</Text>
                            }
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('UpdateEvent', { id: eventDetail?.event_id })}>
                            <Text style={{ fontFamily: 'Montserrat-Medium', color: global.white }}>Edit</Text>
                          </TouchableOpacity>
                        </View> : <>
                          {eventDetail?.is_participant == 1 ?
                            <TouchableOpacity disabled={AllEventReducer?.EventLeaveLoading} style={styles.deleteBtn} onPress={() => leaveEvent(eventDetail?.event_id)}>
                              {AllEventReducer?.EventLeaveLoading ?
                                <ActivityIndicator color={'white'} size={'small'} /> :
                                <Text style={{ fontFamily: 'Montserrat-Medium', color: global.white }}>Leave</Text>
                              }
                            </TouchableOpacity>
                            :
                            <TouchableOpacity disabled={AllEventReducer?.EventJoinLoading} style={styles.editBtn} onPress={() => joinEvent(eventDetail?.event_id)}>
                              {AllEventReducer?.EventJoinLoading ?
                                <ActivityIndicator color={'white'} size={'small'} /> :
                                <Text style={{ fontFamily: 'Montserrat-Medium', color: global.white }}>Join</Text>
                              }
                            </TouchableOpacity>
                          }
                        </>
                      }

                    </View>
                  </View>
                  <MapView
                    ref={gMap}
                    style={styles.map}
                    region={position}
                    focusable
                    loadingEnabled={true}
                  >

                    <Marker
                      title={eventDetail?.event_title}
                      coordinate={position}
                    >
                      <Entypo name="location-pin" size={ResponsiveSize(40)} color={global.primaryColor} />
                    </Marker>
                  </MapView>

                  <Animated.View style={[styles.bottomContent, { height }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <TouchableOpacity onPress={toggleExpand} style={styles.Expender}>
                        <View style={{ height: ResponsiveSize(4), width: ResponsiveSize(50), backgroundColor: global.description, borderRadius: ResponsiveSize(50) }}></View>
                      </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={{ borderRadius: ResponsiveSize(20), overflow: 'hidden' }}>
                        <ImageBackground source={{ uri: eventDetail?.event_cover_image }} style={{ height: ResponsiveSize(150), width: '100%', }}></ImageBackground>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ paddingTop: ResponsiveSize(20), flexDirection: 'row', alignItems: 'center' }}>
                          <AntDedign name='calendar' size={ResponsiveSize(25)} color={global.primaryColor} />
                          <View style={{ paddingLeft: ResponsiveSize(5) }}>
                            <TextC font={'Montserrat-SemiBold'} size={ResponsiveSize(12)} style={{ color: global.placeholderColor }} text={eventDetail?.event_date} />
                          </View>
                        </View>
                        <View style={{ paddingTop: ResponsiveSize(20), flexDirection: 'row', alignItems: 'center', paddingLeft: ResponsiveSize(20) }}>
                          <AntDedign name='clockcircleo' size={ResponsiveSize(25)} color={global.primaryColor} />
                          <View style={{ paddingLeft: ResponsiveSize(5) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <TextC font={'Montserrat-SemiBold'} size={ResponsiveSize(12)} style={{ color: global.placeholderColor }} text={eventDetail?.event_start_time} />
                              <TextC font={'Montserrat-SemiBold'} size={ResponsiveSize(12)} style={{ color: global.placeholderColor }} text={" - "} />
                              <TextC font={'Montserrat-SemiBold'} size={ResponsiveSize(12)} style={{ color: global.placeholderColor }} text={eventDetail?.event_end_time} />
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ paddingTop: ResponsiveSize(15) }}>
                        <TextC font={'Montserrat-Bold'} size={ResponsiveSize(15)} text={eventDetail?.event_title} />
                      </View>
                      <View style={{ paddingTop: ResponsiveSize(5) }}>
                        <TextC font={'Montserrat-Medium'} size={ResponsiveSize(11)} style={{ color: global.placeholderColor }} text={eventDetail?.event_details} />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: ResponsiveSize(15) }}>
                        <ImageBackground source={eventDetail?.profile_picture_url == "" ? require('../assets/icons/avatar.png') : { uri: eventDetail?.profile_picture_url }} style={styles.ProfileImage}></ImageBackground>
                        <View style={{ paddingLeft: ResponsiveSize(10) }}>
                          <TextC font={'Montserrat-Medium'} text={eventDetail?.user_name} />
                          <TimeAgo
                            style={{ fontFamily: "Montserrat-Medium", fontSize: ResponsiveSize(8) }}
                            time={eventDetail?.created_at}
                          />
                        </View>
                      </View>

                    </ScrollView>
                  </Animated.View>
                </View>
              </>
            }


          </>
        }
      </SafeAreaView >
    </>
  )
}

function mapStateToProps({ AllEventReducer }) {
  return { AllEventReducer };
}
export default connect(mapStateToProps, AllEventAction)(EventDetail);
