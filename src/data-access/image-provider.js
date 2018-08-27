
import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    upload(uri, callback) {
        client.uploadFile(constants.api.upload.image, uri, (s, e) => {
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