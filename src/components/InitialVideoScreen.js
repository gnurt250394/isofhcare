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
  AsyncStorage
} from "react-native";
import { StringeeClient } from "stringee-react-native";
import UserProvider from '@data-access/user-provider'
import { connect } from "react-redux";
import firebase from 'react-native-firebase'
import reduxStore from '@redux-store'
import RNCallKeepManager from '@components/RNCallKeepManager'
const iOS = Platform.OS === "ios" ? true : false;

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
    firebase.messaging().getToken().then(token => {
      console.log('token: ', token);
      this.refs.client.registerPush(
        token,
        __DEV__ ? false : true, // isProduction: false trong quá trình development, true khi build release.
        true, // (iOS) isVoip: true nếu là kiểu Voip PushNotification. Hiện Stringee đang hỗ trợ kiểu này.
        (status, code, message) => {
          console.log(message, 'meeee');
        }
      );
    })

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
    // RNCallKeepManager.setIsAppForeGround(true)
    // RNCallKeepManager.displayIncommingCall({
    //   callId: callId,
    //   from: from,
    //   to: to,
    //   isOutgoingCall: false,
    //   isVideoCall: isVideoCall
    // });
  };
  componentWillUnmount() {
    this.refs.client ? this.refs.client.disconnect() : null
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