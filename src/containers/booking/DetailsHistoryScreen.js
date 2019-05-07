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
import QRCode from 'react-native-qrcode';
import dateUtils from "mainam-react-native-date-utils";
import stringUtils from "mainam-react-native-string-utils";
import clientUtils from '@utils/client-utils';
import ImageLoad from 'mainam-react-native-image-loader';

export default class DetailsHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      image: "",
      service: "",
      location: "",
      address: "",
      date: "",
      info: "",
      price: "",
      statusPay: "",
      codeBooking: "",
      note: "",
      imgNote: "",
      status: "",
      data: {}
    };
  }

  componentDidMount() {
    var id = this.props.navigation.state.params.id;
    var name = this.props.navigation.state.params.name;
    var image = this.props.navigation.state.params.image;
    var service = this.props.navigation.state.params.service;
    var location = this.props.navigation.state.params.location;
    var address = this.props.navigation.state.params.address;
    var date = this.props.navigation.state.params.date;
    var info = this.props.navigation.state.params.info;
    var price = this.props.navigation.state.params.price;
    var statusPay = this.props.navigation.state.params.statusPay;
    var codeBooking = this.props.navigation.state.params.codeBooking;
    var note = this.props.navigation.state.params.note;
    var imgNote = this.props.navigation.state.params.imgNote;
    var status = this.props.navigation.state.params.status;
    this.setState({
      id,
      name,
      image,
      service,
      location,
      address,
      date,
      info,
      price,
      statusPay,
      codeBooking,
      note,
      imgNote,
      status
    });
    console.log(id,
      name,
      image,
      service,
      location,
      address,
      date,
      info,
      price,
      statusPay,
      codeBooking,
      note,
      imgNote,
      status)
    this.onGetDetails();
  }
  onGetDetails = () => {
    var id = this.props.navigation.state.params.id;
    bookingProvider
      .detailsPatientHistory(id)
      .then(res => {
        if (res.code == 0) {
          this.setState({
            data: res.data.booking
          });
        }
      })
      .catch(err => {
        this.setState({
          res: false
        });
      });
  };
  renderStatus = () => {
    switch (Number(this.state.statusPay)) {
      case 0:
        return <Text style={styles.paymentHospital}>Chưa chọn hình thức</Text>;
      case 1:
        return <Text style={styles.paymentHospital}>Ví Isofh</Text>;
      case 2:
        return <Text style={styles.paymentHospital}>VNPAY</Text>;
      case 3:
        return <Text style={styles.paymentHospital}>Thanh toán tại viện</Text>;
    }
  };
  status = () => {
    switch (this.state.status) {
      case 0:
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Chờ phục vụ</Text>
          </View>
        );
      case 1:
        return <Text style={styles.txStatus}>Đã huỷ ( không đến )</Text>;
      case 2:
        return <Text style={styles.txStatus}>Thanh toán thất bại</Text>;
      case 3:
        return <Text style={styles.txStatus}>Đã thanh toán</Text>;
      case 4:
        return <Text style={styles.txStatus}>Thanh toán sau</Text>;
      case 5:
        return <Text style={styles.txStatus}>Chờ thanh toán</Text>;
      case 6:
        return <Text style={styles.txStatus}>Đã xác nhận</Text>;
      case 7:
        return <Text style={styles.txStatus}>Đã có hồ sơ</Text>;
      case 8:
        return <Text style={styles.txStatus}>Đã huỷ ( không phục vụ )</Text>;
      default:
        <Text style={styles.txStatus} />;
    }
  };
  renderImages() {
    var image = this.state.imgNote
    if (image) {
      var images = image.split(",");
      return (<View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {
            images.map((item, index) => <TouchableOpacity key={index} style={{ marginRight: 10, borderRadius: 10, marginBottom: 10, width: 70, height: 70 }}>
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
    let hours = '2019-04-12 11:59:00'
    console.log(hours.toDateObject('-').format('HH:mm'), 'sssss', this.state.date.toDateObject("-").format("HH:mm"))
    if (this.state.date.toDateObject("-").format("HH:mm") < hours.toDateObject('-').format('HH:mm')) {
      return (<Text>{' Sáng'}</Text>)
    } else {
      return (<Text>{' Chiều'}</Text>)
    }
  }
  render() {
    const avatar = this.state.image ? { uri: this.state.image.absoluteUrl() } : require("@images/new/user.png")
    return (
      <ActivityPanel
        style={{ flex: 1, backgroundColor: "#f7f9fb" }}
        title="Chi tiết đặt lịch"
        containerStyle={{
          backgroundColor: "#f7f9fb"
        }}
        actionbarStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.06)'
        }}

      >
        <ScrollView>
          <View>
            <View style={styles.viewName}>
              <ScaledImage
                width={20}
                borderRadius={10}
                height={20}
                source={
                  avatar
                }
              />
              <Text style={styles.txName}>{this.state.name}</Text>
            </View>
            <View style={styles.viewService}>
              <ScaledImage
                height={20}
                width={20}
                source={require("@images/ic_service.png")}
              />
              <Text style={styles.txService}>Dịch vụ khám</Text>
              <Text style={styles.txInfoService}>{this.state.service}</Text>
            </View>
            <View style={styles.viewLocation}>
              <ScaledImage
                height={20}
                width={20}
                source={require("@images/ic_location.png")}
              />
              <Text numberOfLines={5} style={styles.txLocation}>Địa điểm</Text>
              <View style={styles.viewInfoLocation}>
                <Text style={styles.txClinic}>{this.state.location}</Text>
                <Text numberOfLines={5} style={styles.txAddress}>{this.state.address}</Text>
              </View>
            </View>
            <View style={styles.viewDate}>
              <ScaledImage
                height={19}
                width={19}
                source={require("@images/ic_date.png")}
              />
              <Text style={styles.txDate}>Ngày khám</Text>
              <View style={styles.viewDateTime}>
                <Text style={styles.txTime}>
                  {this.state.date.toDateObject("-").format("HH:mm")}
                  {this.checkAm()}
                </Text>
                <Text style={styles.txDateInfo}>
                  {"Ngày " +
                    this.state.date.toDateObject("-").format("dd/MM/yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.viewSymptom}>
              <Text>{this.state.note ? 'Triệu chứng: ' + this.state.note : 'Triệu chứng: '}</Text>
              <View>
                {this.renderImages()}
                {/* <ScaledImage
                  width={70}
                  height={70}
                  source={{ uri: this.state.imgNote ? this.state.imgNote.absoluteUrl() :'' }}
                /> */}
              </View>
            </View>
            <View style={styles.viewPrice}>
              <ScaledImage
                source={require("@images/ic_price.png")}
                width={20}
                height={20}
              />
              <Text style={styles.txLabelPrice}>Giá dịch vụ</Text>
              <Text style={styles.txPrice}>
                {Number(this.state.price).formatPrice() + 'đ'}
              </Text>
            </View>
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
            <View style={styles.viewBaCode}>
              <ScaledImage
                width={20}
                height={20}
                source={require("@images/ic_barcode.png")}
              />
              <Text style={styles.txLabelBarcode}>Mã code</Text>
              <View style={{ marginRight: 10 }}>
                <QRCode
                  value={this.state.codeBooking ? this.state.codeBooking : 0}
                  size={80}
                  fgColor='white' />
              </View>
            </View>
          </View>
        </ScrollView>
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
    marginLeft: 5
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
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1,
    marginTop: 10
  },
  txService: {
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10
  },
  txInfoService: {
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
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
  },
  txLocation: {
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10
  },
  txClinic: {
    marginRight: 12,
    color: "#8F8E93",
    fontWeight: "bold"
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
    marginHorizontal: 10
  },
  viewDate: {
    paddingVertical: 10,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
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
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
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
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
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
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
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
    borderTopColor: "#EDECED",
    borderTopWidth: 1,
    borderBottomColor: "#EDECED",
    borderBottomWidth: 1
  },
  txLabelBarcode: {
    fontWeight: "bold",
    marginHorizontal: 10,
    flex: 1
  }
});
