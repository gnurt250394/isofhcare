import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Dimensions, View, Text, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Platform, Image, Keyboard } from 'react-native';
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
import NavigationService from "@navigators/NavigationService";
import Modal from 'react-native-modal';
import profileProvider from '@data-access/profile-provider'
import redux from "@redux-store";

class InputPhone extends Component {
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
    onBackdropPress = () => {

        this.setState({
            isVisible: false
        })
    }
    onShowPass = () => {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        })
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.userApp.currentUser.requestInputPhone) {
            setTimeout(() => {
                this.setState({
                    isVisible: true
                })
            }, 500)
            let user = nextProps.userApp.currentUser
            user.requestInputPhone = false
            this.props.dispatch(redux.userLogin(user));
        }

    }
    changePassword() {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        connectionUtils.isConnected().then(s => {
            this.setState({
                isLoading: true,
                disabled: true
            }, () => {
                userProvider.forgotPassword(this.state.phone.trim(), 2).then(s => {

                    switch (s.code) {
                        case 0:
                            NavigationService.navigate('verifyPhone', {
                                phone: this.state.phone,
                                verify: 2
                            })
                            break
                        case 2:
                            snackbar.show('S??? ??i???n tho???i ch??a ???????c ????ng k??', "danger");
                            break
                        case 6:
                            NavigationService.navigate('verifyPhone', {
                                phone: this.state.phone,
                                verify: 2
                            })
                            break
                    }


                }).catch(err => {

                    snackbar.show('C?? l???i x???y ra, xin vui l??ng th??? l???i.', 'danger')
                })
                this.setState({
                    isLoading: false,
                    disabled: false
                })
            })
        }).catch(e => {
            this.setState({
                isLoading: false,
                disabled: false

            })
            snackbar.show(constants.msg.app.not_internet, "danger");
        })

    }
    onShowPass2 = () => {
        this.setState({
            secureTextEntry2: !this.state.secureTextEntry2
        })
    }
    onAddPhone = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        connectionUtils
            .isConnected()
            .then(s => {
                this.setState(
                    {
                        isLoading: true
                    },
                    () => {
                        let id = this.props.userApp.currentUser.id

                        let data = {
                            phone: this.state.phone
                        }
                        if (id) {
                            profileProvider.fillPhone(data).then(res => {

                                this.setState({
                                    isLoading: false
                                })

                                switch (res.code) {
                                    case 0:
                                        this.setState({
                                            isVisible: false
                                        })
                                        NavigationService.navigate('verifyPhone', { verify: 4, phone: this.state.phone })
                                        break
                                    case 8:
                                        snackbar.show('S??? ??i???n tho???i ???? t???n t???i', "danger");
                                        break
                                    case 2:
                                        snackbar.show('B???n ??ang kh??ng ????ng nh???p v???i ???ng d???ng b???nh nh??n', "danger");
                                        break
                                    default:
                                        snackbar.show('C?? l???i x???y ra, xin vui l??ng th??? l???i', "danger");
                                        break
                                }
                            }).catch(err => {
                                this.setState({
                                    isLoading: false
                                })
                            })
                        }
                    });
            }
            ).catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            });

    }
    goHome = () => {
        NavigationService.navigate("homeTab", { showDraw: false });
        this.setState({
            isVisible: false
        })
    }
    render() {
        return (

            <Modal
                isVisible={this.state.isVisible}
                onBackdropPress={this.onBackdropPress}
                backdropOpacity={0.5}
                animationInTiming={500}
                animationOutTiming={500}
                style={styles.modal}
                avoidKeyboard={true}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={1000}>
                <View style={styles.scroll}>
                    <View
                        style={styles.viewTxTittle}
                    >
                        <Text style={styles.txPhone}>C???P NH???T S??? ??I???N THO???I</Text>
                        <Text style={styles.txContent}>Vui l??ng c???p nh???t S??T c???a b???n ????? nh???n tin nh???n x??c minh khi ?????t kh??m ho???c thay ?????i m???t kh???u.</Text>
                    </View>
                    <Form ref={ref => (this.form = ref)} style={styles.form}>
                        <TextField
                            getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
                                keyboardType='numeric'
                                maxLength={10}
                                placeholderStyle={styles.placeholderStyle} value={value} underlineColor={'#CCCCCC'}
                                placeholderTextColor='#000'
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
                                    required: "S??? ??i???n tho???i kh??ng ???????c b??? tr???ng",
                                    phone: "S??T kh??ng h???p l???"
                                }
                            }}

                            autoCapitalize={"none"}
                        />
                    </Form>
                    <View style={{ backgroundColor: '#fff' }}>
                        <TouchableOpacity
                            onPress={this.onAddPhone}
                            style={styles.updatePass}>
                            {this.state.disabled ? <ActivityIndicator size={'small'} color='#fff'></ActivityIndicator> : <Text style={styles.txbtnUpdate}>{'X??C NH???N'}</Text>}
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btntext} onPress={this.goHome}>
                            {constants.booking.go_home}
                        </Text>
                    </TouchableOpacity>
                    {/* <View style={{ height: 50 }}></View> */}
                </View>

            </Modal>
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    form: { marginTop: 20 },
    placeholderStyle: { fontSize: 16, fontWeight: '300' },
    txPhone: { fontSize: 16, fontWeight: 'bold', color: '#00BA99', alignSelf: 'center' },
    viewTxTittle: {
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    btntext: {
        color: '#3161AD',
        textAlign: 'center',
        textDecorationLine: "underline",
        fontWeight: 'bold',
        fontSize: 16,
        padding: 0
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 49,
        alignSelf: 'center',
        padding: 5
    },
    header: { paddingHorizontal: 0 },
    txbtnUpdate: { color: '#FFF', fontSize: 17 },
    updatePass: { backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 20, },
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
    modal: {
        flex: 1,
        margin: 0,
        justifyContent: 'flex-end'
    },
    scroll: { borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff', paddingHorizontal: 20, width: '100%' },
    txContent: { fontSize: 14, textAlign: 'center', color: '#000000', marginTop: 15 }

});

function mapStateToProps(state) {

    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(InputPhone);