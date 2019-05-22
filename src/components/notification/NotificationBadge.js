import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import redux from '@redux-store'
import firebase from 'react-native-firebase';

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
                        <Text numberOfLines={1} style={{ overflow: 'hidden', position: 'absolute', right: 10, top: 4, backgroundColor: 'red', borderRadius: 6, color: '#FFF', fontSize: 10, paddingHorizontal: 3, textAlign: 'center' }}>{(this.props.userApp.unReadNotificationCount || 0) > 99 ? "99+" : this.props.userApp.unReadNotificationCount}</Text>
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