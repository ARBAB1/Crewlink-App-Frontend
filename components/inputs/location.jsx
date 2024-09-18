import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const TextInputC = ({ placeholder }) => {
    const styles = StyleSheet.create({
        Input: {
            borderWidth: 1,
            borderColor: '#b3b3b3',
            backgroundColor: '#fafafa',
            borderRadius: 60,
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontFamily: 'Montserrat-Medium',
            fontSize: 12
        }
    })
    return (
        <>
            {/* <GooglePlacesAutocomplete
                query={{ key: 'AIzaSyBPuxObCHikaWfPjyCZj-ge9BAo0HCVTBQ' }}
                placeholder="Type a place"
                onPress={(data, details = null) => console.log(data, details)}
                fetchDetails={true}
                onFail={error => console.log(error,"9")}
                onNotFound={() => console.log('no results')}
                listEmptyComponent={() => (
                    <View style={{ flex: 1 }}>
                        <Text>No results were found</Text>
                    </View>
                )}
            /> */}
            <TextInput style={styles.Input} placeholder={placeholder} placeholderTextColor={"#666666"} />
        </>
    )
}

export default TextInputC;