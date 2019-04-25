import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    createOnlinePayment(userId, payment_method_type, vendor_id, order_ref_id, return_url, amount, memo, secure_hash) {
        return new Promise((resolve, reject) => {
            let url = constants.api.wallet.createOnlinePayment;
            url = url.replace("{id}", userId);
            client.requestApi("post", url, {
                payment_method_type,
                vendor_id,
                order_ref_id,
                return_url,
                amount,
                memo,
                secure_hash
            }, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    onlineTransactionPaid(transactionId, payment_method_type, vnp_TmnCode, vnp_TxnRef, vnp_Amount, vnp_OrderInfo, vnp_ResponseCode, vnp_BankCode, vnp_BankTranNo, vnp_PayDate, vnp_TransactionNo, vnp_SecureHash) {
        return new Promise((resolve, reject) => {
            let url = constants.api.wallet.onlineTransactionPaid;
            url = url.replace("{transactionId}", transactionId);
            client.requestApi("post", url, {
                payment_method_type,
                transaction_data: {
                    vnp_Amount,
                    vnp_BankCode,
                    vnp_BankTranNo,
                    vnp_OrderInfo,
                    vnp_PayDate,
                    vnp_ResponseCode,
                    vnp_SecureHash,
                    vnp_TmnCode,
                    vnp_TransactionNo,
                    vnp_TxnRef
                }
            }, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
}