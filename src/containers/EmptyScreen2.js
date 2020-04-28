import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View } from 'react-native';
import { connect } from 'react-redux';

class LoginScreen extends Component {
    constructor(props) {
        super(props)
        let title = this.props.navigation.getParam("title", null);
        this.state = { title }
    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={this.state.title}>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(LoginScreen);