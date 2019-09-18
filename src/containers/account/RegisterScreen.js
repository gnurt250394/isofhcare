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
import { DatePicker } from "native-base";
import RNAccountKit from "react-native-facebook-account-kit";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import DateTimePicker from 'mainam-react-native-date-picker';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    let user = this.props.navigation.getParam("user", null);
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);
    // var phone = this.props.navigation.getParam("phone", null);
    // var token = this.props.navigation.getParam("token", null);
    let verified = true;
    if (!user) user = {};
    user.verified = verified;
    user.press = false;
    user.pressConfirm = false;
    user.gender = 1;
    this.state = user;
  }
  setDate(newDate) {
    this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
      this.form.isValid();
    });
  }

  changeEmail() {
    let verify = async () => {
      RNAccountKit.loginWithEmail().then(async token => {
        if (!token) {
          snackbar.show(constants.register_screens.verification_fail, "danger");
        } else {
          let account = await RNAccountKit.getCurrentAccount();
          if (account && account.email) {
            this.setState({ email: account.email });
          } else {
            snackbar.show(constants.register_screens.verification_fail, "danger");
          }
        }
      });
    };
    RNAccountKit.logout()
      .then(() => {
        verify();
      })
      .catch(x => {
        verify();
      });
  }

  register() {
    if (!this.form.isValid()) {
      return;
    }
    Keyboard.dismiss();
    this.props.navigation.navigate("enterPassword", {
      user: {
        phone: this.state.phone,
        // email: this.state.email,
        fullname: this.state.fullname,
        dob: this.state.dob,
        gender: this.state.gender,
        token: this.state.token,
        socialId: this.state.socialId,
        socialType: this.state.socialType ? this.state.socialType : 1
      },
      nextScreen: this.nextScreen
    });
  }

  showDatePicker() {
    this.setState({ toggelDateTimePickerVisible: true });
  }
  onChangeText = (state) => (value) => {
    this.setState({ [state]: value })
  }
  setGender = (gender) => () => {
    this.setState({ gender, changed: true });
  }
  confirmDate = newDate => {
    this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy"), toggelDateTimePickerVisible: false }, () => {
      this.form.isValid();
    });
  }
  onCancelDate = () => {
    this.setState({ toggelDateTimePickerVisible: false })
  }
  render() {
    let maxDate = new Date();
    maxDate = new Date(
      maxDate.getFullYear() - 15,
      maxDate.getMonth(),
      maxDate.getDate()
    );
    let minDate = new Date();
    minDate = new Date(
      maxDate.getFullYear() - 150,
      maxDate.getMonth(),
      maxDate.getDate()
    );
    return (
      this.state.verified && (
        <ActivityPanel
          title={constants.register}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
            keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView behavior="padding" >
              <View style={styles.group}>
                <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={styles.logo} />
                <Form ref={ref => (this.form = ref)}>
                  <TextField
                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                      placeholderStyle={styles.placeFloat} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Họ tên"}
                      onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={this.onChangeText('fullname')}
                    errorStyle={styles.errorStyle}
                    validate={{
                      rules: {
                        required: true,
                        maxlength: 255
                      },
                      messages: {
                        required: constants.msg.user.fullname_not_null,
                        maxlength: constants.msg.user.text_without_255
                      }
                    }}
                    autoCapitalize={"none"}
                  />

                  <Field
                    style={styles.fieldDate}
                  >
                    <TextField
                      value={this.state.date || ""}
                      onPress={this.showDatePicker.bind(this)}
                      dateFormat={"dd/MM/yyyy"}
                      splitDate={"/"}
                      editable={false}
                      getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                        editable={false}
                        placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.dob}
                        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                      onChangeText={this.onChangeText('date')}
                      errorStyle={styles.errorStyle}
                      validate={{
                        rules: {
                          date: true,
                          max: maxDate,
                          min: minDate
                        },
                        messages: {
                          date: constants.msg.user.enter_the_correct_date_format,
                          max: constants.msg.user.date_not_allow_under_15_old,
                          min: constants.msg.user.date_not_allow_over_150_old
                        }
                      }}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      autoCorrect={false}
                      style={{
                        flex: 1
                      }}
                    />
                    <ScaleImage source={require("@images/new/calendar.png")} width={20} style={[styles.imgCalendar, { top: this.state.date ? 40 : 40 }]} />
                  </Field>
                  <View
                    style={styles.containerGender}
                  >
                    <Text style={[styles.label]}>{constants.gender}</Text>
                    <View style={styles.groupButtonGender}>
                      <TouchableOpacity
                        onPress={this.setGender(1)}
                        style={styles.buttonSelectGender}
                      >
                        <View style={styles.selectGender}>
                          {
                            this.state.gender == 1 && <View style={styles.dotSelect}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>{constants.actionSheet.male}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={this.setGender(0)}
                        style={styles.buttonSelectGender}
                      >
                        <View style={styles.selectGender}>
                          {
                            this.state.gender == 0 && <View style={styles.dotSelect}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>{constants.actionSheet.female}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </Form>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          <TouchableOpacity style={styles.buttonContinue} onPress={this.register.bind(this)}>
            <Text style={styles.txtContinue}>{constants.continue}</Text>
          </TouchableOpacity>

          <DateTimePicker
            isVisible={this.state.toggelDateTimePickerVisible}
            onConfirm={this.confirmDate}
            onCancel={this.onCancelDate}
            date={new Date()}
            minimumDate={minDate}
            maximumDate={new Date()}
            cancelTextIOS={constants.actionSheet.cancel2}
            confirmTextIOS={constants.actionSheet.confirm}
            date={this.state.dob || new Date()}
          />
        </ActivityPanel >
      )
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  placeFloat: {
    fontSize: 16,
    fontWeight: '200'
  },
  txtContinue: {
    color: '#FFF',
    fontSize: 17
  },
  buttonContinue: {
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
  dotSelect: {
    width: 12,
    height: 12,
    backgroundColor: '#02C39A',
    borderRadius: 6
  },
  selectGender: {
    width: 19,
    height: 19,
    borderWidth: 2,
    borderColor: '#02C39A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonSelectGender: {
    padding: 10,
    flexDirection: "row"
  },
  groupButtonGender: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    flex: 1
  },
  containerGender: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop: 25
  },
  imgCalendar: {
    position: 'absolute',
    right: 0,
  },
  fieldDate: {
    flexDirection: 'row',
    alignItems: "center",
    position: 'relative'
  },
  logo: {
    marginTop: 50,
    alignSelf: 'center'
  },
  group: { flex: 1, padding: 20 },
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
export default connect(mapStateToProps)(RegisterScreen);
