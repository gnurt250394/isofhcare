import React, { Component, PropTypes } from "react";
import UserInput from "@components/UserInput";
import ActivityPanel from "@components/ActivityPanel";
import ButtonSubmit from "@components/ButtonSubmit";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import eyeImg from "@images/eye_black.png";
import snackbar from "@utils/snackbar-utils";
import userProvider from "@data-access/user-provider";
import constants from "@resources/strings";
import stringUtils from "mainam-react-native-string-utils";
import redux from "@redux-store";
import ScaleImage from "mainam-react-native-scaleimage";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);
    this.state = {
      press: false,
      email: ""
    };
  }

  forgotPassword = () => {
    Keyboard.dismiss();
    if (!this.form.isValid()) {
      this.child.unPress();
      return;
    }

    userProvider.forgotPassword(this.state.email.trim(), 2, (s, e) => {
      this.child.unPress();
      if (s) {
        // snackbar.show("Thông tin đăng nhập không hợp lệ");
        // return;
        switch (s.code) {
          case 2:
            snackbar.show(
              constants.msg.user.not_found_user_with_email_or_phone,
              "danger"
            );
            return;
          case 0:
            if (s.data && s.data.status == 1) {
              // if (type == 2) {
              snackbar.show(
                constants.msg.user.send_sms_recovery_success,
                "success"
              );
              this.props.navigation.replace("confirmCode", {
                phone: this.state.email,
                nextScreen: this.nextScreen
              });
              // }
              // else
              // {
              // 	snackbar.show(constants.msg.user.send_mail_recovery_success, 'success');
              // 	this.props.navigation.replace("login", { phone: this.state.email });
              // }
              return;
            } else {
              snackbar.show(
                constants.msg.user.not_found_user_with_email_or_phone,
                "danger"
              );
            }
            return;
        }
      }
      if (e) {
        console.log(e);
      }
      snackbar.show(constants.msg.error_occur);
    });
  }

  gotoRegister = () => {
    this.props.navigation.replace("register", {
      nextScreen: this.nextScreen
    });
  }
  onChangeText = s => {
    this.setState({ email: s });
  }
  render() {
    return (
      <ActivityPanel
        style={styles.container}
        title={constants.forgot_password}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={styles.logo}
          >
            <ScaleImage source={require("@images/logo.png")} width={120} />
          </View>
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <Form ref={ref => (this.form = ref)}>
              <TextField
                errorStyle={styles.errorStyle}
                validate={{
                  rules: {
                    required: true,
                    phone: true
                  },
                  messages: {
                    required: constants.change_password_screens.require_phone,
                    phone: constants.change_password_screens.require_phone_not_found
                  }
                }}
                inputStyle={styles.input}
                onChangeText={this.onChangeText}
                placeholder={constants.input_phone}
                autoCapitalize={"none"}
              />
            </Form>
            <ButtonSubmit
              onRef={ref => (this.child = ref)}
              click={this.forgotPassword}
              text={constants.send}
            />
            <View style={styles.buttonRegister}>
              <TouchableOpacity
                onPress={this.gotoRegister}
                style={styles.button}
              >
                <Text
                  style={styles.txtRegister}
                >
                  {constants.change_password_screens.register}{" "}
                  <Text style={{ fontWeight: "bold", color: "rgb(0,151,124)" }}>
                    tại đây
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ActivityPanel>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  txtRegister: {
    marginTop: 15,
    color: "rgb(155,155,155)",
    lineHeight: 20,
    fontSize: 16
  },
  button: { alignItems: "flex-end" },
  buttonRegister: { width: DEVICE_WIDTH, maxWidth: 300 },
  container: { flex: 1 },
  logo: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    marginTop: 60,
    alignItems: "center"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    backgroundColor: "transparent"
  },
  signup_section: {
    marginTop: 30,
    flex: 1,
    width: DEVICE_WIDTH,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  btnEye: {
    position: "absolute",
    right: 25,
    top: 10
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: "rgba(0,0,0,0.2)"
  },
  picture: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  input: {
    color: "#53657B",
    fontWeight: "600",
    height: 51,
    marginLeft: 0,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderColor: '#CCCCCC',
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 45,

  },
  errorStyle: {
    color: "red",
    marginLeft: 20
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(ForgotPasswordScreen);
