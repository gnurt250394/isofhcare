import client from '@utils/client-utils-drug';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    createDrug(data, idDrug) {
        return new Promise((resolve, reject) => {
            client.requestApi(idDrug ? "put" : "post", `${constants.api.drug.create_drug}${idDrug ? `/${idDrug}` : ''}`, data, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    getLocation(id, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.drug.get_location}/${id}?page=${page}&size=${size}&sort=desc&properties=created`, {}, (s, e) => {
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
    getListMenu(page, size, owner) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.drug.get_list_menu_drug}/${owner}?page=${page}&size=${size}&sort=desc&properties=created`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                }
                else {
                    reject(e)
                }
            })
        })
    },
    setLocationDefault(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('put', `${constants.api.drug.set_adress_default}/${id}/default`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    getDetailsDrug(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.drug.get_details_drug}/${id}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    findDrug(id, addressId) {
        return new Promise((resolve, reject) => {
            client.requestApi('put', `${constants.api.drug.find_drug}/${id}/find-pharmacy/${addressId ? `?addressId=${addressId}` : ''}`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    deleteDrug(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('delete', `${constants.api.drug.delete_drug}/${id}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    searchDrug(text) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.drug.search_drug}?expression=${text}&filters=name&lang=en&page=1&size=10`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    }
}
