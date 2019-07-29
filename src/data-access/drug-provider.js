import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getTop(top, callback, requestApi) {
        if (!requestApi)
            datacacheProvider.read("", constants.key.storage.DATA_TOP_DRUG, (s, e) => {
                if (s) {
                    if (callback)
                        callback(s, e);
                    this.getTop(top, null, true);
                }
                else
                    this.getTop(top, callback, true);
            });
        else
            this.searchTop("", 1, top, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.data) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_DRUG, s.data.data);
                    if (callback)
                        callback(s.data.data, e);
                }
            });
    },
    searchTop(name, page, size, callback) {
        client.requestApi("get", constants.api.drug.search + "?name=" + name + "&page=" + page + "&size=" + size + "&sortType=1", {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },

    search(name, page, size, callback) {
        client.requestApi("get", constants.api.drug.search + "?name=" + name + "&page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    updateViewCount(id, callback) {
        client.requestApi("put", constants.api.drug.update_view_count + "/" + id, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getListDrug(requestApi) {
        return new Promise((resolve, reject) => {
            if (!requestApi) {
                datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_DRUG).then(s => {
                    this.getListDrug(true);
                    resolve(s);
                }).catch(e => {
                    this.getListDrug(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        reject([]);
                    })
                });
            }
            else {
                client.requestApi("get", constants.api.home.get_list_drug, {}, (s, e) => {
                    if (s && s.code == 0 && s.data && s.data.medicines ) {
                        datacacheProvider.save("", constants.key.storage.DATA_TOP_DRUG, s.data.medicines);
                        resolve(s.data.medicines);
                    }
                    reject([]);
                });
            }
        });
    }
}