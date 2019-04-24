import client from "@utils/client-utils";
import constants from "@resources/strings";

module.exports = {
  createMedical(name, gender, dob, avatar) {
    return new Promise((resolve, reject) => {
      var body = {
        medicalRecords: {
          name: name,
          gender: gender,
          dob: dob,
          mail: '',
          status: 1,
          avatar: avatar
        }
      };
      client.requestApi(
        "post",
        constants.api.medical.createMedical,
        body,
        (s, e) => {
          if (s) resolve(s);
          if (e) reject(e);
        }
      );
    });
  }
};
