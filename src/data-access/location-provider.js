import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    syncCountry(callback) {
        client.requestApi("get", constants.api.location.getListCountry, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.country, s.data.countries);
                    if (callback)
                        callback(s.data.countries);
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
    getListCountry(callback) {
        storage.get(constants.key.storage.country, null, (s) => {
            if (!s)
                this.syncCountry(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncCountry();
    },
    syncProvince(callback) {
        client.requestApi("get", constants.api.location.getListProvince, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.province, s.data.provinces);
                    if (callback)
                        callback(s.data.provinces);
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
    getListProvince(callback) {
        storage.get(constants.key.storage.province, null, (s) => {
            if (!s)
                this.syncProvince(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncProvince();
    },
    syncDistrict(callback) {
        client.requestApi("get", constants.api.location.getListDistrict, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.district, s.data.districts);
                    if (callback)
                        callback(s.data.districts);
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
    getListDistrict(callback) {
        storage.get(constants.key.storage.district, null, (s) => {
            if (!s)
                this.syncDistrict(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncDistrict();
    },
    syncZone(districtId, callback) {
        client.requestApi("get", constants.api.location.getListZone + "/" + districtId, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.zone + districtId, s.data.zones);
                    if (callback)
                        callback(s.data.zones);
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
    getListZone(districtId, callback) {
        storage.get(constants.key.storage.zone + districtId, null, (s) => {
            if (!s)
                this.syncZone(districtId, callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncZone(districtId);
    }
}