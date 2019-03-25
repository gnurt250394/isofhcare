import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import Dimensions from 'Dimensions';
import { View, Text, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Animated, Easing, Platform, Image, ImageBackground, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import eyeImg from '@images/eye_black.png';
import ButtonSubmit from '@components/ButtonSubmit';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import FloatingLabel from 'mainam-react-native-floating-label';
import connectionUtils from '@utils/connection-utils';
class ProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            showPass: true,
            press: false,
            user: this.props.userApp
        }
    }

    showPass() {
        this.state.press === false ? this.setState({ showPass: false, press: true }) : this.setState({ showPass: true, press: false });
    }

    change() {
        const { user } = this.state;
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        connectionUtils.isConnected().then(s => {
            this.setState({ isLoading: true }, () => {
                userProvider.changePassword(user.currentUser.id, this.state.passwordOld, this.state.passwordNew).then(s => {
                    this.setState({ isLoading: false });
                    switch (s.code) {
                        case 0:
                            snackbar.show(constants.msg.user.change_password_success, 'success');
                            this.props.navigation.navigate('home');
                            return;
                        case 2:
                            snackbar.show(constants.msg.user.change_password_success_old_password_incorrect, 'danger');
                            break
                        default:
                            snackbar.show(constants.msg.user.change_password_not_success, 'danger');
                            break
                    }
                }).catch(e => {
                    this.setState({ isLoading: false });
                    snackbar.show(constants.msg.user.change_password_not_success, 'danger');
                });
            })

        }).catch(e => {
            snackbar.show("Không có kết nối mạng", "danger");
        })
    }

    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }} title="Đổi mật khẩu"
                titleStyle={{ textAlign: 'left', marginLeft: 20 }}
                touchToDismiss={true}
                showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
                    <KeyboardAvoidingView behavior="padding" style={styles.form}>
                        <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={{ marginTop: 50, alignSelf: 'center' }} />
                        <View style={{ flex: 1, padding: 30 }}>
                            <Form ref={ref => (this.form = ref)} style={{ marginTop: 10 }}>
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Nhập mật khẩu cũ"}
                                        secureTextEntry={true}
                                        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => {
                                        this.setState({ passwordOld: s });
                                    }}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 8
                                        },
                                        messages: {
                                            required: "Vui lòng nhập đầy đủ thông tin!",
                                            minlength: "Mật khẩu dài ít nhất 8 ký tự"
                                        }
                                    }}
                                    placeholder={constants.input_password}
                                    autoCapitalize={"none"}
                                />
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.input_password}
                                        secureTextEntry={true}
                                        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => {
                                        this.setState({ passwordNew: s });
                                    }}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 8
                                        },
                                        messages: {
                                            required: "Vui lòng nhập đầy đủ thông tin!",
                                            minlength: "Mật khẩu dài ít nhất 8 ký tự"
                                        }
                                    }}
                                    placeholder={constants.input_password}
                                    autoCapitalize={"none"}
                                />
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Xác nhận mật khẩu mới"}
                                        secureTextEntry={true}
                                        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => {
                                        this.setState({ confirm_password: s });
                                    }}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            equalTo: this.state.passwordNew,
                                            minlength: 8
                                        },
                                        messages: {
                                            required: "Vui lòng nhập đầy đủ thông tin!",
                                            minlength: "Xác nhận mật khẩu dài ít nhất 8 kí tự",
                                            equalTo: 'Mật khẩu và xác nhận mật khẩu không giống nhau'
                                        }
                                    }}
                                    placeholder={constants.input_password}
                                    autoCapitalize={"none"}
                                />
                            </Form>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <TouchableOpacity onPress={this.change.bind(this)} style={{ backgroundColor: 'rgb(2,195,154)', marginBottom: 30, alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#FFF', fontSize: 20 }}>{"CẬP NHẬT"}</Text>
                </TouchableOpacity>
            </ActivityPanel>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
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
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ProfileScreen);