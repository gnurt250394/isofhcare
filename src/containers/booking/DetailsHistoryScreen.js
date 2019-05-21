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
import snackbar from '@utils/snackbar-utils';

class DetailsHistoryScreen extends Component {
  constructor(props) {
    super(props);
    var id = this.props.navigation.state.params.id;

    this.state = {
      id: id
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

              console.log(s.data,'s.data.province');
         this.setState({
           address : s.data.hospital.address,
           booking: s.data.booking || {},
           service: s.data.service || {},
           hospital: s.data.hospital || {},
           medicalRecords: s.data.medicalRecords || {},
           isLoading: false
         })
        } else {
          snackbar.show("Không thể xem chi tiết đặt khám này", "danger");
          this.props.navigation.pop();
          return;
        }
      }).catch(err => {
        snackbar.show("Không thể xem chi tiết đặt khám này", "danger");
        this.props.navigation.pop();
        return;
      });
    });
  }
  renderStatus = () => {
    switch (Number(this.state.booking.statusPay)) {
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
    switch (this.state.booking.status) {
      case 0:
        return (
          <View style={styles.statusTx}>
            <Text style={styles.txStatus}>Chờ phục vụ</Text>
          </View>
        );
      case 1:
        return <Text style={styles.txStatus}>Đã huỷ (không đến)</Text>;
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
        return <Text style={styles.txStatus}>Đã huỷ (không phục vụ)</Text>;
      default:
        <Text style={styles.txStatus} />;
    }
  };
  renderImages() {
    var image = this.state.booking.images;
    if (image) {
      var images = image.split(",");
      return (<View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10,borderRadius:10 }}>
          {
            images.map((item, index) => <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("photoViewer", {
                urls: images.map(item => {
                  return item.absoluteUrl()
                }), index
              });
            }} key={index} style={{ marginRight: 10, marginBottom: 10, width: 70, height: 70,borderRadius:10 }}>
              <Image
                style={{ width: 70, height: 70,borderRadius:10  }}
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
  render() {
    const avatar = this.state.medicalRecords && this.state.medicalRecords.avatar ? { uri: `${this.state.medicalRecords.avatar.absoluteUrl()}` } : require("@images/new/user.png")
    return (
      <ActivityPanel
        isLoading={this.state.isLoading}
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
            <View style={styles.viewService}>
              <ScaledImage
                height={20}
                width={20}
                source={require("@images/ic_service.png")}
              />
              <Text style={styles.txService}>Dịch vụ khám</Text>
              <Text style={styles.txInfoService}>{this.state.service.name}</Text>
            </View>
            <View style={{ backgroundColor: '#EDECED', height: 1, marginLeft: 12 }}></View>
            <View style={styles.viewLocation}>
              <ScaledImage
                height={20}
                width={20}
                source={require("@images/ic_location.png")}
              />
              <Text numberOfLines={5} style={styles.txLocation}>Địa điểm</Text>
              <View style={styles.viewInfoLocation}>
                <Text style={styles.txClinic}>{this.state.hospital.name}</Text>
                {this.state.hospital.address ?
                  <Text numberOfLines={5} style={styles.txAddress}>{this.state.address}</Text> : null

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
                  {this.state.booking.bookingTime.toDateObject("-").format("HH:mm")}
                  {this.checkAm()}
                </Text>
                <Text style={styles.txDateInfo}>
                  {"Ngày " +
                    this.state.booking.bookingTime.toDateObject("-").format("dd/MM/yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.viewSymptom}>
              <Text><Text style={{fontWeight:'bold'}}>Triệu chứng: </Text> {this.state.booking.content}</Text>
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
                {Number(this.state.service.price).formatPrice() + 'đ'}
              </Text>
            </View>
            <View style={{ backgroundColor: '#EDECED', height: 1, marginLeft: 12 }}></View>
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

            <View style={styles.viewBaCode}>
              <ScaledImage
                width={20}
                height={20}
                source={require("@images/ic_barcode.png")}
              />
              <Text style={styles.txLabelBarcode}>Mã code</Text>
              <View style={{ marginRight: 10 }}>
                <QRCode
                  value={this.state.booking.codeBooking ? this.state.booking.codeBooking : 0}
                  size={80}
                  fgColor='white' />
              </View>
            </View>
          </View>
        </ScrollView>}
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
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(DetailsHistoryScreen);