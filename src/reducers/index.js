import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { RootNavigator } from '../navigators/AppNavigator';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import client from '@utils/client-utils';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = RootNavigator.router.getActionForPathAndParams('splash');
const tempNavState = RootNavigator.router.getStateForAction(firstAction);
const secondAction = RootNavigator.router.getActionForPathAndParams('login');


const initialNavState = RootNavigator.router.getStateForAction(
  secondAction,
  tempNavState
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    // case 'Login':
    //   nextState = RootNavigator.router.getStateForAction(
    //     NavigationActions.back(),
    //     state
    //   );
    //   break;
    // case 'Logout':
    //   nextState = RootNavigator.router.getStateForAction(
    //     NavigationActions.navigate({ routeName: 'Login' }),
    //     state
    //   );
    //   break;
    // default:
    //   nextState = RootNavigator.router.getStateForAction(action, state);
    //   break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const defaultState = {
    userApp:
    {
        currentUser: {

        },
        isLogin: false,
        loginToken: ""
    }
}
const reducer = (state = defaultState, action) => {
    var newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {       
        case constants.action.action_change_notification_count:
            var value = "";
            if (parseInt(action.value) <= 0) {
                value = 0;
            }
            else {
                value = action.value;
            }
            newState.userApp.unReadNotificationCount = value;
            return newState;        
        case constants.action.action_user_login:
            newState.userApp.currentUser = action.value;
            newState.userApp.isLogin = newState.userApp.currentUser && newState.userApp.currentUser.id;
            newState.userApp.loginToken = newState.userApp.currentUser ? newState.userApp.currentUser.loginToken : "";
            client.auth = newState.userApp.loginToken;
            newState.userApp.unReadNotificationCount = 0;
            return newState;
        case constants.action.action_user_logout:
            userProvider.logout();
            newState.userApp.unReadNotificationCount = 0;
            newState.userApp.currentUser = {};
            newState.userApp.isLogin = false;
            newState.userApp.loginToken = "";
            client.auth = "";
            return newState;
        case constants.action.action_show_popup_notice_new_version:
            newState.showPopupNewVersion = true;
            return newState;
    }
    return state;
}


const AppReducer = combineReducers({
  nav,
  reducer,
});

export default AppReducer;