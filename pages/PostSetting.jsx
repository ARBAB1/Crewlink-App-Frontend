import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Image, Dimensions, Switch } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from 'react-native-vector-icons/AntDesign'
import TextC from "../components/text/text";
import { useNavigation } from "@react-navigation/native";
import SearchCenter from "../components/searchBar";
import * as PostCreationAction from '../store/actions/PostCreation/index';
import { connect } from 'react-redux';

const PostSetting = ({ PostCreationReducer, CommentSwitch, CommentCountSwitch, LikeCountSwitch }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState()
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

    })

    useEffect(() => {
        ConnectSearch()
    }, [search])

    const ConnectSearch = async () => {
        const result = await SearchConnection(search)
        setSearchResult(result)
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.logoSide1}>
                    <AntDesign name='left' color={"#05348E"} size={ResponsiveSize(16)} />
                    <Image source={require('../assets/icons/Logo.png')} style={{ objectFit: 'contain', width: ResponsiveSize(70), height: ResponsiveSize(22) }} />
                </TouchableOpacity>
                <View style={styles.logoSide2}>
                    <TextC font={'Montserrat-SemiBold'} text={"Setting"} />
                </View>
                <View style={styles.logoSide3}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.NextBtn}><TextC size={ResponsiveSize(11)} text={'Next'} font={'Montserrat-SemiBold'} /></TouchableOpacity>
                </View>
            </View>
            <View style={styles.SearchCenter}>
                <TextC size={ResponsiveSize(15)} text={'Likes'} font={'Montserrat-Bold'} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                    <TextC size={ResponsiveSize(12)} text={'Hide like counts on this post'} font={'Montserrat-SemiBold'} />
                    <Switch
                        trackColor={{ false: '#767577', true: global.secondaryColor }}
                        thumbColor={PostCreationReducer?.isLikeCount ? 'white' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>LikeCountSwitch(!PostCreationReducer?.isLikeCount)}
                        value={PostCreationReducer?.isLikeCount}
                    />
                </View>
                <View style={{ paddingTop: ResponsiveSize(10) }}>
                    <TextC size={ResponsiveSize(11)} text={'Hide the number of likes on this post to keep interactions private. Control visibility and focus on content over popularity.'} font={'Montserrat-Medium'} style={{ color: global.placeholderColor }} />
                </View>
            </View>


            <View style={styles.SearchCenter}>
                <TextC size={ResponsiveSize(15)} text={'Comments'} font={'Montserrat-Bold'} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                    <TextC size={ResponsiveSize(12)} text={'Turn off commenting'} font={'Montserrat-SemiBold'} />
                    <Switch
                        trackColor={{ false: '#767577', true: global.secondaryColor }}
                        thumbColor={PostCreationReducer?.isCommentOff ? 'white' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>CommentSwitch(!PostCreationReducer?.isCommentOff)}
                        value={PostCreationReducer?.isCommentOff}
                    />
                </View>
                <View style={{ paddingTop: ResponsiveSize(10) }}>
                    <TextC size={ResponsiveSize(11)} text={'Turn off commenting to control discussions on your content. Keep the focus on the main topic.'} font={'Montserrat-Medium'} style={{ color: global.placeholderColor }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: ResponsiveSize(15) }}>
                    <TextC size={ResponsiveSize(12)} text={'Hide comment counts on this post'} font={'Montserrat-SemiBold'} />
                    <Switch
                        trackColor={{ false: '#767577', true: global.secondaryColor }}
                        thumbColor={PostCreationReducer?.isCommentCount ? 'white' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>CommentCountSwitch(!PostCreationReducer?.isCommentCount)}
                        value={PostCreationReducer?.isCommentCount}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

function mapStateToProps({ PostCreationReducer }) {
    return { PostCreationReducer };
}
export default connect(mapStateToProps, PostCreationAction)(PostSetting);