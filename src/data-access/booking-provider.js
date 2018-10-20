import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
module.exports = {
    getListBooking(userId, callback) {
        client.requestApi("get", constants.api.booking.get_list_booking + "/" + userId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    detailPatientHistory(patientHistoryId, source, callback) {
        client.requestApi("get", constants.api.booking.get_detail_patient_historyid + "/" + patientHistoryId + "?source=" + source, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    resultPatientHistory(patientHistoryId, source, callback) {
        client.requestApi("get", constants.api.booking.get_result_patient_historyid + "/" + patientHistoryId + "?source=" + source, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    delete(bookingId, source, callback)
    {
        client.requestApi("delete", constants.api.booking.delete + "/" + bookingId + "?source=" + source, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}