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
            this.child.unPress();
            return;
        }
        userProvider.changePassword(user.currentUser.id, this.state.passwordOld, this.state.passwordNew).then(s => {
            console.log(s, e)
            alert(JSON.stringify(s));
            switch (s.code) {
                case 0:
                    snackbar.show(constants.msg.user.change_password_success, 'success');
                    this.props.navigation.navigate('home');
                    return
                    break;
                case 2:
                    this.child.unPress();
                    snackbar.show(constants.msg.user.change_password_success_old_password_incorrect, 'danger');
                    break
                default:
                    this.child.unPress();
                    snackbar.show(constants.msg.user.change_password_not_success, 'danger');
                    break
            }
        }).catch(e => {
            this.child.unPress();
            console.log(e);
            snackbar.show(constants.msg.user.change_password_not_success, 'danger');
        });
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Đổi mật khẩu" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView>
                    <KeyboardAvoidingView behavior='padding' style={styles.form}>
                        <Form ref={ref => this.form = ref}>
                            <Form style={{ width: "100%", }}>
                                <TextField errorStyle={styles.errorStyle} validate={
                                    {
                                        rules: {
                                            required: true
                                        },
                                        messages: {
                                            required: "Vui lòng nhập đầy đủ thông tin",
                                            min: "Mật khẩu dài ít nhất 8 kí tự"
                                        }
                                    }
                                }
                                    secureTextEntry={this.state.showPass}
                                    inputStyle={styles.input} style={{ marginTop: 10 }} onChangeText={(s) => this.setState({ passwordOld: s })} placeholder={"Nhập mật khẩu cũ"} autoCapitalize={'none'} />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.btnEye}
                                    onPress={this.showPass}>
                                    <Image source={eyeImg} style={styles.iconEye} />
                                </TouchableOpacity>
                            </Form>
                            <Form style={{ width: "100%", }}>
                                <TextField errorStyle={styles.errorStyle} validate={
                                    {
                                        rules: {
                                            required: true,
                                            minlength: 8
                                        },
                                        messages: {
                                            required: "Vui lòng nhập đầy đủ thông tin",
                                            minlength: "Mật khẩu dài ít nhất 8 kí tự"
                                        }
                                    }
                                }
                                    secureTextEntry={this.state.showPass}
                                    inputStyle={styles.input} style={{ marginTop: 10 }} onChangeText={(s) => this.setState({ passwordNew: s })} placeholder={"Nhập mật khẩu mới"} autoCapitalize={'none'} />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.btnEye}
                                    onPress={this.showPass}>
                                    <Image source={eyeImg} style={styles.iconEye} />
                                </TouchableOpacity>
                            </Form>
                            <Form style={{ width: "100%", }}>
                                <TextField errorStyle={styles.errorStyle} validate={
                                    {
                                        rules: {
                                            required: true,
                                            equalTo: this.state.passwordNew,
                                            minlength: 8
                                        },
                                        messages: {
                                            required: "Vui lòng nhập đầy đủ thông tin",
                                            minlength: "Mật khẩu dài ít nhất 8 kí tự",
                                            equalTo: 'Mật khẩu và xác nhận mật khẩu không giống nhau'
                                        }
                                    }
                                }
                                    secureTextEntry={this.state.showPass}
                                    inputStyle={styles.input} style={{ marginTop: 10 }} onChangeText={(s) => this.setState({ passwordNewConfirm: s })} placeholder={"Xác nhận mật khẩu mới"} autoCapitalize={'none'} />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.btnEye}
                                    onPress={this.showPass}>
                                    <Image source={eyeImg} style={styles.iconEye} />
                                </TouchableOpacity>
                            </Form>
                            <View style={{ width: 300, maxWidth: 300, paddingLeft: 20 }}>
                                <ButtonSubmit style={{ width: '100%', marginLeft: 10 }} onRef={ref => (this.child = ref)} click={() => { this.change() }} text={"Cập nhật"} />
                            </View>
                        </Form>
                    </KeyboardAvoidingView>
                </ScrollView>
            </ActivityPanel>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    form: {
        marginTop: 80,
        alignItems: 'center',
    },
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
        color: 'red',
        marginLeft: 20
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ProfileScreen);