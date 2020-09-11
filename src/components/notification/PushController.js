import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import StringUtils from 'mainam-react-native-string-utils';
import userProvider from '@data-access/user-provider';
import notificationProvider from '@data-access/notification-provider';
import questionProvider from '@data-access/question-provider';
import snackbar from '@utils/snackbar-utils';
// import bookingProvider from '@data-access/booking-provider';

import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import {Notification, NotificationOpen} from 'react-native-firebase';
import constants from '@resources/strings';
import redux from '@redux-store';
import NavigationService from '@navigators/NavigationService';
import ticketProvider from '@data-access/ticket-provider';
import bookingProvider from '@data-access/booking-provider';
import hospitalProvider from '@data-access/hospital-provider';

class PushController extends Component {
  setBroadcastListener(listener) {
    this.listener = listener;
  }
  showBroadcast(notificationId) {
    notificationProvider.getDetailBroadcast(notificationId, function(s, e) {
      if (s && s.code == 0 && s.data && s.data.advertise) {
        var body =
          s.data.advertise.type == 3
            ? constants.msg.notification.new_notification
            : s.data.advertise.message;
        const notification = new firebase.notifications.Notification()
          .setNotificationId(StringUtils.guid())
          .setBody(body)
          .setTitle(s.data.advertise.title)
          .android.setChannelId('isofh-care-channel')
          .android.setSmallIcon('ic_launcher')
          .setSound('default')
          .setData({
            uid: notificationId,
            type: s.data.advertise.type,
          });
        firebase.notifications().displayNotification(notification);
      }
    });
  }
  showDetailBroadcast(notificationId) {
    notificationProvider.getDetailBroadcast(
      notificationId,
      this.getDetailBroadcastCallback.bind(this),
    );
  }
  getDetailBroadcastCallback(s, e) {
    if (s && s.code == 0 && s.data && s.data.advertise && this.listener) {
      this.listener(s.data.advertise);
    }
  }
  componentDidMount() {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
      'isofh-care-channel',
      'isofh-care-channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('Nhât Minh Notification channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);
    showBroadcast = this.showBroadcast;
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (!enabled) {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              // User has authorised
            })
            .catch(error => {
              // User has rejected permissions
            });
        }
      });

    firebase
      .messaging()
      .getToken()
      .then(token => {
        console.log('Device FCM Token: ', token);
        userProvider.deviceId = DeviceInfo.getUniqueID();
        userProvider.deviceToken = token;
        firebase.messaging().subscribeToTopic('isofhcare_test');
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification(this.onNotification.bind(this));
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(this.onNotificationOpened.bind(this));
    this.notificationInitialListener = firebase
      .notifications()
      .getInitialNotification()
      .then(this.getInitialNotification.bind(this));
  }
  onNotification(notification) {
    console.log('notification: ', notification);
    if (!this.props.userApp.isLogin) return;
    if (!notification || notification.show_in_foreground) return;
    if (
      (notification.data && notification.data.id) ||
      (notification.data && notification.data.notificationId)
    ) {
      const type = notification.data.type;
      console.log('type: ', type);
      if (type == 5) {
        this.openTicket(notification.data.id);
      }
      let title = notification.title;
      let data = notification.data;

      let body = notification?.body || '';
      let fbNotification = null;
      if (type == -1) {
        fbNotification = new firebase.notifications.Notification()
          .setNotificationId(StringUtils.guid())
          .setBody('Đã đến giờ uống thuốc')
          .setTitle('iSofHcare')
          .android.setChannelId('isofh-care-channel')
          .android.setSmallIcon('ic_launcher')
          .android.setPriority(2)
          .setSound('default')
          .setData(data);
      } else {
        fbNotification = new firebase.notifications.Notification()
          .setNotificationId(StringUtils.guid())
          .setBody(body)
          .setTitle(title)
          .android.setChannelId('isofh-care-channel')
          .android.setSmallIcon('ic_launcher')
          .android.setPriority(2)
          .setSound('default')
          .setData(data);
      }
      firebase.notifications().displayNotification(fbNotification);
      console.log(fbNotification, 'fbNotification');
    }
    if (this.props.userApp.isLogin) {
      firebase
        .notifications()
        .setBadge(this.props.userApp.unReadNotificationCount + 1);
      this.props.dispatch(redux.getUnreadNotificationCount());
    } else {
      firebase.notifications().setBadge(0);
    }
  }
  onNotificationOpened(notificationOpen) {
    console.log('notificationOpen: ', notificationOpen);
    try {
      firebase
        .notifications()
        .removeDeliveredNotification(
          notificationOpen.notification.notificationId,
        );
      if (
        notificationOpen &&
        notificationOpen.notification &&
        notificationOpen.notification.data
      ) {
        var id = notificationOpen?.notification?.data?.id;
        let question = {};
        if (notificationOpen?.notification?.data?.data) {
          question = JSON.parse(notificationOpen?.notification?.data?.data);
        }
        const type = notificationOpen.notification.data.type;

        switch (type) {
          // case "1":
          //     this.openQuestion(id);
          //     break;
          // case "2":
          //     this.openQuestion(id);
          //     break;
          case '4':
            this.openBooking(id);
            break;
          case '5':
            this.openTicket(id);
            break;
          case '6':
            this.openDetailsEhealth(notificationOpen.notification.data);
            break;
          case '7':
            this.openListProfile();
            break;
          case '10':
          case '12':
          case '13':
            this.openBooking(id);
            break;
          case '16':
          case '15':
            this.openQuestion(question?.question || question);
            break;
          case '-1':
            break;
          case 'NEWS': {
            NavigationService.navigate('detailNewsHighlight', {item: {id}});
            break;
          }
          case 'MEDICAL_SERVICE': {
            NavigationService.navigate('listOfServices', {item: {id}});
            break;
          }
          case 'HOSPITAL': {
            NavigationService.navigate('profileHospital', {item: {id}});
            break;
          }
          case 'DOCTOR': {
            NavigationService.navigate('detailsDoctor', {item: {id}});
            break;
          }
          case 'fanpage': {
            Linking.canOpenURL('fb://profile/1986302411660628')
              .then(supported => {
                console.log('supported: ', supported);
                if (supported) {
                  return Linking.openURL('fb://profile/1986302411660628');
                } else {
                  return Linking.openURL('https://www.facebook.com/');
                }
              })
              .catch(err => {
                console.log('err: ', err);
              });
            break;
          }
          default:
            if (type) {
              NavigationService.navigate(type, {item: {id}});
            }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  openListProfile = () => {
    NavigationService.navigate('listProfileUser');
  };
  openDetailsEhealth(data) {
    if (!this.props.userApp.isLogin) return;
    this.setState({isLoading: true}, () => {
      bookingProvider
        .detailPatientHistory(
          data.patientHistoryId,
          data.hospitalId,
          data.id,
          data.shareId,
        )
        .then(s => {
          switch (s.code) {
            case 0:
              notificationProvider
                .openEhealth(
                  data.patientHistoryId,
                  data.hospitalId,
                  data.id,
                  data.shareId,
                )
                .then(s => {
                  this.setState({isLoading: false}, () => {
                    let {hasResult, result, resultDetail, hospital, data} = s;
                    if (hasResult && data) {
                      if (hospital && result) {
                        this.props.dispatch({
                          type:
                            constants.action
                              .action_select_patient_group_ehealth,
                          value: data,
                        });
                        this.props.dispatch({
                          type: constants.action.action_select_hospital_ehealth,
                          value: hospital,
                        });
                        NavigationService.navigate('viewDetailEhealth', {
                          result,
                          resultDetail,
                        });
                      }
                    } else {
                      snackbar.show('Hồ sơ này chưa có kết quả', 'danger');
                    }
                  });
                })
                .catch(e => {
                  this.setState(
                    {
                      isLoading: false,
                    },
                    () => {
                      console.log(e);
                      snackbar.show(
                        'Có lỗi xảy ra, xin vui lòng thử lại',
                        'danger',
                      );
                    },
                  );
                });
              break;
            case 9:
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  snackbar.show('Y bạ chưa xác định', 'danger');
                },
              );
            case 7:
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  snackbar.show(
                    'Hồ sơ chia sẻ đến bạn đã hết thời gian',
                    'danger',
                  );
                },
              );
          }
        })
        .catch(e => {
          this.setState(
            {
              isLoading: false,
            },
            () => {
              console.log(e);
              snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger');
            },
          );
        });
    });
  }
  openTicket(id) {
    if (!this.props.userApp.isLogin) return;
    ticketProvider.detail(id).then(s => {
      switch (s.code) {
        case 0:
          if (s.data && s.data.numberHospital) {
            NavigationService.navigate('getTicketFinish', s.data);
          }
      }
    });
  }
  openBooking(id) {
    NavigationService.navigate('detailsHistory', {
      id,
    });
  }
  openQuestion = item => {
    if (!this.props.userApp.isLogin || !item) return;
    NavigationService.navigate('detailMessage', {item});
  };
  getInitialNotification(notificationOpen) {
    console.log('notificationOpen: ', notificationOpen);
    if (notificationOpen) {
      try {
        firebase
          .notifications()
          .removeDeliveredNotification(
            notificationOpen.notification.notificationId,
          );
        const id = notificationOpen?.notification?.data?.id;
        let question = {};
        if (notificationOpen?.notification?.data?.data) {
          question = JSON.parse(notificationOpen?.notification?.data?.data);
        }
        console.log('id: ', id);
        const type = notificationOpen.notification.data.type;
        console.log('type: ', type);

        switch (type) {
          // case '2':
          //     this.openQuestion(id);
          //     break;
          // case '4':
          //     this.openBooking(id);
          //     break;
          case '5':
            setTimeout(() => {
              this.openTicket(id);
            }, 4000);
            break;
          case '6':
            this.openDetailsEhealth(notificationOpen.notification.data);
            break;
          case '7':
            this.openListProfile();
            break;
          case '10':
          case '12':
          case '13':
            this.openBooking(id);
            break;
          case '15':
          case '16':
            this.openQuestion(question?.question || question);
            break;
          case 'NEWS': {
            NavigationService.navigate('detailNewsHighlight', {item: {id}});
            break;
          }
          case 'MEDICAL_SERVICE': {
            NavigationService.navigate('listOfServices', {item: {id}});
            break;
          }
          case 'HOSPITAL': {
            NavigationService.navigate('profileHospital', {item: {id}});
            break;
          }
          case 'DOCTOR': {
            NavigationService.navigate('detailsDoctor', {item: {id}});
            break;
          }
          case 'fanpage': {
            Linking.canOpenURL('fb://page/1986302411660628')
              .then(supported => {
                console.log('supported: ', supported);
                if (supported) {
                  return Linking.openURL('fb://page/1986302411660628');
                } else {
                  return Linking.openURL('https://www.facebook.com/');
                }
              })
              .catch(err => {
                console.log('err: ', err);
              });
            break;
          }
          default:
            if (type) {
              NavigationService.navigate(type, {item: {id}});
            }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  componentWillUnmount() {
    try {
      this.notificationInitialListener();
      this.notificationListener();
      this.notificationOpenedListener();
    } catch (error) {}
  }

  render() {
    return <View />;
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    navigation: state.navigation,
  };
}
export default connect(
  mapStateToProps,
  null,
  null,
  {forwardRef: true},
)(PushController);
