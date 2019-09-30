import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import Dimensions from 'Dimensions';
import { View, Text, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Animated, Easing, Platform, Image, ImageBackground, Keyboard } from 'react-native';
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

class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
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
            this.setState({ isLoading: true }, () => {
                userProvider.changePassword(this.props.userApp.currentUser.id, this.state.passwordOld, this.state.passwordNew).then(s => {
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
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }
    onChangeText = (state) => (value) => {
        this.setState({ [state]: value })
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.change_password}
                showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.flex}
                    keyboardShouldPersistTaps="handled"
                >
                    <KeyboardAvoidingView behavior="padding" >
                        <ScaleImage source={require("@images/new/isofhcare.png")} width={200} style={styles.imageLogo} />
                        <View style={styles.container}>
                            <Form ref={ref => (this.form = ref)} style={styles.form}>
                                <Field style={styles.inputPass}>
                                    <TextField
                                        getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                            placeholderStyle={styles.placeInput}
                                            value={value}
                                            underlineColor={'#02C39A'}
                                            inputStyle={styles.textInputStyle}
                                            labelStyle={styles.labelStyle}
                                            placeholder={constants.enter_old_password}
                                            secureTextEntry={this.state.secureTextOldEntry}
                                            allowFontScaling={false}
                                            onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                        onChangeText={this.onChangeText('passwordOld')}
                                        allowFontScaling={false}
                                        errorStyle={styles.errorStyle}
                                        validate={{
                                            rules: {
                                                required: true,
                                                minlength: 8
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
                                        this.state.passwordOld ? (this.state.secureTextOldEntry ?
                                            (<TouchableOpacity
                                                style={styles.buttonPassNew}
                                                onPress={this.onShowOldPass}>
                                                <ScaleImage
                                                    style={styles.iconPassNew}
                                                    resizeMode={'contain'}
                                                    height={20}
                                                    source={require('@images/new/ic_hide_pass.png')}></ScaleImage>
                                            </TouchableOpacity>)
                                            :
                                            (<TouchableOpacity
                                                style={styles.buttonPassNew}
                                                onPress={this.onShowOldPass}>
                                                <ScaleImage style={styles.iconPassNew}
                                                    height={20}
                                                    source={require('@images/new/ic_show_pass.png')}></ScaleImage>
                                            </TouchableOpacity>)) : (<Field></Field>)
                                    }
                                </Field>
                                <Field style={styles.inputPass}>

                                    <TextField
                                        getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                            placeholderStyle={styles.placeInput}
                                            value={value}
                                            underlineColor={'#02C39A'}
                                            inputStyle={styles.textInputStyle}
                                            labelStyle={styles.labelStyle}
                                            placeholder={constants.change_password_screens.password_new}
                                            secureTextEntry={this.state.secureTextNewEntry}
                                            allowFontScaling={false}
                                            onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                        onChangeText={this.onChangeText('passwordNew')}
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
                                        this.state.passwordNew ? (this.state.secureTextNewEntry ? (
                                            <TouchableOpacity style={styles.buttonPassNew} onPress={this.onShowNewPass}>
                                                <ScaleImage
                                                    style={styles.iconPassNew}
                                                    resizeMode={'contain'}
                                                    height={20}
                                                    source={require('@images/new/ic_hide_pass.png')}>
                                                </ScaleImage>
                                            </TouchableOpacity>)
                                            :
                                            (<TouchableOpacity
                                                style={styles.buttonPassNew}
                                                onPress={this.onShowNewPass}>
                                                <ScaleImage
                                                    style={styles.iconPassNew}
                                                    height={20}
                                                    source={require('@images/new/ic_show_pass.png')}>
                                                </ScaleImage>
                                            </TouchableOpacity>)) : (<Field></Field>)
                                    }
                                </Field>
                                <Field style={styles.inputPass}>
                                    <TextField
                                        getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                                            placeholderStyle={styles.placeInput}
                                            value={value}
                                            underlineColor={'#02C39A'}
                                            inputStyle={styles.textInputStyle}
                                            labelStyle={styles.labelStyle}
                                            placeholder={constants.change_password_screens.password_new_2}
                                            secureTextEntry={this.state.secureTextNew2Entry}
                                            allowFontScaling={false}
                                            onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                                        onChangeText={this.onChangeText('confirm_password')}
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
                                        this.state.confirm_password ? (this.state.secureTextNew2Entry ?
                                            (<TouchableOpacity
                                                style={styles.buttonPassNew} onPress={this.onShowNewPass2}>
                                                <ScaleImage style={styles.iconPassNew}
                                                    resizeMode={'contain'}
                                                    height={20}
                                                    source={require('@images/new/ic_hide_pass.png')}>
                                                </ScaleImage>
                                            </TouchableOpacity>) : (<TouchableOpacity
                                                style={styles.buttonPassNew}
                                                onPress={this.onShowNewPass2}>
                                                <ScaleImage
                                                    style={styles.iconPassNew}
                                                    height={20}
                                                    source={require('@images/new/ic_show_pass.png')}>
                                                </ScaleImage></TouchableOpacity>)) : (<Field></Field>)
                                    }
                                </Field>
                            </Form>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <TouchableOpacity
                    onPress={this.change.bind(this)}
                    style={styles.updatePass}>
                    <Text style={styles.txtUpdate}>{constants.update_to_up_case}</Text>
                </TouchableOpacity>
            </ActivityPanel>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    form: {
        marginTop: 10
    },
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 30
    },
    imageLogo: {
        marginTop: 50,
        alignSelf: 'center'
    },
    txtUpdate: {
        color: '#FFF',
        fontSize: 17
    },
    updatePass: {
        backgroundColor: 'rgb(2,195,154)',
        marginBottom: 30,
        alignSelf: 'center',
        borderRadius: 6,
        width: 250,
        height: 48,
        marginTop: 34,
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeInput: {
        fontSize: 16,
        fontWeight: '200'
    },
    iconPassNew: {
        tintColor: '#7B7C7D'
    },
    buttonPassNew: {
        position: 'absolute',
        right: 3,
        top: 30,
        justifyContent: 'center',
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
        alignSelf: 'stretch',
        paddingRight: 45,
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ChangePasswordScreen);