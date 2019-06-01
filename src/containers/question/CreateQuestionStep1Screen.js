import React, { Component, PropTypes } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { Card } from 'native-base';
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import constants from "@resources/strings";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import dataCacheProvider from '@data-access/datacache-provider';
import Field from "mainam-react-native-form-validate/Field";

const padding = Platform.select({
  ios: 7,
  android: 2
});
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
      gender: 1,
      age: ""
    };
  }
  componentDidMount() {
    dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_POSTS, (s, e) => {
      if (s && s.post) {
        this.setState({
          gender: s.post.gender ? 1 : 0,
          age: s.post.age && s.post.age != 0 ? (s.post.age + "") : ""
          // ,content: s.post.content || ""
        })
      }
    })
  }

  createQuestion() {
    if (!this.form.isValid()) {
      return;
    }
    this.props.navigation.navigate("createQuestionStep2", {
      post: {
        gender: this.state.gender,
        content: this.state.content,
        age: this.state.age || 0
      }
    });
  }
componentWillUnmount(){
  dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_INFO, '');

}
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        title={"Nội dung"}
        showFullScreen={true}
        isLoading={this.state.isLoading}
        iosBarStyle={'light-content'}
        statusbarBackgroundColor="#02C39A"
        actionbarStyle={{
          backgroundColor: '#02C39A',
          borderBottomWidth: 0
        }}
        titleStyle={{
          color: '#FFF'
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={{ flex: 1, position: 'relative' }}
          keyboardShouldPersistTaps="handled"
        // keyboardDismissMode='on-drag' 
        >
          <View style={{ backgroundColor: '#02C39A', height: 130, position: 'absolute', top: 0, left: 0, right: 0 }}></View>
          <View style={{ margin: 22, marginTop: 10 }}>
            <Card style={{ padding: 22 }}>
              <View style={{ backgroundColor: '#02C39A', width: 20, height: 4, borderRadius: 2, alignSelf: 'center' }}></View>
              <Form
                ref={ref => (this.form = ref)}
                onValueChange={() => {
                  this.setState({ changed: true });
                }}
              >
                <Text style={[styles.label, { marginTop: 24 }]}>
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
                  inputStyle={[styles.textinput, { lineHeight: 20, marginTop: 6, height: 150, borderRadius: 6, textAlignVertical: 'top', paddingTop: 13, paddingLeft: 10, paddingBottom: 13, paddingRight: 10 }]}
                  errorStyle={styles.errorStyle}
                  onChangeText={s => {
                    this.setState({ content: s });
                  }}
                  value={this.state.content}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  underlineColorAndroid="transparent"
                  autoFocus={true}
                  multiline={true}
                  autoCorrect={false}
                />
                <Field style={{ flexDirection: 'row', marginTop: 15 }}>
                  <Field>
                    <Text style={[styles.label]}>Tuổi</Text>
                    <TextField
                      hideError={true}
                      validate={{
                        rules: {
                          min: 1,
                          max: 150,
                          number: true
                        },
                        messages: {
                          min: "Tuổi bệnh nhân cần lớn hơn 1",
                          max: "Tuổi bệnh nhân cần nhỏ hơn 150",
                          number: "Tuổi không hợp lệ"
                        }
                      }}
                      value={this.state.age}
                      style={{ marginTop: 6 }}
                      inputStyle={[styles.textinput, { width: 100, paddingTop: 10, paddingLeft: 17, paddingRight: 17, paddingBottom: Platform.OS == 'ios' ? 8 : 8, fontWeight: '600' }]}
                      onChangeText={s => {
                        this.setState({ age: s });
                      }}
                      onValidate={(valid, messages) => {
                        if (valid) {
                          this.setState({ ageError: "" });
                        }
                        else {
                          this.setState({ ageError: messages });
                        }
                      }}
                      returnKeyType={"next"}
                      keyboardType="numeric"
                      errorStyle={styles.errorStyle}
                    />
                  </Field>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.label]}>Giới tính</Text>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ gender: 1, changed: true });
                        }}
                        style={{ padding: 10, flexDirection: "row" }}
                      >
                        <View style={{ width: 19, height: 19, borderWidth: 2, borderColor: '#02C39A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                          {
                            this.state.gender == 1 && <View style={{ width: 12, height: 12, backgroundColor: '#02C39A', borderRadius: 6 }}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>Nam</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ gender: 0, changed: true });
                        }}
                        style={{ padding: 10, flexDirection: "row" }}
                      >
                        <View style={{ width: 19, height: 19, borderWidth: 2, borderColor: '#02C39A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                          {
                            this.state.gender == 0 && <View style={{ width: 12, height: 12, backgroundColor: '#02C39A', borderRadius: 6 }}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>Nữ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Field>
              </Form>
              <Text style={[styles.errorStyle]}>{this.state.ageError}</Text>

              <TouchableOpacity
                disabled={!this.state.changed}
                onPress={this.createQuestion.bind(this)}
                style={{
                  width: 250,
                  backgroundColor: this.state.changed ? "#58bc91" : "#cacaca",
                  padding: 15,
                  borderRadius: 6,
                  alignSelf: "center",
                  margin: 36
                }}
              >
                <Text
                  style={{ color: "#FFF", textAlign: "center", fontWeight: "bold", fontSize: 16 }}
                >
                  Thông tin bổ sung
          </Text>
              </TouchableOpacity>
            </Card>
          </View>
        </ScrollView>
        {Platform.OS == "ios" && <KeyboardSpacer />}
      </ActivityPanel >
    );
  }
}
const styles = StyleSheet.create({
  label: {
    color: '#00000048', marginLeft: 9
  },
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
    padding: padding,
    borderRadius: 6
  },
  errorStyle: {
    color: 'red',
    marginTop: 10,
    marginLeft: 6
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(CreateQuestionStep1Screen);
