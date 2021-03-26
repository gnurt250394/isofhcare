import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Dimensions, View, Text, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Platform, Image, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import eyeImg from '@images/eye_black.png';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import FloatingLabel from 'mainam-react-native-floating-label';
import connectionUtils from '@utils/connection-utils';
import ScaleImage from 'mainam-react-native-scaleimage';
import Field from "mainam-react-native-form-validate/Field";
import HeaderBar from '@components/account/HeaderBar'
const DEVICE_HEIGHT = Dimensions.get("window").height;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from "@navigators/NavigationService";
import profileProvider from '@data-access/profile-provider'

class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            secureTextEntry: true,
            secureTextEntry2: true,
            fullName: '',
            phone: ''
        }
    }
    componentDidMount() {

    }

    changePassword() {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        connectionUtils.isConnected().then(s => {
            this.setState({
                isLoading: true,
                disabled: true
            }, () => {
                let data = {
                    mobileNumber: this.state.phone.trim(),
                    fullName: this.state.fullName.trim(),
                }
                profileProvider.getInfoProfile(data).then(s => {
                    console.log('s: sssss', s);
                    // switch (s.code) {
                    //     case 0:
                    //         NavigationService.navigate('verifyPhone', {
                    //             phone: this.state.phone,
                    //             verify: 2
                    //         })
                    //         break
                    //     case 2:
                    //         snackbar.show('Số điện thoại chưa được đăng ký', "danger");
                    //         break
                    //     case 6:
                    //         NavigationService.navigate('verifyPhone', {
                    //             phone: this.state.phone,
                    //             verify: 2
                    //         })
                    //         break
                    // }


                }).catch(err => {
                    console.log('err: ', err);
                    snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại.', 'danger')
                })
                this.setState({
                    isLoading: false,
                    disabled: false
                })
            })
        }).catch(e => {
            this.setState({
                isLoading: false,
                disabled: false

            })
            snackbar.show(constants.msg.app.not_internet, "danger");
        })

    }
    onShowPass2 = () => {
        this.setState({
            secureTextEntry2: !this.state.secureTextEntry2
        })
    }
    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                hideActionbar={true}
                transparent={true}
                useCard={true}
                titleStyle={{ textAlign: 'left', marginLeft: 20 }}
                showFullScreen={true}
                isLoading={this.state.isLoading}
                containerStyle={{ marginTop: 50 }}
            >
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                >
                    <HeaderBar style={styles.header}></HeaderBar>
                    <View
                        style={{
                            marginTop: 30,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ fontSize: 24, fontWeight: '500', color: '#00BA99', alignSelf: 'center' }}>NHẬP THÔNG TIN</Text>
                        {/* <ScaleImage source={require("@images/logo.png")} width={120} /> */}
                    </View>
                    <KeyboardAvoidingView behavior="padding" >
                        <View>
                            <Form ref={ref => (this.form = ref)} style={styles.form}>
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                                        keyboardType='numeric'
                                        maxLength={10}
                                        placeholderStyle={{ fontSize: 16, fontWeight: '300' }} value={value} underlineColor={'#CCCCCC'}
                                        placeholderTextColor='#000'
                                        inputStyle={styles.textInputStyle}
                                        labelStyle={styles.labelStyle} placeholder={constants.phone} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => this.setState({ phone: s })}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            phone: true
                                        },
                                        messages: {
                                            required: "Số điện thoại không được bỏ trống",
                                            phone: "SĐT không hợp lệ"
                                        }
                                    }}

                                    autoCapitalize={"none"}
                                />
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '300' }} value={value} underlineColor={'#CCCCCC'}
                                        placeholderTextColor='#000'
                                        inputStyle={styles.textInputStyle}
                                        labelStyle={styles.labelStyle} placeholder={'Nhập tên thành viên'} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => this.setState({ fullName: s })}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                        },
                                        messages: {
                                            required: "Tên thành viên không được bỏ trống",
                                        }
                                    }}

                                    autoCapitalize={"none"}
                                />
                            </Form>
                        </View>
                    </KeyboardAvoidingView>
                    <View style={{ backgroundColor: '#fff' }}>
                        <TouchableOpacity
                            onPress={this.changePassword.bind(this)}
                            style={styles.updatePass}>
                            {this.state.disabled ? <ActivityIndicator size={'small'} color='#fff'></ActivityIndicator> : <Text style={styles.txbtnUpdate}>{constants.continue}</Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50 }}></View>
                </KeyboardAwareScrollView>
            </ActivityPanel>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    form: { marginTop: 30 },
    header: { paddingHorizontal: 0 },
    txbtnUpdate: { color: '#FFF', fontSize: 17 },
    updatePass: { backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 70 },
    container: { flex: 1, backgroundColor: '#000', height: DEVICE_HEIGHT },
    btnEye: {
        position: 'absolute',
        right: 25,
        top: 18
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.2)',
    },
    inputPass: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    input: {
        maxWidth: 300,
        paddingRight: 30,
        backgroundColor: '#FFF',
        width: DEVICE_WIDTH - 40,
        height: 42,
        marginHorizontal: 20,
        paddingLeft: 15,
        borderRadius: 6,
        color: '#006ac6',
        borderWidth: 1,
        borderColor: 'rgba(155,155,155,0.7)'
    },
    errorStyle: {
        color: "red",
        marginTop: 10
    },
    textInputStyle: {
        color: "#000",
        fontWeight: "300",
        height: 51,
        marginLeft: 0,
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderColor: '#CCCCCC',
        fontSize: 20,
        paddingLeft: 15,
        paddingRight: 45,
        marginTop:10

    },
    scroll: { flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20, backgroundColor: '#fff', paddingHorizontal: 20 }

});

function mapStateToProps(state) {

    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ResetPasswordScreen);