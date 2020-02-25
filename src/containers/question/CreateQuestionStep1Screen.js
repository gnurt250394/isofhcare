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
  componentWillUnmount() {
    dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_INFO, '');

  }
  onValueChange = () => {
    this.setState({ changed: true });
  }
  onChangeText = (state) => (value) => {
    this.setState({ [state]: value })
  }
  onValidateAge = (valid, messages) => {
    if (valid) {
      this.setState({ ageError: "" });
    }
    else {
      this.setState({ ageError: messages });
    }
  }
  setGender = (gender) => () => {
    this.setState({ gender, changed: true });
  }
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        title={constants.title.content}
        showFullScreen={true}
        isLoading={this.state.isLoading}
        titleStyle={{
          color: '#FFF'
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
        // keyboardDismissMode='on-drag' 
        >
          <View style={styles.backgroundHeader}></View>
          <View style={styles.containerCard}>
            <Card style={styles.card}>
              <View style={styles.minus}></View>
              <Form
                ref={ref => (this.form = ref)}
                onValueChange={this.onValueChange}
              >
                <Text style={[styles.label, { marginTop: 24 }]}>
                  {constants.title.content}
                </Text>
                <TextField
                  validate={{
                    rules: {
                      required: true,
                      minlength: 1,
                      maxlength: 2000
                    },
                    messages: {
                      required: constants.msg.question.please_input_content,
                      maxlength: constants.msg.question.not_allow_2000_keyword
                    }
                  }}
                  inputStyle={[styles.textinput, styles.inputContent]}
                  errorStyle={styles.errorStyle}
                  onChangeText={this.onChangeText('content')}
                  value={this.state.content}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  underlineColorAndroid="transparent"
                  autoFocus={true}
                  multiline={true}
                  autoCorrect={false}
                />
                <Field style={styles.fieldAge}>
                  <Field>
                    <Text style={[styles.label]}>{constants.questions.age}</Text>
                    <TextField
                      hideError={true}
                      validate={{
                        rules: {
                          min: 1,
                          max: 150,
                          number: true
                        },
                        messages: {
                          min: constants.msg.question.age_greater_than_1,
                          max: constants.msg.question.age_less_than_150,
                          number: constants.msg.question.invalid_age
                        }
                      }}
                      value={this.state.age}
                      style={{ marginTop: 6 }}
                      inputStyle={[styles.textinput, { paddingBottom: Platform.OS == 'ios' ? 8 : 8, }, styles.inputAge]}
                      onChangeText={this.onChangeText('age')}
                      onValidate={this.onValidateAge}
                      returnKeyType={"next"}
                      keyboardType="numeric"
                      errorStyle={styles.errorStyle}
                    />
                  </Field>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.label]}>{constants.gender}</Text>
                    <View style={styles.row}>
                      <TouchableOpacity
                        onPress={this.setGender(1)}
                        style={styles.buttonGender}
                      >
                        <View style={styles.borderSelected}>
                          {
                            this.state.gender == 1 && <View style={styles.selected}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>{constants.actionSheet.male}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={this.setGender(0)}
                        style={styles.buttonGender}
                      >
                        <View style={styles.borderSelected}>
                          {
                            this.state.gender == 0 && <View style={styles.selected}></View>
                          }
                        </View>
                        <Text style={{ marginLeft: 5 }}>{constants.actionSheet.female}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Field>
              </Form>
              <Text style={[styles.errorStyle]}>{this.state.ageError}</Text>

              <TouchableOpacity
                disabled={!this.state.changed}
                onPress={this.createQuestion.bind(this)}
                style={[styles.buttonInfo, { backgroundColor: this.state.changed ? "#58bc91" : "#cacaca", }]}
              >
                <Text style={styles.txtInfo}>{constants.questions.info_complementary}</Text>
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
  txtInfo: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },
  buttonInfo: {
    width: 250,
    padding: 15,
    borderRadius: 6,
    alignSelf: "center",
    margin: 36
  },
  buttonGender: {
    padding: 10,
    flexDirection: "row"
  },
  selected: {
    width: 12,
    height: 12,
    backgroundColor: '#02C39A',
    borderRadius: 6
  },
  borderSelected: {
    width: 19,
    height: 19,
    borderWidth: 2,
    borderColor: '#02C39A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: { flexDirection: "row" },
  inputAge: {
    width: 100,
    paddingTop: 10,
    paddingLeft: 17,
    paddingRight: 17,
    fontWeight: '600'
  },
  fieldAge: {
    flexDirection: 'row',
    marginTop: 15
  },
  inputContent: {
    lineHeight: 20,
    marginTop: 6,
    height: 150,
    borderRadius: 6,
    textAlignVertical: 'top',
    paddingTop: 13,
    paddingLeft: 10,
    paddingBottom: 13,
    paddingRight: 10
  },
  minus: {
    backgroundColor: '#02C39A',
    width: 20,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center'
  },
  card: { padding: 22 },
  containerCard: {
    margin: 22,
    marginTop: 10
  },
  backgroundHeader: {
    backgroundColor: '#02C39A',
    height: 130,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  scroll: {
    flex: 1,
    position: 'relative'
  },
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
    borderRadius: 6,
    color:'#000'
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
