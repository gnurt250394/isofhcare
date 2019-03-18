import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import { Platform } from 'react-native'
import datacacheProvider from '@data-access/datacache-provider';

const os = Platform.select({
    ios: 2,
    android: 2
});
module.exports = {
    deviceId: "",
    deviceToken: "",
    getAccountStorage(callback) {
        datacacheProvider.read("", constants.key.storage.current_account, (s) => {
            if (callback)
                callback(s);
        });
    },
    saveAccount(account) {
        datacacheProvider.save("", constants.key.storage.current_account, account);
    },
    forgotPassword(email, type, callback) {
        if (email) {
            var body = {
                emailOrPhone: email,
                type
            }
            client.requestApi("put", constants.api.user.forgot_password, body, (s, e) => {
                if (callback)
                    callback(s, e);
            });
        }
        else {
            if (callback)
                callback();
        }
    },
    confirmCode(phone, code, callback) {
        var body = {
            phoneOrMail: phone,
            code
        }
        client.requestApi("put", constants.api.user.confirm_code, body, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    changePassword(id, passwordOld, passwordNew) {
        return new Promise((resolve, reject) => {
            var body = {
                passwordOld: passwordOld.toMd5(),
                passwordNew: passwordNew.toMd5(),
            }
            client.requestApi("put", constants.api.user.change_password + "/" + id, body, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    login(username, password, callback) {
        if (username && password) {
            var body = {
                emailOrPhone: username,
                password: password.toMd5(),
                device: { os: os, deviceId: this.deviceId, token: this.deviceToken }
            }
            client.requestApi("put", constants.api.user.login, body, (s, e) => {
                if (callback)
                    callback(s, e);
            });
        }
        else {
            if (callback)
                callback();
        }
    },
    logout(callback) {
        client.requestApi("post", constants.api.user.logout + "/" + this.deviceId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    loginSocial(socialType, socialId, name, avatar, email) {
        return new Promise((resolve, reject) => {
            var body = {
                socialType,
                socialId,
                name,
                email,
                avatar: avatar,
                thumbnail: avatar,
                device: { os: os, deviceId: this.deviceId, token: this.deviceToken }
            }
            client.requestApi("put", constants.api.user.login_social, body, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    register(name, avatar, email, phone, password, dob, gender, accessToken, socialType, socialId) {
        return new Promise((resolve, reject) => {
            // reject({});
            var body = {
                user: {
                    email,
                    avatar,
                    password: password.toMd5(),
                    name,
                    gender: 1,
                    phone: phone,
                    dob,
                    role: 1,
                    gender
                },
                applicationId: "457683741386685",
                accessToken,
                socialId,
                socialType: socialType ? socialType : 1,
                device: { os: 0, deviceId: "", token: "" }
            }
            client.requestApi("post", constants.api.user.register, body, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    update(user, callback) {
        var body = {
            user: user
        }
        client.requestApi("put", constants.api.user.update, body, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },

    changeEmail(newEmail, password, callback) {
        var body = {
            email: newEmail,
            password: password.toMd5()
        }
        client.requestApi("put", constants.api.user.change_email, body, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    refreshToken(token, callback) {
        client.requestApi("put", constants.api.user.refresh_token + "/" + token, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    detail(userId, callback) {
        client.requestApi("get", constants.api.user.get_detail + "/" + userId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    refreshPasswordByToken(phone, accessToken, applicationId, newPassword) {
        return new Promise((resolve, reject) => {
            client.requestApi("put", constants.api.user.refresh_password_by_token, {
                phone,
                accessToken,
                applicationId,
                newPassword: newPassword.toMd5()
            }, (s, e) => {
                if (callback)
                    callback(s, e);
            });


        });
    }
}