import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import client from '@utils/client-utils';
import reduxBookingDHY from '@dhy/redux'
import reduxEhealthDHY from '@ehealth/daihocy/redux'
import { connect } from "react-redux";

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

    }
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
            newState.userApp.loginToken = newState.userApp.currentUser ? newState.userApp.currentUser.loginToken : "";
            client.auth = newState.userApp.loginToken;
            newState.userApp.unReadNotificationCount = 0;
            return newState;
        case constants.action.action_user_logout:
            userProvider.logout(newState.userApp.currentUser ? newState.userApp.currentUser.id : "");
            newState.userApp.unReadNotificationCount = 0;
            newState.userApp.currentUser = {};
            newState.userApp.isLogin = false;
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

        default:
            reduxBookingDHY.apply(newState, action);
            reduxEhealthDHY.apply(newState, action);
            return newState;
    }
    return state;
}

export default reducer;