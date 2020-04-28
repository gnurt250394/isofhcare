import firebase from 'react-native-firebase';
import { AppState, Linking } from 'react-native'
import RNCallKeepManager from '@components/RNCallKeepManager'
import LaunchApplication from 'react-native-launch-application';
import constants from '@resources/strings'
import StringUtils from 'mainam-react-native-string-utils'
import RNCallKeep from 'react-native-callkeep'
import NavigationService from '@navigators/NavigationService';
export default async (message) => {
    if (message && message.data && message.data.type == "CALL_EVENT") {
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
                RNCallKeepManager.displayIncommingCall(data.callId)
                RNCallKeepManager.isAnswerSuccess = true
                RNCallKeepManager.setIsAppForeGround(false)
                LaunchApplication.open(constants.package_name)

            }
        } catch (error) {
        }

    }


    return Promise.resolve();
}