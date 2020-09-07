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
        description: 'Dùng vân tay để đăng nhập isofhcare',
        cancelButton: this.props.handlePopupDismissed(),
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
          this.props.handlePopupDismissed();
          // this.description.shake();
        });
    } else {
      FingerprintScanner.authenticate({
        description: 'Dùng vân tay để đăng ký xác thực isofhcare',
        cancelButton: this.props.handlePopupDismissed(),
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

          this.props.handlePopupDismissed();
          this.setState({
            errorMessage: "Thử lại \n Sử dụng Touch ID để mở khoá Isofhcare ",
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
