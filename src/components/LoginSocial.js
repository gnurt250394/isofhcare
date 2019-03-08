import React, { Component, PropTypes } from 'react';
import ScaleImage from 'mainam-react-native-scaleimage';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
const FBSDK = require('react-native-fbsdk');
import redux from '@redux-store';
import { Toast } from 'native-base'
import RNAccountKit from 'react-native-facebook-account-kit';

const {
    LoginManager,
    GraphRequest,
    GraphRequestManager
} = FBSDK;

class LoginSocial extends Component {

    componentWillMount() {
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            // play services are available. can now configure library
        })
            .catch((err) => {
                console.log("Play services error", err.code, err.message);
            })

        GoogleSignin.configure({
            iosClientId: '553446981035-bo2beb0me37ooagphjp7b1rg17lpp5qr.apps.googleusercontent.com',
            webClientId: '553446981035-buqufol8jocasl65igl4erla5s3qtc7p.apps.googleusercontent.com'
        })
        RNAccountKit.configure({
            titleType: 'login',
            initialPhoneCountryPrefix: '+84', // autodetected if none is provided
            countryWhitelist: ['VN'], // [] by default
            defaultCountry: 'VN',
        });
    }
    googleSignInCallBack(res) {
        console.log(res);
        if (res) {
            this.loginSocial(4, res.id, res.name, res.photo, res.email);
        } else {
            snackbar.show(constants.msg.user.canot_get_user_info_in_account_google);
            return;
        }
    }
    handleSigninGoogle() {
        props = this.props;
        GoogleSignin.signOut();
        GoogleSignin.signIn().then(this.googleSignInCallBack.bind(this)).catch((err) => {
            snackbar.show(constants.msg.user.canot_get_user_info_in_account_google);
        }).done();
    }

    loginSocial(socialType, socialId, name, avatar, email) {
        let createAccount = () => RNAccountKit.loginWithPhone().then(async (token) => {
            if (!token) {
                snackbar.show("Xác minh số điện thoại không thành công", "danger");
            } else {
                let account = await RNAccountKit.getCurrentAccount();
                if (account && account.phoneNumber) {
                    this.props.navigation.navigate("register", { user: { avatar, phone: "0" + account.phoneNumber.number, token: token.token, socialType, socialId, fullname: name, avatar, email } })
                } else {
                    snackbar.show("Xác minh số điện thoại không thành công", "danger");
                }
            }
        });
        userProvider.loginSocial(socialType, socialId, name, avatar, email).then(s => {
            switch (s.code) {
                case 3:
                    createAccount();
                    return;
                case 0:
                    try {
                        snackbar.show(constants.msg.user.login_success, 'success');
                        var user = s.data.user;
                        this.props.dispatch(redux.userLogin(user));
                        if (this.props.directScreen) {
                            this.props.directScreen();
                        }
                        else {
                            this.props.navigation.navigate("home", { showDraw: false });
                        }
                        return;
                    } catch (error) {
                        return;
                    }
                case 4:
                    snackbar.show(constants.msg.user.this_account_not_active, 'danger');
                    return;
                case 2:
                case 1:
                    snackbar.show(constants.msg.user.account_blocked, 'danger');
                    return;
            }
        }).catch(e => {
            createAccount();
        });
    }

    facebookSignInSuccessCallBack(result) {
        if (result.isCancelled) {
        } else {
            const infoRequest = new GraphRequest('/me', {
                parameters: {
                    'fields': {
                        'string': 'email,name,picture,id'
                    }
                }
            }, this.facebookGraphRequestCallBack.bind(this));
            new GraphRequestManager().addRequest(infoRequest).start();
        }
    }

    facebookSignInErrorCallBack(error) {
        console.log(error);
        snackbar.show(constants.msg.user.canot_get_user_info_in_account_facebook);
    }

    facebookGraphRequestCallBack(err, res) {
        if (res) {
            this.loginSocial(2, res.id, res.name, res.picture && res.picture.data ? res.picture.data.url : "", res.email);
        } else {
            snackbar.show(constants.msg.user.canot_get_user_info_in_account_facebook);
            return;
        }
    }
    handleSigninFacebook() {
        try {
            LoginManager.logOut();
        } catch (error) {

        }
        props = this.props;
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            this.facebookSignInSuccessCallBack.bind(this),
            this.facebookSignInErrorCallBack.bind(this)
        );
    }
    render() {
        return (
            <View>
                <Text style={{ textAlign: 'center', marginTop: 20, color: "#3160ac", opacity: 0.6 }}>Đăng nhập với</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleSigninGoogle()}>
                        <ScaleImage source={require("@images/ic_google.png")} width={40} style={{ padding: 10, margin: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleSigninFacebook.bind(this)}>
                        <ScaleImage source={require("@images/ic_fb.png")} width={40} style={{ padding: 10, margin: 10 }} />
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(LoginSocial);