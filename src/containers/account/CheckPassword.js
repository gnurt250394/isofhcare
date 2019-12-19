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
  getComponent = (value, onChangeText, onFocus, onBlur, placeholderTextColor) => {
    return (
      <FloatingLabel
        placeholderStyle={styles.placeFloat}
        placeholderTextColor='#000'
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
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer]}>
          <Text style={styles.enterPass}>{constants.enter_password}</Text>
          <Form style={styles.form} ref={ref => (this.form = ref)}>
            <Field clearWhenFocus={true}>
              <TextField
                getComponent={this.getComponent}
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
                placeholder={constants.enter_password}
                autoCapitalize={"none"}
              />
            </Field>
            <View style={styles.containerButton}>
              <TouchableOpacity
                onPress={this.props.onCancelClick}
                style={styles.button}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[{ color: "rgb(2,195,154)" }, styles.txtButton]}
                >Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.onSetFinger} style={[styles.button, { backgroundColor: "rgb(2,195,154)", }]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[{ color: "#fff" }, styles.txtButton]}
                >{constants.actionSheet.ok}</Text>
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
  txtButton: {

    paddingRight: 5,
    fontSize: 14
  },
  button: {
    alignItems: "center",
    justifyContent: 'center',
    flex: 1,
    width: 90,
    height: 35,
    marginHorizontal: 10,
    borderRadius: 5
  },
  containerButton: {
    flexDirection: "row",
    marginVertical: 40,
    justifyContent: 'space-around',
    backgroundColor: "#fff"
  },
  placeFloat: {
    fontSize: 16,
    fontWeight: "300"
  },
  form: { width: '60%', },
  enterPass: {
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
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
    color: "#000",
    fontWeight: "300",
    height: 45,
    marginLeft: 0,
    fontSize: 20
  },
  input: {
    maxWidth: 300,
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
