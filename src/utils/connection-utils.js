import { NetInfo } from 'react-native';


module.exports = {
    isConnected(time) {
        return new Promise((resolve, reject) => {
            NetInfo.isConnected.fetch().then(connect => {
                if (connect)
                    resolve(true);
                else {
                    if (time != 1)
                        setTimeout(() => {
                            this.isConnected(1).then(s => {
                                if (s)
                                    resolve(s);
                                else {
                                    reject(false);
                                }
                            }).catch(e => {
                                reject(e);
                            })
                        }, 1000);
                }
            }).catch(e => reject(e));
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