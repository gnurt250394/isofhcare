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
        <ScaledImage source={require('@images/new/home/ic_drawer_logo.png')} style={[styles.imgLogo, this.props.userApp.isLogin ? {} : { marginVertical: 50 }]} height={80}></ScaledImage>
        {/* <DrawerItems></DrawerItems> */}
        <TouchableOpacity onPress={() => {
          snackbar.show("Chức năng đang phát triển");
        }} style={styles.viewDrawer}>
          <View style={{ width: 25, height: 25 }}>
            <ScaledImage height={25} width={25} source={require('@images/new/home/ic_qr.png')} />
          </View>
          <Text style={styles.txDrawer}>Quét mã đơn thuốc</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          snackbar.show("Chức năng đang phát triển");
        }} style={styles.viewDrawer}>
          <View style={{ width: 25, height: 25 }}>
            <ScaledImage height={25} width={25} source={require('@images/new/home/ic_help.png')} />
          </View>
          <Text style={styles.txDrawer}>Hỗ trợ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDrawer}
          onPress={() => {
            Linking.openURL(
              "mailto:cskh@isofhcare.com?subject=Báo lỗi quá trình sử dụng app ISofhCare&body="
            );
          }}>
          <View style={{ width: 25, height: 25 }}>
            <ScaledImage height={25} width={25} source={require('@images/new/home/ic_abort.png')} />
          </View>
          <Text style={styles.txDrawer}>Báo lỗi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDrawer}
          onPress={() => {
            this.props.navigation.navigate("terms");
          }}>
          <View style={{ width: 25, height: 25 }}>
            <ScaledImage height={25} width={25} source={require('@images/new/home/ic_rules.png')} />
          </View>
          <Text style={styles.txDrawer}>Điều khoản sử dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.ratingApp} style={styles.viewDrawer}>
          <View style={{ width: 25, height: 25 }}>
            <ScaledImage height={25} width={25} source={require('@images/new/home/ic_rate.png')} />
          </View>
          <Text style={styles.txDrawer}>Đánh giá Isofhcare</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end', flex: 1 }}>
          <ScaledImage height={200} source={require('@images/new/home/ic_logo_lager.png')}></ScaledImage>
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