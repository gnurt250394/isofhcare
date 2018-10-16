import client from '@utils/client-utils';

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