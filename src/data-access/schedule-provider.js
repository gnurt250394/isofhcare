import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getByDateAndService(serviceId, dateValue) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.schedule.get_by_date_and_service}?serviceId=${serviceId}&dateValue=${dateValue}`, {}, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    }, 
    getByMonthAndService(serviceId, dateValue) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.schedule.get_by_month_and_service}?serviceId=${serviceId}&monthValue=${dateValue}`, {}, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    search(serviceId, dateValue, dateValue2, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.schedule.search}?serviceId=${serviceId}&startDate=${dateValue}&endDate=${dateValue2}&page=${page}&size=${size}`, {}, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    }
}