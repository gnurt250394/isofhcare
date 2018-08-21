import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    getTop(top, callback) {
        datacacheProvider.read("", constants.key.storage.DATA_TOP_SPECIALIST, (s, e) => {
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
        client.requestApi("get", constants.api.specialist.search + "?page=" + 1 + "&size=" + top, {}, (s, e) => {
            if (s && s.code == 0 && s.data && s.data.data) {
                datacacheProvider.save("", constants.key.storage.DATA_TOP_SPECIALIST, s.data.data);
                if (callback)
                    callback(s.data.data, e);
            }
        });
    }
}