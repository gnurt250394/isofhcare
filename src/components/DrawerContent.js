import React, {
  Component
} from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
const { width, height } = Dimensions.get('window');
import ScaleImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { NavigationActions } from 'react-navigation'
import ActionBar from '@components/Actionbar';
import constants from '@resources/strings';
import { isIphoneX } from 'react-native-iphone-x-helper';
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
  render() {

    return (
      <View style={styles.container}>
        <ActionBar icBack={require("@images/icclose.png")} backButtonClick={() => { this.hideDrawer() }} styleBackButton={{ marginLeft: 20 }} actionbarTextColor={[{ color: constants.colors.actionbar_title_color }]} actionbarStyle={[{ paddingTop: isIphoneX() ? 40 : 32, backgroundColor: constants.colors.actionbar_color }, this.props.actionbarStyle]} />
        <View style={{ width: 250, paddingTop: 10, flex: 1 }}>
          <ScaleImage source={require("@images/ichotro.png")} width={70} style={{ alignSelf: 'center', }} />
          <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 15, color: 'rgb(35,66,155)', marginTop: 18 }}>BÙI NGỌC HOA</Text>
          <ScrollView style={{ flex: 1, marginLeft: 60, marginTop: 30 }}>
            <View style={{ marginLeft: 30 }}>
              <TouchableOpacity style={styles.menu_item}>
                <Text style={styles.menu_item_text}>Hồ sơ cá nhân</Text>
              </TouchableOpacity>
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
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20, height: 3, backgroundColor: "rgb(234,234,234)", }} />
            <View style={{ marginLeft: 30, marginTop: 20 }}>
              <TouchableOpacity style={styles.menu_item}>
                <Text style={styles.menu_item_text}>Về iSofH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item}>
                <Text style={styles.menu_item_text}>Đánh giá</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item}>
                <Text style={styles.menu_item_text}>Hỗ trợ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item}>
                <Text style={styles.menu_item_text}>Điều khoản sử dụng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu_item}>
                <Text style={styles.menu_item_text}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

      </View>
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

export default DrawerContent;