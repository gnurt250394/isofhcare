import firebase from 'react-native-firebase';
import { AppState, Linking } from 'react-native'
import RNCallKeepManager from '@components/RNCallKeepManager'
import LaunchApplication from 'react-native-launch-application';
import constants from '@resources/strings'
import StringUtils from 'mainam-react-native-string-utils'
import NavigationService from '@navigators/NavigationService';
export default async (message) => {
    if (message && message.data && message.data.type == "CALL_EVENT") {
        console.log('message.data.type: ', message.data.type);
        constants.route = 'home'
        let data = JSON.parse(message.data.data)
        // const fbNotification = new firebase.notifications.Notification()
        //     .setNotificationId(StringUtils.guid())
        //     .setBody("Bạn có đang có 1 cuộc gọi")
        //     .setTitle('')
        //     .android.setChannelId("isofhcare-master")
        //     .android.setSmallIcon("ic_launcher")
        //     .android.setPriority(2)
        //     .setSound("default")
        //     .setData({});
        // firebase.notifications().displayNotification(fbNotification)

        try {
            if (AppState.currentState != 'active') {
                console.log('AppState.currentState: ', AppState.currentState);
                console.log('display callkeep from background')
                RNCallKeepManager.displayIncommingCall(data.callId)
                // LaunchApplication.open(constants.package_name)
                console.log('LaunchApplication: ', LaunchApplication);
            }
        } catch (error) {
            console.log('error: ', error);

        }

    }
    // handle your message


    return Promise.resolve();
}