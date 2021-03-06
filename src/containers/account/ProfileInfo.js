import React, { Component, PropTypes, PureComponent } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from "mainam-react-native-select-image";
import imageProvider from "@data-access/image-provider";
import ImageLoad from "mainam-react-native-image-loader";
import connectionUtils from "@utils/connection-utils";
import snackbar from "@utils/snackbar-utils";
import medicalRecordProvider from "@data-access/medical-record-provider";
import NavigationService from "@navigators/NavigationService";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import dateUtils from "mainam-react-native-date-utils";
import profileProvider from "@data-access/profile-provider"
import constants from "@resources/strings";

class ProfileInfo extends Component {
  constructor() {
    super();
    this.state = {
      avatar: '',
      email: '',
      username: '',
      phone: '',
      dob: '',
      medicalRecords: []
    };
  }
  componentDidMount() {
    let id = this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : this.props.userApp.currentUser.id
    profileProvider.getUserInfo(id).then(res => {
      if (res.code == 0) {
        this.setState({
          avatar: res.data.user.avatar,
          email: res.data.user.email,
          username: res.data.user.username,
          phone: res.data.user.phone,
          medicalRecords: res.data.medicalRecords,
          gender: res.data.user.gender,
          dob: res.data.user.dob
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const icSupport = require("@images/new/user.png");
    const source = this.state.avatar
      ? { uri: this.state.avatar.absoluteUrl() }
      : icSupport;

    return (
      <ActivityPanel
        title={constants.title.profile}
        isLoading={this.state.isLoading}>
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled">
          {this.state.username ?
            <View>
              <View style={styles.viewImgUpload}>
                <View
                  style={styles.containerAvatar}
                >
                  <ImageLoad
                    resizeMode="cover"
                    imageStyle={styles.borderImage}
                    borderRadius={35}
                    customImagePlaceholderDefaultStyle={styles.image}
                    placeholderSource={icSupport}
                    style={styles.image}
                    resizeMode="cover"
                    loadingStyle={{ size: "small", color: "gray" }}
                    source={source}
                    defaultImage={() => {
                      return (
                        <ScaleImage
                          resizeMode="cover"
                          source={icSupport}
                          width={70}
                          style={styles.image}
                        />
                      );
                    }}
                  />
                </View>
              </View>
              <View style={styles.containerName}>
                <Text style={styles.txtUsername}>{this.state.username ? this.state.username : ''}</Text>
                <Text style={styles.txtPhone}>{this.state.phone ? this.state.phone : ''}</Text>
                {/* <Text style={{ marginTop: 15 }}>{this.state.medicalRecords ? `${this.state.medicalRecords.length} ` : '0 '}l?????t s??? d???ng d???ch v???</Text> */}
              </View>
              <View style={styles.container}>
                <Form ref={ref => (this.form = ref)} style={[styles.flex]}>
                  <Text style={[styles.errorStyle]}>{this.state.nameError}</Text>

                  <View
                    style={[
                      styles.mucdichkham,
                      styles.gender
                    ]}
                  >
                    <Text style={styles.mdk}>{constants.gender}</Text>
                    <Text style={styles.ktq}>
                      {this.state.gender && this.state.gender == 1
                        ? 'Nam'
                        : 'N???'}
                    </Text>

                  </View>

                  <Field

                    style={[styles.mucdichkham, styles.containerGender]}
                  >
                    <Text style={styles.mdk}>{constants.dob}</Text>

                    <Text style={styles.ktq}> {this.state.dob ? this.state.dob.toDateObject('-').format('dd-MM-yyyy') : ('')}
                    </Text>
                  </Field>
                  <Field
                    style={[styles.mucdichkham, styles.flex]}
                  >
                    <Text style={styles.mdk}>{constants.email}</Text>
                    <TextField
                      hideError={true}
                      editable={false}
                      multiline={true}
                      inputStyle={[
                        styles.ktq,
                        Platform.OS == "ios" ? { paddingVertical: 12, } : {},
                        styles.inputEmail
                      ]}
                      value={this.state.email}
                    // underlineColorAndroid="transparent"
                    />
                  </Field>
                </Form>
              </View>
            </View>
            : null}


        </ScrollView>
      </ActivityPanel>
    );
  }
  onShowGender = () => {
    this.setState({
      isGender: true
    });
  };
  showLoading(loading, callback) {
    if (this.props.showLoading) {
      this.props.showLoading(loading, callback);
    } else {
      callback;
    }
  }
  onSetGender = item => {
    this.setState({
      isGender: false,
      txGender: item.gender,
      valueGender: item.value
    });
  };

  selectImage() {
    connectionUtils
      .isConnected()
      .then(s => {
        if (this.imagePicker) {
          this.imagePicker.open(false, 200, 200, image => {
            setTimeout(() => {
              Keyboard.dismiss();
            }, 500);
            this.setState({
              image
            });
            imageProvider.upload(this.state.image.path, this.state.image.mime, (s, e) => {
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
            let date = this.state.dob ? this.state.dob.format('yyyy-MM-dd') : ('')
            let date2 = date + ' 00:00:00'
            medicalRecordProvider
              .createMedical(name, gender, date2, email, image)
              .then(res => {
                if (res.code == 0) {
                  this.setState({
                    isLoading: false
                  });
                  this.state.isDataNull ? snackbar.show("B???n ???? t???o h??? s?? th??nh c??ng", "success") : snackbar.show("B???n ???? th??m ng?????i th??n th??nh c??ng", "success");


                  NavigationService.navigate('selectProfile', { loading: true });
                } if (res.code == 2) {
                  this.setState({
                    isLoading: false
                  });
                  this.state.isDataNull ? snackbar.show("H??? s?? ???? t???n t???i trong h??? th???ng", 'danger') : snackbar.show("H??? s?? ???? t???n t???i trong h??? th???ng", 'danger')
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
                snackbar.show("C?? l???i, xin vui l??ng th??? l???i", "danger");
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
        imageProvider.upload(this.state.image.path, this.state.image.mime, (s, e) => {
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
}

const styles = StyleSheet.create({
  inputEmail: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 200,
  },
  containerGender: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 0
  },
  gender: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 12,
    borderBottomWidth: 0
  },
  flex: { flex: 1 },
  txtPhone: {
    color: 'rgb(2,195,154)',
    marginVertical: 5
  },
  txtUsername: {
    fontSize: 18,
    color: '#000'
  },
  containerName: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  image: {
    width: 70,
    height: 70,
    alignSelf: "center"
  },
  borderImage: {
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)'
  },
  containerAvatar: {
    position: "relative",
    width: 70,
    marginTop: 20,
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
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: "#8e8e93",
    marginRight: 10,
    marginLeft: 20
  },
  container: {
    // borderStyle: "solid",
    marginVertical: 5,
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
    marginLeft: 12
  },
  textInputStyle: {
    color: "#53657B",
    height: 45,
  },
  labelStyle: { color: '#53657B', fontSize: 16, marginBottom: 10, marginLeft: 50 }
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(ProfileInfo);
