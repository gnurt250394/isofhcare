import uuid from 'uuid'
import RNCallKeep from 'react-native-callkeep';
import LaunchApplication from 'react-native-launch-application';
import { PermissionsAndroid } from 'react-native'
import constants from '@resources/strings'
import NavigationServices from '@navigators/NavigationService';

let UUID = ''
let callId = {}
let isAppForeground = false
let isCall = false
let isSetting = false
const setIsAppForeGround = value => {
    isAppForeground = value
}
const setAnswerCall = () => {
    RNCallKeep.answerIncomingCall(UUID)
    RNCallKeep.setCurrentCallActive(UUID)
    RNCallKeep.backToForeground()
}
// const prepareOpenVideoCall = () => {
//     if (!isAppForeground) {
//         LaunchApplication.open(constants.package_name)
//         setTimeout(() => {
//             openVideoCallScreen(callId)
//         }, 1000)
//     } else {
//         openVideoCallScreen(callId)
//     }
//     isAppForeground = false
//     if (!isAnswer) {
//         setAnswerCall()
//         isAnswer = true
//     }
// }

const setupCallKeep = () => {
    return new Promise((resolve, reject) => {
        const options = {
            ios: {
                appName: 'ISOFHCARE',
            },
            android: {
                alertTitle: 'Thông báo',
                alertDescription: 'Cho phép iSofHcare truy cập cuộc gọi của bạn',
                cancelButton: 'Huỷ',
                okButton: 'Đồng ý',
                imageName: 'ic_launcher',
                // additionalPermissions: [PermissionsAndroid.PERMISSIONS.example]
            }
        };

        if (!isSetting) {
            console.log('isSetting: ', isSetting);
            RNCallKeep.setup(options).then(res => {
                isSetting = true
                resolve(res)
            }).catch(err => {
                reject(err)
            })

        }
        // RNCallKeep.addEventListener('answerCall', answerCallEvent);
        // RNCallKeep.addEventListener('endCall', endCallEvent)
    })

}

const updateDisplay = ({ name = "", phone = "" }) => {
    RNCallKeep.updateDisplay(UUID, name, phone)
}

const displayIncommingCall = (callId, name = 'Người dùng đang gọi ...') => {
    if (!UUID) {
        callId = callId
        UUID = uuid.v4().toLowerCase();
        RNCallKeep.displayIncomingCall(UUID, name, '', 'generic', false)
    }
}

const rejectCall = () => {

    console.log('UUID: ', UUID);
    if (UUID) {
        RNCallKeep.rejectCall(UUID)
    }
}
const endCall = () => {

    RNCallKeep.endAllCalls()
    if (UUID)
        UUID = ''
}


export default {
    setIsAppForeGround,
    setupCallKeep,
    updateDisplay,
    displayIncommingCall,
    rejectCall,
    endCall,
    setAnswerCall,
    callId,
    isCall,
    isAppForeground,
    UUID
}