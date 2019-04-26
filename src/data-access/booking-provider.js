import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "@resources/strings";

module.exports = {
  getListBooking(profileId, hospitalId) {
    return new Promise((resolve, reject) => {
      if (hospitalId)
        client.requestApi(
          "get",
          constants.api.booking.get_list_booking +
          "/" +
          profileId +
          "?hospitalId=" +
          hospitalId,
          {},
          (s, e) => {
            if (s) resolve(s);
            reject(e);
          }
        );
      else {
        client.requestApi(
          "get",
          constants.api.booking.get_list_booking,
          {},
          (s, e) => {
            if (s) resolve(s);
            reject(e);
          }
        );
      }
    });
  },
  detailPatientHistory(patientHistoryId, source) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "get",
        constants.api.booking.get_detail_patient_historyid +
        "/" +
        patientHistoryId +
        "?hospitalId=" +
        source,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  resultPatientHistory(patientHistoryId, source) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "get",
        constants.api.booking.get_result_patient_historyid +
        "/" +
        patientHistoryId +
        "?hospitalId=" +
        source,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  delete(bookingId, source, callback) {
    client.requestApi(
      "delete",
      constants.api.booking.delete + "/" + bookingId + "?source=" + source,
      {},
      (s, e) => {
        if (callback) callback(s, e);
      }
    );
  },
  getPatientHistory(hospitalId) {
    return new Promise((resolve, reject) => {

      client.requestApi(
        "get",
        `${constants.api.patientHistory.getListPatient}/${hospitalId}`
        , {}, (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  create(hospitalId, scheduleId, medicalRecordId, specialistId, serviceId, bookingTime, note, images) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "post",
        `${constants.api.booking.create}/${hospitalId}`
        , {
          scheduleId,
          medicalRecordId,
          specialistId,
          serviceId,
          booking: {
            bookingTime,
            note,
            images
          }
        }, (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  confirmPayment(bookingId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "put",
        `${constants.api.booking.confirmPay}/${bookingId}`
        , {
        }, (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  }
};
