import { Toast } from 'native-base';
module.exports = {
    showShort(message, title, action) {
        this.show(message, title, action, 3000);
    },
    showLong(message, title, type) {
        this.show(message, title, action, 6000);
    },
    show(message, title, type, duration) {
        if (duration != 0 && !duration)
            duration = 3000;
        let _type = "success";
        switch (type) {
            case "warning":
                _type = type;
                break;
            case "success":
                _type = type;
                break;
            case "danger":
                _type = type;
                break;
        }

        Toast.show({
            text: message,
            duration: 3000,
            buttonText: title,
            type: _type
        });
    }
}
