import { AlertIOS } from 'react-native';
import React, { Component, PropTypes } from "react";
import {
  Alert,
} from "react-native";
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
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);

  }
  componentDidMount() {
    if (this.state.isLogin) {
    FingerprintScanner
      .authenticate({ description: 'Quét dấu vân tay của bạn trên máy quét thiết bị để tiếp tục' })
      .then(async () => {
        dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s => {
          if (!s) {
            Alert.alert("Bạn chưa đăng ký vân tay trên tài khoản này");
          }
          if (s) {
            userProvider
              .refreshToken(s.userId,s.refreshToken)
              .then(s => {
                  switch (s.code) {
                    case 0:
                      var user = s.data.user;
                      snackbar.show(constants.msg.user.login_success, "success");
                      this.props.dispatch(redux.userLogin(user));
                      if (this.nextScreen) {
                        this.props.navigation.replace(
                          this.nextScreen.screen,
                          this.nextScreen.param
                        );
                      } else {
                        this.props.navigation.navigate("home", { showDraw: false });
                      }
                      return;
                    case 4:
                      snackbar.show(
                        constants.msg.user.this_account_not_active,
                        "danger"
                      );
                      return;
                    case 3:
                      snackbar.show(
                        constants.msg.user.username_or_password_incorrect,
                        "danger"
                      );
                      return;
                    case 2:Alert.alert("Phiên đăng nhập đã hết hạn, xin vui lòng đăng nhập lại")
                    case 1:
                      snackbar.show(constants.msg.user.account_blocked, "danger");
                      return;
                  }
                
              })
              .catch(e => {
              });
          }
        });

        this.props.handlePopupDismissed();
      })
      .catch((error) => {
        this.props.handlePopupDismissed();
        AlertIOS.alert(error.message);
      });
  }else {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttempted
    })
      .then(() => {
        dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
          userId: this.props.userApp.currentUser.id,
          refreshToken: this.props.userApp.currentUser.loginToken
        });
        this.props.handlePopupDismissed();
        Alert.alert("Thành công", "Bạn đã đăng ký vân tay thành công");
      })
      .catch(error => {
        this.setState({
          errorMessage: "Vân tay không trùng khớp",
          error: true
        });
        this.description.shake();

        //
      });
  }
}

  render() {
    return false;
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(FingerprintPopup);
