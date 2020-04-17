const Realm = require('realm');
// import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import realmModel from '@models/realm-models';
module.exports = {
    save(userId, key, value, saveToLocalStorage) {
        if (saveToLocalStorage) {
            AsyncStorage.setItem(userId + "_" + key, JSON.stringify({
                value: value
            }));
            return;
        }
        const { DataString, Schemas, schemaVersion } = realmModel;
        var _value = JSON.stringify({ data: value });
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
                        let _key = "DataString_" + userId + "_" + key;
                        var results = realm.objects(DataString.name).filtered("key == '" + _key + "'");
                        if (results && results.length > 0) {
                            results[0].value = _value;
                            return;
                        }
                        const obj = realm.create(DataString.name, {
                            key: _key,
                            value: _value
                        });
                    } catch (error) {
                        console.log(error);
                    }
                });
            });

        } catch (error) {
            console.log(error);
        }
    },
    read(userId, key, callback, fromLocalStorage) {
        if (callback) {
            try {
                if (fromLocalStorage) {
                    AsyncStorage.getItem(userId + "_" + key).then(value => {
                        if (value) {
                            let json = JSON.parse(value);
                            callback(json.value);
                        }
                        else {
                            callback(undefined, { message: "not found" });
                        }
                    });
                    return;
                }
                const { Schemas, DataString, schemaVersion } = realmModel;
                Realm.open({
                    schema: Schemas,
                    schemaVersion,
                    migration: function (oldRealm, newRealm) {
                        newRealm.deleteAll();
                    }
                }).then((realm) => {
                    try {
                        let _key = "DataString_" + userId + "_" + key;
                        var data = realm.objects(DataString.name).filtered("key == '" + _key + "'");
                        if (data && data.length > 0) {
                            var _value = JSON.parse(data[0].value);
                            if (_value)
                                callback(_value.data);
                        }
                        else
                            callback(undefined, { message: "not found" });
                    } catch (e) {
                        callback(undefined, {
                            message: JSON.stringify(e)
                        });
                    }
                }).catch(e => {
                    callback(undefined, {
                        message: e ? JSON.stringify(e) : ""
                    });
                });
            } catch (e) {
                callback(undefined, {
                    message: e ? JSON.stringify(error) : ""
                });
            }
        }
    },
    readPromise(userId, key, fromLocalStorage) {
        return new Promise((resolve, reject) => {
            try {
                if (fromLocalStorage) {
                    AsyncStorage.getItem(userId + "_" + key).then(value => {
                        if (value) {
                            let json = JSON.parse(value);
                            resolve(json.value);
                        }
                        else {
                            reject({ message: "not found" });
                        }
                    });
                } else {
                    const { Schemas, DataString, schemaVersion } = realmModel;
                    Realm.open({
                        schema: Schemas,
                        schemaVersion,
                        migration: function (oldRealm, newRealm) {
                            newRealm.deleteAll();
                        }
                    }).then((realm) => {
                        try {
                            let _key = "DataString_" + userId + "_" + key;
                            var data = realm.objects(DataString.name).filtered("key == '" + _key + "'");
                            if (data && data.length > 0) {
                                var _value = JSON.parse(data[0].value);
                                if (_value) {
                                    resolve(_value.data);
                                }
                            }
                            else {
                                reject({ message: "not found" });
                            }
                        } catch (e) {
                            reject({
                                message: e ? JSON.stringify(e) : ""
                            });
                        }
                    }).catch(e => {
                        reject({
                            message: e ? JSON.stringify(e) : ""
                        });
                    });
                }
            } catch (e) {
                reject({
                    message: e ? JSON.stringify(e) : ""
                });
            }
        });
    }
}