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
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';

class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    let user = this.props.navigation.getParam("user", null);

    this.state = user || {};
  }

  changePassword() {
    Keyboard.dismiss();
    if (!this.form.isValid()) {
      return;
    }
    this.setState({ isLoading1: true }, () => {
      userProvider.refreshPasswordByToken(this.state.phone, this.state.token, this.state.applicationId, this.state.password).then(s => {
        this.setState({ isLoading1: false })
        switch (s.code) {
          case 0:
            snackbar.show(
              "Thiết lập mật khẩu mới thành công",
              "success"
            );
            this.props.navigation.replace("login", {
              nextScreen: this.nextScreen
            });
            return;
        }
      }).catch(e => {
        this.setState({ isLoading1: false })
        snackbar.show(constants.msg.user.change_password_not_success, "danger");
      });
    });

  }

  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        touchToDismiss={true}
        title="Thiết lập mật khẩu"
      isLoading={this.state.isLoading1}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView behavior="padding">
            <View style={{ flex: 1, padding: 20 }}>
              <Form ref={ref => (this.form = ref)}>
                <TextField
                  getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.msg.user.new_password}
                    secureTextEntry={true}
                    onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                  onChangeText={s => {
                    this.setState({ password: s });
                  }}
                  errorStyle={styles.errorStyle}
                  validate={{
                    rules: {
                      required: true,
                      maxlength: 255,
                      minlength: 8
                    },
                    messages: {
                      required: "Mật khẩu không được bỏ trống!",
                      maxlength: "Không được nhập quá 255 kí tự",
                      minlength: "Mật khẩu dài ít nhất 8 ký tự"
                    }
                  }}
                  inputStyle={styles.input}
                  autoCapitalize={"none"}
                />
                <TextField
                  getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.msg.user.confirm_new_password}
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
                      required: "Xác nhận mật khẩu không được bỏ trống!",
                      equalTo: "Mật khẩu và xác nhận mật khẩu không giống nhau"
                    }
                  }}
                  inputStyle={styles.input}
                  autoCapitalize={"none"}
                />

              </Form>
            </View>

            <TouchableOpacity style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center' }} onPress={this.changePassword.bind(this)}>
              <Text style={{ color: '#FFF', fontSize: 20, textTransform: 'uppercase' }}>{"HOÀN THÀNH"}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </ActivityPanel >
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  form: {
    marginTop: 80,
    borderRadius: 10
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
export default connect(mapStateToProps)(ResetPasswordScreen);
