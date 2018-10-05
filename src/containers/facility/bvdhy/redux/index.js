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
        }
    }
}
