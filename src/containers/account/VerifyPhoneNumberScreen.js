import React from 'react';
import { StyleSheet, Text, View, Keyboard, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Content, Item, Input } from 'native-base';
// import { Grid, Col } from 'react-native-easy-grid';
import OTPTextView from 'react-native-otp-textinput'
import ScaleImage from "mainam-react-native-scaleimage";
import constants from "@resources/strings";
import ActivityPanel from "@components/ActivityPanel";
import userProvider from '@data-access/user-provider'
import snackbar from '@utils/snackbar-utils';
import { connect } from "react-redux";
import profileProvider from '@data-access/profile-provider'
import NavigationService from "@navigators/NavigationService";
import redux from "@redux-store";
import client from '@utils/client-utils';
import connectionUtils from "@utils/connection-utils";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import ButtonSubmit from "@components/ButtonSubmit";
import { TouchableOpacity } from 'react-native-gesture-handler';

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
            verify
        }
    }
    componentDidMount() {
        setInterval(() => {
            if (this.state.seconds > 0)
                this.setState({
                    seconds: this.state.seconds - 1
                })
        }, 1000);
    }
    onReSendPhone = () => {
        this.setState({
            disabled: true
        }, () => {
            connectionUtils
                .isConnected()
                .then(s => {
                    let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
                    userProvider.reSendOtp(id).then(res => {
                        if (res.code == 0)
                            this.setState({
                                seconds: 90,

                            })
                        else {
                            snackbar.show(res.mesage, 'danger')
                        }
                    }).catch(err => {
                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                    })
                    this.setState({
                        disabled: false
                    })
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
    onCheckOtp = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            this.child.unPress();
            return;
        }
        let text = this.state.text
        if (this.state.verify) {
            connectionUtils
                .isConnected()
                .then(s => {
                    this.child.unPress();
                    switch (this.state.verify) {
                        case 1:
                            userProvider.checkOtpPhone(this.state.id, text).then(res => {
                                if (res.code == 0) {
                                    client.auth = res.details
                                    snackbar.show(res.mesage, 'success')
                                    let user = res.data.user
                                    let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                                    if (callback) {
                                        callback(user);
                                        this.props.navigation.pop();
                                    }
                                    // this.getDetails(this.state.id, token)
                                    // var user = s.data.user;
                                    // user.bookingNumberHospital = s.data.bookingNumberHospital;
                                    // user.bookingStatus = s.data.bookingStatus;
                                    // if (s.data.profile && s.data.profile.uid)
                                    //     user.uid = s.data.profile.uid;
                                    //     user.loginToken = res.details
                                    // this.props.dispatch(redux.userLogin(user));
                                    // if (this.nextScreen) {
                                    //     this.props.navigation.replace(
                                    //         this.nextScreen.screen,
                                    //         this.nextScreen.param
                                    //     );
                                    // } else this.props.navigation.navigate("home", { showDraw: false });
                                } else {
                                    snackbar.show(res.message, 'danger')
                                }
                            })
                            break
                        case 2:
                            userProvider.confirmCode(this.state.phone, text, (s, e) => {
                                if (s) {
                                    switch (s.code) {
                                        case 0:
                                            console.log(s, 'asdasdasd')
                                            snackbar.show(constants.msg.user.confirm_code_success, "success");
                                            this.props.navigation.replace("resetPassword", {
                                                user: s.data.user,
                                                id: s.data.user.id,
                                                nextScreen: this.nextScreen
                                            });
                                            return;
                                    }
                                }
                                if (e) {
                                    console.log(e);
                                }
                                snackbar.show(constants.msg.user.confirm_code_not_success, "danger");
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
        this.setState({
            text
        })
    }
    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                showFullScreen={true}
                title="Xác thực tài khoản"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={{
                            marginTop: 60,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <ScaleImage source={require("@images/logo.png")} width={120} />
                    </View>
                    <KeyboardAvoidingView behavior="padding" style={styles.form}>
                        <Form ref={ref => (this.form = ref)}>
                            <TextField
                                errorStyle={styles.errorStyle}
                                validate={{
                                    rules: {
                                        required: true,
                                        minlength: 6,
                                        maxlength: 6
                                    },
                                    messages: {
                                        required: "Vui lòng nhập mã OTP",
                                        minlength: "Yêu cầu nhập đủ 6 ký tự",
                                        maxlength: "Yêu cầu nhập đủ 6 ký tự"
                                    }
                                }}
                                inputStyle={styles.input}
                                onChangeText={text =>
                                    this.handleTextChange(text)
                                }
                                placeholder={constants.input_code}
                                autoCapitalize={"none"}
                                returnKeyType={"next"}
                                keyboardType="numeric"
                                autoCorrect={false}
                            />
                        </Form>
                        <Text style={styles.txTime}>Mã xác thực hiệu lực trong   <Text style={styles.txCountTime}>{this.state.seconds > 9 ? this.state.seconds : '0' + this.state.seconds}</Text>   giây</Text>
                        <Text style={styles.txReSent}>Nếu bạn cho rằng mình chưa nhập được mã hãy chọn</Text>
                        <TouchableOpacity disabled={this.state.disabled} onPress={this.onReSendPhone}><Text style={[styles.txReSent, { color: 'red' }]}>Gửi lại mã</Text></TouchableOpacity>
                        <ButtonSubmit
                            onRef={ref => (this.child = ref)}
                            click={this.onCheckOtp}
                            text={'Xác nhận'}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
            </ActivityPanel>
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
    txTime: { color: '#000', fontStyle: 'italic', fontWeight: '700', marginVertical: 20, textAlign: 'center', fontSize: 14 },
    txCountTime: { color: 'red', fontStyle: 'italic', fontSize: 14 },
    txReSent: { color: '#000', fontStyle: 'italic', fontWeight: '700', textAlign: 'center', fontSize: 12 },
    btnFinish: { backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    txFinish: { color: '#FFF', fontSize: 17 },
    btnReSend: { alignSelf: 'flex-end', padding: 2, backgroundColor: '#A3D29C', marginTop: 15, paddingHorizontal: 10, marginRight: 5 },
    txBtnReSend: { color: '#000', fontStyle: 'italic', fontWeight: '500', fontSize: 13 },
    txErr: { textAlign: 'center', color: 'red', fontSize: 14, fontStyle: 'italic', fontWeight: '700', marginTop: 20 },
    input: {
        maxWidth: 300,
        paddingRight: 30,
        backgroundColor: "#FFF",
        width: DEVICE_WIDTH - 40,
        height: 42,
        marginHorizontal: 20,
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
        marginLeft: 20
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(VerifyPhoneNumberScreen);
