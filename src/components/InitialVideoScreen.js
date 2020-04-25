import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { StringeeClient } from "stringee-react-native";
import UserProvider from '@data-access/user-provider'
import { connect } from "react-redux";
import firebase from 'react-native-firebase'
import RNCallKeepManager from '@components/RNCallKeepManager'
import reduxStore from '@redux-store'
const iOS = Platform.OS === "ios" ? true : false;
import RNCallKeep from "react-native-callkeep";
import InCallManager from 'react-native-incall-manager';
import VoipPushNotification from 'react-native-voip-push-notification';
class InitialVideoCall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myUserId: "",
      callToUserId: "",
      hasConnected: false
    };
    this.clientEventHandlers = {
      onConnect: this._clientDidConnect,
      onDisConnect: this._clientDidDisConnect,
      onFailWithError: this._clientDidFailWithError,
      onRequestAccessToken: this._clientRequestAccessToken,
      onIncomingCall: this._callIncomingCall,
    };
  }

  componentDidMount() {
    this.getTokenAndConnect()
    this.checkPermistion()

  }

  checkPermistion = async () => {
    try {
      const result = await InCallManager.checkRecordPermission()
      console.log('result: ', result);

      if (result !== 'granted') {
        await InCallManager.requestRecordPermission()

      }
    } catch (error) {
      console.log('error: ', error);

    }
  }
  getTokenAndConnect = async () => {
    try {
      // await this.refs.client.connect(user2);
      let res = await UserProvider.getToken()
      console.log('res: ', res);
      if (res.code == 0) {
        await this.refs.client.connect(res.data);

      }
    } catch (error) {
      console.log('error: ', error);

    }
  }
  // Connection
  _clientDidConnect = async ({ userId, projectId, isReconnecting }) => {
    console.log('isReconnecting: ', isReconnecting);
    console.log('projectId: ', projectId);
    console.log("_clientDidConnect - " + userId);
    if (Platform.OS == "android") {
      await firebase.messaging().requestPermission()
      firebase.messaging().getToken().then(token => {
        console.log('token: ', token);
        this.setState({ token })
        this.refs.client.registerPush(
          token,
          __DEV__ ? false : true, // isProduction: false trong quá trình development, true khi build release.
          true, // (iOS) isVoip: true nếu là kiểu Voip PushNotification. Hiện Stringee đang hỗ trợ kiểu này.
          (status, code, message) => {
            console.log(message, 'meeee');
          }
        );
      })
    } else {
      // debugger;
      VoipPushNotification.requestPermissions();
      VoipPushNotification.registerVoipToken();
      VoipPushNotification.addEventListener("register", token => {
        console.log('token: ', token);
        // send token to your apn provider server
        this.refs.client.registerPush(
          token,
          false, // isProduction: false trong quá trình development, true khi build release.
          true, // (iOS) isVoip: true nếu là kiểu Voip PushNotification. Hiện Stringee đang hỗ trợ kiểu này.
          (status, code, message) => {
            console.log(message);
          }
        );
      });

      VoipPushNotification.addEventListener('notification', (notification) => {
        // console.log('notification: ', notification._data.data.map);
        // --- when receive remote voip push, register your VoIP client, show local notification ... etc
        //this.doRegisterOrSomething();

        // --- This  is a boolean constant exported by this module
        // --- you can use this constant to distinguish the app is launched by VoIP push notification or not
        // console.log('VoipPushNotification.wakeupByPush: ', VoipPushNotification.wakeupByPush);
        // if (AppState.currentState != 'active') {
        //   // this.doSomething()
        //   // if (notification._data.data.map.type == 'CALL_EVENT') {
        //   // RNCallKeepManager.displayIncommingCall(notification._data.data.map.data.map.callId)

        //   // }
        //   // --- remember to set this static variable back to false
        //   // --- since the constant are exported only at initialization time, and it will keep the same in the whole app
        // }

        /**
         * Local Notification Payload
         *
         * - `alertBody` : The message displayed in the notification alert.
         * - `alertAction` : The "action" displayed beneath an actionable notification. Defaults to "view";
         * - `soundName` : The sound played when the notification is fired (optional).
         * - `category`  : The category of this notification, required for actionable notifications (optional).
         * - `userInfo`  : An optional object containing additional notification data.
         */
        // VoipPushNotification.presentLocalNotification({
        //   alertBody: "hello! " + notification.getMessage()
        // });
      });
    }



  };

  _clientDidDisConnect = (err) => {
    console.log('err: ', err);
    console.log("_clientDidDisConnect");

  };

  _clientDidFailWithError = (e) => {
    console.log('e: ', e);
    console.log("_clientDidFailWithError");
  };

  _clientRequestAccessToken = () => {
    this.getTokenAndConnect()
    console.log("_clientRequestAccessToken");
    // Token để kết nối tới Stringee server đã hết bạn. Bạn cần lấy token mới và gọi connect lại ở đây
    // this.refs.client.connect("NEW_TOKEN");
  };

  // videoCall events
  _callIncomingCall = ({
    callId,
    from,
    to,
    fromAlias,
    toAlias,
    callType,
    isVideoCall,
    customDataFromYourServer
  }) => {
    let data = JSON.parse(customDataFromYourServer)
    RNCallKeep.addEventListener('didDisplayIncomingCall', ({ error, callUUID, handle, localizedCallerName, hasVideo, fromPushKit, payload }) => {
      RNCallKeep.updateDisplay(callUUID, data?.doctor?.name || "Bác sĩ đang gọi", "")
      RNCallKeepManager.UUID = callUUID
      // you might want to do following things when receiving this event:
      // - Start playing ringback if it is an outgoing call
    });
    console.log(
      "IncomingCallId-" +
      callId +
      " from-" +
      from +
      " to-" +
      to +
      " fromAlias-" +
      fromAlias +
      " toAlias-" +
      toAlias +
      " isVideoCall-" +
      isVideoCall +
      "callType-" +
      callType +
      "customDataFromYourServer-" +
      customDataFromYourServer
    );
    this.props.navigation.navigate("videoCall", {
      callId: callId,
      from: from,
      to: to,
      isOutgoingCall: false,
      isVideoCall: isVideoCall,
      profile: data
    });

  };
  componentWillUnmount() {
    this.refs.client ? this.refs.client.disconnect() : null
    if (Platform.OS == "android") {
      firebase.messaging().deleteToken().then(res => {
      }).catch(err => {

      })

    } else {

    }

  }

  render() {
    return (
      <View>
        <StringeeClient ref="client" eventHandlers={this.clientEventHandlers} />

      </View>
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>
      //     React Native wrapper for Stringee mobile SDK!
      //   </Text>

      //   <Text style={styles.info}>Logged in as: {this.state.myUserId}</Text>



      //   <View style={styles.buttonView}>


      //     <TouchableOpacity
      //       style={styles.button}
      //       onPress={this._onVideoCallButtonPress}
      //     >
      //       <Text style={styles.text}>Video videoCall</Text>
      //     </TouchableOpacity>
      //   </View>
      //   <StringeeClient ref="client" eventHandlers={this.clientEventHandlers} />

      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  },
  info: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold",
    color: "red"
  },

  text: {
    textAlign: "center",
    color: "#F5FCFF",
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 15
  },

  input: {
    height: 35,
    width: 280,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: "#ECECEC"
  },

  button: {
    width: 120,
    height: 40,
    marginTop: 40,
    paddingTop: 10,
    // paddingBottom: ,
    backgroundColor: "#1E6738",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },

  buttonView: {
    width: 280,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
const mapStateToProps = (state) => {
  return {
    userApp: state.userApp
  }
}

export default connect(mapStateToProps)(InitialVideoCall)