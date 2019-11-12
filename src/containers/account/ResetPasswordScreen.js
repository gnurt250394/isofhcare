import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import Dimensions from 'Dimensions';
import { View, Text, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Platform, Image, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import eyeImg from '@images/eye_black.png';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import FloatingLabel from 'mainam-react-native-floating-label';
import connectionUtils from '@utils/connection-utils';
import ScaleImage from 'mainam-react-native-scaleimage';
import Field from "mainam-react-native-form-validate/Field";
import HeaderBar from '@components/account/HeaderBar'
const DEVICE_HEIGHT = Dimensions.get("window").height;

class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            secureTextEntry: true,
            secureTextEntry2: true
        }
    }
    componentDidMount() {

    }
    onShowPass = () => {
        this.setState({
          secureTextEntry: !this.state.secureTextEntry
        })
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
                    "Thiết lập mật khẩu mới thành công",
                    "success"
                  );
                  this.props.navigation.replace("login", {
                    nextScreen: this.nextScreen
                  });
                  return;
                case 2:
                  snackbar.show(
                    "Số điện thoại không tồn tại trong hệ thống",
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
      onShowPass2 = () => {
        this.setState({
          secureTextEntry2: !this.state.secureTextEntry2
        })
      }
    render() {
        return (
            <ImageBackground
                style={styles.container}
                source={require('@images/new/account/img_bg_login.png')}
                resizeMode={'cover'}
                resizeMethod="resize">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <HeaderBar style={styles.header}></HeaderBar>
                    <View
                        style={{
                            marginTop: 60,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ fontSize: 24, fontWeight: '800', color: '#00BA99', alignSelf: 'center' }}>THIẾT LẬP MẬT KHẨU</Text>
                        {/* <ScaleImage source={require("@images/logo.png")} width={120} /> */}
                    </View>
                    <KeyboardAvoidingView behavior="padding" >
                        <View>
                            <Form ref={ref => (this.form = ref)} style={styles.form}>
                                <Field style={styles.inputPass}>

                                    <TextField
                                        getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                            placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Nhập mật khẩu mới"}
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
                                                minlength: 8
                                            },
                                            messages: {
                                                required: constants.new_password_not_null,
                                                minlength: constants.password_length_8
                                            }
                                        }}
                                        placeholder={constants.input_password}
                                        autoCapitalize={"none"}
                                    />
                                    {
                                        this.state.password ? (this.state.secureTextEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 35, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 35, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                                    }
                                </Field>
                                <Field style={styles.inputPass}>
                                    <TextField
                                        getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                            placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Xác nhận mật khẩu mới"}
                                            secureTextEntry={this.state.secureTextEntry2}
                                            allowFontScaling={false}
                                            onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                        onChangeText={s => {
                                            this.setState({ confirm_password: s });
                                        }}
                                        errorStyle={styles.errorStyle}
                                        allowFontScaling={false}
                                        validate={{
                                            rules: {
                                                required: true,
                                                equalTo: this.state.passwordNew,
                                                minlength: 8
                                            },
                                            messages: {
                                                required: constants.confirm_new_password_not_null,
                                                minlength: constants.confirm_password_length_8,
                                                equalTo: constants.new_password_not_match
                                            }
                                        }}
                                        placeholder={constants.input_password}
                                        autoCapitalize={"none"}
                                    />
                                    {
                                        this.state.confirm_password ? (this.state.secureTextEntry2 ? (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 35, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 35, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                                    }
                                </Field>
                            </Form>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <View style={{ backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={this.changePassword.bind(this)}
                        style={styles.updatePass}>
                        <Text style={styles.txbtnUpdate}>{constants.update_to_up_case}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    header: { paddingHorizontal: 0 },
    txbtnUpdate: { color: '#FFF', fontSize: 17 },
    updatePass: { backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    container: { flex: 1, backgroundColor: '#000', height: DEVICE_HEIGHT },
    btnEye: {
        position: 'absolute',
        right: 25,
        top: 18
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.2)',
    },
    inputPass: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center'
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
        borderColor: 'rgba(155,155,155,0.7)'
    },
    errorStyle: {
        color: "red",
        marginTop: 10
    },
    textInputStyle: {
        color: "#53657B",
        fontWeight: "600",
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
    scroll: { flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20, backgroundColor: '#fff', paddingHorizontal: 20 }

});

function mapStateToProps(state) {

    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ResetPasswordScreen);