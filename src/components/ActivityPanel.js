import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import { Text, StatusBar, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import constants from '@resources/strings'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Activity from 'mainam-react-native-activity-panel';
import ActionBar from '@components/Actionbar';

import {
    Platform,
    StyleSheet,
    Image,
    View
} from 'react-native';

import ic_back from '@images/ic_back.png';



export default class ActivityPanel extends Component {
    constructor(props) {
        super(props);
        let paddingTop = Platform.select({
            ios: isIphoneX() ? 40 : 32,
            android: 0
        });
        if (this.props.paddingTop >= 0) {
            paddingTop = this.props.paddingTop
        }
        this.state = {
            paddingTop: paddingTop
        }
    }
    backPress() {
        Actions.pop();
    }
    getActionbar() {
        return (<ActionBar actionbarTextColor={[{ color: constants.colors.actionbar_title_color }, this.props.actionbarTextColor]} backButtonClick={() => this.backPress()} {...this.props} actionbarStyle={[{ paddingTop: this.state.paddingTop, backgroundColor: constants.colors.actionbar_color }, this.props.actionbarStyle]} />);
    }
    render() {
        return (
            <Activity {...this.props} actionbar={this.getActionbar.bind(this)} paddingTop={this.state.paddingTop} translucent={true} statusBarbackgroundColor="#AAA">
                {this.props.children}
            </Activity>
        );
    }
}