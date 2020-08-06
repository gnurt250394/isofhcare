import React, { Component } from "react";
import { Provider } from "react-redux";
import AppReducer from "@reducers";
import { AppContainer } from "@navigators/AppNavigator";
import NavigationService from "@navigators/NavigationService";
import { createStore, applyMiddleware, compose } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
const persistConfig = {
  key: 'persistKey',
  // keyPrefix: 'x', // the redux-persist default `persist:` doesn't work with some file systems
  storage: AsyncStorage,
};
const store = createStore(
  persistReducer(persistConfig, AppReducer),
  {},
  compose(applyMiddleware(thunk)),
);
store.__PERSISTOR = persistStore(store);

import codePush from "react-native-code-push";
// let codePushOptions = { updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE };
import { Alert } from 'react-native';
import snackbar from "@utils/snackbar-utils";
let codePushOptions = { 
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 15 * 60,
 };
// let codePushOptions = {installMode: codePush.InstallMode.IMMEDIATE };
import ReactNative, { Text, TextInput, Animated, StyleSheet } from 'react-native';
import codePushUtils from '@utils/codepush-utils';
import constants from '@resources/strings';
import fonts from '@resources/fonts';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.placeholderTextColor = "#BBB";
Animated.Text.defaultProps = TextInput.defaultProps || {};
Animated.Text.defaultProps.allowFontScaling = false;
import FlashMessage from "react-native-flash-message";
import SocketProvider from "@data-access/socket-provider";
import InputPhone from '@components/account/InputPhone'

import { MenuProvider } from 'react-native-popup-menu';

class Kernel extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.SetDefaultText()
  }

  componentDidMount() {
    if (constants.route != 'home') {
      // codePushUtils.checkupDate(true,true);

    }
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
  onBackdropPress = () => {
    this.setState({
      isVisible: false
    })
  }
  render() {
    const RootApp = AppContainer(constants.route)
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={store.__PERSISTOR}>
        <SocketProvider>
          {/* <Root> */}
          <MenuProvider>
          <RootApp ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
            screenProps={{ state: store.getState() }}
          />
          </MenuProvider>
          {/* </Root> */}
          </SocketProvider>
        </PersistGate>
        <FlashMessage floating={true} style={{ marginTop: 30 }} position="top" ref="myLocalFlashMessage" />
        <InputPhone></InputPhone>
      </Provider>
    )
  }
}
// export default Kernel;
export default codePush(codePushOptions)(Kernel);