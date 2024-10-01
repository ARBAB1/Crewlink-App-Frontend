import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { global, ResponsiveSize } from "../constant";
import TextC from "../text/text";
import * as PostCreationAction from '../../store/actions/PostCreation/index';
import { connect, useStore} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo'


const SearchCenter = ({ placeholder, height, style, error, onChange, result, loading, isEmpty, InclideConnection, ExludeConnection }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const store = useStore();
    const state = store.getState()
    const styles = StyleSheet.create({
        Input: {
            fontSize: ResponsiveSize(11),
            paddingHorizontal: global.inputPaddingH,
            backgroundColor: "#EEEEEE",
            width: global.inputWidth,
            fontFamily: 'Montserrat-Regular',
            height: height ? height : global.inputHeight,
            color: global.black,
            borderRadius: ResponsiveSize(30),
            borderWidth: 1,
            zIndex: 2,
            ...style,
            ...(error === undefined ? { borderColor: global.description } : { borderColor: 'red' }),
        },
        searchedConnetions: {
            paddingHorizontal: global.inputPaddingH,
            backgroundColor: "#EEEEEE",
            width: global.inputWidth,
            fontFamily: 'Montserrat-Regular',
            color: global.black,
            borderRadius: ResponsiveSize(30),
            position: 'absolute',
            paddingTop: ResponsiveSize(60),
            paddingBottom: ResponsiveSize(20),
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
        },
        ListOfSearch: {
            paddingVertical: ResponsiveSize(5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        ProfileImage: {
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            borderRadius: ResponsiveSize(30),
            marginRight: ResponsiveSize(5),
            backgroundColor: global.description
        }
    })

    const includeList = async (r) => {
        InclideConnection(r)
    }
    const [isSuggest, setIsSuggest] = useState(true)

    const excludeConections = async (r) => {
        ExludeConnection(r)
    }
    return (
        <View style={{ position: 'relative' }}>
            <TextInput onChangeText={(e) => {
                onChange(e)
                setIsSuggest(true)
            }} placeholder={placeholder} style={styles.Input} value={isEmpty}/>
            {isEmpty == "" ? "" :
                <TouchableOpacity onPress={() => {
                    onChange("")
                    setIsSuggest(false)}} style={{ position: 'absolute', right: ResponsiveSize(15), zIndex: 999, top: ResponsiveSize(13) }}>
                    <Entypo name="cross" size={ResponsiveSize(16)} />
                </TouchableOpacity>
            }
            {isSuggest ?
                <>
                    {isEmpty == "" ? "" :
                        <>
                            {loading == false && result?.length <= 0 ?
                                ""
                                : <View style={styles.searchedConnetions}>
                                    {loading ? <ActivityIndicator size={"large"} color={global.primaryColor} /> :
                                        <>
                                            {result !== undefined && result !== null && result !== "" && result?.length > 0 ? result?.map(data => (
                                                <View style={styles.ListOfSearch}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Image style={styles.ProfileImage} src={data?.profile_picture_url} />
                                                        <TextC size={ResponsiveSize(11)} font={'Montserrat-Medium'} text={data?.user_name} style={{ color: 'black' }} />
                                                    </View>
                                                    <TouchableOpacity onPress={() => includeList(result)}>
                                                        <TextC size={ResponsiveSize(10)} font={'Montserrat-Medium'} text={"Add"} style={{ color: global.white, backgroundColor: global.secondaryColor, paddingHorizontal: ResponsiveSize(15), paddingVertical: ResponsiveSize(3), borderRadius: ResponsiveSize(10),overflow:'hidden'}} />
                                                    </TouchableOpacity>
                                                </View>
                                            )) : ""}
                                        </>
                                    }
                                </View>}
                        </>
                    }
                </>
                : ""}
        </View>

    )
}
function mapStateToProps({ PostCreationReducer }) {
    return { PostCreationReducer };
}
export default connect(mapStateToProps, PostCreationAction)(SearchCenter);