import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import StringUtils from 'mainam-react-native-string-utils';
import userProvider from '@data-access/user-provider';
import notificationProvider from '@data-access/notification-provider';
import questionProvider from '@data-access/question-provider';
import snackbar from '@utils/snackbar-utils';
// import bookingProvider from '@data-access/booking-provider';

import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import DialogBox from 'mainam-react-native-dialog-box';
import constants from '@resources/strings';
import redux from '@redux-store'
class PushController extends Component {
    setBroadcastListener(listener) {
        this.listener = listener;
    }
    showNotification(notificationId) {
        // notificationProvider.getDetail(notificationId, function (s, e) {
        //     if (s) {
        //         if (s.code == 0 && s.data && s.data.notification && s.data.notification.type) {
        //             if (s.data.notification.type == 12) {
        //                 if (props && props.dispatch) {
        //                     props.dispatch({ type: constants.action.action_select_ehealth_tab, value: true });
        //                     props.dispatch({ type: constants.action.action_trigger_load_list_booking, value: true });
        //                 }
        //             }
        //             switch (s.data.notification.type) {
        //                 case 10:
        //                 case 12:
        //                     const notification = new firebase.notifications.Notification()
        //                         .setNotificationId(StringUtils.guid())
        //                         .setBody(s.data.notification.content)
        //                         .setTitle(s.data.notification.title)
        //                         .android.setChannelId("isofh-care-channel")
        //                         .android.setSmallIcon("ic_launcher")
        //                         .setSound("default")
        //                         .setData({
        //                             uid: notificationId
        //                         });
        //                     firebase.notifications().displayNotification(notification)
        //             }
        //         }
        //     }
        // });
    }
    showBroadcast(notificationId) {
        notificationProvider.getDetailBroadcast(notificationId, function (s, e) {
            if (s && s.code == 0 && s.data && s.data.advertise) {
                var body = (s.data.advertise.type == 3) ? constants.msg.notification.new_notification : s.data.advertise.message;
                const notification = new firebase.notifications.Notification()
                    .setNotificationId(StringUtils.guid())
                    .setBody(body)
                    .setTitle(s.data.advertise.title)
                    .android.setChannelId("isofh-care-channel")
                    .android.setSmallIcon("ic_launcher")
                    .setSound("default")
                    .setData({
                        uid: notificationId,
                        type: s.data.advertise.type
                    });
                firebase.notifications().displayNotification(notification)
            }
        });
    }
    showDetailBroadcast(notificationId) {
        notificationProvider.getDetailBroadcast(notificationId, this.getDetailBroadcastCallback.bind(this));
    }
    getDetailBroadcastCallback(s, e) {
        if (s && s.code == 0 && s.data && s.data.advertise && this.listener) {
            this.listener(s.data.advertise);
        }
    }
    showDetailNotification(notificationId) {
        // notificationProvider.getDetail(notificationId, function (s, e) {
        //     if (s && s.code == 0 && s.data && s.data.notification && s.data.notification.type) {
        //         switch (s.data.notification.type) {
        //             case 10:
        //                 bookingProvider.getDetail(s.data.notification.detailId, function (s, e) {
        //                     {

        //                         try {
        //                             if (e) {
        //                                 snackbar.show(constants.msg.booking.canot_view_detail_this_booking);
        //                             } else {
        //                                 var data = JSON.parse(s.data.dataHis);
        //                                 data.Profile.PatientHistoryId = s.data.dataBook.hisPatientHistoryId;

        //                                 if (s && s.code == 0) {
        //                                     let booking = {
        //                                         profile: data.Profile,
        //                                         hasCheckin: true,
        //                                         data: data
        //                                     }
        //                                     this.props.dispatch({ type: constants.action.action_view_booking_detail, value: booking });
        //                                     Actions.detailBooking();
        //                                 }
        //                             }
        //                         } catch (error) {
        //                             snackbar.show(constants.msg.booking.canot_view_detail_this_booking);
        //                         }
        //                     }
        //                 });
        //         }
        //     }
        // });
    }
    componentDidMount() {
        // Build a channel
        const channel = new firebase.notifications.Android.Channel('isofh-care-channel', 'isofh-care-channel', firebase.notifications.Android.Importance.Max).setDescription('Nhât Minh Notification channel');

        // Create the channel
        firebase.notifications().android.createChannel(channel);
        showNotification = this.showNotification;
        showBroadcast = this.showBroadcast;
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (!enabled) {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            // User has authorised  
                        })
                        .catch(error => {
                            // User has rejected permissions  
                        });
                }
            });

        firebase.messaging().getToken()
            .then((token) => {
                console.log('Device FCM Token: ', token);
                userProvider.deviceId = DeviceInfo.getUniqueID();
                userProvider.deviceToken = token;
                firebase.messaging().subscribeToTopic("isofhcare_test");
            });

        this.notificationListener = firebase.notifications().onNotification(this.onNotification.bind(this));
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened(this.onNotificationOpened.bind(this));
        firebase.notifications().getInitialNotification().then(this.getInitialNotification.bind(this));
    }
    onNotification(notification) {
        if (!this.props.userApp.isLogin)
            return;
        console.log(notification);
        if (!notification || notification.show_in_foreground)
            return;
        if (notification.data && notification.data.id) {
            let body = "";
            let title = "";
            if (Platform.OS == 'ios') {
                body = notification.title;
                title = "iSofhCare";
            } else {
                title = notification.title;
                body = "";
            }
            const fbNotification = new firebase.notifications.Notification()
                .setNotificationId(StringUtils.guid())
                .setBody(body)
                .setTitle(title)
                .android.setChannelId("isofh-care-channel")
                .android.setSmallIcon("ic_launcher")
                .android.setPriority(2)
                .setSound("default")
                .setData(notification.data);
            firebase.notifications().displayNotification(fbNotification)
            console.log(fbNotification, 'fbNotification')
        }
        if (this.props.userApp.isLogin) {
            firebase.notifications().setBadge(this.props.userApp.unReadNotificationCount + 1);
            this.props.dispatch(redux.getUnreadNotificationCount());
        }
        else {
            firebase.notifications().setBadge(0);
        }

    }
    onNotificationOpened(notificationOpen) {
        try {
            firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
            if (notificationOpen && notificationOpen.notification && notificationOpen.notification.data) {
                var id = notificationOpen.notification.data.id;
                const type = Number(notificationOpen.notification.data.type)
                switch (type) {
                    case 2:
                        this.openQuestion(id);
                        break;
                    case 4:
                        this.openBooking(id);
                        break;

                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    openBooking(id) {
        this.props.navigation.navigate("detailsHistory", {
            id
        });
    }
    openQuestion(id) {
        if (!this.props.userApp.isLogin)
            return;
        questionProvider.detail(id).then(s => {
            if (s && s.data) {
                this.props.navigation.navigate("detailQuestion", { post: s.data })
            }
            else {
                snackbar.show("Lỗi, bài viết không tồn tại", "danger");
            }
        }).catch(e => {
            snackbar.show("Lỗi, vui lòng thử lại", "danger");
        });
    }
    getInitialNotification(notificationOpen) {
        if (notificationOpen) {
            console.log(notificationOpen)
            try {
                firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
                const id = notificationOpen.notification.data.id;
                const type = Number(notificationOpen.notification.data.type)
                switch (type) {
                    case 2:
                        this.openQuestion(id);
                        break;
                    case 4:
                        this.openBooking(id);
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    componentWillUnmount() {
        try {
            this.notificationDisplayedListener();
            this.notificationListener();
            this.notificationOpenedListener();
        } catch (error) {

        }
    }

    render() {
        return <View>
        </View>;
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(PushController);