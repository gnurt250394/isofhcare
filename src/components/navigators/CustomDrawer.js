import ScaledImage from "mainam-react-native-scaleimage";
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import React from 'react';
import { DrawerItems } from 'react-navigation';
import { connect } from "react-redux";

class CustomDrawer extends React.Component {
  constructor(props) {
    super(props)
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
              <Text style={styles.txId}>Id Here</Text>
            </View>
          </View>
        ) : (<View></View>)}

        <ScaledImage source={require('@images/new/home/ic_drawer_logo.png')} style={[styles.imgLogo, this.props.userApp.isLogin ? {} : { marginVertical: 50 }]} height={80}></ScaledImage>
        {/* <DrawerItems></DrawerItems> */}
        <View style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_qr.png')} />
          <Text style={styles.txDrawer}>Quét mã đơn thuốc</Text>
        </View>
        <View style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_help.png')} />
          <Text style={styles.txDrawer}>Hỗ trợ</Text>
        </View>
        <View style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_abort.png')} />
          <Text style={styles.txDrawer}>Báo lỗi</Text>
        </View>
        <View style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_rules.png')} />
          <Text style={styles.txDrawer}>Điều khoản sử dụng</Text>
        </View>
        <View style={styles.viewDrawer}>
          <ScaledImage height={25} source={require('@images/new/home/ic_rate.png')} />
          <Text style={styles.txDrawer}>Đánh giá Isofhcare</Text>
        </View>
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
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(CustomDrawer);