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
class VerifyPhoneNumberProfileScreen extends React.Component {
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

    this.state = {
      seconds: 90,
      countResend: 0,
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
  count = 0;
  countDownTimer = () => {
    this.setState({seconds: 90}, () => {
      this.interval = setInterval(() => {
        if (this.state.seconds > 0)
          this.setState(preState => {
            return {
              seconds: preState.seconds - 1,
            };
          });
      }, 1000);
    });
  };
  componentDidMount() {
    this.countDownTimer();
    // AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentDidUpdate() {
    if (this.state.seconds === 0) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onReSendPhone = () => {
    this.setState({countResend: this.state.countResend + 1});
    this.countDownTimer();
    let verify = this.state.verify;
    this.setState(
      {
        disabled: true,
      },
      () => {
        let profileRegistryId = this.props.navigation.getParam(
          'profileRegistryId',
          null,
        );
        this.setState(
          {
            isLoading: true,
          },
          () => {
            profileProvider
              .fillPhone(profileRegistryId)
              .then(res => {
                this.setState({
                  isLoading: false,
                  disabled: false,
                });
              })
              .catch(err => {
                this.setState({
                  isLoading: false,
                  disabled: false,
                });
              });
          },
        );
      },
    );
  };
  onCheckOtp = text => {
    if (text.length == 6) {
      // this.count += 1;

      connectionUtils
        .isConnected()
        .then(s => {
          let profileRegistryId = this.props.navigation.getParam(
            'profileRegistryId',
            null,
          );
          profileProvider
            .verifyFillPhone(profileRegistryId, text)
            .then(res => {
              this.setState({
                disabled: false,
              });
              this.props.navigation.navigate('listProfileUser', {
                reset: this.state.reset + 1,
              });
              snackbar.show('Thêm số điện thoại thành công', 'success');
            })
            .catch(err => {
              snackbar.show(
                'Mã xác thực đã hết hạn hoăc không đúng vui lòng nhập lại',
                'danger',
              );
            });
        })
        .catch(e => {
          snackbar.show('Không có kết nối mạng', 'danger');
        });
      return;
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
          <View style={styles.containnerHeader}>
            <Text style={styles.txtHeader}>XÁC NHẬN SỐ ĐIỆN THOẠI</Text>
            {/* <ScaleImage source={require("@images/logo.png")} width={120} /> */}
          </View>
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View style={styles.ContainerHelp}>
              <Text style={styles.txtHelp}>
                Vui lòng nhập mã xác thực được gửi tới {`\n`} số điện thoại{' '}
                {this.state.phone}
              </Text>
              <OtpInputs
                style={styles.input}
                clearTextOnFocus={true}
                handleChange={code => this.onCheckOtp(code)}
                numberOfInputs={6}
                inputContainerStyles={styles.inputStyle}
                inputStyles={styles.txInput}
              />
              {this.state.seconds ? (
                <Text style={styles.txTime}>
                  Vui lòng chờ{' '}
                  <Text style={styles.txCountTime}>
                    {this.state.seconds > 9
                      ? this.state.seconds
                      : '0' + this.state.seconds}{' '}
                    giây
                  </Text>{' '}
                  để gửi lại mã
                </Text>
              ) : (
                <View style={{height: 40}} />
              )}
            </View>
            {this.state.countResend == 5 ? (
              <Text style={[styles.txReSent, {color: 'red', marginTop: 10}]}>
                Bạn chỉ được chọn gửi lại mã tối đa 5 lần, xin vui lòng thử lại
                sau.
              </Text>
            ) : !this.state.seconds ? (
              <View style={{flex: 1, padding: 10}}>
                <Text style={{color: '#000', marginTop: 50, fontSize: 14}}>
                  Bạn cho rằng mình chưa nhận được mã ?
                </Text>
                <TouchableOpacity
                  style={styles.btnReSend}
                  disabled={this.state.seconds != 0}
                  onPress={this.onReSendPhone}>
                  <Text style={styles.txBtnReSend}>Gửi lại mã</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </KeyboardAvoidingView>
          <View style={{height: 50}} />
        </ScrollView>
      </ActivityPanel>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  txtHelp: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 50,
    color: '#000000',
  },
  ContainerHelp: {
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: '#808080',
    borderRadius: 10,
    paddingTop: 30,
    alignSelf: 'center',
  },
  txtHeader: {
    fontSize: 24,
    fontWeight: '500',
    color: '#00BA99',
    alignSelf: 'center',
  },
  containnerHeader: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    color: '#000000',
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
    paddingHorizontal: 10,
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
export default connect(mapStateToProps)(VerifyPhoneNumberProfileScreen);
