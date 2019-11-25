import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    createDrug(data) {
        return new Promise((resolve, reject) => {
            client.requestApi("post", `${constants.api.drug.create_drug}`, data, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    getLocation(id, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.drug.get_location}?ownerId=${id}&page=${page}&size=${size}&sort=desc&properties=created`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    addLocation(data) {
        return new Promise((resolve, reject) => {
            client.requestApi('post', `${constants.api.drug.add_location}`, data, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    getListMenu(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('post', `${constants.api.drug.get_list_menu_drug}?page=${page}&size=${size}&sort=desc&properties=created`), {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            }
        })
    },
}
