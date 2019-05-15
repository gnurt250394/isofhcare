import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    getAll(requestApi) {
        return new Promise((resolve, reject) => {
            if (!requestApi) {
                datacacheProvider.readPromise("", constants.key.storage.DATA_SPECIALIST).then(s => {
                    this.getAll(true);
                    resolve(s);
                }).catch(e => {
                    this.getAll(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        reject(e);
                    })
                });
            }
            else {
                client.requestApi("get", constants.api.specialist.get_all, {}, (s, e) => {
                    if (s && s.code == 0 && s.data && s.data.specialists) {
                        datacacheProvider.save("", constants.key.storage.DATA_SPECIALIST, s.data.specialists);
                        resolve(s.data.specialists);
                    }
                    reject(e);
                });
            }
        });
    },
    getTop(top, callback, requestApi) {
        if (requestApi) {
            client.requestApi("get", constants.api.specialist.search + "?page=" + 1 + "&size=" + top, {}, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.data) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_SPECIALIST + "_" + top, s.data.data);
                    if (callback)
                        callback(s.data.data, e);
                }
            });
        }
        else
            datacacheProvider.read("", constants.key.storage.DATA_TOP_SPECIALIST + "_" + top, (s, e) => {
                if (s) {
                    if (callback)
                        callback(s, e);
                    this.getTop(top, null, true);
                }
                else
                    this.getTop(top, callback, true);
            });
    },
    search(keyword, top, callback) {
        try {
            if (!callback)
                return;
            if (!keyword || keyword.trim() == "") {
                if (callback)
                    callback([]);
                return;
            }
            const { Schemas, Specialist, schemaVersion } = realmModel;
            Realm.open({
                schema: Schemas,
                schemaVersion,
                migration: function (oldRealm, newRealm) {
                    newRealm.deleteAll();
                }
            }).then(realm => {
                try {
                    let textSeach = keyword.unsignText().toLowerCase().replace(/ /g, '');
                    var result = realm.objects(Specialist.name).filtered("nameSearch CONTAINS[c] $0", textSeach);
                    if (result.length > top) {
                        callback(result.slice(0, top));
                    }
                    else {
                        callback(result);
                    }
                } catch (error) {
                    console.log(error);
                    callback([]);
                }
            }).catch(error => {
                console.log(error);
                callback([]);
            })
        } catch (error) {
            console.log(error);
            callback([]);
        }
    },
    saveAllSpecialist() {
        client.requestApi("get", constants.api.specialist.search + "?page=" + 1 + "&size=" + 1000, {}, (s, e) => {
            if (s && s.code == 0 && s.data && s.data.data) {

                const { Schemas, Specialist, schemaVersion } = realmModel;
                try {
                    Realm.open({
                        schema: Schemas,
                        schemaVersion,
                        migration: function (oldRealm, newRealm) {
                            newRealm.deleteAll();
                        }
                    }).then(realm => {
                        realm.write(() => {
                            try {
                                s.data.data.forEach((item, index) => {
                                    let specialist = item.specialist;
                                    var result = realm.objects(Specialist.name).filtered("id == '" + specialist.id + "'");
                                    if (result && result.length > 0) {
                                        let temp = result[0];
                                        temp.name = specialist.name ? specialist.name : "";
                                        temp.nameSearch = specialist.name ? specialist.name.unsignText().toLowerCase().replace(/ /g, '') : "";
                                        temp.data = JSON.stringify(specialist);
                                    } else {
                                        realm.create(Specialist.name, {
                                            id: specialist.id + "",
                                            name: specialist.name ? specialist.name : "",
                                            nameSearch: specialist.name ? specialist.name.unsignText().toLowerCase().replace(/ /g, '') : "",
                                            data: JSON.stringify(specialist)
                                        });
                                    }
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    },
    searchFromApi(keyword, page, size, callback) {
        client.requestApi("get", constants.api.specialist.search + "?name=" + keyword + "&page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    updateViewCount(id, callback) {
        client.requestApi("put", constants.api.specialist.update_view_count + "/" + id, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}