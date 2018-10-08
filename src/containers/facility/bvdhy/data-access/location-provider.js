import client from '@utils/client-utils';
import dhyCommand from '@dhy/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    syncCountry(callback) {
        client.requestApi("get", dhyCommand.api.location.getListCountry  + "?source="+1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save(dhyCommand.key.storage.country, s.data.countries);
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
        datacacheProvider.read(dhyCommand.key.storage.country, null, (s) => {
            if (!s)
                this.syncCountry(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncCountry();
    },
    syncProvince(callback) {
        client.requestApi("get", dhyCommand.api.location.getListProvince   + "?source="+1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save(dhyCommand.key.storage.province, s.data.provinces);
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
        datacacheProvider.read(dhyCommand.key.storage.province, null, (s) => {
            if (!s)
                this.syncProvince(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncProvince();
    },
    syncDistrict(callback) {
        client.requestApi("get", dhyCommand.api.location.getListDistrict + "?source="+1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save(dhyCommand.key.storage.district, s.data.districts);
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
        datacacheProvider.read(dhyCommand.key.storage.district, null, (s) => {
            if (!s)
                this.syncDistrict(callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncDistrict();
    },
    syncZone(districtId, callback) {
        client.requestApi("get", dhyCommand.api.location.getListZone + "/" + districtId + "?source="+1, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    datacacheProvider.save(dhyCommand.key.storage.zone + districtId, s.data.zones);
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
        datacacheProvider.read(dhyCommand.key.storage.zone + districtId, null, (s) => {
            if (!s)
                this.syncZone(districtId, callback)
            if (s && callback) {
                callback(s);
            }
        });
        this.syncZone(districtId);
    }
}