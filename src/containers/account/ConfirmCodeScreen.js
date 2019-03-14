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
  Keyboard
} from "react-native";
import Dimensions from "Dimensions";
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

class ConfirmCodeScreen extends Component {
  constructor(props) {
    super(props);
    let phone = this.props.navigation.getParam("phone", null);
    if (!phone) this.props.navigation.pop();
    let fromRegisterScreen = this.props.navigation.getParam(
      "fromRegisterScreen",
      null
	);
	this.nextScreen = this.props.navigation.getParam("nextScreen", null);

    this.state = {
      press: false,
      code: "",
      phone,
      fromRegisterScreen
    };
  }

  confirmCode() {
    Keyboard.dismiss();
    if (!this.form.isValid()) {
      this.child.unPress();
      return;
    }
    // if (this.props.fromRegisterScreen) {
    // 	userProvider.confirmCode(this.state.phone, this.state.code, (s, e) => {
    // 		this.child.unPress();
    // 		if (s) {
    // 			switch (s.code) {
    // 				case 0:
    // 					snackbar.show(constants.msg.user.active_account_success, 'success');
    // 					this.props.navigation.replace("login");
    // 					return;
    // 			}

    // 		}
    // 		if (e) {
    // 			console.log(e);
    // 		}
    // 		snackbar.show(constants.msg.user.confirm_code_not_success, 'danger');
    // 	});
    // } else
    userProvider.confirmCode(this.state.phone, this.state.code, (s, e) => {
      this.child.unPress();
      if (s) {
        switch (s.code) {
          case 0:
            snackbar.show(constants.msg.user.confirm_code_success, "success");
            this.props.navigation.replace("resetPassword", {
              id: s.data.user.id,
              nextScreen: this.nextScreen
            });
            return;
        }
      }
      if (e) {
        console.log(e);
      }
      snackbar.show(constants.msg.user.confirm_code_not_success, "danger");
    });
  }

  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        touchToDismiss={true}
        showFullScreen={true}
        title="Xác thực tài khoản"
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
          <View
            style={{
              marginTop: 60,
              justifyContent: "center",
              alignItems: "center"
            }}
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
                    minlength: 6,
                    maxlength: 6
                  },
                  messages: {
                    required: "Vui lòng nhập mã OTP",
                    minlength: "Yêu cầu nhập đủ 6 ký tự",
                    maxlength: "Yêu cầu nhập đủ 6 ký tự"
                  }
                }}
                inputStyle={styles.input}
                onChangeText={s => {
                  this.setState({ code: s });
                }}
                placeholder={constants.input_code}
                autoCapitalize={"none"}
                returnKeyType={"next"}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </Form>

            <ButtonSubmit
              onRef={ref => (this.child = ref)}
              click={() => {
                this.confirmCode();
              }}
              text={constants.confirm}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </ActivityPanel>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
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
    maxWidth: 300,
    paddingRight: 30,
    backgroundColor: "#FFF",
    width: DEVICE_WIDTH - 40,
    height: 42,
    marginHorizontal: 20,
    paddingLeft: 15,
    borderRadius: 6,
    color: "#006ac6",
    borderWidth: 1,
    borderColor: "rgba(155,155,155,0.7)"
  },
  errorStyle: {
    color: "red",
    marginLeft: 20
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(ConfirmCodeScreen);
