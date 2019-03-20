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
          snackbar.show("Xác minh email không thành công", "danger");
        } else {
          let account = await RNAccountKit.getCurrentAccount();
          if (account && account.email) {
            this.setState({ email: account.email });
          } else {
            snackbar.show("Xác minh email không thành công", "danger");
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
          style={{ flex: 1 }}
          title="Đăng ký"
          showFullScreen={true}
        >
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
            <KeyboardAvoidingView behavior="padding" style={styles.form}>
              <View style={{ flex: 1, padding: 20 }}>
                <Form ref={ref => (this.form = ref)}>
                  <TextField
                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                      placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Họ tên"}
                      onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={s => {
                      this.setState({ fullname: s });
                    }}
                    errorStyle={styles.errorStyle}
                    validate={{
                      rules: {
                        required: true,
                        maxlength: 255
                      },
                      messages: {
                        required: "Họ tên không được bỏ trống!",
                        maxlength: "Không được nhập quá 255 kí tự"
                      }
                    }}

                    placeholder={constants.input_password}
                    autoCapitalize={"none"}
                  />

                  <Field
                    style={{
                      flexDirection: 'row',
                      alignItems: "center",
                      marginTop: 35, position: 'relative'
                    }}
                  >
                    <TextField
                      value={this.state.date || ""}
                      onPress={() => {
                        this.setState({ toggelDateTimePickerVisible: true });
                      }}
                      dateFormat={"dd/MM/yyyy"}
                      splitDate={"/"}
                      editable={false}
                      errorStyle={styles.errorStyle}
                      validate={{
                        rules: {
                          date: true,
                          max: maxDate,
                          min: minDate
                        },
                        messages: {
                          date: "Nhập đúng định dạng ngày",
                          max: "Không cho phép chọn dưới 15 tuổi",
                          min: "Không cho phép chon trên 150 tuổi"
                        }
                      }}
                      inputStyle={{
                        backgroundColor: "#FFF",
                        color: "#006ac6",
                        borderBottomWidth: 2,
                        borderBottomColor: "#02C39A",

                        color: "#53657B",
                        fontWeight: "600",
                        fontSize: 20
                      }}
                      onChangeText={s => {
                        this.setState({ date: s });
                      }}
                      placeholder={constants.dob}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      autoCorrect={false}
                      style={{
                        flex: 1
                      }}
                    />
                    <ScaleImage source={require("@images/new/calendar.png")} width={20} style={{ position: 'absolute', right: 0, top: 10 }} />
                  </Field>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: "center",
                      marginTop: 25
                    }}
                  >
                    <Text style={[styles.label]}>Giới tính</Text>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ gender: 1, changed: true });
                        }}
                        style={{ padding: 10, flexDirection: "row" }}
                      >
                        <View style={{ width: 19, height: 19, borderWidth: 2, borderColor: '#02C39A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                          {
                            this.state.gender == 1 && <View style={{ width: 12, height: 12, backgroundColor: '#02C39A', borderRadius: 6 }}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>Nam</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ gender: 0, changed: true });
                        }}
                        style={{ padding: 10, flexDirection: "row" }}
                      >
                        <View style={{ width: 19, height: 19, borderWidth: 2, borderColor: '#02C39A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                          {
                            this.state.gender == 0 && <View style={{ width: 12, height: 12, backgroundColor: '#02C39A', borderRadius: 6 }}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>Nữ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </Form>
              </View>
              <TouchableOpacity style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center' }} onPress={this.register.bind(this)}>
                <Text style={{ color: '#FFF', fontSize: 20, textTransform: 'uppercase' }}>{"TIẾP TỤC"}</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
          <DateTimePicker
            isVisible={this.state.toggelDateTimePickerVisible}
            onConfirm={newDate => {
              this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy"), toggelDateTimePickerVisible: false }, () => {
                this.form.isValid();
              });
            }}
            onCancel={() => {
              this.setState({ toggelDateTimePickerVisible: false })
            }}
            date={new Date()}
            minimumDate={minDate}
            maximumDate={new Date()}
            cancelTextIOS={"Hủy bỏ"}
            confirmTextIOS={"Xác nhận"}
            date={this.state.dob || new Date()}
          />
        </ActivityPanel>
      )
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
export default connect(mapStateToProps)(RegisterScreen);
