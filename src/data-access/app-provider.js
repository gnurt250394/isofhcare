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
      RNFetchBlob.config({
        trusty : true
      })
      .then('GET', 'https://10.3.0.18:2300/api/medi/v1/dm-thiet-lap-phong?mac=02:00:00:00:00:00')
      .then((resp) => {
        console.log('resp: ', resp);
        // ...
      }).catch
    //   client.requestApi('get', 'https://10.3.0.18:2300/api/medi/v1/dm-thiet-lap-phong?mac=02:00:00:00:00:00', {}, (s, e) => {
    //     if (s) resolve(s);
    //     else reject(e);
    //   });
    });
  },
};
