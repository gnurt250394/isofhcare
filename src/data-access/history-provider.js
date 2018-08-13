const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    addHistory(userId, type, name, dataId, data) {
        const { SearchHistory } = realmModel;
        try {
            Realm.open({
                schema: [SearchHistory],
                schemaVersion: SearchHistory.schemaVersion,
                migration: function (oldRealm, newRealm) {
                    newRealm.deleteAll();
                }
            }).then(realm => {
                realm.write(() => {
                    try {
                        let id = "SearchHistory_" + userId + "_" + type + "_" + dataId;
                        var results = realm.objects(SearchHistory.name).filtered("type == " + type).filtered("userId == $0", userId + "").sorted('timeSearch', true);
                        if (results.length > 5)
                            realm.delete(results[results.length - 1]);
                        for (var i = 0; i < results.length - 1; i++) {
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

                        const obj = realm.create(SearchHistory.name, {
                            id: id,
                            dataId: dataId + "",
                            type: type,
                            name: name,
                            timeSearch: new Date().getTime(),
                            userId: userId
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
    getListHistory(userId, type, callback) {
        try {
            const { SearchHistory } = realmModel;
            Realm.open({
                schema: [SearchHistory], schemaVersion: SearchHistory.schemaVersion,
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