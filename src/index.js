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
// let codePushOptions = { updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE };
import { Alert } from 'react-native';
import snackbar from "@utils/snackbar-utils";
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
// let codePushOptions = {installMode: codePush.InstallMode.IMMEDIATE };
import { Text, TextInput } from 'react-native';

let originalGetDefaultProps = Text.getDefaultProps;
Text.getDefaultProps = function() {
  return {
    ...originalGetDefaultProps(),
    allowFontScaling: false,
  };
}
let originalGetDefaultProps2 = TextInput.getDefaultProps;
TextInput.getDefaultProps = function() {
  return {
    ...originalGetDefaultProps2(),
    allowFontScaling: false,
  };
}

class Kernel extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    codePush.checkForUpdate().then(update => {
      if (update) {
        if (update.isMandatory) {
          Alert.alert(
            'THÔNG BÁO',
            'Ứng dụng đã có phiên bản mới. Bạn vui lòng cập nhật để có trải nghiệm tốt nhất!',
            [
              {
                text: 'Cập nhật', onPress: () => {
                  snackbar.show("Ứng dụng đang được cập nhật, vui lòng chờ", "success")
                  codePush.sync({
                    // updateDialog: true,
                    installMode: codePush.InstallMode.IMMEDIATE
                  });
                }
              },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            'THÔNG BÁO',
            'Ứng dụng đã có phiên bản mới. Bạn vui lòng cập nhật để có trải nghiệm tốt nhất!',
            [
              {
                text: 'Để sau',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Cập nhật', onPress: () => {
                  snackbar.show("Ứng dụng đang được cập nhật, vui lòng chờ", "success")
                  codePush.sync({
                    // updateDialog: true,
                    installMode: codePush.InstallMode.IMMEDIATE
                  });
                }
              },
            ],
            { cancelable: false },
          );
        }
      }
    })
  }
  render() {
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
// export default Kernel;
export default codePush(codePushOptions)(Kernel);