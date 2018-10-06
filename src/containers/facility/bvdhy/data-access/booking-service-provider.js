import client from '@utils/client-utils';
import dhyCommand from '@dhy/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    syncSpecialistByDepartment(departmentId, callback) {
        client.requestApi("get", dhyCommand.api.booking_specialist.get_by_doctor_department + "?doctorId=" + "&departmentId=" + departmentId + "&source=" + 1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save(dhyCommand.key.storage.specialist_department + departmentId, s.data.specialists);
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
        datacacheProvider.read(dhyCommand.key.storage.specialist_department + departmentId, null, (s) => {
            if (!s || s.length == 0)
                this.syncSpecialistByDepartment(departmentId, callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncSpecialistByDepartment(departmentId);
    },
    syncSpecialistByDoctorDepartment(doctorId, departmentId, callback) {
        client.requestApi("get", dhyCommand.api.booking_specialist.get_by_doctor_department + "?doctorId=" + doctorId + "&departmentId=" + departmentId + "&source=" + 1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save(dhyCommand.key.storage.specialist_doctor + doctorId + departmentId, s.data.specialists);
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
        datacacheProvider.read(dhyCommand.key.storage.specialist_doctor + doctorId + departmentId, null, (s) => {
            if (!s || s.length == 0)
                this.syncSpecialistByDoctorDepartment(doctorId, departmentId, callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncSpecialistByDoctorDepartment(doctorId, departmentId);
    }
}