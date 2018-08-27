const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    addHistory(userId, type, name, dataId, data) {
        const { Schemas, schemaVersion } = realmModel;
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
                        let id = "SearchHistory_" + userId + "_" + type + "_" + dataId;
                        var results = realm.objects(SearchHistory.name).filtered("type == " + type).filtered("userId == $0", userId + "").sorted('timeSearch', true);
                        let isDelete = false;
                        if (results.length > 5) {
                            realm.delete(results[results.length - 1]);
                            isDelete = true;
                        }
                        for (var i = 0; i < results.length - (isDelete ? 1 : 0); i++) {
                            if (results[i]) {
                                if (results[i].id == id) {
                                    results[i].timeSearch = new Date().getTime();
                                    results[i].name = name;
                                    results[i].dataId = dataId + "";
                                    results[i].type = type;
                                    results[i].data = data;
                                    results[i].userId = userId;
                                    return;
                                }
                            }
                        }

                        const obj = realm.create(SearchHistory.name, {
                            id: id,
                            dataId: dataId + "",
                            type: type,
                            name: name,
                            timeSearch: new Date().getTime(),
                            userId: userId,
                            data: data
                        });
                    } catch (error) {
                    }

                });
            });

        } catch (error) {
            console.log(error);
        }
    },
    getListHistory(userId, type, callback) {
        try {
            const { Schemas, schemaVersion } = realmModel;
            Realm.open({
                schema: Schemas,
                schemaVersion,
                migration: function (oldRealm, newRealm) {
                    newRealm.deleteAll();
                }
            }).then((realm) => {
                try {
                    var data = realm.objects(SearchHistory.name).filtered("type == " + type).filtered("userId == $0", userId + "").sorted('timeSearch', true);
                    if (callback)
                        callback(data);
                } catch (error) {
                    if (callback)
                        callback([], error);
                }
            }).catch((e) => {
                if (callback)
                    callback([], e);
                console.log(e);
            });
        } catch (error) {
            console.log(error);
        }
    }
}