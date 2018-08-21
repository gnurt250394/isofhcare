const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    save(userId, key, value) {
        const { DataString, schemaVersion } = realmModel;
        var _value = JSON.stringify({ data: value });
        try {
            Realm.open({
                schema: [DataString],
                schemaVersion,
                migration: function (oldRealm, newRealm) {
                    newRealm.deleteAll();
                }
            }).then(realm => {
                realm.write(() => {
                    try {
                        let key = "DataString_" + userId + "_" + key;
                        var results = realm.objects(DataString.name).filtered("key == '" + key + "'");
                        if (results && results.length > 0) {
                            results[0].value = _value;
                            return;
                        }
                        const obj = realm.create(DataString.name, {
                            key: key,
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
    read(userId, key, callback) {
        try {
            const { DataString, schemaVersion } = realmModel;
            Realm.open({
                schema: [DataString],
                schemaVersion,
                migration: function (oldRealm, newRealm) {
                    newRealm.deleteAll();
                }
            }).then((realm) => {
                try {
                    let key = "DataString_" + userId + "_" + key;
                    var data = realm.objects(DataString.name).filtered("key == '" + key + "'");
                    if (data && data.length > 0) {
                        var _value = JSON.parse(data[0].value);
                        if (callback) {
                            if (_value)
                                callback(_value.data);
                            return;
                        }
                    }
                    if (callback)
                        callback({}, {});
                    return;
                } catch (error) {
                    if (callback)
                        callback({}, error);
                }
            }).catch((e) => {
                if (callback)
                    callback({}, e);
                console.log(e);
            });
        } catch (error) {
            if (callback)
                callback({}, error);
            console.log(error);
        }
    }
}