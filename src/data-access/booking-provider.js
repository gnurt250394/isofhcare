import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
module.exports = {
    getListBooking(userId, callback) {
        client.requestApi("get", constants.api.booking.get_list_booking + "/" + userId, {}, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}