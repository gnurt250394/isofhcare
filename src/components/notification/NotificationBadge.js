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
                style={{ padding: 10 }}
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