import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    getAll() {
        return new Promise((resolve, reject) => {
            client.requestApi("post", `${constants.api.hospital.get_all}?type=-1`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    }
}