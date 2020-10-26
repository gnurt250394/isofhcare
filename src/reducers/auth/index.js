import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import client from '@utils/client-utils';

const defaultState = {
    userApp:
    {
        currentUser: {

        },
        isLogin: false,
        loginToken: ""
    },
    bookingTicket: {

    },
    ehealth: {

    },
    otpPhone: null,
    dataDrug: {},
}
const reducer = (state = defaultState, action) => {
    var newState = JSON.parse(JSON.stringify(state));
    newState.navigation = state.navigation;

    switch (action.type) {
        case constants.action.action_set_my_facility:
            if (!action.value || action.value.length == 0)
                newState.userApp.myFacility = [];
            else
                newState.userApp.myFacility = action.value;
            return newState;
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
            userProvider.isLogin = newState.userApp.currentUser && newState.userApp.currentUser.id;
            newState.userApp.loginToken = newState.userApp.currentUser ? newState.userApp.currentUser.loginToken ? newState.userApp.currentUser.loginToken : newState.userApp.currentUser.refreshToken : "";
            client.auth = newState.userApp.loginToken;
            newState.userApp.unReadNotificationCount = 0;
            return newState;
        case constants.action.action_user_logout:
            userProvider.logout(newState.userApp.currentUser ? newState.userApp.currentUser.id : "");
            newState.userApp.unReadNotificationCount = 0;
            newState.userApp.currentUser = {};
            newState.userApp.isLogin = false;
            userProvider.isLogin = false;
            newState.userApp.loginToken = "";
            client.auth = "";
            return newState;
        case constants.action.action_show_popup_notice_new_version:
            newState.showPopupNewVersion = true;
            return newState;
        case constants.action.action_select_hospital_get_ticket:
            newState.bookingTicket.hospital = action.value;
            return newState;
        case constants.action.action_select_hospital_ehealth:
            newState.ehealth.hospital = action.value;
            return newState;
        case constants.action.action_select_patient_group_ehealth:
            newState.ehealth.patient = action.value;
            return newState;
        case constants.action.action_otp_phone:
            newState.otpPhone = action.value
            return newState;
        case constants.action.action_add_drug:
            newState.dataDrug = action.value
            return newState
        case 'persist/REHYDRATE':
            if (action.payload && action.payload.auth && action.payload.auth.userApp && Object.keys(action.payload.auth.userApp).length) {
                newState = { ...action.payload.auth || {} };
                client.auth = newState.userApp.loginToken;
                newState.userApp.unReadNotificationCount = 0;
                return newState;
            }
    }
    return newState;
}

export default reducer;