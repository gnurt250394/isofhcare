import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
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
    }
}