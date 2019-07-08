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
  detailPatientHistory(patientHistoryId, hospitalId, id) {
    let id2 = id ? `&id=${id}` : ''
    return new Promise((resolve, reject) => {
      client.requestApi(
        "get",
        constants.api.booking.get_detail_patient_historyid +
        "/" +
        patientHistoryId +
        "?hospitalId=" +
        hospitalId + id2,
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
  getByAuthor() {
    return new Promise((resolve, reject) => {
      // var queryString = ""
      // var codeBooking = ""
      // var status = -10
      // var type = 1
      // var stype = 1
      // var hospitalId = -1
      // var fromDate = '1970-01-01 00:00:00'

      client.requestApi(
        "get",
        `${constants.api.booking.getByAuthor}`, {}, (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  detail(id) {
    return new Promise((resolve, reject) => {
      client.requestApi('get', `${constants.api.booking.detail}/${id}`, {}, (s, e) => {
        if (s) resolve(s)
        else reject(e)
      })
    })
  },
  create(hospitalId, medicalRecordId, serviceTypeId, serviceId, bookingTime, content, images) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "post",
        `${constants.api.booking.create}/${hospitalId}`,
        {
          medicalRecordId,
          serviceTypeId,
          serviceId,
          booking: {
            bookingTime,
            content,
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
