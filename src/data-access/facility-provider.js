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
        client.requestApi("get", constants.api.facility.search + "?sortType=1&page=" + page + "&size=" + size + "&latitude=" + lat + "&longitude=" + lon + "&approval=1", {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    search(name, page, size, callback) {
        client.requestApi("get", constants.api.facility.search + "?sortType=2&page=" + page + "&size=" + size + "&name=" + name, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    searchBySpecialist(specialistId, page, size, callback) {
        client.requestApi("get", constants.api.facility.search_by_query + "?page=" + page + "&size=" + size + "&specialistId=" + specialistId + "&approval=1", {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    myFacility(name, userId, page, size, callback) {
        client.requestApi("get", constants.api.facility.search + "?userId=" + userId + "&page=" + page + "&size=" + size + "&name=" + name, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    createClinic(name, website, phone, address, place, logo, imageUrls, specialistIds, provinceId, userId, callback) {
        this.create(
            {
                logo,
                name,
                address,
                belongIsofh: 0,
                latitude: place.latitude,
                longitude: place.longitude,
                phone,
                type: 2,
                website
            },
            imageUrls,
            specialistIds,
            provinceId,
            userId,
            callback
        );
    },
    updateClinic(id, name, website, phone, address, place, logo, imageUrls, specialistIds, provinceId, callback) {
        this.update(
            id,
            {
                logo,
                name,
                address,
                belongIsofh: 0,
                latitude: place.latitude,
                longitude: place.longitude,
                phone,
                type: 2,
                website
            },
            imageUrls,
            specialistIds,
            provinceId,
            callback
        );
    },
    createDrugStore(name, website, phone, address, place, logo, imageUrls, licenseNo, pharmacist, gpp, provinceId, userId, callback) {
        this.create(
            {
                logo,
                name,
                code: licenseNo,
                pharmacist,
                address,
                belongIsofh: 0,
                latitude: place.latitude,
                longitude: place.longitude,
                phone,
                type: 8,
                gpp: gpp ? 1 : 0,
                website
            },
            imageUrls,
            null,
            provinceId,
            userId,
            callback
        );
    },
    updateDrugStore(id, name, website, phone, address, place, logo, imageUrls, licenseNo, pharmacist, gpp, provinceId, callback) {
        this.update(
            id,
            {
                logo,
                name,
                code: licenseNo,
                pharmacist,
                address,
                belongIsofh: 0,
                latitude: place.latitude,
                longitude: place.longitude,
                phone,
                type: 8,
                gpp: gpp ? 1 : 0,
                website
            },
            imageUrls,
            null,
            provinceId,
            callback);
    },
    create(facility, imageUrls, specialistIds, provinceId, userId, callback) {
        client.requestApi("post", constants.api.facility.create,
            {
                facility,
                imageUrls,
                provinceId,
                specialistIds,
                userId
            }, (s, e) => {
                if (callback)
                    callback(s, e);
            });
    },
    update(id, facility, imageUrls, specialistIds, provinceId, callback) {
        client.requestApi("put", constants.api.facility.update + "/" + id,
            {
                facility,
                imageUrls,
                provinceId,
                specialistIds
            }, (s, e) => {
                if (callback)
                    callback(s, e);
            });
    },
    review(id, value, callback) {
        client.requestApi("put", constants.api.facility.review + "/" + id,
            {
                review: value
            }, (s, e) => {
                if (callback)
                    callback(s, e);
            });
    }
}