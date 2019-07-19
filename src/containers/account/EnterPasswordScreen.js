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
    user.secureTextPassEntry = true
    user.secureTextPass2Entry = true
    this.state = user;
    this.showPass = this.showPass.bind(this);
    this.showPassConfirm = this.showPassConfirm.bind(this);
  }
  setDate(newDate) {
    this.setState({ dob: newDate });
  }
  onShowPass = () => {
		this.setState({
			secureTextPassEntry: !this.state.secureTextPassEntry
		})
  }
  onShowPass2 = () => {
		this.setState({
			secureTextPass2Entry: !this.state.secureTextPass2Entry
		})
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
            case 9:
              debugger;
              var user = s.data.user;
              user.bookingNumberHospital = s.data.bookingNumberHospital;
              user.bookingStatus = s.data.bookingStatus;
              if (s.data.profile && s.data.profile.uid)
                user.uid = s.data.profile.uid;
              this.props.dispatch(redux.userLogin(user));
              if (this.nextScreen) {
                this.props.navigation.replace(
                  this.nextScreen.screen,
                  this.nextScreen.param
                );
              } else this.props.navigation.navigate("home", { showDraw: false });
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
            case 12:
              snackbar.show(constants.msg.user.account_blocked, "danger");
              return;
            case 13:
              snackbar.show(constants.msg.user.this_account_not_active, "danger");
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
        title={constants.register}
        titleStyle={{ textAlign: 'left', marginLeft: 20 }}
        showFullScreen={true}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View style={{ flex: 1, padding: 20 }}>
              <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={{ marginTop: 50, alignSelf: 'center' }} />
              <Form ref={ref => (this.form = ref)} style={{ marginTop: 10 }}>
              <View style={styles.inputPass}>
                <TextField
                  getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.input_password}
                    secureTextEntry={this.state.secureTextPassEntry}
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
                      required: constants.password_not_null,
                      minlength: constants.password_length_8
                    }
                  }}
                  autoCapitalize={"none"}
                />
                {
                  this.state.password ? (this.state.secureTextPassEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass}><ScaleImage resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass}><ScaleImage height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : null
                }
                </View>
                <View style={styles.inputPass}>
                <TextField
                  getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={'Xác nhận mật khẩu'}

                    secureTextEntry={this.state.secureTextPass2Entry}
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
                      required: constants.confirm_password_not_null,
                      equalTo: constants.new_password_not_match
                    }
                  }}
                  autoCapitalize={"none"}
                />
                {
                  this.state.confirm_password ? (this.state.secureTextPass2Entry ? (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass2}><ScaleImage resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass2}><ScaleImage height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : null
                }
                </View>
              </Form>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }} onPress={this.register.bind(this)}>
          <Text style={{ color: '#FFF', fontSize: 17 }}>{constants.finish}</Text>
        </TouchableOpacity>
      </ActivityPanel>

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
    fontSize: 20,
    alignSelf: 'stretch',
    paddingRight: 45,


  },
  inputPass: {
		position: 'relative',
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
  labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(EnterPasswordScreen);
