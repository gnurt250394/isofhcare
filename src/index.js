import React, { Component } from "react";
import { Provider } from "react-redux";
import { Root } from "native-base";
import { MenuProvider } from "react-native-popup-menu";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import UserInactivity from "react-native-user-inactivity";
import appProvider from "@data-access/app-provider";
import AppReducer from "@reducers";
import { RootNavigator } from "@navigators/AppNavigator";
import { NavigationActions, StackActions } from "react-navigation";
import userProvider from '@data-access/user-provider'
import NavigationService from "@navigators/NavigationService";

const store = createStore(AppReducer, applyMiddleware(thunk));

class ActivityPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onAction: true
    };
  }
  onAction = onAction => {
    if (!onAction) {
      NavigationService.navigate('login',{
        isLogin:true
      })
    }
  };
  
  render() {
    return (
      <Provider store={store}>
      {/* <UserInactivity timeForInactivity={1000*180} onAction={this.onAction}> */}
        <Root>
            <RootNavigator ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }} />
        </Root>
        {/* </UserInactivity> */}

      </Provider>
    );
  }
}
export default ActivityPanel;
