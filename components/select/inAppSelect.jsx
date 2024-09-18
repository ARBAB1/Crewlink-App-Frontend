import React, { useState } from "react";
import { StyleSheet, TextInput, Text, View, ActivityIndicator } from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ResponsiveSize, global } from "../constant";
import TextC from "../text/text";

const InAppSelect = ({ secureTextEntry, placeholder, value, onChangeText, label, data, error, height }) => {
    const styleObj = StyleSheet.create({
        labelS: {
            color: "white",
            fontFamily: "Montserrat-Regular",
            fontSize: ResponsiveSize(11),
            paddingBottom: ResponsiveSize(4),
        },
        dropdownButtonStyle: {
            width: global.inputWidth,
            height: height ? height : global.inputHeight,
            backgroundColor: "#EEEEEE",
            borderRadius: ResponsiveSize(30),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: global.inputPaddingH,
            fontFamily: 'Montserrat-Regular',
            borderWidth: ResponsiveSize(1),
            ...(error === undefined ? { borderColor: global.description } : { borderColor: 'red' })
        },
        dropdownButtonTxtStyle: {
            flex: 1,
            fontSize: ResponsiveSize(12),
            fontWeight: '500',
            fontFamily: 'Montserrat-Regular'
        },
        dropdownButtonArrowStyle: {
            fontSize: ResponsiveSize(22),
            color: '#666666'
        },
        dropdownButtonIconStyle: {
            fontSize: ResponsiveSize(22),
            marginRight: ResponsiveSize(8),
        },
        dropdownMenuStyle: {
            backgroundColor: '#E9ECEF',
            borderRadius: ResponsiveSize(8),
        },
        dropdownItemStyle: {
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: ResponsiveSize(12),
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: ResponsiveSize(8),
        },
        dropdownItemTxtStyle: {
            flex: 1,
            fontSize: ResponsiveSize(11),
            fontWeight: '500',
            color: '#151E26',
            fontFamily: 'Montserrat-Regular'
        },
        dropdownItemIconStyle: {
            fontSize: ResponsiveSize(22),
            marginRight: ResponsiveSize(8),
        },
    })

    return (
        <>
            <View>
                <View style={{ paddingHorizontal: ResponsiveSize(12) }}>
                    <TextC text={label} size={ResponsiveSize(11)} font={'Montserrat-Regular'} style={{ color: 'white', paddingBottom: ResponsiveSize(4) }} />
                </View>
                <View>
                    <SelectDropdown
                        disableAutoScroll={true}
                        data={data}
                        dropdownOverlayColor="rgba(0, 0, 0,0.7)"
                        onSelect={(selectedItem) => {
                            onChangeText(label == "Air line" ? selectedItem.airline_id : selectedItem.title)
                        }}
                        searchInputTxtStyle={{
                            fontSize: ResponsiveSize(11)
                        }}
                        searchInputStyle={{
                            height: ResponsiveSize(30)
                        }}
                        disabled={data?.length < 0 || data == undefined || data == null ? true : false}
                        search={true}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <>

                                    <View style={styleObj.dropdownButtonStyle}>
                                        {data?.length < 0 || data == undefined || data == null ?
                                            <ActivityIndicator size={ResponsiveSize(20)} color={'black'} />
                                            :
                                            <>
                                                <Text style={{
                                                    ...styleObj.dropdownButtonTxtStyle,
                                                    color: selectedItem ? 'black' : global.placeholderColor
                                                }}>
                                                    {(selectedItem && selectedItem.title) || placeholder}
                                                </Text>
                                                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styleObj.dropdownButtonArrowStyle} />
                                            </>
                                        }

                                    </View>
                                </>

                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <>
                                    <View style={{ ...styleObj.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={styleObj.dropdownItemTxtStyle}>{item.title}</Text>
                                    </View>
                                </>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styleObj.dropdownMenuStyle}
                    />
                </View>
            </View>
        </>
    )
}


export default InAppSelect;