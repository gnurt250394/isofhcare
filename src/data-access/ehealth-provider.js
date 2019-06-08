import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    getGroupPatient(hospitalId) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.ehealth.get_group_patient}?hospitalId=${hospitalId}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    updateDataUSer(note,suggestions,time,medicineTime,isMedicineTime,id) {
        var body = {
            "note":  note, "suggestions":suggestions, "time": time, "medicineTime": medicineTime, "isMedicineTime": isMedicineTime
        }
        return new Promise((resolve, reject) => {
            client.requestApi("put", `${constants.api.ehealth.update_data_user}/${id}`,body, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    }

}