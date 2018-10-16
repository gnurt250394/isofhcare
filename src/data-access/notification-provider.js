import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';


module.exports = {
    getByUser(userId, page, size, callback) {
        client.requestApi("get", constants.api.notification.get_by_user + "/" + userId + "?page=" + page + "&size=" + size, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
                if (callback)
                    callback(undefined, error);
            }
        });

    },
    getDetail(notificationId, callback) {
        client.requestApi("get", constants.api.notification.get_detail + "/" + notificationId, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
                if (callback)
                    callback(undefined, error);
            }
        });
    },
    getDetailBroadcast(notificationId, callback) {
        client.requestApi("get", constants.api.notification.get_detail_broadcast + "/" + notificationId, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
                if (callback)
                    callback(undefined, error);
            }
        });
    },
    setRead(notificationId, callback) {
        client.requestApi("put", constants.api.notification.set_read + "/" + notificationId, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
                if (callback)
                    callback(undefined, error);
            }
        });
    },
    getUnReadCount(callback) {
        client.requestApi("get", constants.api.notification.get_unread_notification_count, {}, (s, e) => {
            try {
                if (callback)
                    callback(s, e);
            } catch (error) {
                if (callback)
                    callback(undefined, error);
            }
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