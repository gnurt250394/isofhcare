import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    getTop(top, callback) {
        datacacheProvider.read("", constants.key.storage.DATA_TOP_SPECIALIST, (s, e) => {
            if (s) {
                if (callback)
                    callback(s, e);
                this.getTopRequestApi(top, callback);
            }
            else
                this.getTopRequestApi(top);
        });
    },
    getTopRequestApi(top, callback) {
        client.requestApi("get", constants.api.specialist.search + "?page=" + 1 + "&size=" + top, {}, (s, e) => {
            if (s && s.code == 0 && s.data && s.data.data) {
                datacacheProvider.save("", constants.key.storage.DATA_TOP_SPECIALIST, s.data.data);
                if (callback)
                    callback(s.data.data, e);
            }
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
                                alert(error);
                                console.log(error);
                            }
                        });
                    }).catch(error => {
                        alert(error);
                        console.log(error);
                    });
                } catch (error) {
                    alert(error);
                    console.log(error);
                }
            }
        });
    }
}