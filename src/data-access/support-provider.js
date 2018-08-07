import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    send(conferenceId, userId, phone, content, callback) {
        client.requestApi("post", constants.api.support.create, {
            support: {
                content,
                phone
            },
            userId,
            conferenceId
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getByConference(conferenceId, page, size, callback) {
        client.requestApi("get", constants.api.support.get_by_conference + "/" + conferenceId + "?page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}