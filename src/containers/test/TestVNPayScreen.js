import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';
import snackbarUtils from '@utils/snackbar-utils';
class TestVNPayScreen extends Component {
    constructor(props) {
        super(props)
        var secretKey = "KYSUQYRHOXBRQXSPJYBIOAUUFOCFGHNY";
        var vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var vnp_Params = {};
        let date = new Date();
        vnp_Params['vnp_Version'] = '2';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = "3FXCFUB7";
        vnp_Params['vnp_Locale'] = "vn";
        vnp_Params['vnp_CurrCode'] = "VND";
        vnp_Params['vnp_TxnRef'] = date.format('HHmmss');
        vnp_Params['vnp_OrderInfo'] = "Thanh toan don hang thoi gian: 2019-03-06 08:03:14";
        vnp_Params['vnp_OrderType'] = "topup";
        vnp_Params['vnp_Amount'] = 1000000;
        vnp_Params['vnp_ReturnUrl'] = "http://localhost:8888/order/vnpay_return";
        vnp_Params['vnp_IpAddr'] = "::1";
        vnp_Params['vnp_CreateDate'] = date.format('yyyyMMddHHmmss');
        vnp_Params['vnp_BankCode'] = "NCB";

        vnp_Params = this.sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
        var md5 = require('md5');

        var secureHash = md5(signData);

        vnp_Params['vnp_SecureHashType'] = 'MD5';
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
        this.state = {
            vnpUrl
        }
        console.log(vnpUrl);
    }
    sortObject(o) {
        var sorted = {},
            key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    }

    navigationStateChangedHandler = ({ url }) => {
        if (url.indexOf("http://localhost:8888/order/vnpay_return") == 0) {
            console.log(url);
            snackbarUtils.show("thanh toán thành công", "success");
        }
    };
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="TestVNPayScreen">
                <WebView
                    style={{ flex: 1 }}
                    automaticallyAdjustContentInsets={true}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    allowsInlineMediaPlayback={true}
                    dataDetectorTypes={"all"}
                    mixedContentMode='always'
                    source={{ uri: this.state.vnpUrl }}
                    onNavigationStateChange={this.navigationStateChangedHandler}
                    ref={c => {
                        this.WebView = c;
                    }}
                />
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(TestVNPayScreen);