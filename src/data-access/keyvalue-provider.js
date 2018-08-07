import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    get(key, callback) {
        client.requestApi("get", constants.api.keyvalue.get + "/" + key, {
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    set(key, value, callback) {
        client.requestApi("put", constants.api.keyvalue.set + "/" + key, {
            value: value
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}