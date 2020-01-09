import React, { Component } from "react";
import { Provider } from "react-redux";
// import { Root } from "native-base";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import appProvider from "@data-access/app-provider";
import AppReducer from "@reducers";
import { AppContainer } from "@navigators/AppNavigator";
// import { NavigationActions, StackActions } from "react-navigation";
// import userProvider from '@data-access/user-provider'
import NavigationService from "@navigators/NavigationService";

const store = createStore(AppReducer, applyMiddleware(thunk));
import codePush from "react-native-code-push";
// let codePushOptions = { updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE };
import { Alert } from 'react-native';
import snackbar from "@utils/snackbar-utils";
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
// let codePushOptions = {installMode: codePush.InstallMode.IMMEDIATE };
import ReactNative, { Text, TextInput, Animated, StyleSheet } from 'react-native';
import codePushUtils from '@utils/codepush-utils';
import fonts from '@resources/fonts';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
Animated.Text.defaultProps = TextInput.defaultProps || {};
Animated.Text.defaultProps.allowFontScaling = false;
import FlashMessage from "react-native-flash-message";


class Kernel extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.SetDefaultText()
  }

  componentDidMount() {
    // codePushUtils.checkupDate(true);
  }
  SetDefaultText = () => {
    let components = [Text, TextInput]
    for (let i = 0; i < components.length; i++) {
      const TextRender = components[i].render;
      components[i].render = function (...args) {
        let origin = TextRender.call(this, ...args);
        if (origin.props && origin.props.style && origin.props.style.fontWeight) {
          fontFamily = fonts[`${origin.props.style.fontWeight}`]
          return React.cloneElement(origin, {
            style: StyleSheet.flatten([origin.props.style, { fontFamily: fonts[`${origin.props.style.fontWeight}`], fontWeight: undefined }])
          });
        }
        return React.cloneElement(origin, {
          style: StyleSheet.flatten([origin.props.style, { fontFamily: fonts['500'] }])
        });
      };
    }
  }
  render() {
    return (
      <Provider store={store}>
        {/* <Root> */}
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
          screenProps={{ state: store.getState() }}
        />
        {/* </Root> */}
        <FlashMessage floating={true} style={{ marginTop: 30 }} position="top" ref="myLocalFlashMessage" />
      </Provider>
    )
  }
}
// export default Kernel;
export default codePush(codePushOptions)(Kernel);