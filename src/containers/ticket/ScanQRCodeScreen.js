'use strict';
import snackbar from '@utils/snackbar-utils';
import ActivityPanel from '@components/ActivityPanel';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import { connect } from 'react-redux';

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking
} from 'react-native';

import QRCodeScanner from 'mainam-react-native-qrcode-scanner';

class ScanQRCodeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }
    componentDidMount() {
        console.disableYellowBox = true;
    }
    loginSuccess(s, e) {
        this.setState({ isLoading: false });
        if (s) {
            // snackbar.show("Thông tin đăng nhập không hợp lệ");
            // return;
            switch (s.code) {
                case 0:
                    var user = s.data.user;
                    // if (user.role == 4) {
                    // 	snackbar.show(constants.msg.user.please_login_on_web_to_management);
                    // 	return;
                    // }
                    snackbar.show(constants.msg.user.login_success);
                    this.props.dispatch(redux.userLogin(user));
                    Actions.home();
                    return;
                case 2:
                    snackbar.show(constants.msg.user.username_or_password_incorrect);
                    break;
                case 3:
                case 1:
                    snackbar.show(constants.msg.user.account_blocked);
            }

        }
        if (e) {
            console.log(e);
        }
        snackbar.show(constants.msg.error_occur);
        setTimeout(() => {
            this.scanner.reactivate();
        }, 3000);

    }
    toByteArray(hexString) {
        var result = [];
        for (var i = 0; i < hexString.length; i += 2) {
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
    }
    getInfo(data) {
        let obj = data.split("|");
        let info = {};
        console.log(obj);
        info.id = obj[0];
        info.bod = obj[2];
        info.gender = obj[3] == 1 ? 1 : 0;
        let bytearr = this.toByteArray(obj[1]);
        info.fullname = this.fromUTF8Array(bytearr);
        info.startDate = obj[6];
        info.hospitalCode = obj[5];
        bytearr = this.toByteArray(obj[4]);
        info.address = this.fromUTF8Array(bytearr);
        if (obj.length < 7)
            throw "Vui lòng kiểm tra lại mã QR trên thẻ đảm bảo không bị mờ, rách...";
        console.log(info);
        return info;
    }
    fromUTF8Array(data) { // array of bytes
        var str = '',
            i;

        for (i = 0; i < data.length; i++) {
            var value = data[i];

            if (value < 0x80) {
                str += String.fromCharCode(value);
            } else if (value > 0xBF && value < 0xE0) {
                str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                i += 1;
            } else if (value > 0xDF && value < 0xF0) {
                str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                i += 2;
            } else {
                // surrogate pair
                var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

                str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                i += 3;
            }
        }

        return str;
    }

    onSuccess(e) {
        try {
            let data = this.getInfo(e.data);
            setTimeout(() => {
                this.scanner.reactivate();
            }, 3000);
            this.props.navigation.replace("confirmGetTicket", {
                data
            })
            return;
        } catch (error) {
            if (error)
                snackbar.show("Vui lòng kiểm tra lại mã QR trên thẻ đảm bảo không bị mờ, rách...", "danger");
        }
        setTimeout(() => {
            this.scanner.reactivate();
        }, 3000);
    }

    render() {
        return (
            <ActivityPanel isLoading={this.state.isLoading} style={{ flex: 1 }} title="Quét QR BHYT" >

                <QRCodeScanner
                    // reactivate={true}
                    ref={(node) => { this.scanner = node }}
                    showMarker={true}
                    onRead={this.onSuccess.bind(this)}
                    topContent={
                        <Text style={styles.centerText}>
                            Di chuyển camera tới vùng có QR của bảo hiểm y tế để quét</Text>
                    }
                // bottomContent={
                //     <TouchableOpacity style={styles.buttonTouchable} onPress={() => Actions.pop()}>
                //         <Text style={styles.buttonText}>Quay về</Text>
                //     </TouchableOpacity>
                // }
                />
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        padding: 32,
        color: '#FFF',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ScanQRCodeScreen);