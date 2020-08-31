import React, { Component, PropTypes } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ShakingText from "./ShakingText";
import ScaledImage from "mainam-react-native-scaleimage";
import dataCacheProvider from "../../data-access/datacache-provider";
import userProvider from "@data-access/user-provider";
import snackbar from "@utils/snackbar-utils";
import constants from "@resources/strings";
import redux from "@redux-store";
import NavigationService from "@navigators/NavigationService";

import { connect } from "react-redux";
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

  componentDidMount() {
    if (!this.state.isLogin) {
      FingerprintScanner.authenticate({
        title: 'Tittle',
        subTitle: 'subTitle',
        description: 'description',
        cancelButton: 'cancelButton',
        onAttempt: this.handleAuthenticationAttempted
      })
        .then(() => {
          dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s => {

            if (!s || s.userId == '') {
              snackbar.show(constants.touch_id_screens.touch_not_found);
            }
            if (s) {
              console.log('s: ', s);
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
                      this.props.handlePopupDismissed();
                      this.props.dispatch(redux.userLogin(user));
                      if (this.props.nextScreen) {
                        this.props.onNavigate()
                        return;
                      } else {
                        this.props.navigation.navigate("home", {
                          showDraw: false
                        });
                      }
                      this.props.handlePopupDismissed();

                      return;
                    case 4:
                      snackbar.show(
                        constants.msg.user.this_account_not_active,
                        "danger"
                      );
                      this.props.handlePopupDismissed();
                      return;
                    case 3:
                      snackbar.show(
                        constants.msg.user.username_or_password_incorrect,
                        "danger"
                      );
                      this.props.handlePopupDismissed();
                      return;
                    case 2:
                      snackbar.show(
                        constants.login_fail
                      );
                      this.props.handlePopupDismissed();
                      return
                    case 1:
                      snackbar.show(
                        constants.msg.user.account_blocked,
                        "danger"
                      );
                      this.props.handlePopupDismissed();
                      return;
                  }
                })
                .catch(e => {
                  console.log('e: ', e);
                  this.props.handlePopupDismissed();

                });
            }
          });

        })
        .catch(error => {
          this.props.handlePopupDismissed();
        });
    } else {
      FingerprintScanner.authenticate({
        onAttempt: this.handleAuthenticationAttempted
      })
        .then(() => {
          dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
            userId: this.props.userApp.currentUser.id,
            refreshToken: this.props.userApp.currentUser.loginToken
          });
          this.props.handlePopupDismissedDone();
          snackbar.show("Đăng ký xác thực thành công", 'success');
        })
        .catch(error => {
          console.log(error)
          this.setState({
            errorMessage: constants.touch_id_screens.touch_error,
            error: true
          });
          this.props.handlePopupDismissedDone();

          // this.description.shake();

          //
        });
    }
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = error => {
    this.props.handlePopupDismissed()

  };

  render() {
    return false
    // (
    //   <View style={styles.container}>
    //     <View style={[styles.contentContainer, style]}>
    //       <Image
    //         style={styles.logo}
    //       // source={require('./assets/finger_print.png')}
    //       />

    //       <Text style={styles.heading}>{constants.touch_id_screens.header}</Text>
    //       <ShakingText
    //         ref={instance => {
    //           this.description = instance;
    //         }}
    //         style={[
    //           styles.description,
    //           { color: error ? "#ea3d13" : "#a5a5a5" }
    //         ]}
    //       >
    //         {errorMessage ||
    //           constants.touch_id_screens.touch_error}
    //       </ShakingText>
    //       <ScaledImage
    //         source={require("@images/new/fingerprint.png")}
    //         height={40}
    //       />
    //       <TouchableOpacity
    //         style={styles.buttonContainer}
    //         onPress={handlePopupDismissed}
    //       >
    //         <Text style={styles.buttonText}>{constants.touch_id_screens.back}</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // );
  }
}
const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // backgroundColor: "#858585",
    flex: 1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#ffffff"
  },
  logo: {
    marginVertical: 45
  },
  heading: {
    textAlign: "center",
    color: "#rgb(2,195,154)",
    fontSize: 21,
    marginVertical: 10
  },
  description: {
    textAlign: "center",
    height: 65,
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20
  },
  buttonContainer: {
    padding: 20
  },
  buttonText: {
    color: "#rgb(2,195,154)",
    fontSize: 15,
    fontWeight: "bold"
  }
});
// FignerprintPopupAndroid.propTypes = {
//   style: ViewPropTypes.style,
//   handlePopupDismissed: PropTypes.func.isRequired,
// };
function mapStateToProps(state) {
  return {
    navigation: state.auth.navigation,
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(FingerprintPopup);
