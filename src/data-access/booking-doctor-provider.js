import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "../res/strings";
export default {
    getListDoctor(page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "get",
                client.serviceSchedule +
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
    getListDoctorWithSpecialist(idSpecialist, page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "get",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_doctor + `/${idSpecialist}/specialization?page=${page}&size=${size}&sort=desc&properties=created`,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    reject(e);
                }
            );
        });
    },
    searchListDoctorWithSpecialist(idSpecialist, name, page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "put",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_doctor + `/${idSpecialist}/specialization?name=${name}&page=${page}&size=${size}&sort=desc&properties=created`,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    reject(e);
                }
            );
        });
    },
    getListDoctorWithHospital(idHospital, page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "get",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_doctor + `/hospital/${idHospital}/top/?page=${page}&size=${size}`,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    reject(e);
                }
            );
        });
    },
    getListHospitalWithSpecialist(idSpecialist, page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "get",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_hospital + `/${idSpecialist}/specialization?page=${page}&size=${size}&sort=desc&properties=created`,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    reject(e);
                }
            );
        });
    },
    searchListHospitalWithSpecialist(idSpecialist, name, page, size) {
        return new Promise((resolve, reject) => {

            client.requestApi(
                "put",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_hospital + `/${idSpecialist}/specialization?name=${name}&page=${page}&size=${size}&sort=desc&properties=created`,
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
                client.serviceSchedule +
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
    detailHospital(id) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_hospital +
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
                client.serviceSchedule +
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
                client.serviceSchedule +
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
    get_detail_schedules_online(hospitalId, doctorId) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                client.serviceSchedule +
                constants.api.booking.doctor.get_detail_schedules1 +
                `/` +
                `${hospitalId}/${doctorId}/online`,
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
    create(date, description, doctor, hospitals, items, patients, scheduleId, time, room, idUser, images, blockTime) {
        console.log('patients: ', patients);
        return new Promise((resolve, reject) => {
            let doctors = { id: doctor.userId || doctor.id, name: doctor.name, phone: doctor.telephone, academicDegree: doctor?.academicDegree?.value }
            let hospital = { id: hospitals && hospitals.id || '', name: hospitals && hospitals.name || '', address: hospitals && hospitals.contact.address || '', checkInPlace: hospitals && hospitals.checkInPlace || '', hotLine: hospitals && hospitals.hotLine || '', bank: hospitals && hospitals.transferInfo && hospitals.transferInfo.bank || '', accountNo: hospitals && hospitals.transferInfo && hospitals.transferInfo.accountNo || '', owner: hospitals && hospitals.transferInfo && hospitals.transferInfo.owner || '', branch: hospitals && hospitals.transferInfo && hospitals.transferInfo.branch || '', note: hospitals && hospitals.transferInfo && hospitals.transferInfo.note || '' }

            room = {
                "id": room.id,
                "name": room.name,
            }
            let patient = {
                id: idUser,
                name: patients.name,
                phone: patients.phone
            }
            //     
            client.requestApi(
                "post",
                client.serviceBooking +
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
                    items,
                    // thông tin bệnh nhân đặt khám
                    patient,
                    // Phương thức thanh toán
                    // payment,
                    // Thông tin phòng
                    room,
                    // Mã lịch đặt khám
                    scheduleId,
                    //giờ đặt khám
                    time,
                    //owner : true: đặt khám chính chủ, false: đặt khám hộ
                    owner: patients.status == 1 ? true : false,
                    images,
                    blockTime
                }, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },

    confirmBooking(id, paymentMethod, voucher, phonenumber, momoToken, cardNumber) {
        let data = {}
        data.voucher = {
            "code": voucher.code ? voucher.code : '',
            "discount": voucher.price ? voucher.price : 0,
            "id": voucher.id ? voucher.id : ''
        }
        if (phonenumber) data.phoneNumber = phonenumber
        if (momoToken) data.appData = momoToken
        if (cardNumber) data.cardNumber = cardNumber

        return new Promise((resolve, reject) => {
            client.requestApi(
                "post",
                client.serviceBooking +
                constants.api.booking.doctor.get_detail_booking + '/' + id + '/payment/' + paymentMethod,
                data, (s, e) => {
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
                client.serviceSchedule +
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
                // client.serviceSchedule +
                `${constants.api.booking.doctor.get_list_schedules}/${hospitalId}?page=0&size=20`
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
                client.serviceSchedule +
                `${constants.api.booking.doctor.get_list_specialists}?page=${page}&size=${size}&sort=asc&properties=ordinalNumbers`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    search_list_specialists(name) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                client.serviceSchedule +
                `${constants.api.booking.doctor.get_list_specialists}/search?name=${name}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },

    get_list_specialists_all() {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                client.serviceSchedule +
                `${constants.api.booking.doctor.get_list_specialists_all}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },

    search_list_specialists(name) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                client.serviceSchedule +
                `${constants.api.booking.doctor.search_list_specialists}?name=${name}`
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
                client.serviceSchedule +
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
                client.serviceSchedule +
                `${url}?page=${page}&size=${size}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    getListBooking(phoneProfile, patientId, page, size) {
        return new Promise((resolve, reject) => {
            let url = constants.api.booking.doctor.get_list_booking.replace('patientId', patientId)
            client.requestApi(
                "get",
                client.serviceBooking +
                `${url}?phones=${phoneProfile}&page=${page}&size=${size}&sort=desc&properties=created`
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
                client.serviceBooking +
                `${constants.api.booking.doctor.get_detail_booking}/${id}`
                , {}, (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },
    getListTimeBooking(doctorId, isOnline, fromDate, toDate) {
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                client.serviceSchedule +
                `${constants.api.booking.doctor.get_list_time_booking}?doctorId=${doctorId}&isOnline=${isOnline}&fromDate=${fromDate}&toDate=${toDate}`
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
