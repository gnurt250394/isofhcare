import React, { Component, PropTypes, PureComponent } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  TouchableOpacity,
  Platform,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from "native-base";
import ImagePicker from "mainam-react-native-select-image";
import imageProvider from "@data-access/image-provider";
import ImageLoad from "mainam-react-native-image-loader";
import stylemodal from "@styles/modal-style";
import DateTimePicker from "mainam-react-native-date-picker";
import Modal from "@components/modal";
import connectionUtils from "@utils/connection-utils";
import snackbar from "@utils/snackbar-utils";
import medicalRecordProvider from "@data-access/medical-record-provider";
import NavigationService from "@navigators/NavigationService";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from "mainam-react-native-floating-label";
import { cleanSingle } from "react-native-image-crop-picker";
import dateUtils from "mainam-react-native-date-utils";
import constants from "@resources/strings";
import KeyboardSpacer from "react-native-keyboard-spacer";
import ActionSheet from 'react-native-actionsheet'
import locationProvider from '@data-access/location-provider';

class CreateProfileTicketScreen extends Component {
  constructor() {
    super();
    this.state = {
      isGender: false,
      genderUser: [{ gender: "Nam", value: 1 }, { gender: "Nữ", value: 0 }],
      toggelDateTimePickerVisible: false,
      valueGender: 2,
      txGender: '',
      name: '',
      email: "",
      dob: "",
      imgLocal: "",
      date: "",
      image: "",
      imageUris: [],
      valid: '',
      isDataNull: '',
      status: 2
    };
  }
  componentDidMount() {

  }
  onSelectDistric = () => {
    this.props.navigation.navigate('selectLocationScreen')
  }
  onChangeText = type => text => {
    this.setState({ [type]: text });
  };
  setDate(newDate) {
    this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
    });
  }
  onShowGender = () => {
    this.actionSheetGender.show();

  };
  showLoading(loading, callback) {
    if (this.props.showLoading) {
      this.props.showLoading(loading, callback);
    } else {
      callback;
    }
  }
  onSetGender = index => {
    try {
      switch (index) {
        case 0:
          this.setState(
            {
              valueGender: 1,
              txGender: 'Nam'
            });
          return;
        case 1:
          this.setState(
            {
              valueGender: 0,
              txGender: 'Nữ'
            });
          return;
      }
    } catch (error) {

    }

  };

  selectImage() {
    connectionUtils
      .isConnected()
      .then(s => {
        if (this.imagePicker) {
          this.imagePicker.open(true, 200, 200, image => {
            setTimeout(() => {
              Keyboard.dismiss();
            }, 500);
            this.setState({
              image
            });
            imageProvider.upload(this.state.image.path,this.state.image.mime, (s, e) => {
              if (s.success && s.data.code == 0) {
                let images = s.data.data.images[0].thumbnail;
                this.setState({
                  imgLocal: images
                });
              }
              if (e) {
                this.setState({
                  isLoading: false
                });
              }
            });
          });
        }
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, "danger");
      });
  }
  onUpdate2(image) {
    if (!this.form.isValid()) {
      return;
    }

    connectionUtils
      .isConnected()
      .then(s => {
        this.setState(
          {
            isLoading: true
          },
          () => {
            const { name } = this.state;
            const gender = this.state.valueGender;
            const email = this.state.email
            const status = this.state.status
            let date2 = this.state.dob ? this.state.dob.format('yyyy-MM-dd') + ' 00:00:00' : null
            medicalRecordProvider
              .createMedical(name, gender, date2, email, image, status)
              .then(res => {
                if (res.code == 0) {
                  this.setState({
                    isLoading: false
                  });
                  this.state.isDataNull ? snackbar.show(constants.msg.booking.create_profile_success, "success")
                    :
                    snackbar.show(constants.msg.booking.create_relatives_success, "success");


                  NavigationService.navigate('selectProfile', { loading: true });
                } if (res.code == 2) {
                  this.setState({
                    isLoading: false
                  });
                  this.state.isDataNull ? snackbar.show(constants.msg.booking.profile_arealy_exist, 'danger') : snackbar.show(constants.msg.booking.profile_arealy_exist, 'danger')
                } else {
                  this.setState({
                    isLoading: false
                  });
                }
              })
              .catch(err => {
                this.setState({
                  isLoading: false
                });
                snackbar.show(constants.msg.app.err_try_again, "danger");
              });
          }
        )
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, "danger");
      });
  }
  onUpdate = () => {
    this.form.isValid();
    if (!this.form.isValid()) {
      return;
    }
    if (this.state.image)
      this.setState({ isLoading: true }, () => {
        imageProvider.upload(this.state.image.path,this.state.image.mime, (s, e) => {
          if (s.success && s.data.code == 0) {
            let image = s.data.data.images[0].thumbnail;
            this.onUpdate2(image);
          }
          if (e) {
            this.setState({
              isLoading: false
            });
          }
        });
      });
    else this.onUpdate2("");
  };
  goBack = () => this.props.navigation.pop()
  defaultImage = () => {
    const icSupport = require("@images/new/user.png");
    return (
      <ScaleImage
        resizeMode="cover"
        source={icSupport}
        width={70}
        style={{ width: 70, height: 70, alignSelf: "center" }}
      />
    );
  }
  validateName = (valid, messages) => {
    if (valid) {
      this.setState({ nameError: "" });
    } else {
      this.setState({ nameError: messages });
    }
  }
  selectDate = () => this.setState({ toggelDateTimePickerVisible: true })
  validateDateTime = (valid, messages) => {
    if (valid) {
      this.setState({ nameError: "" });
    } else {
      messages ?
        (this.setState({ valid: constants.msg.app.dob_must_lesser_150, isMin: false })) : (this.setState({ isMin: true }));
    }
  }
  confirmDate = newDate => {
    this.setState(
      {
        dob: newDate,
        date: newDate.format("dd/MM/yyyy"),
        toggelDateTimePickerVisible: false
      },
      () => {
      }
    );
  }
  onCancelDate = () => {
    this.setState({ toggelDateTimePickerVisible: false });
  }
  render() {
    let maxDate = new Date();
    maxDate = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate()
    );
    let minDate = new Date();
    minDate = new Date(
      maxDate.getFullYear() - 150,
      maxDate.getMonth(),
      maxDate.getDate()
    );
    const icSupport = require("@images/new/user.png");
    const source = this.state.imgLocal
      ? { uri: this.state.imgLocal.absoluteUrl() }
      : icSupport;

    return (
      <ActivityPanel
        statusbarBackgroundColor="#0049B0"
        style={styles.AcPanel}
        title={constants.title.register_account}
        titleStyle={{ marginRight: 0 }}
        isLoading={this.state.isLoading}
        backButton={
          <TouchableOpacity style={styles.btnCancel} onPress={this.goBack}>
            <Text style={styles.btnhuy}>{constants.actionSheet.cancel}</Text>
          </TouchableOpacity>
        }

        menuButton={
          <TouchableOpacity onPress={this.onUpdate}>
            <Text style={styles.btnmenu}>{constants.actionSheet.save}</Text>
          </TouchableOpacity>
        }

      >
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.scroll}>
          <View style={styles.viewImgUpload}>
            <TouchableOpacity
              style={styles.buttonSelectAvatar}
              onPress={this.selectImage.bind(this)}
            >
              <ImageLoad
                resizeMode="cover"
                imageStyle={styles.borderImage}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={styles.placeHolderImage}
                placeholderSource={icSupport}
                style={styles.imageAvatar}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={this.defaultImage}
              />
              <ScaleImage
                source={require("@images/new/ic_account_add.png")}
                width={20}
                style={styles.iconAddAccount}
              />
            </TouchableOpacity>
          </View>


          <View style={styles.container}>
            <Form ref={ref => (this.form = ref)} style={[styles.flex]}>
              <Field style={[styles.mucdichkham, styles.flex, , Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                <Text style={styles.mdk}>{constants.fullname}(*)</Text>
                <TextField
                  hideError={true}
                  onValidate={this.validateName}
                  validate={{
                    rules: {
                      required: true,
                      minlength: 1,
                      maxlength: 255
                    },
                    messages: {
                      required: constants.msg.user.fullname_not_null,
                      maxlength: constants.msg.user.text_without_255
                    }
                  }}
                  placeholder={constants.msg.user.input_name}
                  multiline={true}
                  inputStyle={[
                    styles.ktq,
                    styles.inputName
                  ]}
                  errorStyle={styles.errorStyle}
                  onChangeText={this.onChangeText("name")}
                  value={this.state.name}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  // underlineColorAndroid="transparent"
                  autoCorrect={false}
                />
              </Field>
              {this.state.nameError ? <Text style={[styles.errorStyle]}>{this.state.nameError}</Text> : (<View></View>)}
              <TouchableOpacity
                style={[
                  styles.mucdichkham,
                  styles.buttonGender
                ]}
                onPress={this.onShowGender}
              >
                <Text style={styles.mdk}>{constants.gender}(*)</Text>
                <Text style={styles.ktq}>
                  {!this.state.txGender
                    ? constants.select_gender
                    : this.state.txGender}
                </Text>
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 3, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </TouchableOpacity>

              <Field

                style={[styles.mucdichkham, styles.flex, styles.buttonGender]}
              >
                <Text style={styles.mdk}>{constants.dob}(*)</Text>

                <TextField
                  // value={this.state.date || ""}
                  onPress={this.selectDate}
                  dateFormat={"dd/MM/yyyy"}
                  splitDate={"/"}
                  editable={false}
                  getComponent={(
                    value,
                    onChangeText,
                    onFocus,
                    onBlur,
                    isError
                  ) => (
                      <Text style={styles.ktq}>{value ? (value) : (constants.select_dob)}</Text>
                    )}
                  // onChangeText={s => {
                  //   this.setState({ date: s });
                  // }}
                  value={this.state.date}
                  errorStyle={styles.errorStyle}
                  hideError={true}
                  onValidate={this.validateDateTime}
                  validate={{
                    rules: {
                      max: maxDate,
                      min: minDate
                    },
                    messages: {
                      max: false,
                      min: true
                    }
                  }}
                  hideError={true}
                  onValidate={(valid, messages) => {
                    if (valid) {
                      this.setState({ dateError: "", });
                    } else {
                      this.setState({ isMin: messages });
                    }
                  }}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  style={styles.flex}
                />
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 5, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </Field>
              {this.state.isValid ? <Text style={[styles.errorStyle]}>{this.state.valid}</Text> : (<View></View>)}

              <Field style={[styles.mucdichkham, { flex: 1, borderTopWidth: 0 }, , Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                <Text style={styles.mdk}>{constants.phone}(*)</Text>
                <TextField
                  hideError={true}
                  onValidate={(valid, messages) => {
                    if (valid) {
                      this.setState({ phoneError: "" });
                    } else {
                      this.setState({ phoneError: messages });
                    }
                  }}
                  validate={{
                    rules: {
                      required: true,
                      minlength: 1,
                      maxlength: 255
                    },
                    messages: {
                      required: constants.msg.user.phone_not_null,
                      maxlength: constants.msg.user.text_without_255
                    }
                  }}
                  placeholder={constants.input_phone}
                  multiline={true}
                  inputStyle={[
                    styles.ktq,
                    styles.inputName
                  ]}
                  errorStyle={styles.errorStyle}
                  onChangeText={this.onChangeText("name")}
                  value={this.state.name}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  // underlineColorAndroid="transparent"
                  autoCorrect={false}
                />
              </Field>
              <Text style={[styles.errorStyle]}>{this.state.phoneError}</Text>

              <TouchableOpacity
                style={[
                  styles.mucdichkham,
                  styles.buttonGender, { marginTop: 10 }
                ]}
                onPress={this.onSelectDistric}
              >
                <Text style={styles.mdk}>{constants.ehealth.address}(*)</Text>
                <Text style={styles.ktq}>
                  {constants.ehealth.city}
                </Text>
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 3, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mucdichkham,
                  styles.buttonGender
                ]}
                onPress={this.onShowGender}
              >
                <Text style={styles.mdk}>{constants.district}(*)</Text>
                <Text style={styles.ktq}>
                  {constants.ehealth.district}
                </Text>
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 3, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mucdichkham,
                  styles.buttonGender
                ]}
                onPress={this.onShowGender}
              >
                <Text style={styles.mdk}>{constants.wards}(*)</Text>
                <Text style={styles.ktq}>
                  {constants.ehealth.wards}
                </Text>
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 3, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mucdichkham,
                  styles.buttonGender
                ]}
                onPress={this.onShowGender}
              >
                <Text style={styles.mdk}>{constants.village}(*)</Text>
                <Text style={styles.ktq}>
                  {constants.village}
                </Text>
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 3, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </TouchableOpacity>
            </Form>
          </View>


        </ScrollView>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
        <DateTimePicker
          isVisible={this.state.toggelDateTimePickerVisible}
          onConfirm={this.confirmDate}
          onCancel={this.onCancelDate}
          date={new Date()}
          minimumDate={minDate}
          maximumDate={new Date()}
          cancelTextIOS={constants.actionSheet.cancel2}
          confirmTextIOS={constants.actionSheet.confirm}
          date={this.state.dob || new Date()}
        />
        <ActionSheet
          ref={o => this.actionSheetGender = o}
          options={[constants.actionSheet.male, constants.actionSheet.female, constants.actionSheet.cancel]}
          cancelButtonIndex={2}
          // destructiveButtonIndex={1}
          onPress={this.onSetGender}
        />
        {Platform.OS == "ios" && <KeyboardSpacer />}
      </ActivityPanel>
    );
  }

}

function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
const styles = StyleSheet.create({
  buttonGender: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 12,
    borderTopWidth: 0
  },
  inputName: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    width: 200
  },
  flex: { flex: 1 },
  iconAddAccount: {
    position: "absolute",
    bottom: 0,
    right: 0
  },
  imageAvatar: {
    width: 70,
    height: 70,
    alignSelf: "center"
  },
  placeHolderImage: {
    width: 70,
    height: 70,
    alignSelf: "center"
  },
  borderImage: {
    borderRadius: 35
  },
  buttonSelectAvatar: {
    position: "relative",
    width: 70,
    marginTop: 20
  },
  scroll: {
    flex: 1,
    paddingVertical: 5
  },
  AcPanel: {
    flex: 1,
    backgroundColor: "rgb(247,249,251)"
  },
  imgIc: {
    marginLeft: 10
  },
  imgmdk: {
    marginRight: 5
  },
  mucdichkham: {
    backgroundColor: "rgb(255,255,255)",
    // borderStyle: "solid",
    borderWidth: 1,
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.06)",
    flexDirection: "row"

  },
  mdk: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000000",

  },
  ktq: {
    flex: 1,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: "#8e8e93",
    marginRight: 10,
    marginLeft: 20
  },
  container: {
    backgroundColor: "rgb(247,249,251)",
    // borderStyle: "solid",
    marginVertical: 20,
    // borderWidth: 1,
    // borderColor: "rgba(0, 0, 0, 0.07)"
  },
  btnhuy: {
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#8e8e93",
    marginLeft: 10
  },
  header: { alignItems: "center" },
  avatar: {
    alignItems: "center",
    paddingTop: 20,
    width: 70
  },
  add: {
    position: "absolute"
  },
  viewImgUpload: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  ViewRow: {},
  textho1: {
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000000"
  },
  txInput: {
    alignItems: "flex-end",
    width: "50%",
    height: 41,
    color: "#8e8e93"
  },
  view2: {
    backgroundColor: "rgb(255,255,255)",
    top: 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)"
  },
  next: {
    position: "absolute",
    top: 17,
    right: 25
  },
  view3: {
    backgroundColor: "rgb(255,255,255)",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",

    top: 60
  },

  textbot: {
    marginLeft: 15
    // fontSize: 15,
    // fontWeight: "normal",
    // fontStyle: "normal",
    // letterSpacing: 0.2,
    // color: "#4a4a4a",
    // position: "relative",
    // top: 70,
    // padding: 10
  },
  btnmenu: {
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#0a7ffe",
    marginRight: 10
  },
  ic_icon: {
    position: "absolute",
    bottom: 0,
    right: 8
  },
  errorStyle: {
    color: "red",
    marginLeft: 13
  },
  textInputStyle: {
    color: "#53657B",
    height: 45,
  },
  labelStyle: { color: '#53657B', fontSize: 16, marginBottom: 10, marginLeft: 50 }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(CreateProfileTicketScreen);
