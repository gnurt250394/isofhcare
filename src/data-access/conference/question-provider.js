import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getTemplate(conferenceId, callback) {
        client.requestApi("get", constants.api.conference_question.search + "?conferenceId=" + conferenceId + "&template=1&page=" + 1 + "&size=" + 1000, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getListQuestion(conferenceId, topicId, sessionId, page, size, callback) {
        client.requestApi("get", constants.api.conference_question.search + "?conferenceId=" + conferenceId + "&topicId=" + topicId + "&sessionId=" + sessionId + "&page=" + page + "&size=" + size, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    create(content, conferenceId, topicId, sessionId, callback) {
        let body = {
            conferenceQuestion: {
                content
            }
        };
        if (conferenceId)
            body.conferenceId = conferenceId;
        if (topicId)
            body.conferenceTopicId = topicId;
        if (sessionId)
            body.conferenceSessionId = sessionId;
        client.requestApi("post", constants.api.conference_question.create, body, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}