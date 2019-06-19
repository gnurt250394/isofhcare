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
    updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id) {
        var body = {
            "note": note, "suggestions": suggestions, "time": time, "medicineTime": medicineTime, "isMedicineTime": isMedicineTime ? isMedicineTime : 0
        }
        return new Promise((resolve, reject) => {
            client.requestApi("put", `${constants.api.ehealth.update_data_user}/${id}`, body, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    detailPatientHistory(patientHistoryId, hospitalId,id) {
        let id2 = id ? `&id=${id}` : ''
        return new Promise((resolve, reject) => {
            client.requestApi(
                "get",
                constants.api.booking.get_detail_patient_historyid +
                "/" +
                patientHistoryId +
                "?hospitalId=" +
                hospitalId + id2,
                {},
                (s, e) => {
                    if (s) resolve(s);
                    else reject(e);
                }
            );
        });
    },

    search(page, size, queryString) {
        let active = 1
        let specialistId = -1
        let type = 2
        let roleId = -1
        let style = -1
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.ehealth.search_profile_user}?page=${page}&size=${size}&queryString=${queryString}&active=${active}&specialistId=${specialistId}&type=${type}&roleId=${roleId}&style=${style}`, {}, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    shareWithProfile(recieveUserId,hospitalId,patientHistoryId) {
        let body = {
            recieveUserId:recieveUserId,
            hospitalId:hospitalId,
            patientHistoryId:patientHistoryId
        }
        return new Promise((resolve, reject) => {
            client.requestApi('post',constants.api.ehealth.share_with_profile, body, (s, e) => {
                if (s)
                    resolve(s)
                else {
                    reject(e)
                }
            })
        })
    }

}