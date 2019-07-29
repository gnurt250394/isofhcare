import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {    
    getListBanner(requestApi) {
        return new Promise((resolve, reject) => {
            if (!requestApi) {
                datacacheProvider.readPromise("", constants.key.storage.LIST_BANNER).then(s => {
                    this.getListBanner(true);
                    resolve(s);
                }).catch(e => {
                    this.getListBanner(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        reject([]);
                    })
                });
            }
            else {
                client.requestApi("get", constants.api.advertise.get_list_banner, {}, (s, e) => {
                    if (s && s.code == 0 && s.data && s.data.banner ) {
                        datacacheProvider.save("", constants.key.storage.LIST_BANNER, s.data.banner);
                        resolve(s.data.banner);
                    }
                    reject([]);
                });
            }
        });
    },
    create(content, title, type, value, images) {
        return new Promise((resolve, reject) => {
            client.requestApi("post", constants.api.advertise.create, {
                advertise: {
                    content,
                    title,
                    type,
                    value,
                    images
                }
            }, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        })
    },
    getTop(top, callback, requestApi) {
        if (!requestApi) {
            datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_ADS + top).then(s => {
                if (callback)
                    callback(s);
                this.getTop(top, null, true);
            }).catch(e => {
                this.getTop(top, callback, true);
            });
        }
        else {
            this.search(1, top).then(s => {
                if (s && s.code == 0 && s.data && s.data.data && s.data.data) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_ADS + top, s.data.data);
                    if (callback) {
                        callback(s.data.data, e);
                    }
                }
            }).catch(e => {
                if (callback)
                    callback(undefined, e);
            });
        }
    },
    search(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.advertise.search + "?page=" + page + "&size=" + size, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    }
}