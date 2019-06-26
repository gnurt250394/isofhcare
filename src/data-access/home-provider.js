
import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    getNews() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.home.get_list_news}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
}