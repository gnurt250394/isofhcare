import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import constants from '@resources/strings';
import userProvider from '@data-access/user-provider';
import snackbar from '@utils/snackbar-utils';
import {connect} from 'react-redux';
import profileProvider from '@data-access/profile-provider';
import connectionUtils from '@utils/connection-utils';
import HeaderBar from '@components/account/HeaderBar';
import InputOtp from '@components/account/InputOtp';
import redux from '@redux-store';
import ActivityPanel from '@components/ActivityPanel';
import OtpInputs from 'react-native-otp-inputs';
import firebaseUtils from '@utils/firebase-utils';

const DEVICE_HEIGHT = Dimensions.get('window').height;
//props: verify
//case 1 : regiter
//case 2 : fogot password
//case 3 : create profile
//case 4 : add phone
class VerifyPhoneNumberScreen extends React.Component {
  constructor(props) {
    super(props);
    let phone =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.phone
        ? this.props.navigation.state.params.phone
        : null;
    let id =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.id
        ? this.props.navigation.state.params.id
        : null;
    this.nextScreen = this.props.navigation.getParam('nextScreen', null);
    console.log('this.nextScreen: ', this.nextScreen);
    this.state = {
      seconds: 90,
      txErr: '',
      reset: 2,
      phone,
      id,
      verify:
        this.props.navigation.state.params &&
        this.props.navigation.state.params.verify
          ? this.props.navigation.state.params.verify
          : null,
      isCheck: true,
      // appState: AppState.currentState,
    };
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.seconds > 0)
        this.setState(preState => {
          return {
            seconds: preState.seconds - 1,
          };
        });
    }, 1000);
    // AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  // setInterval = () => {
  //     setInterval(() => {
  //         if (this.state.seconds > 0)
  //             this.setState(preState => {
  //                 return {
  //                     seconds: preState.seconds - 1
  //                 }
  //             })
  //     }, 1000);
  // }
  // componentWillUnmount() {
  //     AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  // _handleAppStateChange = (nextAppState) => {
  //
  //     if (
  //         nextAppState === 'background'
  //     ) {
  //         this.a = setInterval(() => {
  //             let { seconds } = this.state
  //
  //             if (seconds > 0)
  //                 this.setState(preState => {
  //                     return {
  //                         seconds: preState.seconds - 1
  //                     }
  //                 })
  //         }, 1000);
  //     } else {
  //         clearInterval(this.a)
  //     }
  //     this.setState({ appState: nextAppState });
  // };

  onReSendPhone = () => {
    let verify = this.state.verify;
    this.setState(
      {
        disabled: true,
      },
      () => {
        connectionUtils
          .isConnected()
          .then(s => {
            switch (verify) {
              case 1:
                {
                  userProvider
                    .forgotPassword(this.state.phone.trim(), 4)
                    .then(s => {
                      this.setState({
                        disabled: false,
                      });
                      if (s.code == 0) {
                        this.setState({
                          seconds: 90,
                        });
                        snackbar.show('Mã xác thực đã được gửi lại', 'success');
                        return;
                      }
                      if (s.code == 6) {
                        this.setState({
                          countResend: true,
                        });
                        return;
                      } else {
                        snackbar.show(
                          'Có lỗi xảy ra, xin vui lòng thử lại',
                          'danger',
                        );
                      }
                    })
                    .catch(err => {
                      snackbar.show(
                        'Có lỗi xảy ra, xin vui lòng thử lại',
                        'danger',
                      );
                      this.setState({
                        disabled: false,
                      });
                    });
                }
                break;
              case 2:
                {
                  userProvider
                    .forgotPassword(this.state.phone.trim(), 2)
                    .then(s => {
                      this.setState({
                        disabled: false,
                      });
                      if (s.code == 0) {
                        this.setState({
                          seconds: 90,
                        });
                        snackbar.show('Mã xác thực đã được gửi lại', 'success');
                        return;
                      }
                      if (s.code == 6) {
                        this.setState({
                          countResend: true,
                        });
                        return;
                      } else {
                        snackbar.show(
                          'Có lỗi xảy ra, xin vui lòng thử lại',
                          'danger',
                        );
                      }
                    })
                    .catch(err => {
                      snackbar.show(
                        'Có lỗi xảy ra, xin vui lòng thử lại',
                        'danger',
                      );
                      this.setState({
                        disabled: false,
                      });
                    });
                }
                break;
              case 3:
                {
                  let id =
                    this.props.navigation.state.params &&
                    this.props.navigation.state.params.id
                      ? this.props.navigation.state.params.id
                      : null;
                  profileProvider
                    .resendOtp(id)
                    .then(res => {
                      this.setState({
                        disabled: false,
                      });
                      if (res.code == 0) {
                        this.setState({
                          seconds: 90,
                        });
                        snackbar.show('Mã xác thực đã được gửi lại', 'success');
                        return;
                      }
                      if (s.code == 6) {
                        this.setState({
                          countResend: true,
                        });
                        return;
                      } else {
                        snackbar.show(
                          'Có lỗi xảy ra, xin vui lòng thử lại',
                          'danger',
                        );
                      }
                    })
                    .catch(err => {
                      this.setState({
                        disabled: false,
                      });
                      snackbar.show(
                        'Có lỗi xảy ra, xin vui lòng thử lại',
                        'danger',
                      );
                    });
                }
                break;
              case 4:
                {
                  let dataOld = this.props.navigation.getParam('dataOld', null);
                  let phone = this.props.navigation.getParam('phone', null);
                  let id = dataOld
                    ? dataOld.medicalRecords?.id
                    : this.props.userApp.currentUser.id;
                  connectionUtils
                    .isConnected()
                    .then(s => {
                      this.setState(
                        {
                          isLoading: true,
                        },
                        () => {
                          let data = {
                            phone: phone,
                          };
                          if (id) {
                            profileProvider
                              .fillPhone(data)
                              .then(res => {
                                this.setState({
                                  isLoading: false,
                                  disabled: false,
                                });
                                switch (res.code) {
                                  case 0:
                                    {
                                      this.props.navigation.replace(
                                        'verifyPhone',
                                        {verify: 4, dataOld, phone: phone},
                                      );
                                      snackbar.show(
                                        'Mã xác thực đã được gửi lại',
                                        'success',
                                      );
                                    }
                                    break;
                                  case 8:
                                    snackbar.show(
                                      'Số điện thoại đã tồn tại',
                                      'danger',
                                    );
                                    break;
                                  case 2:
                                    snackbar.show(
                                      'Bạn đang không đăng nhập với ứng dụng bệnh nhân',
                                      'danger',
                                    );
                                    break;
                                  default:
                                    snackbar.show(
                                      'Có lỗi xảy ra, xin vui lòng thử lại',
                                      'danger',
                                    );
                                    break;
                                }
                              })
                              .catch(err => {
                                this.setState({
                                  isLoading: false,
                                  disabled: false,
                                });
                              });
                          }
                        },
                      );
                    })
                    .catch(e => {
                      this.setState({
                        isLoading: false,
                        disabled: false,
                      });
                      snackbar.show(constants.msg.app.not_internet, 'danger');
                    });
                }
                break;
            }
          })
          .catch(e => {
            this.setState({
              disabled: false,
            });
            snackbar.show(constants.msg.app.not_internet, 'danger');
          });
      },
    );
  };
  // getDetails = (token) => {
  //     userProvider.getDetailsUser().then(res => {
  //         let user = res.details
  //         user.loginToken = token
  //         let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
  //         if (callback) {
  //             callback(user);
  //             this.props.navigation.pop();
  //         }
  //     })

  // }
  onCheckOtp = text => {
    let verify = this.state.verify;
    // let text1 = data && (data.text1 || data.text1 == 0) ? data.text1.toString() : ''
    // let text2 = data && (data.text2 || data.text2 == 0) ? data.text2.toString() : ''
    // let text3 = data && (data.text3 || data.text3 == 0) ? data.text3.toString() : ''
    // let text4 = data && (data.text4 || data.text4 == 0) ? data.text4.toString() : ''
    // let text5 = data && (data.text5 || data.text5 == 0) ? data.text5.toString() : ''
    // let text6 = data && (data.text6 || data.text6 == 0) ? data.text6.toString() : ''
    // let text = text1.concat(text2).concat(text3).concat(text4).concat(text5).concat(text6)
    if (this.state.isCheck && text.length == 6) {
      if (text.length == 6 && verify) {
        connectionUtils
          .isConnected()
          .then(s => {
            if (this.state.verify == 1) {
              userProvider
                .checkOtpPhone(this.state.id, text)
                .then(res => {
                  if (res.code == 0) {
                    firebaseUtils.sendEvent('Signup_done');
                    snackbar.show('Đăng ký thành công', 'success');
                    let user = res.data.user;
                    this.setState({
                      isCheck: false,
                    });
                    if (this.nextScreen) {
                      this.props.navigation.replace(
                        this.nextScreen.screen,
                        this.nextScreen.param,
                      );
                    } else
                      this.props.navigation.navigate('home', {showDraw: false});
                    this.props.dispatch(redux.userLogin(user));
                    return;
                  }
                  if (res.code == 3) {
                    snackbar.show('Mã xác thực không đúng', 'danger');
                    return;
                  }
                  if (res.code == 4) {
                    snackbar.show('Mã xác thực hết hạn', 'danger');
                    return;
                  } else {
                    snackbar.show(
                      'Có lỗi xảy ra, xin vui lòng thử lại',
                      'danger',
                    );
                  }
                })
                .catch(err => {
                  console.log('err: ', err);
                  snackbar.show(
                    'Có lỗi xảy ra, xin vui lòng thử lại',
                    'danger',
                  );
                });
              return;
            }

            if (this.state.verify == 2) {
              userProvider.confirmCode(this.state.phone, text, (s, e) => {
                if (s) {
                  switch (s.code) {
                    case 0:
                      {
                        snackbar.show(
                          constants.msg.user.confirm_code_success,
                          'success',
                        );
                        this.props.navigation.replace('resetPassword', {
                          user: s.data.user,
                          phone: this.state.phone.trim(),
                          otp: text,
                          nextScreen: this.nextScreen,
                        });
                      }
                      break;
                    case 2:
                      snackbar.show('Mã xác thực không đúng', 'danger');
                      break;
                    case 4:
                      snackbar.show('Mã xác thực hết hạn', 'danger');
                      break;
                  }
                  return;
                }
                if (e) {
                  snackbar.show(
                    constants.msg.user.confirm_code_not_success,
                    'danger',
                  );
                }
              });
              return;
            }
            if (this.state.verify == 3) {
              if (text && this.state.id) {
                profileProvider
                  .checkOtp(text, this.state.id)
                  .then(res => {
                    if (res.code == 0) {
                      this.props.navigation.replace('shareDataProfile', {
                        id: res.data.record.id,
                      });
                      return;
                    }
                    if (res.code == 4) {
                      snackbar.show('Mã bạn nhập đã hết hạn', 'danger');
                      return;
                    }
                    if (res.code == 5) {
                      snackbar.show('Mã bạn nhập không đúng', 'danger');
                      return;
                    } else {
                      snackbar.show(
                        'Có lỗi xảy ra, xin vui lòng thử lại',
                        'danger',
                      );
                    }
                  })
                  .catch(err => {
                    console.log(err, 'errr');
                  });
                return;
              }
            }
            if (this.state.verify == 4) {
              let data = {
                otp: text,
              };
              let dataOld = this.props.navigation.getParam('dataOld', null);
              profileProvider
                .verifyFillPhone(data)
                .then(res => {
                  this.setState({
                    disabled: false,
                  });
                  if (res.code == 0) {
                    if (dataOld) {
                      this.props.navigation.replace('profile', {
                        id: dataOld?.medicalRecords?.id,
                      });
                    } else {
                      let user = this.props.userApp.currentUser;
                      user.phone = this.props.navigation.getParam('phone');
                      user.requestInputPhone = false;
                      this.props.dispatch(redux.userLogin(user));
                      this.props.navigation.pop();
                    }
                    snackbar.show('Thêm số điện thoại thành công', 'success');
                  } else if (res.code == 4) {
                    snackbar.show('Mã xác thực không đúng');
                    return;
                  }
                })
                .catch(err => {
                  snackbar.show(
                    'Có lỗi xảy ra, xin vui lòng thử lại',
                    'danger',
                  );
                });
            }
          })
          .catch(e => {
            snackbar.show('Không có kết nối mạng', 'danger');
          });
        return;
      }
    }
  };

  render() {
    return (
      <ActivityPanel
        style={{flex: 1}}
        hideActionbar={true}
        transparent={true}
        useCard={true}
        titleStyle={{textAlign: 'left', marginLeft: 20}}
        showFullScreen={true}
        isLoading={this.state.isLoading}
        containerStyle={{marginTop: 50}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <HeaderBar />
          <View
            style={{
              marginTop: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '500',
                color: '#00BA99',
                alignSelf: 'center',
              }}>
              XÁC NHẬN SỐ ĐIỆN THOẠI
            </Text>
            {/* <ScaleImage source={require("@images/logo.png")} width={120} /> */}
          </View>
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View
              style={{
                borderWidth: 0.5,
                borderStyle: 'solid',
                borderColor: '#808080',
                borderRadius: 10,
                paddingTop: 30,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  marginBottom: 50,
                  color: '#000000',
                }}>
                Vui lòng nhập mã xác thực được gửi tới {`\n`} số điện thoại{' '}
                {this.state.phone}
              </Text>
              {/* <Form ref={ref => (this.form = ref)}>
                                <TextInput
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 6,
                                            maxlength: 6
                                        },
                                        messages: {
                                            required: "Vui lòng nhập mã OTP",
                                            minlength: "Yêu cầu nhập đúng 6 ký tự",
                                            maxlength: "Yêu cầu nhập đúng 6 ký tự"
                                        }
                                    }}
                                    inputStyle={styles.input}
                                    onChangeText={(text) => {
                                        debugger;
                                        this.handleTextChange(text)
                                    }}
                                    placeholder={constants.input_code}
                                    autoCapitalize={"none"}
                                    keyboardType="numeric"
                                    autoCorrect={false}
                                />
                            </Form> */}
              <OtpInputs
                style={styles.input}
                clearTextOnFocus={true}
                handleChange={code => this.onCheckOtp(code)}
                numberOfInputs={6}
                inputContainerStyles={styles.inputStyle}
                inputStyles={styles.txInput}
              />
              {/* <TextInput
                                style={styles.input}
                                onChangeText={(text) => {
                                    this.handleTextChange(text)
                                }}
                                placeholder={constants.input_code}
                                autoCapitalize={"none"}
                                keyboardType="numeric"
                                autoCorrect={false}
                                maxLength={6}
                            ></TextInput> */}
              <Text style={styles.txTime}>
                Mã xác thực hiệu lực trong:{' '}
                <Text style={styles.txCountTime}>
                  {this.state.seconds > 9
                    ? this.state.seconds
                    : '0' + this.state.seconds}
                  s
                </Text>
              </Text>
            </View>
            {this.state.countResend ? (
              <Text style={[styles.txReSent, {color: 'red', marginTop: 10}]}>
                Bạn chỉ được chọn gửi lại mã tối đa 5 lần, xin vui lòng thử lại
                sau 60 phút
              </Text>
            ) : (
              <View style={{flex: 1, padding: 10}}>
                <Text style={{color: '#000', marginTop: 50, fontSize: 14}}>
                  Bạn cho rằng mình chưa nhận được mã ?
                </Text>
                <TouchableOpacity
                  style={styles.btnReSend}
                  disabled={this.state.disabled}
                  onPress={this.onReSendPhone}>
                  <Text style={styles.txBtnReSend}>Gửi lại mã</Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
          <View style={{height: 50}} />
        </ScrollView>
      </ActivityPanel>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  txInput: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    flex: 1,
  },
  inputStyle: {
    borderBottomWidth: 4,
    borderColor: '#3161AD',
    width: 38,
    height: 42,
    alignItems: 'center',
    textAlign: 'center',
  },
  textInputStyle: {},
  textInputContainer: {
    marginTop: 10,
  },
  titleStyle: {textAlign: 'left', marginLeft: 20},
  txContents: {
    color: '#333335',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  logo: {marginTop: 20, alignSelf: 'center'},
  txTime: {
    color: '#808080',
    fontStyle: 'italic',
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  txCountTime: {
    color: '#808080',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 16,
  },
  txReSent: {
    color: '#000',
    fontStyle: 'italic',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
  btnFinish: {
    backgroundColor: 'rgb(2,195,154)',
    alignSelf: 'center',
    borderRadius: 6,
    width: 250,
    height: 48,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  txFinish: {color: '#FFF', fontSize: 17},
  btnReSend: {
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    height: 28,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txBtnReSend: {
    color: '#3161AD',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
    margin: 2,
  },
  txErr: {
    textAlign: 'center',
    color: 'red',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '700',
    marginTop: 20,
  },
  input: {
    maxWidth: 300,
    backgroundColor: '#FFF',
    width: DEVICE_WIDTH - 40,
    height: 42,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  picture: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  form: {
    marginTop: 60,
    alignItems: 'center',
  },
  text: {
    backgroundColor: 'transparent',
  },
  signup_section: {
    marginTop: 30,
    flex: 1,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnEye: {
    position: 'absolute',
    right: 25,
    top: 10,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  errorStyle: {
    color: 'red',
    marginLeft: 40,
  },
  scroll: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    backgroundColor: '#fff',
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    otpPhone: state.otpPhone,
  };
}
export default connect(mapStateToProps)(VerifyPhoneNumberScreen);
