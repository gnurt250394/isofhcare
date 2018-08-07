import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getByConference(conferenceId, callback) {
        client.requestApi("get", constants.api.conference_topic.get_by_conference + "?conferenceId=" + conferenceId + "&page=" + 1 + "&size=" + 100000, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}