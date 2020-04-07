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
import reduxStore from '@redux-store'
const user1 = "eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJTS05aQ2pHNXRRb2czME1yVGY4cXBNWm9zUHZoak5vb2RFIiwicmVzdF9hcGkiOnRydWUsImV4cCI6MTU4OTgzMDk1MywidXNlcklkIjo1MDg5LCJqdGkiOiJTS05aQ2pHNXRRb2czME1yVGY4cXBNWm9zUHZoak5vb2RFLTE1ODYyMzA5NTM4NjYifQ.NkcU1QlxcXZlnuzegfD2I_mJxvg2VaMlP2ph6uBtSFg";
const user2 = "eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJTS05aQ2pHNXRRb2czME1yVGY4cXBNWm9zUHZoak5vb2RFIiwiZXhwIjoxNTg2MjM2NzU1LCJ1c2VySWQiOiI1MDg5IiwianRpIjoiU0tOWkNqRzV0UW9nMzBNclRmOHFwTVpvc1B2aGpOb29kRS0xNTg2MjMzMTU1MTE2In0.4xt9jklPXDcJsbEqYisR389Ym_BkW9_OHGkUBiz1FFQ";

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

  async componentDidMount() {
    this.getTokenAndConnect()

  }

  getTokenAndConnect = async () => {
    try {
      // await this.refs.client.connect(user2);
      let res = await UserProvider.getToken()
      if (res.code == 0)
        await this.refs.client.connect(res.data);
    } catch (error) {
      console.log('error: ', error);

    }
  }
  // Connection
  _clientDidConnect = ({ userId, projectId, isReconnecting }) => {
    console.log('isReconnecting: ', isReconnecting);
    console.log('projectId: ', projectId);
    console.log("_clientDidConnect - " + userId);
    reduxStore.saveUserId(userId)

  };

  _clientDidDisConnect = (err) => {
    console.log('err: ', err);
    console.log("_clientDidDisConnect");
    reduxStore.saveUserId('')
    
  };

  _clientDidFailWithError = (e) => {
    console.log('e: ', e);
    console.log("_clientDidFailWithError");
  };

  _clientRequestAccessToken = () => {
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

    this.props.navigation.navigate("videoCall", {
      callId: callId,
      from: from,
      to: to,
      isOutgoingCall: false,
      isVideoCall: isVideoCall
    });
  };

  // Action
  _onVoiceCallButtonPress = () => {
    console.log("_onVoiceCallButtonPress");
    Keyboard.dismiss();
    if (this.state.callToUserId != "" && this.state.hasConnected) {
      this.props.navigation.navigate("videoCall", {
        from: this.state.myUserId,
        to: this.state.callToUserId,
        isOutgoingCall: true,
        isVideoCall: false
      });
    }
  };

  _onVideoCallButtonPress = () => {
    Keyboard.dismiss();
    console.log("_onVideoCallButtonPress");
    console.log('this.state.hasConnected: ', this.state.hasConnected);
    console.log('this.state.callToUserId : ', this.state.callToUserId);
    if (this.state.callToUserId != "" && this.state.hasConnected) {
      this.props.navigation.navigate("videoCall", {
        from: this.state.myUserId,
        to: this.state.callToUserId,
        isOutgoingCall: true,
        isVideoCall: true
      });
    }
  };

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

      //   <TextInput
      //     underlineColorAndroid="transparent"
      //     style={styles.input}
      //     autoCapitalize="none"
      //     value={this.state.callToUserId}
      //     placeholder="Make a call to userId"
      //     onChangeText={text => this.setState({ callToUserId: text })}
      //   />

      //   <View style={styles.buttonView}>
      //     <TouchableOpacity
      //       style={styles.button}
      //       onPress={this._onVoiceCallButtonPress}
      //     >
      //       <Text style={styles.text}>Voice videoCall</Text>
      //     </TouchableOpacity>

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