import React, { Component, PropTypes } from "react";
import {
  Text,
  StatusBar,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AppState,
  DeviceEventEmitter,
  Alert
} from "react-native";
import { connect } from "react-redux";
import userProvider from "@data-access/user-provider";
import constants from "@resources/strings";
import redux from "@redux-store";
import Home from "@containers/home/tab/Home";
import Account from "@containers/home/tab/Account";
import Videos from "@containers/home/tab/Videos";
import Notification from "@containers/home/tab/Notification";
import Community from "@containers/home/tab/Community";
import PushController from "@components/notification/PushController";
import NotificationBadge from "@components/notification/NotificationBadge";
import ActivityPanel from "@components/ActivityPanel";
import snackbar from "@utils/snackbar-utils";
import { IndicatorViewPager } from "mainam-react-native-viewpager";
import firebase from 'react-native-firebase';
import ScaledImage from 'mainam-react-native-scaleimage'
import NotificationScreen from '@containers/notification/NotificationScreen'
import NavigationService from "@navigators/NavigationService";

const width = Dimensions.get("window").width
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      active: true,
      text: "",
      refreshNotification: 1
    };

  }
  componentDidMount() {
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
    AppState.addEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.addListener(
      "hardwareBackPress",
      this.handleHardwareBack.bind(this)
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
  }
  _handleAppStateChange = (nextAppState) => {
    if (
      nextAppState === 'active'
    ) {
      if (this.props.userApp.isLogin) {
        this.props.dispatch(redux.getUnreadNotificationCount());
        console.log('active');
      }
      else {
        firebase.notifications().setBadge(0);
      }
    }

    this.setState({ appState: nextAppState });
  };
  handleHardwareBack = () => {
    this.props.navigation.pop();
    return true;
  };
  componentWillReceiveProps(newProps) {
    let navigate = newProps.navigation.getParam('navigate', undefined);
    if (this.state.navigate != navigate) {
      this.setState({ navigate }, () => {
        if (navigate) {
          this.props.navigation.navigate(navigate.screen, navigate.params);
        }
      });
    }
  }

  render() {
    const { active } = this.state;
    return (
      <ActivityPanel
        statusbarBackgroundColor="#4BBA7B"
        isLoading={this.state.isLoading}
        hideActionbar={true}
      >
        <Home
          navigation={this.props.navigation}
          style={{ flex: 1 }}
        />
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  tab_selected: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#4BBA7B"
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#4BBA7B"
  },
  tab_label_selected: {
    marginTop: 5,
    fontWeight: "200",
    color: "rgb(2,195,154)",
    fontSize: 15
  },
  tab_label: {
    marginTop: 5,
    color: "#00000044",
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
  },
  countNotificaiton: { overflow: 'hidden', position: 'absolute', right: 25, top: 12, backgroundColor: 'red', borderRadius: 6, color: '#FFF', fontSize: 12, paddingHorizontal: 3, textAlign: 'center' },
});

function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(HomeScreen);
