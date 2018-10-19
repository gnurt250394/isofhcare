import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getTop(top, callback) {
        datacacheProvider.read("", constants.key.storage.DATA_TOP_DISEASE, (s, e) => {
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
        client.requestApi("get", constants.api.disease.search + "?sortType=1&page=" + 1 + "&size=" + top, {}, (s, e) => {
            if (s && s.code == 0 && s.data && s.data.data && s.data.data) {

                datacacheProvider.save("", constants.key.storage.DATA_TOP_DISEASE, s.data.data);
                if (callback) {
                    callback(s.data.data, e);
                }
            }
        });
    },
    search(name, page, size, callback) {
        client.requestApi("get", constants.api.disease.search_by_disease_symptom + "?page=" + page + "&size=" + size + "&name=" + name, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    updateViewCount(id, callback) {
        client.requestApi("put", constants.api.disease.update_view_count + "/" + id, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    searchBySymptom(symtomId, page, size, callback) {
        client.requestApi("get", constants.api.disease.search_disease_by_symptom + "?page=" + page + "&size=" + size + "&symptomId=" + symtomId + "&sortType=1", {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
}