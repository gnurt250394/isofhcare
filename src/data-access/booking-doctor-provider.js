import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "../res/strings";
const URL = 'http://10.0.0.98:8080/'
const URL2 = 'http://10.0.50.111:8082/'
module.exports = {
    getListDoctor(page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "get",
                URL +
                constants.api.booking.doctor.get_list_doctor +
                '?page=' + Number(page) + '&size=' + Number(size),
                {},
                (s, e) => {
                    if (s) resolve(s);
                    reject(e);
                }
            );
        });
    },
    detailDoctor(id) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL +
                constants.api.booking.doctor.get_detail_doctor +
                "/" +
                id,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    searchDoctor(keyword, lang, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL +
                constants.api.booking.doctor.search_list_doctor +
                `?expression=${keyword}&lang=${lang}&page=${page}&size=${size}`,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    get_detail_schedules(id) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL +
                constants.api.booking.doctor.get_detail_schedules +
                `/` +
                id,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        })
    },
    /**
     * 
     * @param {string} date 
     * @param {string} description 
     * @param {number} discount 
     * @param {object} doctor 
     * @param {object} hospital 
     * @param {object} items 
     * @param {object} patient 
     * @param {string} payment 
     * @param {id} scheduleId 
     * @param {string} time 
     * @param {object} room 
     */
    create(date, description, doctor, hospitals, items, patient, scheduleId, time, room) {
        console.log('hospitals: ', hospitals);
        return new Promise((resolve, reject) => {
            let doctors = { id: doctor.id, name: doctor.name }
            let hospital = { id: hospitals && hospitals.id || '', name: hospitals && hospitals.name || '', address: hospitals && hospitals.contact.address || '' }
            let services = [{ id: items.id || '', name: items.name || '', price: items.monetaryAmount.value || '' }]
            room = {
                "id": room.id,
                "name": room.name
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
                    // discount: discount ? discount : 0,
                    // thông tin bác sỹ 
                    doctor: doctors,
                    // thông tin bệnh viện đặt khám 
                    hospital,
                    // danh sách dịch vụ
                    items: services,
                    // thông tin bệnh nhân đặt khám
                    patient,
                    // Phương thức thanh toán
                    // payment,
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

    confirmBooking(id, paymentMethod, voucher) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "post",
                URL2 +
                constants.api.booking.doctor.get_detail_booking + '/' + id + '/payment/' + paymentMethod,
                {
                    "code": voucher.code ? voucher.code : '',
                    "discount": voucher.price ? voucher.price : '',
                    "id": voucher.id ? voucher.id : ''
                }, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },

    get_list_hospitals(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL +
                `${constants.api.booking.doctor.get_list_hospitals}?page=${page}&size=${size}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    get_list_schedules(hospitalId, doctorId, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL +
                `${constants.api.booking.doctor.get_list_schedules}/${hospitalId}/hospital/${doctorId}/doctor?page=${page}&size=20&sort=desc&properties=created`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    get_list_specialists(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL +
                `${constants.api.booking.doctor.get_list_specialists}?page=${page}&size=${size}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    get_doctor_hospitals(hospitalId, page, size) {
        return new Promise((resolve, reject) => {
            let url = constants.api.booking.doctor.get_doctor_hospitals.replace('hospitalId', hospitalId)
            client.requestApi(
                "get",
                URL +
                `${url}?page=${page}&size=${size}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    get_doctor_specialists(specialistId, page, size) {
        return new Promise((resolve, reject) => {
            let url = constants.api.booking.doctor.get_doctor_specialists.replace('specialistId', specialistId)
            client.requestApi(
                "get",
                URL +
                `${url}?page=${page}&size=${size}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    getListBooking(patientId, page, size) {
        return new Promise((resolve, reject) => {
            let url = constants.api.booking.doctor.get_list_booking.replace('patientId', patientId)
            client.requestApi(
                "get",
                URL2 +
                `${url}?page=${page}&size=${size}&sort=desc&properties=created`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    getDetailBooking(id) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                URL2 +
                `${constants.api.booking.doctor.get_detail_booking}/${id}`
                , {}, (s, e) => {
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
