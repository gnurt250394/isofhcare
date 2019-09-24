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

class CheckOtpScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            seconds: 90,
            txErr: '',
            reset: 2
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
        profileProvider.resendOtp(id).then(res => {
            this.setState({
                seconds: 90
            })

        }).catch(err => {
            snackbar.show(constants.msg.notification.error_retry, 'danger')
        })
    }
    onCheckToken = () => {
        let data = {
            'otp': this.state.text1
        }
        let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
        if (data && id) {
            profileProvider.checkOtp(data, id).then(res => {
                if (res.code == 0) {
                    NavigationService.navigate('shareDataProfile', { id: res.data.record.id })
                    return;
                }
                if (res.code == 4) {
                    snackbar.show(constants.msg.user.code_expired, 'danger')
                    return
                }
                if (res.code == 5) {
                    snackbar.show(constants.msg.user.code_invalid, 'danger')
                    return
                }
                else {
                    snackbar.show(constants.msg.notification.error_retry, 'danger')

                }
            })
        }
    }
    handleTextChange = text => this.setState({ text1: text })
    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title={constants.title.confirm_phone}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.flex} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <ScaleImage source={require("@images/new/isofhcare.png")} width={180} style={styles.logo} />
                        <Text style={styles.txContents}>Một mã xác nhận 6 chữ số vừa được gửi đến số điện thoại {this.state.phone}. Vui lòng điền mã số và hoàn tất thêm thành viên</Text>
                        <OTPTextView
                            containerStyle={styles.textInputContainer}
                            handleTextChange={this.handleTextChange}
                            inputCount={6}
                            keyboardType="numeric"
                            underlineColorAndroid={'#fff'}
                            tintColor={'#03C39A'}
                            textInputStyle={styles.textInputStyle}
                        />
                        <Text style={styles.txTime}>Mã xác thực hiệu lực trong   <Text style={styles.txCountTime}>{this.state.seconds > 9 ? this.state.seconds : '0' + this.state.seconds}</Text>   giây</Text>
                        <Text style={styles.txReSent}>Nếu bạn cho rằng mình chưa nhập được mã hãy chọn</Text>
                        <TouchableOpacity onPress={this.onReSendPhone} style={styles.btnReSend}><Text style={styles.txBtnReSend}>Gửi lại mã</Text></TouchableOpacity>
                        {this.state.txErr ? <Text style={styles.txErr}>{this.state.txErr}</Text> : null}
                    </View>
                    <TouchableOpacity onPress={this.onCheckToken} style={styles.btnFinish} >
                        <Text style={styles.txFinish}>{"HOÀN TẤT"}</Text>
                    </TouchableOpacity>
                </ScrollView>

            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    container: {
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
export default connect(mapStateToProps)(CheckOtpScreen);
