import React, {
  Component
} from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView, Platform, Linking } from 'react-native';
const { width, height } = Dimensions.get('window');
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { NavigationActions } from 'react-navigation'
import ActionBar from '@components/Actionbar';
import constants from '@resources/strings';
import { isIphoneX } from 'react-native-iphone-x-helper';
import redux from '@redux-store';
import ImageLoad from 'mainam-react-native-image-loader';

const resetAction = (routeName) => NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: routeName, drawer: 'close' }),
  ]
});

class DrawerContent extends Component {
  constructor(props) {
    super(props);
  }

  onNavigate(route) {
    this.props.navigation.dispatch(resetAction(route))
  }

  hideDrawer() {
    if (this.props.drawer)
      this.props.drawer.close();
  }

  logout() {
    this.props.dispatch(redux.userLogout());
  }
  login() {
    this.props.navigation.navigate("login");
  }
  render() {
    const icSupport = require("@images/ichotro.png");
    const source = this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : icSupport;
    return (
      <View style={styles.container}>
        <ActionBar icBack={require("@images/icclose.png")} backButtonClick={() => { this.hideDrawer() }} styleBackButton={{ marginLeft: 20 }} actionbarTextColor={[{ color: constants.colors.actionbar_title_color }]} actionbarStyle={[{ paddingTop: isIphoneX() ? 40 : 32, backgroundColor: constants.colors.actionbar_color }, this.props.actionbarStyle, { elevation: 1 }]} />
        <View style={{ width: 250, paddingTop: 10, flex: 1 }}>
          {this.props.userApp.isLogin ?
            <View>
              <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("profile") }}>
                <ImageLoad
                  resizeMode="cover"
                  imageStyle={{ borderRadius: 35 }}
                  borderRadius={35}
                  customImagePlaceholderDefaultStyle={{ width: 70, height: 70, alignSelf: 'center' }}
                  placeholderSource={icSupport}
                  style={{ width: 70, height: 70, alignSelf: 'center' }}
                  resizeMode="cover"
                  loadingStyle={{ size: 'small', color: 'gray' }}
                  source={source}
                  defaultImage={() => {
                    return <ScaleImage resizeMode='cover' source={icSupport} width={70} style={{ width: 70, height: 70, alignSelf: 'center' }} />
                  }}
                />
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 15, color: 'rgb(35,66,155)', marginTop: 18, }}>{this.props.userApp.currentUser.name ? this.props.userApp.currentUser.name.toUpperCase() : ""}</Text>
              </TouchableOpacity>
            </View> : null
          }
          <ScrollView style={{ flex: 1, marginLeft: 60, marginTop: 30 }}>
            {this.props.userApp.isLogin ?
              <View style={{ marginLeft: 30 }}>
                <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("myFacility") }}>
                  <Text style={styles.menu_item_text}>Cơ sở y tế của tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("groupChat") }}>
                  <Text style={styles.menu_item_text}>Tin nhắn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("profile") }}>
                  <Text style={styles.menu_item_text}>Hồ sơ cá nhân</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("notification") }}>
                  <Text style={styles.menu_item_text}>Thông báo</Text>
                </TouchableOpacity> */}
                {/* 
                <TouchableOpacity style={styles.menu_item}>
                  <Text style={styles.menu_item_text}>Ví iSofH care</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu_item}>
                  <Text style={styles.menu_item_text}>Tài khoản KM</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu_item}>
                  <Text style={styles.menu_item_text}>Câu hỏi của bạn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu_item}>
                  <Text style={styles.menu_item_text}>Tin nhắn</Text>
                </TouchableOpacity> */}
              </View> : <TouchableOpacity onPress={() => this.login()} style={{ paddingTop: 10, paddingBottom: 10 }}><Text style={{ color: 'rgb(0,151,124)', fontWeight: 'bold', fontSize: 16 }}>ĐĂNG NHẬP</Text></TouchableOpacity>
            }
            {/* <View style={{ marginLeft: 30 }}>
              <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("listQuestion") }}>
                <Text style={styles.menu_item_text}>Tư vấn online</Text>
              </TouchableOpacity>
            </View> */}
            <View style={{ marginTop: 20, height: 3, backgroundColor: "rgb(234,234,234)", }} />
            <View style={{ marginLeft: 30, marginTop: 20 }}>
              <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("about") }}>
                <Text style={styles.menu_item_text}>Về iSofH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item} onPress={() => {
                if (Platform.OS == "ios") {
                  Linking.openURL('itms-apps://itunes.apple.com/us/app/id1428148423')
                } else {
                  Linking.openURL('market://details?id=com.isofh.isofhcare')
                }
              }}>
                <Text style={styles.menu_item_text}>Đánh giá</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item} onPress={() => {
                Linking.openURL('mailto:support@isofhcare.vn?subject=Hỗ trợ sử dụng app ISofhCare&body=')
              }}>
                <Text style={styles.menu_item_text}>Hỗ trợ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item} onPress={() => {
                Linking.openURL('mailto:support@isofhcare.vn?subject=Báo lỗi quá trình sử dụng app ISofhCare&body=')
              }}>
                <Text style={styles.menu_item_text}>Góp ý báo lỗi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("policy") }}>
                <Text style={styles.menu_item_text}>Chính sách riêng tư</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item} onPress={() => { this.props.navigation.navigate("terms") }}>
                <Text style={styles.menu_item_text}>Điều khoản sử dụng</Text>
              </TouchableOpacity>
              {
                this.props.userApp.isLogin ?
                  <TouchableOpacity style={styles.menu_item} onPress={() => { this.logout() }}>
                    <Text style={styles.menu_item_text}>Đăng xuất</Text>
                  </TouchableOpacity> : null
              }
            </View>
          </ScrollView>
        </View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  menu_item: {
    marginBottom: 10,
    padding: 5
  },
  menu_item_text:
  {
    fontSize: 16, color: 'rgba(0,0,0,0.7)'
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    navigation: state.navigation
  };
}
export default connect(mapStateToProps)(DrawerContent);