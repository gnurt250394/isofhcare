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

class createProfile extends Component {
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
    if (this.props.userApp.isLogin) {
      var name = this.props.userApp.currentUser.name
      var image = this.props.userApp.currentUser.image
      var dob = this.props.userApp.currentUser.dob
      var gender = this.props.userApp.currentUser.gender
      var email = this.props.userApp.currentUser.email
      var isDataNull = this.props.navigation.state.params.isDataNull
      console.log(this.props)
      if (isDataNull) {
        this.setState({
          name: name,
          image: image,
          date: dob ? dob.toDateObject('-').format('dd/MM/yyyy') : (''),
          dob: dob ? dob.toDateObject('-') : (''),
          email: email ? email : '',
          valueGender: gender ? gender : 2,
          txGender: gender == 1 ? ('Nam') : ('Nữ'),
          isDataNull: isDataNull,
          status: 1
        })
        return
      }
    }
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
            imageProvider.upload(this.state.image.path, (s, e) => {
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
                  this.state.isDataNull ? snackbar.show(constants.msg.booking.create_profile_success, "success") : snackbar.show(constants.msg.booking.create_relatives_success, "success");


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
        imageProvider.upload(this.state.image.path, (s, e) => {
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
        title={this.state.isDataNull ? constants.booking.add_profile : constants.booking.add_relatives}
        titleStyle={{ marginRight: 0 }}
        isLoading={this.state.isLoading}
        backButton={
          <TouchableOpacity style={styles.btnCancel} onPress={() => this.props.navigation.pop()}>
            <Text style={styles.btnhuy}>{constants.actionSheet.cancel}</Text>
          </TouchableOpacity>
        }

        menuButton={
          <TouchableOpacity onPress={this.onUpdate}>
            <Text style={styles.btnmenu}>{constants.actionSheet.save}</Text>
          </TouchableOpacity>
        }

      >
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingVertical: 5 }}>
          <View style={styles.viewImgUpload}>
            <TouchableOpacity
              style={{ position: "relative", width: 70, marginTop: 20 }}
              onPress={this.selectImage.bind(this)}
            >
              <ImageLoad
                resizeMode="cover"
                imageStyle={{ borderRadius: 35 }}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={{
                  width: 70,
                  height: 70,
                  alignSelf: "center"
                }}
                placeholderSource={icSupport}
                style={{ width: 70, height: 70, alignSelf: "center" }}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={() => {
                  return (
                    <ScaleImage
                      resizeMode="cover"
                      source={icSupport}
                      width={70}
                      style={{ width: 70, height: 70, alignSelf: "center" }}
                    />
                  );
                }}
              />
              <ScaleImage
                source={require("@images/new/ic_account_add.png")}
                width={20}
                style={{ position: "absolute", bottom: 0, right: 0 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <Form ref={ref => (this.form = ref)} style={[{ flex: 1 }]}>
              <Field style={[styles.mucdichkham, { flex: 1 }, , Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                <Text style={styles.mdk}>{constants.fullname}</Text>
                <TextField
                  hideError={true}
                  onValidate={(valid, messages) => {
                    if (valid) {
                      this.setState({ nameError: "" });
                    } else {
                      this.setState({ nameError: messages });
                    }
                  }}
                  validate={{
                    rules: {
                      required: true,
                      minlength: 1,
                      maxlength: 255
                    },
                    messages: {
                      required: constants.msg.user.fullname_not_null,
                      maxlength:constants.msg.user.text_without_255,
                    }
                  }}
                  placeholder={constants.msg.user.input_name}
                  multiline={true}
                  inputStyle={[
                    styles.ktq,
                    { justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10, width: 200 }
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
              <Text style={[styles.errorStyle]}>{this.state.nameError}</Text>

              <TouchableOpacity
                style={[
                  styles.mucdichkham,
                  { marginTop: 20, justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 12 }
                ]}
                onPress={this.onShowGender}
              >
                <Text style={styles.mdk}>{constants.gender}</Text>
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

                style={[styles.mucdichkham, { justifyContent: 'center', alignItems: 'flex-end', flex: 1, paddingVertical: 12, borderTopWidth: 0, }]}
              >
                <Text style={styles.mdk}>{constants.dob}</Text>

                <TextField
                  // value={this.state.date || ""}
                  onPress={() =>
                    this.setState({ toggelDateTimePickerVisible: true })
                  }
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
                  onValidate={(valid, messages) => {
                    if (valid) {
                      this.setState({ nameError: "" });
                    } else {
                      messages ?
                        (this.setState({ valid: constants.msg.app.dob_must_lesser_150, isMin: false })) : (this.setState({ isMin: true }));
                    }
                  }}
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
                  style={{
                    flex: 1
                  }}
                />
                <ScaleImage
                  style={[styles.imgmdk, { marginBottom: 5, }]}
                  height={10}
                  source={require("@images/new/booking/ic_next.png")}
                />
              </Field>
              <Text style={[styles.errorStyle]}>{this.state.valid}</Text>
              <Field
                style={[styles.mucdichkham, { flex: 1, marginTop: 20 }, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}
              >
                <Text style={styles.mdk}>Email</Text>

                <TextField
                  hideError={true}
                  multiline={true}
                  onValidate={(valid, messages) => {
                    if (valid) {
                      this.setState({ emailError: "" });
                    } else {
                      this.setState({ emailError: messages });
                    }
                  }}
                  validate={{
                    rules: {
                      required: this.state.dob && this.state.dob.getAge() > 15 ? true : false,
                      email: this.state.dob ? true : true,
                      maxlength: 255,
                    },
                    messages: {
                      required:constants.msg.user.email_not_null,
                      email: constants.msg.user.email_does_not_exits,
                      maxlength: constants.msg.user

                    }
                  }}
                  placeholder={"Nhập email"}
                  inputStyle={[
                    styles.ktq,
                    { justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10, width: 200, }
                  ]}
                  errorStyle={styles.errorStyle}
                  onChangeText={this.onChangeText("email")}
                  value={this.state.email}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  // underlineColorAndroid="transparent"
                  autoCorrect={false}
                />
              </Field>
              <Text style={[styles.errorStyle]}>{this.state.isMin ? (constants.msg.user.email_apply_with_people_15_old) : (this.state.emailError)}</Text>
            </Form>
            <Text style={styles.textbot}>
             {constants.msg.user.email_apply_with_people_15_old}
          </Text>
          </View>


        </ScrollView>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
        <DateTimePicker
          isVisible={this.state.toggelDateTimePickerVisible}
          onConfirm={newDate => {
            this.setState(
              {
                dob: newDate,
                date: newDate.format("dd/MM/yyyy"),
                toggelDateTimePickerVisible: false
              },
              () => {
              }
            );
          }}
          onCancel={() => {
            this.setState({ toggelDateTimePickerVisible: false });
          }}
          date={new Date()}
          minimumDate={minDate}
          maximumDate={new Date()}
          cancelTextIOS={constants.actionSheet.cancel2}
          confirmTextIOS={constants.actionSheet.confirm}
          date={this.state.dob || new Date()}
        />
        <ActionSheet
          ref={o => this.actionSheetGender = o}
          options={[constants.actionSheet.male,constants.actionSheet.female,constants.actionSheet.cancel]}
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
    marginTop: 10,
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
export default connect(mapStateToProps)(createProfile);
