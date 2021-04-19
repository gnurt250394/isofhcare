import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "@resources/strings";
module.exports = {
    getListReminder(date) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', constants.api.reminder.reminderApi + `?date=${date}`, {}, (s, e) => {
                
                if (s) {

                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    createReminder(data) {
        return new Promise((resolve, reject) => {
            client.requestApi('post', constants.api.reminder.reminderApi, data, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    useReminder(id, body) {
        return new Promise((resolve, reject) => {
            client.requestApi('put', `${constants.api.reminder.reminderApi}/${id}/used`, body, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    reasonReminder( body) {
        return new Promise((resolve, reject) => {
            client.requestApi('post', `${constants.api.reminder.reminderApi}/forgot`, body, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    deleteReminder(id) {
        return new Promise((resolve, reject) => {
            client.requestApi('delete', `${constants.api.reminder.reminderApi}/${id}`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    getStatic (id,from,to){
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.reminder.reminderApi}/statistics?fromDate=${from}&toDate=${to}&userId=${id}`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    getForgot(date) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.reminder.reminderApi}/forgot?date=${date}`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    }
}