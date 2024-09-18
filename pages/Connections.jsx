import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import TextC from '../components/text/text';
import { global, ResponsiveSize } from '../components/constant';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AllConnections from '../components/connectionList/AllConnections.jsx';
import PendingConnections from '../components/connectionList/PendingConnections.jsx';

const Connections = ({ route }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowheight = Dimensions.get('window').height;
  const scheme = useColorScheme();
  const [tabSlider, useTabSlider] = useState(1);
  const innerBody = windowWidth - ResponsiveSize(30);
  const left = useSharedValue('0%');
  const [allEventPage, useAllEventPage] = useState(1);
  const [joinedEventPage, useJoinedEventPage] = useState(1);

  const handlePress = r => {
    left.value = withTiming(r == 1 ? '0%' : r == 2 ? '50%' : '0%');
  };

  const tabActivator = r => {
    useTabSlider(r);
    handlePress(r);
  };
  useEffect(() => {
    useTabSlider(1);
    handlePress(1);
  }, []);

  const TabContent = () => {
    switch (tabSlider) {
      case 1:
        return (
          <AllConnections page={allEventPage} pageChange={useAllEventPage} />
        );
      case 2:
        return (
          <PendingConnections
            page={joinedEventPage}
            pageChange={useJoinedEventPage}
            tabActivator={tabActivator}
          />
        );
      default:
        return null;
    }
  };
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(15),
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
    container: {
      flex: 1,
      backgroundColor: global.white,
    },
    bodyWrapper: {
      paddingHorizontal: ResponsiveSize(15),
      paddingTop: ResponsiveSize(5),
    },
    tabWrapper: {
      width: innerBody,
      flexDirection: 'row',
      alignItems: 'center',
    },
    TabSlider: {
      borderWidth: 0,
      borderColor: global.primaryColor,
      height: ResponsiveSize(50),
      backgroundColor: '#A8B8D8',
      borderRadius: ResponsiveSize(60),
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
    },
    notificationTab: {
      height: ResponsiveSize(50),
      backgroundColor: global.white,
      borderRadius: ResponsiveSize(60),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      borderWidth: 1,
      borderColor: global.primaryColor,
    },
    TopTab: {
      width: '50%',
      height: ResponsiveSize(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    TopTabAbsolute: {
      width: '50%',
      height: ResponsiveSize(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      zIndex: 1,
      backgroundColor: global.primaryColor,
      borderRadius: ResponsiveSize(60),
      borderWidth: 1,
      borderColor: global.primaryColor,
    },
    Content: {
      paddingVertical: ResponsiveSize(20),
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={styles.wrapper}>
        <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
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
            text={'Connection'}
          />
        </View>
        <View style={styles.logoSide3}>
          {/* 
        <TouchableOpacity
          style={styles.logoSide3}
          onPress={() => navigation.navigate('SearchUser')}>
          <AntDesign
            name="search1"
            color={global.primaryColor}
            size={ResponsiveSize(22)}
          />
        </TouchableOpacity> */}
        </View>

      </View>
      <View style={styles.bodyWrapper}>
        <View style={styles.tabWrapper}>
          <View style={styles.TabSlider}>
            <Animated.View
              style={{
                ...styles.TopTabAbsolute,
                left,
              }}>
              <TextC
                text={
                  tabSlider == 1
                    ? 'All Connections'
                    : tabSlider == 2
                      ? 'Pending'
                      : ''
                }
                style={{ color: 'white' }}
                font={'Montserrat-Medium'}
                size={ResponsiveSize(11)}
              />
            </Animated.View>
            <TouchableOpacity
              onPress={() => {
                tabActivator(1);
              }}
              style={styles.TopTab}>
              <TextC
                text={'All Connections'}
                font={'Montserrat-Medium'}
                size={ResponsiveSize(11)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                tabActivator(2);
              }}
              style={styles.TopTab}>
              <TextC
                text={'Pending'}
                font={'Montserrat-Medium'}
                size={ResponsiveSize(11)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          ...styles.bodyWrapper,
          paddingTop: ResponsiveSize(10),
          flex: 1,
        }}>
        <TabContent />
      </View>
    </SafeAreaView>
  );
};

export default Connections;




























// import React, {useEffect, useState} from 'react';
// import {
//   DarkTheme,
//   Dimensions,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   View,
//   useColorScheme,
//   TouchableOpacity,
//   Pressable,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import {global, ResponsiveSize} from '../components/constant';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import TextC from '../components/text/text';
// import {useNavigation} from '@react-navigation/native';
// import SearchCenter from '../components/searchBar';
// import {Image} from 'react-native-elements';
// import baseUrl from '../store/config.json';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FastImage from 'react-native-fast-image';

// const SearchUser = () => {
//   const windowWidth = Dimensions.get('window').width;

//   const scheme = useColorScheme();
//   const styles = StyleSheet.create({
//     wrapper: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: windowWidth,
//       paddingHorizontal: ResponsiveSize(15),
//       paddingVertical: ResponsiveSize(15),
//       backgroundColor: global.white,
//     },
//     logoSide1: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'flex-start',
//       width: '33.33%',
//     },
//     logoSide2: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '33.33%',
//     },
//     logoSide3: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'flex-end',
//       width: '33.33%',
//     },
//     SearchCenter: {
//       padding: ResponsiveSize(15),
//     },
//     SearchUserInput: {
//       fontSize: ResponsiveSize(11),
//       paddingHorizontal: global.inputPaddingH,
//       backgroundColor: '#EEEEEE',
//       width: global.inputWidth,
//       fontFamily: 'Montserrat-Regular',
//       height: global.inputHeight,
//       color: global.black,
//       borderRadius: ResponsiveSize(30),
//       borderWidth: 1,
//       borderColor: global.description,
//       zIndex: 2,
//     },
//     ListOfSearch: {
//       paddingVertical: ResponsiveSize(5),
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//     },
//     ProfileImage: {
//       height: ResponsiveSize(30),
//       width: ResponsiveSize(30),
//       borderRadius: ResponsiveSize(30),
//       marginRight: ResponsiveSize(5),
//       backgroundColor: global.description,
//     },
//     UpcomingContent: {
//       paddingLeft: 10,
//     },
//   });
//   const navigation = useNavigation();
//   const [searchedUser, setSearchedUser] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState('');

//   const LoadUserId = async () => {
//     const U_id = await AsyncStorage.getItem('U_id');
//     setUserId(U_id);
//   };
//   useEffect(() => {
//     SearchUsers();
//     LoadUserId();
//   }, []);

//   const SearchUsers = async (e = null) => {
//     setLoading(true);
//     const Token = await AsyncStorage.getItem('Token');
//     const response = await fetch(
//       `${baseUrl.baseUrl}/users/get-users-for-connection-list?${
//         e == null ? '' : `search=${e}`
//       }`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': baseUrl.apiKey,
//           accesstoken: `Bearer ${Token}`,
//         },
//       },
//     );
//     const result = await response.json();
//     setSearchedUser(result);
//     console.log(result[2],'rejeact');
//     setLoading(false);
//   };

//   const [userConnectLoading, setUserConnectLoading] = useState({
//     value: false,
//     id: '',
//   });
//   const ConnectUser = async e => {
//     setUserConnectLoading({
//       value: true,
//       id: e,
//     });
//     const Token = await AsyncStorage.getItem('Token');
//     const response = await fetch(
//       `${baseUrl.baseUrl}/connect/request-connection`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': baseUrl.apiKey,
//           accesstoken: `Bearer ${Token}`,
//         },
//         body: JSON.stringify({user_id: e}),
//       },
//     );
//     const result = await response.json();
//     console.log(result,'resultconnected')
//     if (result.statusCode === 200) {
//       SearchUsers();
//       setUserConnectLoading({
//         value: false,
//         id: '',
//       });
//     }
//     setUserConnectLoading({
//       value: false,
//       id: '',
//     });
//   };

//   const RejectRequest = async e => {
//     setUserConnectLoading({
//       value: true,
//       id: e,
//     });
//     const Token = await AsyncStorage.getItem('Token');
//     const response = await fetch(
//       `${baseUrl.baseUrl}/connect/reject-connection-request`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': baseUrl.apiKey,
//           accesstoken: `Bearer ${Token}`,
//         },
//         body: JSON.stringify({user_id: e}),
//       },
//     );
//     const result = await response.json();
//     console.log(result, e, 'cancelRequestResult');
//     if (result.statusCode === 200) {
//       SearchUsers();
//       setUserConnectLoading({
//         value: false,
//         id: '',
//       });
//     }
//     setUserConnectLoading({
//       value: false,
//       id: '',
//     });
//   };
//   return (
//     <>
//       <SafeAreaView style={{flex: 1}}>
//         <StatusBar
//           backgroundColor={
//             scheme === 'dark' ? DarkTheme.colors.background : 'white'
//           }
//           barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
//         />
//         <View style={styles.wrapper}>
//           <Pressable
//             onPress={() => navigation.goBack()}
//             style={styles.logoSide1}>
//             <AntDesign
//               name="left"
//               color={global.primaryColor}
//               size={ResponsiveSize(22)}
//             />
//           </Pressable>
//           <View style={styles.logoSide2}>
//             <TextC
//               size={ResponsiveSize(13)}
//               font={'Montserrat-Bold'}
//               text={'Search'}
//             />
//           </View>
//           <TouchableOpacity style={styles.logoSide3}></TouchableOpacity>
//         </View>
//         <ScrollView
//           contentContainerStyle={{
//             flexGrow: 1,
//             backgroundColor: global.white,
//           }}>
//           <View style={styles.SearchCenter}>
//             <TextInput
//               style={styles.SearchUserInput}
//               placeholder="Search Users"
//               onChangeText={e => SearchUsers(e)}
//             />
//           </View>

//           <View style={styles.SearchCenter}>
//             {loading ? (
//               <ActivityIndicator size={'large'} color={global.primaryColor} />
//             ) : (
//               <>
//                 {searchedUser !== undefined &&
//                 searchedUser !== null &&
//                 searchedUser !== '' &&
//                 searchedUser?.length > 0 ? (
//                   searchedUser.map(data => (
//                     <View style={styles.ListOfSearch}>
//                       <View
//                         style={{flexDirection: 'row', alignItems: 'center'}}>
//                         <FastImage
//                           style={styles.ProfileImage}
//                           source={{
//                             uri: data?.profile_picture_url,
//                             priority: FastImage.priority.high,
//                           }}
//                         />
//                         <View style={styles.UpcomingContent}>
//                           <TextC
//                             text={data.user_name}
//                             font={'Montserrat-Bold'}
//                             size={ResponsiveSize(12)}
//                             style={{width: ResponsiveSize(160)}}
//                             ellipsizeMode={'tail'}
//                             numberOfLines={1}
//                           />
//                           <TextC
//                             text={
//                               data.user_type == 'PILOT'
//                                 ? 'Pilot'
//                                 : data.user_type == 'FLIGHT ATTENDANT'
//                                 ? 'Flight attendent'
//                                 : data?.user_type == 'TECHNICIAN'
//                                 ? 'Technician'
//                                 : ''
//                             }
//                             style={{
//                               color: global.placeholderColor,
//                               paddingVertical: ResponsiveSize(2),
//                             }}
//                             font={'Montserrat-Medium'}
//                             size={ResponsiveSize(11)}
//                           />
//                         </View>
//                       </View>
//                       {data?.connectionsStatus == null ? (
//                         <TouchableOpacity
//                           disabled={userConnectLoading.value}
//                           style={{
//                             color: global.white,
//                             backgroundColor: global.secondaryColor,
//                             paddingHorizontal: ResponsiveSize(15),
//                             paddingVertical: ResponsiveSize(3),
//                             borderRadius: ResponsiveSize(10),
//                             overflow: 'hidden',
//                           }}
//                           onPress={() => ConnectUser(data?.user_id)}>
//                           {userConnectLoading.value == true &&
//                           userConnectLoading.id == data?.user_id ? (
//                             <ActivityIndicator
//                               size={'small'}
//                               color={global.white}
//                             />
//                           ) : (
//                             <TextC
//                               size={ResponsiveSize(10)}
//                               font={'Montserrat-Medium'}
//                               text={'Connect'}
//                               style={{color: 'white'}}
//                             />
//                           )}
//                         </TouchableOpacity>
//                       ) : data?.connectionsStatus?.status == 'REJECTED' ? (
//                         <Pressable
//                           disabled={userConnectLoading.value}
//                           style={{
//                             color: global.white,
//                             backgroundColor: global.secondaryColor,
//                             paddingHorizontal: ResponsiveSize(15),
//                             paddingVertical: ResponsiveSize(3),
//                             borderRadius: ResponsiveSize(10),
//                             overflow: 'hidden',
//                           }}
//                           >
//                           {userConnectLoading.value == true &&
//                           userConnectLoading.id == data?.user_id ? (
//                             <ActivityIndicator
//                               size={'small'}
//                               color={global.primaryColor}
//                             />
//                           ) : (
//                             <TextC
//                               size={ResponsiveSize(10)}
//                               font={'Montserrat-Medium'}
//                               text={'Connect'}
//                               style={{color: 'white'}}
//                             />
//                           )}
//                         </Pressable>
//                       ) : data?.connectionsStatus?.status == 'PENDING' &&
//                         data?.connectionsStatus?.sender == userId ? (
//                         <Pressable
//                           disabled={userConnectLoading.value}
//                           style={{
//                             color: global.white,
//                             backgroundColor: global.red,
//                             paddingHorizontal: ResponsiveSize(15),
//                             paddingVertical: ResponsiveSize(3),
//                             borderRadius: ResponsiveSize(10),
//                             overflow: 'hidden',
//                           }}
//                           >
//                           {userConnectLoading.value == true &&
//                           userConnectLoading.id == data?.user_id ? (
//                             <ActivityIndicator
//                               size={'small'}
//                               color={global.white}
//                             />
//                           ) : (
//                             <TextC
//                               size={ResponsiveSize(10)}
//                               font={'Montserrat-Medium'}
//                               text={'Pending'}
//                               style={{
//                                 color: global.white,
//                               }}
//                             />
//                           )}
//                         </Pressable>
//                       ) : data?.connectionsStatus?.status == 'PENDING' &&
//                         data?.connectionsStatus?.receiver_id == userId ? (
//                         <Pressable
//                           disabled={userConnectLoading.value}
//                           style={{
//                             color: global.white,
//                             backgroundColor: global.red,
//                             paddingHorizontal: ResponsiveSize(15),
//                             paddingVertical: ResponsiveSize(3),
//                             borderRadius: ResponsiveSize(10),
//                             overflow: 'hidden',
//                           }}
//                           >
//                           {userConnectLoading.value == true &&
//                           userConnectLoading.id == data?.user_id ? (
//                             <ActivityIndicator
//                               size={'small'}
//                               color={global.white}
//                             />
//                           ) : (
//                             <TextC
//                               size={ResponsiveSize(10)}
//                               font={'Montserrat-Medium'}
//                               text={'Pending'}
//                               style={{
//                                 color: global.white,
//                               }}
//                             />
//                           )}
//                         </Pressable>
//                       ) : data?.connectionsStatus?.status == 'ACCEPTED' ? (
//                         <Pressable
//                           disabled={userConnectLoading.value}
//                           style={{
//                             color: global.white,
//                             backgroundColor: global.red,
//                             paddingHorizontal: ResponsiveSize(15),
//                             paddingVertical: ResponsiveSize(3),
//                             borderRadius: ResponsiveSize(10),
//                             overflow: 'hidden',
//                           }}
//                           >
//                           {userConnectLoading.value == true &&
//                           userConnectLoading.id == data?.user_id ? (
//                             <ActivityIndicator
//                               size={'small'}
//                               color={global.white}
//                             />
//                           ) : (
//                             <TextC
//                               size={ResponsiveSize(10)}
//                               font={'Montserrat-Medium'}
//                               text={'Disconnect'}
//                               style={{
//                                 color: global.white,
//                               }}
//                             />
//                           )}
//                         </Pressable>
//                       ) : (
//                         ''
//                       )}
//                     </View>
//                   ))
//                 ) : (
//                   <>
//                     <View
//                       style={{
//                         flex: 1,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         flexDirection: 'row',
//                       }}>
//                       <TextC
//                         size={ResponsiveSize(10)}
//                         font={'Montserrat-Medium'}
//                         text={'No result found'}
//                       />
//                     </View>
//                   </>
//                 )}
//               </>
//             )}
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };
// export default SearchUser;
