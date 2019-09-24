// import { Toast } from 'native-base';
import { showMessage, hideMessage } from "react-native-flash-message";
module.exports = {
    showShort(message, type) {
        this.show(message, type, 3000);
    },
    showLong(message, type) {
        this.show(message, type, 6000);
    },
    show(message, type, duration) {
        if (duration != 0 && !duration)
            duration = 3000;
        let _type = "info";
        switch (type) {
            case "warning":
            case "info":
            case "success":
            case "danger":
                _type = type;
                break;
        }
        this.showWithTitle("iSofHcare", message, _type, duration);

        // Toast.show({
        //     text: message,
        //     duration: 3000,
        //     type: _type
        // });
    },
    showWithTitle(message, description, type, duration) {
        showMessage({
            message,
            description,
            type,
            duration
        })
    }
}
