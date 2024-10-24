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
import InAppSelect from "../components/select/inAppSelect";
import Feather from 'react-native-vector-icons/Feather'
import { useBottomSheet } from '../components/bottomSheet/BottomSheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from "react-native-date-picker";
import { PERMISSIONS, request } from "react-native-permissions";



const ChangeAirline = ({ getAllAirline, ChangeAirline }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const scheme = useColorScheme();
    const navigation = useNavigation()
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
        position: yup
            .string()
            .required('Position is required'),
        airline: yup
            .string()
            .required('Airline is required'),
        enddate: yup
            .string()
            .required('End date is required')
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            position: '',
            airline: '',
            enddate: '',
        },
    });

    const [loading, setLoading] = useState(false)
    const onSubmit = async (data) => {
        if (documentImage) {
            setLoading(true)
            const formData = new FormData();
            formData.append('new_user_type', data?.position);
            formData.append('new_airline', data?.airline?.toString());
            formData.append('new_license_expiry_date', data?.enddate);
            formData.append('new_employee_card', {
                uri: documentImage,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
            const Responce = await ChangeAirline(formData)
            if (Responce.statusCode == 200) {
                // showToast({
                //     message: "Successfully applied for airline change",
                //     title: "Successfully applied",
                //     iconColor: "green",
                //     iconName: "lock",
                //     bg: "#abffdb"
                // })
                setLoading(false)
                setTimeout(() => {
                    navigation.goBack()
                }, 3000)
            }
        }
    }
    const [allAirLine, setAllAirLine] = useState()

    useEffect(() => {
        LoadAirLine()
        return () => { closeBottomSheet() }
    }, [])

    const LoadAirLine = async () => {
        const loadAllAirLineDetail = await getAllAirline()
        setAllAirLine(loadAllAirLineDetail?.data)
    }

    const Positions = [
        { title: 'FLIGHT ATTENDANT', icon: 'emoticon-happy-outline' },
        { title: 'PILOT', icon: 'emoticon-cool-outline' },
        { title: 'TECHNICIAN', icon: 'emoticon-lol-outline' },
    ];
    const [documentImage, setDocumentImage] = useState('')
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const [documentName, setDocumentName] = useState('')
    const [expiry, setExpiry] = useState(false)

    const requestCameraPermission = async () => {
        try {
            Platform.OS === 'android'
            ? await request(PERMISSIONS.ANDROID.CAMERA)
            : await request(PERMISSIONS.IOS.CAMERA);
                handleOpenSheet()
          
        } catch (err) {
            console.warn(err);
        }
    };
    const openPhotoLibrary = async () => {
        const result = await launchImageLibrary();
        if (result?.assets.length > 0) {
            setDocumentName(result?.assets[0]?.fileName)
            setDocumentImage(result?.assets[0]?.uri)
            closeBottomSheet()
        }
    }
    const openMobileCamera = async () => {
        const result = await launchCamera();
        if (result?.assets.length > 0) {
            setDocumentImage(result?.assets[0]?.uri)
            setDocumentName(result?.assets[0]?.fileName)
            closeBottomSheet()
        }
    }
    const handleOpenSheet = () => {
        openBottomSheet(
            <>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                    paddingHorizontal: ResponsiveSize(15),
                }}>
                    <ButtonC onPress={openMobileCamera} BtnStyle={{ width: windowWidth * 0.45 }} TextStyle={{ color: global.white }} bgColor={global.primaryColor} style={styles.openCamera} title={"Open camera"}></ButtonC>
                    <ButtonC onPress={openPhotoLibrary} BtnStyle={{ width: windowWidth * 0.45 }} TextStyle={{ color: global.white }} bgColor={global.primaryColor} style={styles.openLibrary} title={"Open library"}></ButtonC>
                </View>
            </>
            , ["15%"]
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flexGrow: 1, ...(scheme === 'dark' ? { backgroundColor: DarkTheme.colors.background } : { backgroundColor: 'white' }), }}>
                <View style={styles.wrapper}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={"#05348E"} size={ResponsiveSize(18)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <TextC size={ResponsiveSize(13)} font={'Montserrat-Bold'} text={"Change Airline"} />
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
                                <InAppSelect label={"Position"} data={Positions} placeholder={'Select position'} error={errors?.position?.message} value={value} onChangeText={onChange} secureTextEntry={false} />
                                {errors?.currentPassword?.message !== undefined &&
                                    <TextC text={errors?.currentPassword?.message} size={ResponsiveSize(10)} style={{ color: global.red, marginTop: ResponsiveSize(2), marginLeft: ResponsiveSize(10) }} />
                                }
                            </View>
                        )}
                        name="position"
                    />


                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <InAppSelect label={"Air line"} data={allAirLine} placeholder={'Select airline'} error={errors?.position?.message} value={value} onChangeText={onChange} secureTextEntry={false} />
                                {errors?.password?.message !== undefined &&
                                    <TextC text={errors?.password?.message} size={ResponsiveSize(10)} style={{ color: global.red, marginTop: ResponsiveSize(2), marginLeft: ResponsiveSize(10) }} />
                                }
                            </View>
                        )}
                        name="airline"
                    />

                    <View>
                        <TouchableOpacity onPress={requestCameraPermission} style={styles.ImageInput}>
                            {documentName ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ImageBackground style={styles.inputImageProfile} src={documentImage} />
                                    <TextC text={documentName} style={{ color: global.placeholderColor, marginLeft: ResponsiveSize(10), width: ResponsiveSize(200) }} size={ResponsiveSize(11)} font={"Montserrat-Regular"} ellipsizeMode={"tail"} numberOfLines={1} />
                                </View>
                                :
                                <TextC text={'Select Document Image'} style={{ color: global.placeholderColor }} size={ResponsiveSize(11)} font={"Montserrat-Regular"} />

                            }
                        </TouchableOpacity>
                    </View>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <TouchableOpacity onPress={() => setExpiry(true)} style={styles.ImageInput}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextC text={(value && new Date(value).toDateString()) || "Expiry Date"} style={{ color: global.placeholderColor, marginLeft: ResponsiveSize(10), width: ResponsiveSize(200) }} size={ResponsiveSize(11)} font={"Montserrat-Regular"} ellipsizeMode={"tail"} numberOfLines={1} />
                                    </View>
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    open={expiry}
                                    date={new Date()}
                                    mode="date"
                                    minimumDate={new Date()}
                                    onConfirm={(date) => {
                                        setExpiry(false)
                                        onChange(date?.toISOString())
                                    }}
                                    onCancel={() => {
                                        setExpiry(false)
                                    }}
                                />
                            </View>
                        )}
                        name="enddate"
                    />
                    <ButtonC disabled={loading} onPress={handleSubmit(onSubmit)} loading={loading} title={"Submit"} bgColor={global.secondaryColor} BtnStyle={{ marginTop: ResponsiveSize(15) }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function mapStateToProps({ RegisterUserReducer }) {
    return { RegisterUserReducer };
}
export default connect(mapStateToProps, UserRegisterAction)(ChangeAirline);