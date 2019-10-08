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
import connectionUtils from "@utils/connection-utils";

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    let user
    //  = this.props.navigation.getParam("user", null);
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);
    // var phone = this.props.navigation.getParam("phone", null);
    // var token = this.props.navigation.getParam("token", null);
    let phone = this.props.navigation.state.params && this.props.navigation.state.params.phone ? this.props.navigation.state.params.phone : ''
    let verified = true;
    if (!user) user = {};
    user.verified = verified;
    user.press = false;
    user.pressConfirm = false;
    user.gender = 1;
    user.showPass = true;
    user.showPassConfirm = true;
    user.press = false;
    user.pressConfirm = false;
    user.secureTextPassEntry = true
    user.secureTextPass2Entry = true
    user.phone = phone
    this.state = user
    this.showPass = this.showPass.bind(this);
    this.showPassConfirm = this.showPassConfirm.bind(this);
  }
  setDate(newDate) {
    this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
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

  // register() {
  //   if (!this.form.isValid()) {
  //     return;
  //   }
  //   Keyboard.dismiss();
  //   this.props.navigation.navigate("enterPassword", {
  //     user: {
  //       phone: this.state.phone,
  //       // email: this.state.email,
  //       fullname: this.state.fullname,
  //       dob: this.state.dob,
  //       gender: this.state.gender,
  //       token: this.state.token,
  //       socialId: this.state.socialId,
  //       socialType: this.state.socialType ? this.state.socialType : 1
  //     },
  //     nextScreen: this.nextScreen
  //   });
  // }
  ////
  onRegiter = () => {
    if (!this.form.isValid()) {
      return;
    }
    Keyboard.dismiss();
    let dateBirth = this.state.dob.format('yyyy-MM-dd HH:mm:ss')
    let gender = this.state.gender
    let name = this.state.fullname
    let phone = this.state.phone
    let password = this.state.password
    connectionUtils.isConnected().then(s => {
      this.setState({
        isLoading: true
      }, () => {
        userProvider.register(name, phone, password, dateBirth, gender).then(res => {
          if (res.code == 0) {
            this.setState({
              isLoading: false
            })
            this.props.navigation.navigate("verifyPhone", {
              user: res.data.user,
              id: res.data.user.id,
              phone: phone,
              verify: 1,
              onSelected: (user) => {
                if (!user || !this.state.user || user.id != this.state.user.id) {
                  this.props.dispatch(redux.userLogin(user));
                  if (this.nextScreen) {
                    this.props.navigation.replace(
                      this.nextScreen.screen,
                      this.nextScreen.param
                    );
                  } else this.props.navigation.navigate("home", { showDraw: false });
                } else {
                  this.setState({ user, userError });
                }

              }
            })
          } else {
            this.setState({
              isLoading: false
            })
            snackbar.show(res.message, 'danger')
          }

        }).catch(e => {
          console.log(e, 'đâsđâsd')
          snackbar.show(constants.msg.app.not_internet, "danger");
        });
      })

    }

    )

  }


  //
  showDatePicker() {
    this.setState({ toggelDateTimePickerVisible: true });
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
          titleStyle={{ textAlign: 'left', marginLeft: 20 }}
          showFullScreen={true}
          isLoading={this.state.isLoading}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView behavior="padding" style={styles.form}>
              <View style={{ flex: 1, padding: 20 }}>
                <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={{ marginTop: 50, alignSelf: 'center' }} />
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
                        required: "Họ tên không được bỏ trống",
                        maxlength: "Không được nhập quá 255 kí tự"
                      }
                    }}
                    autoCapitalize={"none"}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: "center",
                      marginTop: 25
                    }}
                  >
                    <Text style={[{ fontSize: 16, fontWeight: '200' }]}>Giới tính</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end', flex: 1 }}>
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
                  <TextField
                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                      keyboardType='numeric'
                      placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={this.state.phone || value} underlineColor={'#02C39A'}
                      inputStyle={styles.textInputStyle}
                      labelStyle={styles.labelStyle} placeholder={constants.phone} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={s => this.setState({ phone: s })}
                    errorStyle={styles.errorStyle}
                    validate={{
                      rules: {
                        required: true,
                        phone: true
                      },
                      messages: {
                        required: "Số điện thoại không được bỏ trống",
                        phone: "SĐT không hợp lệ"
                      }
                    }}

                    placeholder={constants.input_password}
                    autoCapitalize={"none"}
                  />
                  <Field
                    style={{
                      flexDirection: 'row',
                      alignItems: "center",
                      position: 'relative'
                    }}
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
                      onChangeText={s => {
                        this.setState({ date: s });
                      }}
                      errorStyle={styles.errorStyle}
                      validate={{
                        rules: {
                          date: true,
                          required: true,
                          max: maxDate,
                          min: minDate
                        },
                        messages: {
                          date: "Nhập đúng định dạng ngày",
                          required: 'Ngày sinh không được bỏ trống',
                          max: "Không cho phép chọn dưới 15 tuổi",
                          min: "Không cho phép chọn trên 150 tuổi"
                        }
                      }}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      autoCorrect={false}
                      style={{
                        flex: 1
                      }}
                    />
                    <ScaleImage source={require("@images/new/calendar.png")} width={20} style={{ position: 'absolute', right: 0, top: this.state.date ? 40 : 40 }} />
                  </Field>

                  <Field style={styles.inputPass}>
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
                      this.state.password ? (this.state.secureTextPassEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                    }
                  </Field>
                  <Field style={styles.inputPass}>
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
                      this.state.confirm_password ? (this.state.secureTextPass2Entry ? (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 40, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                    }
                  </Field>
                </Form>
                <View style={{ height: 50 }}></View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          <TouchableOpacity onPress={this.onRegiter} style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }} >
            <Text style={{ color: '#FFF', fontSize: 17 }}>{"TIẾP TỤC"}</Text>
          </TouchableOpacity>

          <DateTimePicker
            isVisible={this.state.toggelDateTimePickerVisible}
            onConfirm={newDate => {
              this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy"), toggelDateTimePickerVisible: false }, () => {
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
  labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 },
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
  textInputPassStyle: {
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

});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(RegisterScreen);
