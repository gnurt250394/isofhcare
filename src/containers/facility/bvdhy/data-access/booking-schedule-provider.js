import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@dhy/strings';

module.exports = {
    getListSchedule(doctorId, specialistId, departmentId, startDate, endDate, callback) {
        client.requestApi("get", constants.api.booking_schedule.get_by_doctor_specialist_department 
        + "?doctorId=" + doctorId 
        + "&specialistId=" + specialistId 
        + "&departmentId=" + departmentId 
        + "&startDate=" + startDate
        + "&endDate=" + endDate 
        + "&source=" + 1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    if (callback)
                        callback(s.data.schedules);
                    return;
                }

                if (callback)
                    callback([]);

            } catch (error) {
                if (callback)
                    callback([]);
            }
        });
    }
}