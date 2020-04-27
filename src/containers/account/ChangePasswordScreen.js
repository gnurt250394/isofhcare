import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Dimensions, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Platform, Image, Keyboard } from 'react-native';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            disabled: false,
            secureTextOldEntry: true,
            secureTextNewEntry: true,
            secureTextNew2Entry: true
        }
    }
    componentDidMount() {

    }
    onShowOldPass = () => {
        this.setState({
            secureTextOldEntry: !this.state.secureTextOldEntry
        })
    }
    onShowNewPass = () => {
        this.setState({
            secureTextNewEntry: !this.state.secureTextNewEntry
        })
    }
    onShowNewPass2 = () => {
        this.setState({
            secureTextNew2Entry: !this.state.secureTextNew2Entry
        })
    }
    change() {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        connectionUtils.isConnected().then(s => {
            this.setState({ isLoading: true, disabled: true }, () => {
                userProvider.changePassword(this.props.userApp.currentUser.id, this.state.passwordOld, this.state.passwordNew).then(s => {
                    switch (s.code) {
                        case 0:
                            snackbar.show(constants.msg.user.change_password_success, 'success');
                            this.props.navigation.navigate('home');
                            break;
                        case 2:
                            snackbar.show(constants.msg.user.change_password_success_old_password_incorrect, 'danger');
                            break
                        default:
                            snackbar.show(constants.msg.user.change_password_not_success, 'danger');
                            break
                    }
                    this.setState({ isLoading: false, disabled: false });
                }).catch(e => {
                    this.setState({ isLoading: false, disabled: false });
                    snackbar.show(constants.msg.user.change_password_not_success, 'danger');
                });
            })

        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }

    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                hideActionbar={true}
                transparent={true}
                useCard={true}
                titleStyle={{ textAlign: 'left', marginLeft: 20 }}
                showFullScreen={true}
                isLoading={this.state.isLoading}
                containerStyle={{ marginTop: 50 }}
            >
                <KeyboardAwareScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    <HeaderBar style={styles.header}></HeaderBar>
                    <View
                        style={{
                            marginTop: 60,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ fontSize: 24, fontWeight: '500', color: '#00BA99', alignSelf: 'center' }}>ĐẶT LẠI MẬT KHẨU</Text>
                        {/* <ScaleImage source={require("@images/logo.png")} width={120} /> */}
                    </View>
                    <View>
                        <Form ref={ref => (this.form = ref)} style={styles.form}>
                            <Field style={styles.inputPass}>
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '300' }} value={value} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.enter_old_password}
                                        secureTextEntry={this.state.secureTextOldEntry}
                                        placeholderTextColor='#000'
                                        allowFontScaling={false}
                                        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => {
                                        this.setState({ passwordOld: s });
                                    }}
                                    allowFontScaling={false}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 6
                                        },
                                        messages: {
                                            required: constants.old_password_not_null,
                                            minlength: constants.password_length_8
                                        }
                                    }}
                                    placeholder={constants.input_password}
                                    autoCapitalize={"none"}
                                />
                                {
                                    this.state.passwordOld ? (this.state.secureTextOldEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 35, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowOldPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 35, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowOldPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                                }
                            </Field>
                            <Field style={styles.inputPass}>

                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '300' }} value={value} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Nhập mật khẩu mới"}
                                        secureTextEntry={this.state.secureTextNewEntry}
                                        allowFontScaling={false}
                                        placeholderTextColor='#000'
                                        onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                    onChangeText={s => {
                                        this.setState({ passwordNew: s });
                                    }}
                                    allowFontScaling={false}
                                    errorStyle={styles.errorStyle}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 6
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
                                    this.state.passwordNew ? (this.state.secureTextNewEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 35, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowNewPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 35, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowNewPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                                }
                            </Field>
                            <Field style={styles.inputPass}>
                                <TextField
                                    getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                                        placeholderStyle={{ fontSize: 16, fontWeight: '300' }} value={value} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={"Xác nhận mật khẩu mới"}
                                        secureTextEntry={this.state.secureTextNew2Entry}
                                        placeholderTextColor='#000'
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
                                            minlength: 6
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
                                    this.state.confirm_password ? (this.state.secureTextNew2Entry ? (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 35, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowNewPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 35, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowNewPass2}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                                }
                            </Field>
                        </Form>
                    </View>
                    <View style={{ backgroundColor: '#fff' }}>
                        <TouchableOpacity
                            disabled={this.state.disabled}
                            onPress={this.change.bind(this)}
                            style={styles.updatePass}>
                            {this.state.disabled ? <ActivityIndicator size={'small'} color='#fff'></ActivityIndicator> : <Text style={styles.txbtnUpdate}>{constants.update_to_up_case}</Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50 }}></View>
                </KeyboardAwareScrollView>
            </ActivityPanel>
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
        justifyContent: 'center',
        marginTop: 10
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
        color: "#000",
        fontWeight: "300",
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
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ChangePasswordScreen);