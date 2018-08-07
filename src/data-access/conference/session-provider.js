import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getByTopic(topicId, callback) {
        client.requestApi("get", constants.api.conference_session.get_by_topic + "/" + topicId + "?page=" + 1 + "&size=" + 100000, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getByConferenceDate(conferenceId, userId, date, keyword, callback) {
        client.requestApi("get", constants.api.conference_session.get_by_conference_date + "/" + conferenceId + "?userId=" + userId + "&date=" + date + "&name=" + keyword, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getByConferenceUser(conferenceId, userId, callback) {
        client.requestApi("get", constants.api.conference_session.get_by_conference_user + "?conferenceId=" + conferenceId + "&userId=" + userId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    follow(userId, sessionId, isFollow, callback) {
        client.requestApi("post", constants.api.conference_session.follow, {
            userId,
            conferenceSessionId: sessionId,
            follow: isFollow ? 1 : 0
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}