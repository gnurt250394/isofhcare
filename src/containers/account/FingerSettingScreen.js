import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import { View, Text, Switch, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import ScaledImage from "mainam-react-native-scaleimage";
import * as Animatable from "react-native-animatable";
import CheckPassword from "./CheckPassword";
import FingerprintPopup from "./FingerprintPopup";
import Modal from "@components/modal";
import userProvider from "@data-access/user-provider";
import redux from "@redux-store";
import dataCacheProvider from "../../data-access/datacache-provider";
import constants from "@resources/strings";
import NavigationService from "@navigators/NavigationService";

class FingerSettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      isFinger: false,
      checkPass: false,
      password: "",
      isDismissFinger: false
    };
  }
  componentDidMount() {
    dataCacheProvider.read("", constants.key.storage.KEY_FINGER, s => {
      if (s.refreshToken && s.userId) {
        console.log(s);
        this.setState({
          value: true
        });
      }
    });
  }
  backPress() {
    this.props.navigation.navigate("Account");
  }
  render() {
    return (
      <ActivityPanel
        actionbarStyle={styles.actionbar}
        style={styles.container}
        title={constants.setting}
        showFullScreen={true}
      >
        <View
          style={styles.header}
        >
          <ScaledImage
            source={require("@images/new/fingerprint.png")}
            height={60}
          />
        </View>
        <View>
          <View style={styles.itemMenu}>
            <View style={{ width: "80%" }}>
              <Text style={styles.itemText}>{constants.touch_id_screens.touch_login}</Text>
              <Text style={styles.itemTextNote}>
               {constants.touch_id_screens.warning}
              </Text>
            </View>
            <Switch
              value={this.state.value}
              size={200}
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
            isDismiss={this.state.isDismissFinger}
            handlePopupDismissed={this.handleFingerprintDismissed}
            handlePopupDismissedDone={this.handlePopupDismissedDone}
            handleCheckFingerFalse={this.handleCheckFingerFalse}
            isShowPass={this.handleCheckFingerFalse}
            style={styles.popup}
          />
        </Modal>
      </ActivityPanel>
    );
  }
  handleCheckFingerFalse = () => {
    if (this.state.isDismissFinger) {
      this.setState({
        isFinger: false,
        password: "",
        checkPass: true
      });
    } else {
      return
    }
  };
  handlePopupDismissedDone = () => {
    if (this.state.isDismissFinger) {
      dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
        userId: '',
        refreshToken: ''
      });
      NavigationService.navigate('home')

    } else {
      this.setState({
        isFinger: false,
        value: true,
        password: ""
      });
      NavigationService.navigate('home')
    }
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
        if (this.state.isDismissFinger) {
          this.setState({
            checkPass: false,
            isFinger: false,
            value: false,
            password: ""
          });
          dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
            userId: "",
            refreshToken: ""
          });
          return
        } if (this.state.value == true) {
          this.setState({
            checkPass: false,
            isFinger: true,
            password: "",
            value: true
          });

        }
        this.props.dispatch(redux.userLogin(user));
      } else {
        alert("Mật khẩu không hợp lệ");
      }
    });
  };
  handleFingerprintDismissed = () => {
    this.setState({
      isFinger: false,
      value: false,
      password: ""
    });
    dataCacheProvider.save("", constants.key.storage.KEY_FINGER, {
      userId: "",
      refreshToken: ""
    });
  };
  onValueChange = () => {
    if (this.state.value) {
      this.setState({
        value: false,
        password: "",
        isFinger: true,
        isDismissFinger: true,

      });

    } else {
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
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40
  },
  container: {
    flex: 1,
  },
  actionbar: {
    width: '100%',
    borderBottomColor: "rgba(0,0,0,0.07)",
    borderBottomWidth: 1
  },
  itemMenu: {
    flexDirection: "row",
    borderBottomColor: "rgba(0,0,0,0.07)",
    borderBottomWidth: 1,
    borderTopColor: "rgba(0,0,0,0.07)",
    borderTopWidth: 1,
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
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(FingerSettingScreen);
