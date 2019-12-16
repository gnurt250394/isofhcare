import client from "@utils/client-utils";
import constants from "@resources/strings";

module.exports = {
    getListVoucher() {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.voucher.get_voucher}/availables`, {}, (s, e) => {
                if (s) resolve(s)
                else reject(e)
            })
        })
    },
    fillInVoucher(voucher) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.voucher.get_voucher}/${voucher}`,
                {}, (s, e) => {
                    if (s)
                        resolve(s);
                    else
                        reject(e);

                });
        })
    },
    selectVoucher(idVoucher,idBooking) {
        return new Promise((resolve, reject) => {
            client.requestApi("put", `${constants.api.voucher.get_voucher}/redeem/${idVoucher}/${idBooking}`,
                {}, (s, e) => {
                    if (s)
                        resolve(s);
                    else
                        reject(e);

                });
        });
    },
}