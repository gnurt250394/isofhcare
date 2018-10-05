import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    syncSpecialistByDepartment(departmentId, callback) {
        client.requestApi("get", constants.api.booking_specialist.get_by_doctor_department + "?doctorId=" + "&departmentId=" + departmentId, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.specialist_department + departmentId, s.data.specialists);
                    if (callback)
                        callback(s.data.specialists);
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
    getListSpecialistByDepartment(departmentId, callback) {
        storage.get(constants.key.storage.specialist_department + departmentId, null, (s) => {
            if (!s || s.length == 0)
                this.syncSpecialistByDepartment(departmentId, callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncSpecialistByDepartment(departmentId);
    },
    syncSpecialistByDoctorDepartment(doctorId, departmentId, callback) {
        client.requestApi("get", constants.api.booking_specialist.get_by_doctor_department + "?doctorId=" + doctorId + "&departmentId=" + departmentId, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.specialist_doctor + doctorId + departmentId, s.data.specialists);
                    if (callback)
                        callback(s.data.specialists);
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
    getListSpecialistByDoctorDepartment(doctorId, departmentId, callback) {
        storage.get(constants.key.storage.specialist_doctor + doctorId + departmentId, null, (s) => {
            if (!s || s.length == 0)
                this.syncSpecialistByDoctorDepartment(doctorId, departmentId, callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncSpecialistByDoctorDepartment(doctorId, departmentId);
    }
}