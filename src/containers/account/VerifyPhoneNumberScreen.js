import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
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
        let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
        userProvider.reSendOtp(id).then(res => {
            if (res.code == 'OK')
                this.setState({
                    seconds: 90
                })

        }).catch(err => {
            snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
        })
    }
    getDetails = (id, token) => {
        userProvider.getDetailsUser(id).then(res => {
            let user = res.details
            user.loginToken = token
            let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
            if (callback) {
                callback(user);
                this.props.navigation.pop();
            }
        })

    }
    handleTextChange = (text) => {
        if (text && text.length == 6 && this.state.verify) {
            connectionUtils
                .isConnected()
                .then(s => {
                    switch (this.state.verify) {
                        case 1:
                            userProvider.checkOtpPhone(this.state.id, text).then(res => {
                                if (res.code == 'OK') {
                                    client.auth = res.details
                                    snackbar.show(res.mesage, 'success')
                                    let token = res.details
                                    this.getDetails(this.state.id, token)
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
                                    return;
                                }
                                if (res.code == 'NOK') {
                                    let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                                    if (callback) {
                                        callback();
                                        this.props.navigation.pop();
                                    }
                                    snackbar.show(res.mesage, 'danger')
                                    return
                                }
                            })
                            break
                        case 3:
                            let data = {
                                'otp': text
                            }
                            if (data && this.state.id) {
                                profileProvider.checkOtp(data, this.state.id).then(res => {
                                    if (res.code == 0) {
                                        NavigationService.navigate('shareDataProfile', { id: res.data.record.id })
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
    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title="Xác nhận số điện thoại"
                titleStyle={styles.titleStyle}
                showFullScreen={true}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={{ flex: 1, padding: 20 }}>
                        <ScaleImage source={require("@images/new/isofhcare.png")} width={180} style={styles.logo} />
                        <Text style={styles.txContents}>Một mã xác nhận 6 chữ số vừa được gửi đến số điện thoại {this.state.phone}. Vui lòng điền mã số để hoàn tất</Text>
                        <OTPTextView
                            containerStyle={styles.textInputContainer}
                            handleTextChange={text => this.handleTextChange(text)}
                            inputCount={6}
                            keyboardType="numeric"
                            underlineColorAndroid={'#fff'}
                            tintColor={'#03C39A'}
                            textInputStyle={styles.textInputStyle}
                        />
                        <Text style={styles.txTime}>Mã xác thực hiệu lực trong   <Text style={styles.txCountTime}>{this.state.seconds > 9 ? this.state.seconds : '0' + this.state.seconds}</Text>   giây</Text>
                        {this.state.txErr ? <Text style={styles.txErr}>{this.state.txErr}</Text> : null}
                        <Text style={styles.txReSent}>Nếu bạn cho rằng mình chưa nhập được mã hãy chọn</Text>
                    </View>
                    <TouchableOpacity onPress={this.onReSendPhone} style={styles.btnFinish} >
                        <Text style={styles.txFinish}>{"Gửi lại mã"}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textInputStyle: {
        width: 30
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

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(VerifyPhoneNumberScreen);
