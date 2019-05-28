'use strict';
import snackbar from '@utils/snackbar-utils';
import ActivityPanel from '@components/ActivityPanel';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Platform,
    View,
    Linking
} from 'react-native';

import QRCodeScanner from 'mainam-react-native-qrcode-scanner';
import ticketProvider from '@data-access/ticket-provider';

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
        // setTimeout(() => {
        //     try {
        //         this.scanner.reactivate();
        //     } catch (error) {

        //     }
        // }, 3000);

    }
    toByteArray(hexString) {
        var result = [];
        for (var i = 0; i < hexString.length; i += 2) {
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
    }
    getAddress(address) {
        let x = address.split(",");
        return x.filter((item, index) => { return index < x.length - 3 });
    }
    getInfo(data) {
        let obj = data.split("|");
        let info = {};
        console.log(obj);
        info.qrCode = data;
        info.id = obj[0];
        info.bod = obj[2];
        info.gender = obj[3] == 1 ? 1 : 0;
        let bytearr = this.toByteArray(obj[1]);
        info.fullname = this.fromUTF8Array(bytearr);
        info.startDate = obj[6];
        info.hospitalCode = obj[5];
        bytearr = this.toByteArray(obj[4]);
        info.address = this.getAddress(this.fromUTF8Array(bytearr)) + "";
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

    restart() {
        setTimeout(() => {
            if (this.scanner)
                this.scanner.reactivate();
        }, 3000);
    }
    getOrder(uid, data) {
        ticketProvider.getTicket("A", "false", "1000004", data.qrCode, uid, this.props.bookingTicket.hospital.hospital.id).then(s => {
            console.log(s);
        })
    }
    onSuccess(e) {
        try {
            this.setState({ isLoading: true }, () => {
                let data = this.getInfo(e.data);
                if (!this.props.userApp.currentUser.uid) {
                    this.setState({ isLoading: true }, () => {
                        this.getOrder(this.props.userApp.currentUser.uid, data);
                    })
                }
                else {
                    userProvider.detail(this.props.userApp.currentUser.id).then(s => {
                        if (!s.data || !s.data.profile || !s.data.profile.uid) {
                            this.setState({ isLoading: false }, () => {
                                snackbar.show("Tài khoản của bạn chưa được kết nối với bệnh viện này. Vui lòng liên hệ quản trị viên iSofHCare", "danger");
                                this.restart();
                            })
                        }
                        else {
                            let uid = s.data.profile.uid;
                            this.getOrder(uid, data);
                        }
                    }).catch(e => {
                        this.setState({ isLoading: false }, () => {
                            snackbar.show(constants.msg.error_occur, "danger");
                            this.restart();
                        })
                    })
                }
            })
            return;
        } catch (error) {
            if (error)
                snackbar.show("Vui lòng kiểm tra lại mã QR trên thẻ đảm bảo không bị mờ, rách...", "danger");
        }
    }
    onCloseModal = () => this.setState({ isVisible: false })

    render() {
        const deviceWidth = Dimensions.get("window").width;
        const deviceHeight = Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
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
                <Modal animationType="fade"
                    onBackdropPress={this.onCloseModal}
                    transparent={true} isVisible={this.state.isVisible} style={[styles.viewModal]}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                >
                    <View style={styles.viewModal}>
                        <View style={styles.viewDialog}>
                            <Text style={styles.txDialog}>Lấy số khám</Text>
                            <View style={styles.viewBtnModal}>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => {
                                    this.setState({ isVisible: false }, () => {
                                        this.props.navigation.navigate("scanQRCode");
                                    });
                                }} ><Text style={{ color: '#fff', fontWeight: 'bold' }} >Lấy số cho tôi</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.viewBtn2} onPress={() => {
                                    this.setState({ isVisible: false }, () => {
                                        this.props.navigation.navigate("login", {
                                            nextScreen: { screen: "scanQRCode", param: {} }
                                        });
                                    });
                                }} ><Text style={{ color: '#4A4A4A', fontWeight: 'bold' }}>Lấy số hộ</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        userApp: state.userApp,
        bookingTicket: state.bookingTicket
    };
}
export default connect(mapStateToProps)(ScanQRCodeScreen);