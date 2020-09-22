import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from "react-native-webview";
import dateUtils from 'mainam-react-native-date-utils';
import snackbarUtils from '@utils/snackbar-utils';
class PaymentWithAlePay extends Component {
    constructor(props) {
        super(props)
        let url = this.props.navigation.state.params.urlPayment;
        let title = this.props.navigation.state.params.title;
        this.state = { vnpUrl: url, title };
        // var secretKey = "KYSUQYRHOXBRQXSPJYBIOAUUFOCFGHNY";
        // var vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        // var vnp_Params = {};
        // let date = new Date();
        // vnp_Params['vnp_Version'] = '2';
        // vnp_Params['vnp_Command'] = 'pay';
        // vnp_Params['vnp_TmnCode'] = "3FXCFUB7";
        // vnp_Params['vnp_Locale'] = "vn";
        // vnp_Params['vnp_CurrCode'] = "VND";
        // vnp_Params['vnp_TxnRef'] = date.format('HHmmss');
        // vnp_Params['vnp_OrderInfo'] = "Thanh toan don hang thoi gian: 2019-03-06 08:03:14";
        // vnp_Params['vnp_OrderType'] = "topup";
        // vnp_Params['vnp_Amount'] = 1000000;
        // vnp_Params['vnp_ReturnUrl'] = "http://localhost:8888/order/vnpay_return";
        // vnp_Params['vnp_IpAddr'] = "::1";
        // vnp_Params['vnp_CreateDate'] = date.format('yyyyMMddHHmmss');
        // vnp_Params['vnp_BankCode'] = "NCB";

        // vnp_Params = this.sortObject(vnp_Params);

        // var querystring = require('qs');
        // var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
        // var md5 = require('md5');

        // var secureHash = md5(signData);

        // vnp_Params['vnp_SecureHashType'] = 'MD5';
        // vnp_Params['vnp_SecureHash'] = secureHash;
        // vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
        // this.state = {
        //     vnpUrl
        // }
        // console.log(vnpUrl);
    }
    // sortObject(o) {
    //     var sorted = {},
    //         key, a = [];

    //     for (key in o) {
    //         if (o.hasOwnProperty(key)) {
    //             a.push(key);
    //         }
    //     }

    //     a.sort();

    //     for (key = 0; key < a.length; key++) {
    //         sorted[a[key]] = o[a[key]];
    //     }
    //     return sorted;
    // }
    handleBackButton() {
        this.backButtonClick()
        return true;
    }
    componentDidMount() {
        DeviceEventEmitter.addListener('hardwareBackPress', this.handleBackButton)

    }
    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    }
    navigationStateChangedHandler = ({ url }) => {
        console.log('url: ', url);
        const { navigation } = this.props
        if (url.indexOf("isofhcare/payment/v1/alepay") != -1) {
            if (!this.isBack) {
                this.isBack = true
                console.log('this.isBack: ', this.isBack);
                this.props.navigation.pop();
                console.log('url.indexOf("checkout"): ', url.indexOf("checkout"));
                if (url.indexOf("checkout") != -1) {
                    if ((this.props.navigation.state.params || {}).onSuccess)
                        (this.props.navigation.state.params || {}).onSuccess(url);
                } else if (url.indexOf("cancel") != -1) {
                    this.backButtonClick()
                }
            }


        }

    };
    backButtonClick = () => {
        this.props.navigation.navigate("homeTab", {
            navigate: {
                screen: 'listBookingHistory'
            }
        })
    }
    render() {
        return (
            <ActivityPanel title={this.state.title}
                backButtonClick={this.backButtonClick}
                isLoading={this.state.isLoading}>
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
export default connect(mapStateToProps)(PaymentWithAlePay);