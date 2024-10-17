import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { global, ResponsiveSize } from '../components/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextC from '../components/text/text';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modal';
import * as AllConnectionsAction from '../store/actions/Connections/index';
import { connect } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import { Image } from 'react-native-elements';

const PrivacySetting = ({
  getAllConnections,
  CheckCustomConnections,
  AddCustomConnections,
  AddCheckInPrivacy,
  AddAccountPrivacy,
  getAllPrivacy,
  getAllClosedConnections,
  DeleteCustomConnections,
  UpdateCustomConnections,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [page, setPage] = useState(1);
  const [AccountPrivacy, setAccountPrivacy] = useState('');
  const [CheckInPrivacy, setCheckInPrivacy] = useState('');
  const [allConnectionData, setAllConnectionData] = useState([]);
  const [closedConnections, setClosedConnections] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isConnectionVisible, setConnectionVisible] = useState(false);
  const [customSetting, setCustomSetting] = useState(null);
  const [privacyData, setPrivacyData] = useState();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: ResponsiveSize(55),
      backgroundColor: global.white,
      paddingHorizontal: ResponsiveSize(15),
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
      backgroundColor: '#69BE25',
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(4),
      borderRadius: ResponsiveSize(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    SearchCenter: {
      padding: ResponsiveSize(15),
    },
    SelectOptions: {
      backgroundColor: '#EEEEEE',
      width: '100%',
      paddingHorizontal: ResponsiveSize(10),
      padding: ResponsiveSize(5),
      borderRadius: ResponsiveSize(10),
      marginTop: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: ResponsiveSize(10),
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
      justifyContent: 'center',
    },
    IndicatorDot: {
      position: 'absolute',
      height: ResponsiveSize(10),
      width: ResponsiveSize(10),
      borderRadius: ResponsiveSize(10),
      backgroundColor: global.secondaryColor,
      top: ResponsiveSize(-4),
      right: ResponsiveSize(8),
    },
    AirlineBoundries: {
      height: windowHeight * 0.4,
      width: '100%',
      overflow: 'hidden',
      paddingBottom: ResponsiveSize(5),
    },
    ModalSearchBar: {
      backgroundColor: '#EEEEEE',
      width: '100%',
      fontFamily: 'Montserrat-Medium',
      paddingHorizontal: ResponsiveSize(10),
      paddingVertical: ResponsiveSize(5),
      borderRadius: ResponsiveSize(10),
      marginBottom: ResponsiveSize(10),
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
      justifyContent: 'center',
    },
    AddButton: {
      backgroundColor: '#69BE25',
      padding: ResponsiveSize(10),
   
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
    },
    EditButton: {
      backgroundColor: '#FFA500',
      padding: ResponsiveSize(10),
      borderRadius: 8,
      paddingHorizontal: ResponsiveSize(100),
      marginTop: 10,
      alignItems: 'center',
    },
    DeleteButton: {
      backgroundColor: '#FF0000',
      padding: ResponsiveSize(10),
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
    },
  });

  const ClearCountry = () => {
    setSelectedConnections([]);
  };

  const AddOrRemoveConnection = user_id => {
    setSelectedConnections(prev => {
      if (prev.includes(user_id)) {
        return prev?.filter(id => id !== user_id); // Remove if already selected
      } else {
        return [...prev, user_id]; // Add to selected
      }
    });
  };

  const AccountPrivacyHandler = async value => {
    setAccountPrivacy(value);
    await AddAccountPrivacy(value);
  };

  const CheckInPrivacyHandler = async value => {
    setCheckInPrivacy(value);
    await AddCheckInPrivacy(value);
  };

  const LoadConnections = async () => {
    const loadAllevent = await getAllConnections({ page });
    setAllConnectionData(loadAllevent);
  };

  const LoadClosedConnections = async () => {
    const response = await getAllClosedConnections();
    setClosedConnections(response.users);
  };

  const LoadPrivacy = async () => {
    const loadAllPrivacy = await getAllPrivacy();
    setAccountPrivacy(loadAllPrivacy.profile_visibility);
    setCheckInPrivacy(loadAllPrivacy.checkin_visibility);
    setPrivacyData(loadAllPrivacy);
  };

  const CheckCustomSettings = async () => {
    const response = await CheckCustomConnections();
    if (response?.custom_setting_flag === 'Y') {
      setCustomSetting(true);
    } else {
      setCustomSetting(false);
    }
  };

  const handleAddCustomConnections = async () => {
    await AddCustomConnections(selectedConnections);
    setConnectionVisible(false);
    CheckCustomSettings();
  };

  const handleUpdateCustomConnections = async () => {
    await UpdateCustomConnections(selectedConnections);
    setConnectionVisible(false);
    CheckCustomSettings();
  };

  // const handleDeleteCustomConnections = async () => {
  //   await DeleteCustomConnections(selectedConnections);
  //   setConnectionVisible(false);
  //   CheckCustomSettings();
  // };

  useEffect(() => {
    LoadPrivacy();
    LoadConnections();
    LoadClosedConnections();
    CheckCustomSettings();
  }, []);

  const filteredConnections = allConnectionData?.filter(connection =>
    connection.user_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const isUserInClosedConnections = user_id =>
    closedConnections.some(connection => connection.added_user_id === user_id);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={styles.wrapper}>
          <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
            <AntDesign name="left" color={'#05348E'} size={ResponsiveSize(18)} />
          </Pressable>
          <View style={styles.logoSide2}>
            <TextC size={ResponsiveSize(13)} font={'Montserrat-Bold'} text={'Privacy'} />
          </View>
          <View style={styles.logoSide3} />
        </View>
<ScrollView>


        <View style={styles.SearchCenter}>
          <TextC size={ResponsiveSize(15)} text={'Account'} font={'Montserrat-Bold'} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
            <TextC size={ResponsiveSize(12)} text={'Private account'} font={'Montserrat-SemiBold'} />
            <ModalSelector
              selectStyle={styles.TextFeidContainerRight}
              data={[
                { key: 1, label: 'PUBLIC' },
                { key: 2, label: 'PRIVATE' },
                { key: 3, label: 'FOLLOWERS' },
                { key: 4, label: 'CUSTOM' },
              ]}
              initValue={AccountPrivacy}
              onChange={value => AccountPrivacyHandler(value.label)}
            />
          </View>
          <View style={{ paddingTop: ResponsiveSize(10) }}>
            <TextC
              size={ResponsiveSize(11)}
              text={'restricts access to your profile...'}
              font={'Montserrat-Medium'}
              style={{ color: global.placeholderColor }}
            />
          </View>
        </View>

        <View style={styles.SearchCenter}>
          <TextC size={ResponsiveSize(15)} text={'Check-In'} font={'Montserrat-Bold'} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: ResponsiveSize(15) }}>
            <TextC size={ResponsiveSize(12)} text={'Hide Check-in feature'} font={'Montserrat-SemiBold'} />
            <ModalSelector
              selectStyle={styles.TextFeidContainerRight}
              data={[
                { key: 1, label: 'PUBLIC' },
                { key: 2, label: 'PRIVATE' },
                { key: 3, label: 'FOLLOWERS' },
                { key: 4, label: 'CUSTOM' },
              ]}
              initValue={CheckInPrivacy}
              onChange={e => CheckInPrivacyHandler(e.label)}
            />
          </View>
          <View style={{ paddingTop: ResponsiveSize(10) }}>
            <TextC
              size={ResponsiveSize(11)}
              text={'Turn off commenting to control discussions on your content.'}
              font={'Montserrat-Medium'}
              style={{ color: global.placeholderColor }}
            />
          </View>
        </View>


        <View style={styles.SearchCenter}>
          <TextC size={ResponsiveSize(15)} text={'Group setting'} font={'Montserrat-Bold'} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: ResponsiveSize(15) }}>
            <TextC size={ResponsiveSize(12)} text={'Anyone can add me'} font={'Montserrat-SemiBold'} />
            <ModalSelector
              selectStyle={styles.TextFeidContainerRight}
              data={[
                { key: 1, label: 'PUBLIC' },
                { key: 2, label: 'PRIVATE' },
                { key: 3, label: 'FOLLOWERS' },
                { key: 4, label: 'CUSTOM' },
              ]}
              initValue={CheckInPrivacy}
              onChange={e => CheckInPrivacyHandler(e.label)}
            />
          </View>
          <View style={{ paddingTop: ResponsiveSize(10) }}>
            <TextC
              size={ResponsiveSize(11)}
              text={'Turn off commenting to control discussions on your content.'}
              font={'Montserrat-Medium'}
              style={{ color: global.placeholderColor }}
            />
          </View>
        </View>

     
  <>
  <View style={styles.SearchCenter}>

<TextC size={ResponsiveSize(15)} text={'Blocked Connections'} font={'Montserrat-Bold'} />
<TextC
  size={ResponsiveSize(11)}
  text={'Blocked Connections will not able to see your check-In status and account details '}
  font={'Montserrat-Medium'}
  style={{ color: global.placeholderColor }}
/>
</View>
  <View style={styles.SearchCenter}>

            <TextC size={ResponsiveSize(15)} text={'Connections'} font={'Montserrat-Bold'} />
            <TextC
              size={ResponsiveSize(11)}
              text={'Approved Connections will able to see your check-In status and account details '}
              font={'Montserrat-Medium'}
              style={{ color: global.placeholderColor }}
            />
  </View>

            {!customSetting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: ResponsiveSize(15) }}>
                <TextC size={ResponsiveSize(12)} text={'Add approved followers'} font={'Montserrat-SemiBold'} />
                <TouchableOpacity onPress={() => setConnectionVisible(true)}>
                  <Octicons name="diff-added" color={global.secondaryColor} size={ResponsiveSize(18)} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: ResponsiveSize(15) }}>
                <TextC size={ResponsiveSize(12)} text={'Approved Connections List'} font={'Montserrat-SemiBold'} />
                <TouchableOpacity onPress={() => setConnectionVisible(true)}>
                  <Octicons name="diff-added" color={global.secondaryColor} size={ResponsiveSize(18)} />
                </TouchableOpacity>
              </View>
            )}
          </>
          </ScrollView>
        {/* Modal for selecting connections */}
        <Modal
          isVisible={isConnectionVisible}
          style={{ margin: 0, paddingHorizontal: windowWidth * 0.05 }}
          animationIn={'bounceInUp'}
          avoidKeyboard={true}
          onBackdropPress={() => setConnectionVisible(false)}
          statusBarTranslucent={false}>
          <View style={styles.CountryModalLayers}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: ResponsiveSize(10), width: '100%' }}>
              <TextC text={'Connections'} font={'Montserrat-Bold'} size={ResponsiveSize(15)} />
              <TouchableOpacity onPress={ClearCountry} style={{ padding: ResponsiveSize(5) }}>
                <TextC text={'Uncheck All'} font={'Montserrat-Bold'} style={{ color: global.red }} size={ResponsiveSize(11)} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search Connections"
              style={styles.ModalSearchBar}
            />

            <ScrollView style={styles.AirlineBoundries} showsVerticalScrollIndicator={false}>
              {filteredConnections?.map(connection => (
                <TouchableOpacity
                  key={connection.user_id}
                  onPress={() => AddOrRemoveConnection(connection.user_id)}
                  style={styles.SelectOptions}>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                
                    <Image source={connection?.profile_picture ? { uri: connection?.profile_picture } : require('../assets/icons/avatar.png')} resizeMode="cover" style={{ width: ResponsiveSize(40), height: ResponsiveSize(40), borderRadius: ResponsiveSize(20) }} />
                  <TextC
                    size={ResponsiveSize(12)}
                    font={'Montserrat-Regular'}
                    text={connection.user_name}
                    style={{ color: global.black }}
                  />
                     </View>
                  {isUserInClosedConnections(connection.user_id) ? (
                    <AntDesign name="checkcircleo" color="green" size={ResponsiveSize(16)} />
                  ) : (
                    selectedConnections.includes(connection.user_id) && (
                      <AntDesign name="checkcircleo" color="green" size={ResponsiveSize(16)} />
                    )
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Add/Edit/Delete Custom Connection Button */}
            {!customSetting ? (
              <TouchableOpacity style={styles.AddButton} onPress={handleAddCustomConnections}>
                <TextC text="Add Connections" font="Montserrat-Bold" size={ResponsiveSize(12)} style={{ color: global.white }} />
              </TouchableOpacity>
            ) : (
              <View >
                <TouchableOpacity style={styles.EditButton} onPress={handleUpdateCustomConnections}>
                  <TextC text="Save" font="Montserrat-Bold" size={ResponsiveSize(12)} style={{ color: global.white }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.DeleteButton} onPress={()=>  setConnectionVisible(false)}>
                  <TextC text="Cancel" font="Montserrat-Bold" size={ResponsiveSize(12)} style={{ color: global.white }} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

function mapStateToProps({
  AllConnectionsReducer,
  CustomConnectionsReducer,
  AllPrivacyReducer,
}) {
  return { AllConnectionsReducer, CustomConnectionsReducer, AllPrivacyReducer };
}

export default connect(mapStateToProps, {
  getAllConnections: AllConnectionsAction.getAllConnections,
  getAllPrivacy: AllConnectionsAction.getAllPrivacy,
  CheckCustomConnections: AllConnectionsAction.CheckCustomConnections,
  AddCustomConnections: AllConnectionsAction.AddCustomConnections,
  AddAccountPrivacy: AllConnectionsAction.AddAccountPrivacy,
  AddCheckInPrivacy: AllConnectionsAction.AddCheckInPrivacy,
  getAllClosedConnections: AllConnectionsAction.getAllClosedConnections,
  DeleteCustomConnections: AllConnectionsAction.DeleteCustomConnections,
  UpdateCustomConnections: AllConnectionsAction.UpdateCustomConnections,
})(React.memo(PrivacySetting));
