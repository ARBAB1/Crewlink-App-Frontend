import React, { useCallback, useEffect, useState, Suspense } from "react";
import { View, StyleSheet, Image, ScrollView, Animated, FlatList, Pressable, ActivityIndicator, SafeAreaView } from "react-native";
import TextC from "../text/text";
import { ResponsiveSize, global } from "../constant";
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import * as AllConnectionsAction from "../../store/actions/Connections/index";
import { connect } from "react-redux";
import TimeAgo from '@manu_omg/react-native-timeago';
import ButtonC from "../button/index";
import { useNavigation } from "@react-navigation/native";
import FastImage from 'react-native-fast-image'
import { RefreshControl } from "react-native-gesture-handler";
import { useSWRConfig } from "swr";
import { Text } from "react-native-elements";
import { TouchableOpacity } from "@gorhom/bottom-sheet";




const AllConnections = ({ getAllConnections, AllConnectionsReducer }) => {
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
            const loadAllevent = await getAllConnections({ page: pageRe })
            cacheloader(loadAllevent)
            console.log(loadAllevent, '567890')
        }
        else if (!refreshing) {
            const loadAllevent = await getAllConnections({ page: page })
            cacheloader(loadAllevent)
            console.log(loadAllevent, '567890')
        }

    }
    useEffect(() => {
        allEventDataLoader({ refreshing: false })
    }, [page]);
    useEffect(() => {
        if (renderLength > threshold) {
            cache.delete('AllConnections')
            setPage(page + 1)
            setTotalFetchLength(totalFetchLength + 100)
        }
    }, [renderLength])
    const cacheloader = async (loadAllevent) => {
        const preLoad = cache.get('AllConnections')
        const combinedData = [...preLoad || [], ...(loadAllevent || [])];
        const uniqueData = Array.from(
            combinedData.reduce((map, item) => {
                map.set(item?.user_id, item);
                return map;
            }, new Map()).values()
        );
        cache.set("AllConnections", uniqueData)
        setDataList(cache.get('AllConnections'))
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
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            borderRadius: ResponsiveSize(30),
        }
    })
    const onRefresh = async () => {
        cache.delete('AllConnections')
        allEventDataLoader({ refreshing: true, pageRe: 1 })
        setRenderLength(10)
        setTotalFetchLength(100)
        setPage(1)
        setDataList([])
        cacheloader()
        setRefreshing(false);
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
                </Pressable >
            </>
        );
    }, []);
    return (
        <>
            {AllConnectionsReducer?.loading ? (
                <>
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={'large'} color={global.primaryColor} />
                        </ScrollView>
                    </SafeAreaView>
                </>
            ) : AllConnectionsReducer?.loading == false && dataList?.length <= 0 ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    } style={styles.notFound}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(180) }}>
                        {AllConnectionsReducer?.networkError == true &&
                            <View style={{ paddingBottom: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <Image style={{ height: ResponsiveSize(80), width: ResponsiveSize(80) }} source={require('../../assets/icons/something-went-wrong.png')} />
                            </View>
                        }
                        {AllConnectionsReducer?.networkError == true ?
                            <TextC text={"Something went wrong"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} /> :
                            <TextC text={"No Connections Right Now"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} />
                        }
                        {AllConnectionsReducer?.networkError == true ?
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"Brace yourself till we get the error fixed"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View> :
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"We couldn't find any connections right now. Try to Create"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View>
                        }
                    </View>
                </ScrollView>
            ) : (
                <>
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
                </>
            )}
        </>
    );
}
function mapStateToProps({ AllConnectionsReducer }) {
    return { AllConnectionsReducer };
}
export default connect(mapStateToProps, AllConnectionsAction)(React.memo(AllConnections));