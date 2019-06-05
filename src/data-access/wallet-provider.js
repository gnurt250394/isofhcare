import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    createOnlinePayment(userId, payment_method_type, vendor_id, order_ref_id, return_url, amount, memo, secure_hash, order_ref, payment_method_ui,bill_valid_time ) {
        return new Promise((resolve, reject) => {
            let url = constants.api.wallet.createOnlinePayment;
            url = url.replace("{id}", userId);
            client.requestApiWithHeader("post", url, {
                payment_method_type,
                vendor_id,
                order_ref_id,
                return_url,
                amount,
                memo,
                secure_hash,
                order_ref,
                payment_method_ui,
                bill_valid_time
            }, { Authorization: "Bearer " + client.auth }, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    onlineTransactionPaid(transactionId, payment_method_type, transaction_data) {
        return new Promise((resolve, reject) => {
            let url = constants.api.wallet.onlineTransactionPaid;
            url = url.replace("{transactionId}", transactionId);
            client.requestApiWithHeader("post", url, {
                payment_method_type,
                transaction_data
            }, { Authorization: "Bearer " + client.auth }, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
}