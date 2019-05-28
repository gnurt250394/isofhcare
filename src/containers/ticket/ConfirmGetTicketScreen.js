import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Clipboard } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import { connect } from 'react-redux';
import SendSMS from 'react-native-sms';

class ConfirmGetTicketScreen extends Component {
  constructor(props) {
    super(props);
    let code = "LAYSO BVE " + this.props.navigation.state.params.data.oderCode;
    this.state = {
      code
    };
  }

  onCopy = () => {
    Clipboard.setString(this.state.code);
    snackbar.show("Sao chép thành công", "success");

  }
  render() {
    let data = this.props.navigation.state.params.data;
    console.log(data.address);
    return (
      <ActivityPanel
        style={styles.AcPanel}
        title="Xác nhận thông tin"
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
          <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={{ textAlign: 'center', color: '#000' }}>Bạn cần nhắn tin tới tổng đài <Text style={{ fontWeight: 'bold' }}>8300</Text> (3.000đ) để lấy số thứ tự tiếp đón.</Text>
            <View style={{ borderWidth: 1, borderColor: '#f05673', marginTop: 14, justifyContent: 'center', alignItems: 'center', borderRadius: 6, padding: 10 }}>
              <Text style={{ fontSize: 15 }}>Cú pháp SMS</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ color: '#f05673', fontWeight: '600' }}>{this.state.code}</Text>
                <TouchableOpacity onPress={this.onCopy}>
                  <ScaledImage style={{ marginLeft: 10 }} height={16} source={require('@images/new/booking/ic_Copy.png')}></ScaledImage></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 20, backgroundColor: 'rgba(39,174,96,0.11)', padding: 20 }}>
            <Text>THÔNG TIN NGƯỜI KHÁM</Text>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Mã thẻ BHYT</Text>
              <Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}>{data.id}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Họ và tên</Text>
              <Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}>{data.fullname}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Giới tính</Text>
              <Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}>{data.gender ? "Nam" : "Nữ"}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Ngày sinh</Text>
              <Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}>{data.bod}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Ngày bắt đầu</Text>
              <Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}>{data.startDate}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Nơi đăng ký khám {`\n`}chữa bệnh ban đầu</Text>
              <Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}>{data.hospitalCode}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Số điện thoại</Text>
              <Text style={{ fontWeight: 'bold', color: '#F05673' }}>{this.props.userApp.currentUser.phone}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>Địa chỉ</Text>
              <Text style={{ fontWeight: 'bold', textAlign: 'right', color: '#4A4A4A', flex: 1, maxWidth: 200 }} numberOfLines={3}>{data.address}</Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={[styles.button]} onPress={() => {
          SendSMS.send({
            body: this.state.code,
            recipients: ['8300'],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
          }, (completed, cancelled, error) => {
            if (completed) {
              this.props.navigation.navigate("selectHealthFacilitiesScreen", {
                selectTab: 1,
                requestTime: new Date()
              });
            }
          });
        }}><Text style={{
          color: "#ffffff", fontSize: 16, fontWeight: '600'
        }}>Gửi tin nhắn lấy số</Text></TouchableOpacity >
      </ActivityPanel >

    );
  }
}
const styles = StyleSheet.create({
  AcPanel: {
    flex: 1,
    backgroundColor: '#cacaca',
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  label: {
    marginRight: 10
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: "rgb(10,155,225)",
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 2,
      height: 4
    },
    paddingVertical: 17,
    shadowRadius: 10,
    marginVertical: 20,
    marginHorizontal: 60,
    shadowOpacity: 1
  },
})
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    bookingTicket: state.bookingTicket
  };
}
export default connect(mapStateToProps)(ConfirmGetTicketScreen);