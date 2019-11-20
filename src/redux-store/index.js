import constants from '@resources/strings';
import userProvider from '@data-access/user-provider';
import notificationProvider from '@data-access/notification-provider';
import firebase from 'react-native-firebase';
import clientUtils from '@utils/client-utils';

import client from '@utils/client-utils';

import firebaseUtils from '@utils/firebase-utils';
function _userLogin(user) {
    return (dispatch) => {
        dispatch({ type: constants.action.action_user_login, value: user })
        return Promise.resolve();
    }
}
function _getOtpPhone(otp) {
    return (dispatch) => {
        dispatch({ type: constants.action.action_otp_phone, value: otp })
        return Promise.resolve();
    }
}
function _getUnreadNotificationCount() {
    return function (dispatch) {
        notificationProvider.getUnReadCount().then(s => {
            switch (s.code) {
                case 0:
                    var data = s.data;
                    if (data && data.total) {
                        try {
                            firebase.notifications().setBadge(data.total);
                            var total = parseInt(data.total);
                            dispatch({ type: constants.action.action_change_notification_count, value: total })
                            return;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    dispatch({ type: constants.action.action_change_notification_count, value: 0 })
                    break;
            }
        }).catch(e => {
            console.log(e);
        });
    }
}
module.exports = {
    userLogin(user) {
        return function (dispatch, getState) {
            if (user != null) {
                userProvider.saveAccount(user);


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
            firebase.notifications().setBadge(0);
            userProvider.saveAccount(undefined);
            dispatch({ type: constants.action.action_user_logout })
        };

    },
    getUnreadNotificationCount() {
        return (dispatch) => {
            dispatch(_getUnreadNotificationCount());
        }
    },
    getOtpPhone(otp) {
        return function (dispatch, getState) {
            if (otp) {
                dispatch(_getOtpPhone(otp))
            }
        }
    },

}