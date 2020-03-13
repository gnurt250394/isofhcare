import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
const URL = 'http://10.0.0.98:8080/'
export default {
    getAll(hospitalId, specialistId, serviceTypeId, requestApi) {
        return new Promise((resolve, reject) => {
            // if (!requestApi) {
            //     datacacheProvider.readPromise(hospitalId, constants.key.storage.DATA_SERVICE_TYPE).then(s => {
            //         this.getAll(hospitalId, true);
            //         resolve(s);
            //     }).catch(e => {
            //         this.getAll(hospitalId, true).then(s => {
            //             resolve(s);
            //         }).catch(e => {
            //             reject(e);
            //         })
            //     });
            // }
            // else {
            client.requestApi("get", `${constants.api.service.get_all}/${hospitalId}?specialistId=${specialistId}&serviceTypeId=${serviceTypeId}&page=1&size=1000`, {}, (s, e) => {
                // if (s && s.code == 0 && s.data && s.data.services) {
                // datacacheProvider.save(hospitalId, constants.key.storage.DATA_SERVICE_TYPE, s.data.services);
                if (s)
                    resolve(s);
                // }
                reject(e);
            });
            // }
        });
    },
    getAllServices(hospitalId) {
        return new Promise((resolve, reject) => {
            // if (!requestApi) {
            //     datacacheProvider.readPromise(hospitalId, constants.key.storage.DATA_SERVICE_TYPE).then(s => {
            //         this.getAll(hospitalId, true);
            //         resolve(s);
            //     }).catch(e => {
            //         this.getAll(hospitalId, true).then(s => {
            //             resolve(s);
            //         }).catch(e => {
            //             reject(e);
            //         })
            //     });
            // }
            // else {
            client.requestApi("get", `${client.serviceSchedule}${constants.api.service.get_all_services}/${hospitalId}/hospital?page=0&size=999&sort=desc&properties=created`, {}, (s, e) => {
                // if (s && s.code == 0 && s.data && s.data.services) {
                // datacacheProvider.save(hospitalId, constants.key.storage.DATA_SERVICE_TYPE, s.data.services);
                if (s)
                    resolve(s);
                // }
                reject(e);
            });
            // }
        });
    },
    searchCategory(name, page = 0, size = 9999) {
        let parameters =
            (name ? 'name=' + name + '&' : '') +
            ('page=' + page) +
            ('&size=' + size)
        return new Promise((resolve, reject) => {
            client.requestApi("get", client.serviceSchedule + constants.api.category.category +
                parameters, {}, (x, e) => {
                    resolve(x);
                    if (e)
                        reject(e);
                })
        })
    },
    getListServices( medicalName, categoryId, status, page, size) {
        let parameters =
            (medicalName ? 'medicalName=' + medicalName + '&' : '') +
            (categoryId ? 'categoryId=' + categoryId + '&' : '') +
            (status ? 'status=' + status + '&' : '') +
            (page != null || page != undefined ? 'page=' + page + '&' : '') +
            (size ? 'size=' + size : '')
        return new Promise((resolve, reject) => {
            client.requestApi("get", client.serviceSchedule + constants.api.service.get_all_services +
                '/search' + '?' + parameters, {}, (x, e) => {
                    resolve(x);
                    if (e)
                        reject(e);
                })
        })
    }
}