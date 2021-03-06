import React, {Component, PropTypes} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  BackHandler,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import ScaleImage from 'mainam-react-native-scaleimage';
import QRCode from 'react-native-qrcode-svg';
import Modal from '@components/modal';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
import voucherProvider from '@data-access/voucher-provider';

import ButtonPayment from '@components/booking/ButtonPayment';
import ButtonSelectPaymentMethod from '@components/booking/ButtonSelectPaymentMethod';
import objectUtils from '@utils/object-utils';
import ModalUpdateProfile from '../ModalUpdateProfile';
import firebaseUtils from '@utils/firebase-utils';
import paymentProvider from '@data-access/payment-provider';

class ConfirmBookingDoctorScreen extends Component {
  constructor(props) {
    super(props);
    let detailSchedule = this.props.navigation.getParam('detailSchedule');
    let bookingDate = this.props.navigation.getParam('bookingDate');
    let booking = this.props.navigation.getParam('booking');
    let isOnline = this.props.navigation.getParam('isOnline');
    let paymentMethod = this.props.navigation.getParam('paymentMethod');
    let disabled = this.props.navigation.getParam('disabled');
    let voucher = this.props.navigation.getParam('voucher');
    let profile = this.props.navigation.getParam('profile');
    if (voucher) {
      voucher.price = voucher.discount;
    }
    this.state = {
      isVisible: false,
      isOnline,
      paymentMethod: paymentMethod,
      booking,
      bookingDate,
      detailSchedule,
      voucher: voucher || {},
      disabled,
      isVisibleModal: false,
      profile,
      infoPayment: {},
    };
    this.isChecking = true;
  }

  onQrClick = () => {
    this.setState({
      isVisible: true,
    });
  };

  onCopyNumber = () => {
    Clipboard.setString(constants.booking.guide.number);
    snackbar.show(constants.booking.copy_success, 'success');
  };
  onCopyContents = codeBooking => () => {
    Clipboard.setString('DK ' + codeBooking);
    snackbar.show(constants.booking.copy_success, 'success');
  };
  goHome = () => {
    this.props.navigation.pop();
  };
  getPrice = (service, voucher) => {
    let price = voucher && voucher.price ? voucher.price : 0;
    let promotionPrice = 0;
    promotionPrice = this.pricePromotion(service) - price;
    if (promotionPrice < 0) {
      return 0;
    }
    return promotionPrice;
  };

  getPaymentMethod() {
    let {paymentMethod} = this.state;
    return paymentMethod;
  }
  confirmVoucher = async (voucher, booking) => {
    try {
      let idHospital = booking.hospital.id;

      let data = await voucherProvider.selectVoucher(
        voucher.id,
        booking.id,
        idHospital,
      );
      return data.code == 0;
    } catch (error) {
      return false;
    }
  };
  onSuccess = url => {
    snackbar.show('?????t kh??m th??nh c??ng', 'success');
    this.props.navigation.navigate('homeTab', {
      navigate: {
        screen: 'createBookingDoctorSuccess',
        params: {
          booking: this.state.booking,
          voucher: this.state.voucher,
        },
      },
    });
  };
  createBooking = ({phonenumber, momoToken, cardNumber}) => {
    const {bookingDate, booking, detailSchedule, disabled} = this.state;
    function isNetworkError(err) {
      return !!err.isAxiosError && !err.response;
    }
    this.setState({isLoading: true}, async () => {
      if (this.state.voucher && this.state.voucher.code && !disabled) {
        let dataVoucher = await this.confirmVoucher(
          this.state.voucher,
          booking,
        );

        if (!dataVoucher) {
          this.setState({isLoading: false}, () => {
            snackbar.show(
              constants.voucher.voucher_not_found_or_expired,
              'danger',
            );
          });
          return;
        }
      }
      bookingDoctorProvider
        .confirmBooking(
          booking.id,
          this.getPaymentMethod(),
          this.state.voucher,
          phonenumber,
          momoToken,
          cardNumber,
        )
        .then(res => {
          this.setState({isLoading: false});
          if (res) {
            this.setState({booking: res});
            switch (this.state.paymentMethod) {
              case constants.PAYMENT_METHOD.ATM:
              case constants.PAYMENT_METHOD.VISA:
              case constants.PAYMENT_METHOD.QR:
                if (res?.checkoutUrl) {
                  this.props.navigation.navigate('paymenntAlePay', {
                    urlPayment: res.checkoutUrl,
                    title:
                      constants.PAYMENT_METHOD.ATM == this.state.paymentMethod
                        ? constants.payment.ATM
                        : constants.PAYMENT_METHOD.QR ==
                          this.state.paymentMethod
                        ? constants.payment.QR
                        : constants.payment.VISA,
                    onSuccess: this.onSuccess,
                  });
                } else {
                  snackbar.show('?????t kh??m th??nh c??ng', 'success');
                  this.props.navigation.navigate('homeTab', {
                    navigate: {
                      screen: 'createBookingDoctorSuccess',
                      params: {
                        voucher: this.state.voucher,
                        booking: res,
                      },
                    },
                  });
                }

                break;

              default:
                snackbar.show('?????t kh??m th??nh c??ng', 'success');
                this.props.navigation.navigate('homeTab', {
                  navigate: {
                    screen: 'createBookingDoctorSuccess',
                    params: {
                      voucher: this.state.voucher,
                      booking: res,
                    },
                  },
                });
                break;
            }
          }
        })
        .catch(err => {
          if (isNetworkError(err)) {
            this.createBooking({momoToken, cardNumber, phonenumber});
            return;
          }
          this.setState({isLoading: false});
          if (err?.response?.status == 406) {
            setTimeout(() => {
              this.setState({isVisibleModal: true});
            }, 500);
            return;
          }
          snackbar.show('?????t kh??m th???t b???i', 'danger');
        });
    });
  };

  componentWillReceiveProps = props => {
    if (props && props.navigation && props.navigation.getParam('voucher')) {
      this.setState({voucher: props.navigation.getParam('voucher')});
    }
  };
  getVoucher = voucher => {
    this.setState({voucher: voucher});
  };
  goVoucher = () => {
    this.props.navigation.navigate('myVoucher', {
      onSelected: this.getVoucher,
      booking: this.state.booking,
      voucher: this.state.voucher,
    });
  };
  getListPayment = async () => {
    try {
      let res = await paymentProvider.getListPayment(
        this.state.booking.hospital?.id,
      );
      console.log('res: ', res);
      this.setState({infoPayment: res});
    } catch (error) {
      console.log('error: ', error);
    }
  };
  componentDidMount() {
    this.getListPayment();
    DeviceEventEmitter.addListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
  }

  handleBackButton() {
    return true;
  }
  static navigationOptions = {
    gesturesEnabled: false,
  };
  onBackdropPress = () =>
    this.setState({isVisible: false, isVisibleModal: false});
  renderAcademic = academicDegree => {
    if (academicDegree) {
      switch (academicDegree) {
        case 'BS':
          return 'BS. ';
        case 'ThS':
          return 'Ths. ';
        case 'TS':
          return 'TS. ';
        case 'PGS':
          return 'PGS. ';
        case 'GS':
          return 'GS. ';
        case 'BSCKI':
          return 'BSCKI. ';
        case 'BSCKII':
          return 'BSCKII. ';
        case 'GSTS':
          return 'GS.TS. ';
        case 'PGSTS':
          return 'PGS.TS. ';
        case 'ThsBS':
          return 'ThS.BS. ';
        case 'ThsBSCKII':
          return 'ThS.BSCKII. ';
        case 'TSBS':
          return 'TS.BS. ';
        default:
          return '';
      }
    } else {
      return '';
    }
  };

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
  renderPromotion = service => {
    let text = '';
    if (service.promotionType == 'PERCENT') {
      text = service.promotionValue + '%';
    } else {
      text = service.promotionValue.formatPrice() + '??';
    }
    return text;
  };
  selectPaymentmethod = paymentMethod => () => {
    this.setState({paymentMethod});
  };
  onUpdateProfile = () => {
    this.props.navigation.navigate('editProfile', {
      item: this.state.profile,
      isBooking: true,
    });
    // this.props.navigation.navigate('editProfileUsername', {
    //   dataOld: this.state.profile,
    //   isBooking: true,
    // });
    this.setState({isVisibleModal: false});
  };
  render() {
    const {
      booking,
      bookingDate,
      detailSchedule,
      voucher,
      paymentMethod,
      isOnline,
      disabled,
      isVisibleModal,
      infoPayment,
    } = this.state;
    let service = booking.invoice.services[0] || [];
    let bookingTime = new Date(booking.date);
    return (
      <ActivityPanel
        hideBackButton={disabled ? false : true}
        title={'Ch???n ph????ng th???c thanh to??n'}
        titleStyle={styles.txtTitle}
        transparent={true}
        isLoading={this.state.isLoading}>
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
            <View style={styles.groupBody}>
              <View style={styles.row}>
                <Text style={styles.label}>Ng?????i t???i kh??m:</Text>
                <Text style={styles.text}>{booking.patient.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>B??c s??:</Text>
                <Text style={styles.text}>
                  {objectUtils.renderAcademic(booking.doctor.academicDegree)}
                  {booking.doctor.name}
                </Text>
              </View>
              <View style={styles.between} />
              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.CSYT}:</Text>
                <Text style={styles.text}>{booking.hospital.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.address}:</Text>
                <Text style={styles.txtAddressBooking}>
                  {booking.hospital.address}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>N??i l??m th??? t???c:</Text>
                <Text style={styles.txtAddressBooking}>
                  {booking.hospital.checkInPlace}
                </Text>
              </View>
              <View style={styles.between} />
              {service && service.serviceName ? (
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {constants.booking.services}:
                  </Text>
                  <View style={styles.containerServices}>
                    <View style={styles.flex}>
                      <Text
                        numberOfLines={1}
                        style={[styles.text, styles.flex]}>
                        {service.serviceName}
                      </Text>
                      <Text
                        style={[
                          styles.text,
                          {marginBottom: 5, color: '#BBB', fontStyle: 'italic'},
                        ]}>
                        ({parseInt(service.price).formatPrice()}??){' '}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {service && service.promotionValue ? (
                <View style={styles.row}>
                  <Text style={styles.label}>Khuy???n m???i:</Text>
                  <View style={styles.containerServices}>
                    <View style={styles.flex}>
                      {/* <Text numberOfLines={1} style={[styles.text, styles.flex]}>{service.name}</Text> */}
                      <Text
                        style={[
                          styles.text,
                          {marginBottom: 5, color: '#BBB', fontStyle: 'italic'},
                        ]}>
                        Gi???m {this.renderPromotion(service)}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              <View style={styles.row}>
                <Text style={styles.label}>{constants.booking.time}</Text>
                <Text style={styles.text}>
                  {' '}
                  <Text style={{color: '#00BA99'}}>{booking.time} </Text>
                  {' - ' + bookingTime.format('thu, dd/MM/yyyy')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Tri???u ch???ng:</Text>
                <Text style={styles.txtAddressBooking}>
                  {booking.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              disabled={disabled}
              onPress={this.goVoucher}
              style={styles.btnVoucher}>
              <View style={styles.flex}>
                <Text style={styles.txtLabelVoucher}>M?? ??u ????i</Text>
                {this.state.voucher && this.state.voucher.price ? (
                  <Text
                    style={[
                      {
                        color: '#00CBA7',
                        fontWeight: 'bold',
                      },
                      styles.flex,
                    ]}>{`GI???M ${this.state.voucher.price.formatPrice()}?? KHI ?????T KH??M`}</Text>
                ) : null}
              </View>
              <View style={styles.flexRowCenter}>
                <Text style={styles.txtChange}>Ch???n ho???c nh???p m??</Text>
                <ScaleImage
                  style={styles.imgmdk}
                  height={11}
                  source={require('@images/new/booking/ic_next.png')}
                />
              </View>
            </TouchableOpacity>
            {/** sum Price */}
            <View style={styles.containerPriveVoucher}>
              {this.state.voucher && this.state.voucher.price ? (
                <View style={[styles.containerVoucher, {paddingBottom: 5}]}>
                  <Text style={styles.txtSumPrice} />
                  <Text
                    style={{
                      color: '#000',
                    }}>
                    -{this.state.voucher.price.formatPrice()}??
                  </Text>
                </View>
              ) : null}
              {service && service.price ? (
                <View style={styles.containerVoucher}>
                  <Text style={styles.txtSumPrice}>T???ng ti???n</Text>
                  <Text style={styles.sumPrice}>
                    {this.getPrice(service, voucher).formatPrice()}??
                  </Text>
                </View>
              ) : null}
            </View>
            {/** Payment Method */}
            <View
              style={[styles.containerPriveVoucher, {flexDirection: 'row'}]}>
              <ScaleImage
                width={20}
                source={require('@images/new/booking/ic_price.png')}
              />
              <Text
                style={{
                  paddingLeft: 10,
                }}>
                {constants.booking.type_payment}
              </Text>
            </View>
            {
              <React.Fragment>
                {infoPayment?.paymentAlepay ? (
                  <ButtonSelectPaymentMethod
                    icon={require('@images/new/booking/ic_visa.png')}
                    onPress={this.selectPaymentmethod(
                      constants.PAYMENT_METHOD.VISA,
                    )}
                    title={constants.payment.VISA}
                    isSelected={
                      this.state.paymentMethod == constants.PAYMENT_METHOD.VISA
                    }
                  />
                ) : null}
                {infoPayment?.paymentAlepay ? (
                  <ButtonSelectPaymentMethod
                    icon={require('@images/new/booking/ic_atm.png')}
                    onPress={this.selectPaymentmethod(
                      constants.PAYMENT_METHOD.ATM,
                    )}
                    title={constants.payment.ATM}
                    isSelected={
                      this.state.paymentMethod == constants.PAYMENT_METHOD.ATM
                    }
                  />
                ) : null}
                {infoPayment?.paymentMomo ? (
                  <ButtonSelectPaymentMethod
                    icon={require('@images/new/booking/ic_momo.png')}
                    onPress={this.selectPaymentmethod(
                      constants.PAYMENT_METHOD.MOMO,
                    )}
                    title={constants.payment.MOMO}
                    isSelected={
                      this.state.paymentMethod == constants.PAYMENT_METHOD.MOMO
                    }
                  />
                ) : null}
                {infoPayment?.paymentBankTranfer ? (
                  <ButtonSelectPaymentMethod
                    icon={require('@images/new/booking/ic_banktransfer.png')}
                    onPress={this.selectPaymentmethod(
                      constants.PAYMENT_METHOD.BANK_TRANSFER,
                    )}
                    title={constants.payment.direct_transfer}
                    isSelected={
                      this.state.paymentMethod ==
                      constants.PAYMENT_METHOD.BANK_TRANSFER
                    }
                  />
                ) : null}
                {infoPayment?.paymentAlepay ? (
                  <ButtonSelectPaymentMethod
                    icon={require('@images/new/booking/ic_qr_payment.png')}
                    onPress={this.selectPaymentmethod(
                      constants.PAYMENT_METHOD.QR,
                    )}
                    title={constants.payment.QR}
                    isSelected={
                      this.state.paymentMethod == constants.PAYMENT_METHOD.QR
                    }
                  />
                ) : null}
                {isOnline ? null : infoPayment?.paymentCash ? (
                  <ButtonSelectPaymentMethod
                    icon={require('@images/new/booking/ic_cash.png')}
                    onPress={this.selectPaymentmethod(
                      constants.PAYMENT_METHOD.CASH,
                    )}
                    title={constants.payment.pay_later}
                    isSelected={
                      this.state.paymentMethod == constants.PAYMENT_METHOD.CASH
                    }
                  />
                ) : null}
              </React.Fragment>
            }

            <Text style={styles.txtHelper}>
              N???u s??? ti???n thanh to??n tr?????c cao h??n th???c t???, qu?? kh??ch s??? nh???n
              l???i ti???n th???a t???i CSYT kh??m b???nh
            </Text>
            <ButtonPayment
              booking={booking}
              price={this.getPrice(service, voucher)}
              voucher={voucher}
              paymentMethod={paymentMethod}
              allowBooking={this.state.allowBooking}
              title="Thanh to??n"
              createBooking={this.createBooking}
            />
            <View style={styles.btn} />
          </ScrollView>
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
        <ModalUpdateProfile
          isVisible={isVisibleModal}
          onBackdropPress={this.onBackdropPress}
          onSend={this.onUpdateProfile}
        />
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
  ckeckthanhtoan: {
    opacity: 0.8,
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    flex: 1,
    marginLeft: 10,
  },
  isSelected: {
    backgroundColor: 'rgb(2,195,154)',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  containerBtnSelect: {
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgb(2,195,154)',
  },
  ckeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  flex: {flex: 1},
  txtPaymentMethod: {
    fontSize: 13,
    letterSpacing: 0,
    color: '#000000',
    fontWeight: '600',
  },
  txtTotalPrice: {
    fontSize: 13,
    letterSpacing: 0,
    color: '#000000',
    fontWeight: '600',
  },
  txtAddressBooking: {
    textAlign: 'right',
    flex: 1,
    fontSize: 13,
  },
  between: {
    backgroundColor: '#BBBBBB',
    height: 0.7,
    width: '100%',
    marginTop: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerServices: {
    flex: 1,
    marginLeft: 10,
  },
  groupBody: {
    // backgroundColor: '#effbf9',
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
  backgroundContainer: {
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
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
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
    alignItems: 'center',
    padding: 30,
  },
  button: {
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
  btntext: {
    color: '#3161AD',
    textAlign: 'center',
    padding: 15,
    textDecorationLine: 'underline',
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
  },
  txBankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#02c39a',
    marginLeft: 5,
    marginRight: 10,
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
  viewInfoBank: {flexDirection: 'row', marginTop: 5},
  notePay: {marginTop: 5, fontSize: 14, color: '#000', textAlign: 'left'},
  viewBank: {justifyContent: 'center'},

  containerPriveVoucher: {
    paddingHorizontal: 10,
    backgroundColor: 'rgba(225,225,225,0.3)',
    paddingVertical: 20,
  },
  // txtPaymentMethod: {
  //     fontSize: 15,
  //     fontWeight: "bold",
  //     color: "#000000",
  // },
  buttonPayment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderBottomWidth: 0.7,
    borderTopWidth: 0.7,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  image: {
    marginTop: 4,
    tintColor: '#FC4A5F',
  },
  txtHelper: {
    color: '#b3b3b3',
    textAlign: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
    fontStyle: 'italic',
  },
  sumPrice: {
    color: '#FC4A5F',
    fontWeight: 'bold',
  },
  txtSumPrice: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  containerVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtChange: {
    fontWeight: '700',
    paddingHorizontal: 7,
    backgroundColor: '#fff',
    marginRight: 5,
    paddingVertical: 6,
    borderRadius: 5,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtLabelVoucher: {
    color: '#111',
    fontWeight: 'bold',
  },
  groupService: {
    flex: 1,
    paddingLeft: 7,
  },

  btnVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6fffa',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: '#ccc',
  },
  imgmdk: {
    marginRight: 5,
    alignSelf: 'center',
  },
});
export default connect(mapStateToProps)(ConfirmBookingDoctorScreen);
