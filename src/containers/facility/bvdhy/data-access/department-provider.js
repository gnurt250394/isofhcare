import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    syncDepartment(callback) {
        client.requestApi("get", constants.api.department.getList, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.department, s.data.departments);
                    if (callback)
                        callback(s.data.departments);
                    return;
                }
                if (callback)
                    callback([]);
            } catch (error) {
                if (callback)
                    callback([]);
            }
        });
    },
    getListDepartment(callback) {
        storage.get(constants.key.storage.department, null, (s) => {
            if (!s)
                this.syncDepartment(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncDepartment();
    }
}