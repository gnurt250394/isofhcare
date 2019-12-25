import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
const drugService = 'http://10.0.0.98:8095'
const searchDrugService = 'http://10.0.50.116:60785'
module.exports = {
    createDrug(data, idDrug) {
        console.log('CALL API', data)
        return new Promise((resolve, reject) => {
            client.requestApi(idDrug ? "put" : "post", `${drugService}/${constants.api.drug.create_drug}${idDrug ? `/${idDrug}` : ''}`, data, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    getLocation(id, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${drugService}/${constants.api.drug.get_location}/${id}?page=${page}&size=${size}&sort=desc&properties=isDefault,created`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    addLocation(data) {
        return new Promise((resolve, reject) => {
            client.requestApi('post', `${drugService}/${constants.api.drug.add_location}`, data, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    getListMenu(page, size, owner) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${drugService}/${constants.api.drug.get_list_menu_drug}/${owner}?page=${page}&size=${size}&sort=desc&properties=created`, {}, (s, e) => {
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
            client.requestApi('put', `${drugService}/${constants.api.drug.set_adress_default}/${id}/default`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    getDetailsDrug(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${drugService}/${constants.api.drug.get_details_drug}/${id}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    findDrug(id, addressId) {
        return new Promise((resolve, reject) => {
            client.requestApi('put', `${drugService}/${constants.api.drug.find_drug}/${id}/find-pharmacy/${addressId ? `?addressId=${addressId}` : ''}`, {}, (s, e) => {
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
            client.requestApi('delete', `${drugService}/${constants.api.drug.delete_drug}/${id}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    searchDrug(keyword, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${searchDrugService}/${constants.api.drug.search_by_name}${keyword}&lang=en&page=${page}&size=${size}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    deleteLocation(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('delete', `${drugService}/${constants.api.drug.delete_address}${id}`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    }
}
