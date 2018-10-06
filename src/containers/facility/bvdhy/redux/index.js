import dhyCommand from '@dhy/strings';
module.exports = {
    apply(newState, action) {
        switch (action.type) {
            case dhyCommand.action.action_select_department:
                if (!newState.dhyBooking) {
                    newState.dhyBooking = {};
                }
                newState.dhyBooking.currentDepartment = action.value;
                return newState;
            case dhyCommand.action.action_select_booking_specialist:
                newState.dhyBooking.specialist = action.value;
                return newState;
            case dhyCommand.action.action_select_booking_specialist2:
                newState.dhyBooking.specialist2 = action.value;
                return newState;
            case dhyCommand.action.action_select_booking_date:
                newState.dhyBooking.date = action.value;
                return newState;
            case dhyCommand.action.action_select_booking_doctor:
                newState.dhyBooking.doctor = action.value;
                return newState;
            case dhyCommand.action.action_select_booking_time:
                newState.dhyBooking.time = action.value;
                return newState;
            case dhyCommand.action.action_select_schedule:
                newState.dhyBooking.schedule = action.value;
                return newState;
            case dhyCommand.action.action_set_pending_booking:
                if (newState.dhyBooking) {
                    newState.dhyBooking.havePendingBooking = action.value;
                }
                return newState;
            case dhyCommand.action.action_init_booking:
                if (!newState.dhyBooking) {
                    newState.dhyBooking = {};
                }
                let currentDepartment2 = newState.dhyBooking.currentDepartment;
                newState.dhyBooking = {};
                newState.dhyBooking.currentDepartment = currentDepartment2;
                return newState;
        }
    }
}
