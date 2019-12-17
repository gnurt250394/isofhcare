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
import redux from "@redux-store";
import ScaleImage from "mainam-react-native-scaleimage";
import stringUtils from "mainam-react-native-string-utils";
import dateUtils from "mainam-react-native-date-utils";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import Field from "mainam-react-native-form-validate/Field";

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
            case 9:
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

  getComponent = (value, onChangeText, onFocus, onBlur, placeholderTextColor) => {
    return (
      <FloatingLabel
        placeholderStyle={styles.placeFloat}
        value={value}
        underlineColor={'#02C39A'}
        inputStyle={styles.textInputStyle}
        placeholderTextColor='#000'
        labelStyle={styles.labelStyle}
        placeholder={constants.input_password}
        secureTextEntry={this.state.secureTextPassEntry}
        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />
    )
  }
  onChangeText = (state) => (value) => {
    this.setState({ [state]: value })
  }
  render() {
    return (
      <ActivityPanel
        title={constants.register}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView behavior="padding" >
            <View style={styles.group}>
              <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={styles.imageLogo} />
              <Form ref={ref => (this.form = ref)} style={styles.form}>
                <Field style={styles.inputPass}>
                  <TextField
                    getComponent={this.getComponent}
                    onChangeText={this.onChangeText('password')}
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
                    this.state.password ? (this.state.secureTextPassEntry ? (
                      <TouchableOpacity
                        style={styles.buttonHidePass}
                        onPress={this.onShowPass}
                      >
                        <ScaleImage
                          style={styles.iconHide}
                          resizeMode={'contain'}
                          height={20}
                          source={require('@images/new/ic_hide_pass.png')}>
                        </ScaleImage>
                      </TouchableOpacity>) : (<TouchableOpacity
                        style={styles.buttonHidePass}
                        onPress={this.onShowPass}>
                        <ScaleImage style={styles.iconHide}
                          height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                  }
                </Field>
                <Field style={styles.inputPass}>
                  <TextField
                    getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                      placeholderStyle={styles.placeFloat}
                      value={value}
                      placeholderTextColor='#000'
                      underlineColor={'#02C39A'}
                      inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.change_password_screens.confirm_pass}

                      secureTextEntry={this.state.secureTextPass2Entry}
                      onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={this.onChangeText('confirm_password')}
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
                    this.state.confirm_password ? (this.state.secureTextPass2Entry ? (<TouchableOpacity
                      style={styles.buttonHidePass} onPress={this.onShowPass2}>
                      <ScaleImage
                        style={styles.iconHide}
                        resizeMode={'contain'}
                        height={20}
                        source={require('@images/new/ic_hide_pass.png')}>
                      </ScaleImage>
                    </TouchableOpacity>) : (<TouchableOpacity
                      style={styles.buttonHidePass}
                      onPress={this.onShowPass2}>
                      <ScaleImage
                        style={styles.iconHide}
                        height={20}
                        source={require('@images/new/ic_show_pass.png')}></ScaleImage>
                    </TouchableOpacity>)) : (<Field></Field>)
                  }
                </Field>
              </Form>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity style={styles.buttonFinish} onPress={this.register.bind(this)}>
          <Text style={styles.txtFinish}>{constants.finish}</Text>
        </TouchableOpacity>
      </ActivityPanel>

    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  txtFinish: {
    color: '#FFF',
    fontSize: 17
  },
  buttonFinish: {
    backgroundColor: 'rgb(2,195,154)',
    alignSelf: 'center',
    borderRadius: 6,
    width: 250,
    height: 48,
    marginTop: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  iconHide: {
    tintColor: '#7B7C7D'
  },
  buttonHidePass: {
    position: 'absolute',
    right: 3,
    top: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeFloat: {
    fontSize: 16,
    fontWeight: '200'
  },
  form: {
    marginTop: 10
  },
  imageLogo: {
    marginTop: 50,
    alignSelf: 'center'
  },
  group: {
    flex: 1,
    padding: 20
  },
  container: { flex: 1 },
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
    fontWeight: "200",
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
