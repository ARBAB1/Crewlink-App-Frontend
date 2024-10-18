import React, { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import TextC from "../text/text";
import * as CityAction from "../../store/actions/Cities/index";
import CityReducer from "../../store/reducers/Cities";
import { connect } from "react-redux";
import { global } from "../constant";
import { color } from "@rneui/base";
const CityScroll = ({ getAllCities, onCitySelect }) => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const [cityList, setCityList] = useState([]);
    const width = Dimensions.get('window').width;
    const styles = StyleSheet.create({
        container: {
            paddingVertical: 20,
            paddingLeft: 15,
            paddingRight: 0,
            ...(scheme === 'dark' ? { backgroundColor: "#161616" } : { backgroundColor: '#F5F5F5' }),
        },
        ScrollCard: {
            height: 100,
            width: 70,
            backgroundColor: global.primaryColor,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5,
            overflow: 'hidden',
            marginBottom: 5
        },
        ScrollCardLoading: {
            height: 100,
            width: 70,
            backgroundColor: "#EEEEEE",
            borderRadius: 20,
            marginHorizontal: 5,
            overflow: 'hidden',
            marginBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        ScrollCardWrapper: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cityContentImage: {
            width: 70,
            height: 100
        },
        cityContentImages: {
           
            width: 60,
            resizeMode: 'contain',
            height: 100
        }
    })

    const getAllCity = async () => {
        const response = await getAllCities();

        setCityList(response)
    }
    useEffect(() => {
        getAllCity();
    }, [])
    return (
        <>
            <View style={styles.container}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={styles.ScrollCardWrapper}
                           onPress={() => onCitySelect("")} // Call onCitySelect when city is clicked
                       >
                           <View style={styles.ScrollCard}>
                               <Image source={require('../../assets/icons/splashLoader.png')} style={styles.cityContentImages} />
                           </View>
                           <TextC text={"All Cities"} font={'Montserrat-Medium'} size={12} style={{ width: 60, textAlign: 'center' }} ellipsizeMode={"tail"} numberOfLines={1} />
                       </TouchableOpacity>
                    {
                        
                      
                        
                        cityList !== undefined && cityList !== null && cityList !== "" && cityList.length > 0 ? cityList?.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={styles.ScrollCardWrapper}
                                    onPress={() => onCitySelect(item.city_name)} // Call onCitySelect when city is clicked
                                >
                                    <View style={styles.ScrollCard}>
                                        <Image source={{ uri: item.city_image_url }} style={styles.cityContentImage} />
                                    </View>
                                    <TextC text={item.city_name} font={'Montserrat-Medium'} size={12} style={{ width: 60 }} ellipsizeMode={"tail"} numberOfLines={1} />
                                </TouchableOpacity>
                            )
                        }) :
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.ScrollCardWrapper}>
                                    <View style={styles.ScrollCardLoading}>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ScrollCardWrapper}>
                                    <View style={styles.ScrollCardLoading}>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ScrollCardWrapper}>
                                    <View style={styles.ScrollCardLoading}>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ScrollCardWrapper}>
                                    <View style={styles.ScrollCardLoading}>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                    }
                </ScrollView>
            </View>
        </>
    )
}

function mapStateToProps({ CityReducer }) {
    return { CityReducer };
}

// Connect component to Redux actions and state
export default connect(mapStateToProps, CityAction)(React.memo(CityScroll));


