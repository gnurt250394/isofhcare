import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    create(departmentId, tags, title, content, images, isPrivate, callback) {
        client.requestApi("post", constants.api.question.create, {
            specialistId,
            tags,
            post: {
                title,
                content,
                images,
                isPrivate
            }
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    like(isLiked, postId, callback) {
        client.requestApi("put", constants.api.question.like + "/" + postId, {
            isLiked
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    search(authorId, page, size, isAnswered) {
        return new Promise((resolve, reject) => {
            let _authorId = authorId ? authorId : -1;
            client.requestApi("get", constants.api.question.search + "?page=" + page + "&size=" + size + "&authorId=" + _authorId + "&isAnswered=" + (isAnswered ? 1 : 0), {}, (s, e) => {
                if (s)
                    resolve(s);
                if (e)
                    reject(e);
            });
        });
    }
}