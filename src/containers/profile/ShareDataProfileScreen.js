import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from 'native-base'
import ActivityPanel from '@components/ActivityPanel';
import profileProvider from '@data-access/profile-provider'
import NavigationService from "@navigators/NavigationService";
import snackbar from "@utils/snackbar-utils";
import constants from '../../res/strings';

export default class ShareDataProfileScreen extends Component {
  constructor(props) {
    super(props);
    let shareId = this.props.navigation.state.params && this.props.navigation.state.params.shareId ? this.props.navigation.state.params.shareId : null
    let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : null
    let permissionsOld = this.props.navigation.state.params && this.props.navigation.state.params.permission ? this.props.navigation.state.params.permission : ''
    this.state = {
      ehealth: permissionsOld.indexOf('YBDT') >= 0 ? true : false,
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

  updatePermission = () => {
    let id = this.state.id
    let shareId = this.state.shareId
    let permissions
    if (!this.state.ehealth) {
      permissions = ''
    }
    if (this.state.ehealth) {
      permissions = 'YBDT'
    }
    let data = {
      "recordId": id ? id : shareId,
      "shareId": id ? shareId : null,
      "permissions": permissions
    }
    console.log(data, 'datadatadata')
    profileProvider.sharePermission(data).then(res => {
      if (res.code == 0 && res.data) {
        snackbar.show(constants.msg.user.setting_share_success, 'success')
        NavigationService.navigate('listProfileUser', { reset: this.state.reset + 1 })
      } else {
        snackbar.show(constants.msg.notification.error_retry, 'danger')
      }
    }).catch(err => {
      snackbar.show(constants.msg.notification.error_retry, 'danger')
      console.log(err);
    })

  }
  render() {
    return (
      <ActivityPanel style={{ flex: 1 }}
        title={constants.title.setting_share}
        showFullScreen={true} isLoading={this.state.isLoading}>
        <View style={styles.viewConfirm}>
          <Text style={styles.txContent}>{constants.msg.user.select_data_need_share}</Text>
          <View style={styles.viewSelected}>
            <CheckBox onPress={this.shareEhealth} checked={this.state.ehealth} color="#02C39A"></CheckBox>
            <Text style={styles.txSelected}>{constants.ehealth.my_ehealth}</Text></View>
          {/* <View style={styles.viewSelected}><CheckBox onPress={this.shareBookingDate} checked={this.state.bookingDate} color="#02C39A"></CheckBox><Text style={styles.txSelected}>Lịch khám của tôi</Text></View> */}
          <View style={styles.viewBtn}><TouchableOpacity onPress={this.updatePermission} style={styles.btnConfirm}><Text style={styles.txConfirm}>{constants.actionSheet.confirm.toUpperCase()}</Text></TouchableOpacity></View>
        </View>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20
  },
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
