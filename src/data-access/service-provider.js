import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getAll(hospitalId, specialistId, serviceTypeId, requestApi) {
        return new Promise((resolve, reject) => {
            // if (!requestApi) {
            //     datacacheProvider.readPromise(hospitalId, constants.key.storage.DATA_SERVICE_TYPE).then(s => {
            //         this.getAll(hospitalId, true);
            //         resolve(s);
            //     }).catch(e => {
            //         this.getAll(hospitalId, true).then(s => {
            //             resolve(s);
            //         }).catch(e => {
            //             reject(e);
            //         })
            //     });
            // }
            // else {
            client.requestApi("get", `${constants.api.service.get_all}/${hospitalId}?specialistId=${specialistId}&serviceTypeId=${serviceTypeId}&page=1&size=1000`, {}, (s, e) => {
                // if (s && s.code == 0 && s.data && s.data.services) {
                // datacacheProvider.save(hospitalId, constants.key.storage.DATA_SERVICE_TYPE, s.data.services);
                if (s)
                    resolve(s);
                // }
                reject(e);
            });
            // }
        });
    }
}