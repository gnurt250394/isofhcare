import uuid from 'uuid'
import RNCallKeep from 'react-native-callkeep';
import LaunchApplication from 'react-native-launch-application';
import { PermissionsAndroid } from 'react-native'
import constants from '@resources/strings'
import NavigationServices from '@navigators/NavigationService';
export function openVideoCallScreen(callId) {
    NavigationServices.navigate('videoCall', { callId })
}
class RNCallKeepManager {
    constructor() {
        this.UUID = ''
        this.callId = {}
        this.isAnswerSuccess = false
        this.isAppForeground = false
        this.isCallee = false
        this.setupCallKeep()
    }
    setIsAppForeGround = value => {
        this.isAppForeground = value
    }
    onRNCallKitDidReceiveStartCallAction(callId) {
        this.callId = callId
        openVideoCallScreen(callId)

    }
    setAnswerCall = () => {
        RNCallKeep.answerIncomingCall(this.UUID)
        RNCallKeep.setCurrentCallActive(this.UUID)
        RNCallKeep.backToForeground()
    }
    prepareOpenVideoCall = () => {
        if (!this.isAppForeground) {
            LaunchApplication.open(constants.package_name)
            setTimeout(() => {
                openVideoCallScreen(this.callId)
            }, 1000)
        } else {
            openVideoCallScreen(this.callId)
        }
        this.isAppForeground = false
        if (!this.isAnswer) {
            this.setAnswerCall()
            this.isAnswer = true
        }
    }

    setupCallKeep = () => {
        new Promise((resolve, reject) => {
            const options = {
                ios: {
                    appName: 'ISOFHCARE',
                },
                android: {
                    alertTitle: 'Permissions required',
                    alertDescription: 'Cho phép iSofhCare truy cập danh bạ điện thoại của bạn',
                    cancelButton: 'Huỷ',
                    okButton: 'Đồng ý',
                    imageName: 'ic_launcher',
                    // additionalPermissions: [PermissionsAndroid.PERMISSIONS.example]
                }
            };

            RNCallKeep.setup(options).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
            // RNCallKeep.addEventListener('answerCall', this.answerCallEvent);
            // RNCallKeep.addEventListener('endCall', this.endCallEvent)
        })

    }
    answerCallEvent = () => {
        this.prepareOpenVideoCall()
    }
    endCallEvent = () => {

    }


    updateDisplay = ({ name = "", phone = "" }) => {
        RNCallKeep.updateDisplay(this.UUID, name, phone)
    }
    
    displayIncommingCall = (callId, name = 'Người dùng đang gọi ...') => {
        if (!this.isAnswerSuccess) {
            this.callId = callId
            this.UUID = uuid.v4().toLowerCase();
            RNCallKeep.displayIncomingCall(this.UUID, name, '', 'generic', false)
        }
    }

    endCall = () => {

        if (this.UUID)
            RNCallKeep.endAllCalls()
    }

}

let manager = new RNCallKeepManager()

export default manager