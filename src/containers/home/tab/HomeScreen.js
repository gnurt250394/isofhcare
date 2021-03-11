import React, {Component, PropTypes} from 'react';
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
  Linking,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import constants from '@resources/strings';
import redux from '@redux-store';
import PushController from '@components/notification/PushController';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import ScaledImage from 'mainam-react-native-scaleimage';
import NavigationService from '@navigators/NavigationService';
import appProvider from '@data-access/app-provider';
import {Card, Toast} from 'native-base';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import advertiseProvider from '@data-access/advertise-provider';
import hospitalProvider from '@data-access/hospital-provider';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import fonts from '@resources/fonts';
import homeProvider from '@data-access/home-provider';
import CategoryHighLight from '@components/home/CategoryHighLight';
import DoctorHighLight from '@components/home/DoctorHighLight';
import HospitalHighLight from '@components/home/HospitalHighLight';
import NewsHighLight from '@components/home/NewsHighLight';
// import InitialVideoCall from "@components/InitialVideoScreen";
import Deeplink from '@components/home/Deeplink';
import CallScreen from '@components/community/CallScreen';
import CallManager from '@components/community/CallManager';
import userProvider from '@data-access/user-provider';
import firebaseUtils from '@utils/firebase-utils';
import bookingProvider from '@data-access/booking-provider';
import profileProvider from '@data-access/profile-provider';
const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgBackground: null,
      ads: [],
      refreshing: false,
      ads0: [],
      listDataHospital: [],
      listDataDoctor: [],
      featuresBooking: [
        {
          icon: require('@images/new/homev2/ic_symptom.png'),
          text: 'Dịch vụ y tế',
          onPress: () => {
            this.props.navigation.navigate('listServices');
            return;
            snackbar.show('Tính năng đang phát triển');
          },
        },
        {
          icon: require('@images/new/homev2/ic_doctor.png'),
          text: 'Bác sĩ',
          onPress: () => {
            this.props.navigation.navigate('listDoctor');
          },
        },
        {
          icon: require('@images/new/homev2/ic_hospital.png'),
          text: 'Cơ sở Y tế',
          onPress: () => {
            this.props.navigation.navigate('selectHospital', {isBooking: true});
          },
        },
        // {
        //   icon: require("@images/new/homev2/ic_specialist.png"),
        //   text: "Chuyên khoa",
        //   onPress: () => {
        //     this.props.navigation.navigate("listSpecialist");
        //     return
        //     snackbar.show('Tính năng đang phát triển')
        //   }
        // },
      ],
      features: [
        {
          icon: require('@images/new/ic_calendar.png'),
          text: 'Lịch hẹn',
          type: 'booking',
          countBooking: 0,
          onPress: () => {
            firebaseUtils.sendEvent('Appointment_screen_home');
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate('listBookingHistory');
            else
              this.props.navigation.navigate('login', {
                nextScreen: {screen: 'listBookingHistory', param: {}},
              });
          },
        },
        {
          icon: require('@images/new/homev2/ic_ehealth.png'),
          text: 'Hồ sơ sức khoẻ',
          onPress: () => {
            firebaseUtils.sendEvent('Healthrecord_screen_home');
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate('listEhealth');
            else
              this.props.navigation.navigate('login', {
                nextScreen: {screen: 'listEhealth'},
              });
          },
        },
        {
          icon: require('@images/new/homev2/ic_advisory.png'),
          text: 'Hỏi bác sĩ',
          free: true,
          onPress: () => {
            firebaseUtils.sendEvent('Askdoctor_screen_home');
            // snackbar.show('Tính năng đang phát triển')
            // return
            // if (this.props.userApp.isLogin)
            this.props.navigation.navigate('listQuestion');
            // else
            //   this.props.navigation.navigate("login", {
            //     nextScreen: { screen: "createQuestionStep1", param: {} }
            //   });
          },
        },
        {
          icon: require('@images/new/covid/ic_covid.png'),
          text: 'Kiểm tra COVID-19',
          onPress: () => {
            firebaseUtils.sendEvent('Covidtest_screen');
            // snackbar.show('Tính năng đang phát triển')
            // return
            this.props.navigation.navigate('introCovid');
          },
        },
        {
          icon: require('@images/new/homev2/ic_icd.png'),
          text: 'Tra cứu mã bệnh',
          onPress: () => {
            firebaseUtils.sendEvent('diseasecode_search_screen');
            this.props.navigation.navigate('searchIcd');

            // this.props.navigation.navigate("videoCall", {
            //   from: this.props.userApp?.currentUser?.id || "",
            //   to: 5640,
            //   isOutgoingCall: true,
            //   isVideoCall: true,
            //   profile: {doctor:{name:'trung'},patient:{name:"hihi"}}
            // });
          },
        },
        {
          icon: require('@images/new/homev2/ic_monitoring.png'),
          text: 'Nhật ký SK',
          new: true,
          onPress: () => {
            firebaseUtils.sendEvent('Healthdairy_Screen');
            // snackbar.show('Tính năng đang phát triển')
            // return
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate('healthMonitoring');
            else
              this.props.navigation.navigate('login', {
                nextScreen: {screen: 'healthMonitoring'},
              });
          },
        },
      ],
      height: 0,
    };
  }

  onCallHotline = () => {
    Linking.openURL('tel:1900299983');
  };
  getSetting = async () => {
    try {
      let res = await appProvider.getSetting();

      this.setState({
        imgBackground: res?.appBackground,
      });
    } catch (error) {}
  };
  getCountHistoryBooking = async () => {
    try {
      let res = await bookingProvider.getCountBooking();
      let data = [...this.state.features];
      if (res) {
        data.forEach(e => {
          if (e.type == 'booking') {
            e.countBooking = res;
          }
        });
      } else {
        data.forEach(e => {
          if (e.type == 'booking') {
            e.countBooking = 0;
          }
        });
      }
      this.setState({
        features: data,
      });
    } catch (error) {
      let data = [...this.state.features];
      data.forEach(e => {
        if (e.type == 'booking') {
          e.countBooking = 0;
        }
      });
      this.setState({
        features: data,
      });
    }
  };
  getDetailUser = async () => {
    try {
      let res = await profileProvider.getDefaultProfile();

      let user = this.props.userApp.currentUser;
      user.fullName = res?.profileInfo?.personal?.fullName;
      user.mobileNumber = res?.profileInfo?.personal?.mobileNumber;
      user.avatar = res?.profileInfo?.personal?.avatar;
      this.props.dispatch(redux.userLogin(user));
    } catch (error) {}
  };
  componentDidMount() {
    this.onFocus = this.props.navigation.addListener('didFocus', () => {
      this.getCountHistoryBooking();
      this.getDetailUser();
    });
    if (constants.route == 'home') {
      this.props.dispatch({
        type: constants.action.create_navigation_global,
        value: this.props.navigation,
      });
      userProvider.getAccountStorage(s => {
        if (s) {
          this.props.dispatch(redux.userLogin(s));
        } else {
          this.props.dispatch(redux.userLogout());
        }
      });
    }
    this.getSetting();
    appProvider.setActiveApp();
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    // AppState.addEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.addListener(
      'hardwareBackPress',
      this.handleHardwareBack.bind(this),
    );
    CallManager.register(this.callRef);
  }

  componentWillUnmount() {
    if (this.onFocus) {
      this.onFocus.remove();
    }
    // AppState.removeEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    CallManager.unregister(this.callRef);
  }
  handleHardwareBack = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillReceiveProps(nextProps) {
    let navigate = nextProps.navigation.getParam('navigate', undefined);
    if (this.state.navigate != navigate) {
      this.setState({navigate}, () => {
        if (navigate) {
          this.props.navigation.navigate(navigate.screen, navigate.params);
        }
      });
    }
  }
  logout() {
    this.props.dispatch(redux.userLogout());
  }

  onRefresh = () => {
    this.getSetting();
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.setState({
          refreshing: false,
        });
      },
    );
  };

  getMarginBooking() {
    const pixel = PixelRatio.get();
    if (pixel >= 2 && DEVICE_WIDTH > 325) {
      return 34;
    }
    if (pixel > 2 && DEVICE_WIDTH < 325) {
      return 14;
    }
  }
  renderButtonBooking() {
    return (this.state.featuresBooking || []).map((item, position) => {
      return (
        <Animatable.View
          key={position}
          delay={100}
          animation={'zoomInUp'}
          style={{
            flex: 1,
            alignItems: 'center',
            borderLeftColor: '#00000060',
            borderLeftWidth: position == 0 ? 0 : 0.6,
          }}
          direction="alternate">
          {item.empty ? (
            <View style={[styles.viewEmpty]} />
          ) : (
            <TouchableOpacity
              style={[styles.buttonBooking, {}]}
              onPress={item.onPress}>
              <View style={{alignItems: 'center'}}>
                <View style={styles.groupImageButton}>
                  <ScaledImage
                    style={[styles.icon]}
                    source={item.icon}
                    height={40}
                  />
                </View>
                <Text style={[styles.label, {fontSize: 15, color: '#3161AD'}]}>
                  {item.text.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Animatable.View>
      );
    });
  }
  getMargin() {
    const pixel = PixelRatio.get();

    if (pixel >= 2 && DEVICE_WIDTH > 325) {
      return 75;
    }
    if (pixel > 2 && DEVICE_WIDTH < 325) {
      return 24;
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

    if (width > 250) return 80;

    return width - 60;
  }
  renderButton = () => {
    return (this.state.features || []).map((item, position) => {
      return (
        <Animatable.View
          key={position}
          delay={100}
          animation={'swing'}
          direction="alternate">
          {item.empty ? (
            <View style={[styles.viewEmpty]} />
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                {marginTop: 10},
                {width: this.getItemWidth()},
              ]}
              onPress={item.onPress}>
              <View style={styles.groupImageButton}>
                <ScaledImage
                  style={[styles.icon]}
                  source={item.icon}
                  height={54}
                />
              </View>
              <Text style={[styles.label, {paddingHorizontal: 10}]}>
                {item.text}
              </Text>
              {item.new ? (
                <View style={[styles.containerNew]}>
                  <Text>Mới</Text>
                </View>
              ) : null}
              {item.free ? (
                <View style={[styles.containerNew]}>
                  <Text>Free</Text>
                </View>
              ) : null}
              {item.countBooking ? (
                <View style={[styles.containerNew, {right: 8}]}>
                  <Text>{item.countBooking}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        </Animatable.View>
      );
    });
  };

  getAdjustedFontSize(size) {
    return Platform.OS == 'ios'
      ? (parseInt(size - 2) * DEVICE_WIDTH * (1.8 - 0.002 * DEVICE_WIDTH)) / 400
      : (parseInt(size) * DEVICE_WIDTH * (1.8 - 0.002 * DEVICE_WIDTH)) / 400;
  }
  refreshControl = () => {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
      />
    );
  };
  getUserName = name => {
    console.log('name: ', name);
    if (!name) return '';
    console.log('name.split?.', name.split?.(' '));
    return name
      .split(/(\s+)/)
      .pop()
      .trim();
  };

  getHeightImage = () => {
    let isIPhoneX = false;

    if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
      isIPhoneX =
        (DEVICE_WIDTH === X_WIDTH && DEVICE_HEIGHT === X_HEIGHT) ||
        (DEVICE_WIDTH === XSMAX_WIDTH && DEVICE_HEIGHT === XSMAX_HEIGHT);
    }
    let statusHeight =
      Platform.OS == 'android' ? StatusBar.currentHeight : isIPhoneX ? 18 : 40;
    let height = DEVICE_WIDTH / 2 - this.state.height + statusHeight;
    if (height >= 0) {
      return height;
    } else {
      return 0;
    }
  };
  onLogin = () => {
    this.props.navigation.navigate('login');
  };
  render() {
    const headerHome = this.state.imgBackground
      ? {uri: this.state.imgBackground}
      : require('@images/app/header.png');
    return (
      <ActivityPanel
        transparent={true}
        isLoading={this.state.isLoading}
        hideActionbar={true}
        showBackgroundHeader={true}
        backgroundStyle={{
          height: DEVICE_WIDTH / 2,
          resizeMode: 'cover',
        }}
        backgroundHeader={headerHome}>
        <View style={styles.container}>
          <ScrollView
            refreshControl={this.refreshControl()}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.scroll, {paddingTop: this.getHeightImage()}]}>
              <View
                onLayout={e => {
                  this.setState({height: e.nativeEvent.layout.height});
                }}
                style={[styles.padding21]}>
                {this.props.userApp.isLogin ? (
                  <View style={styles.containerHeaderTitle}>
                    <ScaledImage
                      source={require('@images/new/homev2/ic_isc_write.png')}
                      height={30}
                      style={styles.scaleImage}
                    />
                    <Text style={styles.txtHeaderTitle}>
                      Xin chào,{' '}
                      <Text style={styles.colorUserName}>
                        {this.getUserName(
                          this.props.userApp.currentUser?.fullName,
                        )}
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <View style={styles.containerHeaderTitle}>
                    <ScaledImage
                      source={require('@images/new/homev2/ic_isc_write.png')}
                      height={30}
                      style={styles.scaleImage}
                    />
                    <TouchableOpacity
                      style={{padding: 5}}
                      onPress={this.onLogin}>
                      <Text style={styles.txtHeaderTitle}>
                        Xin chào,{' '}
                        <Text style={styles.colorUserName}>
                          {'Bạn chưa đăng nhập'}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Card style={styles.card}>
                  <Text style={styles.txBooking}>ĐẶT LỊCH HẸN</Text>
                  <View style={{justifyContent: 'center'}}>
                    <View style={styles.containerButtonBooking}>
                      {this.renderButtonBooking()}
                    </View>
                  </View>
                </Card>
                {/* <View style={styles.viewMenu}> */}

                {/* </View> */}
              </View>
              <View style={styles.containerButton}>{this.renderButton()}</View>
              <HospitalHighLight
                {...this.props}
                refreshing={this.state.refreshing}
              />
              <DoctorHighLight
                {...this.props}
                refreshing={this.state.refreshing}
              />
              <CategoryHighLight
                {...this.props}
                refreshing={this.state.refreshing}
              />
              <NewsHighLight
                {...this.props}
                refreshing={this.state.refreshing}
              />
              <View style={{height: 50, backgroundColor: '#fff'}} />
            </View>
          </ScrollView>
        </View>
        <CallScreen ref={ref => (this.callRef = ref)} />
        <PushController />
        <Deeplink />
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  containerNew: {
    backgroundColor: '#FFE600',
    position: 'absolute',
    right: 0,
    top: -4,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  containerImageDoctor: {
    borderRadius: 6,
    elevation: 4,
    backgroundColor: '#FFF',
    margin: 1,
    width: DEVICE_WIDTH / 3,
    height: 137,
    shadowColor: '#222',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.4,
  },
  groupImageButton: {
    position: 'relative',
    padding: 5,
  },
  button: {
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
    backgroundColor: '#f8f8f8',
  },
  containerButtonBooking: {
    flexDirection: 'row',
    paddingBottom: 10,
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
    // justifyContent: 'center',
    borderRadius: 5,
  },
  containerButton: {
    flexDirection: 'row',
    paddingHorizontal: 21,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
  },
  colorUserName: {
    color: '#fff',
    paddingLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  txtHeaderTitle: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
  },
  containerHeaderTitle: {
    alignItems: 'center',
    // borderBottomColor: '#fff',
    marginHorizontal: 20,
    justifyContent: 'center',
    height: 40,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  txBooking: {
    marginVertical: 10,
    color: '#000',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  padding21: {
    paddingHorizontal: 21,
  },
  card: {borderRadius: 20, paddingHorizontal: 10},
  viewMenu: {backgroundColor: '#F8F8F8', flex: 1, borderRadius: 5},
  scroll: {
    flex: 1,
    // paddingTop: 30,
  },
  ImageCenter: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  containerImageLogo: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#7c817f',
    borderBottomWidth: 0.5,
  },
  imgHome: {
    position: 'absolute',
    // top: 72,
    right: 0,
    left: 0,
  },
  icon: {},
  label: {
    marginTop: 2,
    color: '#4A4A4A',
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    fontSize: 13,
  },
  subLabel: {
    color: '#9B9B9B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  viewAds: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txAds: {
    padding: 12,
    paddingLeft: 20,
    paddingBottom: 5,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
  },
  imgMore: {marginTop: 10, marginRight: 20},
  listAds: {paddingHorizontal: 20},
  viewFooter: {width: 35},
  cardView: {
    borderRadius: 6,
    marginRight: 10,
    borderColor: '#9B9B9B',
    borderWidth: 0.5,
    backgroundColor: '#fff',
    height: 134,
    width: 259,
  },
  cardViewNone: {
    width: DEVICE_WIDTH - 140,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  imgNone: {
    width: DEVICE_WIDTH - 140,
    borderRadius: 6,
    height: 140,
    borderColor: '#9B9B9B',
    borderWidth: 0.5,
  },
  cardViewDoctor: {width: DEVICE_WIDTH / 3, borderRadius: 6, marginRight: 18},
  txContensDoctor: {color: '#000', margin: 13, marginLeft: 5},
  txContensHospital: {color: '#000', margin: 13, marginLeft: 5, maxWidth: 259},
  viewPagination: {position: 'absolute', bottom: 0, width: DEVICE_WIDTH},
  dotContainer: {width: 10, margin: 0, padding: 0, height: 10},
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#02c39a',
    paddingHorizontal: 0,
    margin: 0,
    padding: 0,
  },
  inactiveDotStyle: {
    // Define styles for inactive dots here
    backgroundColor: '#d8d8d8',
  },
  containerPagination: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  viewRender: {flex: 1, position: 'relative'},
  scaledImgRender: {position: 'absolute', top: 72, right: 0, left: 0},
  viewLogo: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#7c817f',
    borderBottomWidth: 0.5,
  },
  banner: {flex: 1, alignItems: 'center', marginLeft: 45},
  scrollViewRender: {
    flex: 1,
    paddingTop: 0,
  },
  viewCard: {padding: 21},
  cardRender: {borderRadius: 6, marginTop: 130},
  viewLogin: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: 'rgba(151, 151, 151, 0.29)',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  txHello: {marginLeft: 5, fontSize: 18, fontWeight: 'bold', color: '#4a4a4a'},
  txName: {color: 'rgb(255,138,21)'},
  viewFeatures: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scaleImage: {
    marginBottom: 8,
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(HomeScreen);
