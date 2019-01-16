import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
module.exports = {
    create(postId, content, images, callback) {
        client.requestApi("post", constants.api.comment.create, {
            postId,
            comment: {
                content,
                images
            }
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}