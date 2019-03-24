import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';


module.exports = {
    search(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.notification.search}?page=${page}&size=${size}`, {}, (s, e) => {
                try {
                    if (s)
                        resolve(s);
                    else
                        reject(e);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },
    getDetail(notificationId) {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.notification.get_detail}/${notificationId}`, {}, (s, e) => {
                try {
                    if (s)
                        resolve(s);
                    else
                        reject(e);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },
    setRead(notificationId) {
        return new Promise((resolve, reject) => {
            client.requestApi("put", `${constants.api.notification.set_read}/${notificationId}`, {}, (s, e) => {
                try {
                    if (s)
                        resolve(s);
                    else
                        reject(e);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },
    deleteAll() {
        return new Promise((resolve, reject) => {
            client.requestApi("delete", `${constants.api.notification.delete}`, {}, (s, e) => {
                try {
                    if (s)
                        resolve(s);
                    else
                        reject(e);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },
    getUnReadCount() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.notification.get_unread_notification_count, {}, (s, e) => {
                if (s)
                    resolve(s);
                reject(e);
            });
        });
    },
    getUnReadCountAndSendDispath(props, firebase) {
        this.getUnReadCount((s, e) => {
            try {
                if (s) {
                    switch (s.code) {
                        case 0:
                            var data = s.data;
                            if (data && data.count) {
                                try {
                                    firebase.notifications().setBadge(data.count);
                                    var count = parseInt(data.count);
                                    props.dispatch({ type: constants.action.action_change_notification_count, value: count })
                                    return;
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                            props.dispatch({ type: constants.action.action_change_notification_count, value: 0 })
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
}