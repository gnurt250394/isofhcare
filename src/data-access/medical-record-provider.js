import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

module.exports = {
  getByUser(userId, page, size) {
    return new Promise((resolve, reject) => {
      client.requestApi("get", `${constants.api.medicalRecord.get_by_user}/${userId}?page=${page}&size=${size}`, {}, (s, e) => {
        if (s)
          resolve(s);
        else
          reject(e);
        // if (s && s.code == 0 && s.data && s.data.profiles && s.data.profiles.length > 0) {
        //     // datacacheProvider.save(userId, constants.key.storage.USER_MEDICAL_RECORD, s.data.profiles[0]);
        //     if (callback) {
        //         callback(s.data.profiles[0], e);
        //     }
        // }
        // else {
        //     if (callback)
        //         callback(undefined, e);
        // }
      })

    });

  },
  createMedical(name, gender, dob, email, avatar, status) {
    return new Promise((resolve, reject) => {

      var body = {
        medicalRecords: {
          name: name,
          gender: gender != 0 && gender != 1 ? 2 : gender,
          mail: email ? email : '',
          status,
          avatar: avatar
        }
      };
      if (dob)
        body.medicalRecords.dob = dob;
        
      client.requestApi(
        "post",
        constants.api.medicalRecord.createMedical,
        body,
        (s, e) => {
          if (s) resolve(s);
          if (e) reject(e);
        }
      );
    });
  }
}