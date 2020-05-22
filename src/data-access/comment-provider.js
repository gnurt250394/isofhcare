import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

// const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    create(postId, content, diagnose, images) {
        return new Promise((resolve, reject) => {
            client.requestApi("post", constants.api.comment.create, {
                postId,
                diagnose,
                comment: {
                    content,
                    images
                }
            }, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        })
    },
    search(postId, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.comment.search + "?page=" + page + "&size=" + size + "&postId=" + postId, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(s);
            });
        })
    }
}