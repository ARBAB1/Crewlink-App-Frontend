import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Image, Dimensions } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from 'react-native-vector-icons/AntDesign'
import TextC from "../components/text/text";
import { useNavigation } from "@react-navigation/native";
import SearchCenter from "../components/searchBar";
import * as PostCreationAction from '../store/actions/PostCreation/index';
import { connect } from 'react-redux';

const TagPeople = ({ PostCreationReducer, SearchConnection,ExludeConnection }) => {
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
        AddedPeopleList: {
            padding: ResponsiveSize(15),
            zIndex: -1
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
        }
    })

    useEffect(() => {
        ConnectSearch()
    }, [search])


    const ConnectSearch = async () => {
        const result = await SearchConnection(search)
        setSearchResult(result)
    }
    const excludeConections = async (r) => {
        ExludeConnection(r)
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
                    <TextC font={'Montserrat-SemiBold'} text={"Mention"} />
                </View>
                <View style={styles.logoSide3}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.NextBtn}><TextC size={ResponsiveSize(11)} text={'Next'} font={'Montserrat-SemiBold'} /></TouchableOpacity>
                </View>
            </View>
            <View style={styles.SearchCenter}>
                <SearchCenter style={{ zIndex: 10 }} loading={PostCreationReducer?.searchConnectionLoading} result={searchResult} isEmpty={search} onChange={setSearch} placeholder={"Search connections"} />
            </View>
            <View style={styles.AddedPeopleList}>
                {PostCreationReducer?.searchConnectionData.map(data => (
                    <View style={styles.ListOfSearch}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={styles.ProfileImage} src={data?.profile_picture_url} />
                            <TextC size={ResponsiveSize(11)} font={'Montserrat-Medium'} text={data?.user_name} style={{ color: 'black' }} />
                        </View>
                        <TouchableOpacity onPress={() => excludeConections(data)}>
                            <TextC size={ResponsiveSize(10)} font={'Montserrat-Medium'} text={"Remove"} style={{ color: global.white, backgroundColor: global.red, paddingHorizontal: ResponsiveSize(15), paddingVertical: ResponsiveSize(3), borderRadius: ResponsiveSize(10),overflow:"hidden"}} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    )
}

function mapStateToProps({ PostCreationReducer }) {
    return { PostCreationReducer };
}
export default connect(mapStateToProps, PostCreationAction)(TagPeople);