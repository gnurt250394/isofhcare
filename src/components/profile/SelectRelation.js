import React, {Component, PropTypes} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  Dimensions,
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import eyeImg from '@images/eye_black.png';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import FloatingLabel from 'mainam-react-native-floating-label';
import connectionUtils from '@utils/connection-utils';
import ScaleImage from 'mainam-react-native-scaleimage';
import Field from 'mainam-react-native-form-validate/Field';
import HeaderBar from '@components/account/HeaderBar';
const DEVICE_HEIGHT = Dimensions.get('window').height;
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '@navigators/NavigationService';
import Modal from 'react-native-modal';
import profileProvider from '@data-access/profile-provider';
import redux from '@redux-store';
import objectUtils from '@utils/object-utils';

class SelectRelation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      secureTextEntry: true,
      secureTextEntry2: true,
      isVisible: this.props.isVisible,
    };
  }
  componentDidMount() {
    this.getListRelations();
  }
  getListRelations = () => {
    profileProvider
      .getListRelations()
      .then(res => {
        this.setState({
          listRelation: res,
        });
      })
      .catch(err => {});
  };
  onBackdropPress = () => {
    this.setState({
      isVisible: false,
    });
  };
  onShowPass = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible) {
      this.setState({
        isVisible: true,
      });
    }
  }
  changePassword() {
    Keyboard.dismiss();
    if (!this.form.isValid()) {
      return;
    }
    connectionUtils
      .isConnected()
      .then(s => {
        this.setState(
          {
            isLoading: true,
            disabled: true,
          },
          () => {
            userProvider
              .forgotPassword(this.state.phone.trim(), 2)
              .then(s => {
                switch (s.code) {
                  case 0:
                    NavigationService.navigate('verifyPhone', {
                      phone: this.state.phone,
                      verify: 2,
                    });
                    break;
                  case 2:
                    snackbar.show('Số điện thoại chưa được đăng ký', 'danger');
                    break;
                  case 6:
                    NavigationService.navigate('verifyPhone', {
                      phone: this.state.phone,
                      verify: 2,
                    });
                    break;
                }
              })
              .catch(err => {
                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại.', 'danger');
              });
            this.setState({
              isLoading: false,
              disabled: false,
            });
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
  onShowPass2 = () => {
    this.setState({
      secureTextEntry2: !this.state.secureTextEntry2,
    });
  };
  onSelectRelation = () => {
    this.props.onSelectRelation(
      this.state.listRelation[this.state.indexSelect],
    );
  };
  goHome = () => {
    NavigationService.navigate('homeTab', {showDraw: false});
    this.setState({
      isVisible: false,
    });
  };
  onSelect = index => {
    console.log('index: ', index);
    this.setState({
      indexSelect: index,
    });
  };
  renderItem = ({item, index}) => {
    return (
      <View style={styles.viewItem}>
        <TouchableOpacity
          onPress={() => this.onSelect(index)}
          style={styles.btnSelect}>
          {index == this.state.indexSelect ? (
            <ScaleImage
              height={18}
              source={require('@images/new/profile/ic_checkbox_checked.png')}
            />
          ) : (
            <ScaleImage
              source={require('@images/new/profile/ic_checkbox_uncheck.png')}
              height={18}
            />
          )}
          <Text style={styles.txRole}>{objectUtils.renderTextRelations(item)}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.scroll}>
        <View style={styles.viewTxTittle}>
          <Text style={styles.txPhone}>QUAN HỆ VỚI CHỦ TÀI KHOẢN</Text>
        </View>
        <View style={styles.form}>
          <FlatList
            data={this.state.listRelation}
            extraData={this.state}
            numColumns={2}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{backgroundColor: '#fff'}}>
          <TouchableOpacity
            onPress={this.onSelectRelation}
            style={styles.updatePass}>
            {this.state.disabled ? (
              <ActivityIndicator size={'small'} color="#fff" />
            ) : (
              <Text style={styles.txbtnUpdate}>{'XÁC NHẬN'}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* <View style={{ height: 50 }}></View> */}
      </View>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  form: {marginTop: 20, alignItems: 'center'},
  placeholderStyle: {fontSize: 16, fontWeight: '300'},
  txPhone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BA99',
    alignSelf: 'center',
  },
  viewTxTittle: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    color: '#3161AD',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 0,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 49,
    alignSelf: 'center',
    padding: 5,
  },
  header: {paddingHorizontal: 0},
  txbtnUpdate: {color: '#FFF', fontSize: 17},
  updatePass: {
    backgroundColor: 'rgb(2,195,154)',
    alignSelf: 'center',
    borderRadius: 6,
    width: 250,
    height: 48,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  container: {flex: 1, backgroundColor: '#000', height: DEVICE_HEIGHT},
  btnEye: {
    position: 'absolute',
    right: 25,
    top: 18,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  inputPass: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  input: {
    maxWidth: 300,
    paddingRight: 30,
    backgroundColor: '#FFF',
    width: DEVICE_WIDTH - 40,
    height: 42,
    marginHorizontal: 20,
    paddingLeft: 15,
    borderRadius: 6,
    color: '#006ac6',
    borderWidth: 1,
    borderColor: 'rgba(155,155,155,0.7)',
  },
  errorStyle: {
    color: 'red',
    marginTop: 10,
  },
  textInputStyle: {
    color: '#000',
    fontWeight: '300',
    height: 51,
    marginLeft: 0,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderColor: '#CCCCCC',
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 45,
  },
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  scroll: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    width: '100%',
  },
  txContent: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000000',
    marginTop: 15,
  },
  btnSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 5,
    width: '50%',
  },
  txRole: {
    marginLeft: 10,
  },
  viewItem: {
    width: '50%',
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    navigation: state.navigation,
  };
}
export default connect(mapStateToProps)(SelectRelation);
