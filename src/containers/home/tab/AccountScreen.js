import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import Dimensions from "Dimensions";
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
import constants from "@resources/strings";
import dataCacheProvider from '@data-access/datacache-provider';

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
            .upload(image.path)
            .then(s => {
              this.showLoading(false, () => {
                if (s && s.data.code == 0) {
                  let user = objectUtils.clone(this.props.userApp.currentUser);
                  user.avatar = s.data.data.images[0].thumbnail;
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
        <View style={styles.viewInfo}>
          <Text style={styles.txUserName}>
            {this.props.userApp.currentUser.name}
          </Text>
          {/* <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('detailsProfile')
            }}
          >
            <Text style={styles.txViewProfile}>
              Xem hồ sơ cá nhân
            </Text>
          </TouchableOpacity> */}
        </View>
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
  logout = () => {
    dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_PROFILE, null);
    this.props.dispatch(redux.userLogout());
    if (this.props.onLogout) this.props.onLogout();
  }
  checkUpdate = () => {
    snackbar.show(constants.msg.app.check_update, "success");
    codePushUtils.checkupDate();
  }
  render() {
    return (
      <ActivityPanel hideActionbar={true} hideStatusbar={true} >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.styleScrollView}
        >
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
                style={[styles.itemMenu, { marginTop: 40 }]}
                onPress={this.navigate_to('listProfileUser')}
              >
                <Text style={styles.itemText}>{constants.account_screens.my_family}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/profile/ic_family.png")}
                  width={30}
                  height={30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={this.navigate_to('ehealth')}
              >
                <Text style={styles.itemText}>{constants.account_screens.medical_records}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/ic_menu_ehealth.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={this.navigate_to()}
              >
                <Text style={styles.itemText}>{constants.account_screens.pay_history}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/profile/ic_history.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity> */}
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
              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={this.navigate_to("patientHistory", { title: "Lịch khám" })}
              >
                <Text style={styles.itemText}>{constants.account_screens.examination_schedule}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/ic_menu_list_booking.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.showSetting && (
            <View>
              <TouchableOpacity
                style={[styles.itemMenu, { paddingLeft: 40 }]}
                onPress={this.navigate_to('changePassword')}
              >
                <Text style={styles.itemText}>{constants.account_screens.forgot_password}</Text>
                <ScaledImage style={{ tintColor: '#008D6F' }}
                  source={require("@images/new/ic_menu_change_password.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity>
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
            style={[styles.itemMenu]}
            onPress={this.navigate_to('about')}
          >
            <Text style={styles.itemText}>{constants.account_screens.about_isofh}</Text>
            <ScaledImage style={{ tintColor: '#008D6F' }}
              source={require("@images/new/ic_menu_aboutus.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={this.openLink("mailto:support@isofhcare.vn?subject=Hỗ trợ sử dụng app iSofHcare&body=")}
          >
            <Text style={styles.itemText}>{constants.account_screens.support}</Text>
            <ScaledImage style={{ tintColor: '#008D6F' }}
              source={require("@images/new/ic_menu_support.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={this.openLink("mailto:support@isofhcare.vn?subject=Báo lỗi quá trình sử dụng app iSofHcare&body=")}
          >
            <Text style={styles.itemText}>{constants.account_screens.report}</Text>
            <ScaledImage style={{ tintColor: '#008D6F' }}
              source={require("@images/new/ic_menu_feedback.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={this.navigate_to('terms')}
          >
            <Text style={styles.itemText}>{constants.account_screens.terms_of_use}</Text>
            <ScaledImage style={{ tintColor: '#008D6F' }}
              source={require("@images/new/ic_menu_terms.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          {this.props.userApp.isLogin && (
            <TouchableOpacity
              style={[styles.itemMenu]}
              onPress={this.logout}
            >
              <Text style={styles.itemText}>{constants.account_screens.logout}</Text>
              <ScaledImage style={{ tintColor: '#008D6F' }}
                source={require("@images/new/ic_menu_logout.png")}
                width={24}
                height={24}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.itemMenu, { borderBottomWidth: 0 }]} onPress={this.checkUpdate}>
            <Text style={[styles.itemText, { color: '#00000080' }]}>{'Phiên bản ' + DeviceInfo.getVersion() + '.' + DeviceInfo.getBuildNumber()}</Text>
          </TouchableOpacity>
          <View style={styles.viewSpaceBottom} />
          <ImagePicker ref={ref => (this.imagePicker = ref)} />
        </ScrollView>
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
  label: {
    marginTop: 2,
    color: "#4A4A4A",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23
  },
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
    borderBottomColor: "#00000011",
    borderBottomWidth: 0.7,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  itemText: {
    flex: 1,
    fontWeight: "400",
    fontWeight: 'bold',
    fontSize: 15,
    color: '#008D6F'
  },
  viewCurrentUser: { flexDirection: "row", alignItems: "center", marginTop: 30 },
  txUserName: { color: "#000000", fontSize: 20 },
  viewInfo: { flex: 1 },
  txViewProfile: { color: "#008D6F", marginTop: 10 },
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
    paddingHorizontal: 20,
    paddingTop: 20
  },
  txVersion: { marginLeft: 10, marginTop: 10 },
  viewSpaceBottom: { height: 100 }


});

function mapStateToProps(state) {
  return {
    // navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(AccountScreen);
