import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getTop(top, callback, requestApi) {
        if (!requestApi)
            datacacheProvider.read("", constants.key.storage.DATA_TOP_DRUG, (s, e) => {
                if (s) {
                    if (callback)
                        callback(s, e);
                    this.getTop(top, callback, true);
                }
                else
                    this.getTop(top, null, true);
            });
        else
            this.search("", 1, top, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.data) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_DRUG, s.data.data);
                    if (callback)
                        callback(s.data.data, e);
                }
            });
    },

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