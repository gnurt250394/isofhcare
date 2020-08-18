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
import { StringeeClient, StringeeCall } from "stringee-react-native";
import UserProvider from '@data-access/user-provider'
import { connect } from "react-redux";
import firebase from 'react-native-firebase'
import RNCallKeepManager from '@components/RNCallKeepManager'
import reduxStore from '@redux-store'
const iOS = Platform.OS === "ios" ? true : false;
import RNCallKeep from "react-native-callkeep";
import InCallManager from 'react-native-incall-manager';
import BookingDoctorProvider from '@data-access/booking-doctor-provider';
import VoipPushNotification from 'react-native-voip-push-notification';
import objectUtils from "@utils/object-utils";
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
    RNCallKeepManager.setupCallKeep()
  }

  componentDidMount() {
    this.getTokenAndConnect()
    // this.checkPermistion()
  }

  checkPermistion = async () => {
    try {
      const result = await InCallManager.checkRecordPermission()
      if (result !== 'granted') {
        await InCallManager.requestRecordPermission()
      }
    } catch (error) {
    }
  }
  getTokenAndConnect = async () => {
    try {
      // await this.refs.client.connect(user2);
      let res = await UserProvider.getToken()
      if (res.code == 0) {
        await this.refs.client.connect(res.data);
      }
    } catch (error) {
    }
  }
  // Connection
  registerEventPush = async () => {
    if (Platform.OS == "android") {
      await firebase.messaging().requestPermission()
      firebase.messaging().getToken().then(token => {

        this.setState({ token })
        if (this.refs.client) {
          this.refs.client.registerPush(
            token,
            __DEV__ ? false : true, // isProduction: false trong quá trình development, true khi build release.
            true, // (iOS) isVoip: true nếu là kiểu Voip PushNotification. Hiện Stringee đang hỗ trợ kiểu này.
            (status, code, message) => {
            }
          );
        }

      })
    } else {
      // debugger;
      VoipPushNotification.requestPermissions();
      VoipPushNotification.registerVoipToken();
      VoipPushNotification.addEventListener("register", token => {
        // send token to your apn provider server
        if (this.refs.client) {
          this.refs.client.registerPush(
            token,
            true, // isProduction: false trong quá trình development, true khi build release.
            true, // (iOS) isVoip: true nếu là kiểu Voip PushNotification. Hiện Stringee đang hỗ trợ kiểu này.
            (status, code, message) => {
              if (status) {
                this.setState({
                  hasConnected: true,
                  token
                })
              }
            }
          );
        }
      });
      VoipPushNotification.addEventListener('notification', (notification) => {
      });
    }
  }
  _clientDidConnect = async ({ userId, projectId, isReconnecting }) => {



    this.registerEventPush()


  };

  _clientDidDisConnect = (err) => {



  };

  _clientDidFailWithError = (e) => {


  };

  _clientRequestAccessToken = () => {
    this.getTokenAndConnect()

    // Token để kết nối tới Stringee server đã hết bạn. Bạn cần lấy token mới và gọi connect lại ở đây
    // this.refs.client.connect("NEW_TOKEN");
  };
  renderAcademic = (doctor) => {
    let name = ''
    if (doctor?.name || doctor?.academicDegree) {
      name = objectUtils.renderAcademic(doctor?.academicDegree) + doctor.name
    }
    return name
  }


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
    console.log('customDataFromYourServer: ', customDataFromYourServer);
    const data = customDataFromYourServer ? JSON.parse(customDataFromYourServer) : {}
    if (RNCallKeepManager.isCall) {
      this.stringeeCall && this.stringeeCall.reject(
        callId,
        (status, code, message) => {
          console.log('message: ', message);
        }
      );
      return
    }
    if (Platform.OS == 'android') {
      RNCallKeepManager.displayIncommingCall(callId, data?.doctor ? this.renderAcademic(data?.doctor) : "Bác sĩ iSofhCare master")
      RNCallKeepManager.updateDisplay({ name: data?.doctor ? this.renderAcademic(data?.doctor) : "Bác sĩ iSofhCare master" })
    }
    this.props.navigation.navigate("videoCall", {
      callId: callId,
      from: from,
      to: to,
      isOutgoingCall: false,
      isVideoCall: true,
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
        <StringeeCall
          ref={ref => this.stringeeCall = ref}
        />
      </View>

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
    userApp: state.auth.userApp
  }
}

export default connect(mapStateToProps)(InitialVideoCall)