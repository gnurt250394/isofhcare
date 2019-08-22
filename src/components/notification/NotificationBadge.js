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
        if (this.props.touchable == false) {
            return (
                <View
                    style={{ padding: 10, paddingRight: 15, position: 'relative' }}
                >
                    <ScaleImage source={require("@images/new/bell_news.png")} width={22} style={{ tintColor: this.props.tintColor }} />
                    {
                        this.props.userApp.isLogin && (this.props.userApp.unReadNotificationCount || 0) ?
                            <Text numberOfLines={1} style={{ overflow: 'hidden', position: 'absolute', right: 11, top: 12, backgroundColor: '#ff8f1f', borderRadius: 6, color: '#FFF', fontSize: 10, paddingHorizontal: 3, textAlign: 'center' }}>{(this.props.userApp.unReadNotificationCount || 0) > 99 ? "99+" : this.props.userApp.unReadNotificationCount}</Text>
                            : null
                    }
                </View>
            );
        }
        else
            return (
                <TouchableOpacity
                    style={{ padding: 10, paddingRight: 15, position: 'relative' }}
                    onPress={() => {
                        if (this.props.userApp.isLogin) {
                            this.props.navigation.navigate("notificationTab");
                        } else {
                            this.props.navigation.navigate("login", {
                                nextScreen: { screen: "notificationTab", param: {} }
                            });
                        }
                    }}
                >
                    <ScaleImage source={require("@images/new/bell_news.png")} width={22} style={{ tintColor: this.props.tintColor }} />
                    {
                        this.props.userApp.isLogin && (this.props.userApp.unReadNotificationCount || 0) ?
                            <Text numberOfLines={1} style={{ overflow: 'hidden', position: 'absolute', right: 11, top: 12, backgroundColor: '#ff8f1f', borderRadius: 6, color: '#FFF', fontSize: 10, paddingHorizontal: 3, textAlign: 'center' }}>{(this.props.userApp.unReadNotificationCount || 0) > 99 ? "99+" : this.props.userApp.unReadNotificationCount}</Text>
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