import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "@resources/strings";

module.exports = {
  getTicket(hisPatientType, isPriority, hisAreaID, scanCode, isofhCareValue, hospitalId) {
    return new Promise((resolve, reject) => {
      client.requestApi("post", constants.api.ticket.get_ticket, {
        informationUserHospital: {
          isofhCareValue,
          scanCode,
          hisAreaID,
          isPriority,
          hisPatientType
        }, hospitalId
      }, (s, e) => {
        if (s)
          resolve(s);
        else
          reject(e);

      });
    });
  }
};
