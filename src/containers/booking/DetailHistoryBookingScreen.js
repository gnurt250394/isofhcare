import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Clipboard,
  Linking,
  RefreshControl,
} from 'react-native';
import bookingProvider from '@data-access/booking-provider';
import {connect} from 'react-redux';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import QRCode from 'react-native-qrcode-svg';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import clientUtils from '@utils/client-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';
import Modal from '@components/modal';
import stylemodal from '@styles/modal-style';
import constants from '@resources/strings';
import Barcode from 'mainam-react-native-barcode';
import BookingDoctorProvider from '@data-access/booking-doctor-provider';
import CallManager from '@components/community/CallManager';
import objectUtils from '@utils/object-utils';
class DetailHistoryBookingScreen extends Component {
  constructor(props) {
    super(props);
    var id = this.props.navigation.state.params.id;

    this.state = {
      id: id,
      value: 0,
      booking: {},
      isLoading: true,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getData();
    // this.setState({ isLoading: true }, () => {
    //     bookingProvider.detail(this.state.id).then(s => {
    //         if (s.code == 0 && s.data) {
    //             // let address = s.data.hospital.address;
    //             // if (s.data.zone && s.data.zone.name)
    //             //     address += ", " + s.data.zone.name;
    //             // if (s.data.district && s.data.district.name)
    //             //     address += ", " + s.data.district.name;
    //             // if (s.data.province && s.data.province.countryCode )
    //             //     address += ", " + s.data.province.countryCode

    //
    //             this.setState({
    //                 address: s.data.hospital.address,
    //                 booking: s.data.booking || {},
    //                 service: s.data.service || {},
    //                 services: s.data.services || [],
    //                 hospital: s.data.hospital || {},
    //                 medicalRecords: s.data.medicalRecords || {},
    //                 isLoading: false
    //             })
    //         } else {
    //             snackbar.show(constants.msg.booking.cannot_show_details_booking, "danger");
    //             this.props.navigation.pop();
    //             return;
    //         }
    //     }).catch(err => {
    //         snackbar.show(constants.msg.booking.cannot_show_details_booking, "danger");
    //         this.props.navigation.pop();
    //         return;
    //     });
    // });
  }
  getData = () => {
    BookingDoctorProvider.getDetailBooking(this.state.id)
      .then(res => {
        this.setState({isLoading: false, refreshing: false});
        if (res && res.id) {
          this.setState({booking: res});
        }
      })
      .catch(err => {
        this.setState({isLoading: false, refreshing: false});
      });
  };
  renderStatusPayment = () => {
    switch (this.state.booking.invoice.status) {
      case 'NEW':
        return 'Chưa thanh toán';
      case 'PAYING':
        return 'Đang thanh toán';
      case 'PAID':
        return 'Đã thanh toán';
      case 'REFUND':
        return 'Đã hoàn tiền';
      case 'PENDING':
        return '';
      default:
        return '';
    }
  };
  renderStatus = () => {
    switch (this.state.booking.invoice.payment) {
      case 'CASH':
        return (
          <Text style={styles.paymentHospital}>
            {constants.booking.status.payment_CSYT}
          </Text>
        );
      case 'VNPAY':
        return (
          <Text style={styles.paymentHospital}>
            {constants.booking.status.payment_VNPAY}
          </Text>
        );
      case 'PAYOO':
        return (
          <Text style={styles.paymentHospital}>
            {constants.booking.status.payment_payoo}
          </Text>
        );
      case 'BANK_TRANSFER':
        return (
          <Text style={styles.paymentHospital}>Chuyển khoản trực tiếp</Text>
        );
      case 'MOMO':
        return (
          <Text style={styles.paymentHospital}>{constants.payment.MOMO}</Text>
        );
      case 'NONE':
        return <Text style={styles.paymentHospital}>Không xác định</Text>;
      // case 0:
      //     return <Text style={styles.paymentHospital}>{constants.booking.status.not_select_payment}</Text>;
      // case 1:
      //     return <Text style={styles.paymentHospital}>{constants.booking.status.payment_isofh}</Text>;
      // case 2:
      //     return <Text style={styles.paymentHospital}>{constants.booking.status.payment_VNPAY}</Text>;
      // case 3:
      //     return <Text style={styles.paymentHospital}>{constants.booking.status.payment_CSYT}</Text>;
      // case 4:
      //     return <Text style={styles.paymentHospital}>{constants.booking.status.payment_payoo}</Text>;
      // case 5:
      //     return <Text style={styles.paymentHospital}>{constants.booking.status.payment_payoo2}</Text>;
      // case 6:
      //     return <Text style={styles.paymentHospital}>{'Chuyển khoản trực tiếp'}</Text>;
    }
  };
  status = () => {
    switch (this.state.booking.status) {
      case 'NEW':
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Chờ duyệt</Text>
          </View>
        );
      case 'ACCEPTED':
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Đã duyệt</Text>
          </View>
        );
      case 'CHECKIN':
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Đã check-in</Text>
          </View>
        );
      case 'CANCELED':
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Đã hủy</Text>
          </View>
        );
      case 'COMPLETED':
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Hoàn thành khám</Text>
          </View>
        );
      case 'REJECTED':
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Từ chối đặt khám</Text>
          </View>
        );
      default:
        <Text style={styles.txStatus} />;
    }
  };
  showImage = (image, index) => {
    this.props.navigation.navigate('photoViewer', {
      index: index,
      urls: image.map(item => {
        return {uri: item.absoluteUrl()};
      }),
    });
  };
  renderImages() {
    var image = this.state.booking.images;
    if (image && image.length) {
      return (
        <View>
          <View style={styles.containerListImage}>
            {image.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => this.showImage(image, index)}
                  key={index}
                  style={styles.buttonShowImage}>
                  <ScaledImage
                    width={70}
                    height={70}
                    style={styles.ImageViewer}
                    uri={item ? item.absoluteUrl() : ''}
                    resizeMode={'cover'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
  checkAm = () => {
    if (new Date(this.state.booking.date).format('HH') < 12) {
      return <Text>{' Sáng'}</Text>;
    } else {
      return <Text>{' Chiều'}</Text>;
    }
  };
  onQrClick = () => {
    this.setState({
      isVisible: true,
      value: this.state.booking.reference ? this.state.booking.reference : 0,
    });
  };
  onBarCodeClick = () => {
    this.setState({
      isVisibleIdHis: true,
      valueHis: this.state.booking.reference ? this.state.booking.reference : 0,
    });
  };
  getPaymentMethod = paymentMethod => {
    switch (paymentMethod) {
      case 1:
        return 'VNPAY';
      case 2:
        return 'Thanh toán sau tại CSYT';
      case 3:
        return 'PAYOO';
      case 4:
        return 'PAYOO - cửa hàng tiện ích';
      case 5:
        return 'PAYOO - trả góp 0%';
      case 6:
        return 'Chuyển khoản trực tiếp';
      default:
        return '';
    }
  };
  onCopyNumber = accountNo => {
    Clipboard.setString(accountNo);
    snackbar.show(constants.booking.copy_success, 'success');
  };
  onCopyContents = codeBooking => {
    Clipboard.setString('DK ' + codeBooking);
    snackbar.show(constants.booking.copy_success, 'success');
  };
  pricePromotion = item => {
    console.log('item: ', item);
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
  getPrice = () => {
    let voucherPrice = 0;
    if (
      this.state.booking.invoice &&
      this.state.booking.invoice.voucher &&
      this.state.booking.invoice.voucher.discount
    ) {
      voucherPrice = this.state.booking.invoice.voucher.discount;
    }
    let price = this.state.booking.invoice.services.reduce(
      (start, item) => start + this.pricePromotion(item),
      0,
    );
    let total = price - voucherPrice;
    return (total > 0 ? total : 0).formatPrice();
  };
  openLinkHotline = () => {
    Linking.openURL('tel:1900299983');
  };
  onCallVideo = () => {
    CallManager.startCall(this.state.booking, true);
    // this.props.navigation.navigate("videoCall", {
    //     from: this.props.userApp?.currentUser?.id || "",
    //     to: this.state.booking?.doctor?.id || "",
    //     isOutgoingCall: true,
    //     isVideoCall: true,
    //     profile: this.state.booking
    // });
  };
  onBackdropPress = () => this.setState({isVisible: false});
  getTime = time => {
    return parseInt(time.replace(':', ''), 10);
  };
  getTimeOnline = () => {
    if (
      this.state.booking.timeDiff < 0 &&
      this.state.booking.timeDiff > -this.state.booking.blockTime * 60 * 1000
    ) {
      return true;
    } else {
      if (this.state.booking?.doctor?.id == 667925) {
        return true;
      } else {
        return false;
      }
    }
  };
  renderAcademic = academicDegree => {
    switch (academicDegree) {
      case 'BS':
        return 'BS';
      case 'ThS':
        return 'ThS';
      case 'TS':
        return 'TS';
      case 'PGS':
        return 'PGS';
      case 'GS':
        return 'GS';
      case 'BSCKI':
        return 'BSCKI';
      case 'BSCKII':
        return 'BSCKII';
      case 'GSTS':
        return 'GS.TS';
      case 'PGSTS':
        return 'PGS.TS';
      case 'ThsBS':
        return 'ThS.BS';
      case 'ThsBSCKII':
        return 'ThS.BSCKII';
      case 'TSBS':
        return 'TS.BS';
      default:
        return '';
    }
  };
  onRefresh = () => {
    this.setState({refreshing: true}, this.getData);
  };
  onPayment = () => {
    if (this.state.booking.discriminatorType == 'DOCTOR_APPOINTMENT') {
      let isOnline = this.state.booking?.invoice?.services
        ? this.state.booking.invoice.services.find(e => e.isOnline == true)
        : false;
      console.log('this.state.booking: ', this.state.booking);
      this.props.navigation.navigate('confirmBookingDoctor', {
        booking: this.state.booking,
        isOnline,
        paymentMethod: this.state.booking.invoice.payment,
        voucher:
          this.state.booking.invoice.voucher &&
          this.state.booking.invoice.voucher.discount
            ? this.state.booking.invoice.voucher
            : {},
        disabled:
          this.state.booking.invoice.voucher &&
          this.state.booking.invoice.voucher.discount
            ? true
            : false,
      });
    } else {
      this.props.navigation.navigate('confirmBooking', {
        booking: this.state.booking,
        paymentMethod: this.state.booking.invoice.payment,
        voucher:
          this.state.booking.invoice.voucher &&
          this.state.booking.invoice.voucher.discount
            ? this.state.booking.invoice.voucher
            : {},
        disabled:
          this.state.booking.invoice.voucher &&
          this.state.booking.invoice.voucher.discount
            ? true
            : false,
      });
    }
  };
  refreshControl = () => {
    return (
      <RefreshControl
        onRefresh={this.onRefresh}
        refreshing={this.state.refreshing}
      />
    );
  };
  defaultImage = () => (
    <ScaleImage
      resizeMode="cover"
      source={require('@images/new/user.png')}
      width={20}
      height={20}
    />
  );
  render() {
    let isOnline = this.state.booking?.invoice?.services
      ? this.state.booking.invoice.services.find(e => e.isOnline == true)
      : null;
    const avatar =
      this.props.userApp.currentUser && this.props.userApp.currentUser.avatar
        ? {uri: this.props.userApp.currentUser.avatar}
        : require('@images/new/user.png');
    return (
      <ActivityPanel
        isLoading={this.state.isLoading}
        title={constants.booking.details_booking}>
        {(this.state.booking && this.state.booking.patient && (
          <ScrollView
            refreshControl={this.refreshControl()}
            style={{
              backgroundColor: '#e6f7ff30',
            }}>
            <View>
              <View style={styles.viewName}>
                <View style={styles.containerProfileName}>
                  <ImageLoad
                    resizeMode="cover"
                    imageStyle={styles.borderImage}
                    borderRadius={20}
                    customImagePlaceholderDefaultStyle={[
                      styles.avatar,
                      {width: 40, height: 40},
                    ]}
                    placeholderSource={require('@images/new/user.png')}
                    resizeMode="cover"
                    loadingStyle={{size: 'small', color: 'gray'}}
                    source={avatar}
                    style={styles.image}
                    defaultImage={this.defaultImage}
                  />
                  <Text style={styles.txName}>
                    {this.state.booking.patient.name}
                  </Text>
                </View>
                {isOnline ? (
                  this.getTimeOnline() &&
                  (this.state.booking.status == 'ACCEPTED' ||
                    this.state.booking.status == 'CHECKIN') ? (
                    <View
                      style={[
                        styles.flex,
                        {
                          borderLeftColor: '#00000050',
                          borderLeftWidth: 1,
                        },
                      ]}>
                      <TouchableOpacity
                        onPress={this.onCallVideo}
                        style={styles.buttonBookingCall}>
                        <ScaledImage
                          width={20}
                          height={20}
                          source={require('@images/new/videoCall/ic_call.png')}
                        />
                        <Text
                          style={styles.txtBookingCall}>{`Gọi tư vấn`}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.flex,
                        {
                          borderLeftColor: '#00000050',
                          borderLeftWidth: 1,
                        },
                      ]}>
                      <TouchableOpacity
                        disabled={true}
                        onPress={this.onCallVideo}
                        style={[
                          styles.buttonBookingCall,
                          {backgroundColor: '#ffcf99'},
                        ]}>
                        <ScaledImage
                          width={20}
                          height={20}
                          source={require('@images/new/videoCall/ic_call.png')}
                        />
                        <Text
                          style={styles.txtBookingCall}>{`Gọi tư vấn`}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                ) : null}
              </View>
              {/** bác sĩ */}
              {this.state.booking.doctor && this.state.booking.doctor.name ? (
                <View>
                  <View
                    style={[styles.viewLocation, {alignItems: 'flex-start'}]}>
                    <ScaledImage
                      height={20}
                      width={20}
                      source={require('@images/new/booking/ic_serviceType.png')}
                    />
                    <Text numberOfLines={5} style={styles.txLocation}>
                      Bác sĩ
                    </Text>
                    <View style={styles.viewInfoLocation}>
                      <Text style={styles.txClinic}>
                        {objectUtils.renderAcademic(
                          this.state.booking.doctor.academicDegree,
                        )}
                        {this.state.booking.doctor.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.between} />
                </View>
              ) : null}

              {/** dịch vụ */}
              {this.state.booking.invoice.services &&
              this.state.booking.invoice.services.length > 0 ? (
                <View style={[styles.viewService, {alignItems: 'flex-start'}]}>
                  <ScaledImage
                    height={20}
                    width={20}
                    source={require('@images/ic_service.png')}
                  />
                  <Text style={styles.txService}>
                    {constants.booking.services}
                  </Text>
                  <View>
                    {this.state.booking.invoice.services.map((item, index) => {
                      return (
                        <View>
                          <View key={index}>
                            <Text
                              numberOfLines={1}
                              style={[styles.txInfoService, styles.txtBold]}>
                              {item.serviceName}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-end',
                              }}>
                              {item.promotionValue ? (
                                <Text
                                  style={[
                                    styles.txInfoService,
                                    styles.price,
                                    {textDecorationLine: 'line-through'},
                                  ]}>
                                  {item.price.formatPrice()}đ
                                </Text>
                              ) : null}
                              <Text
                                style={[
                                  styles.txInfoService,
                                  styles.price,
                                  {color: '#000'},
                                ]}>
                                {this.pricePromotion(item).formatPrice()}đ
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                    {this.state.booking.invoice.voucher &&
                    this.state.booking.invoice.voucher.discount ? (
                      <View>
                        <Text
                          numberOfLines={1}
                          style={[styles.txInfoService, styles.txtBold]}>
                          Ưu đãi
                        </Text>
                        <Text style={[styles.txInfoService, styles.price]}>
                          (-
                          {this.state.booking.invoice.voucher.discount.formatPrice()}
                          đ)
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
              <View style={styles.between} />

              {/** Địa chỉ khám */}
              <View>
                <View style={[styles.viewLocation, {alignItems: 'flex-start'}]}>
                  <ScaledImage
                    height={20}
                    width={20}
                    source={require('@images/ic_location.png')}
                  />
                  <Text numberOfLines={5} style={styles.txLocation}>
                    {constants.booking.address}
                  </Text>
                  <View style={[styles.viewInfoLocation]}>
                    <Text style={styles.txClinic}>
                      {this.state.booking.hospital &&
                        this.state.booking.hospital.name}
                    </Text>
                    {this.state.booking.hospital.address ? (
                      <Text style={styles.txAddress}>
                        {this.state.booking.hospital.address}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.between} />
                <View style={[styles.viewLocation, {alignItems: 'flex-start'}]}>
                  <Text style={[styles.txLocationCheckin]}>
                    {constants.booking.address_signup}
                  </Text>
                  <View style={[styles.viewInfoLocationCheckin]}>
                    <Text style={styles.txClinic}>
                      {this.state.booking.hospital &&
                        this.state.booking.hospital.checkInPlace}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.between} />

              {/** ngày khám */}
              <View style={styles.viewDate}>
                <ScaledImage
                  height={19}
                  width={19}
                  source={require('@images/ic_date.png')}
                />
                <Text style={styles.txDate}>Ngày khám</Text>
                <View style={styles.viewDateTime}>
                  <Text style={styles.txTime}>
                    {this.state.booking.time}
                    {/* {this.checkAm()} */}
                  </Text>
                  <Text style={styles.txDateInfo}>
                    {'Ngày ' +
                      new Date(this.state.booking.date).format('dd/MM/yyyy')}
                  </Text>
                </View>
              </View>

              {/** triệu chứng */}
              <View style={styles.viewSymptom}>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>{'Triệu chứng'}: </Text>{' '}
                  {this.state.booking.description}
                </Text>
                <View>
                  {this.renderImages()}
                  {/* <ScaledImage
                  width={70}
                  height={70}
                  source={{ uri: this.state.imgNote ? this.state.imgNote.absoluteUrl() :'' }}
                /> */}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={this.openLinkHotline}>
                <ScaledImage
                  source={require('@images/new/account/ic_support.png')}
                  width={20}
                  height={20}
                  style={{tintColor: '#00b392'}}
                />
                <Text style={styles.itemText}>Hỗ trợ</Text>
                <View style={{alignItems: 'flex-end'}}>
                  {/* <Text style={{ fontWeight: 'bold', color: '#00CBA7' }}>1900299983</Text> */}
                  {this.state.booking.hospital.hotLine ? (
                    <Text>{this.state.booking.hospital.hotLine}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              {this.state.booking.invoice.services &&
              this.state.booking.invoice.services.length ? (
                <React.Fragment>
                  <View style={styles.viewPrice}>
                    <ScaledImage
                      source={require('@images/ic_price.png')}
                      width={20}
                      height={20}
                    />
                    <Text style={styles.txLabelPrice}>Tổng tiền dịch vụ</Text>
                    <Text style={styles.txPrice}>{this.getPrice() + 'đ'}</Text>
                  </View>
                  <View style={styles.between} />
                </React.Fragment>
              ) : null}
              <View style={styles.viewPayment}>
                <ScaledImage
                  height={19}
                  width={19}
                  source={require('@images/ic_transfer.png')}
                />
                <Text style={styles.txPayment}>Trạng thái thanh toán</Text>
                <Text>{this.renderStatusPayment()}</Text>
              </View>
              <View style={styles.viewPayment}>
                <View style={{height: 19, width: 19}} />
                <Text style={styles.txPayment}>
                  {constants.booking.payment_methods}
                </Text>
                {this.renderStatus()}
              </View>

              <View style={styles.viewStatus}>
                <ScaledImage
                  height={20}
                  width={20}
                  source={require('@images/ic_status.png')}
                />
                <Text style={styles.txStatusLabel}>
                  {constants.booking.status_booking}
                </Text>
                {this.status()}
              </View>
              {/** barcode */}
              <View style={styles.viewBaCode}>
                <ScaledImage
                  width={20}
                  height={20}
                  source={require('@images/new/booking/ic_barcode.png')}
                />
                <Text style={styles.txLabelBarcode}>
                  {constants.booking.code}
                </Text>
                <TouchableOpacity
                  onPress={this.onQrClick}
                  style={{marginRight: 10, alignItems: 'center'}}>
                  <QRCode
                    value={this.state.booking.reference || 0}
                    logo={require('@images/new/logo.png')}
                    logoSize={20}
                    size={80}
                    logoBackgroundColor="transparent"
                  />
                  <Text>{this.state.booking.reference}</Text>
                </TouchableOpacity>
              </View>
              {this.state.booking.invoice &&
              this.state.booking.invoice.payment == 'BANK_TRANSFER' ? (
                <React.Fragment>
                  <View
                    style={[
                      styles.viewPrice,
                      {borderTopWidth: 0, paddingHorizontal: 7},
                    ]}>
                    <Text style={styles.txLabelPrice}>
                      {constants.booking.guide.bank}:
                    </Text>
                    <Text
                      style={[
                        styles.txPrice,
                        {color: 'red', textAlign: 'right'},
                      ]}>
                      {this.state.booking.hospital.bank}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.viewPrice,
                      {borderTopWidth: 0, paddingHorizontal: 7},
                    ]}>
                    <Text style={styles.txLabelPrice}>
                      {constants.booking.number_bank}
                    </Text>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() =>
                        this.onCopyNumber(this.state.booking.hospital.accountNo)
                      }>
                      <Text style={[styles.txPrice, {color: 'red'}]}>
                        {this.state.booking.hospital.accountNo}
                      </Text>
                      <ScaledImage
                        height={20}
                        style={{tintColor: 'red'}}
                        source={require('@images/new/booking/ic_coppy.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.viewPrice,
                      {borderTopWidth: 0, paddingHorizontal: 7},
                    ]}>
                    <Text style={styles.txLabelPrice}>
                      {constants.booking.guide.branch}
                    </Text>
                    <Text style={[styles.txPrice, {color: 'red'}]}>
                      {this.state.booking.hospital.branch}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.viewPrice,
                      {borderTopWidth: 0, paddingHorizontal: 7},
                    ]}>
                    <Text style={styles.txLabelPrice}>
                      {constants.booking.guide.owner_name}
                    </Text>
                    <Text
                      style={[
                        styles.txPrice,
                        {color: 'red', textAlign: 'right'},
                      ]}>
                      {this.state.booking.hospital.owner}
                    </Text>
                  </View>
                  {(this.state.booking.hospital.accountNo && (
                    <View
                      style={[
                        styles.viewPrice,
                        {borderTopWidth: 0, paddingHorizontal: 7},
                      ]}>
                      <Text style={styles.txLabelPrice}>
                        {constants.booking.syntax_tranfer}
                      </Text>
                      <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={() =>
                          this.onCopyContents(this.state.booking.reference)
                        }>
                        <Text style={[styles.txPrice, {color: 'red'}]}>
                          DK {this.state.booking.reference}
                        </Text>
                        <ScaledImage
                          height={20}
                          style={{tintColor: 'red'}}
                          source={require('@images/new/booking/ic_coppy.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  )) ||
                    null}
                  <View style={styles.between} />
                </React.Fragment>
              ) : null}

              <View style={styles.between} />
            </View>
            <View style={styles.end} />
          </ScrollView>
        )) ||
          null}
        {this.state.booking?.invoice?.payment ==
          constants.PAYMENT_METHOD.NONE ||
        (this.state.booking?.invoice?.payment ==
          constants.PAYMENT_METHOD.MOMO &&
          this.state.booking?.invoice?.status == 'NEW') ? (
          <TouchableOpacity
            onPress={this.onPayment}
            style={styles.buttonPayment}>
            <Text style={styles.txtPayment}>Thanh toán</Text>
          </TouchableOpacity>
        ) : null}
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={this.onBackdropPress}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.modal}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}>
          <QRCode value={this.state.value} size={250} fgColor="white" />
        </Modal>
        {/* <Modal
          isVisible={this.state.isVisibleIdHis}
          onBackdropPress={() => this.setState({ isVisibleIdHis: false })}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={{ flex: 1,  justifyContent: 'center'}}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
        <View>
          <Barcode
            value={this.state.value}
            size={80}
            ></Barcode>
            </View>
        </Modal> */}
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  txtPayment: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonPayment: {
    padding: 15,
    backgroundColor: '#00CBA7',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  txtBookingCall: {
    color: '#FFF',
    paddingLeft: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonBookingCall: {
    backgroundColor: '#FF8A00',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  containerProfileName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: '#FFF',
    paddingVertical: 15,
    width: '100%',
    paddingHorizontal: 15,
    borderTopColor: '#EDECED',
    borderTopWidth: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  end: {
    width: '100%',
    height: 50,
    backgroundColor: '#f7f9fb',
  },
  between: {
    backgroundColor: '#EDECED',
    height: 1,
    marginLeft: 30,
  },
  price: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  txtBold: {
    alignSelf: 'flex-end',
    fontWeight: 'bold',
  },
  image: {
    alignSelf: 'center',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  borderImage: {
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  ImageViewer: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  buttonShowImage: {
    marginRight: 10,
    marginBottom: 10,
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  containerListImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    borderRadius: 10,
  },
  viewName: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopColor: '#EDECED',
    borderTopWidth: 1,
    borderBottomColor: '#EDECED',
    borderBottomWidth: 1,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  txName: {
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  viewService: {
    paddingVertical: 15,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopColor: '#EDECED',
    borderTopWidth: 1,
    marginTop: 10,
  },
  txService: {
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  txInfoService: {
    maxWidth: 200,
    marginRight: 12,
    color: '#8F8E93',
  },
  viewLocation: {
    paddingVertical: 15,
    flexDirection: 'row',
    width: '100%',
    alignContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  txLocation: {
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  txLocationCheckin: {
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  txClinic: {
    marginRight: 10,
    color: '#8F8E93',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  viewInfoLocationCheckin: {
    paddingHorizontal: 5,
    alignItems: 'flex-end',
    flex: 5,
  },

  viewInfoLocation: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 5,
  },
  txAddress: {
    color: '#8F8E93',
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'right',
  },
  viewDate: {
    paddingVertical: 10,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#EDECED',
    borderBottomWidth: 1,
  },
  txDate: {
    flex: 1,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  viewDateTime: {
    alignItems: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: '50%',
  },
  txTime: {
    color: '#8F8E93',
    flex: 1,
    fontWeight: 'bold',
  },
  txDateInfo: {
    color: '#8F8E93',
  },
  viewSymptom: {
    backgroundColor: '#fff',
    marginVertical: 20,
    width: '100%',
    borderBottomColor: '#EDECED',
    borderBottomWidth: 1,
    borderTopColor: '#EDECED',
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  viewPrice: {
    paddingVertical: 15,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopColor: '#EDECED',
    borderTopWidth: 1,
  },
  txLabelPrice: {
    fontWeight: 'bold',
    marginHorizontal: 10,
    flex: 1,
  },
  txPrice: {
    alignItems: 'flex-end',
    marginRight: 12,
    color: '#8F8E93',
  },
  viewPayment: {
    paddingVertical: 15,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#EDECED',
    borderBottomWidth: 1,
  },
  txPayment: {
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  paymentHospital: {
    color: '#8F8E93',
    marginRight: 12,
  },
  viewStatus: {
    paddingVertical: 15,
    flexDirection: 'row',
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopColor: '#EDECED',
    borderTopWidth: 1,
  },
  txStatusLabel: {
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  txStatus: {
    color: '#8F8E93',
    marginRight: 12,
  },
  viewBaCode: {
    paddingVertical: 15,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#EDECED',
    borderTopColor: '#EDECED',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginTop: 10,
  },
  txLabelBarcode: {
    fontWeight: 'bold',
    marginHorizontal: 10,
    flex: 1,
  },

  titleStyle: {
    color: '#FFF',
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(DetailHistoryBookingScreen);
