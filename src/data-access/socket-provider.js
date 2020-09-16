import React, {createContext, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import VoipPushNotification from 'react-native-voip-push-notification';
import firebase from 'react-native-firebase';
import RNCallKeepManager from '@components/RNCallKeepManager';
import constants from '@resources/strings';

const WebSocketContext = createContext(null);

export {WebSocketContext};

export default ({children}) => {
  let socket = useRef();
  const tokenFirebase = useRef('');
  let ws;
  const userApp = useSelector(state => state.auth.userApp);
  console.log('userApp: 111', userApp);

  const clearSocket = () => {
    if (socket.current) socket.current.disconnect();
    socket.current = null;
  };
  const onSend = (type, data = {}, callback) => {
    if (socket.current) socket.current.emit(type, data, callback);
  };
  const listen = (event, data, callback) => {
    if (socket.current) socket.current.on(event, data, callback);
  };
  
  const connectSocket = token => {
    return new Promise((resolve, reject) => {
      if (token) {
        try {
          // console.log('token: ', token);
          // const url = 'http://192.168.1.5:4443';
          // const url = 'http://192.168.43.31:4443';
          const url = 'http://10.0.50.112:4443';
          // const url = 'https://isofhcare-stable.herokuapp.com';
          socket.current = io.connect(url, {
            transports: ['websocket'],
            query: {
              token: token,
            },
            upgrade: true,
            reconnection: true,
            autoConnect: true,
            timeout: 30000,
            rememberUpgrade: true,
          });

          socket.current.connect();
          console.log('socket.current: ', socket.current);
          resolve(socket.current);
          console.log('socket.current.connected: ', socket.current.connected);
        } catch (error) {
          reject(error);
          console.log('error: ', error);
        }
      }
    });
  };
  

  return (
    <WebSocketContext.Provider
      value={{
        socket: socket.current,
        clearSocket,
        onSend,
        listen,
        connectSocket,
      }}>
      {children}
    </WebSocketContext.Provider>
  );
};
