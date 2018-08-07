import { NetInfo } from 'react-native';


module.exports = {
    checkConnect(callback) {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (callback)
                callback(isConnected);
        });
    },
    addEventListener(listener) {
        if (listener)
            NetInfo.isConnected.addEventListener(
                'connectionChange',
                listener
            )
    }
}