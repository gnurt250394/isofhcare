import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getListDoctorByDepartment(departmentId, callback) {
        client.requestApi("get", constants.api.booking_doctor.get_by_specialist_department + "?specialistId=" + "&departmentId=" + departmentId, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    if (callback)
                        callback(s.data.doctors);
                    return;
                }
                if (callback)
                    callback([]);
            } catch (error) {
                if (callback)
                    callback([]);
            }
        });
    },
    getListDoctorBySpecialistDepartment(serviceId, departmentId, callback) {
        client.requestApi("get", constants.api.booking_doctor.get_by_specialist_department + "?specialistId=" + serviceId + "&departmentId=" + departmentId, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    if (callback)
                        callback(s.data.doctors);
                    return;
                }
                if (callback)
                    callback([]);
            } catch (error) {
                if (callback)
                    callback([]);
            }
        }, );
    }

}