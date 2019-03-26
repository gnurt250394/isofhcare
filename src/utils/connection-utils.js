import { NetInfo } from 'react-native';


module.exports = {
    isConnected(time) {
        return new Promise((resolve, reject) => {
            NetInfo.isConnected.fetch().then(connect => {
                if (connect)
                    resolve(true);
                else {
                    setTimeout(() => {
                        NetInfo.isConnected.fetch().then(connect => {
                            if (connect)
                                resolve(true);
                            else
                                reject(false);
                        }).catch(e => reject(false));
                    }, 500);
                }
            }).catch(e => { alert(JSON.stringify(e)); reject(false) });
        })
    },
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