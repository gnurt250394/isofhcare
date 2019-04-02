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
import redux from "@redux-store";
import ScaleImage from "mainam-react-native-scaleimage";
import stringUtils from "mainam-react-native-string-utils";
import dateUtils from "mainam-react-native-date-utils";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';

class EnterPasswordScreen extends Component {
  constructor(props) {
    super(props);
    var user = this.props.navigation.getParam("user", null);
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);

    if (!user.email) user.email = "";
    user.showPass = true;
    user.showPassConfirm = true;
    user.press = false;
    user.pressConfirm = false;
    this.state = user;
    this.showPass = this.showPass.bind(this);
    this.showPassConfirm = this.showPassConfirm.bind(this);
  }
  setDate(newDate) {
    this.setState({ dob: newDate });
  }
  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }
  showPassConfirm() {
    this.state.pressConfirm === false
      ? this.setState({ showPassConfirm: false, pressConfirm: true })
      : this.setState({ showPassConfirm: true, pressConfirm: false });
  }

  register() {
    Keyboard.dismiss();
    if (!this.form.isValid()) {
      return;
    }
    this.setState({ isLoading: true }, () => {
      userProvider
        .register(
          this.state.fullname.trim(),
          this.state.avatar,
          this.state.email.trim(),
          this.state.phone.trim(),
          this.state.password,
          this.state.dob ? this.state.dob.format("yyyy-MM-dd HH:mm:ss") : null,
          this.state.gender,
          this.state.token,
          this.state.socialType,
          this.state.socialId
        )
        .then(s => {
          this.setState({ isLoading: false });
          switch (s.code) {
            case 0:
              var user = s.data.user;
              this.props.dispatch(redux.userLogin(user));
              if (this.nextScreen) {
                this.props.navigation.replace(
                  this.nextScreen.screen,
                  this.nextScreen.param
                );
              } else this.props.navigation.navigate("home", { showDraw: false });
              return;
            case 9:
              snackbar.show(
                constants.msg.user.exist_account_with_this_phone,
                "danger"
              );
              return;
            case 2:
              snackbar.show(
                constants.msg.user.username_or_email_existed,
                "danger"
              );
              return;
            case 3:
            case 1:
              snackbar.show(constants.msg.user.account_blocked, "danger");
              return;
            case 500:
              snackbar.show(constants.msg.error_occur, "danger");
              return;
          }
        })
        .catch(e => {
          snackbar.show(constants.msg.error_occur, "danger");
          this.setState({ isLoading: false });
        });
    });

  }

  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        title="Đăng ký"
        titleStyle={{ textAlign: 'left', marginLeft: 20 }}
        touchToDismiss={true}
        showFullScreen={true}
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View style={{ flex: 1, padding: 20 }}>
              <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={{ marginTop: 50, alignSelf: 'center' }} />
              <Form ref={ref => (this.form = ref)} style={{ marginTop: 10 }}>

                <TextField
                  getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.input_password}
                    secureTextEntry={true}
                    onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                  onChangeText={s => {
                    this.setState({ password: s });
                  }}
                  errorStyle={styles.errorStyle}
                  validate={{
                    rules: {
                      required: true,
                      minlength: 8
                    },
                    messages: {
                      required: "Mật khẩu không được bỏ trống",
                      minlength: "Mật khẩu dài ít nhất 8 ký tự"
                    }
                  }}
                  placeholder={constants.input_password}
                  autoCapitalize={"none"}
                />
                <TextField
                  getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Xác nhận mật khẩu"}
                    secureTextEntry={true}
                    onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                  onChangeText={s => {
                    this.setState({ confirm_password: s });
                  }}
                  errorStyle={styles.errorStyle}
                  validate={{
                    rules: {
                      required: true,
                      equalTo: this.state.password
                    },
                    messages: {
                      required: "Xác nhận mật khẩu không được bỏ trống",
                      equalTo: "Mật khẩu và xác nhận mật khẩu không giống nhau"
                    }
                  }}
                  placeholder={constants.input_password}
                  autoCapitalize={"none"}
                />
              </Form>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }} onPress={this.register.bind(this)}>
          <Text style={{ color: '#FFF', fontSize: 17 }}>{"HOÀN THÀNH"}</Text>
        </TouchableOpacity>
      </ActivityPanel >
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
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
    marginTop: 10
  },
  textInputStyle: {
    color: "#53657B",
    fontWeight: "600",
    height: 45,
    marginLeft: 0,
    fontSize: 20
  },
  labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(EnterPasswordScreen);
