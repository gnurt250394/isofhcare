import React from 'react';
import { StyleSheet, Text, View, Keyboard, ScrollView, KeyboardAvoidingView, Dimensions, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import constants from "@resources/strings";
import userProvider from '@data-access/user-provider'
import snackbar from '@utils/snackbar-utils';
import { connect } from "react-redux";
import profileProvider from '@data-access/profile-provider'
import connectionUtils from "@utils/connection-utils";
import HeaderBar from '@components/account/HeaderBar'

const DEVICE_HEIGHT = Dimensions.get("window").height;
//props: verify
//case 1 : regiter
//case 2 : fogot password
//case 3 : create profile

class VerifyPhoneNumberScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        let phone = this.props.navigation.state.params && this.props.navigation.state.params.phone ? this.props.navigation.state.params.phone : null
        let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
        let verify = this.props.navigation.state.params && this.props.navigation.state.params.verify ? this.props.navigation.state.params.verify : null
        this.state = {
            seconds: 90,
            txErr: '',
            reset: 2,
            phone,
            id,
            verify,
            // appState: AppState.currentState,
        }
    }
    componentDidMount() {
        setInterval(() => {
            if (this.state.seconds > 0)
                this.setState(preState => {
                    return {
                        seconds: preState.seconds - 1
                    }
                })
        }, 1000);
        // AppState.addEventListener('change', this._handleAppStateChange);
    }
    // setInterval = () => {
    //     setInterval(() => {
    //         if (this.state.seconds > 0)
    //             this.setState(preState => {
    //                 return {
    //                     seconds: preState.seconds - 1
    //                 }
    //             })
    //     }, 1000);
    // }
    // componentWillUnmount() {
    //     AppState.removeEventListener('change', this._handleAppStateChange);
    // }

    // _handleAppStateChange = (nextAppState) => {
    //     console.log('nextAppState: ', nextAppState);
    //     if (
    //         nextAppState === 'background'
    //     ) {
    //         this.a = setInterval(() => {
    //             let { seconds } = this.state
    //             console.log(seconds, '22222222')
    //             if (seconds > 0)
    //                 this.setState(preState => {
    //                     return {
    //                         seconds: preState.seconds - 1
    //                     }
    //                 })
    //         }, 1000);
    //     } else {
    //         clearInterval(this.a)
    //     }
    //     this.setState({ appState: nextAppState });
    // };

    onReSendPhone = () => {
        this.setState({
            disabled: true
        }, () => {
            connectionUtils
                .isConnected()
                .then(s => {
                    switch (this.state.verify) {
                        case 1:
                            {
                                userProvider.forgotPassword(this.state.phone.trim(), 4, (s, e) => {
                                    this.setState({
                                        disabled: false
                                    })
                                    if (s.code == 0) {
                                        this.setState({
                                            seconds: 90,
                                        })
                                        snackbar.show('Mã xác thực đã được gửi lại', 'success')
                                        return
                                    }
                                    if (s.code == 6) {
                                        this.setState({
                                            countResend: true
                                        })
                                        return
                                    }
                                    else {
                                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                    }
                                    if (e) {
                                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                        return
                                    }
                                })
                            }
                            break
                        case 2:
                            {
                                userProvider.forgotPassword(this.state.phone.trim(), 2, (s, e) => {
                                    this.setState({
                                        disabled: false
                                    })
                                    if (s.code == 0) {
                                        this.setState({
                                            seconds: 90,
                                        })
                                        snackbar.show('Mã xác thực đã được gửi lại', 'success')
                                        return
                                    }
                                    if (s.code == 6) {
                                        this.setState({
                                            countResend: true
                                        })
                                        return
                                    }
                                    else {
                                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                    }
                                    if (e) {
                                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                        return
                                    }
                                })
                            }
                            break
                        case 3:
                            let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
                            profileProvider.resendOtp(id).then(res => {
                                this.setState({
                                    disabled: false
                                })
                                if (res.code == 0) {
                                    this.setState({
                                        seconds: 90
                                    })
                                    snackbar.show('Mã xác thực đã được gửi lại', 'success')
                                    return
                                }
                                if (s.code == 6) {
                                    this.setState({
                                        countResend: true
                                    })
                                    return
                                } else {
                                    snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                }
                            }).catch(err => {
                                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                            })
                            break
                    }
                }).catch(e => {
                    this.setState({
                        disabled: false
                    })
                    snackbar.show(constants.msg.app.not_internet, "danger");
                })
        })

    }
    // getDetails = (token) => {
    //     userProvider.getDetailsUser().then(res => {
    //         let user = res.details
    //         user.loginToken = token
    //         let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
    //         if (callback) {
    //             callback(user);
    //             this.props.navigation.pop();
    //         }
    //     })

    // }
<<<<<<< Updated upstream
    onCheckOtp = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        let text = this.state.text
=======
    onCheckOtp = (text) => {
        console.log('chayyyy')
        Keyboard.dismiss();
>>>>>>> Stashed changes
        if (this.state.verify) {
            connectionUtils
                .isConnected()
                .then(s => {
                    switch (this.state.verify) {
                        case 1:
                            userProvider.checkOtpPhone(this.state.id, text).then(res => {
                                switch (res.code) {
                                    case 0: {
                                        snackbar.show('Đăng ký thành công', 'success')
                                        let user = res.data.user
                                        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                                        if (callback) {
                                            callback(user);
                                            this.props.navigation.pop();
                                        }
                                    }
                                        break
                                    case 3:
                                        snackbar.show('Mã xác thực không đúng', 'danger')
                                        break
                                    case 4:
                                        snackbar.show('Mã xác thực hết hạn', 'danger')
                                        break
                                    default:
                                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                        break

                                }

                            })
                            break
                        case 2:
                            userProvider.confirmCode(this.state.phone, text, (s, e) => {
                                if (s) {
                                    switch (s.code) {
                                        case 0:
                                            snackbar.show(constants.msg.user.confirm_code_success, "success");
                                            this.props.navigation.navigate("resetPassword", {
                                                user: s.data.user,
                                                id: s.data.user.id,
                                                // nextScreen: this.nextScreen
                                            });
                                            break;
                                        case 2:
                                            snackbar.show('Mã xác thực không đúng', 'danger')
                                            break
                                        case 4:
                                            snackbar.show('Mã xác thực hết hạn', 'danger')
                                            break
                                    }
                                    return
                                }
                                if (e) {
                                    snackbar.show(constants.msg.user.confirm_code_not_success, "danger");
                                }

<<<<<<< Updated upstream
                                })
                                break
                            case 2:
                                userProvider.confirmCode(this.state.phone, text, (s, e) => {
                                    this.setState({
                                        disabledConfirm: false
                                    })
                                    if (s) {
                                        switch (s.code) {
                                            case 0:
                                                snackbar.show(constants.msg.user.confirm_code_success, "success");
                                                this.props.navigation.replace("resetPassword", {
                                                    user: s.data.user,
                                                    id: s.data.user.id,
                                                    nextScreen: this.nextScreen
                                                });
                                                break;
                                            case 2:
                                                snackbar.show('Mã xác thực không đúng', 'danger')
                                                break
                                            case 4:
                                                snackbar.show('Mã xác thực hết hạn', 'danger')
                                                break
                                        }
=======
                            });
                            break
                        case 3:
                            let data = {
                                'otp': text
                            }
                            if (data && this.state.id) {
                                profileProvider.checkOtp(data, this.state.id).then(res => {
                                    if (res.code == 0) {
                                        this.props.navigation.replace('shareDataProfile', { id: res.data.record.id })
                                        return;
                                    }
                                    if (res.code == 4) {
                                        snackbar.show('Mã bạn nhập đã hết hạn', 'danger')
                                        return
>>>>>>> Stashed changes
                                    }
                                    if (res.code == 5) {
                                        snackbar.show('Mã bạn nhập không đúng', 'danger')
                                        return
                                    }
                                    else {
                                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')

                                    }
                                })
                            }
                            break
                    }


                }).catch(e => {
                    snackbar.show(constants.msg.app.not_internet, "danger");
                });


        }
    }
    handleTextChange = (text) => {
<<<<<<< Updated upstream
        this.setState({
            text
        }, () => {
            if (this.state.text.length == 6) {
                this.onCheckOtp()
            }
        })

=======
        if (text.length == 6) {
            this.onCheckOtp(text)
        }
>>>>>>> Stashed changes
    }
    render() {
        return (
            <ImageBackground
                style={{ flex: 1, backgroundColor: '#000', height: DEVICE_HEIGHT }}
                source={require('@images/new/account/img_bg_login.png')}
                resizeMode={'cover'}
                resizeMethod="resize">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <HeaderBar></HeaderBar>
                    <View
                        style={{
                            marginTop: 60,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ fontSize: 24, fontWeight: '800', color: '#00BA99', alignSelf: 'center' }}>XÁC NHẬN SỐ ĐIỆN THOẠI</Text>
                        {/* <ScaleImage source={require("@images/logo.png")} width={120} /> */}
                    </View>
                    <KeyboardAvoidingView behavior="padding" style={styles.form}>
                        <View style={{ borderWidth: 0.5, borderStyle: 'solid', borderColor: '#808080', borderRadius: 10, paddingTop: 30, alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 50, color: '#000000' }}>Vui lòng nhập mã xác thực được gửi tới {`\n`} số điện thoại {this.state.phone}</Text>
                            {/* <Form ref={ref => (this.form = ref)}>
                                <TextInput
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 6,
                                            maxlength: 6
                                        },
                                        messages: {
                                            required: "Vui lòng nhập mã OTP",
                                            minlength: "Yêu cầu nhập đúng 6 ký tự",
                                            maxlength: "Yêu cầu nhập đúng 6 ký tự"
                                        }
                                    }}
                                    inputStyle={styles.input}
                                    onChangeText={(text) => {
                                        debugger;
                                        this.handleTextChange(text)
                                    }}
                                    placeholder={constants.input_code}
                                    autoCapitalize={"none"}
                                    keyboardType="numeric"
                                    autoCorrect={false}
                                />
                            </Form> */}
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {
                                    this.handleTextChange(text)
                                }}
                                placeholder={constants.input_code}
                                autoCapitalize={"none"}
                                keyboardType="numeric"
                                autoCorrect={false}
                                maxLength={6}
                            ></TextInput>
                            <Text style={styles.txTime}>Mã xác thực hiệu lực trong: <Text style={styles.txCountTime}>{this.state.seconds > 9 ? this.state.seconds : '0' + this.state.seconds}s</Text></Text>
                        </View>
                        {
                            this.state.countResend ? (<Text style={[styles.txReSent, { color: 'red', marginTop: 10 }]}>Bạn chỉ được chọn gửi lại mã tối đa 5 lần, xin vui lòng thử lại sau 60 phút</Text>) :
                                <View>
                                    <Text style={{ fontStyle: 'italic', color: '#000', marginTop: 100 }}>Bạn cho rằng mình chưa nhận được mã ?</Text>
                                    <TouchableOpacity style={styles.btnReSend} disabled={this.state.disabled} onPress={this.onReSendPhone}><Text style={styles.txBtnReSend}>Gửi lại mã</Text></TouchableOpacity>
                                </View>
                        }

                    </KeyboardAvoidingView>
                </ScrollView>
            </ImageBackground>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textInputStyle: {
    },
    textInputContainer: {
        marginTop: 10
    },
    titleStyle: { textAlign: 'left', marginLeft: 20 },
    txContents: { color: '#333335', textAlign: 'center', fontSize: 14, marginTop: 20 },
    logo: { marginTop: 20, alignSelf: 'center' },
    txTime: { color: '#808080', fontStyle: 'italic', marginVertical: 20, textAlign: 'center', fontSize: 16, },
    txCountTime: { color: '#808080', fontStyle: 'italic', fontWeight: 'bold', fontSize: 16 },
    txReSent: { color: '#000', fontStyle: 'italic', fontWeight: '700', textAlign: 'center', fontSize: 14 },
    btnFinish: { backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    txFinish: { color: '#FFF', fontSize: 17 },
    btnReSend: { alignSelf: 'center', padding: 2, marginTop: 15, borderRadius: 5, height: 28, width: 100, justifyContent: 'center', alignItems: 'center' },
    txBtnReSend: { color: '#3161AD', fontStyle: 'italic', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline' },
    txErr: {
        textAlign: 'center', color: 'red', fontSize: 14, fontStyle: 'italic', fontWeight: '700', marginTop: 20
    },
    input: {
        maxWidth: 300,
        paddingRight: 30,
        backgroundColor: "#FFF",
        width: DEVICE_WIDTH - 40,
        height: 42,
        textAlign: "center",
        marginHorizontal: 40,
        paddingLeft: 15,
        borderRadius: 6,
        color: "#006ac6",
        borderWidth: 1,
        borderColor: "rgba(155,155,155,0.7)"
    },
    picture: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: null,
        height: null,
        resizeMode: "cover"
    },
    form: {
        marginTop: 60,
        alignItems: "center"
    },
    text: {
        backgroundColor: "transparent"
    },
    signup_section: {
        marginTop: 30,
        flex: 1,
        width: DEVICE_WIDTH,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    btnEye: {
        position: "absolute",
        right: 25,
        top: 10
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: "rgba(0,0,0,0.2)"
    },
    errorStyle: {
        color: "red",
        marginLeft: 40
    },
    scroll: { flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20, backgroundColor: '#fff' }

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(VerifyPhoneNumberScreen);
