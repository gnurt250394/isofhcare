import client from '@utils/client-utils';
import dhyCommand from '@dhy/strings';
import datacacheProvider from '@data-access/datacache-provider';

module.exports = {
    syncDepartment(callback) {
        client.requestApi("get", dhyCommand.api.department.getList + "/" + 1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save('', dhyCommand.key.storage.department, s.data.departments);
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
        datacacheProvider.read('', dhyCommand.key.storage.department, (s, e) => {
            if (!s)
                this.syncDepartment(callback)
            if (s && callback) {
                callback(s);
            }
        }, err => {
            console.log(err);
        });
        this.syncDepartment();
    }
}