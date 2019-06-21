import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from "mainam-react-native-floating-label";
import constants from "@resources/strings";
import { Card, Item, Label, Input } from "native-base";

export default class CheckPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer]}>
        <Text style = {{marginVertical:10,fontSize:20,fontWeight:'bold'}}>{constants.enter_password}</Text>
          <Form style ={{width:'60%',}} ref={ref => (this.form = ref)}>
            <Field clearWhenFocus={true}>
              <TextField
                getComponent={(
                  value,
                  onChangeText,
                  onFocus,
                  onBlur,
                  isError
                ) => (
                  <FloatingLabel
                    placeholderStyle={{
                      fontSize: 16,
                      fontWeight: "200"
                    }}
                    value={value}
                    underlineColor={"#02C39A"}
                    inputStyle={styles.textInputStyle}
                    labelStyle={styles.labelStyle}
                    placeholder={constants.password}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    secureTextEntry={true}
                  />
                )}
                onChangeText={this.props.onChangeText}
                errorStyle={styles.errorStyle}
                validate={{
                  rules: {
                    required: true
                  },
                  messages: {
                    required: constants.password_not_null
                  }
                }}
                inputStyle={styles.input}
                placeholder={"Nhập mật khẩu"}
                autoCapitalize={"none"}
              />
            </Field>
            <View style={{ flexDirection: "row", marginVertical: 40,justifyContent:'space-around',backgroundColor:"#fff" }}>
              <TouchableOpacity
                onPress={this.props.onCancelClick}
                style={{ alignItems: "center", justifyContent:'center',flex: 1,width:90,height:35 ,marginHorizontal:10,borderRadius:5}}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: "#rgb(2,195,154)",
                    paddingRight: 5,
                    fontSize: 14
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress ={this.props.onSetFinger} style={{borderRadius:5, alignItems: "center",justifyContent:'center', flex: 1,width:90,height:35,backgroundColor:"rgb(2,195,154)",marginHorizontal:10 }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: "#fff",
                    paddingRight: 5,
                    fontSize: 14
                  }}
                >
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </Form>
          </View>
        </View>
    );
  }

}
const DEVICE_WIDTH = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // backgroundColor: "#858585",
    flex: 1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  errorStyle: {
    color: "red",
    marginTop: 10
  },
  contentContainer: {
    flexDirection: "column",
    width: DEVICE_WIDTH * 0.8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#ffffff"
  },
  logo: {
    marginVertical: 45
  },
  heading: {
    textAlign: "center",
    color: "#rgb(2,195,154)",
    fontSize: 21,
    marginVertical: 10
  },
  description: {
    textAlign: "center",
    height: 65,
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20
  },
  buttonContainer: {
    padding: 20
  },
  buttonText: {
    color: "#rgb(2,195,154)",
    fontSize: 15,
    fontWeight: "bold"
  },
  textInputStyle: {
    color: "#53657B",
    fontWeight: "600",
    height: 45,
    marginLeft: 0,
    fontSize: 20
  },
  input: {
      maxWidth:300,
    paddingRight: 30,
    backgroundColor: "#FFF",
    width: DEVICE_WIDTH - 40,
    height: 42,
    marginHorizontal: 10,
    paddingLeft: 15,
    borderRadius: 6,
    color: "#006ac6",
    borderWidth: 1,
    borderColor: "rgba(155,155,155,0.7)"
  },
  labelStyle: { paddingTop: 10, color: "#53657B", fontSize: 16 }
});
