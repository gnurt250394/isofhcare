import React, { Component } from "react";
import { Provider } from "react-redux";
import { Root } from "native-base";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import appProvider from "@data-access/app-provider";
import AppReducer from "@reducers";
import { RootNavigator } from "@navigators/AppNavigator";
// import { NavigationActions, StackActions } from "react-navigation";
// import userProvider from '@data-access/user-provider'
import NavigationService from "@navigators/NavigationService";

const store = createStore(AppReducer, applyMiddleware(thunk));
import codePush from "react-native-code-push";
let codePushOptions = { updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE };
class Kernel extends Component
{
  render()
  {
    return (
      <Provider store={store}>
        <Root>
          <RootNavigator ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }} />
        </Root>
    
      </Provider>
    )
  }
}
export default codePush(codePushOptions)(Kernel);