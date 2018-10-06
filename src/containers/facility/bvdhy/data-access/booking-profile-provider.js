import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@dhy/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    createProfile(uId, fullname, gender, dob, countryId, countryName, provinceId, provinceName, districtId, districtName, zoneId, zoneName, phoneNumber, guardianPhoneNumber, guardianName, callback) {

        client.requestApi("post", constants.api.booking_profile.create, {
            userId: uId,
            countryId,
            provinceId,
            districtId,
            zoneId,
            profile: {
                name: fullname,
                gender: gender,
                dob: dob,
                phone: phoneNumber,
                guardianName,
                guardianPhone:guardianPhoneNumber,
                guardianPassport:""
            }

            // profile:
            //     {
            //         patientName: fullname,
            //         dob: dob,
            //         gender: gender,
            //         countryId: countryId,
            //         countryName: countryName,
            //         provinceId: provinceId ? provinceId : 0,
            //         provinceName: provinceName,
            //         districtId: districtId ? districtId : 0,
            //         districtName: districtName,
            //         zoneId: zoneId ? zoneId : 0,
            //         zoneName: zoneName,
            //         phoneNumber,
            //         guardianPhoneNumber,
            //         guardianName
            //     }
        }, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
            }
        });
    },
    syncListProfile(userId, callback) {
        client.requestApi("get", constants.api.profile.get_profile + "/" + userId, {}, (s, e) => {
            try {
                if (s && s.code == 0) {
                    storage.save(constants.key.storage.user_profile + userId, s.data.profiles[0]);
                    if (callback)
                        callback(s.data.profiles[0]);
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
    getListProfiles(userId, callback) {
        storage.get(constants.key.storage.user_profile + userId, null, (s) => {
            if (!s || s.length == 0)
                this.syncListProfile(userId, callback)
            if (s && s.length != 0 && callback) {
                // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                // console.log(s)
                // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                callback(s);
            }
        });
        this.syncListProfile(userId);
    },
    getAddress(profile) {
        var address = "";
        if (profile.zoneName)
            address += profile.zoneName;
        if (profile.districtName) {
            if (address)
                address += ", ";
            address += profile.districtName;
        }
        if (profile.provinceName) {
            if (address)
                address += ", ";
            address += profile.provinceName;
        }
        if (profile.countryName) {
            if (address)
                address += ", ";
            address += profile.countryName;
        }
        return address;
    }
}