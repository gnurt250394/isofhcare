import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    getGroupPatient() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.ehealth.get_group_patient}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
   
}