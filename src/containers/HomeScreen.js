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
import MenuProfile from '@containers/profile/MenuProfile'

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
  componentWillMount() {
    this.props.dispatch({
      type: constants.action.create_navigation_global,
      value: this.props.navigation
    });
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
  logout() {
    this.props.dispatch(redux.userLogout());
  }
  onPageScroll(e) {
    var tabIndex = e.position;
    var offset = e.offset * 100;
    if (tabIndex == -1 || (tabIndex == 1 && offset > 0)) return;
    this.setState({
      tabIndex: tabIndex
    });


  }
  onAction = active => {
    console.log(active, "active");
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
        <View style={[{ flex: 1 }, this.props.style]}>
          {/* <UserInactivity
          timeForInactivity={2000}
          onAction={this.onAction}
          style={[{ flex: 1 }, this.props.style]}
        > */}
          <IndicatorViewPager
            style={{ flex: 1 }}
            ref={viewPager => {
              this.viewPager = viewPager;
            }}
            onPageScroll={this.onPageScroll.bind(this)}
          >
            <View style={{ flex: 1 }}>
              <Home
                navigation={this.props.navigation}
                style={{ flex: 1 }}
              />
            </View>
            {/* <View style={{ flex: 1, backgroundColor: "#000" }} /> */}
            {/* <View style={{ flex: 1, backgroundColor: "#cac" }} /> */}
            {/* <View style={{ flex: 1 }}>
              <Community
              // onLogout={() => {
              //   this.viewPager.setPage(0);
              // }}
              // showLoading={(loading, callback) => {
              //   this.setState({ isLoading: loading }, callback);
              // }}
              />
            </View> */}
            {/* <View style={{ flex: 1 }}>
              <Videos
                onProcess={() => {
                  this.viewPager.setPage(0);
                }}
              // onLogout={() => {
              //   this.viewPager.setPage(0);
              // }}
              // showLoading={(loading, callback) => {
              //   this.setState({ isLoading: loading }, callback);
              // }}
              />
            </View> */}
            <View style={{ flex: 1 }}>
              <MenuProfile
                onLogout={() => {
                  this.viewPager.setPage(0);
                }}
                showLoading={(loading, callback) => {
                  this.setState({ isLoading: loading }, callback);
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <NotificationScreen
                refreshNotification={this.state.refreshNotification}
              // onLogout={() => {
              //   this.viewPager.setPage(0);
              // }}
              // showLoading={(loading, callback) => {
              //   this.setState({ isLoading: loading }, callback);
              // }}
              />
            </View>
          </IndicatorViewPager>


          {/* <Swiper
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
              this.setState({ isLoading: loading }, callback);
            }} />
          </Swiper> */}
          <View style={{}}>
            <View
              style={{
                height: 61,
                flexDirection: "row",
                backgroundColor: "#4BBA7B",
                marginTop: -3,
              }}
            >
              <TouchableOpacity
                style={[
                  this.state.tabIndex == 0 ? styles.tab_selected : styles.tab
                ]}
                onPress={this.swipe.bind(this, 0)}
              >
                <ScaledImage
                  source={require("@images/new/home/ic_home.png")}
                  height={width < 375 ? 20 : 30}
                  style={this.state.tabIndex == 0 ? { tintColor: '#000' } : {}}

                />
              </TouchableOpacity>
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[
                  this.state.tabIndex == 1 ? styles.tab_selected : styles.tab
                ]}
                onPress={() => {
                  snackbar.show('Tính năng đang phát triển');
                }}
              >
                <ScaledImage
                  source={require("@images/new/home/ic_community.png")}
                  // style={this.state.tabIndex == 1 ? { tintColor: '#000' } : {}}

                  height={width < 375 ? 20 : 30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  this.state.tabIndex == 2 ? styles.tab_selected : styles.tab
                ]}
                onPress={() => {
                  snackbar.show('Tính năng đang phát triển');
                }}
              >
                <ScaledImage
                  source={require("@images/new/home/ic_videos.png")}
                  // style={this.state.tabIndex == 2 ? { tintColor: '#000' } : {}}

                  height={width < 375 ? 20 : 30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  this.state.tabIndex == 3 ? styles.tab_selected : styles.tab
                ]}
                onPress={this.swipe.bind(this, 1)}
              >
                <ScaledImage
                  source={require("@images/new/home/ic_account.png")}
                  style={this.state.tabIndex == 1 ? { tintColor: '#000' } : {}}

                  height={width < 375 ? 20 : 30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab_selected, { position: 'relative' }]}
                onPress={this.swipe.bind(this, 2)}
              >
                <ScaledImage source={require("@images/new/home/ic_bell.png")} width={width < 375 ? 20 : 30} style={this.state.tabIndex == 2 ? { tintColor: '#000' } : {}} />
                {
                  this.props.userApp.isLogin && (this.props.userApp.unReadNotificationCount || 0) ?
                    <Text numberOfLines={1} style={styles.countNotificaiton}>{(this.props.userApp.unReadNotificationCount || 0) > 99 ? "99+" : this.props.userApp.unReadNotificationCount}</Text>
                    : null
                }

              </TouchableOpacity>
            </View>
          </View>
          <PushController />
        </View>
      </ActivityPanel>
    );
  }
  swipe(targetIndex) {
     if(targetIndex == 2 && !this.props.userApp.isLogin)
      {NavigationService.navigate("login", {
        nextScreen: { screen: "notification", param: {} }
      }) 
      return  
    }
    if(targetIndex == 1 && !this.props.userApp.isLogin)
      {NavigationService.navigate("login")
      // , {
      //   nextScreen: { screen: "notification", param: {} }
      // }) 
      return  
    }
      this.setState({
        refreshNotification: this.state.refreshNotification+1
      })



    // this.viewPager && this.viewPager.setPage(targetIndex)
    this.viewPager && targetIndex == 2 && !this.props.userApp.isLogin ? this.viewPager && this.viewPager.setPage(0) : this.viewPager && this.viewPager.setPage(targetIndex);

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
