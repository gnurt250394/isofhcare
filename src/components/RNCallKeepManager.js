import uuid from 'uuid'
import RNCallKeep from 'react-native-callkeep';
import LaunchApplication from 'react-native-launch-application';
import { PermissionsAndroid } from 'react-native'
import NavigationServices from '@navigators/NavigationService';
export function openVideoCallScreen(callId) {
    console.log('opening video call screen', { callId })
    NavigationServices.navigate('videoCall', { callId })
}
class RNCallKeepManager {

    constructor() {
        this.UUID = ''
        this.callId = {}
        this.isAppForeground = false
        this.setupCallKeep()
    }

    setIsAppForeGround = value => {
        this.isAppForeground = value
    }
    onRNCallKitDidReceiveStartCallAction(callId) {
        console.log('callId: ', callId);
        this.callId = callId
        // Sự kiện gọi đi..có thể bắt đầu từ việc ấn call recents hoặc siri..
        openVideoCallScreen(callId)

    }
    prepareOpenVideoCall = () => {
        if (!this.isAppForeground) {
            setTimeout(() => {
                openVideoCallScreen(this.callId)
            }, 1000)
        } else {
            openVideoCallScreen(this.callId)
        }
        this.isAppForeground = false
        // setTimeout(() => {
        //     LaunchApplication.open('com.isofh.isofhcaremasterdev')
        // }, 1000)
        console.log('did set isAppForeground to false')
    }

    setupCallKeep = () => {
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

        try {
            RNCallKeep.setup(options);
        } catch (err) {
            console.error('initializeCallKeep error:', err.message);
        }
    }
    
   

    updateDisplay = ({ name, phone }) => {
        console.log('name: ', name);
        RNCallKeep.updateDisplay(this.UUID, name, phone)
    }
    displayIncommingCall = (callId) => {
        this.callId = callId
        this.UUID = uuid.v4();
        // console.log('display incomming call', { UUID: this.UUID })
        RNCallKeep.displayIncomingCall(this.UUID, 'Bác sĩ đang gọi...', "", "generic", true)
    }

    endCall = () => {
        console.log('endCall invoked', { UUID: this.UUID })
        if (this.UUID)
            RNCallKeep.rejectCall(this.UUID)
    }

}

let manager = new RNCallKeepManager()

export default manager