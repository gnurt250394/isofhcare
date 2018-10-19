import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getTop(top, callback, requestApi) {
        if (!requestApi) {
            datacacheProvider.read("", constants.key.storage.DATA_TOP_SYMPTOM, (s, e) => {
                if (s) {
                    if (callback)
                        callback(s, e);
                    this.getTopRequestApi(top, null, true);
                }
                else
                    this.getTopRequestApi(top, callback, true);
            });
        }
        else {
            client.requestApi("get", constants.api.symptom.search + "?sortType=1&page=" + 1 + "&size=" + top, {}, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.data) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_SYMPTOM, s.data.data);
                    if (callback) {
                        callback(s.data.data, e);
                    }
                }
            });
        }
    },
    search(keyword, page, size, callback) {
        client.requestApi("get", constants.api.symptom.search + "?name=" + keyword + "&page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}