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
import FingerprintPopup from "../../account/FingerprintPopup";
import Modal from "@components/modal";
import DeviceInfo from 'react-native-device-info';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFigner: false
    };
  }
  showLoading(loading, callback) {
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
                        this.showLoading(false);
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
                        this.showLoading(false);
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
              this.showLoading(false);
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
        style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#000000", fontSize: 20 }}>
            {this.props.userApp.currentUser.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('detailsProfile')
            }}
          >
            <Text style={{ color: "#008D6F", marginTop: 10 }}>
              Xem hồ sơ cá nhân
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={this.selectImage.bind(this)}
        >
          <ImageLoad
            resizeMode="cover"
            imageStyle={{ borderRadius: 35, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
            borderRadius={35}
            customImagePlaceholderDefaultStyle={{
              width: 70,
              height: 70,
              alignSelf: "center"
            }}
            placeholderSource={icSupport}
            style={{ width: 70, height: 70, alignSelf: "center" }}
            resizeMode="cover"
            loadingStyle={{ size: "small", color: "gray" }}
            source={source}
            defaultImage={() => {
              return (
                <ScaledImage
                  resizeMode="cover"
                  source={icSupport}
                  width={70}
                  style={{ width: 70, height: 70, alignSelf: "center" }}
                />
              );
            }}
          />
          <ScaledImage
            source={require("@images/new/ic_account_add.png")}
            width={20}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  renderViewUserNotLogin() {
    return (
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <View style={{ marginBottom: 30 }}>
          <ScaledImage
            source={require("@images/logotext.png")}
            width={116}
            height={21}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("login");
          }}
          style={{
            padding: 18,
            backgroundColor: "#02C39A",
            borderRadius: 5,
            width: 270,
            marginBottom: 20,
            marginTop: 20
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17
            }}
          >
            Đăng nhập/ Đăng Ký
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <ActivityPanel hideActionbar={true} hideStatusbar={true} >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: 0,
            paddingHorizontal: 20,
            paddingTop: 20
          }}
        >
          {this.props.userApp.isLogin
            ? this.renderCurrentUserInfo()
            : this.renderViewUserNotLogin()}

          {this.props.userApp.isLogin ? (
            <View>
              <TouchableOpacity
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
                <ScaledImage
                  source={require("@images/new/ic_menu_wallet.png")}
                  width={24}
                  height={24}
                />
              </TouchableOpacity>
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
                style={[styles.itemMenu]}
                onPress={() => {
                  this.props.navigation.navigate("PatientHistoryScreen", {
                    title: "Lịch khám"
                  });
                }}
              >
                <Text style={styles.itemText}>Lịch khám</Text>
                <ScaledImage
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
                onPress={() => {
                  this.setState({ showSetting: !this.state.showSetting });
                }}
              >
                <Text
                  style={[
                    styles.itemText,
                    this.state.showSetting
                      ? { color: "#000", fontWeight: "bold" }
                      : {}
                  ]}
                >
                  Cài đặt
              </Text>
                <ScaledImage
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
                onPress={() => {
                  this.props.navigation.navigate("changePass");
                }}
              >
                <Text style={styles.itemText}>Đổi mật khẩu</Text>
                <ScaledImage
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
              <ScaledImage
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
            <ScaledImage source={require("@images/new/ic_menu_fingerprint.png")} width={24} height={24} />
          </TouchableOpacity>
        } */}
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={() => {
              this.props.navigation.navigate("about");
            }}
          >
            <Text style={styles.itemText}>Về iSofH</Text>
            <ScaledImage
              source={require("@images/new/ic_menu_aboutus.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={() => {
              Linking.openURL(
                "mailto:support@isofhcare.vn?subject=Hỗ trợ sử dụng app ISofhCare&body="
              );
            }}
          >
            <Text style={styles.itemText}>Hỗ trợ</Text>
            <ScaledImage
              source={require("@images/new/ic_menu_support.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={() => {
              Linking.openURL(
                "mailto:support@isofhcare.vn?subject=Báo lỗi quá trình sử dụng app ISofhCare&body="
              );
            }}
          >
            <Text style={styles.itemText}>Báo lỗi</Text>
            <ScaledImage
              source={require("@images/new/ic_menu_feedback.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu]}
            onPress={() => {
              this.props.navigation.navigate("terms");
            }}
          >
            <Text style={styles.itemText}>Điều khoản sử dụng</Text>
            <ScaledImage
              source={require("@images/new/ic_menu_terms.png")}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          {this.props.userApp.isLogin && (
            <TouchableOpacity
              style={[styles.itemMenu]}
              onPress={() => {
                this.props.dispatch(redux.userLogout());
                if (this.props.onLogout) this.props.onLogout();
              }}
            >
              <Text style={styles.itemText}>Đăng xuất</Text>
              <ScaledImage
                source={require("@images/new/ic_menu_logout.png")}
                width={24}
                height={24}
              />
            </TouchableOpacity>
          )}
          <View>
          <Text style={{marginLeft:10}}>{'Phiên bản ' + DeviceInfo.getVersion() + 'b'+ DeviceInfo.getBuildNumber()}</Text>
          </View>
          <View style={{ height: 100 }} />
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
    fontWeight: "400"
  }
});

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(Account);
