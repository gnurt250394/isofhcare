import React, {Component, PropTypes} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import ScaleImage from 'mainam-react-native-scaleimage';
import bookingProvider from '@data-access/booking-provider';
import walletProvider from '@data-access/wallet-provider';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import payoo from 'mainam-react-native-payoo';
import {NativeModules} from 'react-native';
import constants from '@resources/strings';
import voucherProvider from '@data-access/voucher-provider';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
import ButtonPayment from '@components/booking/ButtonPayment';
import ButtonSelectPaymentMethod from '@components/booking/ButtonSelectPaymentMethod';
import ModalUpdateProfile from './ModalUpdateProfile';

var PayooModule = NativeModules.PayooModule;

class ConfirmBookingScreen extends Component {
  constructor(props) {
    super(props);
    let booking = this.props.navigation.state.params.booking;
    let paymentMethod = this.props.navigation.state.params.paymentMethod;
    let disabled = this.props.navigation.state.params.disabled;
    let voucher = this.props.navigation.state.params.voucher;
    let profile = this.props.navigation.state.params.profile;
    if (voucher) {
      voucher.price = voucher.discount;
    }
    if (!booking) {
      snackbar.show(constants.booking.booking_not_found, 'danger');
      this.props.navigation.pop();
    }
    this.state = {
      paymentMethod:
        paymentMethod != constants.PAYMENT_METHOD.NONE &&
        typeof paymentMethod != 'undefined'
          ? paymentMethod
          : constants.PAYMENT_METHOD.CASH,
      booking,
      voucher: voucher || {},
      disabled,
      isVisibleModal: false,
      profile,
    };
  }
  componentDidMount() {
    // AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    if (nextAppState == 'inactive' || nextAppState == 'background') {
    } else {
      this.setState({isLoading: true}, () => {
        bookingProvider.detail(this.state.booking.id).then(s => {
          this.setState({isLoading: false}, () => {
            if (s.code == 0 && s.data && s.data.booking) {
              if (s.code == 0 && s.data && s.data.booking) {
                switch (s.data.booking.status) {
                  case 3: //đã thanh toán
                    let booking = this.state.booking;
                    booking.hospital = this.state.hospital;
                    booking.profile = this.state.profile;
                    booking.payment = this.state.paymentMethod;
                    this.props.navigation.navigate('homeTab', {
                      navigate: {
                        screen: 'createBookingSuccess',
                        params: {
                          booking,
                          service: this.state.service,
                          voucher: this.state.voucher,
                        },
                      },
                    });
                    break;
                }
              }
            }
          });
        });
      });
    }
  };

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
  confirmPayment(booking, bookingId, paymentMethod) {
    booking.hospital = this.state.hospital;
    booking.profile = this.state.profile;
    booking.payment = this.state.paymentMethod;

    this.setState({isLoading: true}, async () => {
      if (this.state.voucher && this.state.voucher.code) {
        let dataVoucher = await this.confirmVoucher(
          this.state.voucher,
          bookingId,
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

      bookingProvider
        .confirmPayment(bookingId, paymentMethod)
        .then(s => {
          this.setState({isLoading: false}, () => {
            switch (s.code) {
              case 0:
                if (paymentMethod) {
                  this.props.navigation.navigate('homeTab', {
                    navigate: {
                      screen: 'createBookingWithPayment',
                      params: {
                        booking,
                        service: this.state.service,
                        voucher: this.state.voucher,
                      },
                    },
                  });
                } else {
                  this.props.navigation.navigate('homeTab', {
                    navigate: {
                      screen: 'createBookingSuccess',
                      params: {
                        booking,
                        service: this.state.service,
                        voucher: this.state.voucher,
                      },
                    },
                  });
                }
                break;
              case 5:
                snackbar.show(constants.msg.booking.booking_expired, 'danger');
            }
          });
        })
        .catch(e => {
          this.setState({isLoading: false}, () => {
            snackbar.show(constants.msg.booking.booking_err2, 'danger');
          });
        });
    });
  }

  getPaymentMethod() {
    let {paymentMethod} = this.state;
    // switch (paymentMethod) {
    //     case constants.PAYMENT_METHOD.VNPAY:
    //         return "VNPAY";
    //     case constants.PAYMENT_METHOD.CASH:
    //         return "CASH";
    //     case constants.PAYMENT_METHOD.MOMO:
    //         return "MOMO"
    //     // case constants.PAYMENT_METHOD.VNPAY:
    //     // // return "PAYOO";
    //     // case constants.PAYMENT_METHOD.VNPAY:
    //     //     return "PAYOO";
    //     case constants.PAYMENT_METHOD.BANK_TRANSFER:
    //         return "BANK_TRANSFER";
    // }
    return constants.PAYMENT_METHOD[paymentMethod];
  }
  getPaymentReturnUrl() {
    switch (this.state.paymentMethod) {
      case constants.PAYMENT_METHOD.VNPAY:
        return constants.key.payment_return_url.vnpay;
      // return "http://localhost:8888/order/vnpay_return";
      // case constants.PAYMENT_METHOD.VNPAY:
      //     return "";
      // case constants.PAYMENT_METHOD.VNPAY:
      // case constants.PAYMENT_METHOD.VNPAY:
      // case constants.PAYMENT_METHOD.VNPAY:
      //     return constants.key.payment_return_url.payoo;
    }
  }
  getPaymentMethodUi() {
    switch (this.state.paymentMethod) {
      case 3:
      case 5:
        return 'SDK';
      default:
        return '';
    }
  }

  getBookingTime = () => {
    try {
      return (
        this.state.bookingDate.format('yyyy-MM-dd') +
        ' ' +
        (this.state.schedule.timeString ||
          (this.state.schedule.time || new Date()).format('HH:mm:ss'))
      );
    } catch (error) {}
    return '';
  };

  getPaymentLink(booking) {
    booking.hospital = this.state.hospital;
    booking.profile = this.state.profile;
    booking.payment = this.state.paymentMethod;
    let price = 0;
    let serviceText = '';
    if (this.state.service && this.state.service.length) {
      price = this.state.service.reduce((total, item) => {
        return total + parseInt(item && item.price ? item.price : 0);
      }, 0);
      serviceText = this.state.service
        .map(item => (item ? item.id + ' - ' + item.name : ''))
        .join(', ');
    }

    this.setState({isLoading: true}, async () => {
      // let memo = `THANH TOÁN ${this.getPaymentMethod()} - Đặt khám - ${booking.book.codeBooking} - ${serviceText} - ${this.state.hospital.hospital.name} - ${this.getBookingTime()} - ${this.state.profile.medicalRecords.name}`;
      let memo = `Thanh toan ${price.formatPrice()} vnd cho dịch vụ dat kham tren ung dung iSofHcare thong qua ${this.getPaymentMethod()}`;
      let voucher = null;
      if (this.state.voucher && this.state.voucher.code) {
        voucher = {
          code: this.state.voucher.code,
          amount: this.state.voucher.price,
        };
        let dataVoucher = await this.confirmVoucher(
          this.state.voucher,
          booking.book.id,
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

      walletProvider
        .createOnlinePayment(
          this.props.userApp.currentUser.id,
          this.getPaymentMethod(),
          this.state.hospital.id,
          booking.book.id,
          this.getPaymentReturnUrl(),
          price,
          memo,
          booking.book.hash,
          booking.jwtData,
          this.getPaymentMethodUi(),
          booking.book.expireDatePayoo,
          booking.timeInitBooking,
          booking.book.createdDate,
          booking.timeZone,
          voucher,
        )
        .then(s => {
          let data = s.data;
          let paymentId = data.id;
          this.amount = data.amount;
          this.setState({isLoading: false, paymentId}, () => {
            switch (this.state.paymentMethod) {
              case 4:
                booking.online_transactions = data.online_transactions;
                booking.valid_time = data.valid_time;
                this.props.navigation.navigate('homeTab', {
                  navigate: {
                    screen: 'createBookingSuccess',
                    params: {
                      booking,
                      service: this.state.service,
                      voucher: this.state.voucher,
                    },
                  },
                });
                break;
              case 3:
              case 5:
                let vnp_TxnRef = data.online_transactions[0].id;
                let payment_order = s.payment_order;
                payment_order.orderInfo = payment_order.data;
                payment_order.cashAmount = this.state.service.reduce(
                  (total, item) => {
                    return total + parseInt(item.price);
                  },
                  0,
                );
                this.payment(payment_order, vnp_TxnRef, booking, data);

                break;
              case 1:
                this.props.navigation.navigate('paymentVNPay', {
                  urlPayment: s.payment_url,
                  onSuccess: url => {
                    this.vnPaySuccess(url, booking, data);
                  },
                  onError: url => {
                    this.vnPayError(url, booking);
                  },
                });
                break;
            }
          });
        })
        .catch(e => {
          this.setState({isLoading: false}, () => {
            if (e && e.response && e.response.data) {
              let response = e.response.data;
              let message = '';
              switch (response.type) {
                case 'ValidationError':
                  message = response.message;
                  for (let key in message) {
                    switch (key) {
                      case 'id':
                        snackbar.show(
                          constants.booking.payment_not_permission,
                          'danger',
                        );
                        return;
                      case 'order_ref_id':
                        this.retry(this.state.paymentId);
                        return;
                      case 'vendor_id':
                        snackbar.show(
                          constants.booking.vendor_not_found,
                          'danger',
                        );
                        return;
                    }
                  }
                  break;
                case 'BadRequestError':
                  message = response.message;
                  if (message == 'order_existed') {
                    this.retry(this.state.paymentId);
                    return;
                  } else {
                    if (message) {
                      snackbar.show(message, 'danger');
                      return;
                    }
                  }
              }
            }
            snackbar.show(constants.booking.create_payment_fail, 'danger');
            // this.props.navigation.navigate("paymentBookingError", { booking })
          });
        });
    });
  }
  vnPayError(url, booking) {
    this.props.navigation.navigate('paymentBookingError', {
      booking,
      service: this.state.service,
      voucher: this.state.voucher,
    });
  }
  vnPaySuccess(url, booking, data) {
    let obj = {};
    let arr = url.split('?');
    if (arr.length == 2) {
      arr = arr[1].split('&');
      arr.forEach(item => {
        let arr2 = item.split('=');
        if (arr2.length == 2) {
          obj[arr2[0]] = arr2[1];
        }
      });
    }
    booking.transactionCode = obj['vnp_TxnRef'];
    let transactionId = data.id;
    if (data.online_transactions && data.online_transactions.length)
      transactionId = data.online_transactions[0].id;

    booking.vnPayDate = obj['vnp_PayDate'];
    if (transactionId != booking.transactionCode) {
      booking.reasonError = 'Đơn hàng không tồn tại';
      this.props.navigation.navigate('paymentBookingError', {
        booking,
        service: this.state.service,
        voucher: this.state.voucher,
      });
      return;
    }
    if (obj['vnp_Amount']) {
      obj['vnp_Amount'] = (obj['vnp_Amount'] || 0) / 100;
    }
    if (data.amount || this.amount) {
      let voucher = (this.state.voucher || {}).price || 0;
      let amount = (this.amount || data.amount) - voucher;
      if (obj['vnp_Amount'] != amount) {
        booking.amountError = obj['vnp_Amount'];
        booking.reasonError = 'Số tiền không hợp lệ';
        this.props.navigation.navigate('paymentBookingError', {
          booking,
          service: this.state.service,
          voucher: this.state.voucher,
        });
        return;
      }
    }
    // walletProvider.onlineTransactionPaid(obj["vnp_TxnRef"], this.getPaymentMethod(), obj);
    if (
      transactionId != booking.transactionCode ||
      obj['vnp_TransactionNo'] == 0 ||
      obj['vnp_ResponseCode'] == 24
    ) {
      this.props.navigation.navigate('paymentBookingError', {
        booking,
        service: this.state.service,
        voucher: this.state.voucher,
      });
    } else {
      this.props.navigation.navigate('homeTab', {
        navigate: {
          screen: 'createBookingSuccess',
          params: {
            booking,
            service: this.state.service,
            voucher: this.state.voucher,
          },
        },
      });
    }
  }
  onSuccess = url => {
    console.log('url: ', url);
    snackbar.show('Đặt khám thành công', 'success');
    this.props.navigation.navigate('homeTab', {
      navigate: {
        screen: 'createBookingSuccess',
        params: {
          booking: this.state.booking,
          voucher: this.state.voucher,
        },
      },
    });
  };
  createBooking = ({phonenumber, momoToken, cardNumber}) => {
    const {booking, disabled, paymentMethod} = this.state;
    console.log('booking: ', booking);

    connectionUtils
      .isConnected()
      .then(s => {
        this.setState({isLoading: true}, async () => {
          console.log('this.state.voucher: ', this.state.voucher);
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
              this.state.booking.id,
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
                switch (paymentMethod) {
                  case constants.PAYMENT_METHOD.ATM:
                  case constants.PAYMENT_METHOD.VISA:
                  case constants.PAYMENT_METHOD.QR:
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
                    break;
                  default:
                    snackbar.show('Đặt khám thành công', 'success');
                    this.props.navigation.navigate('homeTab', {
                      navigate: {
                        screen: 'createBookingSuccess',
                        params: {
                          booking: res,
                          voucher: this.state.voucher,
                        },
                      },
                    });
                    break;
                }
              } else {
                snackbar.show(constants.msg.booking.booking_err2, 'danger');
              }
            })
            .catch(err => {
              snackbar.show(constants.msg.booking.booking_err2, 'danger');
              this.setState({isLoading: false});
            });
        });
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  };
  componentWillReceiveProps = props => {
    if (props && props.navigation && props.navigation.getParam('voucher')) {
      this.setState({
        voucher: props.navigation.getParam('voucher'),
      });
    }
  };
  getVoucher = voucher => {
    this.setState({voucher: voucher});
  };
  goToMyVoucher = () => {
    this.props.navigation.navigate('myVoucher', {
      onSelected: this.getVoucher,
      booking: this.state.booking,
      voucher: this.state.voucher,
    });
  };
  addVoucher = () => {
    return (
      <TouchableOpacity
        style={styles.btnGoToVoucher}
        disabled={this.state.disabled}
        onPress={this.goToMyVoucher}>
        <Text numberOfLines={1} style={styles.txtButtonVoucher}>
          {this.state.voucher && this.state.voucher.price
            ? `GIẢM ${this.state.voucher.price.formatPrice()} KHI ĐẶT KHÁM`
            : constants.booking.add_voucher}
        </Text>
        <ScaleImage
          width={10}
          source={require('@images/new/booking/ic_next.png')}
        />
      </TouchableOpacity>
    );
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
  getPriceSecive = () => {
    let priceVoucher =
      this.state.voucher && this.state.voucher.price
        ? this.state.voucher.price
        : 0;
    let priceFinal = this.state.booking.invoice.services.reduce(
      (start, item) => {
        return start + this.pricePromotion(item);
      },
      0,
    );
    if (priceFinal < priceVoucher) {
      return 0;
    }
    return priceFinal - priceVoucher;
  };
  selectPaymentmethod = paymentMethod => () => {
    this.setState({paymentMethod});
  };
  onBackdropPress = () => this.setState({isVisibleModal: false});
  onUpdateProfile = () => {
    this.props.navigation.navigate('editProfile', {
      item: this.state.profile,
      isBooking: true,
    });
    this.setState({isVisibleModal: false});
  };
  render() {
    const {booking, disabled, isVisibleModal} = this.state;
    return (
      <ActivityPanel
        style={styles.AcPanel}
        title={constants.title.verification_booking}
        isLoading={this.state.isLoading}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.container}>
          <View style={styles.containerHeader}>
            <Text style={styles.txtHeader}>
              {'HỒ SƠ: ' + booking.patient.name.toUpperCase()}
            </Text>
            {booking.patient.phone ? (
              <Text style={styles.colorGray}>SĐT: {booking.patient.phone}</Text>
            ) : (
              <View />
            )}
          </View>
          {!disabled ? this.addVoucher() : null}
          <View style={styles.viewDetails}>
            {this.state.serviceType && (
              <View style={styles.containerServiceType}>
                <Text style={styles.txtservicesType}>
                  {(this.state.serviceType.name || '').toUpperCase()}
                </Text>
                <ScaleImage
                  width={20}
                  source={require('@images/new/booking/ic_tick.png')}
                />
              </View>
            )}
            <View style={styles.view11}>
              <View style={[styles.view2]}>
                <ScaleImage
                  style={styles.ic_Location}
                  width={20}
                  source={require('@images/new/hospital/ic_place.png')}
                />
                <View>
                  <Text style={[styles.text5, styles.fontBold]}>
                    {this.state.booking.hospital.name}
                  </Text>
                  <Text style={[styles.text5, styles.margin10]}>
                    {constants.booking.address}:{' '}
                    <Text>{this.state.booking.hospital.address}</Text>
                  </Text>
                </View>
              </View>
              {/* <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/booking/ic_doctor.png")} />
                                <Text style={[styles.text5]}>Bác sĩ khám: <Text>{this.state.schedule.doctor.name}</Text></Text>
                            </View> */}

              <View style={[styles.view2]}>
                <ScaleImage
                  style={styles.ic_Location}
                  width={20}
                  source={require('@images/new/booking/ic_bookingDate2.png')}
                />
                <View>
                  <Text style={[styles.text5, {}]}>
                    {constants.booking.time}
                  </Text>
                  <Text style={[styles.text5, styles.marginTop10]}>
                    <Text style={styles.txtDateTime}>
                      {this.state.booking.time} -{' '}
                    </Text>{' '}
                    {new Date(this.state.booking.date).format(
                      'thu ,dd/MM/yyyy',
                    )}{' '}
                  </Text>
                </View>
              </View>

              {this.state.booking.description &&
              this.state.booking.description.trim() ? (
                <View style={[styles.view2]}>
                  <ScaleImage
                    style={[styles.ic_Location, {marginRight: 22}]}
                    width={17}
                    source={require('@images/new/booking/ic_note.png')}
                  />
                  <View>
                    <Text style={styles.text5}>
                      {constants.booking.symptom}:
                    </Text>
                    <Text style={[styles.text5, styles.fontBold]}>
                      {this.state.booking.description}
                    </Text>
                  </View>
                </View>
              ) : null}
              {this.state.booking.invoice &&
              this.state.booking.invoice.services.length ? (
                <View style={[styles.view2]}>
                  <ScaleImage
                    style={[styles.ic_Location]}
                    width={20}
                    source={require('@images/new/booking/ic_coin.png')}
                  />
                  <View>
                    <Text style={styles.text5}>
                      {constants.booking.services}:{' '}
                    </Text>
                    {this.state.booking.invoice.services.map((item, index) => (
                      <View key={index} style={styles.containerListServices}>
                        <Text style={styles.txtListServices} numberOfLines={1}>
                          {index + 1}. {item.serviceName}
                        </Text>
                        {item.promotionValue ? (
                          <Text
                            style={[
                              styles.txtPrice,
                              {
                                textDecorationLine: 'line-through',
                                paddingRight: 10,
                                color: '#00000050',
                              },
                            ]}>
                            {parseInt(item.price).formatPrice()}đ
                          </Text>
                        ) : null}
                        <Text style={styles.txtPrice}>
                          {this.pricePromotion(item).formatPrice()}đ
                        </Text>
                      </View>
                    ))}
                    {this.state.voucher && this.state.voucher.price ? (
                      <View style={styles.containerListServices}>
                        <Text style={styles.txtListServices} numberOfLines={1}>
                          {' '}
                          {'Ưu đãi'}
                        </Text>
                        <Text style={styles.txtPrice}>
                          (-{parseInt(this.state.voucher.price).formatPrice()}đ)
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
              {this.state.booking.invoice &&
              this.state.booking.invoice.services.length ? (
                <View style={[styles.view2]}>
                  <ScaleImage
                    style={[styles.ic_Location]}
                    width={20}
                    source={require('@images/new/booking/ic_coin.png')}
                  />
                  <View style={styles.row}>
                    <Text style={[styles.text5]}>
                      {constants.booking.sum_price}:{' '}
                      <Text style={styles.txtPriceService} numberOfLines={1}>
                        {this.getPriceSecive().formatPrice()}đ
                      </Text>
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.containerTypePayment}>
            <Text style={styles.txtTypePayment}>
              {constants.booking.type_payment}
            </Text>
            <ScaleImage
              width={20}
              source={require('@images/new/booking/ic_tick.png')}
            />
          </View>
          {/* <View style={styles.ckeck}> */}
          {/* <ScaleImage style={styles.ckecked} height={20} source={require("@images/new/ic_ckecked.png")} /> */}
          {/* <Text style={styles.ckeckthanhtoan}>Ví ISOFHCARE</Text> */}
          {/* </View> */}
          {/* <View>
                        <Text style={styles.sodu}>Số dư hiện tại: 350.000đ</Text>
                    </View> */}
          {
            <React.Fragment>
              {/* <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(6)}>
                                    <View style={styles.containerBtnSelect}>
                                        {this.state.paymentMethod == 6 &&
                                            <View style={styles.isSelected}></View>
                                        }
                                    </View>
                                    <Text style={styles.ckeckthanhtoan}>{constants.payment.direct_transfer}</Text>
                                </TouchableOpacity> */}

              {this.getPriceSecive() == 0 ? null : (
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
              )}
              {this.getPriceSecive() == 0 ? null : (
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
              )}
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
              <ButtonSelectPaymentMethod
                icon={require('@images/new/booking/ic_qr_payment.png')}
                onPress={this.selectPaymentmethod(constants.PAYMENT_METHOD.QR)}
                title={constants.payment.QR}
                isSelected={
                  this.state.paymentMethod == constants.PAYMENT_METHOD.QR
                }
              />
            </React.Fragment>
          }
          <ButtonSelectPaymentMethod
            icon={require('@images/new/booking/ic_cash.png')}
            onPress={this.selectPaymentmethod(constants.PAYMENT_METHOD.CASH)}
            title={constants.payment.pay_later}
            isSelected={
              this.state.paymentMethod == constants.PAYMENT_METHOD.CASH
            }
          />
          <View style={styles.end} />
        </ScrollView>
        <ButtonPayment
          price={this.getPriceSecive()}
          voucher={this.state.voucher}
          onPress={this.createBooking}
          paymentMethod={this.state.paymentMethod}
          allowBooking={this.state.allowBooking}
          title="Thanh toán"
          booking={this.state.booking}
          createBooking={this.createBooking}
        />
        {/* <TouchableOpacity style={styles.btn} onPress={this.createBooking.bind(this)}>
                    <Text style={styles.btntext}>{constants.actionSheet.confirm}</Text>
                </TouchableOpacity> */}
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
  end: {height: 50},
  txtTypePayment: {
    fontWeight: 'bold',
    color: 'rgb(2,195,154)',
    marginRight: 10,
  },
  containerTypePayment: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtPriceService: {
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#d0021b',
  },
  row: {flexDirection: 'row'},
  txtPrice: {color: '#000'},
  containerListServices: {
    flexDirection: 'row',
    marginTop: 5,
  },
  txtListServices: {
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#000',
  },
  txtDateTime: {
    color: 'rgb(106,1,54)',
    fontWeight: 'bold',
  },
  marginTop10: {marginTop: 10},
  margin10: {
    marginTop: 10,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  flexStart: {},
  txtservicesType: {
    fontWeight: 'bold',
    color: 'rgb(2,195,154)',
    marginRight: 10,
  },
  containerServiceType: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorGray: {color: 'gray'},
  txtHeader: {
    fontWeight: 'bold',
    color: '#000',
  },
  containerHeader: {
    paddingHorizontal: 20,
    marginVertical: 20,
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
  txtButtonVoucher: {
    color: 'rgb(2,195,154)',
    fontSize: 15,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  btnGoToVoucher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#effbf9',
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
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ic_Location: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    textAlign: 'center',
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  viewDetails: {
    backgroundColor: '#effbf9',
  },
  view2: {
    flexDirection: 'row',
    marginTop: 13,
    alignItems: 'center',
    alignItems: 'flex-start',
  },

  text1: {
    opacity: 0.8,

    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: '#000000',
    marginLeft: 20,
    flex: 1,
  },

  text2: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000000',
    marginLeft: 77,
    width: 280,
  },

  text3: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000000',
    marginLeft: 17,
    width: 280,
  },
  text4: {
    color: '#6a0136',
    marginLeft: 77,
  },
  text5: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000000',
    marginLeft: 20,
    width: 280,
  },
  ckecked: {
    marginTop: 10,
    marginLeft: 25,
  },
  ckeck: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    paddingHorizontal: 10,
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
    width: 250,
    marginVertical: 20,
    alignSelf: 'center',
  },
  btntext: {
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
    padding: 15,
    textAlign: 'center',
  },
  view11: {
    paddingVertical: 20,
  },
  thanhtoan: {
    opacity: 0.54,

    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    marginHorizontal: 30,
    marginTop: 17,
  },
  ckeckthanhtoan: {
    flex: 1,
    marginLeft: 10,
  },
  sodu: {
    opacity: 0.72,

    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    marginLeft: 55,
  },
});
export default connect(mapStateToProps)(ConfirmBookingScreen);
