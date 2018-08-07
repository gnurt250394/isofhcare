import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';

module.exports = {
    getByUserConference(userId, conferenceId, callback) {
        client.requestApi("get", constants.api.schedule.get_by_user_conference + "?userId=" + userId + "&conferenceId=" + conferenceId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}