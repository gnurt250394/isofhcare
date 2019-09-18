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

class OtpPhoneNumberScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            seconds: 90,
            txErr: ''
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
        let details = this.props.navigation.state.params && this.props.navigation.state.params.details ? this.props.navigation.state.params.details : ''
        details && userProvider.reSendOtp(details).then(res => {
            // if (res.code == 'OK') {
            //     console.log('thanh cong')
            // } else {
            //     console.log('that bai');
            // }
            if (res.code == 'OK') {
                this.setState({
                    seconds: 90
                })
            } else {
                snackbar.show(res.message, 'danger')
            }

        })
    }
    onCheckToken = () => {
        let token = this.state.text1
        if (token) {
            userProvider.checkOtpSignup(token).then(res => {
                if (res.code == 'OK') {
                    this.props.userApp.loginToken = res.details
                    // let data = this.props.navigation.state.params ? this.props.navigation.state.params.data : ''
                    // let user = data ? data.user : ''
                    // user.loginToken = res.details
                    // user.bookingNumberHospital = data.bookingNumberHospital;
                    // user.bookingStatus = data.bookingStatus;
                    // if (data.profile && data.profile.uid)
                    //     user.uid = data.profile.uid;
                    // this.props.dispatch(redux.userLogin(user));
                    // if (this.nextScreen) {
                    //     this.props.navigation.replace(
                    //         this.nextScreen.screen,
                    //         this.nextScreen.param
                    //     );
                    // } else this.props.navigation.navigate("home", { showDraw: false });
                    return;
                } else {
                    snackbar.show(res.message, 'danger')

                }
            })
        }
    }
    handleTextChange = text => this.setState({ text1: text })
    render() {
        return (
            <ActivityPanel
                style={styles.flex}
                title={constants.title.confirm_phone}

                showFullScreen={true}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.flex}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.group}>
                        <ScaleImage source={require("@images/new/isofhcare.png")} width={180} style={styles.logo} />
                        <Text style={styles.txContents}>{constants.confirm_account.please_enter_otp_send_devices}</Text>
                        <OTPTextView
                            containerStyle={styles.textInputContainer}
                            handleTextChange={this.handleTextChange}
                            inputCount={6}
                            keyboardType="numeric"
                            underlineColorAndroid={'#fff'}
                            tintColor={'#03C39A'}
                            textInputStyle={styles.textInputStyle}
                        />
                        <Text style={styles.txTime}>{constants.confirm_account.otp_expied}   <Text style={styles.txCountTime}>{this.state.seconds > 9 ? this.state.seconds : '0' + this.state.seconds}</Text>   giây</Text>
                        <Text style={styles.txReSent}>{constants.confirm_account.not_recive_code}</Text>
                        <TouchableOpacity onPress={this.onReSendPhone} style={styles.btnReSend}><Text style={styles.txBtnReSend}>{constants.confirm_account.resend_otp}</Text></TouchableOpacity>
                        {this.state.txErr ? <Text style={styles.txErr}>{this.state.txErr}</Text> : null}
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={this.onCheckToken} style={styles.btnFinish} >
                    <Text style={styles.txFinish}>{constants.confirm_account.finish}</Text>
                </TouchableOpacity>
            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    group: {
        flex: 1,
        padding: 20
    },
    flex: { flex: 1 },
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
    btnReSend: { alignSelf: 'flex-end', padding: 2, backgroundColor: '#A3D29C', marginTop: 15, paddingHorizontal: 10 },
    txBtnReSend: { color: '#000', fontStyle: 'italic', fontWeight: '500', fontSize: 13 },
    txErr: { textAlign: 'center', color: 'red', fontSize: 14, fontStyle: 'italic', fontWeight: '700', marginTop: 20 },

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(OtpPhoneNumberScreen);
