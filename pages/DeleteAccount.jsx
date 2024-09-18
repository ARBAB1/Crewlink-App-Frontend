import { DarkTheme, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, View, ScrollView, SafeAreaView, Dimensions, useColorScheme, Pressable, TouchableOpacity, Switch, PermissionsAndroid, ImageBackground } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign'
import TextC from "../components/text/text";
import TextInputC from "../components/inputs/text";
import ButtonC from "../components/button";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as UserRegisterAction from "../store/actions/UserRegister/index";
import { connect } from "react-redux";
import { useToast } from "../components/Toast/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";



const DeleteAccount = ({ DeleteAccountAction, onLogin }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const scheme = useColorScheme();
    const navigation = useNavigation()
    const { showToast } = useToast();

    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "center",
            width: windowWidth,
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(15),
        },
        logoSide1: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '20%',
        },
        logoSide2: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60%',
        },
        logoSide3: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '20%',
        },
        bodyWrapper: {
            paddingHorizontal: ResponsiveSize(15),
            paddingTop: ResponsiveSize(60),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ImageInput: {
            width: global.inputWidth,
            height: global.inputHeight,
            backgroundColor: "#EEEEEE",
            borderRadius: ResponsiveSize(30),
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: global.inputPaddingH,
            fontFamily: 'Montserrat-Regular',
            borderWidth: ResponsiveSize(1),
            borderColor: global.description,
            marginTop: ResponsiveSize(20)
        },
        inputImageProfile: {
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            backgroundColor: global.description,
            borderRadius: ResponsiveSize(30),
            overflow: 'hidden'
        }
    })

    const schema = yup.object().shape({
        password: yup
            .string()
            .required('Password is required')
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            password: '',
        },
    });


    const [loading, setLoading] = useState(false)
    const onSubmit = async (data) => {
        setLoading(true)
        const LoadUpdate = await DeleteAccountAction(data.password)
        console.log(LoadUpdate)
        if (LoadUpdate == "Account Deleted") {
            await AsyncStorage.removeItem('Token');
            onLogin();
            setLoading(false)
        }
        else if (LoadUpdate == "Wrong Password") {
            showToast({
                message: "Wrong Password",
                title: "Cannot delete account, check your password",
                iconColor: "red",
                iconName: "lock",
                bg: "#fff2f2"
            })
            setLoading(false)
        }
        setLoading(false)
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flexGrow: 1, ...(scheme === 'dark' ? { backgroundColor: DarkTheme.colors.background } : { backgroundColor: 'white' }), }}>
                <View style={styles.wrapper}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={"#05348E"} size={ResponsiveSize(18)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <TextC size={ResponsiveSize(13)} font={'Montserrat-Bold'} text={"Delete Account"} />
                    </View>
                    <View style={styles.logoSide3}>
                    </View>
                </View>

                <View style={styles.bodyWrapper}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <TextInputC disable={loading} label={"Position"} placeholder={'Current Password'} error={errors?.password?.message} value={value} onChangeText={onChange} secureTextEntry={true} />
                                {errors?.password?.message !== undefined &&
                                    <TextC text={errors?.password?.message} size={ResponsiveSize(10)} style={{ color: global.red, marginTop: ResponsiveSize(2), marginLeft: ResponsiveSize(10) }} />
                                }
                            </View>
                        )}
                        name="password"
                    />
                    <ButtonC disabled={loading} onPress={handleSubmit(onSubmit)} loading={loading} title={"Delete"} TextStyle={{ color: 'white' }} bgColor={global.red} BtnStyle={{ marginTop: ResponsiveSize(15) }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function mapStateToProps({ RegisterUserReducer }) {
    return { RegisterUserReducer };
}
export default connect(mapStateToProps, UserRegisterAction)(DeleteAccount);