import uuid from 'uuid'
import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid } from 'react-native'
import NavigationServices from '@navigators/NavigationService';
export function openVideoCallScreen(option) {
    console.log('opening video call screen', { option })
    NavigationServices.navigate('videoCall', option)
}
class RNCallKeepManager {

    constructor() {
        this.UUID = false
        this.option = {}
        this.isAppForeground = false
        this.setupCallKeep()
    }

    setIsAppForeGround = value => {
        this.isAppForeground = value
    }

    prepareOpenVideoCall = () => {
        if (!this.isAppForeground) {
            setTimeout(() => {
                openVideoCallScreen(this.option)
            }, 1000)
        } else {
            openVideoCallScreen(this.option)
        }
        this.isAppForeground = false
        // RNCallKeep.endCall(this.UUID)
        console.log('did set isAppForeground to false')
    }

    setupCallKeep = () => {
        const options = {
            ios: {
                appName: 'My app name',
            },
            android: {
                alertTitle: 'Permissions required',
                alertDescription: 'This application needs to access your phone accounts',
                cancelButton: 'Cancel',
                okButton: 'ok',
                imageName: 'phone_account_icon',
                additionalPermissions: [PermissionsAndroid.PERMISSIONS.example]
            }
        };

        RNCallKeep.setup(options).then(accepted => { });
        RNCallKeep.addEventListener('answerCall', async () => {
            console.log('press answer, call established!', { isAppForeground: this.isAppForeground })
            this.prepareOpenVideoCall()
        });
        RNCallKeep.addEventListener('endCall', () => {
            console.log('call ended')
            this.isAppForeground = false
        })
    }

    updateDisplay = ({ name, phone }) => {
        RNCallKeep.updateDisplay(this.UUID, name, phone)
    }
    displayIncommingCall = (option) => {
        this.option = option
        this.UUID = uuid.v4()
        console.log('display incomming call', { UUID: this.UUID })
        RNCallKeep.displayIncomingCall(this.UUID, 'unknown', 'Hong hac')
    }

    endCall = () => {
        console.log('endCall invoked', { UUID: this.UUID })
        RNCallKeep.endCall(this.UUID)
    }

}

let manager = new RNCallKeepManager()

export default manager