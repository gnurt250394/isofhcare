import React, { Component, PropTypes } from "react";
import UserInput from "@components/UserInput";
import ActivityPanel from "@components/ActivityPanel";
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
import connectionUtils from '@utils/connection-utils';

class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    let user = this.props.navigation.getParam("user", null);
    user.secureTextEntry = true
    user.secureTextEntry2 = true

    this.state = user || {};
  }

  changePassword() {
    Keyboard.dismiss();
    if (!this.form.isValid()) {
      return;
    }
    connectionUtils.isConnected().then(s => {
      this.setState({ isLoading: true }, () => {
        userProvider.refreshPasswordByToken(this.state.phone, this.state.loginToken, this.state.applicationId, this.state.password).then(s => {
          this.setState({ isLoading: false })
          switch (s.code) {
            case 0:
              snackbar.show(
                constants.change_password_screens.setup_password_success,
                "success"
              );
              this.props.navigation.replace("login", {
                nextScreen: this.nextScreen
              });
              return;
            case 2:
              snackbar.show(
                constants.change_password_screens.phone_not_found,
                "danger"
              );
              return;
          }
        }).catch(e => {
          this.setState({ isLoading: false })
          snackbar.show(constants.msg.user.change_password_not_success, "danger");
        });
      });

    }).catch(e => {
      snackbar.show(constants.msg.app.not_internet, "danger");
    })

  }
  onShowPass = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    })
  }
  onShowPass2 = () => {
    this.setState({
      secureTextEntry2: !this.state.secureTextEntry2
    })
  }
  onChangeText = (state) => (value) => {
    this.setState({ [state]: value })
  }
  render() {
    return (
      <ActivityPanel
        title={constants.setup_password}
        isLoading={this.state.isLoading}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior="padding" >
            <View style={styles.group}>
              <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={styles.imgLogo} />
              <Form ref={ref => (this.form = ref)}>
                <Field style={styles.inputPass}>
                  <TextField
                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                      placeholderStyle={styles.placeFloat} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Mật khẩu"}
                      secureTextEntry={this.state.secureTextEntry}
                      allowFontScaling={false}
                      onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={s => {
                      this.setState({ password: s });
                    }}
                    allowFontScaling={false}
                    errorStyle={styles.errorStyle}
                    validate={{
                      rules: {
                        required: true,
                        maxlength: 255,
                        minlength: 8
                      },
                      messages: {
                        required: constants.password_not_null,
                        maxlength: constants.msg.user.text_without_255,
                        minlength: constants.msg.user.password_must_greater_than_8_character
                      }
                    }}
                    inputStyle={styles.input}
                    autoCapitalize={"none"}
                  />
                  {
                    this.state.password ? (this.state.secureTextEntry ? (<TouchableOpacity style={styles.showPass} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 30, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                  }
                </Field>
                <Field style={styles.inputPass}>

                  <TextField
                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                      placeholderStyle={styles.placeFloat} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.msg.user.confirm_new_password}
                      secureTextEntry={this.state.secureTextEntry2}
                      allowFontScaling={false}
                      onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={this.onChangeText('confirm_password')}
                    errorStyle={styles.errorStyle}
                    allowFontScaling={false}
                    validate={{
                      rules: {
                        required: true,
                        equalTo: this.state.password
                      },
                      messages: {
                        required: constants.confirm_password_not_null,
                        equalTo: constants.new_password_not_match
                      }
                    }}
                    inputStyle={styles.input}
                    autoCapitalize={"none"}
                  />
                  {
                    this.state.confirm_password ? (this.state.secureTextEntry2 ? (<TouchableOpacity style={styles.showPass} onPress={this.onShowPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 30, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                  }
                </Field>
              </Form>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity style={styles.updatePass} onPress={this.changePassword.bind(this)}>
          <Text style={styles.txbtnUpdate}>{"HOÀN THÀNH"}</Text>
        </TouchableOpacity>
      </ActivityPanel >
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  showPass:{ position: 'absolute', right: 3, top: 30, justifyContent: 'center', alignItems: 'center', },
  txbtnUpdate:{ color: '#FFF', fontSize: 17 },
  updatePass:{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
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
  inputPass: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
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
    alignSelf: 'stretch',
    paddingRight: 45,
    fontSize: 20
  },
  labelStyle: {
    paddingTop: 10,
    color: '#53657B',
    fontSize: 16
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(ResetPasswordScreen);
