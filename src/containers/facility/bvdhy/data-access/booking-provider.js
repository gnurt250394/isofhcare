import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@dhy/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getListBookingByUser(profileId, callback) {
        client.requestApi("get", constants.api.booking.get_list_patient_history_by_user + "/" + profileId, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
            }
        });
    },
    getListBooking(doctorId, specialistId, date, callback) {
        client.requestApi("get", constants.api.booking.get_by_doctor_and_date 
        + "?doctorId=" + doctorId 
        + "&specialistId=" + specialistId 
        + "&startDate=" + date
        + "&endDate=" + date 
        + "&source=" + 1, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
            }
        });

    },
    addBooking(profileId, scheduleId, bookingTime, note, callback) {
        client.requestApi("post", constants.api.booking.create, {
            profileId: profileId,
            scheduleId: scheduleId,
            booking: {
                bookingTime: bookingTime,
                note: note
            }
        }, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
            }
        });
    },
    getDetailPatientHistory(patientHistory, callback) {
        client.requestApi("get", constants.api.booking.get_detail_patient_history + "/" + patientHistory, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
            }
        });
    },
    getResultPatientHistory(patientHistory, callback) {
        client.requestApi("get", constants.api.booking.get_result_patient_history + "/" + patientHistory, {}, (s,e) => {
            try {
                if (callback)
                    callback(s,e);
            } catch (error) {
            }
        });
    },
    cancel(bookingId, callback) {
        client.requestApi("DELETE", constants.api.booking.cancel + "/" + bookingId, {}, (s,e) => {
            try {
                if (callback)
                    callback(s,e);
            } catch (error) {
            }
        });
    },
    getDetail(bookingId, callback) {
        client.requestApi("get", constants.api.booking.get_detail + "/" + bookingId, {}, (s,e) => {
            try {
                if (callback)
                    callback(s,e);
            } catch (error) {
            }
        });
    }
}