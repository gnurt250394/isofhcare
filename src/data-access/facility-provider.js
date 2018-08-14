import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getTop(top, callback) {
        client.requestApi("get", constants.api.facility.search + "?sortType=2&page=" + 1 + "&size=" + top, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    searchByLatLon(lat, lon, page, size, callback) {
        client.requestApi("get", constants.api.facility.search + "?sortType=1&page=" + page + "&size=" + size + "&latitude=" + lat + "&lon=" + lon, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}