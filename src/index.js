import React, { Component } from "react";
import { Provider } from "react-redux";
import { Root } from "native-base";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import UserInactivity from "react-native-user-inactivity";
// import appProvider from "@data-access/app-provider";
import AppReducer from "@reducers";
import { RootNavigator } from "@navigators/AppNavigator";
// import { NavigationActions, StackActions } from "react-navigation";
// import userProvider from '@data-access/user-provider'
import NavigationService from "@navigators/NavigationService";

const store = createStore(AppReducer, applyMiddleware(thunk));

const Kernel = () => (
  <Provider store={store}>
    {/* <UserInactivity timeForInactivity={1000*180} onAction={this.onAction}> */}
    <Root>
      <RootNavigator ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />
    </Root>
    {/* </UserInactivity> */}

  </Provider>
)
export default Kernel
