import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View } from 'react-native';
import { connect } from 'react-redux';

class LoginScreen extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Đăng nhập"  hideActionbar={true} showFullScreen={true}>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LoginScreen);