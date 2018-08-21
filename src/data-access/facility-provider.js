import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getTop(top, callback) {
        datacacheProvider.read("", constants.key.storage.DATA_TOP_FACILITY, (s, e) => {
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
        client.requestApi("get", constants.api.facility.search + "?sortType=2&page=" + 1 + "&size=" + top, {}, (s, e) => {
            if (s && s.code == 0 && s.data && s.data.data) {
                datacacheProvider.save("", constants.key.storage.DATA_TOP_FACILITY, s.data.data);
                if (callback)
                    callback(s.data.data, e);
            }
        });
    },
    searchByLatLon(lat, lon, page, size, callback) {
        client.requestApi("get", constants.api.facility.search + "?sortType=1&page=" + page + "&size=" + size + "&latitude=" + lat + "&lon=" + lon, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    search(name, page, size, callback) {
        client.requestApi("get", constants.api.facility.search + "?sortType=2&page=" + page + "&size=" + size + "&name=" + name, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }

}