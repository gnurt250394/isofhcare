import React, { Component, PropTypes } from "react";
import Dimensions from "Dimensions";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Switch,
  Keyboard,
  Image
} from "react-native";
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from "mainam-react-native-select-image";
import imageProvider from "@data-access/image-provider";
import snackbar from "@utils/snackbar-utils";
import questionProvider from "@data-access/question-provider";
import constants from "@resources/strings";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
const padding = Platform.select({
  ios: 7,
  android: 2
});

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
class CreateQuestionStep1Screen extends Component {
  constructor(props) {
    super(props);
    let post = this.props.navigation.getParam("post", null);
    if (post != null && post.post) {
      post = post.post;
    } else {
      post = null;
    }
    this.state = {
      imageUris: [],
      post: post,
      title: post ? post.title : "",
      content: post ? post.content : "",
      isPrivate: post ? post.isPrivate == 1 : false,
      btnSend: post ? "Lưu" : "Gửi",
      gender: 1
    };
  }

  removeImage(index) {
    var imageUris = this.state.imageUris;
    imageUris.splice(index, 1);
    this.setState({ imageUris });
  }
  selectImage() {
    if (this.imagePicker) {
      this.imagePicker.open(false, 200, 200, image => {
        setTimeout(() => {
          Keyboard.dismiss();
        }, 500);
        let imageUris = this.state.imageUris;
        let temp = null;
        imageUris.forEach(item => {
          if (item.uri == image.path) temp = item;
        });
        if (!temp) {
          imageUris.push({ uri: image.path, loading: true });
          imageProvider.upload(image.path, (s, e) => {
            if (s.success) {
              if (
                s.data.code == 0 &&
                s.data.data &&
                s.data.data.images &&
                s.data.data.images.length > 0
              ) {
                let imageUris = this.state.imageUris;
                imageUris.forEach(item => {
                  if (item.uri == s.uri) {
                    item.loading = false;
                    item.url = s.data.data.images[0].image;
                    item.thumbnail = s.data.data.images[0].thumbnail;
                  }
                });
                this.setState({
                  imageUris
                });
              }
            } else {
              imageUris.forEach(item => {
                if (item.uri == s.uri) {
                  item.error = true;
                }
              });
            }
          });
        }
        this.setState({ imageUris: [...imageUris] });
      });
    }
  }
  createQuestion() {
    if (!this.form.isValid()) {
      return;
    }
    this.props.navigation.navigate("createQuestionStep2", {
      post: {
        gender: this.state.gender,
        content: this.state.content,
        age: this.state.age
      }
    });
  }

  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        title={this.state.post ? "Chỉnh sửa" : "Đặt câu hỏi"}
        showFullScreen={true}
        touchToDismiss={true}
        isLoading={this.state.isLoading}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
          <View style={{ padding: 10 }}>
            <Form
              ref={ref => (this.form = ref)}
              onValueChange={() => {
                this.setState({ changed: true });
              }}
            >
              <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                Nội dung
              </Text>
              <TextField
                validate={{
                  rules: {
                    required: true,
                    minlength: 1,
                    maxlength: 2000
                  },
                  messages: {
                    required: "Vui lòng nhập nội dung câu hỏi",
                    maxlength: "Không cho phép nhập quá 2000 kí tự"
                  }
                }}
                inputStyle={[styles.textinput, { marginTop: 10, height: 150 }]}
                onChangeText={s => {
                  this.setState({ content: s });
                }}
                autoCapitalize={"none"}
                returnKeyType={"next"}
                underlineColorAndroid="transparent"
                autoFocus={true}
                multiline={true}
                autoCorrect={false}
              />

              <Form>
                <Text style={{ marginTop: 10, fontWeight: "bold" }}>Tuổi</Text>
                <TextField
                  validate={{
                    rules: {
                      min: 1,
                      max: 150
                    },
                    messages: {
                      min: "Tuổi bệnh nhân cần lớn hơn 1",
                      max: "Tuổi bệnh nhân cần nhỏ hơn 150"
                    }
                  }}
                  inputStyle={[styles.textinput, { marginTop: 10 }]}
                  onChangeText={s => {
                    this.setState({ age: s });
                  }}
                  returnKeyType={"next"}
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                />
              </Form>
            </Form>
            <View
              style={{
                paddingLeft: 30,
                width: DEVICE_WIDTH - 40,
                marginTop: 10
              }}
            >
              <Text>Giới tính</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ gender: 1, changed: true });
                  }}
                  style={{ padding: 10, flexDirection: "row" }}
                >
                  {this.state.gender == 1 ? (
                    <ScaleImage
                      source={require("@images/ic_radio1.png")}
                      width={20}
                    />
                  ) : (
                    <ScaleImage
                      source={require("@images/ic_radio0.png")}
                      width={20}
                    />
                  )}
                  <Text style={{ marginLeft: 5 }}>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ gender: 0, changed: true });
                  }}
                  style={{ padding: 10, flexDirection: "row" }}
                >
                  {this.state.gender == 0 ? (
                    <ScaleImage
                      source={require("@images/ic_radio1.png")}
                      width={20}
                    />
                  ) : (
                    <ScaleImage
                      source={require("@images/ic_radio0.png")}
                      width={20}
                    />
                  )}
                  <Text style={{ marginLeft: 5 }}>Nữ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          disabled={!this.state.change}
          onPress={this.createQuestion.bind(this)}
          style={{
            width: 200,
            backgroundColor: this.state.changed ? "#58bc91" : "#cacaca",
            padding: 15,
            borderRadius: 25,
            alignSelf: "center",
            margin: 10
          }}
        >
          <Text
            style={{ color: "#FFF", textAlign: "center", fontWeight: "bold" }}
          >
            THÔNG TIN BỔ SUNG
          </Text>
        </TouchableOpacity>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
        {Platform.OS == "ios" && <KeyboardSpacer />}
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    borderColor: "#cacaca",
    borderWidth: 1,
    padding: 7
  },
  textinput: {
    borderColor: "#cacaca",
    borderWidth: 1,
    paddingLeft: 7,
    padding: padding
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(CreateQuestionStep1Screen);
