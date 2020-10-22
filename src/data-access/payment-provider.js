import client from '@utils/client-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

export default {
    getListCard() {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.requestPayment + constants.api.payment.get_list_card, {}, (s, e) => {
                if (s)
                    resolve(s)
                if (e)
                    reject(e)
            })
        })
    },
    createNewCard() {
        return new Promise((resolve, reject) => {
            client.requestApi('post', client.requestPayment + constants.api.payment.create_new_card, {}, (s, e) => {
                if (s)
                    resolve(s)
                if (e)
                    reject(e)
            })
        })
    },
}