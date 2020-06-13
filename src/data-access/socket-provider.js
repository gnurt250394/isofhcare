import io from 'socket.io-client';
const connectSocket = async (token) => {
    let socket = null
    return new Promise(async (resolve, reject) => {
        try {
            if (token) {
                console.log('token: ', token);
                // const url = 'http://192.168.1.5:4443';
                // const url = 'http://192.168.43.31:4443';
                const url = 'http://10.0.50.122:4443';
                // const url = 'https://node-js-webbrtc-server.herokuapp.com';
                socket = io.connect(url, {
                    transports: ['websocket'], query: {
                        token: token,
                    },
                    upgrade: true,
                    reconnection: true,
                    autoConnect: true,
                    timeout: 30000,
                    rememberUpgrade: true
                })
                if (!socket.connected) {
                    socket.connect()
                }
                resolve(socket)

            }else{
                reject()
            }
        } catch (error) {
            console.log('error: ', error);
            reject()
        }
    })
}

export default {
    connectSocket
}