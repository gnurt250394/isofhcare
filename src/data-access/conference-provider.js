import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';
import { Platform } from 'react-native'

const os = Platform.select({
    ios: 2,
    android: 2
});
module.exports = {
    getByUser(userId, page, size, callback) {
        client.requestApi("get", constants.api.conference.get_by_user + "/" + userId + "?page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    confirm(userId, conferenceId, attachment, callback) {
        client.requestApi("put", constants.api.conference.confirm, { userId, conferenceId, attachment }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    checkin(userId, conferenceId, attachment, callback) {
        client.requestApi("put", constants.api.conference.checkin, { userId, conferenceId, attachment }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}