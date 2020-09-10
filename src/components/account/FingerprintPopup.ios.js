import React, { Component, PropTypes } from "react";
import { AlertIOS, View } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
import dataCacheProvider from "../../data-access/datacache-provider";
import userProvider from "@data-access/user-provider";
import snackbar from "@utils/snackbar-utils";
import constants from "@resources/strings";
import { connect } from "react-redux";
import redux from "@redux-store";

class FingerprintPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      error: false,
      isLogin: this.props.isLogin
      // userId:this.props.userId
    };

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isFinger) {
      console.log('nextProps.isFinger: ', nextProps.isFinger);
      this.authCurrent();

    }
  }
  authCurrent = () => {
    if (!this.state.isLogin) {
      FingerprintScanner.authenticate({
        description: 'Dùng vân tay để đăng nhập iSofHcare',
        onAttempt: this.handleAuthenticationAttempted
      })
        .then(() => {
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
                  }
                })
                .catch(e => {
                  this.props.handlePopupDismissed();

                });
            }
          });

          this.props.handlePopupDismissed();
        })
        .catch(error => {
          if (error.name) {
            switch (error.name) {
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
          // this.description.shake();
        });
    } else {
      FingerprintScanner.authenticate({
        description: 'Dùng vân tay để đăng ký xác thực iSofHcare',
        onAttempt: this.handleAuthenticationAttempted
      })
        .then(() => {
          dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
            userId: this.props.userApp.currentUser.id,
            username: this.props.userApp.currentUser.phone || this.props.userApp.currentUser.username,
            refreshToken: this.props.userApp.currentUser.loginToken,

          });
          this.props.handlePopupDismissedDone();
          snackbar.show("Đăng ký xác thực thành công", 'success');
        })
        .catch(error => {
          if (error.name) {
            switch (error.name) {
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
          this.setState({
            errorMessage: "Thử lại \n Sử dụng Touch ID để mở khoá iSofHcare ",
            error: true
          });
          // this.description.shake();

          //
        });
    }
  }
  componentWillUnmount() {
    FingerprintScanner.release();
  }
  handleAuthenticationAttempted = error => {
    if (this.props.isDismiss) {
      this.props.isShowPass()
      // this.description.shake();
    } else {
      this.setState({ errorMessage: constants.touch_id_screens.touch_error, error: true });
      // this.description.shake();
    }


  };
  render() {
    return false;
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.auth.navigation,
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(FingerprintPopup);
