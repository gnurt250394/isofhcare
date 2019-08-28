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
  Alert,
  ScrollView,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import constants from "@resources/strings";
import redux from "@redux-store";
import PushController from "@components/notification/PushController";
import NotificationBadge from "@components/notification/NotificationBadge";
import ActivityPanel from "@components/ActivityPanel";
import snackbar from "@utils/snackbar-utils";
import firebase from 'react-native-firebase';
import ScaledImage from 'mainam-react-native-scaleimage'
import NavigationService from "@navigators/NavigationService";
import appProvider from '@data-access/app-provider';
import Actionbar from '@components/home/Actionbar';
import SlideBanner from '@components/home/SlideBanner';
import TopHospital from '@components/hospital/TopHospital';
import HospitalNearYou from '@components/hospital/HospitalNearYou';
import TopDrug from '@components/drug/TopDrug';
import TopNews from '@components/news/TopNews';
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      active: true,
      text: "",
      refreshNotification: 1,
      refreshing: false,
      countReset: 0,
    };
    this.props.navigation.setParams({ test: 1 })
  }
  componentDidMount() {
    appProvider.setActiveApp();
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
    // AppState.addEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.addListener(
      "hardwareBackPress",
      this.handleHardwareBack.bind(this)
    );
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
  }
  // _handleAppStateChange = (nextAppState) => {
  //   if (
  //     nextAppState === 'active'
  //   ) {
  //     if (this.props.userApp.isLogin) {
  //       this.props.dispatch(redux.getUnreadNotificationCount());
  //       console.log('active');
  //     }
  //     else {
  //       firebase.notifications().setBadge(0);
  //     }
  //   }

  //   this.setState({ appState: nextAppState });
  // };
  handleHardwareBack = () => {
    this.props.navigation.pop();
    return true;
  };
  
  componentWillReceiveProps(nextProps) {
    let navigate = nextProps.navigation.getParam('navigate', undefined);
    if (this.state.navigate != navigate) {
      this.setState({ navigate }, () => {
        if (navigate) {
          this.props.navigation.navigate(navigate.screen, navigate.params);
        }
      });
    }
  }
  handleScroll = (event) => {

  }
  onRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      // let promise = [];
      // promise.push(this.slide.getWrappedInstance().getAds());
      // promise.push(this.slide.getWrappedInstance().getAds());
      // promise.push(this.slide.getWrappedInstance().getAds());
      // promise.push(this.slide.getWrappedInstance().getAds());
      // Promise.all(promise).then(values => {
      //   this.slide.getWrappedInstance().setAds(values[0]);
      //   this.slide.getWrappedInstance().setAds(values[0]);
      //   this.slide.getWrappedInstance().setAds(values[0]);
      //   this.slide.getWrappedInstance().setAds(values[0]);
      //   this.setState({ refreshing: false })
      // })
    })
  }

  render() {
    return (
      <ActivityPanel
        statusbarBackgroundColor="#02C39A"
        isLoading={this.state.isLoading}
        hideActionbar={true}
      >
        <View style={{ flex: 1 }}>
          <Actionbar />
          <View style={{ position: 'relative' }}>
            <View style={{ height: 150, backgroundColor: '#02C39A', position: "absolute", top: 0, left: 0, right: 0 }}></View>
            <ScrollView
              onScroll={this.handleScroll}
              ref={(c) => { this.scroll = c }}
              // refreshControl={<RefreshControl
              //   refreshing={this.state.refreshing}
              //   onRefresh={this.onRefresh}
              // />}>
              >
              <View>
                <SlideBanner ref={ref => this.slide = ref} />
                {/* // countReset={this.state.countReset} /> */}
                {/* <TopHospital countReset={this.state.countReset} />
                <HospitalNearYou countReset={this.state.countReset} />
                <TopDrug countReset={this.state.countReset} />
                <TopNews countReset={this.state.countReset} /> */}
                <View style={{ width: '100%', height: 50 }}></View>
              </View>

            </ScrollView>
          </View>
        </View>
        <PushController />
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  tab_selected: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#02C39A"
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#02C39A"
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

export default HomeScreen;
// function mapStateToProps(state) {
//   return {
//     userApp: state.userApp
//   };
// }
// export default connect(mapStateToProps)(HomeScreen);
