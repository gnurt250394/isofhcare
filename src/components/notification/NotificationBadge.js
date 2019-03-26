import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

class NotificationBadge extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TouchableOpacity
                style={{ padding: 10, paddingRight: 15, position: 'relative' }}
                onPress={() => {
                    if (this.props.userApp.isLogin) {
                        this.props.navigation.navigate("notification");
                    } else {
                        this.props.navigation.navigate("login", {
                            nextScreen: { screen: "notification", param: {} }
                        });
                    }
                }}
            >
                <ScaleImage source={require("@images/new/bell.png")} width={20} />
                {
                    this.props.userApp.isLogin && (this.props.userApp.unReadNotificationCount || 0) ?
                        <Text style={{ overflow: 'hidden', position: 'absolute', right: 10, top: 4, backgroundColor: 'red', borderRadius: 7, color: '#FFF', paddingLeft: 4, paddingRight: 4, fontSize: 11 }}>{(this.props.userApp.unReadNotificationCount || 0) > 9 ? "9+" : this.props.userApp.unReadNotificationCount}</Text>
                        : null
                }
            </TouchableOpacity>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(NotificationBadge);