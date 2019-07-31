import ScaledImage from "mainam-react-native-scaleimage";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native'
import React from 'react';
import { DrawerItems } from 'react-navigation';
import { connect } from "react-redux";
import snackbar from '@utils/snackbar-utils';

class CustomDrawer extends React.Component {
  constructor(props) {
    super(props)
  }
  ratingApp = () => {
    if (Platform.OS == 'android') {
      Linking.openURL('market://details?id=com.isofh.isofhcare');
    } else {
      Linking.openURL('itms://itunes.apple.com/us/app/apple-store/id1428148423?mt=8');
    }
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {this.props.userApp.isLogin ? (
          <View style={styles.viewHeader}>
            <ScaledImage style={styles.avatarStyle} uri={this.props.userApp.currentUser.avatar} height={60} ></ScaledImage>
            <View style={styles.viewInfo}>
              <Text style={styles.txHello}>Xin Chào</Text>
              <Text style={styles.txName}>{this.props.userApp.currentUser.name && this.props.userApp.currentUser.name}</Text>
            </View>
          </View>
        ) : (<View></View>)}

        <ScaledImage source={require('@images/new/home/ic_drawer_logo.png')} style={[styles.imgLogo, this.props.userApp.isLogin ? {} : { marginVertical: 50 }]} height={80}></ScaledImage>
        {/* <DrawerItems></DrawerItems> */}
        <TouchableOpacity onPress={() => {
          snackbar.show("Chức năng đang phát triển");
        }} style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_qr.png')} />
          <Text style={styles.txDrawer}>Quét mã đơn thuốc</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          snackbar.show("Chức năng đang phát triển");
        }} style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_help.png')} />
          <Text style={styles.txDrawer}>Hỗ trợ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDrawer}
          onPress={() => {
            Linking.openURL(
              "mailto:support@isofhcare.vn?subject=Báo lỗi quá trình sử dụng app ISofhCare&body="
            );
          }}>
          <ScaledImage height={25} source={require('@images/new/home/ic_abort.png')} />
          <Text style={styles.txDrawer}>Báo lỗi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDrawer}
          onPress={() => {
            this.props.navigation.navigate("terms");
          }}>
          <ScaledImage height={25} source={require('@images/new/home/ic_rules.png')} />
          <Text style={styles.txDrawer}>Điều khoản sử dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.ratingApp} style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_rate.png')} />
          <Text style={styles.txDrawer}>Đánh giá Isofhcare</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end', flex: 1 }}>
          <ScaledImage style={{ right: -20 }} height={200} source={require('@images/new/home/ic_logo_lager.png')}></ScaledImage>
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  avatarStyle: {
    borderRadius: 30,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  viewInfo: {
    marginLeft: 10
  },
  viewDrawer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 20,
  },
  txDrawer: {
    marginLeft: 10
  },
  txHello: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 14
  },
  txName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  txId: {
    color: '#fff',
    fontSize: 14
  },
  viewHeader: {
    width: '100%',
    backgroundColor: '#359A60',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  imgLogo: {
    marginVertical: 20, marginLeft: 25
  }

})
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    navigation: state.navigation
  };
}
export default connect(mapStateToProps)(CustomDrawer);