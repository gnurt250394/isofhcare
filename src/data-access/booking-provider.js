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
  detailPatientHistory(patientHistoryId, hospitalId, id, shareId) {
    let id2 = id ? `&id=${id}` : ''
    let shareId2 = shareId ? `&shareId=${shareId}` : ''
    return new Promise((resolve, reject) => {
      client.requestApi(
        "get",
        constants.api.booking.get_detail_patient_historyid +
        "/" +
        patientHistoryId +
        "?hospitalId=" +
        hospitalId + id2 + shareId2,
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
  create(hospitalId, detailScheduleId, medicalRecordId, serviceTypeId, serviceId, bookingTime, content, images) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        "post",
        `${constants.api.booking.create}/${hospitalId}`,
        {
          detailScheduleId,
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
  confirmPayment(bookingId, paymentMethod) {
    return new Promise((resolve, reject) => {
      let body = { pay: paymentMethod }
      client.requestApi(
        "put",
        `${constants.api.booking.confirmPay}/${bookingId}`
        , body, (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  /**
     * 
     * @param {string} date 
     * @param {string} description 
     * @param {object} hospital 
     * @param {object} items 
     * @param {object} patient 
     * @param {string} payment 
     * @param {id} scheduleId 
     * @param {string} time 
     * @param {object} room 
     */
  createBooking(date, description, hospitals, items, patient, payment, time, voucher) {
    console.log('voucher: ', voucher);
    console.log('time: ', time);
    console.log('payment: ', payment);
    console.log('patient: ', patient);
    console.log('items: ', items);
    console.log('description: ', description);
    console.log('date: ', date);
    console.log('hospitals: ', hospitals);
    return new Promise((resolve, reject) => {
      // let doctors = { id: doctor.id, name: doctor.name }
      // let hospital = { id: hospitals && hospitals.id || '', name: hospitals && hospitals.name || '', address: hospitals && hospitals.contact.address || '' }
      // let services = [{ id: items.id || '', name: items.name || '', price: items.monetaryAmount.value || '' }]
      voucher = {
        "id": voucher.id,
        "code": voucher.name,
        "discount": voucher.price,
      }
      patient = {
        id: patient.id,
        name: patient.name,
        phone: patient.phone
      }
      //     console.log('room: ', room);
      client.requestApi(
        "post",
        URL2 +
        constants.api.booking.doctor.create_booking,
        {
          // ngày đặt khám
          date,
          // mô tả
          description,
          // mã voucher
          discount: discount ? discount : 0,
          // thông tin bác sỹ 
          doctor: doctors,
          // thông tin bệnh viện đặt khám 
          hospital,
          // danh sách dịch vụ
          items: services,
          // thông tin bệnh nhân đặt khám
          patient,
          // Phương thức thanh toán
          payment,
          // Thông tin phòng
          room,
          // Mã lịch đặt khám
          scheduleId,
          //giờ đặt khám
          time
        }, (s, e) => {
          if (s) resolve(s);
          else reject(e);
        }
      );
    });
  },
  // payTranfer(bookingId) {
  //   return new Promise((resolve, reject) => {
  //     client.requestApi(
  //       'get', `${constants.api.booking.pay_tranfer}/${bookingId}`, {}, (s, e) => {
  //         if (s)
  //           resolve(s)
  //         else
  //           reject(e)
  //       }
  //     )
  //   })
  // }
};
