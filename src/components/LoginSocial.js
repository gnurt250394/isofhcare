import React, { Component, PropTypes } from 'react';
import ScaleImage from 'mainam-react-native-scaleimage';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
const FBSDK = require('react-native-fbsdk');
import redux from '@redux-store';

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
            iosClientId: '612436577188-gfd6ppf7avg7b341db0tnp5qjlbhqrnq.apps.googleusercontent.com',
            webClientId: '612436577188-u5u1t8u4hi2iqg5n16bqk90jp4d67ug6.apps.googleusercontent.com'
        })
    }

    handleSigninGoogle() {
        loginSocial = this.loginSocial;
        props = this.props;
        GoogleSignin.signOut();
        GoogleSignin.signIn().then((res) => {
            console.log(res);
            if (res) {
                loginSocial(2, res.id, res.name, res.photo, res.email, props);
            } else {
                snackbar.show(constants.msg.user.canot_get_user_info_in_account_google);
                return;
            }
        }).catch((err) => {
            snackbar.show(constants.msg.user.canot_get_user_info_in_account_google);
        }).done();
    }

    loginSocial(socialType, socialId, name, avatar, email, props) {
        userProvider.loginSocial(socialType, socialId, name, avatar, email, (s, e) => {
            if (s) {
                console.log(s);
                switch (s.code) {
                    case 0:
                        snackbar.show(constants.msg.user.login_success);
                        var user = s.data.user;
                        this.props.dispatch(redux.userLogin(user));
                        if (this.props.directScreen) {
                            this.props.directScreen();
                        }
                        else {
                            Actions.popTo('main');
                        }
                        return;
                    case 2:
                        snackbar.show(constants.msg.user.username_or_password_incorrect);
                        break;
                    case 3:
                    case 1:
                        snackbar.show(constants.msg.user.account_blocked);
                        return;
                }

            }
            if (e) {
                console.log(e);
            }
            snackbar.show(constants.msg.error_occur);
        })
    }

    handleSigninFacebook() {
        try {
            LoginManager.logOut();
        } catch (error) {

        }
        loginSocial = this.loginSocial;
        props = this.props;
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function (result) {
                if (result.isCancelled) {
                } else {
                    const infoRequest = new GraphRequest('/me', {
                        parameters: {
                            'fields': {
                                'string': 'email,name,picture,id'
                            }
                        }
                    }, (err, res) => {
                        console.log(err, res);
                        if (res) {
                            loginSocial(1, res.id, res.name, res.picture ? res.picture.data : "", res.email, props);
                        } else {
                            snackbar.show(constants.msg.user.canot_get_user_info_in_account_facebook);
                            return;
                        }
                    });
                    new GraphRequestManager().addRequest(infoRequest).start();
                }
            },
            function (error) {
                console.log(error);
                snackbar.show(constants.msg.user.canot_get_user_info_in_account_facebook);
                return;
            }
        );
    }
    render() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TouchableOpacity onPress={() => this.handleSigninGoogle()}>
                    <ScaleImage source={require("@images/ic_google.png")} width={40} style={{ padding: 10, margin: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleSigninFacebook()}>
                    <ScaleImage source={require("@images/ic_fb.png")} width={40} style={{ padding: 10, margin: 10 }} />
                </TouchableOpacity>

            </View>

        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LoginSocial);