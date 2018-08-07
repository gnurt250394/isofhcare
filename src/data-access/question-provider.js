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
    create(userId, conferenceId, subjectId, sessionId, content, callback) {
        client.requestApi("post", constants.api.question.create, {
            subjectId,
            sessionId,
            conferenceId,
            userId,
            content
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getListSubject(conferenceId, callback) {
        client.requestApi("get", constants.api.question.get_list_subject + "/" + conferenceId, {
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getListSession(conferenceId, callback) {
        client.requestApi("get", constants.api.question.get_list_session + "/" + conferenceId, {
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getListTemplate(conferenceId, callback) {
        client.requestApi("get", constants.api.question.get_list_tempplate + "/" + conferenceId, {
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }

}