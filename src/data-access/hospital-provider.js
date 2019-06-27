import client from '@utils/client-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

module.exports = {
    getAll() {
        return new Promise((resolve, reject) => {
            client.requestApi("post", `${constants.api.hospital.get_all}?type=-1`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    getByProfile() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.hospital.get_hospital_by_profile}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    getByServiceType(serviceType, name) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.hospital.get_hospital_by_service_type}?serviceTypeId=${serviceType}&name=${name}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    getBySearch(page, size, stringQuyery, serviceType) {
        let keyWord = stringQuyery ? `stringQuyery=${stringQuyery}` : 'stringQuyery='
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.hospital.get_hospital_by_search}?page=${page}&size=${size}&serviceTypeId=${serviceType}&${keyWord}&active=1&type=-1`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        })
    },
    getByLocation(page, size, lat, lon, stringQuyery, serviceTypeId) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.hospital.get_by_location}?page=${page}&size=${size}&serviceTypeId=${serviceTypeId}&lat=${lat}&lon=${lon}&stringQuyery=${stringQuyery}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        })
    },
    getDefaultHospital() {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.hospital.get_default_hospital}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else {
                    reject(e)
                }
            })
        })
    },
    getHistoryHospital2() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.hospital.get_hospital_by_profile, {}, (s, e) => {
                if (s)
                    resolve(s);
                reject(e);
            });
        });
    },
    getHistoryHospital(token) {
        return new Promise((resolve, reject) => {
            let url = constants.api.hospital.get_hospital_by_profile
            client.requestApiWithHeader("get", url, {}, { Authorization: token }, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    getDetailsById(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', constants.api.hospital.get_details_hospital + '/' + id, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    getListTopRateHospital(requestApi) {
        return new Promise((resolve, reject) => {
            if (!requestApi) {
                datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_HOSPITAL).then(s => {
                    this.getListTopRateHospital(true);
                    resolve(s);
                }).catch(e => {
                    this.getListTopRateHospital(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        resolve([]);
                    })
                });
            }
            else {
                client.requestApi("get", constants.api.home.get_list_hospital_top_rate, {}, (s, e) => {
                    if (s && s.code == 0 && s.data && s.data.hospitals ) {
                        datacacheProvider.save("", constants.key.storage.DATA_TOP_HOSPITAL, s.data.hospitals);
                        resolve(s.data.hospitals);
                    }
                    resolve([]);
                });
            }
        });
    }
}