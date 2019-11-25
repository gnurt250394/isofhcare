import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "@resources/strings";
import { Platform } from "react-native";
import datacacheProvider from "@data-access/datacache-provider";

const os = Platform.select({
  ios: 2,
  android: 2
});
module.exports = {
  deviceId: "",
  deviceToken: "",
  getAccountStorage(callback) {
    datacacheProvider.read("", constants.key.storage.current_account, s => {
      if (callback) callback(s);
    });
  },
  saveAccount(account) {
    datacacheProvider.save("", constants.key.storage.current_account, account);
    // datacacheProvider.save("", constants.key.storage.refreshToken,
    // {
    //  refreshToken:   account.refreshToken,
    //  userId: account.id
    // }
    // );
    datacacheProvider.save("");
  },
  forgotPassword(email, type, callback) {
    if (email) {
      var body = {
        emailOrPhone: email,
        type
      };
      client.requestApi(
        "put",
        constants.api.user.forgot_password,
        body,
        (s, e) => {
          if (callback) callback(s, e);
        }
      );
    } else {
      if (callback) callback();
    }
  },
  confirmCode(phone, code, callback) {
    var body = {
      phoneOrMail: phone,
      code
    };
    client.requestApi("put", constants.api.user.confirm_code, body, (s, e) => {
      if (callback) callback(s, e);
    });
  },
  changePassword(id, passwordOld, passwordNew, ) {
    return new Promise((resolve, reject) => {
      var body = {
        passwordOld: passwordOld.toMd5(),
        passwordNew: passwordNew.toMd5()
      };
      client.requestApi(
        "put",
        constants.api.user.change_password + "/" + id,
        body,
        (s, e) => {
          if (s) resolve(s);
          reject(e);
        }
      );
    });
  },
  login(username, password) {
    return new Promise((resolve, reject) => {
      var body = {
        emailOrPhone: username,
        password: password.toMd5(),
        device: { os: os, deviceId: this.deviceId, token: this.deviceToken }
      };
      client.requestApi("put", constants.api.user.login, body, (s, e) => {
        if (s) resolve(s);
        else reject(e);
      });
    });
  },
  logout(userId) {
    if (userId)
      return new Promise((resolve, reject) => {
        client.requestApi(
          "put",
          constants.api.user.logout + "/" + userId,
          {
            device: { os: os, deviceId: this.deviceId, token: this.deviceToken }
          },
          (s, e) => {
            if (s) resolve(s);
            else reject(e);
          }
        );
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
      };
      client.requestApi(
        "put",
        constants.api.user.login_social,
        body,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  // register(dateBirth, gender, name, phone, password) {
  //   return new Promise((resolve, reject) => {
  //     let body = {
  //       "username": phone,
  //       "dateBirth": dateBirth,
  //       "gender": gender,
  //       "name": name,
  //       "telephone": phone,
  //       "password": password,
  //       "email": null,
  //       "isUsing2FA": null,
  //       "roles": [
  //         {
  //           "id": 1
  //         }
  //       ]
  //     }
  //     client.requestApi("post", constants.api.user.registerV2, body, (s, e) => {
  //       if (s) resolve(s);
  //       else reject(e);
  //     });
  //   })
  // },
  checkOtpPhone(id, otp) {
    let data = {
      verifyCode: otp
    }
    return new Promise((resolve, reject) => {
      client.requestApi('put', `${constants.api.user.check_otp_phone}/${id}`, data, (s, e) => {
        if (s)
          resolve(s)
        else reject(e)
      })
    })
  },

  reSendOtp(id) {
    return new Promise((resolve, reject) => {
      client.requestApi('get', `${constants.api.user.re_send_otp}/${id}/resendtoken`, {}, (s, e) => {
        if (s)
          resolve(s)
        else reject(e)
      })
    })
  },
  getDetailsUser() {
    return new Promise((resolve, reject) => {
      client.requestApi('get', `${constants.api.user.get_user_details}`, {}, (s, e) => {
        if (s)
          resolve(s)
        else
          reject(e)
      })
    })
  },
  // loginV2(phone, password) {
  //   return new Promise((resolve, reject) => {
  //     client.requestApi('post', `${constants.api.user.loginV2}?username=${phone}&password=${password}`, {}, (s, e) => {
  //       if (s)
  //         resolve(s)
  //       else
  //         reject(e)
  //     })
  //   })
  // },
  register(
    name,
    phone,
    password,
    dob,
    gender,
  ) {
    return new Promise((resolve, reject) => {
      // reject({});
      var body = {
        user: {
          password: password.toMd5(),
          name,
          gender: gender,
          phone: phone,
          dob,
          role: 1,
        },
        applicationId: "457683741386685",
        socialType: 1,
        device: { os: os, deviceId: this.deviceId, token: this.deviceToken }
      };
      client.requestApi("post", constants.api.user.register, body, (s, e) => {
        if (s) resolve(s);
        else reject(e);
      });
    });
  },
  update(userId, user) {
    return new Promise((resolve, reject) => {
      var body = {
        user: user,
      };
      client.requestApi(
        "put",
        constants.api.user.update + "/" + userId,
        body,
        (s, e) => {
          if (s) resolve(s);
          reject(e);
        }
      );
    });
  },

  changeEmail(newEmail, password, callback) {
    var body = {
      email: newEmail,
      password: password.toMd5()
    };
    client.requestApi("put", constants.api.user.change_email, body, (s, e) => {
      if (callback) callback(s, e);
    });
  },
  // refreshToken(token, callback) {
  //   client.requestApi(
  //     "put",
  //     constants.api.user.refresh_token + "/" + token,
  //     {},
  //     (s, e) => {
  //       if (callback) callback(s, e);
  //     }
  //   );
  // },
  detail(userId) {
    return new Promise((resolve, reject) => {
      client.requestApiWithHeaderBear(
        "get",
        constants.api.user.get_detail + "/" + userId,
        {},
        (s, e) => {
          if (s)
            resolve(s);
          reject(e);
        }
      );
    });
  },
  refreshPasswordByToken(phone, accessToken, applicationId, newPassword) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "put",
        constants.api.user.refresh_password_by_token,
        {
          phone,
          accessToken,
          applicationId,
          newPassword: newPassword.toMd5()
        },
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  checkUsedPhone(phone) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "get",
        constants.api.user.check_used_phone + "/" + phone,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  refreshToken(userId, refreshToken) {
    return new Promise((resolve, reject) => {
      client.requestApiWithHeader(
        "put",
        constants.api.user.refresh_token + "/" + userId,
        {
          device: { os: os, deviceId: this.deviceId, }
        },
        {
          Authorization: refreshToken
        },
        (s, e) => {
          if (s) {
            console.log(s)
            resolve(s);
          } else {
            console.log(e)
            reject(e);
          }
        }
      );
    });
  }
};
