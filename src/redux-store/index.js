import constants from '@resources/strings';
import userProvider from '@data-access/user-provider';
import notificationProvider from '@data-access/notification-provider';
import firebase from 'react-native-firebase';
import sendbirdUtils from '@utils/send-bird-utils';
import clientUtils from '@utils/client-utils';

import client from '@utils/client-utils';

import firebaseUtils from '@utils/firebase-utils';
function _userLogin(user) {
    return (dispatch) => {
        dispatch({ type: constants.action.action_user_login, value: user })
        return Promise.resolve();
    }
}

function _getUnreadNotificationCount() {
    return function (dispatch) {
        notificationProvider.getUnReadCount((s, e) => {
            try {
                if (s) {
                    switch (s.code) {
                        case 0:
                            var data = s.data;
                            if (data && data.count) {
                                try {
                                    firebase.notifications().setBadge(data.count);
                                    var count = parseInt(data.count);
                                    dispatch({ type: constants.action.action_change_notification_count, value: count })
                                    return;
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                            dispatch({ type: constants.action.action_change_notification_count, value: 0 })
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
}
module.exports = {
    userLogin(user) {
        return function (dispatch, getState) {
            if (user != null) {
                userProvider.saveAccount(user);
                firebaseUtils.connect(user.id, user.name, user.avatar, {}).then(x => {
                    console.log(x);
                }).catch(x=>{
                    console.log(x);
                });
                let sb = sendbirdUtils.getSendBird();
                sendbirdUtils.startSendBird(sb, user.email, (sb, userSendBird, error) => {
                    sendbirdUtils.updateUserInfo(sb, userSendBird, (user.degree ? user.degree : "") + " " + user.name, user.avatar ? user.avatar.absoluteUrl() : "")
                });

                dispatch(_userLogin(user)).then(() => {
                    if (user) {
                        dispatch(_getUnreadNotificationCount());
                    }
                    firebase.notifications().setBadge(0);
                });
            }
        }
    },
    userLogout() {
        return (dispatch) => {
            let sb = sendbirdUtils.getSendBird();
            userProvider.saveAccount(undefined);
            sendbirdUtils.stopSendBird(sb, (sb, userSendBird, error) => {
            });
            dispatch({ type: constants.action.action_user_logout })
        };

    },
    getUnreadNotificationCount() {
        return (dispatch) => {
            dispatch(_getUnreadNotificationCount());
        }
    }

}