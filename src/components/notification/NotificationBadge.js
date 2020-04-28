import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import redux from '@redux-store'
import firebase from 'react-native-firebase';
import NavigationService from "@navigators/NavigationService";

class NotificationBadge extends Component {
    constructor(props) {
        super(props)
    }

    selectNoti = () => {
        if (this.props.userApp.isLogin) {
            NavigationService.navigate("notificationTab");
        } else {
            NavigationService.navigate("login");
        }
    }
    render() {
        if (this.props.touchable == false) {
            return (
                <View
                    style={styles.containerItem}
                >
                    <ScaleImage source={require("@images/new/homev2/ic_notification_menu.png")} width={22} style={{ tintColor: this.props.tintColor }} />
                    {
                        this.props.userApp.isLogin && (this.props.userApp.unReadNotificationCount || 0) ?
                            <Text numberOfLines={1} style={styles.txtNotiActive}>{(this.props.userApp.unReadNotificationCount || 0) > 99 ? "99+" : this.props.userApp.unReadNotificationCount}</Text>
                            : null
                    }
                </View>
            );
        }
        else
            return (
                <TouchableOpacity
                    style={styles.containerItem}
                    onPress={this.selectNoti}
                >
                    <ScaleImage source={require("@images/new/homev2/ic_notification_menu.png")} width={22} style={{ tintColor: this.props.tintColor }} />
                    {
                        this.props.userApp.isLogin && (this.props.userApp.unReadNotificationCount || 0) ?
                            <Text numberOfLines={1} style={styles.txtNotiActive}>{(this.props.userApp.unReadNotificationCount || 0) > 99 ? "99+" : this.props.userApp.unReadNotificationCount}</Text>
                            : null
                    }
                </TouchableOpacity>
            );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(NotificationBadge);

const styles = StyleSheet.create({
    txtNotiActive: {
        overflow: 'hidden',
        position: 'absolute',
        right: 11,
        top: 12,
        backgroundColor: '#ff8f1f',
        borderRadius: 6,
        color: '#FFF',
        fontSize: 10,
        paddingHorizontal: 3,
        textAlign: 'center'
    },
    containerItem: {
        padding: 10,
        paddingRight: 15,
        position: 'relative'
    },
})