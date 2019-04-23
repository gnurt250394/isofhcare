import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import ScaleImage from "mainam-react-native-scaleimage";
import Modal from "react-native-modal";
import FingerprintPopup from "./FingerprintPopup";
import { connect } from "react-redux";

const width = Dimensions.get("window").width;
class FingerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFinger: false
    };
    this.nextScreen = this.props.navigation.getParam("nextScreen", null);

    console.log(this.props,'d')
  }

  render() {
    return (
      <View style={styles.container}>
        <ScaleImage
          style={styles.finger}
          source={require("@images/new/fingerprint.png")}
          height={80}
        />
        <Text style={styles.title}> Touch ID cho "IsofhCare" </Text>
        <Text style={styles.details}>
          Sử dụng id cảm ứng của bạn để truy cập nhanh hơn,{`\n`} dễ dàng đăng
          nhập vào tài khoản của bạn
        </Text>
        <View style={styles.viewBtn}>
          <TouchableOpacity onPress={this.onCancel} style={styles.viewCancel}>
            <Text>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressFinger} style={styles.viewOk}>
            <Text>OK</Text>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            isVisible={this.state.isShowFinger}
            // onRequestClose={() => {}}
          >
            <FingerprintPopup
              isLogin={false}
              style={styles.popup}
              handlePopupDismissed={this.handleFingerprintDismissed}
              handleCheckFingerFalse={() => {}}
              handlePopupDismissedDone = {this.handleFingerprintDismissed}
              style={styles.popup}
              onNavigate = {this.onNavigate}
              // nextScreen = {this.props.navigation.state.params.nextScreen}
              
            />
          </Modal>
        </View>
      </View>
    );
  }
  onNavigate = () => {
    this.props.navigation.replace(
      this.nextScreen.screen,
      this.nextScreen.param
    );
  }
  onCancel = () => {
    this.props.navigation.navigate("home", {
      showDraw: false
    });
  };
  onPressFinger = () => {
    this.setState({
      isShowFinger: true
    });
  };

  handleFingerprintDismissed = () => {
    this.setState({
      isShowFinger: false
    });
    this.props.navigation.navigate("home", {
      showDraw: false
    });
  };
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  viewOk: {
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    borderRadius: 5,
    backgroundColor: rgb(2, 195, 154),
    height: 45,
    marginHorizontal: 20
  },
  viewCancel: {
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    height: 45,
    marginHorizontal: 20
  },
  popup: { width: width * 0.8 },
  viewBtn: {
    marginVertical: 80,
    justifyContent: "space-around",
    flexDirection: "row"
  },
  finger: {
    marginVertical: 100
  },
  title: {
    fontWeight: "bold",
    fontSize: 20
  },
  details: {
    marginVertical: 20,
    textAlign: "center"
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    navigation: state.navigation,
  };
}
export default connect(mapStateToProps)(FingerScreen);