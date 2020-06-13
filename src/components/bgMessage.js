import firebase from 'react-native-firebase';
import { AppState, Linking, NativeModules } from 'react-native'
import RNCallKeepManager from '@components/RNCallKeepManager'
const LaunchApplication = NativeModules.LaunchApplication;
import constants from '@resources/strings'
import RNCallKeep from 'react-native-callkeep'
import StringUtils from 'mainam-react-native-string-utils'
import NavigationService from '@navigators/NavigationService';
export default async (message) => {
    console.log('message: ', message);
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
                RNCallKeepManager.setupCallKeep()
                RNCallKeepManager.displayIncommingCall(data.callId)
                LaunchApplication.open(constants.package_name)
            }
        } catch (error) {


        }

    }
    // handle your message


    return Promise.resolve();
}