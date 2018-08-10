
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import client from '@utils/client-utils';


const defaultState = {
    userApp:
    {
        test: "ehehee",
        currentUser: {

        },
        isLogin: false,
        loginToken: ""
    }
}
const reducer = (state = defaultState, action) => {
    var newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case constants.action.create_navigation_global:
            newState.navigation = action.value;
            return newState;
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

export default reducer;