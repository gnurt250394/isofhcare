import React, { Component, PropTypes } from "react";
import {
  Text,
  StatusBar,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter
} from "react-native";
import { connect } from "react-redux";
import userProvider from "@data-access/user-provider";
import constants from "@resources/strings";
import redux from "@redux-store";
import Home from "@containers/home/tab/Home";
import Account from "@containers/home/tab/Account";
import TabSearch from "@containers/home/tab/TabSearch";
import Swiper from "react-native-swiper";
const { width, height } = Dimensions.get("window");
import PushController from "@components/notification/PushController";
import NotificationBadge from "@components/notification/NotificationBadge";
import ActivityPanel from "@components/ActivityPanel";
import ScaledImage from "../../node_modules/mainam-react-native-scaleimage";
import snackbar from '@utils/snackbar-utils';
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    }
  }
  componentWillMount() {
    this.props.dispatch({
      type: constants.action.create_navigation_global,
      value: this.props.navigation
    });
  }
  componentDidMount() {
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
    DeviceEventEmitter.addListener(
      "hardwareBackPress",
      this.handleHardwareBack.bind(this)
    );
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
  }

  handleHardwareBack = () => {
    this.props.navigation.pop();
    return true;
  };
  logout() {
    this.props.dispatch(redux.userLogout());
  }

  render() {
    return (
      <ActivityPanel isLoading={this.state.isLoading} hideActionbar={true}>
        <View
          style={[{ flex: 1 }, this.props.style]}
        >
          <Swiper
            ref={ref => (this.swiper = ref)}
            onIndexChanged={index => {
              this.setState({ tabIndex: index });
            }}
            dot={<View />}
            activeDot={<View />}
            paginationStyle={{
              bottom: 30
            }}
            loop={false}
            style={{ flex: 1 }}
          >
            <Home
              navigation={this.props.navigation}
              style={{ flex: 1 }}
            />
            <View style={{ flex: 1, backgroundColor: "#000" }} />
            <View style={{ flex: 1, backgroundColor: "#cac" }} />
            <Account showLoading={(loading, callback) => {
              debugger;
              this.setState({ isLoading: loading }, callback);
            }} />
          </Swiper>
          <View style={{
          }}>
            < View style={{
              height: 61, flexDirection: "row", backgroundColor: '#ffffff',
              shadowColor: 'rgba(0, 0, 0, 0.09)',
              shadowOffset: {
                width: 0,
                height: 0
              },
              shadowRadius: 4,
              shadowOpacity: 1,
              marginTop: -3,
              elevation: 5
            }}>
              <TouchableOpacity
                style={[this.state.tabIndex == 0 ? styles.tab_selected : styles.tab]}
                onPress={this.swipe.bind(this, 0)}
              >
                <ScaledImage source={this.state.tabIndex == 0 ? require("@images/new/ic_home_home1.png") : require("@images/new/ic_home_home0.png")} width={20} />
                <Text style={[this.state.tabIndex == 0 ? styles.tab_label_selected : styles.tab_label]}>Trang chủ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.state.tabIndex == 1 ? styles.tab_selected : styles.tab]}
                onPress={this.swipe.bind(this, 1)}
              >
                <ScaledImage source={this.state.tabIndex == 1 ? require("@images/new/ic_home_booking1.png") : require("@images/new/ic_home_booking0.png")} height={20} />
                <Text style={[this.state.tabIndex == 1 ? styles.tab_label_selected : styles.tab_label]}>Lịch khám</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.state.tabIndex == 2 ? styles.tab_selected : styles.tab]}
                onPress={this.swipe.bind(this, 2)}
              >
                <ScaledImage source={this.state.tabIndex == 2 ? require("@images/new/ic_home_service1.png") : require("@images/new/ic_home_service0.png")} height={20} />
                <Text style={[this.state.tabIndex == 2 ? styles.tab_label_selected : styles.tab_label]}>Dịch vụ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.state.tabIndex == 3 ? styles.tab_selected : styles.tab]}
                onPress={this.swipe.bind(this, 3)}
              >
                <ScaledImage source={this.state.tabIndex == 3 ? require("@images/new/ic_home_account1.png") : require("@images/new/ic_home_account0.png")} height={20} />
                <Text style={[this.state.tabIndex == 3 ? styles.tab_label_selected : styles.tab_label]}>Tài khoản</Text>
              </TouchableOpacity>
            </View>
          </View >
          <PushController />
        </View>
      </ActivityPanel>
    );
  }
  swipe(targetIndex) {
    const currentIndex = this.swiper.state.index;
    const offset = targetIndex - currentIndex;
    this.swiper.scrollBy(offset);
  }
}

const styles = StyleSheet.create({
  tab_selected:
  {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#02c39a11'
  },
  tab:
  {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#FFF'
  },
  tab_label_selected:
  {
    marginTop: 5,
    fontWeight: '500',
    color: 'rgb(2,195,154)',
    fontSize: 15
  },
  tab_label:
  {
    marginTop: 5,
    color: '#00000044',
    fontSize: 14
  },
  picture: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover"
  }
});

function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(HomeScreen);
