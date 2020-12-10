import client from '@utils/client-utils';
import constants from '@resources/strings';
import RNFetchBlob from 'rn-fetch-blob'
export default {
  lastActive: new Date(),
  setActiveApp() {
    return new Promise((resolve, reject) => {
      client.requestApi('get', constants.api.user.use_app, {}, (s, e) => {
        if (s) resolve(s);
        else reject(e);
      });
    });
  },
  getSetting() {
    return new Promise((resolve, reject) => {
      client.requestApi('get', constants.api.user.get_setting, {}, (s, e) => {
        if (s) resolve(s);
        else reject(e);
      });
    });
  },
};
