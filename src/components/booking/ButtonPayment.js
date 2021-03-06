import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  DeviceEventEmitter,
  NativeModules,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import RNMomosdk from 'react-native-momosdk';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
import voucherProvider from '@data-access/voucher-provider';
import snackbar from '@utils/snackbar-utils';
import NavigationService from '@navigators/NavigationService';
const RNMomosdkModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMomosdkModule);
import paymentProvider from '@data-access/payment-provider';

import constants from '@resources/strings';
import ModalCardNumber from './ModalCardNumber';
const ButtonPayment = ({
  allowBooking,
  booking,
  price,
  voucher,
  paymentMethod,
  title,
  createBooking,
}) => {
  const isChecking = useRef(true);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const [momoPartnerCode, setMomoPartnerCode] = useState('');
  const getData = async () => {
    try {
      let res = await paymentProvider.getListCard();
      setData(res);
    } catch (error) {}
  };
  const getPaymentMomo = async () => {
    try {
      let hospitalId = booking?.hospital?.id;
      console.log('booking: ', booking);
      let res = await paymentProvider.getConfigMomo(hospitalId);
      // setData(res);
      setMomoPartnerCode(res?.momoPartnerCode);
    } catch (error) {}
  };
  useEffect(() => {
    getData();
    getPaymentMomo();
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenReceived',
      response => {
        try {
          console.log('<MoMoPay>Listen.Event::', response);
          if (response && response.status == 0) {
            //SUCCESS: continue to submit momoToken,phonenumber to server
            let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
            let momoToken = response.data;
            let phonenumber = response.phonenumber;
            let message = response.message;
            let orderId = response.refOrderId;
            createBooking({phonenumber, momoToken});
          } else {
            //let message = response.message;
            //Has Error: show message here
          }
        } catch (ex) {}
      },
    );
    //OPTIONAL
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenState',
      response => {
        console.log('<MoMoPay>Listen.RequestTokenState:: ' + response.status);
        // status = 1: Parameters valid & ready to open MoMo app.
        // status = 2: canOpenURL failed for URL MoMo app
        // status = 3: Parameters invalid
      },
    );
    return () => {};
  }, []);

  // TODO: Action to Request Payment MoMo App
  const requestPaymentMomo = async () => {
    let jsonData = {};
    jsonData.enviroment = constants.momo_config.enviroment; //SANBOX OR PRODUCTION
    jsonData.action = constants.momo_config.action;
    jsonData.partner = constants.momo_config.partner;
    jsonData.merchantcode = momoPartnerCode|| constants.momo_config.partner_code; //edit your merchantcode here
    jsonData.merchantname = booking?.hospital?.name; //edit your merchantname here
    jsonData.merchantnamelabel = constants.momo_config.partner_label;
    jsonData.description = `Thanh to??n cho m?? ?????t kh??m ${booking?.reference}`;
    jsonData.amount = parseInt(price) || 0; //order total amount
    jsonData.orderId = booking?.reference;
    jsonData.orderLabel = constants.momo_config.order_label;
    jsonData.appScheme = momoPartnerCode?.toLowerCase()|| constants.momo_config.app_scheme; // iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
    console.log('data_request_payment ' + JSON.stringify(jsonData));
    if (Platform.OS === 'android') {
      let dataPayment = await RNMomosdk.requestPayment(jsonData);
      momoHandleResponse(dataPayment);
    } else {
      RNMomosdk.requestPayment(jsonData);
    }
  };

  async function momoHandleResponse(response) {
    console.log('response: ', response);
    try {
      if (response && response.status == 0) {
        //SUCCESS continue to submit momoToken,phonenumber to server
        let fromapp = response.fromapp; //ALWAYS:: fromapp == momotransfer
        let momoToken = response.data;
        let phonenumber = response.phonenumber;
        let message = response.message;
        createBooking({phonenumber, momoToken});
      } else {
        isChecking.current = true;
        //let message = response.message;
        //Has Error: show message here
      }
    } catch (ex) {}
  }

  const onPress = async () => {
    // if (isChecking.current) {
    //     isChecking.current = false
    console.log('paymentMethod: ', paymentMethod);
    switch (paymentMethod) {
      case constants.PAYMENT_METHOD.VNPAY: // 'VNPAY'
        break;
      case constants.PAYMENT_METHOD.MOMO: // 'V?? MoMo'
        requestPaymentMomo();
        break;
      case constants.PAYMENT_METHOD.ATM: //' ATM'
      case constants.PAYMENT_METHOD.VISA: // 'VISA'
      case constants.PAYMENT_METHOD.QR: //'Thanh to??n QR code'
        if (data.length) {
          setIsVisible(true);
        } else {
          createBooking({});
        }
        break;
      case constants.PAYMENT_METHOD.CASH: // 'Thanh to??n sau t???i CSYT'
      case constants.PAYMENT_METHOD.BANK_TRANSFER: //'Chuy???n kho???n tr???c ti???p'
        createBooking({});
        break;
      default:
        snackbar.show('Vui l??ng ch???n h??nh th???c thanh to??n', 'danger');
        break;
    }
    // }
  };
  const onBackdropPress = () => setIsVisible(false);
  const onSend = cardNumber => {
    createBooking({cardNumber});
    onBackdropPress();
  };
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          allowBooking ? {backgroundColor: '#02c39a'} : {},
        ]}>
        <Text style={styles.datkham}>{title}</Text>
      </TouchableOpacity>
      <ModalCardNumber
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        data={data}
        onSend={onSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 15,
    alignSelf: 'center',
    borderRadius: 6,
    // backgroundColor: "#cacaca",
    backgroundColor: '#02c39a',
    shadowColor: 'rgba(0, 0, 0, 0.21)',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    width: 250,
  },
  datkham: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
    padding: 15,
    textAlign: 'center',
  },
});
export default ButtonPayment;
