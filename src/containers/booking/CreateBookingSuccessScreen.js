import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import ScaleImage from 'mainam-react-native-scaleimage';
import QRCode from 'react-native-qrcode-svg';
import Modal from '@components/modal';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';

class CreateBookingSuccessScreen extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    isVisible: false,
  };
  onQrClick = () => {
    this.setState({
      isVisible: true,
    });
  };

  getPaymentMethod(booking) {
    console.log('booking: ', booking);
    switch (booking.invoice.payment) {
      case constants.PAYMENT_METHOD.VNPAY:
        return constants.payment.VNPAY;
      case constants.PAYMENT_METHOD.CASH:
        return constants.booking.payment_csyt; // thanh toán tại CSYT
      case constants.PAYMENT_METHOD.MOMO:
        return constants.payment.MOMO;
      case constants.PAYMENT_METHOD.ATM:
        return constants.payment.ATM;
      case constants.PAYMENT_METHOD.VISA:
        return constants.payment.VISA;
      case constants.PAYMENT_METHOD.BANK_TRANSFER:
        return constants.payment.direct_transfer;
      // case constants.PAYMENT_METHOD.VNPAY:
      //     return constants.booking.status.payment_payoo2; // payoo cửa hàng tiện ích
      // case constants.PAYMENT_METHOD.VNPAY:
      //     return constants.booking.status.payment_payoo3 // payoo trả góp 0%
    }
    return '';
  }
  pricePromotion = item => {
    let value = 0;
    if (item?.promotionValue) {
      if (item?.promotionType == 'PERCENT') {
        value = item.price - (item.price * (item.promotionValue / 100) || 0);
      } else {
        value = item?.price - item?.promotionValue || 0;
      }
    } else {
      value = item?.price;
    }

    if (value < 0) {
      return 0;
    }
    return value;
  };
  getPriceSecive = (service, voucher) => {
    let priceVoucher = voucher && voucher.price ? voucher.price : 0;
    let priceFinal = service.reduce((start, item) => {
      return start + this.pricePromotion(item);
    }, 0);
    if (priceVoucher > priceFinal) {
      return 0;
    }
    return (priceFinal - priceVoucher).formatPrice();
  };
  goHome = () => {
    this.props.navigation.pop();
  };
  onBackdropPress = () => this.setState({ isVisible: false });
  onPressCode = transactionCode => {
    Clipboard.setString(transactionCode);
    snackbar.show('Đã sao chép', 'success');
  };
  renderVnPayDate(vnPayDate) {
    let year = vnPayDate.substring(0, 4);
    let month = vnPayDate.substring(4, 6);
    let day = vnPayDate.substring(6, 8);
    let hours = vnPayDate.substring(8, 10);
    let minutes = vnPayDate.substring(10, 12);
    let secons = vnPayDate.substring(12, 14);
    return `${day}/${month}/${year} ${hours}:${minutes}:${secons}`;
  }
  onCallHotline = () => {
    Linking.openURL('tel:1900299983');
  };
  onCopyNumber = () => {
    Clipboard.setString(constants.booking.guide.number);
    snackbar.show(constants.booking.copy_success, 'success');
  };
  onCopyContents = codeBooking => () => {
    Clipboard.setString('DK ' + codeBooking);
    snackbar.show(constants.booking.copy_success, 'success');
  };
  render() {
    let booking = this.props.navigation.state.params.booking;
    console.log('booking: ', booking);
    let service = booking.invoice.services || [];
    let voucher = this.props.navigation.state.params.voucher || {};
    let paymentMethod = booking.invoice.payment;
    // if (!booking || !booking.patient || !booking.hospital) {
    //     this.props.navigation.pop();
    //     return null;
    // }
    let bookingTime = new Date(booking.date);
    return (
      <ActivityPanel
        hideBackButton={true}
        title={constants.title.create_booking_success}
        titleStyle={styles.txtTitle}
        containerStyle={styles.container2}
        actionbarStyle={styles.container2}>
        <View style={styles.container}>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
            {/* <ScaleImage style={styles.image1} height={80} source={require("@images/new/booking/ic_rating.png")} />
                        <Text style={styles.text1}>{constants.booking.booking_success}</Text> */}
            <View style={styles.view2}>
              <View style={styles.col}>
                <Text style={styles.col1}>{constants.booking.code}</Text>
                <TouchableOpacity
                  onPress={this.onQrClick}
                  style={styles.buttonQRCode}>
                  <QRCode
                    value={booking.reference || ''}
                    logo={require('@images/new/logo.png')}
                    logoSize={20}
                    size={100}
                    logoBackgroundColor="transparent"
                  />
                </TouchableOpacity>
                <Text style={styles.txtCodeBooking}>
                  {constants.booking.code_booking} {booking.reference}
                </Text>
              </View>
            </View>
            <View style={styles.containerBody}>
              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.CSYT}:</Text>
                <Text style={styles.text}>{booking.hospital.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.address}:</Text>
                <Text style={styles.text}>{booking.hospital.address}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>
                  {constants.booking.address_signup}:
                </Text>
                <Text style={styles.text}>{booking.hospital.checkInPlace}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.hotline}:</Text>
                <Text onPress={this.onCallHotline} style={styles.text}>
                  {constants.booking.hotline_number}
                </Text>
              </View>
              {/* Ho ten <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.name}</Text>
                                <Text style={styles.text}>{(booking.profile.medicalRecords.name || "").toUpperCase()}</Text>
                            </View> */}

              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.time}</Text>
                <Text style={styles.text}>
                  {booking.time + ' - ' + bookingTime.format('thu, dd/MM/yyyy')}
                </Text>
              </View>
              {service && service.length ? (
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {constants.booking.services}:
                  </Text>
                  <View style={styles.containerPrice}>
                    {service.map((item, index) => {
                      return (
                        <View key={index} style={styles.flex}>
                          <Text
                            numberOfLines={1}
                            style={[styles.text, styles.flex]}>
                            {item.serviceName}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignSelf: 'flex-end',
                              paddingBottom: 5,
                            }}>
                            {item.promotionValue ? (
                              <Text
                                style={[
                                  styles.text,
                                  {
                                    textDecorationLine: 'line-through',
                                    color: '#00000060',
                                    flex: 0,
                                  },
                                ]}>
                                ({parseInt(item.price).formatPrice()}đ)
                              </Text>
                            ) : null}
                            <Text style={[styles.text, { flex: 0 }]}>
                              ({this.pricePromotion(item).formatPrice()}đ)
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                    {voucher && voucher.price ? (
                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          style={[styles.text, styles.flex]}>
                          {constants.booking.voucher}
                        </Text>
                        <Text style={[styles.text, { marginBottom: 5 }]}>
                          (-{parseInt(voucher.price).formatPrice()}đ)
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
              <View style={styles.row}>
                <Text style={styles.label}>
                  {constants.booking.payment_method}
                </Text>
                <Text style={styles.text}>
                  {this.getPaymentMethod(booking)}
                </Text>
              </View>
              {service && service.length ? (
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {constants.booking.sum_price}:
                  </Text>
                  <Text style={[styles.text, { color: '#d0021b' }]}>
                    {this.getPriceSecive(service, voucher)}đ
                  </Text>
                </View>
              ) : null}
            </View>
            {booking.hospital.accountNo &&
              paymentMethod == constants.PAYMENT_METHOD.BANK_TRANSFER ? (
                <View style={styles.paymentInfo}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.txStep1}>
                      {constants.booking.guide.part_1}
                    </Text>
                    <View>
                      <View style={styles.viewBank}>
                        <View style={styles.viewInfoBank}>
                          <Text style={styles.txBank}>
                            {constants.booking.guide.bank}:
                        </Text>
                          <Text style={styles.txBankName}>
                            {booking.hospital.bank}
                          </Text>
                        </View>
                        <Text style={[styles.txBank, { marginTop: 5 }]}>
                          {constants.booking.guide.account_number}
                        </Text>
                      </View>
                      <View style={styles.bankInfo}>
                        <View style={styles.viewBankNumber}>
                          <Text style={styles.txNumber}>
                            {booking.hospital.accountNo}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            this.onCopyNumber(booking.hospital.accountNo)
                          }
                          style={styles.btnCopy}>
                          <Text style={styles.txCopy}>
                            {constants.booking.guide.copy}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <View style={styles.viewInfoBank}>
                          <Text style={styles.txBank}>
                            {constants.booking.guide.owner_name}:
                        </Text>
                          <Text style={styles.txBankName}>
                            {booking.hospital.owner}
                          </Text>
                        </View>
                        <View style={styles.viewInfoBank}>
                          <Text style={styles.txBank}>
                            {constants.booking.guide.branch}:
                        </Text>
                          <Text style={styles.txBankName}>
                            {booking.hospital.branch}
                          </Text>
                        </View>
                        <View style={{ marginTop: 5 }}>
                          <Text style={styles.txBank}>
                            {constants.booking.guide.enter_content_payment}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.bankInfo}>
                        <View style={styles.viewBankNumber}>
                          <Text style={styles.txNumber}>
                            {'DK ' + booking.reference}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onCopyContents(booking.reference)}
                          style={styles.btnCopy}>
                          <Text style={styles.txCopy}>
                            {constants.booking.guide.copy}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.txStep1}>
                      {constants.booking.guide.part_2}
                    </Text>
                    <View style={styles.viewBank}>
                      <Text style={styles.contentsPay}>
                        {constants.booking.guide.notifi}
                      </Text>
                      <Text style={styles.notePay}>
                        {constants.booking.guide.notifi2}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
            {/* <View style={styles.view2}>
                        <View style={styles.col}>
                            <Text style={styles.col1}>Mã code:</Text>
                            <TouchableOpacity onPress={this.onQrClick} style={{ alignItems: 'center', marginTop: 10 }}>
                                <QRCode
                                    style={{ alignSelf: 'center', backgroundColor: '#000' }}
                                    value={booking.book.codeBooking}
                                    size={100}
                                    fgColor='white' />
                            </TouchableOpacity>
                            <Text style={{textAlign:'center',color:'#4a4a4a',marginVertical:5}}>Mã đặt khám: {booking.book.codeBooking}</Text>

                        </View>
                    </View> */}
            <View style={styles.view1}>
              <Text style={styles.text2}>{constants.booking.booking_send}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btntext} onPress={this.goHome}>
              {constants.booking.go_home}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={this.onBackdropPress}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.modal}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}>
          <QRCode
            value={booking.reference || ''}
            logo={require('@images/new/logo.png')}
            logoSize={40}
            size={250}
            logoBackgroundColor="transparent"
          />
        </Modal>
      </ActivityPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
const styles = StyleSheet.create({
  paymentInfo: {
    padding: 10,
    justifyContent: 'center',
  },
  txStep1: {
    color: '#000',
    fontSize: 14,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  txBank: {
    color: '#000',
    fontSize: 14,
    marginRight: 5,
  },
  txBankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#02c39a',
    // marginLeft: 5,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  viewBankNumber: {
    height: 41,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  btnCopy: {
    height: 41,
    paddingHorizontal: 10,
    backgroundColor: '#02c39a',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: '40%',
  },
  txNumber: {
    color: '#02c39a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  txCopy: {
    fontSize: 14,
    color: '#fff',
  },
  contentsPay: {
    color: 'red',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
  },
  viewInfoBank: { flexDirection: 'row', marginTop: 5 },
  notePay: { marginTop: 5, fontSize: 14, color: '#000', textAlign: 'left' },
  viewBank: { justifyContent: 'center' },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPrice: {
    flex: 1,
    marginLeft: 10,
  },
  containerBody: {
    backgroundColor: '#effbf9',
    padding: 20,
    marginTop: 20,
  },
  txtCodeBooking: {
    textAlign: 'center',
    color: '#4a4a4a',
    marginVertical: 5,
  },
  buttonQRCode: {
    alignItems: 'center',
    marginTop: 10,
  },
  flex: { flex: 1 },
  container2: {
    backgroundColor: '#02C39A',
  },
  txtTitle: {
    color: '#FFF',
    marginRight: 31,
  },
  AcPanel: {
    flex: 1,
    backgroundColor: '#cacaca',
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#fff',
  },
  thanhngang: {
    textAlign: 'center',
    marginTop: 10,
  },
  image1: {
    alignSelf: 'center',
    marginTop: 30,
  },
  text1: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#02c39a',
    marginTop: 15,
  },
  text2: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#4a4a4a90',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    opacity: 0.8,
    fontSize: 13,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
  },
  text: {
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 10,
    flex: 1,
  },
  view1: {
    marginTop: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  view2: {},
  col1: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
  },
  image2: {
    alignSelf: 'center',
  },
  col: {
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 15,
  },
  btn: {
    borderRadius: 6,
    backgroundColor: '#02c39a',
    shadowColor: 'rgba(0, 0, 0, 0.21)',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    marginTop: 30,
    marginLeft: 50,
    marginRight: 50,
    marginVertical: 20,
  },
  btntext: {
    color: '#ffffff',
    textAlign: 'center',
    padding: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },
  view3: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
  diachi: {
    textAlign: 'center',
    letterSpacing: 0,
    color: '#000000',
    opacity: 0.7,
  },
  time: {
    textAlign: 'center',
    letterSpacing: 0,
    color: '#000000',
    opacity: 0.7,
    padding: 5,
  },
  sokham: {
    textAlign: 'center',
    letterSpacing: 0,
    color: '#000000',
    opacity: 0.7,
  },
  time1: {
    color: '#6a0136',
    fontWeight: 'bold',
  },
});
export default connect(mapStateToProps)(CreateBookingSuccessScreen);
