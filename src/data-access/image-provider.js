
import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    upload(uri,type, callback) {
        if (!callback) {
            return new Promise((resolve, reject) => {
                client.uploadFile(constants.api.upload.image, uri, (s, e) => {
                    if (s)
                        resolve({ data: s, uri, success: true });
                    resolve({ uri, success: false });
                });
            });
        }
        else
            client.uploadFile(constants.api.upload.image, uri,type, (s, e) => {
                if (callback) {
                    if (s) {
                        callback({ data: s, uri, success: true }, e);
                    }
                    else
                        callback({ uri, success: false }, e);
                }
            });
    }
}