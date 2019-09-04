import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from 'native-base'
import ActivityPanel from '@components/ActivityPanel';
import profileProvider from '@data-access/profile-provider'
import NavigationService from "@navigators/NavigationService";
import snackbar from "@utils/snackbar-utils";

export default class ShareDataProfileScreen extends Component {
  constructor(props) {
    super(props);
    let shareId = this.props.navigation.state.params && this.props.navigation.state.params.shareId ? this.props.navigation.state.params.shareId : null
    let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
    let permissionsOld = this.props.navigation.state.params && this.props.navigation.state.params.sharePermission ? this.props.navigation.state.params.sharePermission : ''
    this.state = {
      ehealth: permissionsOld == 'YBDT' || permissionsOld == 'YBDT,DATKHAM' ? true : false,
      bookingDate: permissionsOld == 'DATKHAM' || permissionsOld == 'YBDT,DATKHAM' ? true : false,
      permissionsOld,
      id,
      shareId,
      reset: 2
    };
  }
  shareEhealth = () => {
    this.setState({
      ehealth: !this.state.ehealth
    })
  }
  shareBookingDate = () => {
    this.setState({
      bookingDate: !this.state.bookingDate
    })
  }
  updatePermission = () => {
    let id = this.state.id
    let shareId = this.state.shareId
    console.log(id,shareId,'áhgdgádgah')
    let permissions
    if (!this.state.ehealth && !this.state.bookingDate) {
      permissions = ''
    }
    if (this.state.ehealth) {
      permissions = 'YBDT'
    }
    if (this.state.bookingDate) {
      permissions = 'DATKHAM'
    }
    if (this.state.bookingDate && this.state.ehealth) {
      permissions = 'YBDT,DATKHAM'
    }

    let data = {
      "recordId": id,
      "shareId": shareId,
      "permissions": permissions
    }
    profileProvider.sharePermission(data).then(res => {
      if (res.code == 0 && res.data) {
        snackbar.show('Cài đặt chia sẻ thành công', 'success')
        NavigationService.navigate('listProfileUser', { reset: this.state.reset + 1 })
      } else {
        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
      }
    }).catch(err => {
      snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
      console.log(err);
    })

  }
  render() {
    return (
      <ActivityPanel style={{ flex: 1 }}
        // title="HỒ SƠ Y BẠ GIA ĐÌNH"
        title={'CÀI ĐẶT CHIA SẺ'}
        showFullScreen={true} isLoading={this.state.isLoading}>
        <View style={styles.viewConfirm}>
          <Text style={styles.txContent}>CHỌN DỮ LIỆU BẠN MUỐN CHIA SẺ VỚI THÀNH VIÊN NÀY</Text>
          <View style={styles.viewSelected}><CheckBox onPress={this.shareEhealth} checked={this.state.ehealth} color="#02C39A"></CheckBox><Text style={styles.txSelected}>Y bạ điện tử của tôi</Text></View>
          <View style={styles.viewSelected}><CheckBox onPress={this.shareBookingDate} checked={this.state.bookingDate} color="#02C39A"></CheckBox><Text style={styles.txSelected}>Lịch khám của tôi</Text></View>
          <View style={styles.viewBtn}><TouchableOpacity onPress={this.updatePermission} style={styles.btnConfirm}><Text style={styles.txConfirm}>XÁC NHẬN</Text></TouchableOpacity></View>
        </View>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewBtn: { justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  btnConfirm: {
    backgroundColor: '#01BF88',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  txConfirm: {
    color: '#fff'
  },
  viewConfirm: {
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#02C39A',
    padding: 10
  },
  txContent: {
    fontSize: 16,
    color: '#02C39A',
    textAlign: 'center',
  },
  viewSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  txSelected: {
    color: '#000',
    fontSize: 14,
    marginHorizontal: 20
  }
})
