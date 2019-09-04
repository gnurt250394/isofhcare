import ScaledImage from "mainam-react-native-scaleimage";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react';
import { DrawerItems } from 'react-navigation';
import { connect } from "react-redux";
import NavigationService from "@navigators/NavigationService";
import DeviceInfo from 'react-native-device-info';
import ActivityPanel from "@components/ActivityPanel";
import ImageLoad from "mainam-react-native-image-loader";

class MenuProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: this.props.userApp.currentUser.avatar
    }
    if (!this.props.userApp.isLogin) {
      this.props.navigation.navigate("login", {
        nextScreen: { screen: "accountTab", param: {} }
      });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        avatar: nextProps.userApp.currentUser.avatar
      })
    }
  }
  onProfileClick = () => {
    NavigationService.navigate('listProfileUser')
}
  render() {
    if (!this.props.userApp.isLogin)
      return null;
      const icSupport = require("@images/new/user.png");
      const source = this.state.avatar
        ? { uri: this.state.avatar.absoluteUrl() }
        : icSupport;
    return (
      <ActivityPanel
        
        isLoading={this.state.isLoading}
        hideActionbar={true}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {this.props.userApp.isLogin ? (
            <View style={styles.viewHeader}>
              {/* <ScaledImage style={styles.avatarStyle} uri={this.state.avatar.absoluteUrl()} height={60} ></ScaledImage> */}
              <View
          style={{marginLeft:15}}
          
        >
          <ImageLoad
            resizeMode="cover"
            imageStyle={styles.imageStyle}
            borderRadius={30}
            customImagePlaceholderDefaultStyle={styles.customImagePlace}
            placeholderSource={icSupport}
            style={styles.styleImgLoad}
            resizeMode="cover"
            loadingStyle={{ size: "small", color: "gray" }}
            source={source}
            defaultImage={() => {
              return (
                <ScaledImage
                  resizeMode="cover"
                  source={source}
                  width={60}
                  style={styles.styleImgLoad}
                />
              );
            }}
          />
        </View>
              <View style={styles.viewInfo}>
                <Text style={styles.txHello}>Xin Chào</Text>
                <Text style={styles.txName}>{this.props.userApp.currentUser.name && this.props.userApp.currentUser.name}</Text>
              </View>
            </View>
          ) : (<ScaledImage source={require('@images/new/home/ic_drawer_logo.png')} style={[styles.imgLogo, this.props.userApp.isLogin ? {} : { marginVertical: 50 }]} height={80}></ScaledImage>
            )}

          {/* <DrawerItems></DrawerItems> */}
          <View style={this.props.userApp.isLogin ? { marginTop: 30 } : {}}>
            <TouchableOpacity onPress={this.onProfileClick} style={styles.viewDrawer}>
              <ScaledImage height={15} source={require('@images/new/profile/ic_family.png')} />
              <Text style={[styles.txDrawer, { marginLeft: 7 }]}>Thành viên gia đình</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => NavigationService.navigate('patientHistory')} style={styles.viewDrawer}>
              <ScaledImage height={20} source={require('@images/new/profile/ic_calendar.png')} />
              <Text style={styles.txDrawer}>Lịch khám</Text>
            </TouchableOpacity>
            <View style={styles.viewDrawer}>
              <ScaledImage height={20} source={require('@images/new/profile/ic_history.png')} />
              <Text style={styles.txDrawer}>Lịch sử giao dịch</Text>
            </View>
            <TouchableOpacity onPress={() => NavigationService.navigate("ehealth")} style={styles.viewDrawer}>
              <ScaledImage height={20} source={require('@images/new/profile/ic_ehealth_small.png')} />
              <Text style={[styles.txDrawer, { marginLeft: 12 }]}>Y bạ điện tử</Text>
            </TouchableOpacity>
            <View style={styles.viewDrawer}>
              <ScaledImage height={20} source={require('@images/new/profile/ic_drug.png')} />
              <Text style={styles.txDrawer}>Thuốc đã đặt mua</Text>
            </View>
            <TouchableOpacity onPress={() => NavigationService.navigate('setting')} style={styles.viewDrawer}>
              <ScaledImage height={20} source={require('@images/new/profile/ic_settings.png')} />
              <Text style={styles.txDrawer}>Cài đặt</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'flex-end', flex: 1 }}>
              <ScaledImage style={{ right: -20 }} height={200} source={require('@images/new/home/ic_logo_lager.png')}></ScaledImage>
            </View>
          </View>
        </ScrollView>
      </ActivityPanel>
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
  txVersion: { marginLeft: 30, marginTop: 10 },
  imageStyle:{ borderRadius: 30, borderWidth: 1, borderColor: '#fff' },
  styleImgLoad:{ width: 60, height: 60, alignSelf: "center" },
  viewInfo: {
    marginLeft: 10
  },
  viewDrawer: {
    flexDirection: 'row',
    marginLeft: 30,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  txDrawer: {
    marginLeft: 10,
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '600'
  },
  txHello: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 14
  },
  txName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10
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
export default connect(mapStateToProps)(MenuProfile);