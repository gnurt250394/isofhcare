import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getTop(top, callback) {
        client.requestApi("get", constants.api.facility.search + "?page=" + 1 + "&size=" + top, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}