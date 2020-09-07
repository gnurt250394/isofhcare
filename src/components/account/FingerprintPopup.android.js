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
    FingerprintScanner
      .authenticate({
        title: 'Dùng vân tay để đăng nhập',
        cancelButton: this.props.handlePopupDismissed()
      })
      .then(() => {
        if (!this.props.isLogin) {
          dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s => {
            this.props.handlePopupDismissed();
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
          });
        } else {
          dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
            userId: this.props.userApp.currentUser.id,
            username: this.props.userApp.currentUser.phone || this.props.userApp.currentUser.username,
            refreshToken: this.props.userApp.currentUser.loginToken,

          }).catch(err => {


          });
          this.props.handlePopupDismissedDone();
          snackbar.show("Đăng ký xác thực thành công", 'success');
        }
      }).catch(err => {

        this.props.handlePopupDismissed();
      });
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
