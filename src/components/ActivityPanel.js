import React, { Component } from 'react';
import { Text, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import constants from '@resources/strings'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Activity from 'mainam-react-native-activity-panel';
import ActionBar from '@components/Actionbar';
import { connect } from 'react-redux';
import {
    Platform,
    StyleSheet,
    Image,
    View
} from 'react-native';


class ActivityPanel extends Component {
    constructor(props) {
        super(props);
        // let paddingTop = Platform.select({
        //     ios: isIphoneX() ? 40 : 32,
        //     android: 0
        // });
        let paddingTop = 0;
        if (this.props.paddingTop >= 0) {
            paddingTop = this.props.paddingTop
        }
        this.state = {
            paddingTop: paddingTop
        }
    }
    backPress() {
        if (this.props.navigation)
            this.props.navigation.pop();
    }

    msgPress() {
        if (this.props.navigation)
            this.props.navigation.navigate("groupChat")
    }

    getActionbar() {
        return (
            <ActionBar
                actionbarTextColor={[{ color: constants.colors.actionbar_title_color }, this.props.actionbarTextColor]}
                backButtonClick={() => this.backPress()}
                showMessengerClicked={() => this.msgPress()}
                {...this.props}
                actionbarStyle={[{ paddingTop: this.state.paddingTop, backgroundColor: constants.colors.actionbar_color }, this.props.actionbarStyle]}
            />
        );
    }

    getLoadingView() {
        return (
            <View style={{
                position: "absolute",
                backgroundColor: "#bfeaff94",
                flex: 1,
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: "center"
            }}
            >
                <ActivityIndicator size={'large'} color={'blue'} />
            </View>
        );
    }

    render() {
        return (
            <Activity
                {...this.props}
                actionbar={this.props.actionbar ? this.props.actionbar : this.getActionbar.bind(this)}
                loadingView={this.getLoadingView()}
                paddingTop={this.state.paddingTop}
                // translucent={true}
            >
                {/* {this.props.children} */}
            </Activity>
        );
    }
}
function mapStateToProps(state) {
    return {
        navigation: state.navigation
    }
}
export default connect(mapStateToProps, null, null, { withRef: true })(ActivityPanel);