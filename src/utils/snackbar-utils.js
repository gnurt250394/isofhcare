import _Snackbar from 'react-native-snackbar';

module.exports = {
    showShort(message, title, action) {
        this.show(message, title, action, _Snackbar.LENGTH_SHORT);
    },
    showLong(message, title, action) {
        this.show(message, title, action, _Snackbar.LENGTH_LONG);
    },
    showIndefinite(message, title, action) {
        this.show(message, title, action, _Snackbar.LENGTH_INDEFINITE);
    },
    show(message, title, action, duration) {
        if (duration != 0 && !duration)
            duration = _Snackbar.LENGTH_SHORT;
        if (!title)
            _Snackbar.show({
                title: message,
                duration: _Snackbar.LENGTH_SHORT
            });
        else {
            _Snackbar.show({
                title: message,
                duration: _Snackbar.LENGTH_SHORT,
                action: {
                    title: title,
                    color: 'green',
                    onPress: () => {
                        if (action)
                            action();
                    },
                },
            });
        }

    }
}
