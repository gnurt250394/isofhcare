import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import storage from '@data-access/storage-provider';

module.exports = {
    getUserFromToken(token, callback) {
            client.requestFetch("get",'https://graph.facebook.com/v2.5/me?access_token=' + token,null, {}, (response) => {
                if (callback)
                callback(response, undefined);
            }, (response) => {
                if (callback)
                callback(undefined, response);
            });
    }
}