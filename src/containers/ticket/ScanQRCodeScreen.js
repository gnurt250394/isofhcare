'use strict';
import snackbar from '@utils/snackbar-utils';
import ActivityPanel from '@components/ActivityPanel';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import stringUtils from 'mainam-react-native-string-utils';

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
const deviceWidth = Dimensions.get("window").width;

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
        if (obj.length < 7)
            throw "";
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
            switch (s.code) {
                case 0:
                    if (s.data.informationUserHospital.oderCode) {
                        data.oderCode = s.data.informationUserHospital.oderCode;
                        this.setState({ isLoading: false }, () => {
                            this.props.navigation.replace("confirmGetTicket", {
                                data
                            })
                        });
                    }
                    else
                        this.setState({ isLoading: false }, () => {
                            snackbar.show(constants.msg.error_occur, "danger");
                            this.restart();
                        })

                    break;
                case 3:
                    this.setState({
                        isLoading: false,
                        showError: true, dialog: {
                            title: "SỐ KHÁM VƯỢT ĐỊNH MỨC", content: "Bạn đã lấy quá nhiều số khám trong ngày. Hãy quay lại vào ngày mai", button: "Xem lịch sử lấy số", onPress: () => {
                                this.props.navigation.navigate("selectHealthFacilitiesScreen", {
                                    selectTab: 1,
                                    requestTime: new Date()
                                });
                            }
                        }
                    });
                    return;
                default:
                    this.setState({ isLoading: false }, () => {
                        snackbar.show(constants.msg.error_occur, "danger");
                        this.restart();
                    })
            }
        })
    }
    onSuccess(e) {
        this.setState({ isLoading: true }, () => {
            try {

                let index = e.data.indexOf("$");
                let data = e.data.substring(0, index + 1);
                data = this.getInfo(data);
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
            } catch (error) {
                this.setState({ isLoading: false, showError2: true })
            }
        })
    }

    render() {
        const deviceHeight = Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
        return (
            <ActivityPanel isLoading={this.state.isLoading} style={{ flex: 1 }} title="Quét QR BHYT" >

                <QRCodeScanner
                    ref={(node) => { this.scanner = node }}
                    showMarker={true}
                    onRead={this.onSuccess.bind(this)}
                    topContent={
                        <Text style={styles.centerText}>
                            Di chuyển camera tới vùng có QR của bảo hiểm y tế để quét</Text>
                    }
                />
                <Modal animationType="fade"
                    onBackdropPress={() => {
                        this.setState({ showError: false });
                    }}
                    transparent={true}
                    isVisible={this.state.showError}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                >
                    <View style={styles.viewModal}>
                        <View style={styles.viewDialog}>
                            <Text style={styles.txDialog}>{(this.state.dialog || {}).title}</Text>
                            <Text style={styles.txDialog2}>{(this.state.dialog || {}).content}</Text>
                            <View style={{ height: 1, backgroundColor: "#00000050", width: 300, maxWidth: deviceWidth, marginTop: 20 }} />
                            <TouchableOpacity style={styles.viewBtnModal} onPress={() => {
                                if (this.state.dialog && this.state.dialog.onPress)
                                    this.state.dialog.onPress();
                            }}
                            ><Text style={{ fontWeight: 'bold', color: '#02c39a', fontSize: 15 }} >{(this.state.dialog || {}).button}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="fade"
                    onBackdropPress={() => {
                        this.setState({ showError2: false });
                    }} transparent={true}
                    isVisible={this.state.showError2}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                >
                    <View style={styles.viewModal}>
                        <View style={styles.viewDialog}>
                            <Text style={styles.txDialog}>{"MÃ QRCODE KHÔNG HỢP LỆ"}</Text>
                            <Text style={styles.txDialog2}>{"Vui lòng kiểm tra lại mã QR trên thẻ đảm bảo không bị mờ, rách..."}</Text>
                            <View style={{ height: 1, backgroundColor: "#00000050", width: 300, maxWidth: deviceWidth, marginTop: 20 }} />
                            <TouchableOpacity style={[styles.viewBtnModal, { padding: 15 }]} onPress={() => {
                                this.props.navigation.navigate("home", {
                                    navigate: { screen: "addBooking" }
                                });
                            }}
                            ><Text style={{ color: '#1ca2e3', fontSize: 15 }} >{"Đặt khám thường"}</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: "#00000050", width: 300, maxWidth: deviceWidth }} />
                            <TouchableOpacity style={[styles.viewBtnModal, { padding: 15 }]} onPress={() => {
                                this.props.navigation.navigate("selectHealthFacilitiesScreen");
                            }}
                            ><Text style={{ color: '#1ca2e3', fontSize: 15 }} >{"Lấy số khám dịch vụ"}</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: "#00000050", width: 300, maxWidth: deviceWidth }} />
                            <TouchableOpacity style={[styles.viewBtnModal, { padding: 15 }]} onPress={() => {
                                this.setState({ showError2: false }, () => {
                                    this.restart();
                                })
                            }}
                            ><Text style={{ fontWeight: 'bold', color: '#02c39a', fontSize: 15 }} >{"OK"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ActivityPanel >
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
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
    viewModal: { justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 },
    viewDialog: { backgroundColor: '#fff', alignItems: 'center', borderRadius: 6, paddingHorizontal: 20, width: 300, maxWidth: deviceWidth },
    txDialog: { fontWeight: 'bold', marginTop: 20 },
    txDialog2: {
        fontSize: 14,
        color: '#000', marginTop: 20, maxWidth: deviceWidth,
        textAlign: 'center'
    },
    viewBtnModal: {
        padding: 20,
        width: 300, maxWidth: deviceWidth,
        alignItems: 'center'
    },


});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        bookingTicket: state.bookingTicket
    };
}
export default connect(mapStateToProps)(ScanQRCodeScreen);