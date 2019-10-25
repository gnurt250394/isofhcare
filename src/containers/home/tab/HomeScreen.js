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
  FlatList,
  RefreshControl,
  Linking
} from "react-native";
import { connect } from "react-redux";
import constants from "@resources/strings";
import redux from "@redux-store";
import PushController from "@components/notification/PushController";
import ActivityPanel from "@components/ActivityPanel";
import snackbar from "@utils/snackbar-utils";
import ScaledImage from 'mainam-react-native-scaleimage'
import NavigationService from "@navigators/NavigationService";
import appProvider from '@data-access/app-provider';
import { Card, Toast } from "native-base";
const DEVICE_WIDTH = Dimensions.get("window").width;
import * as Animatable from 'react-native-animatable';
import advertiseProvider from "@data-access/advertise-provider";
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      refreshing: false,
      ads0: [],
      features: [
        {
          icon: require("@images/new/home/ic_ticket_news.png"),
          text: "Lấy số",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("selectHealthFacilitiesScreen");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: "selectHealthFacilitiesScreen", param: {} }
              });
          }
        },
        {
          icon: require("@images/new/home/ic_booking_news.png"),
          text: "Đặt khám",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("addBooking1");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: "addBooking1", param: {} }
              });
          }
        },
        {
          icon: require("@images/new/home/ic_question_news.png"),
          text: "Tư vấn",
          onPress: () => {
            this.props.navigation.navigate("listQuestion");
          }
        },
        {
          icon: require("@images/new/home/ic_ehealth_news.png"),
          text: "Y bạ",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("ehealth");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: 'ehealth' }
              });
          }
        }
      ]
    };
  }
  getTopAds(reload) {
    advertiseProvider.getTop(100, (s, e) => {
      if (s) {
        if (s.length == 0) {
          if (!reload)
            this.getTopAds(true);
        }
        this.setState({
          ads: (s || []).filter(x => x.advertise && x.advertise.type == 2 && x.advertise.images),
          ads0: (s || []).filter(x => x.advertise && x.advertise.type == 1 && x.advertise.images)
          // .filter(item => { return item.advertise && item.advertise.images })
        });
      }
      else {
        if (!reload)
          this.getTopAds(true);
      }
      if (e) {
        if (!reload)
          this.getTopAds(true);
      }
    });
  }

  componentDidMount() {
    appProvider.setActiveApp();
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
    // AppState.addEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.addListener(
      "hardwareBackPress",
      this.handleHardwareBack.bind(this)
    );
    this.onRefresh();
  }
  renderAds() {
    return (<View>
      <ScaledImage source={require("@images/new/slogan.jpg")} width={DEVICE_WIDTH} />
      {/* <View style={styles.viewAds}>
        <Text style={styles.txAds}>Ưu đãi</Text>
        <ScaledImage source={require("@images/new/ic_more.png")} width={20} style={styles.imgMore} />
      </View>
      <FlatList
        style={styles.listAds}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        data={this.state.ads}
        ListFooterComponent={<View style={styles.viewFooter}></View>}
        renderItem={({ item, index }) => {
          if (!item || !item.advertise || !item.advertise.images)
            return null;
          return (
            <Card style={styles.cardView}>
              <TouchableOpacity
                onPress={() => {
                  if (item.advertise && item.advertise.value) {
                    Linking.openURL(item.advertise.value);
                  } else {
                    snackbar.show("Url không tồn tại", "danger");
                  }
                }}
              >
                <ScaledImage
                  uri={item.advertise.images.absoluteUrl()}
                  width={DEVICE_WIDTH - 60}
                />
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.txContensAds}>{item.advertise ? item.advertise.title : ""}</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
      /> */}
    </View>)
  }
  pagination() {
    const { ads0, activeSlide } = this.state;
    let length = ads0.length;
    return (
      <View style={styles.viewPagination}>
        <Pagination
          dotsLength={length}
          activeDotIndex={activeSlide || 0}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dotStyle}
          inactiveDotStyle={
            styles.inactiveDotStyle
          }
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={
            styles.containerPagination
          }
        />
      </View>
    );
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.removeAllListeners("hardwareBackPress");
  }
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
  logout() {
    this.props.dispatch(redux.userLogout());
  }

  onRefresh(reload) {
    this.setState({ refreshing: true }, () => {
      advertiseProvider.getTop(100, (s, e) => {
        if (s) {
          if (s.length == 0) {
            if (!reload)
              this.getTopAds(true);
            this.setState({
              refreshing: false,

            })
          }
          this.setState({
            ads: (s || []).filter(x => x.advertise && x.advertise.type == 2 && x.advertise.images),
            ads0: (s || []).filter(x => x.advertise && x.advertise.type == 1 && x.advertise.images),
            refreshing: false,

            // .filter(item => { return item.advertise && item.advertise.images })
          });
        }
        else {
          this.setState({
            refreshing: false,

          })
          if (!reload)
            this.getTopAds(true);
        }
        if (e) {
          this.setState({
            refreshing: false,

          })
          if (!reload)
            this.getTopAds(true);
        }
      });
    })
  }

  getItemWidth() {
    const width = DEVICE_WIDTH - 40;
    if (width >= 320) {
      return Platform.OS == 'ios' ? 70 : 75;
    }

    if (width > 300) {
      return Platform.OS == 'ios' ? 100 : 110;
    }

    if (width > 250)
      return 70;
    return width - 50;
  }

  render() {
    return (
      <ActivityPanel
        statusbarBackgroundColor="#02C39A"
        isLoading={this.state.isLoading}
        hideActionbar={true}
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <ScaledImage source={require("@images/new/home/bg_home_new.png")} width={DEVICE_WIDTH} style={{ position: 'absolute', top: 72, right: 0, left: 0 }} />
          <View style={{ height: 75, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#fff', borderBottomColor: '#7c817f', borderBottomWidth: 0.5 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ScaledImage source={require("@images/new/isofhcare.png")} width={116} />
            </View>
          </View>
          <ScrollView
            refreshControl={<RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingTop: 0
            }}
          >
            <View style={{ padding: 21 }}>
              <Card style={{ borderRadius: 6, marginTop: 130 }}>

                {this.props.userApp.isLogin &&
                  <View style={{ alignItems: 'center', flexDirection: 'row', borderBottomColor: 'rgba(151, 151, 151, 0.29)', borderBottomWidth: 1, paddingVertical: 10, marginHorizontal: 20, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: 'bold', color: "#4a4a4a" }} >Xin chào, <Text style={{ color: 'rgb(255,138,21)' }}>{((name) => {
                      if (!name) return "";
                      let x = name.trim().split(" ");
                      name = (x[x.length - 1]).toLowerCase();
                      if (name[0])
                        return name.charAt(0).toUpperCase() + name.slice(1);
                      return name;
                    }).call(this, this.props.userApp.currentUser.name) + '!'}</Text></Text>
                  </View>
                }

                <View style={{
                  flexDirection: "row", padding: 10, marginVertical: 20, flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  {
                    (this.state.features || []).map((item, position) => {
                      return (
                        <Animatable.View key={position} delay={100} animation={"swing"} direction="alternate">
                          {
                            item.empty ? <View style={{ flex: 1, marginLeft: 5, alignItems: 'center', height: 100, width: this.getItemWidth() }}
                            ></View> :
                              <TouchableOpacity
                                style={{ flex: 1, marginLeft: 5, alignItems: 'center', width: this.getItemWidth() }}
                                onPress={item.onPress}
                              >
                                <View style={{ position: 'relative', padding: 5 }}>
                                  <ScaledImage style={[styles.icon]} source={item.icon} height={48} />
                                </View>
                                <Text style={[styles.label]}>{item.text}</Text>
                              </TouchableOpacity>
                          }
                        </Animatable.View>);
                    })
                  }
                </View>
              </Card>
            </View>
            {
              this.renderAds()
            }
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
        <PushController />
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
=======
  groupImageButton: {
    position: 'relative',
    padding: 5
  },
  button: {
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',

  },
  viewEmpty: {
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
    height: 100,
  },
  activityPanel: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  containerButtonBooking: {
    flexDirection: "row",
    padding: 10,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 5,
  },
  containerButton: {
    flexDirection: "row",
    padding: 30,
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 5,
  },
  colorUserName: {
    color: '#fff',
    paddingLeft: 4,
    fontSize: 18,
    fontWeight: 'bold',

  },
  txtHeaderTitle: {
    marginLeft: 5,
    fontSize: 18,
    color: "#fff"
  },
  containerHeadertitle: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: 'rgba(151, 151, 151, 0.29)',
    // borderBottomColor: '#fff',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 20,
    justifyContent: 'center'
  },
  txBooking: {
    margin: 5,
    marginLeft: 39,
    color: '#000',
    fontWeight: 'bold'
  },
  padding21: { padding: 21,paddingBottom:0 },
  card: { borderRadius: 6, marginTop: 30 },
  viewMenu: { backgroundColor: '#F8F8F8', flex: 1, borderRadius: 5 },
  scroll: {
    flex: 1,
    paddingTop: 0,
  },
  ImageCenter: {
    flex: 1, alignItems: 'center'
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  containerImageLogo: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#7c817f',
    borderBottomWidth: 0.5
  },
  imgHome: {
    position: 'absolute',
    // top: 72,
    right: 0,
    left: 0
  },
>>>>>>> Stashed changes
  icon: {
  },
  label: {
    marginTop: 2, color: '#4A4A4A', fontSize: 15, fontWeight: '600', lineHeight: 20
  },
  subLabel: {
    color: '#9B9B9B', fontSize: 12, textAlign: 'center', marginTop: 5
  },
  viewAds: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  txAds: { padding: 12, paddingLeft: 20, paddingBottom: 5, color: 'rgba(74,74,74,0.6)', fontWeight: '500', flex: 1 },
  imgMore: { marginTop: 10, marginRight: 20 },
  listAds: { paddingHorizontal: 20 },
  viewFooter: { width: 35 },
  cardView: { width: DEVICE_WIDTH - 60, borderRadius: 6, marginRight: 10 },
  txContensAds: { color: '#000', margin: 13 },
  viewPagination: { position: 'absolute', bottom: 0, width: DEVICE_WIDTH },
  dotContainer: { width: 10, margin: 0, padding: 0, height: 10 },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#02c39a",
    paddingHorizontal: 0,
    margin: 0,
    padding: 0
  },
  inactiveDotStyle: {
    // Define styles for inactive dots here
    backgroundColor: "#d8d8d8"
  },
  containerPagination: {
    paddingVertical: 10,
    paddingHorizontal: 0
  },
  viewRender: { flex: 1, position: 'relative' },
  scaledImgRender: { position: 'absolute', top: 72, right: 0, left: 0 },
  viewLogo: { height: 75, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#fff', borderBottomColor: '#7c817f', borderBottomWidth: 0.5 },
  banner: { flex: 1, alignItems: 'center', marginLeft: 45 },
  scrollViewRender: {
    flex: 1,
    paddingTop: 0
  },
  viewCard: { padding: 21 },
  cardRender: { borderRadius: 6, marginTop: 130 },
  viewLogin: { alignItems: 'center', flexDirection: 'row', borderBottomColor: 'rgba(151, 151, 151, 0.29)', borderBottomWidth: 1, paddingVertical: 10, marginHorizontal: 20, justifyContent: 'center' },
  txHello: { marginLeft: 5, fontSize: 18, fontWeight: 'bold', color: "#4a4a4a" },
  txName: { color: 'rgb(255,138,21)' },
  viewFeatures: {
    flexDirection: "row", padding: 10, marginVertical: 20, flexWrap: 'wrap',
    justifyContent: 'center'
  },

});


function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(HomeScreen);
