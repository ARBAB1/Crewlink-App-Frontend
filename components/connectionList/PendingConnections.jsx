import React, { useCallback, useEffect, useState, Suspense } from "react";
import { View, StyleSheet, Image, ScrollView, Animated, FlatList, Pressable, ActivityIndicator, SafeAreaView, TouchableOpacity } from "react-native";
import TextC from "../text/text";
import { ResponsiveSize, global } from "../constant";
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import * as AllConnectionsAction from "../../store/actions/Connections/index";
import { connect } from "react-redux";
import TimeAgo from '@manu_omg/react-native-timeago';
import ButtonC from "../button/index";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import FastImage from 'react-native-fast-image'
import { RefreshControl } from "react-native-gesture-handler";
import { useSWRConfig } from "swr";
import { Text } from "react-native-elements";
import Entypo from 'react-native-vector-icons/Entypo'


const PendingConnections = ({ getPendingConnections, PendingConnectionsReducer, AcceptInvitation, RejectInvitation }) => {
    const focus = useIsFocused();
    const navigation = useNavigation()
    const [dataList, setDataList] = useState([])
    const { cache } = useSWRConfig()
    const [page, setPage] = useState(1)
    const [renderLength, setRenderLength] = useState(10)
    const [totalFetchLength, setTotalFetchLength] = useState(100)
    const threshold = totalFetchLength - 30
    const [refreshing, setRefreshing] = React.useState(false);
    const allEventDataLoader = async ({ refreshing, pageRe }) => {
        if (refreshing) {
            const loadAllevent = await getPendingConnections({ page: pageRe })
            cacheloader(loadAllevent?.connectionRequests)
        }
        else if (!refreshing) {
            const loadAllevent = await getPendingConnections({ page: page })
            cacheloader(loadAllevent?.connectionRequests)
        }
    }
    useEffect(() => {
        allEventDataLoader({ refreshing: false })
        onRefresh()
    }, [page,focus]);
    useEffect(() => {
        cache.delete('PendingEvent')
        if (renderLength > threshold) {
            setPage(page + 1)
            setTotalFetchLength(totalFetchLength + 100)
        }
    }, [renderLength])
    const cacheloader = async (loadAllevent) => {
        if (loadAllevent == undefined) {
            cache.delete('PendingEvent')
        }
        else {
            const preLoad = cache.get('PendingEvent')
            const combinedData = [...preLoad || [], ...(loadAllevent || [])];
            const uniqueData = Array.from(
                combinedData.reduce((map, item) => {
                    map.set(item?.user_id, item);
                    return map;
                }, new Map()).values()
            );
            cache.set("PendingEvent", uniqueData)
            setDataList(cache.get('PendingEvent'))
        }
    }
    const styles = StyleSheet.create({
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
        profileImages1: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "red",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: 0
        },
        profileImages2: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "teal",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: ResponsiveSize(10)
        },
        profileImages3: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "yellow",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: ResponsiveSize(20)

        },
        profileImages4: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "gray",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: ResponsiveSize(30)
        },
        LikeBtn: {
            position: 'absolute',
            top: ResponsiveSize(15),
            right: ResponsiveSize(15),
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
        },
        timeAgo: {
            position: 'absolute',
            bottom: ResponsiveSize(10),
            right: ResponsiveSize(10),
            fontFamily: "Montserrat-Medium",
            fontSize: ResponsiveSize(10)
        },
        notFound: {
            flex: 1,
        },
        joinedBadge: {
            borderWidth: 1,
            borderColor: global.secondaryColor,
            paddingHorizontal: ResponsiveSize(15),
            borderRadius: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(2),
            backgroundColor: global.secondaryColor,
            color: 'white',
            marginRight: ResponsiveSize(5),
        },
        timeAgoJoined: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: ResponsiveSize(5),
        },
        timeAgoJoinedV: {
            paddingBottom: ResponsiveSize(5),
        },
        timeAgoOwn: {
            borderWidth: 1,
            borderColor: global.primaryColor,
            paddingHorizontal: ResponsiveSize(15),
            borderRadius: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(2),
            backgroundColor: global.primaryColor,
            color: 'white',
            marginRight: ResponsiveSize(5),
        },
        AcceptBtn: {
            backgroundColor: global.secondaryColor,
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            borderRadius: ResponsiveSize(30),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: ResponsiveSize(8)
        },
        RejectBtn: {
            backgroundColor: global.red,
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            borderRadius: ResponsiveSize(30),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }
    })
    const onRefresh = async () => {
        cache.delete('PendingEvent')
        allEventDataLoader({ refreshing: true, pageRe: 1 })
        setRenderLength(10)
        setTotalFetchLength(100)
        setPage(1)
        setDataList([])
        cacheloader()
        setRefreshing(false);
    }
    const [acceptLoading, setAcceptLoading] = useState({ id: '', value: false })
    const [RejectLoading, setRejectLoading] = useState({ id: '', value: false })
    const AcceptInvitationFunc = async (e) => {
        setAcceptLoading({ id: e, value: true })
        const result = await AcceptInvitation(e)
        setAcceptLoading({ id: e, value: false })
        setDataList(prevItems =>
            prevItems.filter(item => item.user_id !== e),
        );
        allEventDataLoader({ refreshing: false })
    }
    const RejectInvitationFunc = async (e) => {
        setRejectLoading({ id: e, value: true })
        const result = await RejectInvitation(e)
        setRejectLoading({ id: e, value: false })
        setDataList(prevItems =>
            prevItems.filter(item => item.user_id !== e),
        );
        allEventDataLoader({ refreshing: false })
    }
    const renderItem = useCallback((items) => {
        return (
            <>
                <Pressable onPress={() => navigation.navigate('UserProfileScreen', { user_id: items?.item?.user_id })} style={styles.Wrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: "#d5d5d5", borderRadius: ResponsiveSize(50) }}>
                            <Image
                                style={{ width: ResponsiveSize(50), height: ResponsiveSize(50), borderRadius: ResponsiveSize(50) }}
                                source={{
                                    uri: items?.item?.profile_picture_url,
                                }}
                            />
                        </View>
                        <View style={styles.UpcomingContent}>
                            <TextC text={items?.item?.user_name} font={"Montserrat-Bold"} size={ResponsiveSize(12)} style={{ width: ResponsiveSize(100) }} ellipsizeMode={"tail"} numberOfLines={1} />
                            <TextC text={items?.item?.user_type == "PILOT" ? "Pilot" : items?.item?.user_type == "FLIGHT ATTENDANT" ? "Flight attendent" : items?.item?.user_type == "TECHNICIAN" ? "Technician" : ""} style={{ color: global.placeholderColor, paddingVertical: ResponsiveSize(2) }} font={'Montserrat-Medium'} size={ResponsiveSize(11)} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => AcceptInvitationFunc(items?.item?.user_id)} style={styles.AcceptBtn}>
                            {acceptLoading.value == true && acceptLoading.id == items?.item?.user_id ?
                                <ActivityIndicator size={ResponsiveSize(8)} color={global.white} />
                                :
                                <Entypo name="check" color={global.white} size={ResponsiveSize(15)} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => RejectInvitationFunc(items?.item?.user_id)} style={styles.RejectBtn}>
                            {RejectLoading.value == true && RejectLoading.id == items?.item?.user_id ?
                                <ActivityIndicator size={ResponsiveSize(8)} color={global.white} />
                                :
                                <Entypo name="cross" color={global.white} size={ResponsiveSize(15)} />
                            }
                        </TouchableOpacity>
                    </View>
                </Pressable >
            </>
        );
    }, [acceptLoading, RejectLoading]);

    return (
        <>
            {PendingConnectionsReducer?.loading ? (
                <>
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={'large'} color={global.primaryColor} />
                        </ScrollView>
                    </SafeAreaView>
                </>
            ) : PendingConnectionsReducer?.loading == false && dataList?.length <= 0 ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    } style={styles.notFound}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(180) }}>
                        {PendingConnectionsReducer?.networkError == true &&
                            <View style={{ paddingBottom: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <Image style={{ height: ResponsiveSize(80), width: ResponsiveSize(80) }} source={require('../../assets/icons/something-went-wrong.png')} />
                            </View>
                        }
                        {PendingConnectionsReducer?.networkError == true ?
                            <TextC text={"Something went wrong"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} /> :
                            <TextC text={"No Pending Connections"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} />
                        }
                        {PendingConnectionsReducer?.networkError == true ?
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"Brace yourself till we get the error fixed"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View> :
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"We couldn't find any pending connections right now."} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View>
                        }
                    </View>
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <FlatList
                        onRefresh={onRefresh}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        refreshing={refreshing}
                        data={dataList?.slice(0, renderLength)}
                        keyExtractor={(items, index) => index?.toString()}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        onEndReached={() => {
                            setRenderLength(renderLength + 10)
                        }}
                        onEndReachedThreshold={0.5}
                        renderItem={renderItem}
                    />
                </ScrollView>
            )}
        </>
    );
}
function mapStateToProps({ PendingConnectionsReducer }) {
    return { PendingConnectionsReducer };
}
export default connect(mapStateToProps, AllConnectionsAction)(React.memo(PendingConnections));