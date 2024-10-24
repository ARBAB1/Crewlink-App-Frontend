import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Image, Dimensions, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from 'react-native-vector-icons/AntDesign'
import TextC from "../components/text/text";
import { useNavigation } from "@react-navigation/native";
import * as PostCreationAction from '../store/actions/PostCreation/index';
import { connect } from 'react-redux';
import { FlashList } from "@shopify/flash-list";
import { useSWRConfig } from "swr";
import { TextInput } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { RefreshControl } from "react-native";
import FastImage from "react-native-fast-image";



const TagPeople = ({ InclideConnection, SearchConnection, ExludeConnection, PostCreationReducer }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation()
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: global.white,
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(10)
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
            borderWidth: ResponsiveSize(1),
            borderColor: '#EEEEEE'
        },
        AddedPeopleList: {
            padding: ResponsiveSize(15),
        },
        ListOfSearch: {
            paddingVertical: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: "#EEEEEE",
            paddingHorizontal: ResponsiveSize(15),
            borderRadius: ResponsiveSize(5),
            borderColor: global.description,
            borderWidth: 1
        },
        ProfileImage: {
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            borderRadius: ResponsiveSize(30),
            marginRight: ResponsiveSize(5),
            backgroundColor: global.description
        },
        Wrapper: {
            padding: ResponsiveSize(5),
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'space-between',
            position: "relative",
            marginBottom: ResponsiveSize(10),
        },
        UpcomingImage: {
            width: ResponsiveSize(100),
            height: ResponsiveSize(100),
            borderRadius: ResponsiveSize(25)
        },
        UpcomingContent: {
            paddingLeft: 10
        },
        SearchInputWrapper: {
            position: 'relative',
        },
        SearchInput: {
            borderRadius: ResponsiveSize(20),
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            fontSize: ResponsiveSize(12),
            fontFamily: 'Montserrat-Medium',
            borderColor: global.description,
            borderWidth: ResponsiveSize(1),
            position: 'relative',
            paddingLeft: ResponsiveSize(35),
        },
        SearchIcon: {
            position: 'absolute',
            top: ResponsiveSize(8),
            left: ResponsiveSize(10),
        },
    })
    const ExcludeConections = async (r) => {
        ExludeConnection(r)
    }
    const renderItem = useCallback((items) => {
        return (
            <>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: ResponsiveSize(8) }} onPress={() => InclideConnection(items?.item)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: "#d5d5d5", borderRadius: ResponsiveSize(50) }}>
                            <FastImage
                                source={
                                    items?.item?.profile_picture_url === ''
                                        ? require('../assets/icons/avatar.png')
                                        : {
                                            uri: items?.item?.profile_picture_url,
                                            priority: FastImage.priority.high,
                                        }
                                }
                                style={{ width: ResponsiveSize(50), height: ResponsiveSize(50), borderRadius: ResponsiveSize(50) }}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={styles.UpcomingContent}>
                            <TextC text={items?.item?.user_name} font={"Montserrat-Bold"} size={ResponsiveSize(12)} style={{ width: ResponsiveSize(100) }} ellipsizeMode={"tail"} numberOfLines={1} />
                            <TextC text={items?.item?.user_type == "PILOT" ? "Pilot" : items?.item?.user_type == "FLIGHT ATTENDANT" ? "Flight attendent" : items?.item?.user_type == "TECHNICIAN" ? "Technician" : ""} style={{ color: global.placeholderColor, paddingVertical: ResponsiveSize(2) }} font={'Montserrat-Medium'} size={ResponsiveSize(11)} />
                        </View>
                    </View>
                </Pressable>
            </>
        );
    }, []);
    const [search, setSearch] = useState("")
    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loader, setLoader] = useState(false)
    const [renderLength, setRenderLength] = useState(10)
    const [refreshing, setRefreshing] = React.useState(false);

    const allEventDataLoader = async () => {
        setLoader(true)
        const loadAllevent = await SearchConnection({ page: 1, search: search })
        if (loadAllevent?.length >= 25) {
            setDataList(loadAllevent)
            setHasMore(true)
            setLoader(false)
        }
        else {
            setDataList(loadAllevent)
            setHasMore(false)
            setLoader(false)
        }
    }
    useEffect(() => {
        allEventDataLoader()
    }, [page, search]);
    const onRefresh = async () => {
        allEventDataLoader()
        setPage(1)
        setDataList([])
        setRefreshing(false);
    }
    const headerHeight = useHeaderHeight();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flexGrow: 1 }}
            keyboardVerticalOffset={
                Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
            }>
            <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
                <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
                <View style={styles.wrapper}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={"#05348E"} size={ResponsiveSize(16)} />
                        <Image source={require('../assets/icons/Logo.png')} style={{ objectFit: 'contain', width: ResponsiveSize(70), height: ResponsiveSize(22) }} />
                    </TouchableOpacity>
                    <View style={styles.logoSide2}>
                        <TextC font={'Montserrat-SemiBold'} text={"Mention"} />
                    </View>
                    <View style={styles.logoSide3}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.NextBtn}><TextC size={ResponsiveSize(11)} text={'Next'} font={'Montserrat-SemiBold'} /></TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingHorizontal: ResponsiveSize(15), paddingVertical: ResponsiveSize(10) }}>
                    <View style={styles.SearchInputWrapper}>
                        <AntDesign style={styles.SearchIcon} name='search1' color={global.primaryColor} size={ResponsiveSize(20)} />
                        <TextInput onChangeText={(e) => setFilterText(e)} style={styles.SearchInput} placeholder="Search" />
                    </View>
                </View>
                {loader ? (
                    <>
                        <SafeAreaView style={{ flex: 1 }}>
                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size={'large'} color={global.primaryColor} />
                            </ScrollView>
                        </SafeAreaView>
                    </>
                ) : loader == false && dataList?.length <= 0 ? (
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        } style={styles.notFound}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(180) }}>
                            <TextC text={"No Connections Right Now"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} />
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"We couldn't find any connections right now. Try to Create"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View>
                        </View>
                    </ScrollView>
                ) : (
                    <>
                        {PostCreationReducer?.searchConnectionData?.map(data => {
                            return (
                                <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: ResponsiveSize(15), height: ResponsiveSize(70) }} onPress={() => ExcludeConections(data)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: "#d5d5d5", borderRadius: ResponsiveSize(50) }}>
                                            <FastImage
                                                source={
                                                    data?.profile_picture_url === ''
                                                        ? require('../assets/icons/avatar.png')
                                                        : {
                                                            uri: data?.profile_picture_url,
                                                            priority: FastImage.priority.high,
                                                        }
                                                }
                                                style={{ width: ResponsiveSize(50), height: ResponsiveSize(50), borderRadius: ResponsiveSize(50) }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View style={styles.UpcomingContent}>
                                            <TextC text={data?.user_name} font={"Montserrat-Bold"} size={ResponsiveSize(12)} style={{ width: ResponsiveSize(100) }} ellipsizeMode={"tail"} numberOfLines={1} />
                                            <TextC text={data?.user_type == "PILOT" ? "Pilot" : data?.user_type == "FLIGHT ATTENDANT" ? "Flight attendent" : data?.user_type == "TECHNICIAN" ? "Technician" : ""} style={{ color: global.placeholderColor, paddingVertical: ResponsiveSize(2) }} font={'Montserrat-Medium'} size={ResponsiveSize(11)} />
                                        </View>
                                    </View>
                                    <View>
                                        <AntDesign name="checkcircleo" size={ResponsiveSize(22)} color={global.secondaryColor} />
                                    </View>
                                </Pressable>
                            )
                        })}
                        <View style={{ height: ResponsiveSize(1), width: windowWidth, backgroundColor: "#EEEEEE" }}></View>
                        <FlashList
                            onRefresh={onRefresh}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={10}
                            refreshing={refreshing}
                            data={dataList.filter(obj2 =>
                                !PostCreationReducer?.searchConnectionData.some(obj1 => obj1.user_id === obj2.user_id)
                            )}
                            keyExtractor={(items, index) => index?.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            onEndReached={() => { hasMore && setPage(page + 1) }}
                            onEndReachedThreshold={0.5}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingHorizontal: ResponsiveSize(15) }}
                        />
                    </>
                )}

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

function mapStateToProps({ PostCreationReducer }) {
    return { PostCreationReducer };
}
export default connect(mapStateToProps, PostCreationAction)(TagPeople);