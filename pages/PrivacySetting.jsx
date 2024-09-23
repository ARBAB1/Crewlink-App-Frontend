import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Image, Dimensions, Switch, TouchableOpacity, TextInput, Pressable, ScrollView } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign'
import TextC from "../components/text/text";
import { useNavigation } from "@react-navigation/native";
import Octicons from 'react-native-vector-icons/Octicons'
import Modal from 'react-native-modal'
import * as AllConnectionsAction from "../store/actions/Connections/index";
import { connect } from "react-redux";

const PrivacySetting = ({ getAllConnections, AllConnectionsReducer }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [page, setPage] = useState(1);
    const [isEnabled, setIsEnabled] = useState(false);


    const navigation = useNavigation()
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "center",
            height: ResponsiveSize(55),
            backgroundColor: global.white,
            paddingHorizontal: ResponsiveSize(15)
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
    })

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [country, setCountry] = useState([])
    const [isCountryVisible, setCountryVisible] = useState(false);
    const [SearchCountry, setSearchCountry] = useState("");
    const [allCountriesData, setAllCountriesData] = useState();

    const ClearCountry = () => {
        setCountry("")
    }

    const AddCountry = async (e) => {
        setCountry([e]);
    }

    const LoadConnections = async () => {
        const loadAllevent = await getAllConnections({ page: page })
        setAllCountriesData(loadAllevent);
    }


    useEffect(() => {
        LoadConnections()
    }, [])
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
                <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
                <View style={styles.wrapper}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={"#05348E"} size={ResponsiveSize(18)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <TextC size={ResponsiveSize(13)} font={'Montserrat-Bold'} text={"Privacy"} />
                    </View>
                    <View style={styles.logoSide3}>
                    </View>
                </View>



                <View style={styles.SearchCenter}>
                    <TextC size={ResponsiveSize(15)} text={'Account'} font={'Montserrat-Bold'} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                        <TextC size={ResponsiveSize(12)} text={'Private account'} font={'Montserrat-SemiBold'} />
                        <Switch
                            trackColor={{ false: '#767577', true: global.secondaryColor }}
                            thumbColor={isEnabled ? 'white' : 'white'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    <View style={{ paddingTop: ResponsiveSize(10) }}>
                        <TextC size={ResponsiveSize(11)} text={'restricts access to your profile, posts, and activity, making them visible only to approved followers or connections. This setting enhances privacy by allowing you to control who can view your content.'} font={'Montserrat-Medium'} style={{ color: global.placeholderColor }} />
                    </View>

                    {isEnabled &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                            <TextC size={ResponsiveSize(12)} text={'Add approved followers'} font={'Montserrat-SemiBold'} />
                            <TouchableOpacity onPress={() => setCountryVisible(true)}>
                                <Octicons name="diff-added" color={global.secondaryColor} size={ResponsiveSize(18)} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>


                <View style={styles.SearchCenter}>
                    <TextC size={ResponsiveSize(15)} text={'Story'} font={'Montserrat-Bold'} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                        <TextC size={ResponsiveSize(12)} text={'Hide stories'} font={'Montserrat-SemiBold'} />
                        <Switch
                            trackColor={{ false: '#767577', true: global.secondaryColor }}
                            ios_backgroundColor="#3e3e3e"
                        // thumbColor={PostCreationReducer?.isCommentOff ? 'white' : 'white'}
                        // onValueChange={() => CommentSwitch(!PostCreationReducer?.isCommentOff)}
                        // value={PostCreationReducer?.isCommentOff}
                        />
                    </View>
                    <View style={{ paddingTop: ResponsiveSize(10) }}>
                        <TextC size={ResponsiveSize(11)} text={'Turn off commenting to control discussions on your content. Keep the focus on the main topic.'} font={'Montserrat-Medium'} style={{ color: global.placeholderColor }} />
                    </View>
                </View>

                <View style={styles.SearchCenter}>
                    <TextC size={ResponsiveSize(15)} text={'Check-in'} font={'Montserrat-Bold'} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                        <TextC size={ResponsiveSize(12)} text={'Hide Check-in feature'} font={'Montserrat-SemiBold'} />
                        <Switch
                            trackColor={{ false: '#767577', true: global.secondaryColor }}
                            ios_backgroundColor="#3e3e3e"
                        // thumbColor={PostCreationReducer?.isCommentOff ? 'white' : 'white'}
                        // onValueChange={() => CommentSwitch(!PostCreationReducer?.isCommentOff)}
                        // value={PostCreationReducer?.isCommentOff}
                        />
                    </View>
                    <View style={{ paddingTop: ResponsiveSize(10) }}>
                        <TextC size={ResponsiveSize(11)} text={'Turn off commenting to control discussions on your content. Keep the focus on the main topic.'} font={'Montserrat-Medium'} style={{ color: global.placeholderColor }} />
                    </View>
                </View>
            </SafeAreaView>


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
                        <TextC text={"Followers"} font={"Montserrat-Bold"} size={ResponsiveSize(15)} />
                        <TouchableOpacity onPress={() => ClearCountry()} style={{ padding: ResponsiveSize(5) }}>
                            <TextC text={"Clear"} font={"Montserrat-Bold"} style={{ color: global.red }} size={ResponsiveSize(11)} />
                        </TouchableOpacity>
                    </View>

                    <TextInput value={SearchCountry} onChangeText={(e) => setSearchCountry(e)} placeholder='Search Followers' style={styles.ModalSearchBar} />
                    <ScrollView style={styles.AirlineBoundries} showsVerticalScrollIndicator={false}>
                        {allCountriesData?.map(AirLine =>
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
        </>
    )
}

function mapStateToProps({ AllConnectionsReducer }) {
    return { AllConnectionsReducer };
}
export default connect(mapStateToProps, AllConnectionsAction)(React.memo(PrivacySetting));