import constants from '@ehealth/daihocy/resources/strings';
module.exports = {
    apply(newState, action) {
        switch (action.type) {
            case constants.action.action_select_hospital:
                newState.hospital = {
                    id: action.value
                }
                return newState;
            case constants.action.action_view_medical_test_result:
                newState.booking.medicalTestResult = action.value;
                return newState;

        }
    }
}