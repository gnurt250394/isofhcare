import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';
import snackbar from "@utils/snackbar-utils";
import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';
import dataCacheProvider from "../../data-access/datacache-provider";
import constants from "@resources/strings";
import { connect } from "react-redux";
import redux from "@redux-store";
import userProvider from "@data-access/user-provider";

// - this example component supports both the
//   legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both
class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined
    };

    this.description = null;
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.isFinger) {
      this.authCurrent();
    }
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  }

  // requiresLegacyAuthentication() {
  //   return Platform.Version < 23;

  // }

  authCurrent = () => {
    if (!this.props.isLogin) {
      FingerprintScanner
        .authenticate({
          title: 'Dùng vân tay để đăng nhập',
        })
        .then(s => {

          dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s => {
            if ((!s || !s.userId) || (s?.username !== this.props.username)) {
              snackbar.show("Bạn chưa đăng ký vân tay trên tài khoản này", 'danger');
            }
            else {
              userProvider
                .refreshToken(s.userId, s.refreshToken)
                .then(s => {

                  switch (s.code) {
                    case 0:
                      var user = s.data.user;
                      snackbar.show(
                        constants.msg.user.login_success,
                        "success"
                      );
                      dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
                        userId: user.id,
                        username: user.phone || user.username,
                        refreshToken: user.loginToken,
                      })
                      user.hospital = this.props.userApp.hospital
                      this.props.dispatch(redux.userLogin(user));
                      if (this.props.nextScreen) {
                        this.props.onNavigate();
                        return;
                      } else {
                        this.props.navigation.navigate("home", {
                          showDraw: false
                        });
                      }
                      break;
                    case 4:
                      snackbar.show(
                        constants.msg.user.this_account_not_active,
                        "danger"
                      );
                      break;
                    case 3:
                      snackbar.show(
                        constants.msg.user.username_or_password_incorrect,
                        "danger"
                      );
                      break;
                    case 2:
                      snackbar.show(
                        "Phiên đăng nhập đã hết hạn, xin vui lòng đăng nhập lại"
                      );
                      break
                    case 1:
                      snackbar.show(
                        constants.msg.user.account_blocked,
                        "danger"
                      );
                      break;
                    default:
                      snackbar.show(
                        "Có lỗi xảy ra, xin vui lòng thử lại"
                      );
                      break
                  }
                })
                .catch(e => {


                  this.props.handlePopupDismissed();

                });
            }
          })
        }).catch(e => {

          if (e.name) {
            switch (e.name) {
              case 'DeviceLockedPermanent':
                snackbar.show("Xác thực không thành công, thiết bị phải được mở khóa bằng mật khẩu", 'danger');
                break
              case 'AuthenticationTimeout':
                snackbar.show("Xác thực không thành công vì hoạt động đã hết thời gian", 'danger');
                break
              case 'DeviceLockedPermanent':
                snackbar.show("Xác thực không thành công, thiết bị phải được mở khóa bằng mật khẩu", 'danger');
                break
              case 'AuthenticationProcessFailed':
                snackbar.show("Cảm biến không thể xử lý .Vui lòng thử lại", 'danger');
                break
              case 'SystemCancel':
                snackbar.show("Xác thực đã bị hệ thống hủy bỏ", 'danger');
                break
              case 'PasscodeNotSet':
                snackbar.show("Xác thực không thể bắt đầu vì mật mã không được đặt trên thiết bị", 'danger');
                break
              case 'DeviceLocked':
                snackbar.show("Xác thực không thành công, thiết bị hiện đang ở trạng thái khóa 30 giây", 'danger');
                break
              case 'DeviceOutOfMemory':
                snackbar.show("Không thể tiến hành xác thực vì không có đủ bộ nhớ trống trên thiết bị", 'danger');
                break
              case 'HardwareError':
                snackbar.show("Đã xảy ra lỗi phần cứng", 'danger');
                break
              case 'FingerprintScannerUnknownError':
                snackbar.show("Không thể xác thực vì một lý do không xác định", 'danger');
                break
              case 'FingerprintScannerNotEnrolled':
                snackbar.show("Không thể bắt đầu xác thực vì Máy quét vân tay không có ngón tay nào được đăng ký", 'danger');
                break
              case 'FingerprintScannerNotAvailable':
                snackbar.show("Không thể bắt đầu xác thực vì Máy quét vân tay không khả dụng trên thiết bị", 'danger');
                break
            }
          }
          this.props.handlePopupDismissed();
        })
    } else {

      FingerprintScanner
        .authenticate({
          title: 'Dùng vân tay để đăng nhập',
          cancelButton: this.props.handlePopupDismissed()
        })
        .then(() => {
          dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
            userId: this.props.userApp.currentUser.id,
            username: this.props.userApp.currentUser.phone || this.props.userApp.currentUser.username,
            refreshToken: this.props.userApp.currentUser.loginToken,
          })
          this.props.handlePopupDismissedDone();
          snackbar.show("Đăng ký xác thực thành công", 'success');
        }).catch(err => {
          if (err.name) {
            switch (err.name) {
              case 'DeviceLockedPermanent':
                snackbar.show("Xác thực không thành công, thiết bị phải được mở khóa bằng mật khẩu", 'danger');
                break
              case 'AuthenticationTimeout':
                snackbar.show("Xác thực không thành công vì hoạt động đã hết thời gian", 'danger');
                break
              case 'DeviceLockedPermanent':
                snackbar.show("Xác thực không thành công, thiết bị phải được mở khóa bằng mật khẩu", 'danger');
                break
              case 'AuthenticationProcessFailed':
                snackbar.show("Cảm biến không thể xử lý .Vui lòng thử lại", 'danger');
                break
              case 'SystemCancel':
                snackbar.show("Xác thực đã bị hệ thống hủy bỏ", 'danger');
                break
              case 'PasscodeNotSet':
                snackbar.show("Xác thực không thể bắt đầu vì mật mã không được đặt trên thiết bị", 'danger');
                break
              case 'DeviceLocked':
                snackbar.show("Xác thực không thành công, thiết bị hiện đang ở trạng thái khóa 30 giây", 'danger');
                break
              case 'DeviceOutOfMemory':
                snackbar.show("Không thể tiến hành xác thực vì không có đủ bộ nhớ trống trên thiết bị", 'danger');
                break
              case 'HardwareError':
                snackbar.show("Đã xảy ra lỗi phần cứng", 'danger');
                break
              case 'FingerprintScannerUnknownError':
                snackbar.show("Không thể xác thực vì một lý do không xác định", 'danger');
                break
              case 'FingerprintScannerNotEnrolled':
                snackbar.show("Không thể bắt đầu xác thực vì Máy quét vân tay không có ngón tay nào được đăng ký", 'danger');
                break
              case 'FingerprintScannerNotAvailable':
                snackbar.show("Không thể bắt đầu xác thực vì Máy quét vân tay không khả dụng trên thiết bị", 'danger');
                break
            }
          }

          this.props.handlePopupDismissed();
        });
    }

  }

  // authLegacy() {
  //   FingerprintScanner
  //     .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
  //     .then(() => {
  //       this.props.handlePopupDismissedLegacy();
  //       Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
  //     })
  //     .catch((error) => {
  //       this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
  //       this.description.shake();
  //     });
  // }

  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({ errorMessageLegacy: error.message });
    this.description.shake();
  };

  // renderLegacy() {
  //   const { errorMessageLegacy, biometricLegacy } = this.state;
  //   const { style, handlePopupDismissedLegacy } = this.props;
  //   
  //   return (
  //     <View style={styles.container}>
  //       <View style={[styles.contentContainer, style]}>

  //         {/* <Image
  //           style={styles.logo}
  //           source={require('./assets/finger_print.png')}
  //         /> */}

  //         <Text style={styles.heading}>
  //           Biometric{'\n'}Authentication
  //         </Text>
  //         <ShakingText
  //           ref={(instance) => { this.description = instance; }}
  //           style={styles.description(!!errorMessageLegacy)}>
  //           {errorMessageLegacy || `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
  //         </ShakingText>

  //         <TouchableOpacity
  //           style={styles.buttonContainer}
  //           onPress={handlePopupDismissedLegacy}
  //         >
  //           <Text style={styles.buttonText}>
  //             BACK TO MAIN
  //           </Text>
  //         </TouchableOpacity>

  //       </View>
  //     </View>
  //   );
  // }


  render() {
    return false;
  }
}

// BiometricPopup.propTypes = {
//   onAuthenticate: PropTypes.func.isRequired,
//   handlePopupDismissedLegacy: PropTypes.func,
//   style: ViewPropTypes.style,
// };
function mapStateToProps(state) {
  return {
    navigation: state.auth.navigation,
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(BiometricPopup);
