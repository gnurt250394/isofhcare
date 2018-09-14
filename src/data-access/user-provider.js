import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';
import { Platform } from 'react-native'

const os = Platform.select({
    ios: 2,
    android: 2
});
module.exports = {
    deviceId: "",
    deviceToken: "",
    getAccountStorage(callback) {
        storage.get(constants.key.storage.current_account, null, (s) => {
            if (callback)
                callback(s);
        });
    },
    saveAccount(account) {
        storage.save(constants.key.storage.current_account, account);
    },
    forgotPassword(email, callback) {
        if (email) {
            var body = {
                email: email
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
    login(username, password, callback) {
        if (username && password) {
            var body = {
                usernameOrEmail: username,
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
    loginId(id, callback) {
        if (id) {
            client.requestApi("post", constants.api.user.login_by_id + "/" + id, {
                device: { os: os, deviceId: this.deviceId, token: this.deviceToken }
            }, (s, e) => {
                if (callback)
                    callback(s, e);
            });
        }
    },
    logout(callback) {
        client.requestApi("post", constants.api.user.logout + "/" + this.deviceId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    loginSocial(socialType, socialId, name, avatar, email, callback) {
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
            if (callback)
                callback(s, e);
        });
    },
    register(name, email, phone, password, callback) {
        var body = {
            user: {
                email,
                password: password.toMd5(),
                name,
                gender: 1,
                phone: phone,
                socialType: 0,
                role: 0,
            },
            device: { os: 0, deviceId: "", token: "" }
        }
        client.requestApi("post", constants.api.user.register, body, (s, e) => {
            if (callback)
                callback(s, e);
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
    changePassword(currentPassword, newPassword, callback) {
        var body = {
            oldPassword: currentPassword.toMd5(),
            newPassword: newPassword.toMd5()
        }
        client.requestApi("put", constants.api.user.change_password, body, (s, e) => {
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



}