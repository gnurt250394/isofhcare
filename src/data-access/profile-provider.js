import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

// const Realm = require('realm');
import realmModel from '@models/realm-models';
import {resolve} from 'uri-js';
export default {
  getByUser(userId, callback, requestApi) {
    if (!requestApi) {
      datacacheProvider
        .readPromise(userId, constants.key.storage.USER_PROFILE)
        .then(s => {
          if (callback) callback(s);
          this.getByUser(userId, null, true);
        })
        .catch(e => {
          this.getByUser(userId, callback, true);
        });
    } else {
      client.requestApi(
        'get',
        constants.api.profile.get_by_user + '/' + userId,
        {},
        (s, e) => {
          if (
            s &&
            s.code == 0 &&
            s.data &&
            s.data.profiles &&
            s.data.profiles.length > 0
          ) {
            datacacheProvider.save(
              userId,
              constants.key.storage.USER_PROFILE,
              s.data.profiles[0],
            );
            if (callback) {
              callback(s.data.profiles[0], e);
            }
          } else {
            if (callback) callback(undefined, e);
          }
        },
      );
    }
  },
  verifyFillPhone(profileRegistryId, confirmCode) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile +
          constants.api.profile.verify_fill_phone +
          `/${profileRegistryId}/confirm`,
        {
          confirmationCode: confirmCode,
        },
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getByUserPromise(userId) {
    return new Promise((resolve, reject) => {
      this.getByUser(
        userId,
        (s, e) => {
          if (s) resolve(s);
          reject(e);
        },
        false,
      );
    });
  },
  getUserInfo(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile +
          constants.api.profile.get_details_user +
          '/' +
          id,
        {},
        (s, e) => {
          if (s) resolve(s);
          if (e) reject(e);
        },
      );
    });
  },
  getProfileFamily() {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile + constants.api.profile.get_profile_family,
        {},
        (s, e) => {
          if (s) resolve(s);
          if (e) reject(e);
        },
      );
    });
  },
  getListProfile() {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile + constants.api.profile.profile,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  deleteFamilyProfile(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'delete',
        `${client.serviceProfile}${constants.api.profile.profile}/${id}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  createProfile(data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'post',
        client.serviceProfile + `${constants.api.profile.profile}`,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  createProfileMember(data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'post',
        client.serviceProfile + `${constants.api.profile.profile}`,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  updateProfile(id, data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + `${constants.api.profile.profile}/${id}`,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  updateAvatar(id, data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        `${constants.api.profile.update_avatar}/${id}`,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  updateCover(id, data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        `${constants.api.profile.update_cover}/${id}`,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  sendConfirmProfile(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + `${constants.api.profile.send_confirm}/${id}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  sharePermission(data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + constants.api.profile.share_permission,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  checkOtp(confirmCode, id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile +
          `${
            constants.api.profile.profile_member
          }/${id}/confirm/${confirmCode}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  resendOtp(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + constants.api.profile.resend_otp + '/' + id,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  confirm(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + constants.api.profile.confirm + '/' + id,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getDetailsMedical(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile + constants.api.profile.profile + '/' + id,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  fillPhone(data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + constants.api.profile.fill_phone,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getListRelations() {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile + constants.api.profile.list_relationship,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getInfoProfile(data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile + constants.api.profile.check_info_profile,
        data,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getInfoProfilewithQrcode(data) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        constants.api.profile.info_profile + data,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getListWaitting(type) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile +
          constants.api.profile.list_waitting +
          '?eventType=' +
          type,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  acceptProfile(requestId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile +
          constants.api.profile.list_waitting +
          `/${requestId}/accept`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  rejectProfile(requestId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile +
          constants.api.profile.list_waitting +
          `/${requestId}/reject`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  cancelProfile(requestId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        client.serviceProfile +
          constants.api.profile.list_waitting +
          `/${requestId}/cancel`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getDefaultProfile() {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceProfile + constants.api.profile.default_profile,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
};
