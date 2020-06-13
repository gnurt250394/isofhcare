import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
const DEVICE_WIDTH = Dimensions.get("window").width;
import Carousel, { Pagination } from "react-native-snap-carousel";
import advertiseProvider from "@data-access/advertise-provider";
import snackbar from "@utils/snackbar-utils";
import { Card } from "native-base";
import ImageLoad from "mainam-react-native-image-loader";
import clientUtils from "@utils/client-utils";
import objectUtils from "@utils/object-utils";
import ScaledImage from "mainam-react-native-scaleimage";
import redux from "@redux-store";
import ImagePicker from "mainam-react-native-select-image";
import imageProvider from "@data-access/image-provider";
import userProvider from "@data-access/user-provider";
import DeviceInfo from 'react-native-device-info';
import codePushUtils from '@utils/codepush-utils';
import { red } from "ansi-colors";
import constants from '@resources/strings';
import socketProvider from "@data-access/socket-provider";
import firebase from 'react-native-firebase'

class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFigner: false
    };
  }
  showLoading = (loading, callback) => {
    if (this.props.showLoading) {
      this.props.showLoading(loading, callback);
    } else {
      callback();
    }
  }
  selectImage() {
    if (this.imagePicker) {
      this.imagePicker.open(true, 200, 200, image => {
        this.showLoading(true, () => {
          imageProvider
            .upload(image.path, image.mime)
            .then(s => {
              this.showLoading(false, () => {
                if (s && s.data.code == 0) {
                  let user = objectUtils.clone(this.props.userApp.currentUser);
                  user.avatar = s.data.data.images[0].imageLink;
                  this.showLoading(true, () => {
                    userProvider
                      .update(this.props.userApp.currentUser.id, user)
                      .then(s => {
                        this.showLoading(false, () => { });
                        if (s.code == 0) {
                          var user = s.data.user;
                          let current = this.props.userApp.currentUser;
                          user.bookingNumberHospital = current.bookingNumberHospital;
                          user.bookingStatus = current.bookingStatus;
                          user.avatar = s.data.user.avatar
                          this.props.dispatch(redux.userLogin(user));
                        } else {
                          snackbar.show(
                            "Cập nhật ảnh đại diện không thành công",
                            "danger"
                          );
                        }
                      })
                      .catch(e => {
                        this.showLoading(false, () => { });
                        snackbar.show(
                          "Cập nhật ảnh đại diện không thành công",
                          "danger"
                        );
                      });
                  });
                }
              });
            })
            .catch(e => {
              this.showLoading(false, () => { });
              snackbar.show("Upload ảnh không thành công", "danger");
            });
        });
      });
    }
  }
  renderCurrentUserInfo() {
    const icSupport = require("@images/new/user.png");
    const source = this.props.userApp.currentUser.avatar
      ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() }
      : icSupport;
    return (
      <View
        style={styles.viewCurrentUser}
      >
        <TouchableOpacity
          style={styles.btnImage}
          onPress={this.selectImage.bind(this)}
        >
          <ImageLoad
            resizeMode="cover"
            imageStyle={styles.imageStyle}
            borderRadius={35}
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
                  source={icSupport}
                  width={70}
                  style={styles.styleImgLoad}
                />
              );
            }}
          />
          <ScaledImage
            source={require("@images/new/ic_account_add.png")}
            width={20}
            style={styles.scaledImage}
          />
        </TouchableOpacity>
        <View style={styles.viewInfo}>
          <Text style={styles.txUserName}>
            {this.props.userApp.currentUser.name}
          </Text>
          <Text style={styles.txViewProfile}>
            {this.props.userApp.currentUser.phone}
          </Text>
        </View>
      </View>
    );
  }

  navigate_to = (router, params) => () => {
    if (router) {
      this.props.navigation.navigate(router, params);
    } else {
      snackbar.show(constants.msg.app.in_development);
    }

  }
  showSetting = () => {
    this.setState({ showSetting: !this.state.showSetting });
  }
  renderViewUserNotLogin() {
    return (
      <View style={styles.viewUserNotLogin}>
        <View style={styles.viewScaledImg}>
          <ScaledImage
            source={require("@images/logotext.png")}
            width={116}
            height={21}
          />
        </View>
        <TouchableOpacity
          onPress={this.navigate_to("login")}
          style={styles.btnLogin}
        >
          <Text style={styles.txLogin}>{constants.account_screens.signin_or_signup}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  openLink = (link) => () => {
    Linking.openURL(
      link
    );
  }
  openLinkHotline = () => {
    Linking.openURL(
      'tel:1900299983'
    );
  }
  logout = () => {
    this.setState({
      showSetting: false
    }, () => {
      dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_PROFILE, null);
      this.props.dispatch(redux.userLogout());
      if (this.props.onLogout) this.props.onLogout();
    })

  }
  checkUpdate = () => {
    snackbar.show(constants.msg.app.check_update, "success");
    codePushUtils.checkupDate();
  }
  onLogout = async () => {
    console.log(1111)
    try {
      if (Platform.OS == "android") {
        let socket = await socketProvider.connectSocket(this.props.userApp.loginToken)
        let token = await firebase.messaging().getToken()
        socket.emit(constants.socket_type.DISCONNECT, { token, platform: Platform.OS }, (data) => {
          socket.close();
        })
      }


    } catch (error) {
      console.log('error: ', error);

    }
    this.props.dispatch(redux.userLogout());
    if (this.props.onLogout) this.props.onLogout();
  }
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1, }}
        hideActionbar={true}
        showFullScreen={true}
        containerStyle={{ backgroundColor: '#F8F8F8' }}
      >
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.props.userApp.isLogin
            ? this.renderCurrentUserInfo()
            : this.renderViewUserNotLogin()}

          {this.props.userApp.isLogin ? (
            <View>
              {/* <TouchableOpacity
                style={[styles.itemMenu, { marginTop: 40 }]}
                onPress={() => {
                  this.props.navigation.navigate("emptyScreen", {
                    title: "Kích hoạt ví"
                  });
                }}
              >
                <Text style={[styles.itemText, { fontWeight: "bold" }]}>
                  Kích hoạt ví IsofhCare
              </Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/ic_menu_wallet.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity
              style={[styles.itemMenu]}
              onPress={() => {
                this.props.navigation.navigate("ehealth");
              }}
            >
              <Text style={styles.itemText}>Y bạ điện tử</Text>
              <ScaledImage
                source={require("@images/new/ic_menu_ehealth.png")}
                width={24}
                height={24}
              />
            </TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.itemMenu, { marginTop: 40, borderTopColor: "#00000011", borderTopWidth: 1 }]}
                onPress={() => {
                  this.props.navigation.navigate("listProfileUser");
                }}
              >
                <ScaledImage
                  source={require("@images/new/account/ic_profile.png")}
                  width={22}
                  height={22}
                />
                <Text style={styles.itemText}>Thành viên gia đình</Text>
                <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
              </TouchableOpacity>
              <View style={styles.borderMenu}></View>
              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={() => {
                  this.props.navigation.navigate("ehealth");
                }}
              >
                <ScaledImage
                  source={require("@images/new/account/ic_ehealth.png")}
                  width={32}
                  height={32}
                />
                <Text style={styles.itemText}>Y bạ điện tử</Text>
                <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
              </TouchableOpacity>
              <View style={styles.borderMenu}></View>
              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={() => {
                  this.props.navigation.navigate("listBookingHistory", {
                    title: "Lịch khám"
                  });
                }}
              >
                <ScaledImage
                  source={require("@images/new/account/ic_booking.png")}
                  width={24}
                  height={24}
                />
                <Text style={styles.itemText}>Lịch khám</Text>
                <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
              </TouchableOpacity>
              <View style={styles.borderMenu}></View>
              <TouchableOpacity
                style={[styles.itemMenu, { borderBottomColor: "#00000011", borderBottomWidth: 1 }]}
                onPress={() => {
                  snackbar.show("Chức năng đang phát triển");
                }}
              >
                <ScaledImage
                  source={require("@images/new/account/ic_tranfer.png")}
                  width={26}
                  height={26}
                />
                <Text style={styles.itemText}>Lịch sử giao dịch</Text>
                <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={this.navigate_to()}
              >
                <Text style={styles.itemText}>{constants.account_screens.drug_odered}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/profile/ic_drug.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                style={[
                  styles.itemMenu,
                  this.state.showSetting
                    ? { backgroundColor: "rgb(230,249,245)" }
                    : {}
                ]}
                onPress={this.showSetting}
              >
                <Text
                  style={[
                    styles.itemText,
                    this.state.showSetting
                      ? { color: "#000", fontWeight: "bold" }
                      : {}
                  ]}
                >{constants.setting}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/ic_menu_setting.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.itemMenu, { marginVertical: 20, borderTopColor: "#00000011", borderTopWidth: 1, borderBottomColor: "#00000011", borderBottomWidth: 1 }]}
                onPress={() => {
                  this.props.navigation.navigate("changePassword");
                }}
              >
                <ScaledImage
                  source={require("@images/new/account/ic_change_pass.png")}
                  width={26}
                  height={26}
                />
                <Text style={styles.itemText}>Đổi mật khẩu</Text>
                <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.showSetting && (
            <View>

              {
                /* login with finger*/
              }
              {/* <TouchableOpacity
              style={[styles.itemMenu, { paddingLeft: 40 }]}
              onPress={this.onFingerClick}
            >
              <Text style={styles.itemText}>Đăng nhập bằng vân tay</Text>
              <ScaledImage style={{ tintColor: '#008D6F' }}
                source={require("@images/new/fingerprint.png")}
                width={24}
                height={24}
              />
            </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                isVisible={this.state.isFinger}
                // onRequestClose={() => {}}
              >
                <FingerprintPopup
                isLogin = {false}
                  handlePopupDismissed={this.handleFingerprintDismissed}
                  style={styles.popup}
                />
              </Modal> */}
            </View>
          )}
          {/* {
          this.state.showSetting && <TouchableOpacity style={[styles.itemMenu, { paddingLeft: 40 }]}>
            <Text style={styles.itemText}>Đăng nhập vân tay</Text>
            <ScaledImage style={{ tintColor: '#008D6F' }} source={require("@images/new/ic_menu_fingerprint.png")} width={24} height={24} />
          </TouchableOpacity>
        } */}
          <TouchableOpacity
            style={[styles.itemMenu, { borderTopColor: "#00000011", borderTopWidth: 1 }]}
            onPress={() => {
              this.props.navigation.navigate("about");
            }}
          >
            <ScaledImage
              source={require("@images/new/account/ic_about_isc.png")}
              width={24}
              height={24}
            />
            <Text style={styles.itemText}>Về iSofH</Text>
            <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
          </TouchableOpacity>
          <View style={[styles.borderMenu, { width: '95%' }]}></View>
          <TouchableOpacity
            style={[styles.itemMenu]}
            // onPress={() => {
            //   Linking.openURL(
            //     "mailto:cskh@isofhcare.com?subject=Hỗ trợ sử dụng app ISofhCare&body="
            //   );
            // }}
            onPress={this.openLinkHotline}

          ><ScaledImage
              source={require("@images/new/account/ic_support.png")}
              width={24}
              height={24}
            />
            <Text style={styles.itemText}>Hỗ trợ</Text>
            <Text style={{ flex: 1, textAlign: "right", paddingRight: 10 }}>1900299983</Text>
            <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
          </TouchableOpacity>
          <View style={[styles.borderMenu, { width: '95%' }]}></View>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={() => {
              Linking.openURL(
                "mailto:cskh@isofhcare.com?subject=Báo lỗi quá trình sử dụng app ISofhCare&body="
              );
            }}
          ><ScaledImage
              source={require("@images/new/account/ic_report.png")}
              width={24}
              height={24}
            />
            <Text style={styles.itemText}>Báo lỗi</Text>
            <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
          </TouchableOpacity>
          <View style={[styles.borderMenu, { width: '95%' }]}></View>
          <TouchableOpacity
            style={[styles.itemMenu, { borderBottomColor: "#00000011", borderBottomWidth: 1 }]}
            onPress={() => {
              this.props.navigation.navigate("terms");
            }}
          >
            <ScaledImage
              source={require("@images/new/account/ic_rules.png")}
              width={26}
              height={26}
            />
            <Text style={styles.itemText}>Điều khoản sử dụng</Text>
            <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
          </TouchableOpacity>
          {this.props.userApp.isLogin && (
            <TouchableOpacity
              style={[styles.itemMenu, { marginTop: 10, marginVertical: 20, borderTopColor: "#00000011", borderTopWidth: 1, borderBottomColor: "#00000011", borderBottomWidth: 1 }]}
              onPress={this.onLogout}
            >
              <ScaledImage
                source={require("@images/new/account/ic_logout.png")}
                width={24}
                height={24}
              />
              <Text style={styles.itemText}>Đăng xuất</Text>
              <ScaledImage height={10} source={require("@images/new/booking/ic_next.png")} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[{ backgroundColor: '#f8f8f8', paddingTop: 10 }, this.props.userApp.isLogin ? {} : {}]} onPress={() => {
            snackbar.show("Đang kiểm tra cập nhật", "success");
            codePushUtils.checkupDate();
          }}>
            <Text style={[styles.itemText, { color: '#00000080' }]}>{'Phiên bản ' + DeviceInfo.getVersion() + '.' + DeviceInfo.getBuildNumber()}</Text>
          </TouchableOpacity>
          {/* <View style={styles.viewSpaceBottom}>
            <TouchableOpacity onPress={this.openLinkHotline} style={styles.btnHotline}><ScaledImage source={require('@images/new/homev2/ic_hotline.png')} height={20}></ScaledImage><Text style={{ marginLeft: 10, fontSize: 14 }}>Hotline: <Text style={{ fontWeight: 'bold', fontSize: 14 }}>1900299983</Text></Text></TouchableOpacity>
          </View> */}
        </ScrollView>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
      </ActivityPanel>
    );
  }
  handleFingerprintDismissed = () => {
    this.setState({
      isFinger: false
    });
  };
  onFingerClick = () => {
    this.props.navigation.navigate('FingerSettingScreen')
    // this.setState({
    //   isFinger: true
    // });
  };
}
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  icon: {},
  btnHotline: { padding: 5, flexDirection: 'row', alignItems: 'center', marginBottom: 10, },
  popup: {
    width: width * 0.8
  },
  subLabel: {
    color: "#9B9B9B",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5
  },
  itemMenu: {
    flexDirection: "row",
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 15,
    backgroundColor: '#fff'
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 20
  },
  viewCurrentUser: { flexDirection: "row", alignItems: "center", marginTop: 30, borderTopColor: "#00000011", borderTopWidth: 1, borderBottomWidth: 1, borderBottomColor: '#00000011', paddingVertical: 20, paddingLeft: 25, paddingRight: 15, backgroundColor: '#fff' },
  txUserName: { color: "#000000", fontSize: 18, fontWeight: 'bold' },
  viewInfo: { flex: 1, marginLeft: 20 },
  txViewProfile: { color: 'gray', marginTop: 5 },
  btnImage: { position: "relative" },
  imageStyle: { borderRadius: 35, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
  customImagePlace: {
    width: 70,
    height: 70,
    alignSelf: "center"
  },
  styleImgLoad: { width: 70, height: 70, alignSelf: "center" },
  scaledImage: { position: "absolute", bottom: 0, right: 0 },
  viewUserNotLogin: { alignItems: "center", marginTop: 30 },
  viewScaledImg: { marginBottom: 30 },
  btnLogin: {
    padding: 18,
    backgroundColor: "#02C39A",
    borderRadius: 5,
    width: 270,
    marginBottom: 20,
    marginTop: 20
  },
  txLogin: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17
  },
  styleScrollView: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#F8F8F8'
  },
  txVersion: { marginLeft: 10, marginTop: 10 },
  viewSpaceBottom: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  borderMenu: { width: '85%', height: 1, backgroundColor: '#00000011', alignSelf: 'flex-end' }

});

function mapStateToProps(state) {
  return {
    // navigation: state.navigation,
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(AccountScreen);
