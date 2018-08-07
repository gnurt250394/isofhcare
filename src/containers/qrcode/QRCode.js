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

class ScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
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
    onSuccess(e) {
        try {
            if (e) {
                if (e.data) {
                    var json = JSON.parse(e.data.replace("﻿", ""));
                    this.setState({ isLoading: true });
                    userProvider.loginId(json.id, this.loginSuccess.bind(this));
                    return;
                }
            }
        } catch (error) {

        }
        this.setState({ isLoading: false });
        snackbar.show("Không tìm thấy thông tin đăng nhập hợp lệ trong QRCode của bạn");
        setTimeout(() => {
            this.scanner.reactivate();
        }, 3000);
    }

    render() {
        return (
            <ActivityPanel isLoading={this.state.isLoading} style={{ flex: 1 }} title="Quét QR Code" showFullScreen={true} hideActionbar={true} barStyle={"default"} >

                <QRCodeScanner
                    // reactivate={true}
                    ref={(node) => { this.scanner = node }}
                    showMarker={true}
                    onRead={this.onSuccess.bind(this)}
                    topContent={
                        <Text style={styles.centerText}>
                            Di chuyển camera đến vùng chứa mã QR để quét</Text>
                    }
                    bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable} onPress={() => Actions.pop()}>
                            <Text style={styles.buttonText}>Quay về</Text>
                        </TouchableOpacity>
                    }
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
        color: '#777',
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
export default connect(mapStateToProps)(ScanScreen);