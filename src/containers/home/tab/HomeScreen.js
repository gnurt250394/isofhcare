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
  PixelRatio,
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
import hospitalProvider from '@data-access/hospital-provider';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      refreshing: false,
      ads0: [],
      listDataHospital: [],
      featuresBooking: [
        {
          icon: require("@images/new/homev2/ic_specialist.png"),
          text: "Chuyên khoa",
          onPress: () => {
            snackbar.show('Tính năng đang phát triển')
          }
        },
        {
          icon: require("@images/new/homev2/ic_doctor.png"),
          text: "Bác sĩ",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("listDoctor");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: "listDoctor", param: {} }
              });
          }
        },
        {
          icon: require("@images/new/homev2/ic_hospital.png"),
          text: "Cơ sở Y tế",
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
          icon: require("@images/new/homev2/ic_symptom.png"),
          text: "Triệu chứng",
          onPress: () => {
            snackbar.show('Tính năng đang phát triển')
          }
        }
      ],
      features: [
        {
          icon: require("@images/new/homev2/ic_get_ticket.png"),
          text: "Lấy số khám",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("getTicket");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: "getTicket", param: {} }
              });
          }
        },
        {
          icon: require("@images/new/homev2/ic_advisory.png"),
          text: "Tư vấn",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("listQuestion");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: "listQuestion", param: {} }
              });
          }
        },
        {
          icon: require("@images/new/homev2/ic_ehealth.png"),
          text: "Y bạ điện tử",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("ehealth");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: 'ehealth' }
              });
          }
        },
        {
          icon: require("@images/new/homev2/ic_voucher.png"),
          text: "Mã ưu đãi",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("myVoucher");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: 'myVoucher' }
              });
          }
        },
        {
          icon: require("@images/new/homev2/ic_drug.png"),
          text: "Thuốc",
          onPress: () => {
            snackbar.show('Tính năng đang phát triển')
          }
        },
        {
          icon: require("@images/new/homev2/ic_more_info.png"),
          text: "Nhiều hơn",
          onPress: () => {
            snackbar.show('Tính năng đang phát triển')
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
  onCallHotline = () => {
    Linking.openURL('tel:1900299983')
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
    this.onGetHospital()
  }
  renderDoctor() {
    return (<View style={{ backgroundColor: '#fff', marginTop: 10 }}>
      {/* <ScaledImage source={require("@images/new/slogan.jpg")} width={DEVICE_WIDTH} />
      <TouchableOpacity onPress={this.onCallHotline} style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18, color: '#02c39a', fontWeight: 'bold' }}>Tổng đài hỗ trợ: 1900299983</Text></TouchableOpacity> */}
      <View style={styles.viewAds}>
        <Text style={styles.txAds}>CÁC BÁC SĨ HÀNG ĐẦU</Text>
        {/* <ScaledImage source={require("@images/new/ic_more.png")} width={20} style={styles.imgMore} /> */}
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
            <View style={styles.cardViewDoctor}>
              <Card style={{ borderRadius: 5 }}>
                <ScaledImage
                  // uri={item.advertise.images.absoluteUrl()}
                  style={{ borderRadius: 5 }}
                  source={require('@images/new/homev2/doctor_demo.png')}
                  width={DEVICE_WIDTH / 3}
                />
              </Card>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.txContensAds}>{item.advertise ? item.advertise.title : ""}</Text>

            </View>
          );
        }}
      />
    </View>)
  }
  renderHospital() {
    let { listDataHospital } = this.state
    return (<View style={{ backgroundColor: '#fff', marginTop: 10 }}>
      {/* <ScaledImage source={require("@images/new/slogan.jpg")} width={DEVICE_WIDTH} />
      <TouchableOpacity onPress={this.onCallHotline} style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18, color: '#02c39a', fontWeight: 'bold' }}>Tổng đài hỗ trợ: 1900299983</Text></TouchableOpacity> */}
      <View style={styles.viewAds}>
        <Text style={styles.txAds}>CƠ SỞ Y TẾ HÀNG ĐẦU</Text>
        {/* <ScaledImage source={require("@images/new/ic_more.png")} width={20} style={styles.imgMore} /> */}
      </View>
      <FlatList
        style={styles.listAds}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        data={listDataHospital}
        ListFooterComponent={<View style={styles.viewFooter}></View>}
        renderItem={({ item, index }) => {
          if (!item || !item.imageHome)
            return (
              <View style={styles.cardViewNone}>
                <TouchableOpacity>
                  <View style={styles.imgNone}></View>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.txContensAds}>{item ? item.name : ""}</Text>
                </TouchableOpacity>
              </View>
            );
          return (
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.cardView}>
                <ScaledImage
                  uri={item.imageHome.absoluteUrl()}
                  height={140}
                  style={{ borderRadius: 6, resizeMode: 'cover' }}
                />
              </TouchableOpacity>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.txContensAds}>{item ? item.name : ""}</Text>
            </View>
          );
        }}
      />
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
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={styles.containerPagination}
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
  getMarginBooking() {
    const pixel = PixelRatio.get()
    if (pixel >= 2 && DEVICE_WIDTH > 325) {
      return 34
    }
    if (pixel > 2 && DEVICE_WIDTH < 325) {
      return 14
    }
  }
  // getItemBookingWidth() {
  //   const width = DEVICE_WIDTH - 40;
  //   
  //   if (width >= 320) {
  //     return Platform.OS == 'ios' ? '30%' : '30%';
  //   }

  //   if (width > 300) {
  //     return Platform.OS == 'ios' ? 100 : 110;
  //   }

  //   if (width > 250)
  //     return 65;

  //   return width - 50;
  // }
  renderButtonBooking() {
    return (this.state.featuresBooking || []).map((item, position) => {
      return (
        <Animatable.View key={position} delay={100} animation={"zoomInUp"} style={{width:'25%',alignItems:'center'}} direction="alternate">
          {
            item.empty ? <View style={[styles.viewEmpty,]}
            ></View> :
              <TouchableOpacity
                style={[styles.buttonBooking, {},]}
                onPress={item.onPress}
              >
                <View style={{ alignItems: 'center' }}><View style={styles.groupImageButton}>
                  <ScaledImage style={[styles.icon]} source={item.icon} height={30} />
                </View>
                  <Text style={[styles.label, { fontSize: this.getAdjustedFontSize(12) }]}>{item.text}</Text></View>
              </TouchableOpacity>

          }
        </Animatable.View>);
    })
  }
  getMargin() {
    const pixel = PixelRatio.get()

    if (pixel >= 2 && DEVICE_WIDTH > 325) {
      return 75
    }
    if (pixel > 2 && DEVICE_WIDTH < 325) {
      return 24
    }
  }
  getItemWidth() {
    const width = DEVICE_WIDTH - 40;
    if (width >= 320) {
      return Platform.OS == 'ios' ? 95 : 95;
    }

    if (width > 300) {
      return Platform.OS == 'ios' ? 110 : 120;
    }

    if (width > 250)
      return 80;

    return width - 60;
  }
  renderButton = () => {
    return (this.state.features || []).map((item, position) => {
      return (
        <Animatable.View key={position} delay={100} animation={"swing"} direction="alternate">
          {
            item.empty ? <View style={[styles.viewEmpty]}
            ></View> :
              <TouchableOpacity
                style={[styles.button, { marginTop: 10, }, { width: this.getItemWidth() },]}
                onPress={item.onPress}
              >
                <View style={styles.groupImageButton}>
                  <ScaledImage style={[styles.icon]} source={item.icon} height={54} />
                </View>
                <Text style={[styles.label, { fontSize: this.getAdjustedFontSize(12) }]}>{item.text}</Text>
              </TouchableOpacity>

          }
        </Animatable.View>);
    })
  }
  onGetHospital = () => {
    // hospitalProvider.getBySearch(1, 10, '', -1).then(res => {
    //   if (res.code == 0) {
    //     this.setState({
    //       hospital: res.data.data
    //     })
    //   }
    //   
    // })
    hospitalProvider.getListTopRateHospital().then(res => {
      this.setState({
        listDataHospital: res.slice(0, 10)
      })
    }).catch(err => {

    })
  }
  getAdjustedFontSize(size) {
    return Platform.OS == 'ios' ? parseInt(size - 2) * DEVICE_WIDTH * (1.8 - 0.002 * DEVICE_WIDTH) / 400 : parseInt(size) * DEVICE_WIDTH * (1.8 - 0.002 * DEVICE_WIDTH) / 400;
  }
  refreshControl = () => {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh.bind(this)}
      />
    )
  }
  getUserName = (name) => {
    if (!name) return "";
    let x = name.trim().split(" ");
    name = (x[x.length - 1]).toLowerCase();
    if (name[0])
      return name.charAt(0).toUpperCase() + name.slice(1);
    return name;
  }
  render() {
    return (
      <ActivityPanel
        isLoading={this.state.isLoading}
        hideActionbar={true}
        containerStyle={{ backgroundColor: '#f2f2f2' }}
        style={styles.activityPanel}
      >
        <View style={styles.container}>
          {/* <View style={{ height: 150, backgroundColor: '#f2f2f2', position: "absolute", top: 300, left: 0, right: 0 }}></View> */}
          <ScaledImage source={require("@images/new/homev2/header_home.png")} width={DEVICE_WIDTH} style={styles.imgHome} />
          {/*   <View style={styles.containerImageLogo}>
        <View style={styles.ImageCenter}>
              <ScaledImage source={require("@images/new/isofhcare.png")} width={116} />
            </View> 
          </View>*/}

          <ScrollView
            refreshControl={this.refreshControl()}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <View style={styles.padding21}>
              {this.props.userApp.isLogin ?
                <View style={styles.containerHeadertitle}>
                  <Text
                    style={styles.txtHeaderTitle}
                  >Xin chào, </Text>
                  <Text style={styles.colorUserName}>{this.getUserName(this.props.userApp.currentUser.name) + '!'}</Text>
                </View> : <View style={styles.containerHeadertitle}>
                </View>}
              <Card style={styles.card}>
                <Text style={styles.txBooking}>ĐẶT KHÁM ONLINE</Text>
                <View style={{ justifyContent: 'center' }}>
                  <View style={styles.containerButtonBooking}>
                    {this.renderButtonBooking()}
                  </View>
                </View>
              </Card>
              {/* <View style={styles.viewMenu}> */}

              {/* </View> */}
            </View>
            <View style={styles.containerButton}>
              {this.renderButton()}
            </View>
            {
              this.renderDoctor()
            }
            {
              this.renderHospital()
            }
            <View style={{ height: 50, backgroundColor: '#fff' }} />
          </ScrollView>
        </View>
        <PushController />
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  groupImageButton: {
    position: 'relative',
    padding: 5
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  buttonBooking: {
    // flex: 1,
    alignItems: 'flex-start',
  },
  viewEmpty: {
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
    height: 100,
  },
  activityPanel: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  containerButtonBooking: {
    flexDirection: "row",
    paddingBottom: 10,
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
    // justifyContent: 'center',
    borderRadius: 5,
  },
  containerButton: {
    flexDirection: "row",
    padding: 21,
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    borderRadius: 5,
    backgroundColor: '#f2f2f2'
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
    // borderBottomColor: '#fff',
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  txBooking: {
    marginVertical: 10,
    color: '#000',
    marginLeft: 16,
    fontWeight: 'bold'
  },
  padding21: { padding: 21, paddingBottom: 0 },
  card: { borderRadius: 6, marginTop: 10, paddingHorizontal: 10 },
  viewMenu: { backgroundColor: '#F8F8F8', flex: 1, borderRadius: 5 },
  scroll: {
    flex: 1,
    paddingTop: 30,
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
  icon: {
  },
  label: {
    marginTop: 2, color: '#4A4A4A', fontWeight: '600', lineHeight: 20
  },
  subLabel: {
    color: '#9B9B9B', fontSize: 12, textAlign: 'center', marginTop: 5
  },
  viewAds: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
  txAds: { padding: 12, paddingLeft: 20, paddingBottom: 5, color: '#000', fontWeight: 'bold', flex: 1 },
  imgMore: { marginTop: 10, marginRight: 20 },
  listAds: { paddingHorizontal: 20, flex: 1 },
  viewFooter: { width: 35 },
  cardView: { width: DEVICE_WIDTH - 140, borderRadius: 6, marginRight: 10, borderColor: '#9B9B9B', borderWidth: 0.5, backgroundColor: '#fff', height: 140, flex: 1 },
  cardViewNone: { width: DEVICE_WIDTH - 140, borderRadius: 6, marginRight: 10, backgroundColor: '#fff' },
  imgNone: { width: DEVICE_WIDTH - 140, borderRadius: 6, height: 140, borderColor: '#9B9B9B', borderWidth: 0.5 },
  cardViewDoctor: { width: DEVICE_WIDTH / 3, borderRadius: 6, marginRight: 10 },
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
