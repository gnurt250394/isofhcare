import React, { Component, PropTypes } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
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
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);

  }

  componentDidMount() {
    if (this.state.isLogin) {
      FingerprintScanner.authenticate({
        onAttempt: this.handleAuthenticationAttempted
      })
        .then(  () => {
          dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s  => {
            if (!s) {
              Alert.alert("Bạn chưa đăng ký vân tay trên tài khoản này");
            }
            if (s) {
              console.log('chua chay vao')
              userProvider
                .refreshToken(s.userId,s.refreshToken)
                .then(s => {
                  console.log(s,'chay vao sssssss')
                    switch (s.code) {
                      case 0:
                        var user = s.data.user;
                        snackbar.show(constants.msg.user.login_success, "success");
                        this.props.dispatch(redux.userLogin(user));
                        console.log(this.nextScreen)
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
                  console.log(e,'loi mat roi')
                });
            }
          });

          this.props.handlePopupDismissed();
        })
        .catch(error => {
          this.setState({
            errorMessage: "Vân tay không trùng khớp",
            error: true
          });
          this.description.shake();
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
          this.props.handlePopupDismissed();
          Alert.alert("Thành công", "Bạn đã đăng ký vân tay thành công");
        })
        .catch(error => {
          this.setState({
            errorMessage: "Thử lại",
            error: true
          });
          this.description.shake();

          //
        });
    }
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = error => {
    this.setState({ errorMessage: "Thử lại", error: true });
    this.description.shake();
  };

  render() {
    const { errorMessage, error } = this.state;
    const { style, handlePopupDismissed } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
          <Image
            style={styles.logo}
            // source={require('./assets/finger_print.png')}
          />

          <Text style={styles.heading}>Đăng ký vân tay</Text>
          <ShakingText
            ref={instance => {
              this.description = instance;
            }}
            style={[
              styles.description,
              { color: error ? "#ea3d13" : "#a5a5a5" }
            ]}
          >
            {errorMessage ||
              "Quét dấu vân tay của bạn trên máy quét thiết bị để tiếp tục"}
          </ShakingText>
          <ScaledImage
            source={require("@images/new/fingerprint.png")}
            height={40}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissed}
          >
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(FingerprintPopup);
