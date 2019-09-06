import client from "@utils/client-utils";
import constants from "@resources/strings";

module.exports = {
    getListVoucher() {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.voucher.get_voucher}`, {}, (s, e) => {
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
    selectVoucher(voucher) {
        return new Promise((resolve, reject) => {
            client.requestApi("post", `${constants.api.voucher.get_voucher}/${voucher}`,
                {}, (s, e) => {
                    if (s)
                        resolve(s);
                    else
                        reject(e);

                });
        });
    },
}