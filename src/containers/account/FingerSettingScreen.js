import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import { View, Text, Switch, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import ScaledImage from "mainam-react-native-scaleimage";
import * as Animatable from "react-native-animatable";
import CheckPassword from "./CheckPassword";
import FingerprintPopup from "./FingerprintPopup";
import Modal from "react-native-modal";
import userProvider from "@data-access/user-provider";
import redux from "@redux-store";
import dataCacheProvider from "../../data-access/datacache-provider";
import constants from "@resources/strings";

class FingerSettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      isFinger: false,
      checkPass: false,
      password: ""
    };
  }
  componentDidMount() {
    dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s  => {
      if(s.refreshToken && s.userId){
        console.log(s)
        this.setState({
          value:true
        })
      }
    }
    )
  }
  backPress() {
    this.props.navigation.navigate("Account")
}
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        title="Cài đặt"
        showFullScreen={true}
      >
        <View>
          <View style={styles.itemMenu}>
            <View style={{ width: "80%" }}>
              <Text style={styles.itemText}>Đăng nhập bằng vân tay</Text>
              <Text style={styles.itemTextNote}>
                Lưu ý: Tất cả vân tay đã được đăng ký trong thiết bị đều có thể
                đăng nhập
              </Text>
            </View>
            <Switch
              value={this.state.value}
              color={"#02C39A"}
              onValueChange={this.onValueChange}
            />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          isVisible={this.state.checkPass}
          // onRequestClose={() => {}}
        >
          <CheckPassword
            onCancelClick={this.onCancelClick}
            onSetFinger={this.onSetFinger}
            onChangeText={s => this.setState({ password: s })}
          />
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          isVisible={this.state.isFinger}
          // onRequestClose={() => {}}
        >
          <FingerprintPopup
            isLogin={false}
            handlePopupDismissed={this.handleFingerprintDismissed}
            handlePopupDismissedDone={this.handlePopupDismissedDone}
            style={styles.popup}
          />
        </Modal>
      </ActivityPanel>
    );
  }
  handlePopupDismissedDone = () => {
    this.setState({
      isFinger: false,
      value: true,
      password: ""
    });
  };
  onCancelClick = () => {
    this.setState({
      checkPass: false,
      value: false,
      password: ""
    });
  };
  onSetFinger = () => {
    // this.setState({
    //     checkPass : false,
    //     isFinger:true,
    // })
    var phone = this.props.userApp.currentUser.phone;
    var password = this.state.password;
    console.log(this.props, "props");
    userProvider.login(phone, password).then(s => {
      if (s.code == 0) {
        this.setState({
          checkPass: false,
          isFinger: true,
          password: ""
        });
        this.props.dispatch(redux.userLogin(user));
      } else {
        alert("Sai mật khẩu");
      }
    });
  };
  handleFingerprintDismissed = () => {
    this.setState({
      isFinger: false,
      value: false,
      password: ""
    });
  };
  onValueChange = () => {
   if(this.state.value){
    this.setState({
      value: false,
      password: ""
    });
    dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
      userId: '',
      refreshToken: ''
    });
   }else{
    this.setState({
      value: true,
      checkPass: !this.state.checkPass,
      password: ""
    });
   }
  };
}
const DEVICE_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  itemMenu: {
    flexDirection: "row",
    borderBottomColor: "#00000011",
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },

  itemText: {
    fontWeight: "bold"
  },
  itemTextNote: {
    fontWeight: "400"
  },
  popup: {
    width: DEVICE_WIDTH * 0.8
  }
});

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(FingerSettingScreen);
