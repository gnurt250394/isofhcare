import React, { Component, PropTypes } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import bookingProvider from "@data-access/booking-provider";
import { connect } from "react-redux";
import ActivityPanel from "@components/ActivityPanel";
import ScaledImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode-svg';
import dateUtils from "mainam-react-native-date-utils";
import stringUtils from "mainam-react-native-string-utils";
import clientUtils from '@utils/client-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';
import Modal from "@components/modal";
import stylemodal from "@styles/modal-style";
import constants from "@resources/strings";
import Barcode from 'mainam-react-native-barcode'
class DetailsHistoryScreen extends Component {
  constructor(props) {
    super(props);
    var id = this.props.navigation.state.params.id;

    this.state = {
      id: id,
      value: 0
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      bookingProvider.detail(this.state.id).then(s => {
        if (s.code == 0 && s.data) {
          // let address = s.data.hospital.address;
          // if (s.data.zone && s.data.zone.name)
          //     address += ", " + s.data.zone.name;
          // if (s.data.district && s.data.district.name)
          //     address += ", " + s.data.district.name;
          // if (s.data.province && s.data.province.countryCode )
          //     address += ", " + s.data.province.countryCode

          console.log(s.data, 's.data.province');
          this.setState({
            address: s.data.hospital.address,
            booking: s.data.booking || {},
            service: s.data.service || {},
            services: s.data.services || [],
            hospital: s.data.hospital || {},
            medicalRecords: s.data.medicalRecords || {},
            isLoading: false
          })
        } else {
          snackbar.show(constants.msg.booking.cannot_show_details_booking, "danger");
          this.props.navigation.pop();
          return;
        }
      }).catch(err => {
        snackbar.show(constants.msg.booking.cannot_show_details_booking, "danger");
        this.props.navigation.pop();
        return;
      });
    });
  }
  renderStatus = () => {
    alert(this.state.booking.statusPay);
    switch (Number(this.state.booking.statusPay)) {
      case 0:
        return <Text style={styles.paymentHospital}>{constants.booking.status.not_select_payment}</Text>;
      case 1:
        return <Text style={styles.paymentHospital}>{constants.booking.status.payment_isofh}</Text>;
      case 2:
        return <Text style={styles.paymentHospital}>{constants.booking.status.payment_VNPAY}</Text>;
      case 3:
        return <Text style={styles.paymentHospital}>{constants.booking.status.payment_CSYT}</Text>;
      case 4:
        return <Text style={styles.paymentHospital}>{constants.booking.status.payment_payoo}</Text>;
      case 5:
        return <Text style={styles.paymentHospital}>{constants.booking.status.payment_payoo2}</Text>;

    }
  };
  status = () => {
    switch (this.state.booking.status) {
      case 0:
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>{constants.booking.status.pending}</Text>
          </View>
        );
      case 1:
        return <Text style={styles.txStatus}>{constants.booking.status.cancel}</Text>;
      case 2:
        return <Text style={styles.txStatus}>{constants.booking.status.payment_failer}</Text>;
      case 3:
        return <Text style={styles.txStatus}>{constants.booking.status.paymented}</Text>;
      case 4:
        return <Text style={styles.txStatus}>{constants.booking.status.payment_last}</Text>;
      case 5:
        return <Text style={styles.txStatus}>{constants.booking.status.payment_pending}</Text>;
      case 6:
        return <Text style={styles.txStatus}>{constants.booking.status.confirm}</Text>;
      case 7:
        return <Text style={styles.txStatus}>{constants.booking.status.have_profile}</Text>;
      case 8:
        return <Text style={styles.txStatus}>{constants.booking.status.rejected}</Text>;
      default:
        <Text style={styles.txStatus} />;
    }
  };
  renderImages() {
    var image = this.state.booking.images;
    if (image) {
      var images = image.split(",");
      return (<View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, borderRadius: 10 }}>
          {
            images.map((item, index) => <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("photoViewer", {
                urls: images.map(item => {
                  return item.absoluteUrl()
                }), index
              });
            }} key={index} style={{ marginRight: 10, marginBottom: 10, width: 70, height: 70, borderRadius: 10 }}>
              <Image
                style={{ width: 70, height: 70, borderRadius: 10 }}
                source={{
                  uri: item ? item.absoluteUrl() : ''
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>)
          }

        </View>
      </View>);
    } else {
      return null;
    }
  }
  checkAm = () => {
    if (this.state.booking.bookingTime.toDateObject("-").format("HH") < 12) {
      return (<Text>{' Sáng'}</Text>)
    } else {
      return (<Text>{' Chiều'}</Text>)
    }
  }
  onQrClick = () => {
    this.setState({
      isVisible: true,
      value: this.state.booking.codeBooking ? this.state.booking.codeBooking : 0
    })
  }
  onBarCodeClick = () => {
    this.setState({
      isVisibleIdHis: true,
      valueHis: this.state.booking.codeBooking ? this.state.booking.codeBooking : 0
    })
  }
  render() {
    const avatar = this.state.medicalRecords && this.state.medicalRecords.avatar ? { uri: `${this.state.medicalRecords.avatar.absoluteUrl()}` } : require("@images/new/user.png")
    return (
      <ActivityPanel
        isLoading={this.state.isLoading}
        icBack={require('@images/new/left_arrow_white.png')}
        iosBarStyle={'light-content'}
        statusbarBackgroundColor="#02C39A"
        actionbarStyle={styles.actionbarStyle}
        titleStyle={styles.titleStyle}
        isLoading={this.state.isLoading}
        title="Chi tiết đặt lịch"
      >

        {this.state.booking && <ScrollView>
          <View>
            <View style={styles.viewName}>
              <ImageLoad
                resizeMode="cover"
                imageStyle={{ borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                borderRadius={20}
                customImagePlaceholderDefaultStyle={[styles.avatar, { width: 40, height: 40 }]}
                placeholderSource={require("@images/new/user.png")}
                resizeMode="cover"
                loadingStyle={{ size: 'small', color: 'gray' }}
                source={avatar}
                style={{
                  alignSelf: 'center',
                  borderRadius: 20,
                  width: 40,
                  height: 40
                }}
                defaultImage={() => {
                  return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={20} height={20} />
                }}
              />
              <Text style={styles.txName}>{this.state.medicalRecords.name}</Text>
            </View>
            {this.state.booking.hisPatientHistoryId ? (
              <View style={styles.viewBaCode}>
                <ScaledImage
                  width={20}
                  height={20}
                  source={require("@images/ic_barcode.png")}
                />
                <Text style={styles.txLabelBarcode}>Mã code</Text>
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <Barcode
                    value={this.state.booking.hisPatientHistoryId ? this.state.booking.hisPatientHistoryId : 0}
                    size={80}
                  />
                </TouchableOpacity>
              </View>
            ) : (
                <View style={styles.viewBaCode}>
                  <ScaledImage
                    width={20}
                    height={20}
                    source={require("@images/ic_barcode.png")}
                  />
                  <Text style={styles.txLabelBarcode}>Mã code</Text>
                  <TouchableOpacity onPress={this.onQrClick} style={{ marginRight: 10, alignItems: 'center' }}>
                    <QRCode
                      value={this.state.booking.codeBooking || 0}
                      logo={require('@images/new/logo.png')}
                      logoSize={20}
                      size={80}
                      logoBackgroundColor='transparent'
                    />
                    <Text>{this.state.booking.codeBooking}</Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.state.services && this.state.services.length ?
              <View style={[styles.viewService, { alignItems: 'flex-start' }]}>
                <ScaledImage
                  height={20}
                  width={20}
                  source={require("@images/ic_service.png")}
                />
                <Text style={styles.txService}>Dịch vụ</Text>
                <View>
                  {
                    this.state.services.map((item, index) => {
                      return <View key={index}>
                        <Text numberOfLines={1} key={index} style={[styles.txInfoService, { alignSelf: 'flex-end', fontWeight: 'bold' }]}>{item.name}</Text>
                        <Text key={index} style={[styles.txInfoService, { alignSelf: 'flex-end', marginBottom: 5 }]}>({item.price.formatPrice()}đ)</Text>
                      </View>
                    })
                  }
                </View>
              </View> : null
            }


            <View style={{ backgroundColor: '#EDECED', height: 1, marginLeft: 12 }}></View>
            <View style={[styles.viewLocation, { alignItems: 'flex-start' }]}>
              <ScaledImage
                height={20}
                width={20}
                source={require("@images/ic_location.png")}
              />
              <Text numberOfLines={5} style={styles.txLocation}>Địa điểm</Text>
              <View style={styles.viewInfoLocation}>
                <Text style={styles.txClinic}>{this.state.hospital.name}</Text>
                {this.state.hospital.address ?
                  <Text style={styles.txAddress}>{this.state.address}</Text> : null

                }
              </View>
            </View>
            <View style={{ backgroundColor: '#EDECED', height: 1, marginLeft: 12 }}></View>
            <View style={styles.viewDate}>
              <ScaledImage
                height={19}
                width={19}
                source={require("@images/ic_date.png")}
              />
              <Text style={styles.txDate}>Ngày khám</Text>
              <View style={styles.viewDateTime}>
                <Text style={styles.txTime}>
                  {this.state.booking.bookingTime.toDateObject("-").format("hh:mm")}
                  {this.checkAm()}
                </Text>
                <Text style={styles.txDateInfo}>
                  {"Ngày " +
                    this.state.booking.bookingTime.toDateObject("-").format("dd/MM/yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.viewSymptom}>
              <Text><Text style={{ fontWeight: 'bold' }}>Ghi chú: </Text> {this.state.booking.content}</Text>
              <View>
                {this.renderImages()}
                {/* <ScaledImage
                  width={70}
                  height={70}
                  source={{ uri: this.state.imgNote ? this.state.imgNote.absoluteUrl() :'' }}
                /> */}
              </View>
            </View>
            {
              this.state.services && this.state.services.length ?
                <React.Fragment>
                  <View style={styles.viewPrice}>
                    <ScaledImage
                      source={require("@images/ic_price.png")}
                      width={20}
                      height={20}
                    />
                    <Text style={styles.txLabelPrice}>Tổng tiền dịch vụ</Text>
                    <Text style={styles.txPrice}>
                      {this.state.services.reduce((start, item) => start + parseInt(item.price), 0).formatPrice() + 'đ'}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#EDECED', height: 1, marginLeft: 12 }}></View>
                </React.Fragment>
                : null
            }
            <View style={styles.viewPayment}>
              <ScaledImage
                height={19}
                width={19}
                source={require("@images/ic_transfer.png")}
              />
              <Text style={styles.txPayment}>Phương thức TT</Text>
              {this.renderStatus()}
            </View>
            <View style={styles.viewStatus}>
              <ScaledImage
                height={20}
                width={20}
                source={require("@images/ic_status.png")}
              />
              <Text style={styles.txStatusLabel}>Trạng thái</Text>
              {this.status()}
            </View>
            <View style={{ backgroundColor: '#EDECED', height: 1, marginLeft: 12 }}></View>


          </View>
          <View style={{ with: '100%', height: 50, backgroundColor: "#f7f9fb" }}></View>
        </ScrollView>}
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          <QRCode
            value={this.state.value}
            size={250}

            fgColor='white' />
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
  viewName: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1,
    marginVertical: 20
  },
  txName: {
    fontWeight: "bold",
    flex: 1,
    marginLeft: 8
  },
  viewService: {
    paddingVertical: 15,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
    marginTop: 10
  },
  txService: {
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10
  },
  txInfoService: {
    maxWidth: 200,
    marginRight: 12,
    color: "#8F8E93"
  },
  viewLocation: {
    paddingVertical: 15,
    flexDirection: "row",
    width: "100%",
    alignContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",


  },
  txLocation: {
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10,

  },
  txClinic: {
    marginRight: 10,
    color: "#8F8E93",
    fontWeight: "bold",
    textAlign: 'right'

  },
  viewInfoLocation: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '50%'
  },
  txAddress: {
    color: "#8F8E93",
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'right'
  },
  viewDate: {
    paddingVertical: 10,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
  },
  txDate: {
    flex: 1,
    fontWeight: "bold",
    marginHorizontal: 10
  },
  viewDateTime: {
    alignItems: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "50%"
  },
  txTime: {
    color: "#8F8E93",
    flex: 1,
    fontWeight: "bold"
  },
  txDateInfo: {
    color: "#8F8E93"
  },
  viewSymptom: {
    backgroundColor: "#fff",
    marginVertical: 20,
    width: "100%",
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1,
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  viewPrice: {
    paddingVertical: 15,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderTopColor: "#EDECED",
    borderTopWidth: 1,

  },
  txLabelPrice: {
    fontWeight: "bold",
    marginHorizontal: 10,
    flex: 1
  },
  txPrice: {
    alignItems: "flex-end",
    marginRight: 12,
    color: "#8F8E93"
  },
  viewPayment: {
    paddingVertical: 15,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
  },
  txPayment: {
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10
  },
  paymentHospital: {
    color: "#8F8E93",
    marginRight: 12,

  },
  viewStatus: {
    paddingVertical: 15,
    flexDirection: "row",
    marginTop: 15,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",

  },
  txStatusLabel: {
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10
  },
  txStatus: {
    color: "#8F8E93",
    marginRight: 12,

  },
  viewBaCode: {
    paddingVertical: 15,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
  },
  txLabelBarcode: {
    fontWeight: "bold",
    marginHorizontal: 10,
    flex: 1
  },
  actionbarStyle: {
    backgroundColor: '#02C39A',
    borderBottomWidth: 0
  },
  titleStyle: {
    color: '#FFF'
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(DetailsHistoryScreen);