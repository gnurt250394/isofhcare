import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getAll(requestApi, hospitalId) {
        return new Promise((resolve, reject) => {
            if (!requestApi) {
                datacacheProvider.readPromise(hospitalId, constants.key.storage.DATA_SERVICE_TYPE).then(s => {
                    this.getAll(true, hospitalId);
                    resolve(s);
                }).catch(e => {
                    this.getAll(true, hospitalId).then(s => {
                        resolve(s);
                    }).catch(e => {
                        reject(e);
                    })
                });
            }
            else {
                client.requestApi("get", constants.api.serviceType.get_all + "?hospitalId=" + hospitalId, {}, (s, e) => {
                    if (s && s.code == 0 && s.data && s.data.serviceType) {
                        let data = s.data.serviceType.filter(item => !item.deleted);
                        datacacheProvider.save(hospitalId, constants.key.storage.DATA_SERVICE_TYPE, data);
                        resolve(data);
                    }
                    reject(e);
                });
            }
        });
    },
    search(keyword, page, size, callback) {
        client.requestApi("get", constants.api.symptom.search + "?name=" + keyword + "&page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}